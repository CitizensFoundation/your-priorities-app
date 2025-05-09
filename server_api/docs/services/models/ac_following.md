# Model: AcFollowing

Represents a "following" relationship between users in the system. Each record indicates that one user is following another, with support for soft deletion and value tracking.

## Properties

| Name           | Type    | Description                                                                 |
|----------------|---------|-----------------------------------------------------------------------------|
| value          | number  | An integer value associated with the following relationship.                 |
| deleted        | boolean | Indicates if the following relationship has been soft-deleted. Defaults to `false`. Cannot be null. |
| user_id        | number  | Foreign key referencing the user who is following.                          |
| other_user_id  | number  | Foreign key referencing the user being followed.                            |
| created_at     | Date    | Timestamp when the record was created.                                      |
| updated_at     | Date    | Timestamp when the record was last updated.                                 |

## Configuration

- **Table Name:** `ac_followings`
- **Timestamps:** Enabled (`created_at`, `updated_at`)
- **Underscored:** Field names use snake_case in the database.
- **Default Scope:** Only includes records where `deleted` is `false`.
- **Indexes:**
  - On `user_id` where `deleted` is `false`
  - On `other_user_id` where `deleted` is `false`
  - On `user_id, other_user_id` where `deleted` is `false`

## Associations

| Association Type | Target Model | Foreign Key   | Alias      | Description                                      |
|------------------|--------------|--------------|------------|--------------------------------------------------|
| belongsTo        | User         | user_id      |            | The user who is following another user.          |
| belongsTo        | User         | other_user_id| OtherUser  | The user who is being followed.                  |

> **Note:** The `OtherUser` association uses the `as: 'OtherUser'` alias, but does not explicitly specify the foreign key. By convention, Sequelize will use `other_user_id`.

## Example

```javascript
// Creating a following relationship
const following = await AcFollowing.create({
  user_id: 1,
  other_user_id: 2,
  value: 1
});

// Querying all active followings for a user
const followings = await AcFollowing.findAll({
  where: { user_id: 1 }
});
```

## Export

This model is exported as a function that takes a Sequelize instance and DataTypes, returning the defined model.

---

**See also:**  
- [User](./User.md) (for the associated user model)