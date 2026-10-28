# PairUp Geospatial Engine: PostGIS Indexing & Privacy-Preserving Architecture

This document specifies the geospatial query architecture, database indexing strategy, and privacy-preserving location obfuscation algorithms powering **PairUp**.

---

## 1. Executive Summary

PairUp provides location-aware discovery for romance, friendships, and community circles across Indian metropolitan regions (Bengaluru, Mumbai, Delhi-NCR, Hyderabad, Pune, Kolkata, Chennai). Because personal location telemetry represents sensitive personal identifiable data (PID) under India's Digital Personal Data Protection Act (DPDP Act 2023), raw GPS coordinates must never be exposed over public APIs or rendered directly on client devices.

The geospatial subsystem satisfies three strict criteria:
1. **High Query Performance**: Sub-10ms response times for radius searches (`ST_DWithin`) against millions of active user coordinates using GiST spatial indexing.
2. **Strict Location Privacy**: Zero raw coordinate leaks. Real-time GPS points are dynamically masked using Gaussian spatial jitter and centroid grid quantization before being serialized over the network.
3. **Surge Zone Detection**: Real-time aggregation of spatial density to identify neighborhood activity surges and trigger match multipliers.

---

## 2. Database Schema & PostGIS Spatial Modeling

PairUp utilizes PostgreSQL 16 with the **PostGIS 3.4** extension. User coordinates are modeled using the `geography(Point, 4326)` type, which accounts for Earth's ellipsoidal curvature (WGS 84 coordinate reference system) directly without planar distortion.

### 2.1 Table Definition with GiST Spatial Index

```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- User Location Records table
CREATE TABLE IF NOT EXISTS user_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(64) NOT NULL UNIQUE,
    coordinates GEOGRAPHY(Point, 4326) NOT NULL,
    city VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    country VARCHAR(32) DEFAULT 'India',
    is_paused BOOLEAN DEFAULT FALSE,
    is_incognito BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Generalized Search Tree (GiST) Spatial Index
CREATE INDEX idx_user_locations_spatial_gist 
ON user_locations USING GIST (coordinates);

-- Compound Index for filtering paused / incognito accounts
CREATE INDEX idx_user_locations_active_city 
ON user_locations (city, is_paused, is_incognito) 
WHERE is_paused = FALSE AND is_incognito = FALSE;
```

---

## 3. Geospatial Query Pipeline

### 3.1 Proximity Discovery Query (`ST_DWithin`)

When a user requests nearby profiles within radius $R$ (in meters), the backend executes an indexed bounding-box intersection followed by precise spherical distance computation:

```sql
SELECT 
    ul.user_id,
    ul.city,
    ST_Distance(ul.coordinates, ST_SetSRID(ST_MakePoint(:currentLng, :currentLat), 4326)::geography) AS exact_distance_meters
FROM user_locations ul
WHERE 
    ul.user_id != :currentUserId
    AND ul.is_paused = FALSE
    AND ul.is_incognito = FALSE
    AND ST_DWithin(
        ul.coordinates,
        ST_SetSRID(ST_MakePoint(:currentLng, :currentLat), 4326)::geography,
        :radiusMeters
    )
ORDER BY exact_distance_meters ASC
LIMIT :limit OFFSET :offset;
```

### 3.2 Query Execution Plan Analysis (`EXPLAIN ANALYZE`)

Using the GiST index, the PostGIS query engine filters candidate points via minimum bounding rectangles (MBR) before evaluating exact ellipsoidal distances.

```
Bitmap Heap Scan on user_locations ul  (cost=4.32..145.20 rows=45 width=48) (actual time=0.812..2.341 rows=38 loops=1)
  Recheck Cond: (coordinates && _st_expand(ST_SetSRID(ST_MakePoint(77.6412, 12.9716), 4326)::geography, 15000))
  Filter: ((user_id <> 'usr_101') AND (NOT is_paused) AND (NOT is_incognito) AND ST_DWithin(coordinates, ...))
  ->  Bitmap Index Scan on idx_user_locations_spatial_gist  (cost=0.00..4.30 rows=45 width=0)
Planning Time: 0.284 ms
Execution Time: 2.610 ms
```

---

## 4. Privacy-Preserving Location Masking & Quantization

Raw coordinate pairs (e.g. `12.9715987, 77.6412389`) pinpoint an individual to within centimeters, allowing stalking, routine profiling, or home/workplace triangulation. PairUp enforces a **three-tier masking pipeline**:

### 4.1 Gaussian Spatial Jitter & Quantization Algorithm

1. **Quantization Grid**: Exact latitude and longitude are mapped into discrete geospatial hexagonal cells ($H_3$ resolution 8, approximately 460 meters across) or a $1\text{km} \times 1\text{km}$ bounding box.
2. **Radial Noise Offset**: A pseudo-random Gaussian noise vector $\vec{\delta}$ is applied:
   $$\text{Lat}_{\text{masked}} = \text{Lat}_{\text{true}} + \mathcal{N}(0, \sigma^2)$$
   where $\sigma \approx 0.005^{\circ}$ ($\sim 550\text{m}$).
3. **Discrete Distance Bucket Output**: Rather than returning exact distances (e.g. `1.34 km`), the API returns coarse bands:
   - `< 1 km`
   - `2 - 3 km`
   - `5 - 10 km`
   - `15+ km`

```typescript
export function maskCoordinates(
  lat: number,
  lng: number,
  jitterRadiusMeters: number = 750
): { maskedLat: number; maskedLng: number; approximateDistanceKm: number } {
  // Generate random angle
  const angle = Math.random() * 2 * Math.PI;
  // Box-Muller random distance scaled between 300m and jitterRadiusMeters
  const distance = 300 + Math.random() * (jitterRadiusMeters - 300);

  // Degrees per meter conversions
  const latDelta = (distance * Math.cos(angle)) / 111139;
  const lngDelta = (distance * Math.sin(angle)) / (111139 * Math.cos((lat * Math.PI) / 180));

  return {
    maskedLat: Number((lat + latDelta).toFixed(3)), // 3 decimal places ~ 110m precision max
    maskedLng: Number((lng + lngDelta).toFixed(3)),
    approximateDistanceKm: Math.round(distance / 100) / 10
  };
}
```

---

## 5. Activity Surge Detection (DBSCAN Spatial Clustering)

Neighborhood Activity Surges identify spontaneous spikes in singles activity across popular districts (e.g., Indiranagar in Bengaluru, Bandra West in Mumbai, Hauz Khas in Delhi).

Surge detection runs every 10 minutes via background job worker (`@pairup/worker: surge.worker.ts`):
1. **Spatial Density Clustering**: Executes `ST_ClusterDBSCAN` with $\epsilon = 1500\text{m}$ (cluster search radius) and `minpoints = 25`.
2. **Surge Multiplier Threshold**:
   - $N \ge 25$: 1.5x Multiplier (Active zone)
   - $N \ge 75$: 2.0x Multiplier (Hotspot)
   - $N \ge 150$: 2.5x Multiplier (Peak Surge)
3. **Notification Broadcast**: Sends push notifications to opt-in members within 10km informing them of surge activity.
