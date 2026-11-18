# FSM Transition Table

| Current state | Input / event | Condition / guard | Next state | Action / output |
|---|---|---|---|---|
| LOGGED_OUT | Submit login | Client validation fails | LOGGED_OUT | Show field validation messages; do not send request |
| LOGGED_OUT | Submit login | Input is valid | AUTHENTICATING | Send POST `/api/auth/login` |
| AUTHENTICATING | Login response | Credentials valid and session saved | LOGGED_IN | Store user in React state; navigate to dashboard |
| AUTHENTICATING | Login response | Invalid credentials / server validation error | LOGGED_OUT | Display error message |
| AUTHENTICATING | Request pending | No response yet | AUTHENTICATING | Keep submit button disabled / show progress |
| LOGGED_IN | Open protected page | Server session valid | LOGGED_IN | Return protected dashboard data |
| LOGGED_IN | Protected API response | HTTP 401 / session missing or expired | SESSION_EXPIRED | Clear user state and require login |
| LOGGED_IN | Click logout | Logout request succeeds | LOGGED_OUT | Destroy server session and clear cookie |
| SESSION_EXPIRED | Submit login | Input is valid | AUTHENTICATING | Start a new login request |
| SESSION_EXPIRED | Reset / dismiss | User returns to login screen | LOGGED_OUT | Clear expired-session message |
| Any state | Invalid form data | Required field or format check fails | Same state (normally LOGGED_OUT) | Show validation errors |

## Input and output definition

- **Inputs:** email, password, register name, submit, login response, logout, session
  check response, session timeout.
- **Outputs:** validation messages, authentication success/failure, protected data,
  logout confirmation, session-expired message.
- **Start state:** `LOGGED_OUT`.
- **Accepting/authenticated state:** `LOGGED_IN`.
