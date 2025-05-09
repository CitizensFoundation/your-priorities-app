# Utility Module: importAllActions

This module is a data migration and import utility for processing and importing user actions (such as posts, endorsements, points, and point quality ratings) into an event/action system. It reads data from various models, transforms them into action objects, and sends them in batches to an event manager for further processing (e.g., indexing, analytics, or event sourcing).

It is intended to be run as a script, typically for backfilling or migrating historical data into a new event-based system.

---

## Exported Functions

This file does **not** export any functions; it is intended to be run directly as a script.

---

## Internal Functions

### chunkArray

Splits an array into chunks of a specified size.

#### Parameters

| Name        | Type     | Description                        |
|-------------|----------|------------------------------------|
| myArray     | any[]    | The array to split                 |
| chunk_size  | number   | The maximum size of each chunk     |

#### Returns

- `any[][]`: An array of arrays, each of length up to `chunk_size`.

#### Example

```javascript
const chunks = chunkArray([1,2,3,4,5], 2); // [[1,2],[3,4],[5]]
```

---

### processDots

Prints a dot (`.`) to `stdout` for progress indication, and inserts a newline every 250 dots to keep the output readable.

#### Usage

Called after processing each object to provide visual feedback during long-running imports.

---

### importAllActionsFor

Imports all actions for a given model, matching a `where` condition, and sends them to the event manager.

#### Parameters

| Name        | Type        | Description                                                                 |
|-------------|-------------|-----------------------------------------------------------------------------|
| model       | Model       | Sequelize model to query                                                    |
| where       | object      | Query conditions for the model                                              |
| include     | object[]    | Sequelize include array for related models                                  |
| action      | string      | The action type (e.g., 'endorse', 'oppose', 'new-post', etc.)              |
| done        | function    | Callback to invoke when done                                                |
| attributes  | string[]    | List of attributes to select from the model                                 |

#### Description

- Queries the specified model for all records matching the `where` condition.
- For each record, constructs an action object with relevant fields.
- Batches actions in groups of 1000, and sends each batch to `createManyActions`.
- Handles different action types and their associated post/point relationships.
- Provides progress output via `processDots`.

---

### importAll

Orchestrates the import of all supported action types in series.

#### Parameters

| Name   | Type      | Description                        |
|--------|-----------|------------------------------------|
| done   | function  | Callback to invoke when all imports are complete |

#### Description

- Runs a series of import jobs for:
  - New posts (`new-post`)
  - Endorsements (`endorse`, `oppose`)
  - Points (`new-point`, `new-point-comment`)
  - Point quality ratings (`point-helpful`, `point-unhelpful`)
- Each job uses `importAllActionsFor` with appropriate models and filters.
- When all jobs are complete, logs "FIN" and calls the final callback.

---

## Script Execution

At the end of the file, the script is executed:

```javascript
importAll(function () {
  console.log("Done importing all");
  process.exit();
});
```

- Runs the full import process.
- Exits the process when done.

---

## Dependencies

- **models**: Sequelize models, imported from `../../../models/index.cjs`.
- **lodash**: Utility library (imported as `_`), but not used in this file.
- **async**: For asynchronous control flow (`eachOfLimit`, `eachOfSeries`, `series`).
- **log**: Logger utility from `../../../utils/logger.cjs`.
- **createAction, createManyActions**: Event manager functions from `./events_manager.cjs`.

---

## Configuration

| Name                | Type    | Description                                      |
|---------------------|---------|--------------------------------------------------|
| postUpdateAsyncLimit| number  | Not used in this file (default: 42)              |

---

## Constants

| Name           | Type    | Description                                      |
|----------------|---------|--------------------------------------------------|
| lineCrCounter  | number  | Tracks number of dots printed for progress       |

---

## Example Usage

This file is intended to be run as a script:

```bash
node importAllActions.cjs
```

It will process all relevant actions and import them into the event system, printing progress to the console.

---

## Related Modules

- [events_manager.cjs](./events_manager.md): Provides `createAction` and `createManyActions` for sending actions to the event system.
- [models/index.cjs](../../../models/index.cjs): Sequelize models for `Post`, `Endorsement`, `Point`, `PointQuality`, etc.
- [logger.cjs](../../../utils/logger.cjs): Logging utility.

---

## Notes

- This script is designed for one-time or batch migration tasks.
- It assumes the presence of specific model relationships (e.g., `Point.Post`, `Endorsement.Post`).
- Error handling is minimal; errors are logged to the console.
- The script will exit the process when complete.

---

## See Also

- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts) (for event-driven agent models in Policy Synth)
