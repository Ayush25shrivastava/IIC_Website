# Campus Ambassador dashboard implementation

- `client/src/App.jsx`: nested sign-in and dedicated dashboard routes.
- `client/src/pages/CampusAmbassadorLayout.jsx`: session restoration, protected routing, expiry handling, logout and direct access after sign-in.
- `client/src/pages/CampusAmbassadorPortal.jsx`: reuses the existing sign-in design and authenticates through the backend.
- `client/src/pages/CampusAmbassadorDashboard.jsx` and `campus-ambassador.css`: responsive sky blue/peach dashboard, four sidebar actions, database metrics, promo copying, task filters and accessible task editing dialog. All chart values come from actual registrations.
- `client/src/lib/server1-api.js`: shared refresh request, network timeout and atomic task-update API.
- `client/src/pages/CampusAmbassadorAdmin.jsx`: optional task due date in the existing protected admin form.
- Removed unused `client/src/pages/CampusAmbassador.jsx`, which contained a demo login bypass.
- `server1/src/models`: ambassador role and optional task due date.
- `server1/src/controllers`, `middleware`, `services`, `routes`, `validators`, and `utils/tokens.js`: session-bound access tokens, logout revocation, generic login errors, ownership checks, atomic task updates and primary-code registration counts.
- `server1/tests/integration/ambassador.integration.test.js`: isolated MongoDB authentication and ownership tests.
- `server1/scripts/seed-ambassador.js`: restricted existing fixture script to tests, random generated password, no overwrite of existing accounts.

Setup and database compatibility details are in `server1/README.md`, under “Dedicated Campus Ambassador dashboard.” No mandatory migration or additional environment variable is needed beyond the existing client/API configuration.

The frontend production build, lint of changed frontend files, existing backend tests, and isolated database integration suite pass. Repository-wide frontend lint has 52 pre-existing errors in unrelated files. Browser verification uses disposable local database accounts, not production credentials. Production deployment, production cookies and the separate public registration ingestion flow were not verified.

Browser checks passed against the real local API and isolated MongoDB:

- Invalid credentials stay on sign-in; valid credentials navigate to the dedicated dashboard URL.
- Unauthenticated direct dashboard access redirects to sign-in; authenticated sign-in access redirects to the dashboard.
- Full reload preserves the session, task status, completion details and saved remarks.
- Sidebar sections navigate correctly; task editing, promo copying and empty states work.
- Logout returns to sign-in and protected API requests return 401.
- Server-side session invalidation returns to sign-in with a session-expiry message.
- Server outage displays a retryable service-unavailable state.
- Desktop (1280px), tablet (768px), and mobile (390px) were visually inspected; no page overflow was detected.
- The preview navigation and demo login bypass are absent from the ambassador flow.

The disposable browser-test database and API were cleaned up after verification.

Ambassador password changes are optional: successful login redirects directly to the dashboard, including existing accounts with the legacy password-change flag. The unused forced-change form and backend gate were removed; the admin policy is unchanged.

Completion checks on 2026-09-26:

- Fixed admin task timestamps: completing work retains its original start time; reopening clears completion time; repeated completion retains the original completion time.
- Reassigning to a different ambassador clears previous-owner remarks and proof, resets progress and updates the assignment time. Reassigning to the same owner preserves progress.
- Admin edits, reassignment and deletion use conditional writes to reject concurrent changes instead of overwriting newly saved progress.
- The admin task list shows deadlines and disables deletion for tasks with progress or notes.
- Added deadline validation and database-backed admin task lifecycle/concurrency tests.
- All 43 backend tests passed with the isolated MongoDB integration suite enabled; no tests were skipped. Backend syntax checks, frontend production build, lint of the ambassador frontend files and `git diff --check` passed.

The browser checks listed above were recorded during the earlier implementation;
this completion pass verified the build, lint and API/database behavior. The separate
public registration ingestion and production deployment remain outside this dashboard change.

Campus ambassador password storage was subsequently changed at the user's request:
new accounts and password changes store a readable `password` field in MongoDB.
Successful legacy-account login converts `passwordHash` to `password`; unreadable
legacy hashes cannot be recovered without the password. Profile/list responses and
default model queries still exclude credentials. Admin passwords remain hashed.
