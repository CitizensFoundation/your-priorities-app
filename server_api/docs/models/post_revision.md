# Model: PostRevision

Represents a revision of a post in the application. Each revision contains metadata such as name, description, and arbitrary JSON data. The model supports soft deletion via the `deleted` flag and is associated with both a `Post` and a `User`.

## Properties

| Name         | Type      | Description                                                                 |
|--------------|-----------|-----------------------------------------------------------------------------|
| name         | string    | The name/title of the post revision. Required.                              |
| description  | string    | A detailed description of the post revision. Required.                      |
| data         | object    | Arbitrary JSON data associated with the revision. Optional (`DataTypes.JSONB`). |
| deleted      | boolean   | Soft delete flag. If `true`, the revision is considered deleted. Defaults to `false`. Required. |
| created_at   | Date      | Timestamp when the revision was created. Managed by Sequelize.              |
| updated_at   | Date      | Timestamp when the revision was last updated. Managed by Sequelize.          |
| post_id      | number    | Foreign key referencing the associated Post.                                |
| user_id      | number    | Foreign key referencing the User who created the revision.                  |

## Configuration

- **Table Name:** `post_revisions`
- **Timestamps:** Enabled (`created_at`, `updated_at`)
- **Underscored:** Field names use snake_case in the database.
- **Default Scope:** Only includes records where `deleted` is `false`.

## Indexes

| Name                                 | Fields                    | Description                                  |
|-------------------------------------- |--------------------------|----------------------------------------------|
| (unnamed)                            | `user_id`, `deleted`     | Index for efficient queries by user and deletion status. |
| post_revisions_idx_deleted           | `deleted`                | Index for efficient queries by deletion status. |
| post_revisions_idx_post_id_deleted   | `deleted`, `post_id`     | Index for efficient queries by post and deletion status. |

## Associations

| Association Type | Target Model | Foreign Key | Description                                      |
|------------------|--------------|-------------|--------------------------------------------------|
| belongsTo        | [Post](./Post.md) | post_id     | Each revision is associated with a single post.   |
| belongsTo        | [User](./User.md) | user_id     | Each revision is created by a single user.        |

## Example

```javascript
const PostRevision = sequelize.define("PostRevision", {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  data: DataTypes.JSONB,
  deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
  // ...options
});
```

## Usage

- To retrieve all non-deleted post revisions:
  ```javascript
  PostRevision.findAll();
  ```
- To include deleted revisions, use an unscoped query:
  ```javascript
  PostRevision.unscoped().findAll();
  ```

## See Also

- [Post](./Post.md)
- [User](./User.md)