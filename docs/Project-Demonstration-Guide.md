# Project Demonstration Guide

## Recommended presentation order

### A. FLAT module — `/flat`
1. Explain Q, Σ, δ, initial state and accepting state.
2. Start at LOGGED_OUT.
3. Select VALID_LOGIN and execute: state becomes AUTHENTICATING.
4. Select LOGIN_SUCCESS and execute: state becomes LOGGED_IN.
5. Select SESSION_TIMEOUT: state becomes SESSION_EXPIRED.
6. Show the transition history and complete transition table.

### B. CN module — `/cn`
1. Explain the React client, Express server and MongoDB database.
2. Click Test API health (GET) and show the actual HTTP response event.
3. Click Check session (GET); without login, expect 401.
4. Return to login, register a demo user and log in.
5. Return to CN and check session again; expect 200 if session remains valid.
6. Explain HTTP methods, status codes, JSON and session cookie transmission.

### C. Full Stack module — `/fullstack` and `/`
1. Explain each layer in the stack.
2. Register a new test user.
3. Log in with the correct credentials.
4. Open the protected dashboard.
5. Try the dashboard without a session to demonstrate route protection.
6. Log out and explain server-side session destruction.

## Safe demo credentials

Create your own test user during the demo. Example only:
- Name: Demo Student
- Email: demo.student@example.com
- Password: DemoPass123

Do not use a real personal password.

## Before presentation

- Start MongoDB.
- Start backend in one terminal.
- Start frontend in another terminal.
- Confirm `/api/health` responds.
- Open the frontend and test all three modules.
- Capture screenshots for your report.
