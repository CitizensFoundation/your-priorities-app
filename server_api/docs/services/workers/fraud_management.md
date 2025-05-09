# Service Module: FraudManagementWorker

The `FraudManagementWorker` module provides background processing for fraud management tasks in the system. It handles the detection and deletion of fraudulent items (such as endorsements, ratings, point qualities, points, and posts) by delegating to specialized fraud engines. It is designed to be used as a worker in a job queue, processing work packages that specify the type of fraud management operation to perform.

---

## Methods

| Name     | Parameters                                      | Return Type | Description                                                                                 |
|----------|-------------------------------------------------|-------------|---------------------------------------------------------------------------------------------|
| process  | workPackage: object, callback: (error?: any) => void | Promise<void> | Main entry point. Processes a fraud management work package according to its type.           |

---

## process

Processes a fraud management work package. Depending on the `type` field of the work package, it will either detect fraudulent items, delete them, or destroy a background job.

### Parameters

| Name        | Type                       | Description                                                                 |
|-------------|----------------------------|-----------------------------------------------------------------------------|
| workPackage | object                     | The work package describing the fraud management operation.                 |
| callback    | (error?: any) => void      | Callback to be called when processing is complete or if an error occurs.    |

#### workPackage Object Structure

| Property         | Type     | Description                                                                                  |
|------------------|----------|----------------------------------------------------------------------------------------------|
| type             | string   | The type of operation: `'delete-one-item'`, `'delete-items'`, `'delete-job'`, `'get-items'`. |
| collectionType   | string   | The collection to operate on: `'endorsements'`, `'ratings'`, `'pointQualities'`, `'points'`, `'posts'`. Required for get/delete types. |
| jobId            | number   | The ID of the background job. Required for error reporting and job deletion.                 |
| ...              | any      | Additional properties required by the specific fraud engine.                                 |

---

## Internal Functions

### ProcessFraudGet

Handles the detection of fraudulent items for a given collection type by instantiating the appropriate fraud engine and invoking its `processAndGetFraudItems` method.

#### Parameters

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| workPackage | object   | The work package for fraud detection.            |
| done        | function | Callback to be called when processing is done.   |

#### Behavior

- Instantiates the correct fraud engine based on `workPackage.collectionType`.
- Calls `processAndGetFraudItems()` on the engine.
- Handles errors by updating the background job with the error and calling the callback with the error.

---

### ProcessFraudDelete

Handles the deletion of fraudulent items for a given collection type by instantiating the appropriate fraud engine and invoking its `deleteItems` method.

#### Parameters

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| workPackage | object   | The work package for fraud deletion.             |
| done        | function | Callback to be called when processing is done.   |

#### Behavior

- Instantiates the correct fraud engine based on `workPackage.collectionType`.
- Calls `deleteItems()` on the engine.
- Handles errors by updating the background job with the error and calling the callback with the error.

---

## Dependencies

- [models](../../models/index.cjs): Used for updating background job errors and destroying jobs.
- [FraudGetEndorsements](../engine/moderation/fraud/FraudGetEndorsements.cjs)
- [FraudGetRatings](../engine/moderation/fraud/FraudGetRatings.cjs)
- [FraudGetPointQualities](../engine/moderation/fraud/FraudGetPointQualities.cjs)
- [FraudGetPoints](../engine/moderation/fraud/FraudGetPoints.cjs)
- [FraudGetPosts](../engine/moderation/fraud/FraudGetPosts.cjs)
- [FraudDeleteEndorsements](../engine/moderation/fraud/FraudDeleteEndorsements.cjs)
- [FraudDeleteRatings](../engine/moderation/fraud/FraudDeleteRatings.cjs)
- [FraudDeletePointQualities](../engine/moderation/fraud/FraudDeletePointQualities.cjs)
- [FraudDeletePoints](../engine/moderation/fraud/FraudDeletePoints.cjs)
- [FraudDeletePosts](../engine/moderation/fraud/FraudDeletePosts.cjs)
- [logger](../utils/logger.cjs): For logging.
- [queue](./queue.cjs): For queue management (not directly used in this file).
- [i18n](../utils/i18n.cjs): For internationalization (not directly used in this file).
- [toJson](../utils/to_json.cjs): For JSON conversion (not directly used in this file).
- [lodash](https://lodash.com/): Utility functions (not directly used in this file).
- [airbrake](../utils/airbrake.cjs): Error reporting (conditionally loaded if `AIRBRAKE_PROJECT_ID` is set).

---

## Exported Instance

The module exports a singleton instance of `FraudManagementWorker`:

```js
module.exports = new FraudManagementWorker();
```

---

## Example Usage

```javascript
const fraudWorker = require('./path/to/FraudManagementWorker.cjs');

const workPackage = {
  type: 'get-items',
  collectionType: 'endorsements',
  jobId: 123,
  // ...other properties required by the fraud engine
};

fraudWorker.process(workPackage, (err) => {
  if (err) {
    console.error('Fraud processing failed:', err);
  } else {
    console.log('Fraud processing completed successfully.');
  }
});
```

---

## Related Modules

- [FraudGetEndorsements](../engine/moderation/fraud/FraudGetEndorsements.md)
- [FraudGetRatings](../engine/moderation/fraud/FraudGetRatings.md)
- [FraudGetPointQualities](../engine/moderation/fraud/FraudGetPointQualities.md)
- [FraudGetPoints](../engine/moderation/fraud/FraudGetPoints.md)
- [FraudGetPosts](../engine/moderation/fraud/FraudGetPosts.md)
- [FraudDeleteEndorsements](../engine/moderation/fraud/FraudDeleteEndorsements.md)
- [FraudDeleteRatings](../engine/moderation/fraud/FraudDeleteRatings.md)
- [FraudDeletePointQualities](../engine/moderation/fraud/FraudDeletePointQualities.md)
- [FraudDeletePoints](../engine/moderation/fraud/FraudDeletePoints.md)
- [FraudDeletePosts](../engine/moderation/fraud/FraudDeletePosts.md)

---

## Error Handling

- If an error occurs during processing, the error is logged, the background job is updated with the error, and the callback is called with the error.
- If the `collectionType` is not recognized, the callback is called with an error message.

---

## Configuration

- If the environment variable `AIRBRAKE_PROJECT_ID` is set, the [airbrake](../utils/airbrake.cjs) module is loaded for error reporting.

---

## Exported Constants

_None._

---

## See Also

- [AcBackgroundJob Model](../../models/index.cjs) for job management and error reporting.
- [queue](./queue.cjs) for job queue integration.
