### 🔐 LMS Login & Security Architecture (At a Glance)

**The Core Concept:** **one active device per user** to completely **prevent account sharing** and **exam cheating**.

**How It Works (Step-by-Step):**

* 📱 **1. The "One Device" Rule (The Kill Switch):** Whenever a student logs in on a new device (like their phone), the database instantly and permanently kills their session on any previous device (like their laptop). You can never be logged in twice.
* ⚡ **2. The 5-Minute "JWT access token":** Because this token is temporary, the server trusts it automatically without checking the database every single time the user clicks a button. This makes the app fast.(There is a cheating risk in this 5 min).
* 🔄 **3. After every 5 min renew access token using refresh token.
* 🛑 **4. The Security Block:** If a student's old device tries to renew its access token, or if a hacker tries to use a stolen access token. It sees that the session was killed, denies the renewal.

**Why We Built It This Way (The Benefits):**
* **Stops Account Sharing:** Friends cannot watch videos or take exams at the same time using a single account. They will just keep kicking each other out.
* **Simple & Cheap Infrastructure:** We do not need expensive external servers (like Redis) to handle security. Everything runs cleanly on our existing database.
* **Maximum Privacy:** We do not track invasive user data like IP addresses or device models. We only use a clean, anonymous browser fingerprint to verify the device.

## Core idea

> JWT = fast access
> Session = device
> Refresh Token = security control
---

# 🧾 1. USER TABLE (Identity Only)

| Column        | Type          | Constraints       | Purpose                                             |
| ------------- | ------------- | ----------------- | --------------------------------------------------- |
| id            | UUID          | PK, default uuid4 | Unique user identifier                              |
| name          | String        | not null          | Full name of user                                   |
| email         | String        | unique, not null  | Login identifier                                    |
| password_hash | String        | not null          | Securely stored password (bcrypt/argon2)            |
| role          | UserRole enum | not null          | Defines permissions (admin, teacher, student, etc.) |
| is_active     | Boolean       | default true      | Enables/disables account                            |
| created_at    | DateTime(tz)  | default utcnow    | Account creation time                               |
| updated_at    | DateTime(tz)  | default utcnow    | Last profile update time                            |

---

# 📱 2. SESSION TABLE (DEVICE CONTROL)

| Column          | Type         | Constraints                  | Purpose                            |
| --------------- | ------------ | ---------------------------- | ---------------------------------- |
| id (session_id) | UUID         | PK, default uuid4            | Identifies a login session         |
| user_id         | UUID         | FK → User.id, cascade delete | Owner of the session               |
| device_info     | String       | nullable                     | Device name (Chrome, iPhone, etc.) |
| ip_address      | String       | nullable                     | Login IP tracking                  |
| is_active       | Boolean      | default true                 | Session status                     |
| created_at      | DateTime(tz) | default utcnow               | Session start time                 |
| last_active_at  | DateTime(tz) | nullable                     | Last activity timestamp            |
| revoked_at      | DateTime(tz) | nullable                     | When session was terminated        |

---

# 🔐 3. ActiveToken (Refresh Token Store -> CORE SECURITY)

| Column             | Type         | Constraints                  | Purpose                        |
| ------------------ | ------------ | ---------------------------- | ------------------------------ |
| id                 | UUID         | PK, default uuid4            | Token record identifier        |
| session_id         | UUID         | FK → Session.id              | Links token to a login session |
| refresh_token_hash | String       | unique, not null             | Secure hash of refresh token   |
| issued_at          | DateTime(tz) | not null                     | Token creation time            |
| expires_at         | DateTime(tz) | not null                     | Token expiry                   |
| last_used_at       | DateTime(tz) | nullable                     | Last refresh usage time        |
| is_revoked         | Boolean      | default false                | Marks invalidated tokens       |
| revoked_at         | DateTime(tz) | nullable                     | Revocation timestamp           |
| replaced_by        | UUID         | nullable                     | Points to next rotated token   |

---

# ⚡ 4. JWT ACCESS TOKEN (NOT STORED)

Payload:

```json id="jwt"
{
  "sub": "user_id",
  "sid": "session_id",
  "role": "student",
  "exp": 1710000000
}
```

✔ No DB storage
✔ 10–15 min lifetime
✔ Stateless verification

---

# 🔁 AUTH FLOW

---

## 🟢 LOGIN FLOW

```text id="login"
User login
→ verify password
→ create Session (device)
→ create Refresh Token
→ issue JWT (15 min)
→ send both tokens
```

---

## 🟡 API REQUEST FLOW

```text id="api"
Client → JWT
→ verify signature only
→ extract user + session
→ allow access (NO DB CALL)
```

---

## 🔄 REFRESH FLOW

```text id="refresh"
JWT expired
→ send refresh token
→ verify hash in DB
→ check session active
→ rotate token
→ issue new JWT + refresh token
```

---

## 🔴 LOGOUT (single device)

```text id="logout"
Session.is_active = false
→ revoke all refresh tokens of session
→ delete cookies
```

---

## 🔴 LOGOUT ALL DEVICES

```text id="logout_all"
set all sessions of user inactive
revoke all refresh tokens
```

---

# 📱 MULTI-DEVICE MODEL

```text id="devices"
User
 ├── Session (Laptop)
 │     └── Refresh Token (rotating)
 │
 ├── Session (Phone)
 │     └── Refresh Token
 │
 └── Session (Tablet)
       └── Refresh Token
```

---

# 🔐 SECURITY MODEL (IMPORTANT)

✔ Only ONE active refresh token per session
✔ Rotation invalidates old token
✔ Session controls device access
✔ JWT is stateless (fast)

---

# 🚨 SUSPICIOUS ACTIVITY RULE

If old refresh token is reused:

```text id="attack"
→ revoke entire session
→ force logout device
→ alert user
```

---

## 🟢 1. Login Flow (Strict 1-Device Limit + Redis Security Lock)

The user provides their credentials. The server verifies them, instantly kills any previous sessions in the SQL database, pushes the old session to a Redis blocklist for immediate real-time lockout, and then issues new tokens to the current device.

### Request

```http
POST /api/auth/login
Content-Type: application/json
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)... 

{
  "email": "student@lms.edu",
  "password": "SecurePassword123!"
}

```

### Behind the Scenes (Server Logic)

1. **Verify Credentials:** Fetch `User` by email and verify `password_hash` using bcrypt (or Argon2).
2. **The SQL Kill Switch (1-Device Limit):** * Find any existing active sessions for this `user_id`.
* Update `Session` table: set `is_active = false` and `revoked_at = NOW()`.
* Update `ActiveToken` table: set `is_revoked = true` for those sessions.


3. **The Redis Blocklist (The Exam Fix):**
* Take the `session_id` of the old session you just killed.
* Write it to Redis with a 15-minute Time-To-Live (TTL): `SET "revoked:old_session_id" "true" EX 900`.
*(This guarantees the old device cannot cheat on an exam during the 15-minute JWT window).*


4. **Create New Session:** Insert a new row into the `Session` table for the current login (storing the raw `User-Agent` and `ip_address`).
5. **Generate Refresh Token:** Create a cryptographically secure random string (64 bytes). Hash it using SHA-256 and insert the hash into `ActiveToken` linked to the new `session_id`.
6. **Generate JWT:** Issue the stateless Access Token (expires in exactly 15 mins) containing `user_id`, the new `session_id`, and `role`.

### Response

```http
HTTP/1.1 200 OK
Set-Cookie: access_token=eyJhbG...; HttpOnly; Secure; SameSite=Strict; Max-Age=900; Path=/
Set-Cookie: refresh_token=d7a8f...; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000; Path=/api/auth/refresh
Content-Type: application/json

{
  "message": "Login successful. Previous devices have been securely logged out.",
  "user": {
    "id": "uuid-user-123",
    "name": "Jane Doe",
    "role": "student"
  }
}

```

> **Security Note 1 (Cookies):** The `refresh_token` cookie path is strictly restricted to `/api/auth/refresh`. The browser will only transmit this heavy, sensitive token when specifically asking to renew the session, preventing it from being intercepted during standard API calls.
> **Security Note 2 (Exam Integrity):** Because of Step 3, if the user's old device attempts to submit an exam answer, your API middleware will instantly see the `session_id` in the Redis blocklist and reject the request with a `401 Unauthorized`. Once the 15 minutes are up, Redis deletes the record, the old JWT expires naturally, and the SQL database permanently prevents the old device from refreshing.
---

## 🟡 2. API Request Flow (Accessing Protected Routes)

The client requests protected data (e.g., fetching their enrolled courses or submitting an exam).

### Request

```http
GET /api/courses/enrolled
Cookie: access_token=eyJhbG...

```

### Behind the Scenes (Server Logic)

1. **Extract** the JWT from the `access_token` cookie.
2. **Verify Signature:** Check the JWT signature using the server's secret key (Pure math, no DB).
3. **Check Expiry:** Check the `exp` (expiration time) to ensure the token is still mathematically valid.
4. **Extract Data:** Extract `sub` (user_id), `role` (for authorization), and `sid` (session_id).
5. **The Security Lock (Redis Check):** * Perform a microsecond lookup in Redis: `EXISTS "revoked:sid"`
* If Redis returns `true` (session was killed), immediately return `401 Unauthorized`.


6. **(NO SQL CALL):** If Redis returns `false`, proceed directly to fetching the courses or saving the exam.

### Response (Success)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": [
    { "id": "course-1", "title": "Introduction to Python" },
    { "id": "course-2", "title": "Calculus I" }
  ]
}

```

### Response (Blocked by Redis)

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "Session revoked. Your account was accessed from a new device."
}

```

> **Architecture Note:** By checking Redis instead of the main SQL database, this request still takes ~1 millisecond. You maintain the massive performance benefits of a stateless JWT architecture while completely closing the 15-minute vulnerability window.

---

Yes, a crucial update is needed here. Because you implemented the **Strict 1-Device Limit**, the reason a refresh token might be rejected has changed, and your backend logic needs to distinguish between two completely different scenarios:

1. **Scenario A (Normal Lockout):** The user logged in on a new device, so the backend marked this old session as `is_active = false`.
2. **Scenario B (Token Theft / Suspicious Activity):** The session is still active, but someone is trying to use an old, previously rotated refresh token. This means a hacker might have stolen a token.

Here is the updated Refresh Flow that perfectly handles both scenarios and aligns with your new architecture.

---

## 🔄 3. Refresh Flow (Token Rotation & Security Check)

When the 15-minute JWT expires, the API will return a `401 Unauthorized`. The frontend intercepts this and automatically calls the refresh endpoint.

### Request

```http
POST /api/auth/refresh
Cookie: refresh_token=d7a8f...

```

### Behind the Scenes (Server Logic)

1. Extract the raw refresh token from the cookie and hash it (SHA-256).
2. Look up the hash in the `ActiveToken` table and fetch its parent `Session`.
3. **The 1-Device Lockout Check:**
* If the parent `Session.is_active == false` (because they logged in on another device):
* Return `401 Unauthorized` (Message: "Session expired. You logged in on another device.").


4. **The Suspicious Activity Check (Token Theft):** * If the `Session` is active, BUT the token `is_revoked == true`:
* *Danger! Someone is reusing an old token.*
* Update `Session` table: set `is_active = false`.
* Update `ActiveToken`: set `is_revoked = true` for ALL tokens tied to this session.
* Return `403 Forbidden` (Message: "Security alert: suspicious activity detected. Please log in again.").


5. **Token Rotation (If Valid):**
* Mark the current token in the DB as `is_revoked = true` and update `last_used_at`.
* Generate a **new** Refresh Token, hash it, and insert it into `ActiveToken`.
* Update the old token's `replaced_by` column with the new token's ID to maintain the chain.


6. **Generate a new JWT:** Issue the new Access Token for the next 15 minutes.

### Response (Success)

```http
HTTP/1.1 200 OK
Set-Cookie: access_token=NEW_eyJhbG...; HttpOnly; Secure; SameSite=Strict; Max-Age=900; Path=/
Set-Cookie: refresh_token=NEW_d7a8f...; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000; Path=/api/auth/refresh
Content-Type: application/json

{
  "message": "Tokens rotated successfully"
}

```

---

### 💡 Why this update is important

By separating Step 3 and Step 4, your frontend can react intelligently.

* If it gets a **401** (Step 3), it simply redirects the user to the login page with a polite message: *"You've been logged out because you accessed your account from a new device."*
* If it gets a **403** (Step 4), you know there is a potential security breach, and you can show a stronger warning or prompt them to change their password.

---
Yes, these both need critical updates! Because you have upgraded your architecture to the **Strict 1-Device Limit** and the **Redis Blocklist**, the logic for logging out fundamentally changes.

Here is exactly what needs to change and why:

### 1. The Update for "Logout (Current Device)"

Just like the login flow, if a user clicks "Logout," their 15-minute JWT is technically still mathematically valid. To maintain your strict exam security, you must add the **Redis Blocklist** step here too. Otherwise, if a student clicks logout on a shared lab computer, the next student who sits down could theoretically extract the JWT and cheat for the next few minutes.

### 2. The Paradox of "Logout All Devices"

Because you implemented the **Strict 1-Device Limit** (The Highlander Rule) at login, **Section 5 is actually completely obsolete!** Think about the scenario: *"The user realizes they left their account logged in on a library computer and clicks 'Log out of all' from their phone."*

* Under your new architecture, the moment they logged into their phone, your backend **automatically** killed the library computer's session.
* A user can never have multiple active devices, so a "Logout All" button is technically impossible to use.

Here is the final, fully updated Logout section that reflects your high-security architecture.

---

## 🔴 4. Logout Flow (Strict Single Device)

The user clicks logout on their current device. The server destroys the session in the database, pushes the session to the Redis blocklist for instant real-time revocation, and clears the browser cookies.

### Request

```http
POST /api/auth/logout
Cookie: access_token=eyJhbG...

```

### Behind the Scenes (Server Logic)

1. **Extract** the `sid` (session_id) from the JWT in the `access_token` cookie.
2. **The SQL Kill Switch:** * Update `Session` table: set `is_active = false`, `revoked_at = NOW()` where `id == sid`.
* Update `ActiveToken` table: set `is_revoked = true` where `session_id == sid`.


3. **The Redis Security Lock (Instant Revocation):**
* Write the `sid` to the Redis blocklist with a 15-minute TTL: `SET "revoked:{sid}" "true" EX 900`.
* *(This ensures the remaining lifespan of the JWT is instantly neutralized, preventing anyone from extracting it from a shared computer after the user walks away).*



### Response

```http
HTTP/1.1 200 OK
Set-Cookie: access_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/
Set-Cookie: refresh_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/api/auth/refresh
Content-Type: application/json

{
  "message": "Logged out successfully"
}

```

---

*(Note: You can safely delete the old **Section 5: Logout All Devices** from your documentation, as your strict login flow already handles this automatically!)*