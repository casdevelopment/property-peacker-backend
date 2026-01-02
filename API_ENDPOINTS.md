# API Endpoints Documentation

Base URL: `http://localhost:5500` (or your configured PORT)

## Authentication Endpoints

### 1. Sign Up (Register New User)
**POST** `/api/v1/auth/sign-up`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "createdAt": "2025-01-20T10:00:00.000Z",
      "updatedAt": "2025-01-20T10:00:00.000Z"
    }
  }
}
```

**Error (409 Conflict):**
```json
{
  "success": false,
  "error": "User already exists"
}
```

---

### 2. Sign In (Login)
**POST** `/api/v1/auth/sign-in`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User signed in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "createdAt": "2025-01-20T10:00:00.000Z",
      "updatedAt": "2025-01-20T10:00:00.000Z"
    }
  }
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "error": "User not found"
}
```

**Error (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid password"
}
```

---

### 3. Sign Out
**POST** `/api/v1/auth/sign-out`

**Note:** Currently not implemented (empty function)

---

## User Endpoints

### 4. Get All Users
**GET** `/api/v1/users`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "createdAt": "2025-01-20T10:00:00.000Z",
      "updatedAt": "2025-01-20T10:00:00.000Z"
    },
    {
      "id": 2,
      "fullName": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+0987654321",
      "createdAt": "2025-01-20T11:00:00.000Z",
      "updatedAt": "2025-01-20T11:00:00.000Z"
    }
  ]
}
```

---

### 5. Get User by ID
**GET** `/api/v1/users/:id`

**Headers Required:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "createdAt": "2025-01-20T10:00:00.000Z",
    "updatedAt": "2025-01-20T10:00:00.000Z"
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "message": "Unauthorized"
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "error": "User not found"
}
```

---

### 6. Create User (Placeholder)
**POST** `/api/v1/users`

**Note:** Currently returns placeholder response

---

### 7. Update User (Placeholder)
**PUT** `/api/v1/users/:id`

**Note:** Currently returns placeholder response

---

### 8. Delete User (Placeholder)
**DELETE** `/api/v1/users/:id`

**Note:** Currently returns placeholder response

---

## Root Endpoint

### 9. Welcome Message
**GET** `/`

**Response (200 OK):**
```
Welcome to the Subscription Tracker API!
```

---

## Testing with cURL

### Sign Up
```bash
curl -X POST http://localhost:5500/api/v1/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:5500/api/v1/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get All Users
```bash
curl -X GET http://localhost:5500/api/v1/users
```

### Get User by ID (with token)
```bash
curl -X GET http://localhost:5500/api/v1/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## Testing with Postman/Thunder Client

1. **Sign Up:**
   - Method: POST
   - URL: `http://localhost:5500/api/v1/auth/sign-up`
   - Body (JSON):
     ```json
     {
       "fullName": "John Doe",
       "email": "john@example.com",
       "password": "password123",
       "phone": "+1234567890"
     }
     ```

2. **Sign In:**
   - Method: POST
   - URL: `http://localhost:5500/api/v1/auth/sign-in`
   - Body (JSON):
     ```json
     {
       "email": "john@example.com",
       "password": "password123"
     }
     ```
   - Copy the `token` from the response

3. **Get User by ID:**
   - Method: GET
   - URL: `http://localhost:5500/api/v1/users/1`
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer YOUR_TOKEN_HERE`

---

## Notes

- All passwords are hashed using bcrypt
- JWT tokens expire based on `JWT_EXPIRES_IN` environment variable (default: "1d")
- Protected routes require `Authorization: Bearer <token>` header
- Email addresses are automatically lowercased and trimmed
- Passwords must be at least 6 characters long
- Full names must be between 2 and 100 characters
- Phone number is required

