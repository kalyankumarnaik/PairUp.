# PairUp AI — Security & Privacy Policy Architecture

## 1. Regulatory & Legal Compliance

PairUp AI is architected in accordance with:
- **Digital Personal Data Protection (DPDP) Act, India**: Data minimization, purpose limitation, user consent records, right to erasure and grievance redressal.
- **Strict 18+ Age Screening**: Server-side birthdate validation ensures zero access for minors.
- **Information Technology Act (Intermediary Guidelines), 2021**: Fast response times (&lt;24h) for reported non-consensual content.

---

## 2. Geolocation Privacy & Anti-Triangulation

1. **No Raw Coordinate Exposure**: The database stores coordinates in a restricted table (`user_locations`). No API endpoint in the public discovery tier ever exposes exact `latitude` or `longitude`.
2. **Fuzzy Distance Rounding**: Proximity is reported as rounded approximations (e.g. `~3 km` or `~5 km`) rather than floating precision values.
3. **One-Tap Location Pause**: Users can pause location sharing at any time to freeze or hide their proximity footprint without losing match history.
4. **Manual City Fallback**: When GPS permission is denied by user preference or browser setting, manual city selection seamlessly takes over without blocking platform access.

---

## 3. Account Protection & Cryptography

- **Password Hashing**: BCrypt with 12 salt rounds.
- **Session Tokens**: JWT with short expiration (15 minutes) and cryptographically bound refresh tokens.
- **Input Sanitization**: Strict Zod validation schemas intercept every payload before business logic execution.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions (`SUPER_ADMIN`, `ADMIN`, `MODERATOR`, `USER`). Admin actions are recorded in immutable audit logs.
- **Content Moderation**: Automated heuristic scans for phone numbers, financial scams, or illicit language, with human review workflows.
