# Model: BulkStatusUpdate

Represents a bulk status update operation, typically used to update the status of multiple posts within groups of a community. This model includes configuration and template data, tracks the user and group/community context, and supports soft deletion.

## Properties

| Name         | Type         | Description                                                                 |
|--------------|--------------|-----------------------------------------------------------------------------|
| config       | object (JSONB)| Configuration object for the bulk update (structure varies, see below).     |
| templates    | object (JSONB)| Templates used for the bulk update (structure varies).                      |
| name         | string       | Name of the bulk status update operation.                                   |
| sent_at      | Date         | Timestamp when the bulk update was sent.                                    |
| deleted      | boolean      | Soft delete flag. If `true`, the record is considered deleted.              |
| created_at   | Date         | Timestamp when the record was created.                                      |
| updated_at   | Date         | Timestamp when the record was last updated.                                 |

## Table Name

- `bulk_status_updates`

## Scopes

- **defaultScope**: Only includes records where `deleted` is `false`.

## Timestamps

- `created_at` (createdAt)
- `updated_at` (updatedAt)

## Naming Convention

- Uses underscored column names.

## Associations

| Association Type | Model      | Foreign Key   | Description                                      |
|------------------|------------|--------------|--------------------------------------------------|
| belongsTo        | Group      | group_id     | The group associated with this bulk update.      |
| belongsTo        | Community  | community_id | The community associated with this bulk update.  |
| belongsTo        | User       | user_id      | The user who initiated the bulk update.          |

## Instance Methods

### initializeConfig(emailHeader, emailFooter, done)

Initializes the `config` property for the bulk status update, populating it with group and post information for the associated community. This method is asynchronous and uses callbacks.

#### Parameters

| Name         | Type     | Description                                                                 |
|--------------|----------|-----------------------------------------------------------------------------|
| emailHeader  | string   | The email header to include in the config.                                  |
| emailFooter  | string   | The email footer to include in the config.                                  |
| done         | function | Callback function with signature `(error, config)`.                         |

#### Description

- Finds all groups in the current `community_id`.
- For each group, finds all posts in that group.
- For each post, adds an entry to the config with post details and placeholders for status/template fields.
- The resulting config structure is:
    ```json
    {
      "groups": [
        {
          "id": 1,
          "name": "Group Name",
          "posts": [
            {
              "id": 123,
              "name": "Post Name",
              "location": "...",
              "currentOfficialStatus": "...",
              "newOfficialStatus": null,
              "selectedTemplateTitle": null,
              "uniqueStatusMessage": null,
              "moveToGroupId": null
            }
          ]
        }
      ],
      "emailHeader": "Header text",
      "emailFooter": "Footer text"
    }
    ```
- Calls `done(error, config)` when finished.

#### Example Usage

```javascript
bulkStatusUpdateInstance.initializeConfig('Header', 'Footer', (err, config) => {
  if (err) {
    // handle error
  } else {
    // use config
  }
});
```

## Configuration

- **Soft Delete**: Uses a `deleted` boolean flag for soft deletion.
- **Timestamps**: Uses custom timestamp fields (`created_at`, `updated_at`).
- **Table Name**: Explicitly set to `bulk_status_updates`.
- **Underscored**: Uses snake_case for column names.

---

**See also:**
- [Group](./Group.md)
- [Community](./Community.md)
- [User](./User.md)
- [Post](./Post.md)

---

**Exported by:**  
This model is exported as a function `(sequelize, DataTypes) => BulkStatusUpdate` for use with Sequelize's model loader.