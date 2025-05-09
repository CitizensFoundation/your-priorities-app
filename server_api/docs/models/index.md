# Database Initialization and Model Loader

This module is responsible for initializing the Sequelize ORM, configuring the database connection, loading all model definitions, setting up model associations, and managing the creation of compound indexes for performance optimization. It also exposes the Sequelize instance and all loaded models for use throughout the application.

---

## Configuration

### Environment Variables

This module relies on several environment variables for configuration:

| Name                        | Type   | Description                                                                                 | Required |
|-----------------------------|--------|---------------------------------------------------------------------------------------------|----------|
| NODE_ENV                    | string | The current environment (`development`, `production`, etc.)                                 | No       |
| DATABASE_URL                | string | The full database connection URL (used in production)                                       | Yes (prod)|
| DISABLE_PG_SSL              | string | If set, disables SSL for Postgres in production                                             | No       |
| YP_DEV_DATABASE_NAME        | string | Database name for development                                                               | Yes (dev)|
| YP_DEV_DATABASE_USERNAME    | string | Database username for development                                                           | Yes (dev)|
| YP_DEV_DATABASE_PASSWORD    | string | Database password for development                                                           | Yes (dev)|
| YP_DEV_DATABASE_HOST        | string | Database host for development                                                               | Yes (dev)|
| YP_DEV_DATABASE_PORT        | string | Database port for development                                                               | Yes (dev)|
| FORCE_DB_SYNC               | string | If set, forces a full database sync and index creation                                      | No       |
| FORCE_DB_INDEX_SYNC         | string | If set, forces only index creation                                                          | No       |

---

## Exported Constants

| Name      | Type      | Description                                      |
|-----------|-----------|--------------------------------------------------|
| db        | object    | An object containing all loaded models, the Sequelize instance, and the Sequelize library. |
| sequelize | Sequelize | The Sequelize instance (as `db.sequelize`).      |
| Sequelize | Sequelize | The Sequelize library (as `db.Sequelize`).       |

---

## Database Connection

The module initializes a Sequelize connection based on the environment:

- **Production:** Uses `DATABASE_URL` and optionally enables SSL unless `DISABLE_PG_SSL` is set.
- **Development:** Uses individual environment variables for host, port, username, password, and database name.

All connections use the `postgres` dialect and have logging disabled.

---

## Operators Aliases

A set of operator aliases is defined for backward compatibility and convenience:

```js
const operatorsAliases = {
  $gt: Op.gt,
  $gte: Op.gte,
  $lt: Op.lt,
  $lte: Op.lte,
  $in: Op.in,
  $and: Op.and,
  $or: Op.or,
  $eq: Op.eq,
  $ne: Op.ne,
  $is: Op.is,
  $not: Op.not,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $like: Op.like,
  $contains: Op.contains,
  $any: Op.any,
};
```

---

## Model Loading

### Local Models

- All `.cjs` files (excluding `index.cjs` and type definition files) in the current directory are loaded as Sequelize models.

### External Models

- All `.cjs` files in `../services/models` are also loaded as Sequelize models.

### Model Association

- If a model exports an `associate` method, it is called with the `db` object to set up model relationships.

---

## Index Management

### Compound Indexes

A set of raw SQL commands is defined to create compound indexes for various tables to optimize query performance.

#### Function: `createCompoundIndexes`

Creates the defined indexes if they do not already exist.

#### Parameters

| Name           | Type     | Description                                 |
|----------------|----------|---------------------------------------------|
| indexCommands  | string[] | Array of SQL index creation commands        |

#### Usage

- Called automatically after syncing the database in development or if `FORCE_DB_SYNC` is set.
- Can also be triggered by setting `FORCE_DB_INDEX_SYNC`.

---

## Full-Text Index

- After syncing and index creation, `db.Post.addFullTextIndex()` is called to add a full-text index to the `Post` model (if implemented).

---

## Exported Object: `db`

The main export is an object with the following structure:

| Property   | Type      | Description                                      |
|------------|-----------|--------------------------------------------------|
| [ModelName]| Model     | Each loaded Sequelize model, keyed by name       |
| sequelize  | Sequelize | The Sequelize instance                           |
| Sequelize  | Sequelize | The Sequelize library                            |

---

## Utility Function

### createCompoundIndexes

Creates all compound indexes defined in the `compoundIndexCommands` array.

#### Parameters

| Name           | Type     | Description                                 |
|----------------|----------|---------------------------------------------|
| indexCommands  | string[] | Array of SQL index creation commands        |

#### Example

```js
await createCompoundIndexes(compoundIndexCommands);
```

---

## Example Usage

```javascript
const db = require('./models'); // Adjust path as needed

// Access a model
const User = db.User;

// Use Sequelize instance
db.sequelize.authenticate()
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Connection error:', err));

// Query using a model
User.findAll().then(users => {
  console.log(users);
});
```

---

## Notes

- This module is typically required once at application startup.
- All models and the Sequelize instance are available via the exported `db` object.
- Index creation is idempotent; errors for existing indexes are ignored.
- The module expects all models to be defined as functions accepting `(sequelize, DataTypes)` and returning a Sequelize model.

---

## See Also

- [Sequelize Documentation](https://sequelize.org/)
- [Sequelize Operators](https://sequelize.org/master/manual/model-querying-basics.html#operators)
- [Model Definition Example](./User.cjs.md) (replace with actual model documentation)
