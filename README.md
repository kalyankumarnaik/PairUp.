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
