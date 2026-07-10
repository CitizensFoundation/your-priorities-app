# Local Development Quick Start


## 0) Repo-Level Preconditions (Important)
Copy example environment files to the following locations.

From repo root:

```bash
cp development/docker/.env-dist development/docker/.env
cp development/docker/plausible-conf.env.dist development/docker/plausible-conf.env
```

Quick verification command:

```bash
docker compose -f development/docker/docker-compose.yml config -q
```

Expected: no output and exit code 0.

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

Docker needs host ports 5432 and 6379.

```bash
lsof -nP -iTCP:5432 -sTCP:LISTEN
lsof -nP -iTCP:6379 -sTCP:LISTEN
```

If either port is already bound, stop the conflicting local process before continuing.

Expected output: returns nothing if ports are unbound

### 1.5 Install Dependencies

```bash
cd server_api && npm install --ignore-scripts
cd ../webApps/client && npm install --ignore-scripts
cd ../..
```

## 2) Daily Local Run (Normal Development Startup)

Use three terminals.

### Terminal 1: Infrastructure (Docker)

```bash
cd development/docker
docker compose up db redis -d
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

Script behavior:
- exports local DB credentials and local sync settings
- exports local runtime defaults used by the API process
- runs build and asset copy (views/config/templates/locales)
- starts TypeScript watch + server restart loop

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

## 5) If data persists after removing Docker containers
The docker setup process creates, which causes database state to persist even after containers are deleted.

To remove, run command below before re-building Docker containers:

```bash
cd development/docker
docker compose down -v --remove-orphans
```

## 6) If Something Still Fails

1. Re-check the preconditions in section 0 (these are the most common repo-level blockers).
2. Re-run dependency install in both app packages: server_api and webApps/client.
3. Verify startup-script env defaults in server_api/startWatchWithEnv.sh and server_api/startWorkerWithEnv.sh.
