# Model: Endorsement

Represents an endorsement entity in the application, typically used to record a user's endorsement (such as a vote or support) for a post. This model includes metadata such as the value of the endorsement, status, IP address, user agent, and soft deletion support.

## Properties

| Name         | Type      | Description                                                                 |
|--------------|-----------|-----------------------------------------------------------------------------|
| value        | number    | The value of the endorsement (e.g., +1, -1). Required.                      |
| status       | string    | The status of the endorsement (e.g., 'active', 'pending'). Required.        |
| ip_address   | string    | The IP address from which the endorsement was made. Required.               |
| user_agent   | string    | The user agent string of the endorser's browser/device. Required.           |
| deleted      | boolean   | Soft delete flag. If true, the endorsement is considered deleted.           |
| data         | object    | Optional additional data in JSONB format.                                   |
| created_at   | Date      | Timestamp when the endorsement was created.                                 |
| updated_at   | Date      | Timestamp when the endorsement was last updated.                            |
| user_id      | number    | Foreign key referencing the User who made the endorsement.                  |
| post_id      | number    | Foreign key referencing the Post being endorsed.                            |

## Table Configuration

- **Table Name:** `endorsements`
- **Timestamps:** Enabled (`created_at`, `updated_at`)
- **Underscored:** Field names use snake_case in the database.
- **Default Scope:** Only includes records where `deleted` is `false`.

## Indexes

| Fields                | Condition                | Description                                      |
|-----------------------|-------------------------|--------------------------------------------------|
| user_id, post_id      | deleted: false          | Optimizes lookups for active endorsements by user and post. |
| user_id, deleted      | None                    | Optimizes queries filtering by user and deletion status.    |

## Associations

| Association Type | Target Model | Foreign Key | Description                                 |
|------------------|-------------|-------------|---------------------------------------------|
| belongsTo        | Post        | post_id     | Each endorsement is linked to a single post.|
| belongsTo        | User        | user_id     | Each endorsement is linked to a single user.|

## Example

```javascript
const Endorsement = sequelize.models.Endorsement;

// Creating a new endorsement
const endorsement = await Endorsement.create({
  value: 1,
  status: 'active',
  ip_address: '192.168.1.1',
  user_agent: 'Mozilla/5.0',
  user_id: 123,
  post_id: 456
});
```

## Notes

- The model uses soft deletion via the `deleted` boolean flag. By default, queries exclude deleted records.
- The `data` field allows for flexible storage of additional metadata in JSONB format.
- The model is defined using Sequelize's legacy classMethods/associate pattern for associations.

---

**See also:**
- [User](./User.md)
- [Post](./Post.md)
- [Sequelize Documentation: Model Definition](https://sequelize.org/master/manual/model-basics.html)