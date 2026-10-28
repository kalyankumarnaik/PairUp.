# PairUp API Integration Guide — For Member 2 (Frontend Lead)

**Author:** Member 1 (Platform Technical Lead)  
**Target:** Web (React/Next.js/Vite) & Mobile (React Native/Flutter) Client Applications  
**Base URL:** `http://localhost:3000/api/v1`  
**Interactive Swagger UI:** `http://localhost:3000/api/docs`

---

## 1. Shared Response Envelope Standards

All responses from `/api/v1` are guaranteed to conform to the following formats:

### Success Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "limit": 20,
    "nextCursor": "b5a22d3e-9087-4318-874b-417c805eb5cb",
    "hasNextPage": true
  },
  "timestamp": "2026-10-27T05:30:00.000Z"
}
```

### Error Response Envelope
```json
{
  "success": false,
  "statusCode": 401,
  "error": "AUTH_INVALID_CREDENTIALS",
  "message": "Invalid email or password",
  "details": null,
  "path": "/api/v1/auth/login",
  "timestamp": "2026-10-27T05:30:00.000Z"
}
```

---

## 2. Authentication Workflow for Frontend

1. **Header Requirement:** For all protected endpoints, attach the access token:
   ```http
   Authorization: Bearer <accessToken>
   ```
2. **Access Token Lifespan:** 15 minutes.
3. **Refresh Token Lifespan:** 7 days.
4. **Token Refresh Strategy:**
   - When a 401 response is received, invoke `POST /api/v1/auth/refresh` with `{ "refreshToken": "<storedToken>" }`.
   - Update stored tokens.
   - Retry the failed request.

---

## 3. Endpoints Reference

### Authentication (`/api/v1/auth`)
| Method | Path | Description | Public |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new user account | Yes |
| `POST` | `/api/v1/auth/login` | Login with email and password | Yes |
| `POST` | `/api/v1/auth/refresh` | Rotate refresh token and get new access token | Yes |
| `POST` | `/api/v1/auth/logout` | Revoke session and blacklist bearer token | No |
| `POST` | `/api/v1/auth/verify-email` | Verify email with token | Yes |
| `POST` | `/api/v1/auth/forgot-password` | Request password reset email | Yes |
| `POST` | `/api/v1/auth/reset-password` | Reset password using reset token | Yes |
| `GET` | `/api/v1/auth/sessions` | List active sessions | No |
| `DELETE` | `/api/v1/auth/sessions/:sessionId` | Revoke a specific session | No |
| `DELETE` | `/api/v1/auth/sessions` | Revoke all other active sessions | No |

### Profiles & Preferences (`/api/v1/profiles`, `/api/v1/preferences`)
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/profiles/me` | Full private profile with completion score & checklist |
| `POST` | `/api/v1/profiles/me` | Initial profile onboarding (enforces 18+) |
| `PATCH` | `/api/v1/profiles/me` | Update bio, location, intent, habits, occupation |
| `GET` | `/api/v1/profiles/interests` | Get platform interests taxonomy |
| `PUT` | `/api/v1/profiles/me/interests` | Set user interest tags |
| `PUT` | `/api/v1/profiles/me/prompts` | Set conversation prompts & answers (max 3) |
| `POST` | `/api/v1/profiles/me/photos` | Upload photo to gallery (max 6) |
| `DELETE` | `/api/v1/profiles/me/photos/:photoId`| Remove photo from gallery |
| `PATCH` | `/api/v1/profiles/me/photos/order` | Reorder gallery display order |
| `PATCH` | `/api/v1/profiles/me/photos/:photoId/primary` | Designate primary avatar |
| `GET` | `/api/v1/profiles/:userId` | Public profile view (respects privacy settings) |
| `GET` | `/api/v1/preferences` | Get dating search preferences |
| `PATCH` | `/api/v1/preferences` | Update min/max age, distance radius, gender filters |
| `GET` | `/api/v1/preferences/privacy` | Get visibility settings (Incognito, show distance) |
| `PATCH` | `/api/v1/preferences/privacy` | Update privacy settings |

### Discovery & Matching (`/api/v1/discovery`, `/api/v1/matches`)
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/discovery` | Candidate feed ranked by compatibility |
| `POST` | `/api/v1/discovery/like` | Like or Superlike candidate. Returns `{ isMatch, matchId }` |
| `POST` | `/api/v1/discovery/pass` | Pass on candidate profile |
| `GET` | `/api/v1/matches` | List active mutual matches with cursor pagination |
| `GET` | `/api/v1/matches/:id` | Get match details and interaction timestamp |
| `DELETE` | `/api/v1/matches/:id` | Unmatch a user with reason |

### Safety & Moderation (`/api/v1/users`, `/api/v1/safety`)
| Method | Path | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/users/:id/block` | Block user (instantly terminates match & likes) |
| `DELETE` | `/api/v1/users/:id/block` | Unblock user |
| `GET` | `/api/v1/users/me/blocks` | List blocked users |
| `POST` | `/api/v1/safety/reports` | Submit safety/conduct report |

---

## 4. Frontend TypeScript Types

Import directly from `src/modules/integrations/member2-frontend.contract.ts`:

```typescript
import {
  FrontendStandardResponse,
  FrontendAuthSession,
  FrontendDiscoveryCard,
  FrontendMatchCard,
} from './contracts/member2-frontend.contract';
```
