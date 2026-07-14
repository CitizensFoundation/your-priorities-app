# Local Development Quick Start

## 0) Environment variables
Copy example environment files to correct locations

From repo root:

```bash
cp development/docker/.env-dist development/docker/.env
cp development/docker/plausible-conf.env.dist development/docker/plausible-conf.env
```

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

### 1.6 Setup first user

Once you've started both the server and client (see below), run

`YP_DEV_DATABASE_NAME=yrpri_dev YP_DEV_DATABASE_USERNAME=postgres YP_DEV_DATABASE_PASSWORD=postgres node server_api/ts-out/scripts/users/createUserAddDomain.js 1 your.email@here.com yourusername yourpassword`

to create a new user, and `node server_api/ts-out/scripts/setAdminOnAll.cjs your.email@here.com` with the same environment variables to make that user an admin.

(It appears to be necessary to start the client to create the first domain)

## 2) Daily Local Run (Normal Development Startup)

Use three terminals.

### Terminal 1: Infrastructure (Docker)

```bash
cd development/docker
docker compose up db redis -d
```

Postgres and redis should respond to healthchecks:

```bash
docker exec postgres pg_isready -U postgres -d yrpri_dev
docker exec redis redis-cli ping
```

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

Worker env defaults align with backend local values above (including NODE_ENV and YP_DEV_DATABASE_*), but worker startup does not export SESSION_SECRET.

## 3) Verify Local Baseline

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

## 4) Recovery and Reset

### 4.1 If Backend Fails Due to Stale Local Schema/State

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

### 4.2 If Frontend Fails with Rollup arm64 Package Error

```bash
cd webApps/client
npm i -D @rollup/rollup-darwin-arm64
npm run start
```

### 4.3 Stop Local Infrastructure

```bash
cd development/docker
docker compose down
```

## 5) Clearing database state
The database is not stored in the postgres container but a named mount (`db`)

To remove, run command below before re-building Docker containers:

```bash
cd development/docker
docker compose down -v --remove-orphans
```