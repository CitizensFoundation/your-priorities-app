# Service Module: BulkStatusUpdateWorker

Implements the logic for processing bulk status updates on posts, including moving posts between groups, updating post statuses, and creating related activities. This worker is designed to be used in a background job or queue system to process bulk operations efficiently and safely, with support for a "verify" mode (dry run).

---

## Dependencies

- [async](https://caolan.github.io/async/)
- [lodash](https://lodash.com/)
- [models](../../models/index.cjs): Sequelize models for database access.
- [logger](../utils/logger.cjs): Logging utility.
- [queue](./queue.cjs): Queue management (not directly used in this file).
- [i18n](../utils/i18n.cjs): Internationalization utility (not directly used in this file).
- [toJson](../utils/to_json.cjs): Utility to convert objects to JSON.
- [airbrake](../utils/airbrake.cjs): Error reporting (conditionally loaded).

---

## Export

```js
module.exports = new BulkStatusUpdateWorker();
```
Exports a singleton instance of `BulkStatusUpdateWorker`.

---

## Class: BulkStatusUpdateWorker

Handles bulk status update operations for posts, including status changes, group moves, and activity creation.

### Methods

#### process(bulkStatusUpdateInfo, callback)

Processes a bulk status update job.

| Name                  | Type     | Description                                                                 |
|-----------------------|----------|-----------------------------------------------------------------------------|
| bulkStatusUpdateInfo  | object   | Information for the bulk status update. Must include `bulkStatusUpdateId` and optionally `verifyMode`. |
| callback              | function | Callback function `(error?: any) => void`.                                  |

**Lifecycle:**
1. Loads the bulk status update record and its configuration.
2. Changes the status of all posts as specified in the config.
3. Moves posts to new groups if required.
4. Gathers all users with endorsements on affected posts.
5. Creates bulk status update activities for those users.

**Error Handling:**  
Logs errors and, if Airbrake is configured, reports them.

---

## Internal Functions

### movePostToGroupId(postId, toGroupId, done)

Moves a post to a new group, updating related activities and references.

| Name      | Type     | Description                        |
|-----------|----------|------------------------------------|
| postId    | number   | ID of the post to move.            |
| toGroupId | number   | ID of the target group.            |
| done      | function | Callback `(error?: any) => void`.  |

- Updates the post's `group_id`.
- Updates all related `AcActivity` records with new group, community, and domain IDs.
- In verify mode, only logs the intended changes.

---

### createStatusUpdateForPostId(postId, official_status, content, userId, callback)

Creates a status update for a post, optionally changing its official status and logging the change.

| Name           | Type     | Description                                 |
|----------------|----------|---------------------------------------------|
| postId         | number   | ID of the post to update.                   |
| official_status| number   | New official status value.                  |
| content        | string   | Status update message/content.              |
| userId         | number   | ID of the user performing the update.       |
| callback       | function | Callback `(error?: any) => void`.           |

- Creates a `PostStatusChange` record.
- Optionally updates the post's `official_status`.
- Creates an `AcActivity` for the status change.
- In verify mode, only logs the intended changes.

---

### getAllUsersWithEndorsements(config, callback)

Finds all users who have endorsed any post in the provided config.

| Name    | Type     | Description                                 |
|---------|----------|---------------------------------------------|
| config  | object   | Bulk status update configuration object.    |
| callback| function | Callback `(error: any, users: User[]) => void`. |

- Iterates over all posts in the config.
- Collects all users who have made endorsements.
- Returns a deduplicated list of users.

---

### changeStatusOfAllPost(config, userId, callback)

Changes the status of all posts as specified in the config.

| Name    | Type     | Description                                 |
|---------|----------|---------------------------------------------|
| config  | object   | Bulk status update configuration object.    |
| userId  | number   | ID of the user performing the update.       |
| callback| function | Callback `(error?: any) => void`.           |

- For each post, if a status change is specified, calls `createStatusUpdateForPostId`.

---

### moveNeededPosts(config, callback)

Moves posts to new groups as specified in the config.

| Name    | Type     | Description                                 |
|---------|----------|---------------------------------------------|
| config  | object   | Bulk status update configuration object.    |
| callback| function | Callback `(error?: any) => void`.           |

- For each post, if a `moveToGroupId` is specified, calls `movePostToGroupId`.

---

### createBulkStatusUpdates(statusUpdateJson, users, callback)

Creates bulk status update activities for a list of users.

| Name             | Type     | Description                                 |
|------------------|----------|---------------------------------------------|
| statusUpdateJson | object   | Bulk status update record.                  |
| users            | User[]   | Array of user objects.                      |
| callback         | function | Callback `(error?: any) => void`.           |

- For each user, creates an `AcActivity` of type `activity.bulk.status.update`.

---

## Configuration

### verifyMode

- **Type:** `boolean`
- **Description:** If `true`, the worker will only verify (dry run) changes without making modifications to the database.

### verifiedMovedPostCount, verifiedStatusChangedPostsCount

- **Type:** `number`
- **Description:** Counters for the number of posts that would be moved or have their status changed in verify mode.

---

## Example Usage

```js
const bulkStatusUpdateWorker = require('./path/to/BulkStatusUpdateWorker.cjs');

bulkStatusUpdateWorker.process({
  bulkStatusUpdateId: 123,
  verifyMode: true
}, function(error) {
  if (error) {
    console.error("Bulk status update failed:", error);
  } else {
    console.log("Bulk status update processed successfully.");
  }
});
```

---

## Related Models

- [Post](../../models/index.cjs)  
- [Group](../../models/index.cjs)  
- [Community](../../models/index.cjs)  
- [Domain](../../models/index.cjs)  
- [User](../../models/index.cjs)  
- [Endorsement](../../models/index.cjs)  
- [PostStatusChange](../../models/index.cjs)  
- [AcActivity](../../models/index.cjs)  
- [BulkStatusUpdate](../../models/index.cjs)  

---

## Exported Constants

None.

---

## Notes

- This module is intended for internal use as a background worker.
- All database operations are performed using Sequelize models.
- Error handling is robust, with optional Airbrake integration for error reporting.
- The worker supports a "verify" mode for dry runs, which is useful for testing or previewing changes before applying them.

---

## See Also

- [logger Utility](../utils/logger.md)
- [toJson Utility](../utils/to_json.md)
- [Airbrake Utility](../utils/airbrake.md)
- [Sequelize Models](../../models/index.md)
