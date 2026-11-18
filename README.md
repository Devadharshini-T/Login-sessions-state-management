# Login and Session State Management System

A full-stack individual project built with **React, Node.js, Express, and MongoDB**.
It demonstrates login, protected pages, logout, server-side session management,
input validation, login failure handling, and a finite-state machine (FSM).

## 1. Features

- Register a demo user and log in with email/password.
- Express session stored in MongoDB using `connect-mongo`.
- Password hashing with `bcryptjs` (never store plain-text passwords).
- HTTP-only session cookie; `SameSite=Lax`; configurable `Secure` flag.
- Protected `/dashboard` API and React protected route.
- Logout destroys the server-side session.
- Session expiry handling and automatic frontend state update after a `401`.
- FSM states: `LOGGED_OUT`, `AUTHENTICATING`, `LOGGED_IN`, `SESSION_EXPIRED`.
- Client and server-side validation.
- Login failure messages and sample test cases.
- State transition diagram and transition table in `docs/`.

## 2. Requirements

Install:
- Node.js 18 or later
- npm
- MongoDB Community Server running locally, or a MongoDB Atlas connection string

## 3. Folder structure

```text
login-session-state-management/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   └── package.json
├── server/                  # Node + Express + MongoDB backend
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── state-transition-diagram.md
│   ├── transition-table.md
│   ├── validation-and-test-cases.md
│   └── sample-inputs-and-outputs.md
└── .gitignore
```

## 4. Setup and run

### Step A — Start MongoDB

For a local MongoDB installation, start the MongoDB service. The default URI used below is:

`mongodb://127.0.0.1:27017/login_session_fsm`

Alternatively, create a MongoDB Atlas database and put its connection string in `server/.env`.

### Step B — Configure backend

Open a terminal in the project root:

```bash
cd server
```

Copy `.env.example` to `.env` and update values if needed:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/login_session_fsm
SESSION_SECRET=replace_this_with_a_long_random_secret
SESSION_NAME=login.sid
SESSION_MAX_AGE_MS=900000
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Install and start:

```bash
npm install
npm run dev
```

The API runs at `http://localhost:5000`. You should see a MongoDB connected message.

### Step C — Configure frontend

Open a second terminal in the project root:

```bash
cd client
```

Copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Install and start:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## 5. Demo workflow

1. Open the Register tab and create a user using a valid name, email and password.
2. Log in with that email and password.
3. The dashboard is protected. It displays the authenticated user's name and email.
4. Click **Log out** to destroy the session and return to the login screen.
5. To demonstrate session expiry, wait 15 minutes (default) or temporarily set
   `SESSION_MAX_AGE_MS=60000` in `server/.env`, restart the backend, log in, and wait
   one minute. Refresh or call the dashboard; the UI should move to `SESSION_EXPIRED`.

> For a classroom demo, use a test account only. Do not use a real personal password.

## 6. API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Backend health check |
| POST | `/api/auth/register` | Create a user |
| POST | `/api/auth/login` | Authenticate and create session |
| GET | `/api/auth/me` | Get current session user |
| POST | `/api/auth/logout` | Destroy session |
| GET | `/api/protected/dashboard` | Example protected resource |

All API requests from the browser include credentials so the session cookie is sent.

## 7. FSM overview

The React authentication context controls the UI state. The backend remains the authority
for whether a session is valid. See:
- `docs/state-transition-diagram.md`
- `docs/transition-table.md`

## 8. GitHub submission

1. Create a GitHub repository, for example `login-session-state-management`.
2. Upload the contents of this project folder (not the ZIP file alone, unless your
   instructor specifically requests a ZIP).
3. Do **not** upload `node_modules/`, `.env`, passwords, or production secrets.
4. Include the `docs/` folder and this README.
5. In the repository, confirm that `client/`, `server/`, and `docs/` are visible.

## 9. Common errors

- **MongoDB connection refused:** Ensure MongoDB is running and `MONGODB_URI` is correct.
- **CORS / cookie issue:** Run frontend on `http://localhost:5173` and backend on
  `http://localhost:5000`; keep `CLIENT_ORIGIN` in sync.
- **Cannot find module:** Run `npm install` separately inside both `server/` and `client/`.
- **Port already in use:** Change `PORT` in `server/.env` or stop the other process.
- **Login says invalid credentials:** Register first, then use the same email/password.
- **Session disappears in production:** Configure HTTPS and set `COOKIE_SECURE=true`;
  configure trusted proxy if deploying behind one.

## 10. Security note

This is an educational starter project, not a production identity platform. For production,
also add HTTPS, CSRF protection appropriate to the deployment, rate limiting, email
verification, password reset, security monitoring, and stronger operational secret
management. Never expose `SESSION_SECRET` or commit `.env`.
