# PairUp AI — Architecture & Engineering Specification

## 1. System Overview

**PairUp AI** is a location-aware dating, friendship, and social discovery platform built as a high-performance TypeScript monorepo. It harmonizes romantic matchmaking with platonic interest-based discovery, live drop-in voice rooms (inspired by FRND), local community events, and real-time messaging.

```
                      ┌─────────────────────────────────────────┐
                      │            PairUp Clients               │
                      │  • Web (React 18, Vite, Tailwind, Motion)│
                      │  • Mobile (React Native, Expo, Reanimated)
                      └────────────────────┬────────────────────┘
                                           │
                                    REST & WebSockets
                                           │
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │           NestJS API Gateway            │
                      │  Prefix: /api/v1  •  Swagger: /api/docs │
                      │  Auth Guard • RBAC • Coordinate Masking │
                      └───────┬─────────────────────────┬───────┘
                              │                         │
                 PostgreSQL + PostGIS             Redis & BullMQ
            (Spatial Proximity & ACID State) (Presence, Sockets, Jobs)
```

---

## 2. Monorepo Organization

- **`apps/web`**: Responsive React web client featuring gesture-based card swiping, spring physics, real-time messaging, audio room stages, and user/admin dashboards.
- **`apps/mobile`**: React Native / Expo application sharing design tokens, validation rules, and API contracts.
- **`apps/api`**: NestJS core backend providing REST endpoints, OpenAPI docs, and Socket.IO gateways.
- **`apps/worker`**: BullMQ background queue daemon for OTP delivery, notification push, and moderation scans.
- **`packages/design-tokens`**: Shared color palettes, typography, spacing, emoji categorizations, and animation constants.
- **`packages/domain-types`**: TypeScript models, enums, DTOs, and event payloads.
- **`packages/validation`**: Zod schemas for input validation, adult age verification (18+), and form guards.
- **`packages/contracts`**: Typed route constants, WebSocket events, and error codes.
- **`packages/api-client`**: Isomorphic fetch client and WebSocket event client.
- **`packages/test-utils`**: Mock factories, geo-spatial calculators, and testing fixtures.
- **`database`**: Enterprise Prisma schema with 40+ normalized models and comprehensive Indian seed datasets.

---

## 3. Geospatial Proximity & Privacy Protection

### PostGIS Distance Queries
User coordinates are indexed with PostGIS geography points (`ST_Point(lon, lat)`). Nearby discovery queries utilize `ST_DWithin` with spatial index scans (`GIST`).

### Privacy-Preserving Coordinate Masking
**Security Principle**: Raw latitude and longitude coordinates are **never returned** in public profile responses or API discovery feeds.
- The backend computes the geometric distance (`distanceKm`).
- The response returns only generalized approximate distance (e.g. `~3.5 km away`) and city/area name.
- Users can pause location sharing at any time to disappear from the nearby radar while retaining chat access.

---

## 4. Real-Time Chat & Voice Architecture

- **Authenticated WebSockets**: Connections require JWT verification during the handshake.
- **Room Isolation**: Socket rooms are isolated per conversation (`conv_{conversationId}`) with strict participant membership verification.
- **Voice Communities**: Employs WebRTC SFU infrastructure (LiveKit compatible) with roles: `HOST`, `MODERATOR`, `SPEAKER`, `LISTENER`.
