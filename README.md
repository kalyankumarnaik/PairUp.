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
