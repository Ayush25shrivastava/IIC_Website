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

- `CampusAmbassador` for ambassador identity, college, readable password and account status.
- `PromoCode` for unique ambassador-linked promo codes, discount rules and usage counters.
- `Task` for assigned ambassador missions, status and completion remarks.
- `Registration` for participant registration records and durable promo/referral attribution.

Critical identifiers use MongoDB unique indexes. Registration money values are stored in paise as integers rather than floating-point currency values. Promo attribution stores the promo code, promo document reference and ambassador reference together so historical referral ownership remains intact.

Indexes are created explicitly after MongoDB connects; Mongoose automatic indexing is disabled for the connection to keep index management predictable.

## Part 3 ambassador authentication

Campus Ambassador authentication uses a readable MongoDB `password` field, short-lived access JWTs, rotating refresh JWTs and HTTP-only cookies. New accounts created through the admin API, CLI or fixture script store the password without hashing. Anyone with access to these database records can read it. The field remains excluded from profile/list API responses and default Mongoose queries.

Existing `passwordHash` values are supported for compatibility. A successful sign-in saves the supplied password in `password` and removes `passwordHash`. Existing hashes cannot be decoded; accounts that have not signed in retain their legacy hash. Password changes also write the readable field. Admin account passwords continue to use Argon2id.

Endpoints:

- `POST /api/v1/ambassador/auth/login`
- `POST /api/v1/ambassador/auth/refresh`
- `POST /api/v1/ambassador/auth/logout`
- `GET /api/v1/ambassador/auth/me`
- `POST /api/v1/ambassador/auth/change-password`

Access and refresh cookies are HTTP-only. Refresh sessions are stored as SHA-256 token hashes in MongoDB, rotate on refresh, expire through a MongoDB TTL index and are revoked after a password change. Access tokens may also be supplied as `Authorization: Bearer <token>` for non-browser clients.

New ambassadors default to `mustChangePassword: false`; successful sign-in opens the dashboard directly. Changing the password increments the account authentication version, revokes previous refresh sessions and issues a fresh authenticated session.

A first ambassador can be created from the command line:

```bash
npm run ambassador:create -- --id=CA-RNX-0001 --name="Campus Captain" --email=captain@example.com --college="MNNIT Allahabad"
```

The command generates a password, prints it and stores it in the MongoDB document's `password` field. The ambassador can use it to sign in directly to the dashboard.

For a frontend and API hosted on different sites (for example Vercel + Render), production cookies generally require:

```env
AUTH_COOKIE_SAME_SITE=none
AUTH_COOKIE_SECURE=true
```

`AUTH_COOKIE_SECURE` is forced on whenever `NODE_ENV=production`. Keep the frontend origin explicitly listed in `CLIENT_ORIGIN`.

## Part 4 ambassador portal APIs

Authenticated ambassadors can use the real dashboard APIs immediately after sign-in:

- `GET /api/v1/ambassador/dashboard` returns ambassador profile data, the primary promo code, task counts and referral counts.
- `GET /api/v1/ambassador/promo-code` returns the ambassador's primary promo code and its effective availability state.
- `GET /api/v1/ambassador/tasks?page=1&limit=20&status=ASSIGNED` lists only tasks owned by the authenticated ambassador.
- `GET /api/v1/ambassador/tasks/:taskId` reads one owned task.
- `PATCH /api/v1/ambassador/tasks/:taskId/status` updates task progress without allowing completed tasks to be reopened by an ambassador.
- `PATCH /api/v1/ambassador/tasks/:taskId/remarks` updates remarks and/or completion details.
- `GET /api/v1/ambassador/referrals?page=1&limit=20&status=VERIFIED` returns referral statistics and a privacy-limited registration list.

Task statuses follow `ASSIGNED -> IN_PROGRESS -> COMPLETED`. An ambassador may also complete an assigned task directly. Completed tasks cannot be moved backwards through ambassador APIs; future Admin APIs can own exceptional corrections.

Referral responses intentionally exclude participant email, phone number, transaction IDs, payment screenshots and payment verification information. Attribution is scoped by the authenticated ambassador's MongoDB ID instead of trusting a promo code or ambassador ID supplied by the client.

All portal routes require a valid ambassador access token and an active account with the ambassador role. State-changing task routes additionally require an allowed frontend origin.


## Part 5: Admin management APIs

Create the first admin with:

```bash
npm run admin:create -- --name="Main Admin" --email=admin@example.com --role=SUPER_ADMIN
```

Admin authentication lives under `/api/v1/admin/auth`. Protected management APIs live under `/api/v1/admin` and cover ambassadors, promo codes, task assignment/progress, and promo-attributed registrations. Deleting an ambassador archives the account instead of destroying historical referral/task links.

Admin task status changes preserve the original start and completion timestamps;
reopening a completed task clears its completion timestamp. Reassigning to a different
ambassador resets progress, remarks and completion details and records a new assignment
time. Assigning to the current owner leaves progress intact. Completed tasks cannot be
reassigned. Admin edits, reassignment and deletion reject concurrent changes with
`409 TASK_CHANGED`; only untouched assigned tasks can be deleted.

## Dedicated Campus Ambassador dashboard

The client keeps `/renaissance/campus-ambassador` as its sign-in page and mounts the
protected dashboard at `/renaissance/campus-ambassador/dashboard`. The overview,
tasks and promo sections use URL hashes within that dedicated dashboard route.
Admin authentication remains separate at `/renaissance/campus-ambassador/admin`.

The dashboard restores the session through `/ambassador/auth/me`, refreshes expired
access cookies, and redirects invalid sessions to sign-in. Login requires an ACTIVE
account with the CAMPUS_AMBASSADOR role and checks its stored password (or converts a legacy hash after successful verification). Access JWTs now
include a session ID; every protected request checks the associated unrevoked,
unexpired MongoDB session. Logout revokes that session before reporting success,
so previously captured access tokens cannot continue to read protected data.

`PATCH /api/v1/ambassador/tasks/:taskId` accepts `{ status, remarks, completionDetails }`
and saves all three together. Ownership comes from the session. An optimistic
concurrency condition prevents changes racing another update or admin reassignment.
Existing status-only and remarks-only endpoints remain supported. Task responses
include optional `dueAt`; protected admin task creation/edit APIs accept an ISO date
or null, and the admin task creation form includes a due-date input.

### Configuration and compatibility

Use the existing variables from `.env.example`:

- Backend: `MONGODB_URI`, `CLIENT_ORIGIN`, distinct `JWT_ACCESS_SECRET` and
  `JWT_REFRESH_SECRET` (at least 32 characters each).
- Client: `VITE_SERVER1_API_URL`, including `/api/v1`. Rebuild the client after changing it.
- HTTPS production: `NODE_ENV=production` forces secure cookies. Set
  `AUTH_COOKIE_SAME_SITE=none` when the frontend and API are on different sites;
  configure the exact frontend origin in `CLIENT_ORIGIN`. Browser third-party cookie
  restrictions can require hosting the API on the same site.
- The existing Vercel SPA rewrite supports direct dashboard URLs. Other hosts must
  similarly serve `index.html` for client routes.

No mandatory database migration or new secret is required. Existing ambassador
records receive the role default when hydrated; old tasks return `dueAt: null`.
Existing access JWTs without a session ID are rejected and can be replaced through
a valid refresh session. Deploy the client and `server1` backend together.

Counts are read from `server1` MongoDB `registrations`, using immutable ambassador
and promo attribution. The primary promo response includes its own registration
count; overall referral metrics include every code assigned to the ambassador.
The separate public registration page still uses its existing client mock store;
that flow does not automatically create `server1` registration records. No fake
registrations or activity values are generated by this dashboard.

### Verification

```bash
npm test
npm run check
# Optional integration tests against a disposable MongoDB server:
MONGODB_TEST_URI=mongodb://127.0.0.1:27029 node --test tests/integration/ambassador.integration.test.js
```

Integration tests create a randomly named test database and remove that database
on completion. They cover database password verification, disabled/wrong-role
accounts, cookie privacy, real referral counts, task persistence, cross-account
read/write rejection, admin isolation, refresh rotation, direct first-login access and optional password
changes, and revoked/expired sessions. Without `MONGODB_TEST_URI`, the integration
suite is explicitly skipped. The fixture seed script is test-only; use the existing
`ambassador:create` command or protected admin interface for real accounts.

The integration suite also covers admin task creation with deadlines, progress
timestamp preservation, reopening, reassignment privacy, deletion restrictions and
concurrent admin/ambassador writes.

### Ambassador sign-in behavior

Ambassadors go directly to the dashboard after successful sign-in. The client and
ambassador API no longer require a password-change step. Existing accounts and
sessions with the legacy `mustChangePassword: true` flag also work immediately;
a successful login clears that flag. No data migration or password reset is needed.
Voluntary password changes remain available through the authenticated API.
The separate admin password-change policy is unchanged. Restart `server1` and
rebuild/restart the client when deploying this behavior.
