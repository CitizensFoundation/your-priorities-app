# Service: SimilaritiesWorker

The `SimilaritiesWorker` is a service module responsible for processing "similarities" work packages, typically as part of a background job or queue system. It delegates specific work types (currently only `update-collection`) to the appropriate analytics manager function. This worker is designed to be used by a job queue or task runner to handle asynchronous processing of similarity-related tasks.

---

## Methods

| Name    | Parameters                                      | Return Type | Description                                                                                  |
|---------|-------------------------------------------------|-------------|----------------------------------------------------------------------------------------------|
| process | workPackage: object, callback: (error?: any) => void | void        | Processes a similarities work package. Delegates to the correct handler based on type.        |

---

## Method: process

Processes a similarities work package by delegating to the appropriate handler based on the `type` property of the work package.

### Parameters

| Name        | Type                                | Description                                                                 |
|-------------|-------------------------------------|-----------------------------------------------------------------------------|
| workPackage | object                              | The work package object containing at least a `type` property.              |
| callback    | (error?: any) => void               | Callback function to be called when processing is complete or on error.     |

#### workPackage Object

- **type**: `string`  
  The type of work to process. Currently supported: `"update-collection"`.

- Other properties may be present depending on the work type.

### Behavior

- If `workPackage.type` is `"update-collection"`, calls [`updateSimilaritiesCollection`](../engine/analytics/manager.md#function-updatesimilaritiescollection) with the work package and callback.
- For unknown types, calls the callback with an error message.

### Example

```javascript
const similaritiesWorker = require('./path/to/similarities_worker.cjs');

const workPackage = {
  type: 'update-collection',
  // ...other properties required by updateSimilaritiesCollection
};

similaritiesWorker.process(workPackage, (err) => {
  if (err) {
    console.error('Failed to process work package:', err);
  } else {
    console.log('Work package processed successfully.');
  }
});
```

---

## Export

This module exports a singleton instance of `SimilaritiesWorker`:

```javascript
module.exports = new SimilaritiesWorker();
```

---

## Dependencies

- [`async`](https://caolan.github.io/async/) - For asynchronous control flow (not directly used in this file, but may be used by dependencies).
- [`models`](../../models/index.cjs) - Data models (not directly used in this file).
- [`logger`](../utils/logger.cjs) - Logging utility (not directly used in this file).
- [`queue`](./queue.cjs) - Queue management (not directly used in this file).
- [`i18n`](../utils/i18n.cjs) - Internationalization utility (not directly used in this file).
- [`toJson`](../utils/to_json.cjs) - JSON utility (not directly used in this file).
- [`lodash`](https://lodash.com/) - Utility library (not directly used in this file).
- [`fs`](https://nodejs.org/api/fs.html) - File system module (not directly used in this file).
- [`updateSimilaritiesCollection`](../engine/analytics/manager.cjs) - Function to update the similarities collection.

---

## See Also

- [updateSimilaritiesCollection](../engine/analytics/manager.md#function-updatesimilaritiescollection) - The function called for `"update-collection"` work packages.
- [queue.cjs](./queue.md) - The queue system that may use this worker.
- [logger.cjs](../utils/logger.md) - Logging utility.

---

## File Location

`[project-root]/src/workers/similarities_worker.cjs` (assumed path based on import style)

---

## Related

- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts) - For context on agent-based analytics, if relevant.

---

**Note:**  
This worker is designed to be extended with additional work package types as needed. To add new types, extend the `switch` statement in the `process` method.