# PaymentApp — Server

A RESTful API server for the PaymentApp built with **Node.js**, **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**. Supports JWT authentication, wallet-to-wallet payments, and transaction ledger management.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Database Setup](#database-setup)
- [API Reference](#api-reference)
- [Running Tests](#running-tests)
- [Build & Deployment](#build--deployment)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

The server handles:

- **Authentication** — JWT-based register, login, and profile endpoints
- **Payments** — Wallet-to-wallet transfers with atomic Prisma transactions (balances update instantly, no double-spend)
- **Transactions** — Ledger entries (DEBIT/CREDIT/TOPUP) written for every balance change
- **User Search** — Look up a user by email before sending a payment
- **Balance Top-up** — Add funds to a user account (used in development; production would use a Stripe webhook flow)

Amounts are stored and transferred in **cents** (integer). `1000` = `$10.00`.

---

## Tech Stack

| Layer      | Technology                    |
| ---------- | ----------------------------- |
| Runtime    | Node.js 20+                   |
| Language   | TypeScript                    |
| Framework  | Express 4                     |
| ORM        | Prisma 5                      |
| Database   | PostgreSQL                    |
| Auth       | JWT (jsonwebtoken) + bcryptjs |
| Validation | Zod                           |
| Payments   | Stripe SDK (optional)         |
| Testing    | Jest + Supertest              |
| Dev server | tsx (watch mode)              |

---

## Folder Structure

```
server/
├── prisma/
│   ├── schema.prisma      # Database schema (User, Payment, Transaction)
│   └── seed.ts            # Seed script — creates test users with balance
├── src/
│   ├── app.ts             # Express app setup (middleware, routes)
│   ├── index.ts           # Server entry point
│   ├── config/
│   │   ├── index.ts       # Env-var config object
│   │   └── database.ts    # Prisma client singleton
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── payment.controller.ts
│   │   └── user.controller.ts
│   ├── middleware/
│   │   ├── auth.ts        # JWT authenticate middleware
│   │   ├── errorHandler.ts
│   │   └── validate.ts    # Zod schema validation middleware
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── payment.routes.ts
│   │   └── user.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── payment.service.ts # Atomic payment logic
│   │   └── stripe.service.ts  # Stripe helpers (for future card top-up)
│   ├── types/
│   │   ├── index.ts       # Shared TypeScript types
│   │   └── express.d.ts   # Express Request augmentation
│   └── utils/
│       ├── apiResponse.ts # sendSuccess / sendError / sendPaginated helpers
│       └── errors.ts      # AppError, NotFoundError, UnauthorizedError, etc.
└── __tests__/
    ├── auth.test.ts
    └── payment.test.ts
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable                | Required | Description                                  |
| ----------------------- | -------- | -------------------------------------------- |
| `PORT`                  | No       | Port to listen on (default: `4000`)          |
| `NODE_ENV`              | No       | `development` or `production`                |
| `DATABASE_URL`          | **Yes**  | PostgreSQL connection string                 |
| `JWT_SECRET`            | **Yes**  | Secret for signing JWT tokens                |
| `JWT_EXPIRES_IN`        | No       | Token expiry (default: `7d`)                 |
| `STRIPE_SECRET_KEY`     | No       | Stripe secret key (for future card features) |
| `STRIPE_WEBHOOK_SECRET` | No       | Stripe webhook signing secret                |
| `CLIENT_URL`            | No       | Allowed CORS origin in production            |

---

## Installation

**Prerequisites:** Node.js 20+, PostgreSQL running locally.

```bash
# From the server/ directory
npm install
```

---

## Running Locally

```bash
# Development (watch mode with tsx)
npm run dev

# Production (requires build first)
npm run build && npm start
```

The server starts on `http://localhost:4000` by default.

---

## Database Setup

```bash
# 1. Apply migrations
npm run db:migrate

# 2. Generate Prisma client
npm run db:generate

# 3. (Optional) Seed with test data
npm run db:seed
# Creates: alice@example.com, bob@example.com, carol@example.com
# All passwords: password123
# Balances: $1,000 / $500 / $750

# 4. (Optional) Open Prisma Studio
npm run db:studio
```

---

## API Reference

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

### Auth

| Method | Path                 | Auth | Description                   |
| ------ | -------------------- | ---- | ----------------------------- |
| POST   | `/api/auth/register` | —    | Create account                |
| POST   | `/api/auth/login`    | —    | Login, returns JWT            |
| GET    | `/api/auth/profile`  | ✓    | Get current user profile      |
| POST   | `/api/auth/topup`    | ✓    | Add balance (amount in cents) |

**Register / Login body:**

```json
{ "email": "user@example.com", "name": "Jane Doe", "password": "password123" }
```

**Topup body:**

```json
{ "amount": 10000 }
```

> `10000` cents = `$100.00`

### Payments

| Method | Path                | Auth | Description                        |
| ------ | ------------------- | ---- | ---------------------------------- |
| POST   | `/api/payments`     | ✓    | Send a payment                     |
| GET    | `/api/payments`     | ✓    | List all your payments (paginated) |
| GET    | `/api/payments/:id` | ✓    | Get payment by ID                  |

**Create payment body:**

```json
{
  "receiverEmail": "bob@example.com",
  "amount": 2500,
  "currency": "USD",
  "description": "Coffee money"
}
```

**List query params:** `?page=1&limit=20`

### Users

| Method | Path                       | Auth | Description            |
| ------ | -------------------------- | ---- | ---------------------- |
| GET    | `/api/users/search?email=` | ✓    | Check if a user exists |

### Health

| Method | Path          | Description                |
| ------ | ------------- | -------------------------- |
| GET    | `/api/health` | Returns `{ status: "ok" }` |

---

## Running Tests

```bash
npm test

# Watch mode
npm run test:watch
```

Tests are in `__tests__/` and use Supertest to hit the live Express app without a database connection (validation-layer tests only).

---

## Build & Deployment

```bash
# Compile TypeScript to dist/
npm run build

# Start production server
npm start
```

For production deployment:

1. Set `NODE_ENV=production` and all required env vars
2. Run `npx prisma migrate deploy` (not `migrate dev`)
3. Run `npm run db:generate` to generate the Prisma client
4. Start with `npm start`

---

## Troubleshooting

| Problem                            | Fix                                                                               |
| ---------------------------------- | --------------------------------------------------------------------------------- |
| `Error: ECONNREFUSED` on startup   | PostgreSQL is not running. Start it with `brew services start postgresql` (macOS) |
| `PrismaClientInitializationError`  | Check `DATABASE_URL` in `.env` is correct                                         |
| `401 Unauthorized` on all requests | JWT_SECRET in `.env` doesn't match the token. Re-login to get a fresh token       |
| `Insufficient balance` on payment  | Use `POST /api/auth/topup` with `{ "amount": 50000 }` to add $500                 |
| Migration drift errors             | Run `npm run db:migrate` to apply pending migrations                              |
