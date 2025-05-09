# Model: RequestToJoin

Represents a request by a user to join either a group or a community. This model is used to track join requests, their type, and their associations with users, groups, and communities.

## Properties

| Name         | Type    | Description                                                                 |
|--------------|---------|-----------------------------------------------------------------------------|
| type         | number  | The type of join request. Must be one of `RequestToJoin.JOIN_GROUP` (0) or `RequestToJoin.JOIN_COMMUNITY` (1). Required. |
| community_id | number  | Foreign key referencing the associated Community.                            |
| group_id     | number  | Foreign key referencing the associated Group.                                |
| user_id      | number  | Foreign key referencing the User who made the request.                       |
| created_at   | Date    | Timestamp when the request was created.                                      |
| updated_at   | Date    | Timestamp when the request was last updated.                                 |

## Table Configuration

- **Table Name:** `requests_to_join`
- **Timestamps:** Enabled (`created_at`, `updated_at`)
- **Naming Convention:** Underscored (e.g., `created_at`)

## Associations

| Association Type | Model      | Foreign Key   | Description                                      |
|------------------|------------|--------------|--------------------------------------------------|
| belongsTo        | Community  | community_id | The community the join request is associated with.|
| belongsTo        | Group      | group_id     | The group the join request is associated with.    |
| belongsTo        | User       | user_id      | The user who made the join request.               |

- **Community:** See [Community](./Community.md)
- **Group:** See [Group](./Group.md)
- **User:** See [User](./User.md)

## Exported Constants

| Name                    | Value | Description                                 |
|-------------------------|-------|---------------------------------------------|
| RequestToJoin.JOIN_GROUP     | 0     | Indicates the request is to join a group.   |
| RequestToJoin.JOIN_COMMUNITY | 1     | Indicates the request is to join a community.|

## Example

```javascript
const RequestToJoin = sequelize.models.RequestToJoin;

// Creating a request to join a group
await RequestToJoin.create({
  type: RequestToJoin.JOIN_GROUP,
  group_id: 123,
  user_id: 456
});

// Creating a request to join a community
await RequestToJoin.create({
  type: RequestToJoin.JOIN_COMMUNITY,
  community_id: 789,
  user_id: 456
});
```

## Usage Notes

- The `type` field determines whether the request is for a group or a community.
- The appropriate foreign key (`group_id` or `community_id`) should be set based on the `type`.
- Associations allow you to easily include related `Community`, `Group`, or `User` data when querying.

---

**See also:**  
- [Community](./Community.md)  
- [Group](./Group.md)  
- [User](./User.md)  
