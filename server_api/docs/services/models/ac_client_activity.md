# Model: AcClientActivity

Represents a client activity event in the system, capturing actions performed by users or agents within various domains, communities, groups, or posts. This model is typically used for activity tracking, auditing, or analytics purposes.

## Properties

| Name         | Type            | Description                                                                 |
|--------------|-----------------|-----------------------------------------------------------------------------|
| type         | string          | The main type of activity (e.g., "post", "comment", "vote"). **Required**.  |
| sub_type     | string \| null  | A more specific subtype of the activity (e.g., "edit", "delete"). Optional. |
| domain_id    | number \| null  | ID of the domain where the activity occurred. Optional.                     |
| community_id | number \| null  | ID of the community related to the activity. Optional.                      |
| group_id     | number \| null  | ID of the group related to the activity. Optional.                          |
| user_id      | number \| null  | ID of the user who performed the activity. Optional.                        |
| post_id      | number \| null  | ID of the post related to the activity. Optional.                           |
| object       | object (JSONB)  | The main object of the activity (arbitrary JSON structure). Optional.       |
| actor        | object (JSONB)  | The actor (user, agent, etc.) who performed the activity. Optional.         |
| target       | object (JSONB)  | The target of the activity (e.g., another user, post). Optional.            |
| context      | object (JSONB)  | Additional context for the activity (arbitrary JSON). Optional.             |
| created_at   | Date            | Timestamp when the activity was created.                                    |
| updated_at   | Date            | Timestamp when the activity was last updated.                               |

## Configuration

- **Timestamps:** Enabled. Uses `created_at` and `updated_at` fields.
- **Table Name:** `ac_client_activities`
- **Naming Convention:** Uses underscored field names (e.g., `created_at` instead of `createdAt`).

## Example

```json
{
  "type": "post",
  "sub_type": "create",
  "domain_id": 1,
  "community_id": 2,
  "group_id": 3,
  "user_id": 42,
  "post_id": 100,
  "object": { "title": "New Post", "content": "Hello world!" },
  "actor": { "id": 42, "type": "user" },
  "target": { "id": 100, "type": "post" },
  "context": { "ip": "127.0.0.1" },
  "created_at": "2024-06-01T12:00:00.000Z",
  "updated_at": "2024-06-01T12:00:00.000Z"
}
```

## Usage

This model is defined using Sequelize and should be imported via your Sequelize instance:

```javascript
const AcClientActivity = sequelize.import('./path/to/acClientActivity');
```

You can use standard Sequelize methods to create, query, update, or delete activity records.

## See Also

- [Sequelize Model Documentation](https://sequelize.org/master/manual/model-basics.html)
- [Sequelize DataTypes Reference](https://sequelize.org/master/manual/model-basics.html#data-types)
