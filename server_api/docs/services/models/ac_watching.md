# Model: AcWatching

Represents the `ac_watching` table in the database. This model is used to track "watching" relationships between users and various entities (such as communities, groups, posts, etc.) within the application. It includes priority and type fields, as well as a soft-delete mechanism.

## Properties

| Name        | Type      | Description                                                                 |
|-------------|-----------|-----------------------------------------------------------------------------|
| priority    | number    | The priority of the watching relationship. Required.                        |
| type        | number    | The type of watching relationship. Required.                                |
| deleted     | boolean   | Soft-delete flag. If `true`, the record is considered deleted. Defaults to `false`. |
| created_at  | Date      | Timestamp when the record was created.                                      |
| updated_at  | Date      | Timestamp when the record was last updated.                                 |

## Configuration

- **Table Name:** `ac_watching`
- **Timestamps:** Enabled (`created_at`, `updated_at`)
- **Underscored:** Field names use snake_case in the database.
- **Default Scope:** Only records where `deleted` is `false` are returned by default.

## Associations

| Association         | Model      | Foreign Key   | Description                                      |
|---------------------|------------|--------------|--------------------------------------------------|
| belongsTo           | Domain     | domain_id    | The domain associated with this watching record.  |
| belongsTo           | Community  | community_id | The community being watched.                      |
| belongsTo           | Group      | group_id     | The group being watched.                          |
| belongsTo           | Post       | post_id      | The post being watched.                           |
| belongsTo           | Point      | point_id     | The point being watched.                          |
| belongsTo           | User       | user_id      | The user who is watching.                         |
| belongsTo (as)      | User (as WatchingUser) | N/A | The user being watched (aliased as `WatchingUser`). |

## Methods

### AcWatching.watchCommunity

```typescript
static watchCommunity(community: any, user: any): void
```

Currently a placeholder method. Intended to implement logic for a user to watch a community.

| Parameter | Type | Description                |
|-----------|------|----------------------------|
| community | any  | The community to be watched.|
| user      | any  | The user who is watching.   |

## Example Usage

```javascript
const { AcWatching } = require('./models');

// Creating a new watching record
AcWatching.create({
  priority: 1,
  type: 2,
  user_id: 123,
  community_id: 456
});

// Querying all active (not deleted) watching records
AcWatching.findAll();
```

## Export

This model is exported as a function that takes a Sequelize instance and DataTypes, returning the AcWatching model.

---

**See also:**  
- [Domain](./Domain.md)  
- [Community](./Community.md)  
- [Group](./Group.md)  
- [Post](./Post.md)  
- [Point](./Point.md)  
- [User](./User.md)  
