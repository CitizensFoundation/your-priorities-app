# Model: AcList

Represents the `ac_lists` table in the database, used for associating users, groups, communities, and posts with arbitrary JSONB data. This model is defined using Sequelize and includes several static methods for list management and user association.

## Properties

| Name         | Type      | Description                                      |
|--------------|-----------|--------------------------------------------------|
| data         | JSONB     | Arbitrary JSON data associated with the list.    |
| user_id      | number    | Foreign key referencing the User. Required.      |
| group_id     | number    | Foreign key referencing the Group. Optional.     |
| community_id | number    | Foreign key referencing the Community. Optional. |
| post_id      | number    | Foreign key referencing the Post. Optional.      |
| created_at   | Date      | Timestamp when the record was created.           |
| updated_at   | Date      | Timestamp when the record was last updated.      |

## Configuration

- **underscored**: `true`  
  Uses snake_case for automatically added attributes.
- **timestamps**: `true`  
  Enables `created_at` and `updated_at` fields.
- **tableName**: `'ac_lists'`  
  Explicitly sets the table name.

## Associations

| Association         | Model      | Foreign Key | Description                                 |
|---------------------|------------|-------------|---------------------------------------------|
| belongsTo           | Post       | post_id     | Associates the list with a Post.            |
| belongsTo           | Community  | community_id| Associates the list with a Community.       |
| belongsTo           | Group      | group_id    | Associates the list with a Group.           |
| belongsTo           | User       | user_id     | Associates the list with a User.            |

## Static Methods

### AcList.getList

Finds or creates an `AcList` for a given group.

#### Parameters

| Name     | Type     | Description                                 |
|----------|----------|---------------------------------------------|
| groupId  | number   | The ID of the group to find/create a list for. |
| done     | function | Callback function `(error, list)`            |

#### Usage

```javascript
AcList.getList(123, (err, list) => {
  if (err) { /* handle error */ }
  // use list
});
```

#### Description

- Attempts to find an `AcList` with the specified `group_id`.
- If not found, creates a new one with that `group_id`.
- Calls the `done` callback with `(error, list)`.

---

### AcList.addListUsers

Adds multiple users to an `AcList` by creating `AcListUser` entries if they do not already exist.

#### Parameters

| Name     | Type     | Description                                         |
|----------|----------|-----------------------------------------------------|
| listId   | number   | The ID of the `AcList` to add users to.             |
| body     | object   | Object containing a `listUsersEntries` array.       |
| done     | function | Callback function `(error)`                         |

#### `body` Schema

```json
{
  "listUsersEntries": [
    {
      "sms": "string"
    }
  ]
}
```

- Each entry in `listUsersEntries` should have an `sms` property (string).

#### Description

- Runs in a transaction.
- For each entry in `body.listUsersEntries`, attempts to find or create an `AcListUser` with the given `sms`.
- If created, initializes `data` with `{ openCount: 0, sentCount: 0, completeCount: 0 }`.
- Calls the `done` callback with an error if any operation fails.

#### Usage

```javascript
AcList.addListUsers(1, { listUsersEntries: [{ sms: "1234567890" }] }, (err) => {
  if (err) { /* handle error */ }
  // success
});
```

---

## Example

```javascript
const { AcList } = require('./models');
AcList.getList(42, (err, list) => {
  if (!err) {
    // Do something with the list
  }
});
```

---

## Related Models

- [User](./User.md)
- [Group](./Group.md)
- [Community](./Community.md)
- [Post](./Post.md)
- [AcListUser](./AcListUser.md)

---

## Notes

- This model uses [Sequelize](https://sequelize.org/) for ORM functionality.
- The `addListUsers` method uses `async.eachSeries` for sequential processing, which requires the `async` library (not shown in this file).
- The `models` object is assumed to be available in the scope of static methods, which may require adjustment depending on your project structure.