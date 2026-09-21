# Renaissance server1

Standalone Express + MongoDB backend foundation for the Renaissance 2026 campus ambassador and event flows.

This service intentionally lives beside the existing `server/` directory and does not modify it.

## Requirements

- Node.js 20.11+
- MongoDB 6+ or MongoDB Atlas

## Local setup

```bash
cd RENAISSANCE-ECELL-2026/server1
npm install
```

Copy `.env.example` to `.env`, then replace the MongoDB URI and both JWT secrets with real values.

On PowerShell:

```powershell
Copy-Item .env.example .env
```

Generate secure secrets with Node:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Use a different generated value for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.

Start development mode:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

## Health endpoints

- `GET /api/v1/health` confirms that the HTTP service is running.
- `GET /api/v1/ready` returns HTTP 200 only when MongoDB is connected, otherwise HTTP 503.

Default local URL:

```text
http://localhost:5001/api/v1/health
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | `development`, `test`, or `production` |
| `PORT` | HTTP port, defaults to `5001` |
| `CLIENT_ORIGIN` | Allowed frontend origin(s), comma separated |
| `MONGODB_URI` | MongoDB/Atlas connection string |
| `JWT_ACCESS_SECRET` | Access-token signing secret reserved for auth implementation |
| `JWT_REFRESH_SECRET` | Refresh-token signing secret reserved for auth implementation |
| `TRUST_PROXY_HOPS` | Trusted reverse-proxy hop count; keep `0` locally |
| `REQUEST_BODY_LIMIT` | Express JSON/form body limit |
| `MONGO_SERVER_SELECTION_TIMEOUT_MS` | MongoDB connection selection timeout |
| `MONGO_MAX_POOL_SIZE` | Maximum MongoDB connection pool size |
| `MONGO_MIN_POOL_SIZE` | Minimum MongoDB connection pool size |

## Commands

```bash
npm run check
npm test
npm run dev
npm start
```

## Part 2 data model

The service now includes MongoDB models for the campus ambassador workflow:

- `CampusAmbassador` for ambassador identity, college, credential hash and account status.
- `PromoCode` for unique ambassador-linked promo codes, discount rules and usage counters.
- `Task` for assigned ambassador missions, status and completion remarks.
- `Registration` for participant registration records and durable promo/referral attribution.

Critical identifiers use MongoDB unique indexes. Registration money values are stored in paise as integers rather than floating-point currency values. Promo attribution stores the promo code, promo document reference and ambassador reference together so historical referral ownership remains intact.

Indexes are created explicitly after MongoDB connects; Mongoose automatic indexing is disabled for the connection to keep index management predictable.

## Part 3 ambassador authentication

Campus Ambassador authentication is now handled by the backend with Argon2id password hashing, short-lived access JWTs, rotating refresh JWTs and HTTP-only cookies.

Endpoints:

- `POST /api/v1/ambassador/auth/login`
- `POST /api/v1/ambassador/auth/refresh`
- `POST /api/v1/ambassador/auth/logout`
- `GET /api/v1/ambassador/auth/me`
- `POST /api/v1/ambassador/auth/change-password`

Access and refresh cookies are HTTP-only. Refresh sessions are stored as SHA-256 token hashes in MongoDB, rotate on refresh, expire through a MongoDB TTL index and are revoked after a password change. Access tokens may also be supplied as `Authorization: Bearer <token>` for non-browser clients.

New ambassadors default to `mustChangePassword: true`. Changing the password increments the account authentication version, revokes previous refresh sessions and issues a fresh authenticated session.

Until the Admin API exists, a first ambassador can be created from the command line without storing a plaintext password:

```bash
npm run ambassador:create -- --id=CA-RNX-0001 --name="Campus Captain" --email=captain@example.com --college="MNNIT Allahabad"
```

The command generates a strong temporary password and prints it once. The ambassador must change it after logging in.

For a frontend and API hosted on different sites (for example Vercel + Render), production cookies generally require:

```env
AUTH_COOKIE_SAME_SITE=none
AUTH_COOKIE_SECURE=true
```

`AUTH_COOKIE_SECURE` is forced on whenever `NODE_ENV=production`. Keep the frontend origin explicitly listed in `CLIENT_ORIGIN`.

## Part 4 ambassador portal APIs

Authenticated ambassadors who have completed their required first password change can now use the real dashboard APIs:

- `GET /api/v1/ambassador/dashboard` returns ambassador profile data, the primary promo code, task counts and referral counts.
- `GET /api/v1/ambassador/promo-code` returns the ambassador's primary promo code and its effective availability state.
- `GET /api/v1/ambassador/tasks?page=1&limit=20&status=ASSIGNED` lists only tasks owned by the authenticated ambassador.
- `GET /api/v1/ambassador/tasks/:taskId` reads one owned task.
- `PATCH /api/v1/ambassador/tasks/:taskId/status` updates task progress without allowing completed tasks to be reopened by an ambassador.
- `PATCH /api/v1/ambassador/tasks/:taskId/remarks` updates remarks and/or completion details.
- `GET /api/v1/ambassador/referrals?page=1&limit=20&status=VERIFIED` returns referral statistics and a privacy-limited registration list.

Task statuses follow `ASSIGNED -> IN_PROGRESS -> COMPLETED`. An ambassador may also complete an assigned task directly. Completed tasks cannot be moved backwards through ambassador APIs; future Admin APIs can own exceptional corrections.

Referral responses intentionally exclude participant email, phone number, transaction IDs, payment screenshots and payment verification information. Attribution is scoped by the authenticated ambassador's MongoDB ID instead of trusting a promo code or ambassador ID supplied by the client.

All portal routes require a valid ambassador access token and reject access while `mustChangePassword` remains true. State-changing task routes additionally require an allowed frontend origin.


## Part 5: Admin management APIs

Create the first admin with:

```bash
npm run admin:create -- --name="Main Admin" --email=admin@example.com --role=SUPER_ADMIN
```

Admin authentication lives under `/api/v1/admin/auth`. Protected management APIs live under `/api/v1/admin` and cover ambassadors, promo codes, task assignment/progress, and promo-attributed registrations. Deleting an ambassador archives the account instead of destroying historical referral/task links.
