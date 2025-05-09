# Model: AcListUser

Represents the association between a user and an access control list (AC List) in the database. This model is typically used to track which users are linked to which AC lists, along with any additional data stored in a JSONB column.

- **Table Name:** `ac_list_users`
- **Timestamps:** Yes (`created_at`, `updated_at`)
- **Naming Convention:** Underscored (e.g., `ac_list_id`)

## Properties

| Name         | Type         | Description                                                                 |
|--------------|--------------|-----------------------------------------------------------------------------|
| data         | `object`     | Arbitrary JSONB data associated with the user-AC list relationship.          |
| user_id      | `number`     | Foreign key referencing the associated user. Nullable.                      |
| ac_list_id   | `number`     | Foreign key referencing the associated AC list. Not nullable.               |
| created_at   | `Date`       | Timestamp when the record was created.                                      |
| updated_at   | `Date`       | Timestamp when the record was last updated.                                 |

## Associations

| Association Type | Target Model | Foreign Key   | Description                                      |
|------------------|--------------|---------------|--------------------------------------------------|
| belongsTo        | AcList       | ac_list_id    | Links to the associated AC list.                 |
| belongsTo        | User         | user_id       | Links to the associated user.                    |

## Example

```javascript
// Creating a new AcListUser association
const acListUser = await AcListUser.create({
  data: { permissions: ['read', 'write'] },
  user_id: 42,
  ac_list_id: 7
});
```

## Sequelize Model Definition

```javascript
sequelize.define("AcListUser", {
  data: DataTypes.JSONB,
  user_id: { type: DataTypes.INTEGER, allowNull: true },
  ac_list_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'ac_list_users'
});
```

## See Also

- [AcList](./AcList.md)
- [User](./User.md)