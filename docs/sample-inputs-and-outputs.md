# Sample Inputs and Outputs

Use a test account only.

## 1. Register

**Request**

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Devi Kumar",
  "email": "devi@example.com",
  "password": "DemoPass123"
}
```

**Successful response — HTTP 201**

```json
{
  "success": true,
  "message": "Registration successful. You can now log in.",
  "user": {
    "id": "generated-mongodb-id",
    "name": "Devi Kumar",
    "email": "devi@example.com"
  }
}
```

## 2. Login

**Request**

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "devi@example.com",
  "password": "DemoPass123"
}
```

**Successful response — HTTP 200**

```json
{
  "success": true,
  "message": "Login successful.",
  "user": {
    "id": "generated-mongodb-id",
    "name": "Devi Kumar",
    "email": "devi@example.com"
  }
}
```

The server also sets an HTTP-only session cookie. The browser stores it and sends it
with subsequent requests; JavaScript cannot read the cookie.

## 3. Failed login

**Request body**

```json
{
  "email": "devi@example.com",
  "password": "WrongPassword"
}
```

**Response — HTTP 401**

```json
{
  "success": false,
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password."
}
```

## 4. Protected dashboard

**Request**

```http
GET /api/protected/dashboard
```

Send the session cookie received after login.

**Successful response — HTTP 200**

```json
{
  "success": true,
  "message": "You have accessed a protected resource.",
  "data": {
    "title": "Secure Dashboard",
    "user": {
      "id": "generated-mongodb-id",
      "name": "Devi Kumar",
      "email": "devi@example.com"
    },
    "serverTime": "2026-11-17T10:30:00.000Z"
  }
}
```

## 5. Protected endpoint without a session

**Response — HTTP 401**

```json
{
  "success": false,
  "code": "SESSION_EXPIRED",
  "message": "Your session is missing or has expired. Please log in again."
}
```

## 6. Logout

**Request**

```http
POST /api/auth/logout
```

**Response — HTTP 200**

```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

The server destroys the session and clears the cookie.
