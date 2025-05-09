# Model: UserLegacyPassword

Represents a legacy password record for a user. This model is used to store encrypted passwords from a previous authentication system, typically for migration or backward compatibility purposes.

## Properties

| Name                | Type   | Description                                      |
|---------------------|--------|--------------------------------------------------|
| encrypted_password  | string | The user's legacy encrypted password. Required.  |
| user_id             | number | Foreign key referencing the associated User.     |

## Configuration

- **underscored**: `true`  
  Field names in the database use snake_case (e.g., `encrypted_password`).
- **tableName**: `'user_legacy_passwords'`  
  The table name in the database is explicitly set to `user_legacy_passwords`.

## Associations

- **belongsTo User**  
  Each `UserLegacyPassword` belongs to a single [User](./User.md) model instance, referenced by the `user_id` foreign key.

## Example

```javascript
// Creating a new legacy password record for a user
const legacyPassword = await UserLegacyPassword.create({
  encrypted_password: 'hashed_legacy_pw',
  user_id: 123
});
```

## Sequelize Model Definition

This model is defined using the Sequelize ORM. It is typically imported and used as part of the models object in an Express.js application.

## Export

This module exports a function that defines the `UserLegacyPassword` model and sets up its association with the `User` model. It should be used as part of the Sequelize model initialization process.

---

**See also:**  
- [User](./User.md) (for the associated user model)