# CN: Computer Networks Architecture and Communication

## Client-server architecture

- Client: React application running at `http://localhost:5173`.
- Server: Express API running at `http://localhost:5000`.
- Application protocol: HTTP during local development.
- Transport: TCP for the HTTP/1.1 connection in this setup.
- Data format: JSON request/response bodies.
- Session transport: browser automatically sends the HTTP-only session cookie because
  Fetch requests use `credentials: include`.
- Database: MongoDB accessed by the server through Mongoose and connect-mongo.

## Request flow

1. User submits login form in React.
2. Fetch sends `POST /api/auth/login` with a JSON body.
3. Express receives the request and validates the fields.
4. Server finds the user in MongoDB and compares the password hash with bcrypt.
5. On success, Express creates a server-side session and sends a session cookie.
6. Browser sends that cookie on later API requests.
7. Protected route checks the session before returning protected data.

## HTTP endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate and create session |
| GET | `/api/auth/me` | Verify current session |
| POST | `/api/auth/logout` | Destroy session |
| GET | `/api/protected/dashboard` | Protected resource |

## HTTP status codes demonstrated

- 200 OK: login, session check or protected request succeeded.
- 201 Created: user registration succeeded.
- 400 Bad Request: form validation failed.
- 401 Unauthorized: invalid credentials or no valid session.
- 409 Conflict: email already registered.
- 500 Internal Server Error: unexpected server-side failure.

## Live network monitor

Open `/cn` while both frontend and backend are running. The page provides buttons to
send real `GET /api/health` and `GET /api/auth/me` requests. It also captures actual
API request metadata from the application's Fetch wrapper, including method, endpoint,
HTTP status, duration and outcome.

The monitor does not capture packet payloads, IP headers, TCP sequence numbers or raw
Wireshark traces. Those require a packet capture tool such as Wireshark.
