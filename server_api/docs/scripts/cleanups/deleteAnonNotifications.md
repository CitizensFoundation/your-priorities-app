# Script: deleteOldAnonNotifications.cjs

This script deletes old notifications belonging to anonymous users from the database. It is intended to be run as a standalone Node.js process, typically for maintenance or cleanup tasks. The script iterates through users who are anonymous and whose accounts are older than 3 days, then deletes their notifications in batches, up to a configurable maximum.

---

## Configuration

### Command-Line Arguments

| Name      | Type   | Description                                                                 | Required | Default |
|-----------|--------|-----------------------------------------------------------------------------|----------|---------|
| maxNumber | number | The maximum number of notifications to delete. Passed as the first argument | No       | 1000    |

Usage example:
```bash
node deleteOldAnonNotifications.cjs 5000
```
This will delete up to 5000 notifications.

---

## Process Overview

1. **User Selection**: Finds users who are anonymous (`profile_data.isAnonymousUser === true`) and whose accounts were created more than 3 days ago.
2. **Notification Deletion**: For each batch of users, finds their notifications and deletes them in chunks of 100, with a short delay between each chunk to avoid overloading the database.
3. **Progress Tracking**: Logs progress to the console, including the number of users and notifications processed, and the total number of notifications deleted.
4. **Termination**: Stops when the maximum number of notifications is deleted or when there are no more eligible notifications.

---

## Internal Functions

### sleep

Pauses execution for a specified number of milliseconds.

#### Parameters

| Name | Type   | Description                |
|------|--------|----------------------------|
| ms   | number | Milliseconds to sleep      |

#### Example
```javascript
await sleep(100);
```

---

### chunk

Splits an array into smaller arrays ("chunks") of a specified size.

#### Parameters

| Name | Type    | Description                |
|------|---------|----------------------------|
| arr  | any[]   | The array to chunk         |
| size | number  | The size of each chunk     |

#### Returns

- `any[][]`: An array of arrays, each of length up to `size`.

#### Example
```javascript
const chunks = chunk([1,2,3,4,5], 2); // [[1,2],[3,4],[5]]
```

---

## Database Models Used

- **User**: Represents users in the system. Only users with `profile_data.isAnonymousUser === true` and `created_at` older than 3 days are considered.
- **AcNotification**: Represents notifications. Only notifications belonging to the selected users are deleted.

> **Note:** The models are imported from `../../models/index.cjs`. For more details, see the [models documentation](../../models/index.md).

---

## Main Script Logic

The main logic is wrapped in an immediately-invoked async function expression (IIFE):

### Steps

1. **Initialize Counters and Timers**
   - `numberOfDeletedNotifications` tracks the total number deleted.
   - `startTime` records the script start time.

2. **User Batch Loop**
   - Fetches users in batches of 500, offsetting as needed.
   - Only users matching the criteria (anonymous, older than 3 days) are selected.

3. **Notification Batch Loop**
   - For each batch of users, fetches their notifications in batches of 1000.
   - Notification IDs are chunked into groups of 100 for deletion.

4. **Deletion**
   - Deletes notifications in chunks, with a 50ms delay between each chunk.
   - Stops if the maximum number of deletions is reached.

5. **Logging**
   - Logs progress after each batch and at the end, including the total number deleted and the duration.

6. **Error Handling**
   - If an error occurs, logs the error and terminates the process.

---

## Example Output

```
500 users offset 0
1000 notifications offset 0
100
200
...
No more notifications left to process from user
...
1234 old anon notifications deleted
Duration 00:01:23.456
```

---

## Exported Constants

None. This script is intended to be run directly and does not export any modules or functions.

---

## Dependencies

- [moment](https://momentjs.com/): For date manipulation and formatting.
- [Sequelize](https://sequelize.org/): For database querying (used via the imported models).

---

## Related Files

- [models/index.cjs](../../models/index.md): Contains the Sequelize models used for querying and deleting users and notifications.

---

## See Also

- [AcNotification Model](../../models/AcNotification.md)
- [User Model](../../models/User.md)

---

## Notes

- This script is **destructive**: it permanently deletes notification records from the database.
- It is recommended to run this script during off-peak hours and to ensure proper backups are in place.
- The script uses delays (`sleep`) to avoid overwhelming the database with delete operations.

---