# Model: Relationship

Represents a relationship between two users in the system, such as a "friend" or "follow" relationship. This model is typically used to track social connections between users.

## Properties

| Name               | Type    | Description                                                                 |
|--------------------|---------|-----------------------------------------------------------------------------|
| relationship_type  | number  | The type of relationship. See constants below for possible values. Required. |
| user_id            | number  | Foreign key referencing the primary user in the relationship.                |
| other_user_id      | number  | Foreign key referencing the other user in the relationship.                  |
| created_at         | Date    | Timestamp when the relationship was created.                                 |
| updated_at         | Date    | Timestamp when the relationship was last updated.                            |

## Constants

| Name                        | Value | Description                |
|-----------------------------|-------|----------------------------|
| RELATIONSHIP_FRIEND         | 0     | Represents a "friend" relationship. |
| RELATIONSHIP_FOLLOW         | 1     | Represents a "follow" relationship. |

## Associations

- **Relationship.belongsTo(models.User, { as: 'User', foreignKey: 'user_id' })**  
  Each relationship is associated with a primary user (the initiator of the relationship).

- **Relationship.belongsTo(models.User, { as: 'OtherUser', foreignKey: 'other_user_id' })**  
  Each relationship is associated with another user (the recipient of the relationship).

## Configuration

| Option         | Value              | Description                                      |
|----------------|--------------------|--------------------------------------------------|
| underscored    | true               | Uses snake_case for automatically added columns.  |
| createdAt      | 'created_at'       | Custom name for the created timestamp column.     |
| updatedAt      | 'updated_at'       | Custom name for the updated timestamp column.     |
| timestamps     | true               | Enables automatic timestamp columns.              |
| tableName      | 'relationships'    | Explicit table name in the database.              |

## Example

```javascript
// Creating a new friend relationship between user 1 and user 2
const relationship = await Relationship.create({
  user_id: 1,
  other_user_id: 2,
  relationship_type: Relationship.RELATIONSHIP_FRIEND
});
```

## See Also

- [User](./User.md) – The user model referenced by `user_id` and `other_user_id`.