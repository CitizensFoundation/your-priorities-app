# Model: PostStatusChange

Represents a change in the status of a post, including metadata such as the subject, content, status, publishing time, and user/device information. This model is used to track the history of status changes for posts, including who made the change and from where.

## Properties

| Name               | Type      | Description                                                                 |
|--------------------|-----------|-----------------------------------------------------------------------------|
| id                 | number    | Primary key. Auto-incremented identifier (added by Sequelize).              |
| subject            | string \| null | Optional subject/title for the status change.                                 |
| content            | string    | Content or reason for the status change. Required.                          |
| status             | string    | The status of the post after the change. Required.                          |
| status_changed_to  | string    | The new status the post was changed to.                                     |
| published_at       | Date      | The date and time when the status change was published.                     |
| ip_address         | string    | IP address from which the status change was made. Required.                 |
| user_agent         | string    | User agent string of the client making the change. Required.                |
| deleted            | boolean   | Soft-delete flag. If true, the record is considered deleted. Default: false.|
| created_at         | Date      | Timestamp when the record was created.                                      |
| updated_at         | Date      | Timestamp when the record was last updated.                                 |
| post_id            | number    | Foreign key referencing the associated Post.                                |
| user_id            | number    | Foreign key referencing the User who made the change.                       |

## Table Name

- `post_status_changes`

## Scopes

- **defaultScope**: Only includes records where `deleted` is `false`.

## Timestamps

- `created_at` (createdAt)
- `updated_at` (updatedAt)

## Naming Convention

- Uses underscored column names (e.g., `created_at` instead of `createdAt`).

## Default Public Attributes

The following attributes are considered public and are typically returned in API responses:

```js
[
  'id', 'subject', 'content', 'status', 'published_at', 'deleted',
  'status_changed_to'
]
```

## Associations

| Association Type | Target Model         | Foreign Key | Description                                               |
|------------------|---------------------|-------------|-----------------------------------------------------------|
| belongsTo        | [Post](./Post.md)   | post_id     | The post whose status is being changed.                   |
| belongsTo        | [User](./User.md)   | user_id     | The user who performed the status change.                 |
| hasMany          | [PointRevision](./PointRevision.md) | N/A         | All point revisions associated with this status change.   |
| hasMany          | [PointQuality](./PointQuality.md)   | N/A         | All point quality records associated with this change.    |

## Example

```js
{
  "id": 123,
  "subject": "Post Approved",
  "content": "The post has been reviewed and approved.",
  "status": "approved",
  "status_changed_to": "approved",
  "published_at": "2024-06-01T12:00:00Z",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "deleted": false,
  "created_at": "2024-06-01T12:00:00Z",
  "updated_at": "2024-06-01T12:00:00Z",
  "post_id": 456,
  "user_id": 789
}
```

## Configuration

- **Soft Delete**: Uses a `deleted` boolean flag for soft deletion. The default scope excludes deleted records.
- **Timestamps**: Automatically manages `created_at` and `updated_at` fields.
- **Table Name**: Explicitly set to `post_status_changes`.
- **Underscored**: All column names use snake_case.

---

**See also:**
- [Post](./Post.md)
- [User](./User.md)
- [PointRevision](./PointRevision.md)
- [PointQuality](./PointQuality.md)