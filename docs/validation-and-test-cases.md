# User Input Validation and Test Cases

## Validation rules

| Field | Rule | Example valid value |
|---|---|---|
| Name (registration) | Trimmed length 2–60 characters | `Devi Kumar` |
| Email | Must match a valid email format | `devi@example.com` |
| Password (registration) | 8–72 characters | `DemoPass123` |
| Password (login) | Required; maximum 72 characters | `DemoPass123` |

Validation occurs in two places:
- React provides immediate feedback before sending the request.
- Express validates incoming data again; client-side checks can be bypassed.

Passwords are hashed with bcrypt before saving. The API never returns password hashes.

## Test cases

| ID | Scenario | Input / action | Expected result |
|---|---|---|---|
| TC01 | Valid registration | Name `Devi`, email `devi@example.com`, password `DemoPass123` | 201; user created |
| TC02 | Invalid email | `devi-email` | 400; email validation message |
| TC03 | Short password registration | `abc12` | 400; password length message |
| TC04 | Duplicate registration | Register same email twice | 409; email already exists |
| TC05 | Valid login | Correct registered email and password | 200; session created; LOGGED_IN |
| TC06 | Wrong password | Correct email, wrong password | 401; invalid credentials; LOGGED_OUT |
| TC07 | Unknown email | Unregistered email | 401; invalid credentials |
| TC08 | Protected route while logged out | GET `/api/protected/dashboard` without cookie | 401; access denied |
| TC09 | Protected route while logged in | GET endpoint with valid session cookie | 200; dashboard data |
| TC10 | Logout | POST `/api/auth/logout` | 200; session destroyed |
| TC11 | Session expiry | Wait for cookie/session TTL then call protected API | 401; SESSION_EXPIRED |
| TC12 | Empty login fields | Submit blank form | Client validation; no request |

## How to demonstrate session expiry

For a quick demonstration, set `SESSION_MAX_AGE_MS=60000` in `server/.env`.
Restart the server, register/log in, wait approximately one minute, then refresh the
dashboard or request `/api/protected/dashboard`. The backend should reject the expired
session. Restore the normal value (900000) after the demonstration.
