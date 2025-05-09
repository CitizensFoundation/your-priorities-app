# Script: deleteOldNotifications.cjs

This script deletes old notification records from the database using the Sequelize ORM. It is intended to be run as a standalone Node.js script (not as part of an Express.js route). The script deletes notifications older than one year, in batches, up to a configurable maximum number.

---

## Purpose

- **Bulk deletes notifications** from the `AcNotification` model that are older than one year.
- **Batches deletions** to avoid overloading the database.
- **Supports a configurable maximum** number of notifications to delete per run (via command-line argument).
- **Logs progress** and total duration.

---

## Usage

```bash
node deleteOldNotifications.cjs [maxNumberOfNotificationsToDelete]
```

- `maxNumberOfNotificationsToDelete` (optional): The maximum number of notifications to delete in this run. Defaults to `1,000,000` if not provided.

---

## Configuration

| Name                              | Type     | Description                                                                 |
|------------------------------------|----------|-----------------------------------------------------------------------------|
| maxNumberOfNotificationsToDelete   | number   | Maximum number of notifications to delete in this run.                      |
| numberOfDeletedNotifications       | number   | Counter for the number of deleted notifications.                            |
| startTime                         | Moment   | Start time of the script, used for duration calculation.                    |
| cutoffDate                        | string   | ISO string representing the date 1 year ago from now.                       |

---

## Main Logic

- **Fetches notifications** older than one year in batches of 1,000.
- **Deletes notifications** in sub-batches of 100 IDs at a time.
- **Pauses** briefly between deletions to avoid overwhelming the database.
- **Stops** when there are no more notifications to delete or the maximum is reached.

---

## Utility Functions

### sleep

Pauses execution for a specified number of milliseconds.

```javascript
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

| Name | Type   | Description                    |
|------|--------|--------------------------------|
| ms   | number | Milliseconds to sleep/pause.   |

---

### chunk

Splits an array into chunks of a specified size.

```javascript
function chunk(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}
```

| Name | Type    | Description                |
|------|---------|----------------------------|
| arr  | any[]   | Array to be chunked.       |
| size | number  | Size of each chunk.        |

**Returns:** `any[][]` — Array of chunked arrays.

---

## Database Model: [AcNotification](../../models/index.cjs)

- **Model:** `AcNotification`
- **Fields Used:** `id`, `created_at`
- **Query:** Finds notifications where `created_at` is older than one year.

---

## Process Flow

1. **Calculate cutoff date** (1 year ago).
2. **Loop**:
    - Fetch up to 1,000 notification IDs older than cutoff.
    - If found:
        - Chunk IDs into groups of 100.
        - For each chunk:
            - Delete notifications by ID.
            - Increment deleted count.
            - Pause briefly.
            - Stop if max deletions reached.
    - If none found, exit loop.
    - Pause briefly between fetches.
3. **Log** total deleted and duration.
4. **Exit** process.

---

## Example Output

```
1000 notifications found at offset 0
Total deleted so far: 100
Total deleted so far: 200
...
5000 old notifications deleted
Duration: 00:01:23.456
```

---

## Error Handling

- If an error occurs during fetch or delete, logs the error and stops further processing.

---

## Dependencies

- [Sequelize models](../../models/index.cjs)
- [moment](https://momentjs.com/) for date calculations and formatting

---

## Exported Constants

None. This script is intended to be run directly and does not export any modules or functions.

---

## See Also

- [AcNotification model](../../models/index.cjs)
- [Sequelize documentation](https://sequelize.org/)
- [moment documentation](https://momentjs.com/)

---

## Example Usage

```bash
# Delete up to 5000 old notifications
node deleteOldNotifications.cjs 5000
```

---

## Notes

- This script is **not** intended to be used as an Express route or middleware.
- Adjust batch sizes and sleep durations as needed for your database performance.
- Ensure you have appropriate backups and permissions before running bulk deletion scripts in production environments.