# NestJS PostgreSQL Authentication Project

A complete NestJS application with PostgreSQL database and JWT-based authentication.

## Features

- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes with JWT guards
- TypeORM for database management
- Input validation with class-validator
- Environment configuration

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up your PostgreSQL database:

```bash
# Create a new database
createdb nest_auth_db
```

3. Configure environment variables:

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your database credentials
```

Update the `.env` file with your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=nest_auth_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The application will start on `http://localhost:3000`

## API Endpoints

### Public Endpoints

#### Register a new user
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Protected Endpoints (Require JWT Token)

#### Get all users
```http
GET /users
Authorization: Bearer <your-jwt-token>
```

#### Get user by ID
```http
GET /users/:id
Authorization: Bearer <your-jwt-token>
```

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── guards/          # Auth guards
│   ├── strategies/      # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── user/                # User module
│   ├── dto/            # Data transfer objects
│   ├── entities/       # TypeORM entities
│   ├── user.controller.ts
│   ├── user.module.ts
│   └── user.service.ts
├── app.module.ts        # Root module
├── app.controller.ts    # Root controller
├── app.service.ts       # Root service
└── main.ts             # Application entry point
```

## Technologies Used

- **NestJS** - Progressive Node.js framework
- **PostgreSQL** - Relational database
- **TypeORM** - ORM for TypeScript
- **JWT** - JSON Web Tokens for authentication
- **Passport** - Authentication middleware
- **bcrypt** - Password hashing
- **class-validator** - Validation decorators

## Security Notes

- Always change the `JWT_SECRET` in production
- Use strong passwords for your database
- Enable HTTPS in production
- Consider implementing rate limiting
- Add CORS configuration for production

## License

MIT
