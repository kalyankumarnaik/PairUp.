# PairUp AI — Operations & Maintenance Runbook

## 1. Quickstart Development Mode

```bash
# 1. Install dependencies
pnpm install

# 2. Run backend and web client in parallel
pnpm dev

# Web client runs on: http://localhost:3000
# Backend API runs on: http://localhost:4000/api/v1
# Interactive Swagger docs: http://localhost:4000/api/docs
```

---

## 2. Testing Execution

```bash
# Run unit & integration test suites
pnpm test

# Run code line count analysis
pnpm measure-loc
```

---

## 3. Pre-Seeded Demonstration Accounts

| Role | Email / Phone | Password | City | Description |
| :--- | :--- | :--- | :--- | :--- |
| **User (Woman)** | `ananya.verma@example.com` | `Password123!` | Mumbai | Urban Architect, Art & Cafes |
| **User (Man)** | `aarav.sharma@example.com` | `Password123!` | Mumbai | Fintech Designer, Hiking & Badminton |
| **User (Woman)** | `riya.sen@example.com` | `Password123!` | Bengaluru | Software Engineer, Indie Music & Board Games |
| **Super Admin** | `admin@pairup.ai` | `AdminSecurePairUp2026!` | - | Access to Moderation Queue & Platform Metrics |

---

## 4. Production Deployment with Docker Compose

```bash
cd infrastructure/docker
docker-compose up -d --build
```
This boots up:
- PostgreSQL with PostGIS on port `5432`
- Redis on port `6379`
- PairUp API Gateway on port `4000`
- PairUp Web Client (Nginx) on port `3000`
- Background Worker Queue Daemon
