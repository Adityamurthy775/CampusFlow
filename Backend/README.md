# CampusFlow Backend

The CampusFlow backend is an Express 5 REST API backed by MongoDB through Mongoose. It provides authentication, role-based authorization, academic records, assignments and submissions, attendance, events, announcements, requests, rooms, timetables, and placement workflows.

## 🏗️ Backend architecture

Requests follow the pipeline **HTTP middleware → mounted router → controller → Mongoose model → MongoDB**. Middleware parses JSON/cookies, enforces origin and rate-limit policies, checks database readiness, and maps Mongoose errors to HTTP responses.

[![CampusFlow backend request architecture](../docs/diagrams/campusflow-architecture.png)](../docs/diagrams/campusflow-architecture.html)

More detailed views:

- [Browser request flow](../docs/diagrams/campusflow-request-flow.html)
- [JWT authentication sequence](../docs/diagrams/campusflow-authentication-sequence.html)
- [Frontend integration guide](../Frontend/README.md)

## 🛠️ Stack

- Node.js and ES modules
- Express 5
- Mongoose 9 and MongoDB
- bcryptjs for password hashing
- jsonwebtoken for one-day JWT sessions
- Multer for validated file uploads
- cookie-parser for HTTP-only authentication cookies

## 🚀 Getting started

### Prerequisites

- Node.js 20+
- npm
- MongoDB running locally, or a reachable MongoDB connection string

### Install and run

```bash
cd Backend
npm install
npm run dev
```

The server listens on `PORT` or `4000`. It starts listening immediately and retries MongoDB every 10 seconds after a connection failure. While the database is unavailable:

- `GET /` returns API liveness.
- `GET /health` returns `503` with a degraded status.
- Data routes return `503 DATABASE_UNAVAILABLE`.

### Environment

Create `Backend/.env` as needed:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/campusflow
MONGO_DIRECT_URI=
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
```

`MONGO_DIRECT_URI` is optional and takes precedence over `MONGO_URI`; it can be used for a direct replica-set connection when an Atlas SRV hostname is unavailable. Use secure cookies and an appropriate same-site policy when deploying over HTTPS.

## 📁 Project structure

```text
Backend/
├── server.js              # App setup, middleware, route mounting, DB connection
├── Apis/                  # Express routers and route-level authorization
├── middleware/            # Auth, rate limiting, and upload handling
├── modules/               # Mongoose schemas and models
├── req/                   # Manual HTTP requests for VS Code REST Client
├── seed-*.js              # Demo data seed scripts
├── verify-seed-data.js    # Seed verification script
└── uploads/               # Runtime upload directory
```

## 🔐 Authentication and authorization

- Public registration creates student accounts only.
- Passwords are hashed with bcryptjs using 12 rounds.
- Successful login issues a one-day JWT in an HTTP-only cookie.
- `verifyToken(...roles)` validates the cookie, reloads the active user, and checks role access.
- Data APIs are mounted under `/user-api`, `/student-api`, `/faculty-api`, `/college-api`, `/dept-api`, `/course-api`, `/subject-api`, `/room-api`, `/timetable-api`, `/assignment-api`, `/submission-api`, `/attendance-api`, `/announcement-api`, `/event-api`, `/company-api`, `/drive-api`, and `/request-api`.

Role checks are enforced inside the routers; a route's use of authentication and ownership/management checks should be reviewed before changing it.

## 📦 Data and uploads

Mongoose models represent users and the related college, academic, attendance, activity, request, and placement collections. File-backed workflows use `middleware/upload.js`, which limits uploads to one file up to 10 MB and allows a fixed set of document, image, and archive extensions.

## ✅ Commands

| Command | Purpose |
|---|---|
| `npm start` | Run the server with Node |
| `npm run dev` | Run with Node's watch mode |
| `npm run seed:demo` | Seed the demo user |
| `npm run seed:academic` | Seed academic data idempotently |
| `npm run seed:content` | Seed supporting demo content |
| `npm run seed:all` | Run all seed scripts in order |
| `npm run verify:data` | Verify seeded records and relationships |

`npm test` is not configured as a passing check in the current project.

## ⚙️ Rate limiting

`middleware/rateLimiter.js` uses an in-memory per-IP window of **300 requests per 60 seconds** for the entire Express app. Exceeding the limit returns HTTP `429` with `limit`, `retryAfter`, and `resetAt`. Use a shared store such as Redis if the API is scaled across multiple processes or hosts.