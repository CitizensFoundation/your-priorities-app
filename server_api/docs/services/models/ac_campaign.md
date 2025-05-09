# Model: AcCampaign

Represents a marketing campaign entity in the system, associated with a user and a list. Provides methods for updating campaign/user tracking data, sending campaigns, and retrieving send status. This model is defined using Sequelize ORM and maps to the `ac_campaigns` table.

## Properties

| Name         | Type      | Description                                      |
|--------------|-----------|--------------------------------------------------|
| data         | JSONB     | Arbitrary campaign data, including tracking info. |
| user_id      | number    | Foreign key referencing the associated user.      |
| ac_list_id   | number    | Foreign key referencing the associated list.      |
| created_at   | Date      | Timestamp when the campaign was created.          |
| updated_at   | Date      | Timestamp when the campaign was last updated.     |

## Associations

- **AcCampaign.belongsTo(models.AcList, { foreignKey: 'ac_list_id' })**  
  Each campaign is associated with a single list.

- **AcCampaign.belongsTo(models.User, { foreignKey: 'user_id' })**  
  Each campaign is associated with a single user.

---

# Methods

## AcCampaign.updateCampaignAndUser

Updates a specific tracking field in both the campaign and the associated list user, incrementing the value by 1.

### Parameters

| Name                  | Type     | Description                                                                 |
|-----------------------|----------|-----------------------------------------------------------------------------|
| parameters            | object   | Should contain `yu` (user id) and `yc` (campaign id) for tracking.          |
| updateParameter       | string   | The key in the `data` JSONB to increment (e.g., 'opens', 'clicks').         |
| done                  | function | Callback function: `function(error: Error \| null)`                          |

### Description

- Finds the campaign by `yc` (campaign id) and the list user by `yu` (user id).
- Increments the specified `updateParameter` field in the `data` JSONB for both.
- Saves the updated records.
- Calls `done(error)` when finished.

### Example

```javascript
AcCampaign.updateCampaignAndUser(
  { yu: 123, yc: 456 },
  'opens',
  (error) => {
    if (error) { /* handle error */ }
  }
);
```

---

## AcCampaign.sendCampaign

Enqueues a background job to send the campaign using the queue system.

### Parameters

| Name        | Type     | Description                                              |
|-------------|----------|----------------------------------------------------------|
| campaignId  | number   | The ID of the campaign to send.                          |
| done        | function | Callback function: `function(error: Error \| null)`      |

### Description

- Creates a background job using `AcBackgroundJob.createJob`.
- Adds a job to the queue named `'process-marketing'` with type `'send-campaign'`.
- Calls `done(error)` when finished.

### Example

```javascript
AcCampaign.sendCampaign(456, (error) => {
  if (error) { /* handle error */ }
});
```

---

## AcCampaign.getSendStatus

Retrieves the status of a campaign send job.

### Parameters

| Name    | Type     | Description                                              |
|---------|----------|----------------------------------------------------------|
| jobId   | number   | The ID of the background job.                            |
| done    | function | Callback: `function(error: Error \| null, job: object)`  |

### Description

- Finds the background job by `jobId`.
- Returns the job's `id`, `progress`, `error`, and `data` fields.
- Calls `done(error, job)`.

### Example

```javascript
AcCampaign.getSendStatus(789, (error, job) => {
  if (error) { /* handle error */ }
  else { /* use job info */ }
});
```

---

# Configuration

- **underscored**: `true`  
  Uses snake_case for automatically added attributes.

- **timestamps**: `true`  
  Enables `created_at` and `updated_at` fields.

- **tableName**: `'ac_campaigns'`  
  Explicitly sets the table name.

---

# Dependencies

- **queue**: Imported from `../workers/queue.cjs`. Used to enqueue background jobs.
- **sequelize**: Sequelize ORM instance.
- **DataTypes**: Sequelize data types.

---

# See Also

- [AcList](./AcList.md)
- [User](./User.md)
- [AcListUser](./AcListUser.md)
- [AcBackgroundJob](./AcBackgroundJob.md)
- [queue](../workers/queue.cjs)
