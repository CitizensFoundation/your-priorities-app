# Model: AcMute

Represents a mute action within the application, typically used to mute users, posts, points, or groups within a specific domain or community. This model is mapped to the `ac_mutes` table in the database and includes soft-delete functionality via the `deleted` flag.

## Properties

| Name         | Type    | Description                                                                 |
|--------------|---------|-----------------------------------------------------------------------------|
| deleted      | boolean | Indicates whether the mute record is soft-deleted. Default: `false`.        |
| created_at   | Date    | Timestamp when the mute record was created.                                 |
| updated_at   | Date    | Timestamp when the mute record was last updated.                            |
| domain_id    | number  | Foreign key referencing the associated [Domain](./Domain.md).               |
| community_id | number  | Foreign key referencing the associated [Community](./Community.md).         |
| group_id     | number  | Foreign key referencing the associated [Group](./Group.md).                 |
| post_id      | number  | Foreign key referencing the associated [Post](./Post.md).                   |
| point_id     | number  | Foreign key referencing the associated [Point](./Point.md).                 |
| user_id      | number  | Foreign key referencing the muted [User](./User.md).                        |
| OtherUserId  | number  | Foreign key referencing another [User](./User.md) (aliased as `OtherUser`). |

> **Note:** Only the `deleted` property is explicitly defined in the model schema. The foreign keys are established via associations and are present in the table as per Sequelize conventions.

## Configuration

| Option         | Value/Description                                                                                 |
|----------------|--------------------------------------------------------------------------------------------------|
| defaultScope   | All queries exclude records where `deleted` is `true`.                                            |
| underscored    | `true` — All column names use snake_case (e.g., `created_at`).                                   |
| timestamps     | `true` — Sequelize automatically manages `created_at` and `updated_at` fields.                   |
| tableName      | `'ac_mutes'` — Explicitly sets the table name.                                                   |

## Associations

| Association Type | Target Model         | Foreign Key   | Alias      | Description                                      |
|------------------|---------------------|--------------|------------|--------------------------------------------------|
| belongsTo        | [Domain](./Domain.md)     | domain_id    |            | The domain in which the mute action occurred.     |
| belongsTo        | [Community](./Community.md) | community_id |            | The community in which the mute action occurred.  |
| belongsTo        | [Group](./Group.md)       | group_id     |            | The group in which the mute action occurred.      |
| belongsTo        | [Post](./Post.md)         | post_id      |            | The post that is muted.                           |
| belongsTo        | [Point](./Point.md)       | point_id     |            | The point that is muted.                          |
| belongsTo        | [User](./User.md)         | user_id      |            | The user who is muted.                            |
| belongsTo        | [User](./User.md)         |              | OtherUser  | Another user related to the mute action.          |

## Example

```javascript
// Creating a new mute record
const mute = await AcMute.create({
  user_id: 123,
  post_id: 456,
  deleted: false
});
```

## Default Scope

All queries on the `AcMute` model will, by default, only return records where `deleted` is `false` (i.e., not soft-deleted).

---

**See also:**  
- [Domain](./Domain.md)  
- [Community](./Community.md)  
- [Group](./Group.md)  
- [Post](./Post.md)  
- [Point](./Point.md)  
- [User](./User.md)  

**File:** `models/acMute.js`