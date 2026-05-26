### 🎬 The Scenario

Imagine **Friend A** is currently logged in on their laptop watching a course video, and **Friend B** uses the same email and password to log in on their phone.

### ⚙️ How the Auto-Logout Happens

1. **The Database Kill:** The moment Friend B hits "Login" on their phone, your backend updates the database. It marks Friend A's laptop session as `dead`.
2. **The UX Reality:** Friend A's laptop doesn't instantly shut down the web page. The video they are currently watching might keep playing for a few minutes.
3. **The Kick-Out:** The automatic logout happens the *very next time* Friend A's laptop tries to talk to the server. This happens in one of two ways:
* **Active Kick:** Friend A clicks "Next Video" or "Submit Quiz".
* **Passive Kick:** The 5-minute background timer runs out and the browser silently asks the server for a token renewal.


4. **The Redirect:** The server looks at Friend A's request, sees their session was killed by Friend B, and rejects it with a strict `Error 401: Unauthorized`.
5. **Back to Login:** Your frontend app receives that error and instantly boots Friend A back to the login screen with a message like: *"You have been logged out because this account was accessed from another device."*

So, while it doesn't forcibly close their browser tab, it **automatically destroys their access**. They cannot proceed, they cannot fetch new data, and they are forced back to the login screen within a maximum of 5 minutes.

### The problem
> Multiple device can have access for 5 min(expirey time of access token)
Because standard API requests verify the JWT using pure mathematics without checking the database, **Device A can still browse the app for up to 5 minutes** after Device B logs in. This is called a "Ghost Window."

Here is the exact timeline of how that plays out:

### The 5-Minute Overlap Timeline

1. **12:00 PM** – Student logs into **Laptop (Device A)**. They get a JWT valid until 12:05 PM.
2. **12:02 PM** – Student logs into **Phone (Device B)**. The database instantly marks Laptop's session as `is_active = false`. Phone gets a fresh JWT.
3. **12:02 to 12:05 PM (The Overlap)** – For these 3 minutes, both the Laptop and the Phone can view courses. The server accepts the Laptop's JWT because it is mathematically valid and doesn't ask the database.
4. **12:05 PM (The Kick-Out)** – The Laptop's JWT expires. The Laptop's browser automatically sends its refresh token to the server. The server checks the database, sees `is_active = false`, rejects the request, and forces the Laptop to the login screen.

---

### Why this is perfectly fine for your LMS (With One Exception)

For regular activities like watching a video lecture or reading a PDF, a 3-to-5-minute overlap doesn't hurt your business. It isn't enough time for friends to reasonably share an account.

**The Exam Exception:** The only place this overlap is dangerous is during a high-stakes exam. If a student passes their JWT to a friend at 12:02 PM, that friend could submit answers for 3 minutes.

To fix this *without* adding Redis, you use the **High-Security Override** we put in the document: on your exam submission endpoints, you force the server to run a quick SQL query (`SELECT is_active FROM sessions`) before saving an answer. This completely destroys the 5-minute window for exams, giving you 100% security where it matters most!