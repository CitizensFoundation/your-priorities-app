# Service Module: ModerationWorker

The `ModerationWorker` module is responsible for processing various moderation-related work packages in an asynchronous worker context. It delegates tasks such as toxicity estimation, image annotation, and batch moderation actions to specialized services and engines. This module is typically used as a background worker, often in conjunction with a job queue.

---

## Exported Instance

| Name              | Type             | Description                                      |
|-------------------|------------------|--------------------------------------------------|
| `ModerationWorker`| ModerationWorker | Singleton instance of the ModerationWorker class. |

---

## Class: ModerationWorker

Handles the processing of moderation work packages, dispatching them to the appropriate moderation engines or services based on the work package type.

### Methods

#### process

Processes a moderation work package by dispatching it to the appropriate moderation engine or service.

| Name        | Type     | Description                                                                 |
|-------------|----------|-----------------------------------------------------------------------------|
| workPackage | object   | The work package containing moderation task details.                         |
| callback    | function | Callback function to be called upon completion or error. Signature: `(error?: any) => void` |

##### Supported Work Package Types

| Type                                 | Description                                                                                      |
|---------------------------------------|--------------------------------------------------------------------------------------------------|
| `estimate-post-toxicity`              | Estimates the toxicity score for a post.                                                         |
| `estimate-point-toxicity`             | Estimates the toxicity score for a point.                                                        |
| `estimate-collection-toxicity`        | Estimates the toxicity score for a collection.                                                   |
| `post-review-and-annotate-images`     | Reviews and labels images associated with a post.                                                |
| `point-review-and-annotate-images`    | Reviews and labels images associated with a point.                                               |
| `collection-review-and-annotate-images`| Reviews and labels images for a collection (community or group).                                 |
| `perform-many-moderation-actions`     | Performs multiple moderation actions in batch.                                                   |

##### Parameters

| Name         | Type     | Description                                                                 |
|--------------|----------|-----------------------------------------------------------------------------|
| workPackage  | object   | The moderation work package. Must include a `type` property.                |
| callback     | function | Node-style callback: `(error?: any) => void`. Called on completion or error.|

##### Behavior

- Dispatches the work package to the appropriate moderation engine/service based on `workPackage.type`.
- Handles both synchronous and asynchronous moderation tasks.
- For unknown types, calls the callback with an error message.

##### Example Usage

```javascript
const moderationWorker = require('./path/to/ModerationWorker.cjs');

const workPackage = {
  type: 'estimate-post-toxicity',
  // ...other properties required by the specific moderation engine
};

moderationWorker.process(workPackage, (err) => {
  if (err) {
    console.error('Moderation task failed:', err);
  } else {
    console.log('Moderation task completed successfully.');
  }
});
```

---

## Dependencies

- [async](https://caolan.github.io/async/)
- [models](../../models/index.cjs)
- [logger](../utils/logger.cjs)
- [queue](./queue.cjs)
- [i18n](../utils/i18n.cjs)
- [toJson](../utils/to_json.cjs)
- [lodash](https://lodash.com/)
- [fs](https://nodejs.org/api/fs.html)
- [PostLabeling](../engine/moderation/image_labeling/PostLabeling.cjs)
- [PointLabeling](../engine/moderation/image_labeling/PointLabeling.cjs)
- [GroupLabeling](../engine/moderation/image_labeling/GroupLabeling.cjs)
- [CommunityLabeling](../engine/moderation/image_labeling/CommunityLabeling.cjs)
- [estimateToxicityScoreForPost](../engine/moderation/toxicity_analysis.cjs)
- [estimateToxicityScoreForPoint](../engine/moderation/toxicity_analysis.cjs)
- [estimateToxicityScoreForCollection](../engine/moderation/toxicity_analysis.cjs)
- [performManyModerationActions](../engine/moderation/process_moderation_items.cjs)
- [airbrake](../utils/airbrake.cjs) (conditionally loaded if `AIRBRAKE_PROJECT_ID` is set)

---

## Related Modules

- [PostLabeling](../engine/moderation/image_labeling/PostLabeling.md)
- [PointLabeling](../engine/moderation/image_labeling/PointLabeling.md)
- [GroupLabeling](../engine/moderation/image_labeling/GroupLabeling.md)
- [CommunityLabeling](../engine/moderation/image_labeling/CommunityLabeling.md)
- [estimateToxicityScoreForPost](../engine/moderation/toxicity_analysis.md)
- [performManyModerationActions](../engine/moderation/process_moderation_items.md)

---

## Error Handling

- If the work package type is unknown, the callback is called with an error message.
- For asynchronous tasks, errors are caught and passed to the callback.

---

## Configuration

- If the environment variable `AIRBRAKE_PROJECT_ID` is set, Airbrake error reporting is enabled via `../utils/airbrake.cjs`.

---

## Export

```js
module.exports = new ModerationWorker();
```
Exports a singleton instance of the ModerationWorker class for use in worker processes or job queues.