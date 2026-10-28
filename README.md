<<<<<<< HEAD
# PairUp AI — Full-Stack Dating, Friendship & Social Discovery Platform

[![CI/CD](https://github.com/pairup-ai/pairup/actions/workflows/ci.yml/badge.svg)](https://github.com/pairup-ai/pairup/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.4-red.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **PairUp AI** is a modern, location-aware social discovery platform where adults can find romantic partners, make genuine friends, hang out in live audio rooms, and join local activities. Tailored for India with verified profiles, PostGIS spatial queries, and privacy-preserving distance masking.

---

## 🎨 Visual Brand Identity & Tokens

The platform features a distinctive, playful, and premium color system:

- 💖 **Passion Coral** (`#FF4F81`) — Romantic actions, swipe likes, heart pulses
- ⚡ **Electric Violet** (`#7C3AED`) — Primary brand action, badges, navigation
- 🌅 **Sunset Peach** (`#FF8A5B`) — Friendship highlights, warm tags
- 🪻 **Dream Lavender** (`#E9D5FF`) — Card accents, pill tags, soft surfaces
- ☁️ **Cloud White** (`#F8F7FF`) — Clean canvas and page backgrounds
- 🖋️ **Midnight Ink** (`#242039`) — High contrast typography, dark surfaces
- 🌿 **Success Green** (`#16845B`) — Verification badges, online presence

---

## 🚀 Key Features

### 1. Adult-Only Registration & Authentication (18+)
- Strict server-side age verification (rejects &lt;18)
- Email or mobile number sign-up
- Dev-mode SMS/Email OTP simulation (`123456`)
- JWT access tokens (15m) & refresh token rotation (7d)

### 2. Gesture-Driven Swipe & Matching Engine
- Tinder-style interactive draggable card stack with spring physics (Framer Motion)
- Swipe Right to Like 💖, Swipe Left to Pass ✕, Super Like ★, and Rewind ↺
- Real transactional mutual match detection
- Confetti celebration modal with direct transition to messaging

### 3. Proximity Radar & Geospatial Masking
- PostgreSQL & PostGIS spatial distance calculation (with Haversine fallback)
- Radius filtering: 5 km, 10 km, 25 km, 50 km
- **Privacy First**: Raw coordinates are **never returned** to clients; only masked approximate distance (`~3.5 km`) is shown
- One-tap location pause & manual city selection fallback

### 4. Real-Time Chat & Media Messaging
- WebSocket gateway (Socket.IO) with room-level authorization
- Persistent message storage in database
- Voice note player simulation with duration and waveform
- Emoji reaction picker (`❤️`, `😂`, `🔥`, `👏`, `😍`)
- Online presence and typing indicators

### 5. Live Audio Rooms (Inspired by FRND)
- Drop-in community voice rooms (Music, Trekking, Tech Founders, Chai & Chill)
- Speaker stage with host controls, listener seats, and raise-hand interaction

### 6. Local Discovery Events
- Community mixers, acoustic jams, and coffee tastings
- Atomic RSVP registration with hard capacity limits

### 7. AI-Assisted Connections
- Explainable compatibility scores based on shared interests and lifestyle
- Contextual conversation icebreakers generated from bio prompts
- AI bio improvement suggestions

### 8. Protected Admin Dashboard & Moderation
- Super Admin, Moderator, and Support RBAC
- Real-time dashboard telemetry (users, DAU, MAU, matches, revenue, health)
- Moderation report queue with disciplinary actions (`WARNING`, `SUSPENSION`, `BAN`)
- Tamper-evident administrative audit log trail

---

## 🏗️ Repository Architecture

```
PairUp/
├── apps/
│   ├── web/          # React 18 + Vite + Tailwind CSS + Framer Motion
│   ├── mobile/       # React Native Expo + Expo Router + Reanimated
│   ├── api/          # NestJS + REST (/api/v1) + Socket.IO + Swagger
│   └── worker/       # BullMQ background job queue daemon
├── packages/
│   ├── contracts/    # API routes, WebSocket events, error codes
│   ├── api-client/   # Typed fetch client with token handling
│   ├── design-tokens/# Brand colors, typography, emojis, animations
│   ├── domain-types/ # TypeScript models, enums, interfaces
│   ├── validation/   # Zod validation schemas with age checks
│   ├── config/       # Shared Tailwind preset & TSConfigs
│   └── test-utils/   # Mock factories & Haversine calculator
├── database/
│   ├── prisma/       # 40+ normalized tables, PostGIS compatibility
│   └── seeds/        # Verified Indian metro profiles & demo events
├── infrastructure/
│   ├── docker/       # Docker Compose, Dockerfiles
│   └── deployment/   # Nginx proxy configuration
├── docs/             # Architecture, API specs, Security & Runbooks
└── scripts/          # Authored LOC measurement script
```

---

## ⚡ Quickstart

### Prerequisites
- Node.js >= 20.0.0
- pnpm >= 9.0.0

### Installation & Run

```bash
# 1. Install dependencies across monorepo
pnpm install

# 2. Run backend API and Web client concurrently
pnpm dev

# Web client runs on: http://localhost:3000
# Backend API runs on: http://localhost:4000/api/v1
# Interactive Swagger docs: http://localhost:4000/api/docs
```

### Pre-Seeded Demonstration Accounts

| Role | Identifier | Password | Description |
| :--- | :--- | :--- | :--- |
| **User (Woman)** | `ananya.verma@example.com` | `Password123!` | Urban Architect, Mumbai |
| **User (Man)** | `aarav.sharma@example.com` | `Password123!` | Product Designer, Mumbai |
| **Super Admin** | `admin@pairup.ai` | `AdminSecurePairUp2026!` | Access to Admin & Moderation |

---

## 🧪 Testing

```bash
# Run Vitest test suites
pnpm test

# Measure authored source lines of code
pnpm measure-loc
```

---

## 📄 License

MIT © 2026 PairUp AI Technologies. Strictly 18+.
=======
# PairUp — Core Backend & Platform Architecture

> **AI-Powered Dating and Relationship Platform**  
> Developed by a four-member engineering team.  
> **Platform Technical Lead (Member 1):** Platform architecture, core backend, authentication, user profiles, dating preferences, discovery swiping, mutual matching, safety & integration guidelines.

---

## 1. Technologies & Architecture

- **Framework:** [NestJS](https://nestjs.com/) (TypeScript, Node.js 20+)
- **Database & ORM:** [PostgreSQL 16](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **In-Memory Store:** [Redis 7](https://redis.io/) (Token blacklisting, session tracking, throttler cache)
- **API Standard:** RESTful endpoints mounted under `/api/v1`
- **Documentation:** OpenAPI / Swagger UI at `http://localhost:3000/api/docs`
- **Testing:** [Jest](https://jestjs.io/) & [Supertest](https://github.com/ladjs/supertest) (100% test pass rate across unit and e2e suites)
- **Containerization:** Multi-stage `Dockerfile` and `docker-compose.yml`

---

## 2. Team Member Division & Owned Modules

| Team Member | Domain & Ownership | Interfaces Provided |
| :--- | :--- | :--- |
| **Member 1 (You / Lead)** | Platform Architecture, Core Backend, Auth, Profiles, Discovery, Matching, Database & Safety | Core APIs, DB Migrations, Authorization Guards, Team Contracts |
| **Member 2** | Frontend Client Applications (Web & Mobile UI) | Consumes REST APIs via [Member 2 Contract](docs/API_CONTRACTS_MEMBER2.md) |
| **Member 3** | Real-time Messaging, WebSockets & Audio/Video Calling | Consumes Auth & Matching via [Member 3 Contract](docs/MEMBER3_CHAT_INTEGRATION.md) |
| **Member 4** | AI Recommendation Engine & Content Moderation | Plugs into Discovery & Moderation via [Member 4 Contract](docs/MEMBER4_AI_MODERATION_INTEGRATION.md) |

---

## 3. Quick Start & Local Setup

### Prerequisites
- Node.js (v20+ or v24+)
- npm (v10+)
- Docker & Docker Compose (optional for local containerized environment)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Step 3: Start PostgreSQL & Redis via Docker Compose
```bash
docker compose up -d postgres redis
```

### Step 4: Run Database Migrations & Seed Mock Data
```bash
# Generate Prisma Client types
npx prisma generate

# Apply PostgreSQL database migrations
npx prisma migrate deploy

# Seed database with realistic test profiles, interests, likes, and mutual matches
npm run prisma:seed
```

### Step 5: Start Development Server
```bash
npm run start:dev
```
The API is available at: `http://localhost:3000/api/v1`  
Interactive Swagger documentation: `http://localhost:3000/api/docs`

---

## 4. Testing Suite

The codebase comes with a comprehensive, production-grade test suite covering unit logic and end-to-end integration:

```bash
# Run unit test suite
npm test

# Run End-to-End (E2E) integration tests
npm run test:e2e

# Run test coverage report
npm run test:cov
```

### Verified Test Scenarios
- Registration and login failures (invalid passwords, non-existent users)
- Expired and revoked sessions with Refresh Token Rotation (RTR)
- Token theft reuse detection and cascade revocation
- Unauthorized profile access and age restrictions (18+ enforcement)
- Preference filtering (distance, age, gender, relationship intent)
- Like/pass swiping and duplicate-action prevention
- Mutual match detection and canonical database ordering (`userOneId < userTwoId`)
- Blocked-user exclusion and instant match dissolution
- Unmatching and soft account deletion
- REST API response envelope and error validation formatting

---

## 5. Architectural Highlights

1. **Transaction-Safe Mutual Matching:** Guaranteed race-condition prevention using canonical lexicographical ordering (`userOneId < userTwoId`) with database unique constraints.
2. **Refresh Token Rotation (RTR):** Opaque cryptographically random refresh tokens stored as SHA-256 hashes in `user_sessions`. If a previously rotated token is presented, all active sessions for the user family are immediately revoked.
3. **Anti-Enumeration Security:** Registration and password recovery flows return generic privacy-preserving responses to mitigate user enumeration.
4. **Separation of Concerns:** Public profile discovery projections completely strip private account data (email, phone, provider, timestamps).
5. **Pluggable Architecture:** Pre-built interfaces allow Member 3 (WebSockets) and Member 4 (AI Recommendations) to plug into the core platform without breaking schema boundaries.

---

## 6. Project Documentation Index

- [Architecture & System Design](docs/ARCHITECTURE.md)
- [Member 2 Frontend API Contracts](docs/API_CONTRACTS_MEMBER2.md)
- [Member 3 Real-time Chat Integration](docs/MEMBER3_CHAT_INTEGRATION.md)
- [Member 4 AI Recommendation & Moderation Integration](docs/MEMBER4_AI_MODERATION_INTEGRATION.md)
>>>>>>> 37fe79130ca3812bf9e2ca328140332eba3fcd6b
