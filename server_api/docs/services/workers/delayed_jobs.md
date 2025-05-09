# Service Module: DelayedJobWorker

This module defines the `DelayedJobWorker` service, responsible for processing various types of delayed jobs in the application. It handles the creation of activity records (both priority and app-originated), recounting group folders, and integrates with analytics and logging utilities. The worker is designed to be used as a singleton and is exported as an instantiated object.

---

## Methods

| Name                                | Parameters                        | Return Type | Description                                                                                 |
|------------------------------------- |-----------------------------------|-------------|---------------------------------------------------------------------------------------------|
| process                             | workPackage: object, callback: function | void        | Main entry point for processing a delayed job. Delegates to the appropriate handler based on `workPackage.type`. |

---

## Exported Instance

- **Type:** `DelayedJobWorker`
- **Export:** `module.exports = new DelayedJobWorker();`
- **Usage:** Import and use as a singleton to process delayed jobs.

---

## Internal Functions

### delayedCreatePriorityActivity

Handles the creation of a priority activity, ensuring all necessary references (community, group, post, etc.) are resolved before persisting the activity.

#### Parameters

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| workPackage | object   | The work package containing job data.            |
| callback    | function | Callback to be called upon completion or error.  |

#### Description

- Resolves missing `communityId` or `groupId` if only `postId` is provided.
- Builds and saves a new `AcActivity` record.
- Enqueues the activity for further processing if not of type `"activity.fromApp"`.
- Handles errors and logs relevant information.

---

### delayedCreateActivityFromApp

Handles the creation of an activity originating from the app (client-side), storing it as an `AcClientActivity` and optionally sending analytics events to Plausible.

#### Parameters

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| workPackage | object   | The work package containing job data.            |
| callback    | function | Callback to be called upon completion or error.  |

#### Description

- Builds and saves a new `AcClientActivity` record.
- Sends a Plausible analytics event if configured.
- Handles errors and logs relevant information.

---

## Method: DelayedJobWorker.process

Main entry point for processing a delayed job. Delegates to the appropriate handler based on the `type` property of the `workPackage`.

### Parameters

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| workPackage | object   | The work package for the delayed job.            |
| callback    | function | Callback to be called upon completion or error.  |

### Supported `workPackage.type` values

- `"create-activity-from-app"`: Calls `delayedCreateActivityFromApp`.
- `"create-priority-activity"`: Calls `delayedCreatePriorityActivity`.
- `"recount-group-folder"`: Calls `recountGroupFolder` (see [recount.cjs](./recount.md)).
- Any other value: Calls `callback` with an error message.

---

## Dependencies

- **models**: Sequelize models for database access ([../../models/index.cjs](../../models/index.cjs))
- **log**: Logging utility ([../utils/logger.cjs](../utils/logger.cjs))
- **queue**: Job queue for further processing ([./queue.cjs](./queue.cjs))
- **i18n**: Internationalization utility ([../utils/i18n.cjs](../utils/i18n.cjs))
- **toJson**: Utility for JSON conversion ([../utils/to_json.cjs](../utils/to_json.cjs))
- **addPlausibleEvent**: Analytics event sender ([../engine/analytics/plausible/manager.cjs](../engine/analytics/plausible/manager.cjs))
- **recountGroupFolder**: Group folder recount handler ([./recount.cjs](./recount.md))
- **airbrake**: Error reporting (conditionally loaded if `AIRBRAKE_PROJECT_ID` is set)

---

## Example Usage

```javascript
const delayedJobWorker = require('./path/to/this/module');

// Example work package
const workPackage = {
  type: "create-priority-activity",
  workData: {
    type: "some-activity-type",
    userId: 123,
    // ...other fields
  }
};

delayedJobWorker.process(workPackage, (err) => {
  if (err) {
    console.error("Job failed:", err);
  } else {
    console.log("Job processed successfully");
  }
});
```

---

## Related Models

- **AcActivity**: Activity record model (see [AcActivity](../../models/AcActivity.md))
- **AcClientActivity**: Client-originated activity model (see [AcClientActivity](../../models/AcClientActivity.md))
- **Group**: Group model (see [Group](../../models/Group.md))
- **Post**: Post model (see [Post](../../models/Post.md))

---

## Configuration

- **AIRBRAKE_PROJECT_ID**: If set, enables Airbrake error reporting.
- **PLAUSIBLE_API_KEY**: If set, enables sending analytics events to Plausible.

---

## Exported Constants

_None._

---

## See Also

- [queue.cjs](./queue.md)
- [recount.cjs](./recount.md)
- [logger.cjs](../utils/logger.md)
- [plausible/manager.cjs](../engine/analytics/plausible/manager.md)
- [AcActivity Model](../../models/AcActivity.md)
- [AcClientActivity Model](../../models/AcClientActivity.md)
