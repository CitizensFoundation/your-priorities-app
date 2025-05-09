# Utility Module: seedAllModels Script

This file is a comprehensive database seeding and synchronization script for a Node.js/TypeScript project using Sequelize ORM. It is designed to:

- Forcefully synchronize (drop and recreate) the main and PolicySynth databases.
- Dynamically load and associate all Sequelize models.
- Create compound indexes for performance.
- Seed the database with an initial user and domain, using credentials provided via command-line arguments.
- Integrate with PolicySynth models (see [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts) and related models).

> **Note:** This script is intended for development and initial setup. It is destructive (drops all tables) and should not be run in a production environment unless you intend to reset the database.

---

## Configuration

### Environment Variables

| Name                      | Type   | Description                                                                 | Required (dev/prod) |
|---------------------------|--------|-----------------------------------------------------------------------------|---------------------|
| NODE_ENV                  | string | Set to `"development"` or `"production"`.                                   | Yes                 |
| DATABASE_URL              | string | Postgres connection string (used in production).                            | Yes (prod)          |
| DISABLE_PG_SSL            | string | If set, disables SSL for Postgres in production.                            | No                  |
| YP_DEV_DATABASE_NAME      | string | Database name for development.                                              | Yes (dev)           |
| YP_DEV_DATABASE_USERNAME  | string | Database username for development.                                          | Yes (dev)           |
| YP_DEV_DATABASE_PASSWORD  | string | Database password for development.                                          | Yes (dev)           |
| YP_DEV_DATABASE_HOST      | string | Database host for development.                                              | Yes (dev)           |
| YP_DEV_DATABASE_PORT      | string | Database port for development.                                              | Yes (dev)           |

### Command-Line Arguments

| Position | Name     | Type   | Description                        | Required |
|----------|----------|--------|------------------------------------|----------|
| 0        | username | string | Email/username for the new user    | Yes      |
| 1        | password | string | Password for the new user          | Yes      |

---

## Exported Functions

### seedAllModels

Seeds and synchronizes the main and PolicySynth databases, creates a user and domain, and sets up indexes.

#### Parameters

_None (reads from environment and process.argv)_

#### Returns

- `Promise<void>`

#### Description

- Synchronizes (drops and recreates) all tables in the main and PolicySynth databases.
- Loads all models from `../models` and `../services/models`.
- Associates models and creates compound indexes.
- Creates a user and a domain, associating the user as both a user and admin of the domain.
- Closes all database connections on completion or error.

#### Example Usage

```bash
node seedModelsScript.js user@example.com password123
```

---

## Internal Functions

### createMainCompoundIndexes

Creates a set of compound indexes on the main database for performance.

| Name              | Type      | Description                        |
|-------------------|-----------|------------------------------------|
| sequelizeInstance | Sequelize | The Sequelize instance to use.     |
| indexCommands     | string[]  | Array of SQL index creation commands.|

#### Returns

- `Promise<void>`

---

### syncMainDatabase

Synchronizes the main database schema, loads models, associates them, and creates indexes.

#### Returns

- `Promise<void>`

---

### syncPolicySynthDatabase

Synchronizes the PolicySynth database schema and associates its models.

#### Returns

- `Promise<void>`

---

## Main Models and PolicySynth Models

The script loads and associates the following PolicySynth models:

- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)
- [PsAiModel](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/aiModel.ts)
- [PsAgentClass](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentClass.ts)
- [PsExternalApiUsage](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/externalApiUsage.ts)
- [PsExternalApi](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/externalApis.ts)
- [PsModelUsage](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/modelUsage.ts)
- [PsAgentAuditLog](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentAuditLog.ts)
- [PsAgentConnector](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentConnector.ts)
- [PsAgentConnectorClass](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentConnectorClass.ts)
- [PsAgentRegistry](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agentRegistry.ts)

---

## Compound Indexes

A large set of compound indexes are created for various tables to optimize query performance. These are defined in the `mainCompoundIndexCommands` array and executed after schema synchronization.

---

## Error Handling

- The script will exit with a non-zero code if any required environment variables are missing, if model loading fails, or if any step in the process throws an error.
- All errors are logged to the console.

---

## Exported Constants

| Name           | Type      | Description                                      |
|----------------|-----------|--------------------------------------------------|
| seedAllModels  | Function  | Main exported function for seeding and syncing.  |

---

## Example Usage

```bash
# In development
export YP_DEV_DATABASE_NAME=mydb
export YP_DEV_DATABASE_USERNAME=myuser
export YP_DEV_DATABASE_PASSWORD=mypass
export YP_DEV_DATABASE_HOST=localhost
export YP_DEV_DATABASE_PORT=5432
node seedModelsScript.js user@example.com password123

# In production
export NODE_ENV=production
export DATABASE_URL=postgres://user:pass@host:5432/dbname
node seedModelsScript.js admin@example.com supersecret
```

---

## Notes

- The script expects all models to be defined as default exports in `.cjs` files in the `../models` and `../services/models` directories.
- The script is destructive: it will drop and recreate all tables in the main and PolicySynth databases.
- The script is intended for initial setup, development, or testing environments.

---

## See Also

- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)
- [Sequelize Documentation](https://sequelize.org/master/)
- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
- [crypto Documentation](https://nodejs.org/api/crypto.html)
