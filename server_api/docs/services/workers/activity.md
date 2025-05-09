# Service Module: ActivityWorker

The `ActivityWorker` module is responsible for processing activity events within the application. It orchestrates the retrieval of activity data, determines the type of activity, and triggers the appropriate notification or recommendation logic. This worker is typically used in background job processing or event-driven workflows to handle user and system activities such as invitations, password changes, post and point events, and status changes.

---

## Export

```js
module.exports = new ActivityWorker();
```
Exports a singleton instance of the `ActivityWorker` class.

---

## Dependencies

- [models](../../models/index.cjs): Sequelize models for database access.
- [logger](../utils/logger.cjs): Logging utility.
- [toJson](../utils/to_json.cjs): Utility for converting objects to JSON (not directly used in this file).
- [async](https://caolan.github.io/async/v3/): Utility for asynchronous control flow.
- [airbrake](../utils/airbrake.cjs): Error reporting (conditionally loaded).
- [generatePostNotification](../engine/notifications/generate_post_notifications.cjs): Generates notifications for post-related activities.
- [generatePointNotification](../engine/notifications/generate_point_notifications.cjs): Generates notifications for point-related activities.
- [generateRecommendationEvent](../engine/recommendations/events_manager.cjs): Triggers recommendation events.
- [generatePostStatusChangeNotification](../engine/notifications/generate_post_status_change_notifications.cjs): Generates notifications for post status changes.

---

# Service: ActivityWorker

Handles the processing of activity events, including notification generation and recommendation event triggering.

## Methods

| Name    | Parameters                                                                 | Return Type | Description                                                                                  |
|---------|----------------------------------------------------------------------------|-------------|----------------------------------------------------------------------------------------------|
| process | activityJson: `object`, callback: `(error?: any) => void`                  | `void`      | Processes an activity event, triggers notifications and recommendation events as appropriate. |

---

## Method: ActivityWorker.process

Processes an activity event by:
1. Fetching the activity and its related entities from the database.
2. Determining the activity type and triggering the corresponding notification or event logic.
3. Handling errors and reporting them to Airbrake if configured.

### Parameters

| Name         | Type                                   | Description                                      |
|--------------|----------------------------------------|--------------------------------------------------|
| activityJson | `object`                               | The activity JSON object, must contain an `id`.  |
| callback     | `(error?: any) => void`                | Callback function to be called on completion.    |

### Activity Types Handled

- `activity.user.invite`
- `activity.password.recovery`
- `activity.password.changed`
- `activity.system.generalUserNotification`
- `activity.report.content`
- `activity.bulk.status.update`
- `activity.post.new`
- `activity.post.opposition.new`
- `activity.post.endorsement.new`
- `activity.point.new`
- `activity.point.helpful.new`
- `activity.point.unhelpful.new`
- `activity.point.newsStory.new`
- `activity.point.comment.new`
- `activity.post.status.change`

### Workflow

1. **Fetch Activity**: Loads the activity and its related user, domain, community, group, post, and point from the database.
2. **Process by Type**: Depending on the `activity.type`, calls the appropriate notification or event generator.
3. **Generate Recommendation Event**: Triggers a recommendation event for the activity.
4. **Error Handling**: Logs errors and, if Airbrake is configured, reports them.

### Example Usage

```js
const activityWorker = require('./path/to/activity_worker.cjs');

activityWorker.process({ id: 123 }, (err) => {
  if (err) {
    console.error('Activity processing failed:', err);
  } else {
    console.log('Activity processed successfully');
  }
});
```

---

## Internal Logic

- Uses `async.series` to ensure steps are executed in order.
- Loads related models using Sequelize's `include` option.
- Switches on `activity.type` to determine which notification/event logic to invoke.
- Handles both user and system activities.
- Integrates with Airbrake for error reporting if the environment variable `AIRBRAKE_PROJECT_ID` is set.

---

## Related Modules

- [generate_post_notifications.cjs](../engine/notifications/generate_post_notifications.cjs.md)
- [generate_point_notifications.cjs](../engine/notifications/generate_point_notifications.cjs.md)
- [generate_post_status_change_notifications.cjs](../engine/notifications/generate_post_status_change_notifications.cjs.md)
- [events_manager.cjs](../engine/recommendations/events_manager.cjs.md)
- [logger.cjs](../utils/logger.cjs.md)
- [airbrake.cjs](../utils/airbrake.cjs.md)

---

## Configuration

- **AIRBRAKE_PROJECT_ID**: If set in the environment, enables Airbrake error reporting.

---

## Exported Constants

None.

---

## See Also

- [models/index.cjs](../../models/index.cjs.md) for model definitions.
- [logger.cjs](../utils/logger.cjs.md) for logging utilities.
- [airbrake.cjs](../utils/airbrake.cjs.md) for error reporting.

---

**Note:** This module is intended for internal use as a background worker or as part of a job queue system. It is not an Express route handler or middleware.