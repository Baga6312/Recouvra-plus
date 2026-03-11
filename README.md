# Recouvra+

A REST API for managing debt recovery — clients, unpaid invoices, payments, and recovery actions.

Built with Node.js, Express.js, and MongoDB.

---

## Prerequisites

Before you start, make sure you have the following installed:

- [Node.js](https://nodejs.org/) v22+
- [MongoDB](https://www.mongodb.com/) (local) or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- npm (comes with Node.js)
- Git

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/recouvra-plus.git
   cd recouvra-plus
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Open `.env` and fill in your values:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/recouvra
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

---

## Running the API

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:3000`.

---

## API Documentation

Swagger UI is auto-generated and available once the server is running:

```
http://localhost:3000/docs
```

---

## Running Tests

```bash
npm test
```

---

## Project Structure

```
recouvra-plus/
├── src/
│   ├── config/         → Database & JWT config
│   ├── middlewares/    → Auth, validation, error handling
│   ├── models/         → Mongoose schemas
│   ├── routes/         → API routes
│   ├── controllers/    → Request handlers
│   ├── services/       → Business logic
│   ├── validators/     → Joi validation schemas
│   └── swagger/        → OpenAPI definitions
├── tests/
├── .env.example
└── app.js
```

---

## API Overview

| Resource                  | Description                    |
| ------------------------- | ------------------------------ |
| `POST /api/auth/register` | Create a new user (admin only) |
| `POST /api/auth/login`    | Login and receive a JWT token  |
| `GET /api/auth/me`        | Get your profile               |
| `/api/clients`            | Manage clients                 |
| `/api/invoices`           | Manage invoices                |
| `/api/payments`           | Record manual payments         |
| `/api/recovery-actions`   | Track recovery actions         |
| `/api/stats`              | View statistics and reports    |

---

## Troubleshooting




