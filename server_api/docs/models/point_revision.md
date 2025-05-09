# Model: PointRevision

Represents a revision of a "Point" entity, capturing the state of a point at a specific time, including its content, status, value, and metadata such as user agent and IP address. This model is used to track changes and maintain a history of edits to points within the application.

## Properties

| Name         | Type                | Description                                                                 |
|--------------|---------------------|-----------------------------------------------------------------------------|
| id           | number              | Primary key. Auto-incremented unique identifier for the revision.           |
| name         | string \| null      | Optional name/title for the point revision.                                 |
| content      | string              | The main textual content of the point revision.                             |
| status       | string              | Status of the revision (e.g., 'pending', 'approved').                       |
| value        | number              | Numeric value associated with the revision (e.g., score, weight).           |
| website      | string \| null      | Optional website associated with the revision.                              |
| ip_address   | string              | IP address from which the revision was made.                                |
| user_agent   | string              | User agent string of the client making the revision.                        |
| embed_data   | object (JSONB) \| null | Optional embedded data in JSONB format.                                  |
| deleted      | boolean             | Indicates if the revision is soft-deleted. Default: `false`.                |
| created_at   | Date                | Timestamp when the revision was created.                                    |
| updated_at   | Date                | Timestamp when the revision was last updated.                               |
| point_id     | number              | Foreign key referencing the associated Point.                               |
| user_id      | number              | Foreign key referencing the User who made the revision.                     |

## Configuration

- **Table Name:** `point_revisions`
- **Timestamps:** Enabled (`created_at`, `updated_at`)
- **Underscored:** Field names use snake_case in the database.
- **Default Scope:** Only includes records where `deleted` is `false`.
- **Indexes:**
  - Composite index on `user_id` and `deleted`
  - Index on `deleted`
  - Composite index on `deleted` and `point_id`

## Associations

| Association Type | Target Model | Foreign Key | Description                                      |
|------------------|-------------|-------------|--------------------------------------------------|
| belongsTo        | Point       | point_id    | Each revision is associated with a specific Point.|
| belongsTo        | User        | user_id     | Each revision is created by a specific User.      |

## Static Properties

| Name                     | Type     | Description                                                                 |
|--------------------------|----------|-----------------------------------------------------------------------------|
| defaultAttributesPublic  | string[] | List of attribute names considered public for API responses or serialization.<br>Includes: `id`, `name`, `content`, `status`, `value`, `website`, `deleted`, `embed_data` |

## Example

```javascript
{
  "id": 123,
  "name": "Updated Point Title",
  "content": "This is the revised content of the point.",
  "status": "approved",
  "value": 10,
  "website": "https://example.com",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "embed_data": { "source": "imported" },
  "deleted": false,
  "created_at": "2024-06-01T12:00:00.000Z",
  "updated_at": "2024-06-01T12:30:00.000Z",
  "point_id": 45,
  "user_id": 7
}
```

## Usage

This model is typically used to:
- Track the history of changes to a point.
- Retrieve the latest or previous versions of a point.
- Soft-delete revisions without removing them from the database.
- Associate revisions with both the original point and the user who made the change.

## Related Models

- [Point](./Point.md)
- [User](./User.md)

---

**Note:** This model is defined using Sequelize and is exported as a function that takes a `sequelize` instance and `DataTypes` as arguments. It is typically imported and initialized as part of the application's model setup.