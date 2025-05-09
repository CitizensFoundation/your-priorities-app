# Service Module: recountGroupFolder

This module provides a service function for recursively recounting and updating aggregate statistics (posts, points, users) for a group and its parent folders in a hierarchical group structure. It is typically used to ensure that parent group folders have up-to-date counters reflecting the sum of their subgroups' data.

---

## Methods

| Name                | Parameters                                   | Return Type | Description                                                                                  |
|---------------------|----------------------------------------------|-------------|----------------------------------------------------------------------------------------------|
| recountGroupFolder  | workPackage: object, callback: Function      | void        | Recursively updates counter fields for a group and its parent folders.                       |

---

## Function: recountGroupFolder

Recursively traverses up the group folder hierarchy starting from a given group, recalculates and updates the `counter_posts`, `counter_points`, and `counter_users` fields for each parent group folder based on its immediate subgroups. This ensures that aggregate statistics are accurate after changes in subgroup data.

### Parameters

| Name         | Type     | Description                                                                 |
|--------------|----------|-----------------------------------------------------------------------------|
| workPackage  | object   | An object containing at least a `groupId` property (the starting group ID). |
| callback     | Function | A Node.js-style callback function: `function(error?: Error): void`.         |

### Usage

```javascript
const { recountGroupFolder } = require('./path/to/this/module');

recountGroupFolder({ groupId: 123 }, (err) => {
  if (err) {
    // Handle error
  } else {
    // Success
  }
});
```

### Description

- **Traversal:** Starts from the group specified by `workPackage.groupId` and traverses up the `in_group_folder_id` chain, collecting all parent group IDs up to a maximum stack size of 100.
- **Aggregation:** For each parent group folder, fetches all immediate subgroups and aggregates their `counter_posts`, `counter_points`, and unique users (from the `GroupUsers` association).
- **Update:** Updates the parent group folder's counters with the aggregated values. The `counter_users` is set to at least 1 (never zero).
- **Error Handling:** If any error occurs during the process, the callback is called with the error.

### Dependencies

- **models:** Expects a Sequelize models object with at least `Group` and `User` models, and a `GroupUsers` association.
- **log:** Logging utility for info-level logs.
- **lodash (_):** Used for array union and uniqueness operations.

---

## Example

```javascript
// Example usage in an Express route or service
const { recountGroupFolder } = require('./services/recountGroupFolder');

app.post('/api/groups/:groupId/recount', (req, res) => {
  recountGroupFolder({ groupId: req.params.groupId }, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to recount group folder' });
    }
    res.json({ success: true });
  });
});
```

---

## Internal Logic

1. **Stack Traversal:** 
   - Follows the `in_group_folder_id` chain from the starting group up to the root or until `maxStackSize` is reached.
2. **Aggregation:**
   - For each group in the chain, fetches all subgroups and their counters.
   - Sums up `counter_posts` and `counter_points`.
   - Collects all unique user IDs from the `GroupUsers` association.
3. **Update:**
   - Reloads the group instance to ensure fresh data.
   - Updates the counters and saves the group.

---

## Exported Members

| Name                | Type     | Description                                      |
|---------------------|----------|--------------------------------------------------|
| recountGroupFolder  | Function | See above for full documentation.                |

---

## See Also

- [Group Model](../../models/index.cjs) (for the structure of the `Group` and `User` models)
- [logger Utility](../utils/logger.cjs) (for logging implementation)
- [Lodash Documentation](https://lodash.com/docs/) (for `_.union` and `_.uniq`)

---

## Notes

- The function is asynchronous but uses a callback pattern (not Promises).
- Designed for internal use in background jobs or triggered by group data changes.
- The maximum stack size prevents infinite loops in case of cyclic group folder references.

---

**File:** `services/recountGroupFolder.cjs`