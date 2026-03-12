# Recouvra+ — Comprehensive Debt Recovery API

A production-ready REST API for managing debt recovery operations — clients, unpaid invoices, payments, recovery actions, and real-time analytics.

**Built with**: Node.js | Express.js | MongoDB | JWT Authentication | Joi Validation | Swagger Documentation | Jest Testing

---

## ✨ Key Features

- **User Management**: Registration, login, role-based access control (agent, manager, admin)
- **Client Management**: Complete CRUD with agent assignment and status tracking
- **Invoice Management**: Track invoices with status automation (impayée → partiellement_payée → payée)
- **Payment Recording**: Create/update payments with automatic invoice status updates
- **Recovery Actions**: Log collection activities and follow-ups
- **Statistics Dashboard**: Real-time business intelligence (4 dedicated endpoints)
  - Overview metrics (total CA, recovery rate, invoice count)
  - Invoices breakdown by status
  - Top debtors identification
  - Monthly evolution trends
- **JWT Authentication**: Secure token-based authentication with 7-day expiration
- **Validation**: Joi schemas + Mongoose validation on all endpoints
- **API Documentation**: Complete Swagger/OpenAPI 3.0 with 25+ interactive endpoints
- **Comprehensive Testing**: 67 unit tests across 4 suites (100% passing)

---

## Prerequisites

Before you start, make sure you have the following installed:

- **Node.js** v22+
- **MongoDB** (local) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **npm** (comes with Node.js)
- **Git**

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

   Open `.env` and configure:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/recouvra
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

4. **Start MongoDB** (if running locally)

   ```bash
   mongod
   ```

---

## Running the API

```bash
# Development (with auto-reload via nodemon)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:3000`.

---

## Database Setup

### Seed Initial Data

```bash
npm run seed
```

This creates:
- 3 admin/manager/agent users (for testing different roles)
- 5 sample clients with various statuses
- 10 sample invoices with mixed payment statuses
- 8 sample payments
- 6 sample recovery actions

---

## API Documentation

### Swagger UI (Interactive)

Once the server is running, visit:

```
http://localhost:3000/api/docs
```

Features:
- ✅ Try-it-out buttons for all endpoints
- ✅ Automatic JWT token injection
- ✅ Request/response schema validation
- ✅ Parameter documentation

### API Base URL

```
http://localhost:3000/api
```

---

## Core API Endpoints

### Authentication (`/auth`)
```
POST   /api/auth/register          → Create new user account
POST   /api/auth/login             → User login (returns JWT)
GET    /api/auth/me                → Current user profile
GET    /api/auth/users             → List all users (admin only)
PUT    /api/auth/users/:id/role    → Update user role (admin only)
```

### Clients (`/clients`)
```
GET    /api/clients                → List all clients (with pagination)
POST   /api/clients                → Create new client
GET    /api/clients/:id            → Get client details
PUT    /api/clients/:id            → Update client
DELETE /api/clients/:id            → Delete client
GET    /api/clients/:id/invoices   → Get client's invoices
```

### Invoices (`/invoices`)
```
GET    /api/invoices               → List all invoices
POST   /api/invoices               → Create new invoice
GET    /api/invoices/:id           → Get invoice details
PUT    /api/invoices/:id           → Update invoice (status changes)
DELETE /api/invoices/:id           → Delete invoice
```

### Payments (`/payments`)
```
GET    /api/payments               → List all payments
POST   /api/payments               → Record new payment (triggers auto-status update)
GET    /api/payments/:id           → Get payment details
PUT    /api/payments/:id           → Update payment (recalculates invoice status)
DELETE /api/payments/:id           → Delete payment
```

### Statistics (`/stats`) ⭐ NEW
```
GET    /api/stats/overview         → Overview metrics (CA, recovery rate, count)
GET    /api/stats/invoices-by-status → Breakdown by invoice status
GET    /api/stats/top-debtors      → Top 10 clients by outstanding amount
GET    /api/stats/monthly          → Monthly payment evolution trends
```

### Recovery Actions (`/recovery-actions`)
```
GET    /api/recovery-actions       → List all recovery actions
POST   /api/recovery-actions       → Create new action
GET    /api/recovery-actions/:id   → Get action details
PUT    /api/recovery-actions/:id   → Update action
DELETE /api/recovery-actions/:id   → Delete action
```

---

## Example API Calls

### 1. Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "agent"
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "_id": "60d5ec49c1234567890abcde",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "agent"
    }
  }
}
```

### 2. Create Client

```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Innovation SAS",
    "email": "info@techinnov.fr",
    "phone": "+33 1 23 45 67 89",
    "address": "123 Rue de la Tech, Paris",
    "siret": "12345678901234",
    "status": "actif"
  }'
```

### 3. Create Invoice

```bash
curl -X POST http://localhost:3000/api/invoices \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNumber": "INV-2024-001",
    "client": "60d5ec49c1234567890abcde",
    "amount": 5000,
    "dueDate": "2024-04-15"
  }'
```

**Auto-sets**: status = "impayée", remainingAmount = 5000

### 4. Record Payment (Auto-Updates Invoice)

```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoice": "60d5ec49c1234567890abcde",
    "amount": 3000,
    "method": "virement",
    "recordedBy": "60d5ec49c1234567890abcdf"
  }'
```

**Auto-updates**:
- Payment recorded
- Invoice.remainingAmount = 2000
- Invoice.status = "partiellement_payée" (partially paid)

### 5. Get Statistics Overview

```bash
curl -X GET http://localhost:3000/api/stats/overview \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "caTotal": 50000,
    "tauxRecouvrement": 65.2,
    "nbFactures": 15,
    "totalRecouvre": 32600,
    "totalEnAttendre": 17400
  }
}
```

---

## Running Tests

### Run All Tests

```bash
npm test
```

**Output**:
```
PASS tests/authController.test.js
PASS tests/invoiceController.test.js
PASS tests/paymentService.test.js
PASS tests/clientController.test.js

Test Suites: 4 passed, 4 total
Tests:       67 passed, 67 total
Snapshots:   0 total
Time:        1.534 s
```

### Run Specific Test Suite

```bash
npm test -- authController.test.js
npm test -- invoiceController.test.js
npm test -- paymentService.test.js
npm test -- clientController.test.js
```

### Test Coverage

```bash
npm run test:coverage
```

---

## Test Suites Overview

| Suite | Tests | Coverage |
|-------|-------|----------|
| **authController.test.js** | 13 | Register, login, token validation |
| **invoiceController.test.js** | 13 | Invoice CRUD, status changes, errors |
| **paymentService.test.js** | 16 | Payment creation, auto-status updates, validation |
| **clientController.test.js** | 28 | Client CRUD, filtering, agent assignment, invoices |
| **TOTAL** | **67** | **100% passing** ✅ |

---

## Project Architecture

### Directory Structure

```
recouvra-plus/
├── config/
│   ├── db.js                 → MongoDB connection
│   ├── jwtConfig.js          → JWT configuration
│   └── seed.js               → Database seeding script
├── models/
│   ├── User.js               → User schema (auth, roles)
│   ├── Client.js             → Client schema
│   ├── Invoice.js            → Invoice schema (with status enum)
│   ├── Payment.js            → Payment schema
│   └── recoveryAction.js     → Recovery action schema
├── services/
│   ├── clientService.js      → Client business logic
│   ├── invoiceService.js     → Invoice business logic
│   ├── paymentService.js     → Payment + auto-status updates ⭐
│   ├── recoveryActionService.js
│   └── statsService.js       → Statistics aggregations ⭐ NEW
├── controllers/
│   ├── authController.js     → Auth handlers
│   ├── clientController.js   → Client handlers
│   ├── invoiceController.js  → Invoice handlers
│   ├── paymentController.js  → Payment handlers
│   ├── recoveryActionController.js
│   └── statsController.js    → Stats handlers ⭐ NEW
├── routes/
│   ├── authRoutes.js         → Auth endpoints + Swagger docs
│   ├── clientRoutes.js       → Client endpoints + Swagger docs
│   ├── invoiceRoutes.js      → Invoice endpoints + Swagger docs
│   ├── paymentRoutes.js      → Payment endpoints + Swagger docs
│   ├── recoveryActionRoutes.js
│   └── statsRoutes.js        → Stats endpoints + Swagger docs ⭐ NEW
├── middlewares/
│   ├── authMiddleware.js     → JWT verification
│   ├── roleMiddleware.js     → Role-based access control
│   ├── validate.js           → Joi validation
│   ├── errorMiddleware.js    → Centralized error handling
│   └── methodNotAllowed.js   → 405 handler
├── validators/
│   ├── authValidator.js      → Auth Joi schemas
│   ├── clientValidator.js    → Client Joi schemas
│   ├── invoiceValidator.js   → Invoice Joi schemas
│   ├── paymentValidator.js   → Payment Joi schemas
│   └── recoveryActionValidator.js
├── swagger/
│   └── swaggerConfig.js      → OpenAPI 3.0 configuration
├── tests/
│   ├── authController.test.js
│   ├── invoiceController.test.js
│   ├── paymentService.test.js
│   └── clientController.test.js
├── app.js                    → Express app configuration
├── package.json
├── .env.example
└── README.md
```

---

## Architecture Pattern

**Layered Architecture**:

```
Request → Routes (Swagger docs) 
       ↓
   Controllers (HTTP handlers)
       ↓
   Services (Business logic)
       ↓
   Models (Mongoose schemas)
       ↓
   MongoDB Database
       ↓
   Response (Auto-calculated values)
```

**Example Flow - Recording a Payment**:
1. POST /api/payments with { invoice, amount }
2. Controller validates JWT + Joi schema
3. Service checks: Invoice exists, not paid, amount valid
4. Service creates Payment record
5. Service **automatically updates** Invoice.remainingAmount
6. Service **automatically updates** Invoice.status
7. Next call to /api/stats/overview reflects change
8. Tests verify: paymentService.test.js (16 tests)

---

## Authentication & Authorization

### JWT Tokens

- **Scheme**: Bearer token in Authorization header
- **Expiration**: 7 days
- **Payload**: { userId, email, role }

### Roles

| Role | Permissions |
|------|------------|
| **admin** | All endpoints, user management |
| **manager** | All endpoints except user management |
| **agent** | Client, invoice, payment endpoints (view/create only) |

### Example: Using JWT Token

```bash
# Get token from login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Use token in subsequent requests
curl -X GET http://localhost:3000/api/clients \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## Automatic Status Updates

### Invoice Status Transitions

When a payment is recorded, the invoice status **automatically updates**:

```
Initial:           amount: 5000, status: "impayée"

After 3000 paid:   remainingAmount: 2000, status: "partiellement_payée"

After 2000 paid:   remainingAmount: 0, status: "payée" (fully paid)
```

**Benefit**: Eliminates manual status updates, ensures consistency.

**Tests**: `paymentService.test.js` validates all transitions with 16 tests.

---

## Statistics Features

### 1. Overview Metrics

```
GET /api/stats/overview

{
  "caTotal": 50000,              // Total invoices issued
  "tauxRecouvrement": 65.2,      // Recovery rate (%)
  "nbFactures": 15,               // Total invoices
  "totalRecouvre": 32600,        // Amount collected
  "totalEnAttendre": 17400       // Amount pending
}
```

### 2. Invoices by Status

```
GET /api/stats/invoices-by-status

Returns breakdown of invoices with:
- Count per status
- Total amounts
- Collected vs remaining
```

### 3. Top Debtors

```
GET /api/stats/top-debtors

Returns top 10 clients by outstanding amount with:
- Client details
- Total invoices
- Total remaining amount
```

### 4. Monthly Evolution

```
GET /api/stats/monthly

Returns payment trends by month:
- Total payments per month
- Payment count per month
```

---

## Data Validation

All endpoints validate input data using **Joi schemas**:

```javascript
// Example: Invoice validator
const invoiceSchema = Joi.object({
  invoiceNumber: Joi.string().required(),
  client: Joi.string().required(),
  amount: Joi.number().positive().required(),
  dueDate: Joi.date().required(),
  status: Joi.string().enum(['impayée', 'partiellement_payée', 'payée', 'en_retard', 'annulée'])
});
```

**Benefits**:
- Consistent error messages
- Type checking
- Business rule validation
- Detailed validation errors

---

## Error Handling

Centralized error middleware returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

**HTTP Status Codes**:
- `200` → Success
- `201` → Created
- `400` → Validation error
- `401` → Unauthorized (missing/invalid token)
- `403` → Forbidden (insufficient role)
- `404` → Not found
- `500` → Server error

---

## Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/recouvra
# OR for Atlas
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/recouvra

# JWT
JWT_SECRET=your_secret_key_here_min_32_chars
JWT_EXPIRES_IN=7d
```

---

## Development Tips

### Enable Auto-Reload

```bash
npm run dev
```

Uses **Nodemon** to restart server on file changes.

### Test During Development

```bash
npm test -- --watch
```

Reruns tests on file changes.

### Debug Mode

Add `console.log()` or use VS Code debugger:

```bash
node --inspect app.js
```

---

## Deployment

1. **Set environment variables** on production server
2. **Ensure MongoDB** is accessible
3. **Start server**:

   ```bash
   npm start
   ```

4. **Optional**: Use process manager like PM2

   ```bash
   npm install -g pm2
   pm2 start app.js --name recouvra-plus
   ```

---

## API Response Format

All responses follow a consistent structure:

**Success**:
```json
{
  "success": true,
  "data": { /* payload */ }
}
```

**Error**:
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | 4.19.2 | Web framework |
| mongoose | 8.4.0 | MongoDB ODM |
| jsonwebtoken | 9.0.2 | JWT auth |
| bcryptjs | 2.4.3 | Password hashing |
| joi | 17.13.1 | Data validation |
| swagger-jsdoc | 6.2.8 | Swagger docs |
| swagger-ui-express | 5.0.1 | Swagger UI |
| jest | 29.7.0 | Testing framework |
| supertest | 7.0.0 | HTTP testing |
| nodemon | 3.1.14 | Dev auto-reload |

---

## Quick Start Checklist

- [ ] Install Node.js v22+ and MongoDB
- [ ] `git clone` repository
- [ ] `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] `mongod` (start MongoDB)
- [ ] `npm run seed` (optional: load test data)
- [ ] `npm run dev` (start server)
- [ ] Visit `http://localhost:3000/api/docs` (Swagger)

---

## Support & Documentation

- **Swagger UI**: `http://localhost:3000/api/docs`
- **Project Breakdown**: See `PROJECT_BREAKDOWN.md`
- **Git History**: View commits for implementation details

---

## License

MIT

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


