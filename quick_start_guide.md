# Local Development Quick Start

## 0) Environment variables
Copy example environment files to correct locations

From repo root:

```bash
cp development/docker/.env-dist development/docker/.env
cp development/docker/plausible-conf.env.dist development/docker/plausible-conf.env
cp server_api/startWatchWithEnv.sh-dist server_api/startWatchWithEnv.sh
cp server_api/startWorkerWithEnv.sh-dist server_api/startWorkerWithEnv.sh
```

1. Set the following variables in `server_api/startWatchWithEnv.sh` and `server_api/startWorkerWithEnv.sh`:

   - `YP_DEV_DATABASE_NAME`: yrpri_dev
   - `YP_DEV_DATABASE_USERNAME`: postgres
   - `YP_DEV_DATABASE_PASSWORD`: postgres
   - `YP_DEV_DATABASE_HOST`: localhost

2. Add the following variable to the same file:

   - `SESSION_SECRET`: A random string

3. Set the following variables in `development/docker/.env`:

   - `MINIO_ROOT_USER`: minio
   - `MINIO_ROOT_PASSWORD`: minio123

4. Set the following variables in `server_api/startWorkerWithEnv.sh`:

   - `AWS_ACCESS_KEY_ID`: minio
   - `AWS_SECRET_ACCESS_KEY`: minio123
   - `S3_REPORTS_BUCKET`: minio.yrpri.reports

5. Add the following variables to the same file:

   - `S3_ENDPOINT`: http://localhost:9012
   - `S3_FORCE_PATH_STYLE`: true

## 1) First-Time Setup (Do Once Per Machine/Clone)

### 1.1 Verify Required Tools

```bash
node -v
npm -v
docker compose version
```

Expected:
- Node.js installed (Node 22 is known to work)
- npm installed
- Docker Compose installed

### 1.2 Clone and Enter the Repo

```bash
git clone git@github.com:dxw/nesta-your-priorities.git
cd nesta-your-priorities
```

### 1.4 Ensure Required Ports Are Free

Postgres uses port 5432 and Redis uses port 6379 by default. Ensure nothing is already there:

```bash
lsof -nP -iTCP:5432 -sTCP:LISTEN
lsof -nP -iTCP:6379 -sTCP:LISTEN
```

Expected output: returns nothing if ports are unbound

If either port is already bound, stop the conflicting local process before continuing.

### 1.5 Install Node Dependencies

```bash
cd server_api && npm install --ignore-scripts
cd ../webApps/client && npm install --ignore-scripts
cd ../..
```

### 1.6 Setup first user

First, start both the server and client (see [Daily local run](#2-daily-local-run-normal-development-startup)).

> [!note]
> It appears to be necessary to start the client to create the first domain.

Then run the following to create a new domain and admin user:

```bash
YP_DEV_DATABASE_NAME=yrpri_dev YP_DEV_DATABASE_USERNAME=postgres YP_DEV_DATABASE_PASSWORD=postgres node server_api/ts-out/scripts/domains/createDomain.js 0 "here.com" "example"
YP_DEV_DATABASE_NAME=yrpri_dev YP_DEV_DATABASE_USERNAME=postgres YP_DEV_DATABASE_PASSWORD=postgres node server_api/ts-out/scripts/users/createUserAddDomain.js 1 your.email@here.com yourusername yourpassword
YP_DEV_DATABASE_NAME=yrpri_dev YP_DEV_DATABASE_USERNAME=postgres YP_DEV_DATABASE_PASSWORD=postgres node server_api/ts-out/scripts/setAdminOnAll.cjs your.email@here.com
```

### 1.7 Create the community and group

The landing page's buttons link to the idea submission form of group 1. Run the following to create a correctly-configured community and, within it, a correctly-configured group with that ID, with your user as their admin:

```bash
YP_DEV_DATABASE_NAME=yrpri_dev YP_DEV_DATABASE_USERNAME=postgres YP_DEV_DATABASE_PASSWORD=postgres node server_api/ts-out/scripts/custom/createCommunityAndGroup.js 1 your.email@here.com
```

## 2) Daily Local Run (Normal Development Startup)

Use three terminals.

### Terminal 1: Infrastructure (Docker)

```bash
cd development/docker
docker compose up db redis minio mc -d
```

Postgres, Redis, and MinIO should respond to healthchecks, and `mc` should have completed successfully:

```bash
docker exec postgres pg_isready -U postgres -d yrpri_dev # Should show "/var/run/postgresql:5432 - accepting connections"
docker exec redis redis-cli ping # Should show "PONG"
curl -I http://localhost:9012/minio/health/live # Should show "HTTP/1.1 200 OK"
docker compose ps -a mc # Should show STATUS of "Exited (0)"
```

> [!note]
> MinIO provides a local S3, and `mc` configures it to have the right buckets (probably only needed once).

Optional full local stack:

```bash
docker compose up db redis minio mc elasticsearch mail -d
```

### Terminal 2: Backend API

```bash
cd server_api
./startWatchWithEnv.sh
```

The script sets up environment variables, builds typescript code and
watches for changes to files and restarts the server if necessary.

Expected backend startup signal:
- Your Priorities Platform API Server listening on 0.0.0.0:4242

### Terminal 3: Frontend Webapp

```bash
cd webApps/client
npm run start
```

Expected frontend startup signal:
- Web Dev Server started...
- Local: http://localhost:4444/

### Optional Terminal 4: Worker

Start only when needed for worker features.

```bash
cd server_api
./startWorkerWithEnv.sh
```

### Using the app

To submit an idea as a member of the public:

1. Visit http://localhost:4444 to see the public homepage.
2. Follow the "Tell us your idea" link.
3. Fill in the form and submit it.

To view submitted ideas in the admin site:

1. Visit http://localhost:4444/user/login and log in using the admin email address (your.email@here.com) and password (yourpassword) that you set earlier.
2. Visit http://localhost:4444/admin/group/1 and then navigate to Moderation → Manage all content.

## 3) Testing the New vs Legacy Client (`useNewVersion`)

`server_api` actually serves **two independent, separately-built client apps**: an old
legacy app, and the current Lit SPA in `webApps/client`. Which one a given request gets
is decided per-request/session by `determineVersion()` in `server_api/src/app.ts`,
checked in this order:

1. `?useNewVersion=true` or `?useNewVersion=false` query parameter
2. A sticky session flag (set automatically once the query parameter has been used)
3. The domain's `configuration.useNewVersion` setting
4. **Default: `false` (legacy app)** if none of the above are set

Two things this means in practice:

- **The `wds` dev flow above (`localhost:4444`) bypasses this entirely.** It has no
  backend/session, so it can never reflect `useNewVersion` behaviour. To exercise the
  new client through the real backend (auth, DB, sessions), hit `localhost:4242` and
  set `?useNewVersion=true` once — it will stick for the rest of your session.
- **`server_api/webAppsDist/client/dist` is a git-committed, manually rebuilt
  artifact, not something compiled live.** It's refreshed by running `npm run build`
  in `webApps/client` and committing the result (look for "New dist" in git log — a
  long-standing manual convention; there is no CI that does this automatically). It can
  go stale for weeks at a time. If testing via `localhost:4242?useNewVersion=true`
  doesn't reflect your latest `webApps/client/src` changes, rebuild it locally
  (`cd webApps/client && npm run build`) before assuming the code itself is broken.

## 4) Verify Local Baseline

Backend:

```bash
curl -i --max-time 10 http://localhost:4242/api/users/has/AutoTranslation
```

Frontend:

```bash
curl -I --max-time 10 http://localhost:4444/
```

Expected: both return HTTP 200.

Note: the backend endpoint may return an HTML "New Domain" page while still being healthy in local mode. Treat HTTP 200 as the pass condition.

## 5) Recovery and Reset

### 5.1 If Backend Fails Due to Stale Local Schema/State

```bash
cd development/docker
docker compose down -v
docker compose up db redis -d
cd ../../server_api
./startWatchWithEnv.sh
```

If startup fails with:

Cannot migrate: table "domains" does not exist

use a version of server_api/src/migration.ts where local migrations skip missing base tables (isNeeded returns false instead of throwing). Then rerun:

```bash
cd server_api
npm run build:dev
./startWatchWithEnv.sh
```

### 5.2 If Frontend Fails with Rollup arm64 Package Error

```bash
cd webApps/client
npm i -D @rollup/rollup-darwin-arm64
npm run start
```

### 5.3 Stop Local Infrastructure

```bash
cd development/docker
docker compose down
```

## 6) Clearing database state
The database is not stored in the postgres container but a named mount (`db`)

To remove, run command below before re-building Docker containers:

```bash
cd development/docker
docker compose down -v --remove-orphans
```
