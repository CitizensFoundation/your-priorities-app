# Model: Promotion

Represents a promotion entity in the application, typically used for tracking promoted content, its status, costs, engagement counters, and associations with groups, posts, and users. This model is defined using Sequelize ORM.

## Properties

| Name                     | Type      | Description                                                                                 |
|--------------------------|-----------|---------------------------------------------------------------------------------------------|
| content                  | string    | The textual content of the promotion.                                                       |
| status                   | string    | The current status of the promotion (e.g., 'active', 'paused').                             |
| cost                     | number    | The total cost allocated for the promotion (integer).                                       |
| per_viewer_cost          | number    | The cost per viewer for the promotion (float).                                              |
| spent                    | number    | The amount spent so far on the promotion (float).                                           |
| position                 | number    | The position or order of the promotion (default: 0).                                        |
| finished_at              | Date      | The date and time when the promotion finished.                                              |
| counter_up_endorsements  | number    | The number of up endorsements received (default: 0).                                        |
| counter_down_endorsements| number    | The number of down endorsements received (default: 0).                                      |
| counter_skips            | number    | The number of times the promotion was skipped (default: 0).                                 |
| counter_views            | number    | The number of times the promotion was viewed (default: 0).                                  |
| deleted                  | boolean   | Soft-delete flag. If true, the promotion is considered deleted (default: false).            |
| created_at               | Date      | Timestamp when the promotion was created (managed by Sequelize).                            |
| updated_at               | Date      | Timestamp when the promotion was last updated (managed by Sequelize).                       |

## Configuration

- **defaultScope**: Only returns promotions where `deleted` is `false` by default.
- **timestamps**: Enabled. Uses `created_at` and `updated_at` as timestamp fields.
- **underscored**: Field names use snake_case in the database.
- **tableName**: The table name is explicitly set to `promotions`.

## Associations

| Association Type | Target Model | Foreign Key | Description                                      |
|------------------|--------------|-------------|--------------------------------------------------|
| belongsTo        | Group        | group_id    | The group this promotion is associated with.      |
| belongsTo        | Post         | post_id     | The post this promotion is promoting.             |
| belongsTo        | User         | user_id     | The user who created or owns the promotion.       |

> **Note:** The associated models (`Group`, `Post`, `User`) must be defined elsewhere in your application.

## Example

```javascript
const promotion = await Promotion.create({
  content: "Check out our new feature!",
  status: "active",
  cost: 1000,
  per_viewer_cost: 0.05,
  spent: 0,
  position: 1,
  finished_at: null,
  counter_up_endorsements: 0,
  counter_down_endorsements: 0,
  counter_skips: 0,
  counter_views: 0,
  deleted: false,
  group_id: 1,
  post_id: 42,
  user_id: 7
});
```

## Related Models

- [Group](./Group.md)
- [Post](./Post.md)
- [User](./User.md)

---

**Defined in:** `models/promotion.js` (Sequelize model definition)