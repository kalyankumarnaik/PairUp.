# PairUp API Reference & Endpoint Specification (v1)

Base URL: `https://api.pairup.internal/api/v1`  
Protocol: HTTPS / TLS 1.3  
Authentication: Bearer JWT Token in `Authorization` header  

---

## 1. Authentication & Onboarding (`/api/v1/auth`)

### 1.1 POST `/auth/signup`
Creates a new adult user account and initiates onboarding.
- **Request Body**:
  ```json
  {
    "email": "priya.verma@example.com",
    "phone": "+919876543210",
    "password": "SecurePassword123!",
    "displayName": "Priya",
    "birthDate": "1998-05-14",
    "acceptedTerms": true
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "user": {
      "id": "usr_789abc",
      "email": "priya.verma@example.com",
      "phone": "+919876543210",
      "isEmailVerified": false,
      "isPhoneVerified": false,
      "isAdultVerified": true,
      "role": "USER",
      "status": "ACTIVE"
    },
    "tokens": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi..."
    },
    "profile": {
      "id": "prof_123xyz",
      "displayName": "Priya",
      "age": 27
    }
  }
  ```

### 1.2 POST `/auth/login`
Authenticates with email/phone and password or OTP.
- **Request Body**:
  ```json
  {
    "identifier": "priya.verma@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "user": { ... },
    "tokens": { "accessToken": "...", "refreshToken": "..." },
    "profile": { ... }
  }
  ```

### 1.3 POST `/auth/otp/request`
Sends a 6-digit SMS verification code to mobile number.
- **Request Body**: `{ "phone": "+919876543210" }`
- **Response (200 OK)**: `{ "success": true, "expiresInSeconds": 300 }`

### 1.4 POST `/auth/otp/verify`
Validates 6-digit SMS verification code.
- **Request Body**: `{ "phone": "+919876543210", "code": "123456" }`
- **Response (200 OK)**: `{ "success": true, "tokens": { ... } }`

---

## 2. Profiles & Photos (`/api/v1/profiles`)

### 2.1 GET `/profiles/me`
Retrieves authenticated user profile, completion percentage, prompts, and photos.

### 2.2 PATCH `/profiles/me`
Updates profile bio, interests, relationship intentions, or prompts.
- **Request Body**:
  ```json
  {
    "bio": "Exploring Bengaluru cafes and weekend pottery workshops.",
    "relationshipIntention": "LONG_TERM",
    "interests": [{ "id": "1", "name": "Coffee & Cafes", "category": "Food" }],
    "prompts": [{ "id": "1", "question": "My Sunday ritual", "answer": "Pour-over coffee." }]
  }
  ```

### 2.3 POST `/profiles/me/photos`
Uploads a new profile image (multipart/form-data).

---

## 3. Discovery & Matching (`/api/v1/discovery`)

### 3.1 GET `/discovery/feed`
Fetches a prioritized batch of discovery candidate cards according to user age, distance, and intention preferences.
- **Query Parameters**:
  - `limit`: number (default: 20)
  - `mode`: `DATING` | `FRIENDSHIP` | `BOTH`
  - `maxDistanceKm`: number (default: 30)

### 3.2 POST `/discovery/swipe`
Records a swipe decision (LIKE, PASS, SUPER_LIKE).
- **Request Body**:
  ```json
  {
    "targetUserId": "usr_demo_2",
    "action": "LIKE",
    "connectionMode": "DATING"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "isMatch": true,
    "matchId": "match_10203",
    "matchedProfile": {
      "displayName": "Aarav Sharma",
      "age": 29,
      "photos": [...]
    }
  }
  ```

### 3.3 POST `/discovery/rewind`
Undoes the most recent accidental pass (requires PairUp Plus or Gold).

---

## 4. WebRTC Voice & Video Calls (`/api/v1/calls`)

### 4.1 POST `/calls/initiate`
Initiates a 1-on-1 audio or video call with SDP offer.
- **Request Body**:
  ```json
  {
    "receiverId": "usr_demo_2",
    "type": "VOICE",
    "sdpOffer": "v=0\r\no=- 123456..."
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "session": {
      "id": "call_1782391",
      "status": "RINGING",
      "livekitRoomName": "pairup_room_call_1782391"
    },
    "turn": {
      "urls": ["stun:stun.l.google.com:19302", "turn:turn.pairup.internal:3478"],
      "username": "1740000000:usr_caller",
      "credential": "hmac_base64_hash",
      "ttlSeconds": 86400
    }
  }
  ```

### 4.2 POST `/calls/:id/respond`
Accepts or declines call with SDP answer.

### 4.3 POST `/calls/:id/signal`
Relays trickle ICE candidate packets between caller and callee.

### 4.4 POST `/calls/:id/end`
Terminates active call session and logs duration in seconds.

---

## 5. Trust, Safety & Date Guard (`/api/v1/safety`)

### 5.1 POST `/safety/date-guard`
Initializes in-person date check-in safety watchdog timer.
- **Request Body**:
  ```json
  {
    "partnerName": "Aarav Sharma",
    "venue": "Subko Roastery, Bandra",
    "emergencyContact": "+919876500000",
    "durationMinutes": 90
  }
  ```

### 5.2 POST `/safety/check-in`
Checks in to confirm safety or extend date duration.

### 5.3 POST `/safety/sos`
Triggers Emergency SOS distress dispatch to emergency contacts and logs national helplines contacted (112, 1091).

### 5.4 POST `/safety/report`
Submits formal incident report against a user with optional screenshot attachments.

---

## 6. Subscriptions & Billing (`/api/v1/subscriptions`)

### 6.1 GET `/subscriptions/plans`
Lists Explorer, PairUp Plus (₹499), and PairUp Gold (₹999) feature matrices.

### 6.2 POST `/subscriptions/upgrade`
Upgrades account tier with simulated UPI/Card payment and returns tax invoice.

### 6.3 GET `/subscriptions/invoices`
Returns PDF invoice receipts with 18% GST tax breakdown.

---

## 7. Communities & Passion Clubs (`/api/v1/communities`)

### 7.1 GET `/communities`
Lists metropolitan interest clubs with member counts and active discussion counts.

### 7.2 POST `/communities/:id/join`
Toggles membership in a club.

### 7.3 GET `/communities/:id/posts`
Fetches discussion feed with upvotes and comments.

### 7.4 POST `/communities/:id/posts`
Creates a new discussion post.

---

## 8. Activity Surges & Boost (`/api/v1/surge`)

### 8.1 GET `/surge/active`
Retrieves active neighborhood density surges and match multipliers.

### 8.2 POST `/surge/boost`
Activates 30-minute 3x profile surge boost.

---

## 9. Notifications Center (`/api/v1/notifications`)

### 9.1 GET `/notifications`
Lists in-app and push notifications with unread count.

### 9.2 POST `/notifications/:id/read`
Marks specific notification as read.

### 9.3 POST `/notifications/read-all`
Marks all notifications as read.
