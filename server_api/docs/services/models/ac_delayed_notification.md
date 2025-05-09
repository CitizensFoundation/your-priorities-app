# Model: AcDelayedNotification

Represents a delayed notification entity in the system, used to track notifications that are scheduled to be delivered to users at a later time. This model includes information about the delivery method, frequency, type, delivery status, and timestamps. It is associated with users and notifications.

## Properties

| Name          | Type      | Description                                                                 |
|---------------|-----------|-----------------------------------------------------------------------------|
| method        | number    | The delivery method identifier (e.g., email, SMS). Required.                |
| frequency     | number    | The frequency of the notification (e.g., daily, weekly). Required.          |
| type          | string    | The type/category of the notification. Required.                            |
| delivered     | boolean   | Indicates if the notification has been delivered. Default: `false`.         |
| delivered_at  | Date      | Timestamp when the notification was delivered. Nullable.                    |
| deleted       | boolean   | Soft-delete flag. If `true`, the notification is considered deleted. Default: `false`. |
| created_at    | Date      | Timestamp when the record was created.                                      |
| updated_at    | Date      | Timestamp when the record was last updated.                                 |
| user_id       | number    | Foreign key referencing the associated user.                                |

## Configuration

- **Table Name:** `ac_delayed_notifications`
- **Timestamps:** Enabled (`created_at`, `updated_at`)
- **Underscored:** Field names use snake_case.
- **Default Scope:** Only records where `deleted` is `false` are returned by default.

## Indexes

| Name                                                        | Fields                                      | Condition                |
|-------------------------------------------------------------|---------------------------------------------|--------------------------|
| delayed_not_delivered_by_method_user_id_frequency            | method, user_id, frequency                  | delivered: true          |
| delayed_n_not_delivered_by_method_user_id_frequency_timestamps | method, user_id, frequency, updated_at, delivered_at | delivered: true          |

## Associations

- **Belongs To Many:** [`AcNotification`](./AcNotification.md) (as `AcNotifications`, through the `delayed_notifications` join table)
- **Belongs To:** [`User`](./User.md) (foreign key: `user_id`)

## Example Sequelize Definition

```javascript
const AcDelayedNotification = sequelize.define("AcDelayedNotification", {
  method: { type: DataTypes.INTEGER, allowNull: false },
  frequency: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  delivered: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  delivered_at: { type: DataTypes.DATE, allowNull: true },
  deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
  defaultScope: { where: { deleted: false } },
  indexes: [
    {
      name: 'delayed_not_delivered_by_method_user_id_frequency',
      fields: ['method','user_id','frequency'],
      where: { delivered: true }
    },
    {
      name: 'delayed_n_not_delivered_by_method_user_id_frequency_timestamps',
      fields: ['method','user_id','frequency','updated_at','delivered_at'],
      where: { delivered: true }
    }
  ],
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'ac_delayed_notifications'
});
```

## Usage Example

```javascript
// Creating a new delayed notification
await AcDelayedNotification.create({
  method: 1,
  frequency: 7,
  type: 'reminder',
  user_id: 42
});
```

## See Also

- [AcNotification](./AcNotification.md)
- [User](./User.md)