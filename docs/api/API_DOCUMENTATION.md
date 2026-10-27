# PairUp AI — API & WebSocket Reference

All REST endpoints are versioned under `/api/v1`. Interactive Swagger documentation is accessible at `http://localhost:4000/api/docs`.

---

## 1. Authentication (`/api/v1/auth`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/signup` | Register new user with strict 18+ adult age validation |
| `POST` | `/auth/login` | Authenticate with email or mobile phone |
| `POST` | `/auth/otp/request` | Request verification OTP (SMS/Email) |
| `POST` | `/auth/otp/verify` | Verify 6-digit OTP code |
| `POST` | `/auth/refresh` | Rotate and issue new access token |
| `GET`  | `/auth/me` | Fetch active user status and profile |
| `POST` | `/auth/logout` | Terminate session |

---

## 2. Profiles (`/api/v1/profiles`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/profiles/me` | Current user complete profile and completeness score |
| `GET` | `/profiles/:id` | Public sanitized profile (coordinates stripped) |
| `PATCH` | `/profiles/me` | Update bio, prompts, intentions, city, details |
| `POST` | `/profiles/me/photos` | Upload and add photo |
| `DELETE` | `/profiles/me/photos/:id` | Remove photo |
| `GET` | `/profiles/interests` | All active interest tags and categories |

---

## 3. Location & Nearby (`/api/v1/location`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/location/update` | Update real GPS coordinates |
| `POST` | `/location/city` | Manual city selection fallback |
| `GET`  | `/location/nearby` | Discover nearby profiles within radius (1km - 50km) |
| `POST` | `/location/pause` | Pause location sharing |

---

## 4. Discovery & Swiping (`/api/v1/discovery`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET`  | `/discovery/feed` | Card deck for gesture swiping |
| `POST` | `/discovery/swipe` | Swipe decision (`LIKE`, `PASS`, `SUPER_LIKE`) |
| `POST` | `/discovery/rewind` | Undo previous swipe decision |
| `GET`  | `/discovery/matches` | List all mutual matches with last conversation snippet |
| `DELETE` | `/discovery/matches/:id` | Unmatch user |

---

## 5. Real-Time Chat (`/api/v1/chat`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET`  | `/chat/conversations` | All active conversations |
| `GET`  | `/chat/conversations/:id/messages` | Message history |
| `POST` | `/chat/conversations/:id/messages` | Send message (text, voice note, photo) |
| `POST` | `/chat/conversations/:id/messages/:msgId/reactions` | Toggle emoji reaction |

---

## 6. Voice Rooms & Events (`/api/v1/rooms`, `/api/v1/events`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET`  | `/rooms` | List active live audio rooms |
| `POST` | `/rooms` | Start a new live audio room |
| `POST` | `/rooms/:id/join` | Join audio stage as listener |
| `POST` | `/rooms/:id/raise-hand` | Raise hand to request speaker privileges |
| `GET`  | `/events` | Browse discovery events |
| `POST` | `/events/:id/register` | RSVP with atomic capacity lock |

---

## 7. Admin & Moderation (`/api/v1/admin`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET`  | `/admin/metrics` | System telemetry (registered users, matches, revenue) |
| `GET`  | `/admin/reports` | Moderation queue |
| `POST` | `/admin/reports/:id/resolve` | Take action (`WARNING`, `SUSPENSION`, `BAN`) |
| `GET`  | `/admin/audit-logs` | Tamper-evident admin audit history |
