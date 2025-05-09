# Utility Module: commonIndexForActivitiesAndNewsFeeds

This utility module provides a function to generate a common index configuration for activities and news feeds database tables. The generated index is intended to optimize queries that filter by `post_id`, `user_id`, a customizable created-at field, and `id`, while also filtering for active and non-deleted records.

## Functions

| Name                              | Parameters                | Return Type | Description                                                                                 |
|------------------------------------|---------------------------|-------------|---------------------------------------------------------------------------------------------|
| commonIndexForActivitiesAndNewsFeeds | createdAtField: string    | Array<object> | Generates an array containing a single index configuration object for use in database models.|

---

## Function: commonIndexForActivitiesAndNewsFeeds

Generates a standard index configuration for use in activities and news feeds models. The index includes the fields `post_id`, `user_id`, a customizable created-at field, and `id`. It also applies a partial index condition to only include records where `status` is `'active'` and `deleted` is `false`.

### Parameters

| Name            | Type   | Description                                      |
|-----------------|--------|--------------------------------------------------|
| createdAtField  | string | The name of the created-at field to include in the index (e.g., `'created_at'`). |

### Returns

- **Type:** `Array<object>`
- **Description:** An array containing a single index configuration object suitable for use in ORM model definitions (e.g., Sequelize).

#### Example Return Value

```json
[
  {
    "fields": ["post_id", "user_id", "created_at", "id"],
    "where": {
      "status": "active",
      "deleted": false
    }
  }
]
```

### Usage Example

```javascript
const { commonIndexForActivitiesAndNewsFeeds } = require('./commonIndexForActivitiesAndNewsFeeds');

const indexes = commonIndexForActivitiesAndNewsFeeds('created_at');
// Use `indexes` in your ORM model definition
```

---

## Exported Members

| Name                                 | Type       | Description                                      |
|---------------------------------------|------------|--------------------------------------------------|
| commonIndexForActivitiesAndNewsFeeds  | function   | See above. Generates index configuration array.  |

---

## See Also

- [Sequelize Model Indexes Documentation](https://sequelize.org/docs/v6/other-topics/indexes/)
- [Node.js require() documentation](https://nodejs.org/api/modules.html#requireid)

---

**Note:**  
This utility is intended for use in model definitions where partial indexes are supported (e.g., PostgreSQL with Sequelize). The `createdAtField` parameter allows flexibility for models that use different names for their timestamp fields.