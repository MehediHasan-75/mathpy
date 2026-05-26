# LMS Auth Architecture

## At a Glance

**The Core Concept:** A strict **one active device per user** rule to completely **prevent account sharing** and **exam cheating**, paired with hardware tracking to permanently ban serial sharers.

**How It Works:**

* **1. One Device:** Whenever a student logs in on a new device, the database instantly and permanently kills their session on any previous device. You can never be logged in twice.
* **2. The 5-Minute "Fast Pass":** The active device receives a stateless Access Token (JWT) that lives for exactly 5 minutes. The server trusts this automatically without a database lookup, keeping the app lightning fast. (Any cheating risk is strictly confined to this tiny 5-minute window).
* **3. Silent Renewals:** Before the 5 minutes run out, the browser silently uses a Refresh Token to ask the server for a new 5-minute access token without interrupting the user.
* **4. The Security Block:** If a student's old device tries to renew its access, or if a hacker tries to use a stolen token, the database sees the session was killed and permanently denies the renewal.

---

# 1. USER TABLE (Identity & Ban Control)

| Column | Type | Constraints | Purpose |
| --- | --- | --- | --- |
| id | UUID | PK, default uuid4 | Unique user identifier |
| name | String | not null | Full name of user |
| email | String | unique, not null | Login identifier |
| password_hash | String | not null | Securely stored password |
| role | UserRole enum | not null | Permissions (admin, student, etc.) |
| is_active | Boolean | default true | Enables/disables account |
| **is_banned** | Boolean | **default false** | **If true, account is locked for serial sharing** |
| created_at | DateTime | default utcnow | Account creation time |

---

# 2. SESSION TABLE

*(This table handles device tracking, the 1-device limit, and token rotation all in one place).*

| Column | Type | Constraints | Purpose |
| --- | --- | --- | --- |
| id (session_id) | UUID | PK, default uuid4 | Identifies the active login session |
| user_id | UUID | FK → User.id | Owner of the session |
| **fingerprint_id** | String | **not null** | **The FingerprintJS hash from the frontend** |
| **refresh_token_hash** | String | **unique, not null** | **For silent 5-minute token rotation** |
| is_active | Boolean | default true | Session status (The Kill Switch) |
| created_at | DateTime | default utcnow | Used to calculate the 30-day device limit |
| updated_at | DateTime | default utcnow | Updates on token rotation |

---

# 3. JWT ACCESS TOKEN (NOT STORED)

**Payload:**

```json
{
  "sub": "user_id",
  "sid": "session_id",
  "role": "student",
  "exp": 1710000000
}

```

✔ Sent via `HttpOnly`, `Secure`, `SameSite=Strict` cookie.

✔ **Strict 5-minute lifetime** to protect routes statelessly.

✔ `sid` is used during logout and refresh to map to the exact session.

✔ During exam before every submission check is the session is active.

---

# AUTH FLOWS

## A. Login Flow (3-Device Ban + 1-Device Limit)

**Request:**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@lms.edu",
  "password": "SecurePassword123!",
  "fingerprint_id": "a8f3b9c..." 
}

```

**Behind the Scenes (Server Logic):**

1. **Verify Credentials:** Fetch `User` and verify password. If `User.is_banned == true`, return `403 Forbidden`.
2. **Count unique devices in the last 30 days:** `SELECT COUNT(DISTINCT fingerprint_id) FROM sessions WHERE user_id = sid AND created_at > NOW() - 30 days`.
* If Count >= 3 AND `fingerprint_id` is new: Set `User.is_banned = true` and return `403 Forbidden` (Account Suspended).

3. **Update `Session` table:** set `is_active = false` where `user_id == current_user_id`.
4. **Create Unified Session & Tokens:**
* Generate a 64-byte Refresh Token and hash it.
* Insert a new row into `Session` with the `user_id`, `fingerprint_id`, and `refresh_token_hash`.
* Issue the 5-minute Access Token (JWT).



**Response:**

```http
HTTP/1.1 200 OK
Set-Cookie: access_token=eyJhbG...; Max-Age=300; Path=/
Set-Cookie: refresh_token=d7a8f...; Max-Age=2592000; Path=/api/auth/refresh
Content-Type: application/json

{
  "message": "Login successful.",
  "user": { "id": "uuid", "name": "Jane Doe", "role": "student" }
}

```

---

## B. API Request Flow (Accessing Protected Routes)

**Request:**

```http
GET /api/courses/enrolled
Cookie: access_token=eyJhbG...

```

**Behind the Scenes (Server Logic):**

1. Extract the JWT from the `access_token` cookie.
2. Verify the JWT signature using the server's secret key (**NO DB CALL**).
>During exam before every submission check is the session is active. It will prevent the use of logged out token.

3. Check the `exp` (expiration time) to ensure the 5-minute lifespan hasn't passed.
4. Extract `sub`, `role`, and `sid`.
5. Proceed directly to fetching data or saving the exam.
✔ During exam before every submission check is the session is active.

---

## C. Refresh Flow (Silent Token Rotation)

When the 5-minute JWT expires, the frontend interceptor automatically calls this endpoint.

**Request:**

```http
POST /api/auth/refresh
Cookie: refresh_token=d7a8f...

```

**Behind the Scenes (Server Logic):**

1. Extract raw refresh token from cookie and hash it (SHA-256).
2. Look up the `Session` where `refresh_token_hash == hash`.
3. **Validation & Security Checks:**
* If no session is found: Return `401 Unauthorized`.
* If `Session.is_active == false` (Killed by a newer login): Return `401 Unauthorized`.


4. **Token Rotation:**
* Generate a new Refresh Token and hash it.
* Update the `Session` row: overwrite `refresh_token_hash` with the new hash, update `updated_at = NOW()`.


5. **Generate new JWT** valid for 5 minutes.

---

## D. Logout Flow (Current Device)

**Request:**

```http
POST /api/auth/logout
Cookie: access_token=eyJhbG...

```

**Behind the Scenes (Server Logic):**

1. Extract `sid` from the JWT.
2. Update `Session` table: set `is_active = false` where `id == sid`.
3. Send response with `Max-Age=0` to immediately drop browser cookies.