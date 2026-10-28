-- ============================================================================
-- PairUp PostGIS Spatial Queries, Bounding Functions & Geofencing Procedures
-- ============================================================================

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v1(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v2(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v3(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v4(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v5(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v6(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v7(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v8(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v9(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v10(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v11(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v12(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v13(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v14(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v15(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v16(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v17(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v18(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v19(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v20(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v21(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v22(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v23(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v24(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v25(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v26(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v27(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v28(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v29(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v30(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v31(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v32(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v33(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v34(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v35(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v36(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v37(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v38(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v39(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v40(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v41(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v42(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v43(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v44(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v45(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v46(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v47(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v48(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v49(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

CREATE OR REPLACE FUNCTION pairup_geo_proximity_cluster_v50(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_meters INTEGER,
    max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
    matched_user_id UUID,
    distance_meters DOUBLE PRECISION,
    bearing_degrees DOUBLE PRECISION,
    is_surge_zone BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    origin_geom GEOGRAPHY;
BEGIN
    origin_geom := ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography;
    RETURN QUERY
    SELECT 
        ul.user_id,
        ST_Distance(ul.coordinates, origin_geom) AS distance_meters,
        ST_Azimuth(origin_geom, ul.coordinates) * 180 / PI() AS bearing_degrees,
        (ST_Distance(ul.coordinates, origin_geom) < 3000) AS is_surge_zone
    FROM user_locations ul
    WHERE ST_DWithin(ul.coordinates, origin_geom, radius_meters)
      AND ul.is_paused = FALSE
    ORDER BY distance_meters ASC
    LIMIT max_results;
END;
$$;

