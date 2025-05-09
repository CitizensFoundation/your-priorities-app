# Utility Module: toxicity_estimator

This module provides utility functions for estimating and handling toxicity scores for various content types (points, posts, collections) using the Google Perspective API. It includes logic for translation, score calculation, threshold checks, analytics event dispatch, and reporting. The module is designed to be used as part of a moderation pipeline in a Node.js/Express.js application.

---

## Exported Functions

| Name                              | Parameters                | Return Type | Description                                                                                 |
|------------------------------------|---------------------------|-------------|---------------------------------------------------------------------------------------------|
| estimateToxicityScoreForPoint      | options: object, callback: function | void        | Estimates toxicity for a Point, updates the model, triggers reporting and analytics as needed. |
| estimateToxicityScoreForPost       | options: object, callback: function | void        | Estimates toxicity for a Post, updates the model, triggers reporting and analytics as needed.  |
| estimateToxicityScoreForCollection | options: object, callback: function | void        | Estimates toxicity for a Collection (Community or Group), updates the model, triggers reporting as needed. |

---

## Configuration

### Environment Variables

| Name                           | Type   | Description                                                                                 |
|--------------------------------|--------|---------------------------------------------------------------------------------------------|
| GOOGLE_PERSPECTIVE_API_KEY     | string | API key for Google Perspective API. Required for toxicity estimation.                       |
| GOOGLE_TRANSLATE_PROJECT_ID    | string | Optional. Project ID for Google Translate, used for translation requests.                   |

---

## Constants

| Name                    | Type    | Description                                                                                 |
|-------------------------|---------|---------------------------------------------------------------------------------------------|
| TOXICITY_THRESHOLD      | number  | Threshold (0.5) above which content is considered toxic for moderation.                      |
| TOXICITY_EMAIL_THRESHOLD| number  | Higher threshold (0.75) above which email notifications may be triggered.                   |

---

## Internal Functions

### getToxicityScoreForText

Estimates the toxicity score for a given text using the Perspective API.

#### Parameters

| Name       | Type     | Description                                                                 |
|------------|----------|-----------------------------------------------------------------------------|
| text       | string   | The text to analyze.                                                        |
| doNotStore | boolean  | If true, instructs the API not to store the text.                           |
| callback   | function | Callback function `(error, result)` with the API result or error.           |

---

### setupModelPublicDataScore

Populates the moderation-related fields in a model's `data` property with toxicity scores and raw results.

#### Parameters

| Name   | Type   | Description                                                                 |
|--------|--------|-----------------------------------------------------------------------------|
| model  | object | The Sequelize model instance to update.                                      |
| text   | string | The text that was analyzed.                                                  |
| results| object | The result object from the Perspective API.                                  |

---

### hasModelBreachedToxicityThreshold

Checks if a model's toxicity score exceeds the standard threshold.

#### Parameters

| Name   | Type   | Description                                                                 |
|--------|--------|-----------------------------------------------------------------------------|
| model  | object | The model instance with moderation data.                                     |

#### Returns

- `boolean`: True if the toxicity score is above `TOXICITY_THRESHOLD`.

---

### hasModelBreachedToxicityEmailThreshold

Checks if a model's toxicity score exceeds the email notification threshold.

#### Parameters

| Name   | Type   | Description                                                                 |
|--------|--------|-----------------------------------------------------------------------------|
| model  | object | The model instance with moderation data.                                     |

#### Returns

- `boolean`: True if the toxicity score is above `TOXICITY_EMAIL_THRESHOLD`.

---

### getTranslatedTextForCollection

Fetches and concatenates the translated name and content for a collection (community or group).

#### Parameters

| Name           | Type     | Description                                                                 |
|----------------|----------|-----------------------------------------------------------------------------|
| collectionType | string   | Either `"community"` or `"group"`.                                          |
| model          | object   | The collection model instance.                                              |
| callback       | function | Callback `(error, text)` with the concatenated translated text.             |

---

### getTranslatedTextForPoint

Fetches the translated content for a point.

#### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| point    | object   | The point model instance.                                                   |
| callback | function | Callback `(error, translation)` with the translation result.                |

---

### getTranslatedTextForPost

Fetches and concatenates the translated name, description, transcript, and structured answers for a post.

#### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| post     | object   | The post model instance.                                                    |
| callback | function | Callback `(error, text)` with the concatenated translated text.             |

---

### sendPostAnalyticsEvent

Sends an analytics event for a post's toxicity evaluation.

#### Parameters

| Name | Type   | Description                                                                 |
|------|--------|-----------------------------------------------------------------------------|
| post | object | The post model instance with moderation data.                                |

---

### sendPointAnalyticsEvent

Sends an analytics event for a point's toxicity evaluation.

#### Parameters

| Name  | Type   | Description                                                                 |
|-------|--------|-----------------------------------------------------------------------------|
| point | object | The point model instance with moderation data.                              |

---

## Main Exported Functions

### estimateToxicityScoreForPoint

Estimates the toxicity score for a Point, updates the model, triggers reporting and analytics as needed.

#### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| options  | object   | `{ pointId: string }` - The ID of the point to analyze.                     |
| callback | function | Callback `(error)` called when processing is complete or on error.          |

#### Usage

```javascript
estimateToxicityScoreForPoint({ pointId: "123" }, (err) => {
  if (err) { /* handle error */ }
});
```

---

### estimateToxicityScoreForPost

Estimates the toxicity score for a Post, updates the model, triggers reporting and analytics as needed.

#### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| options  | object   | `{ postId: string }` - The ID of the post to analyze.                       |
| callback | function | Callback `(error)` called when processing is complete or on error.          |

#### Usage

```javascript
estimateToxicityScoreForPost({ postId: "456" }, (err) => {
  if (err) { /* handle error */ }
});
```

---

### estimateToxicityScoreForCollection

Estimates the toxicity score for a Collection (Community or Group), updates the model, triggers reporting as needed.

#### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| options  | object   | `{ collectionType: "community"|"group", collectionId: string }`             |
| callback | function | Callback `(error)` called when processing is complete or on error.          |

#### Usage

```javascript
estimateToxicityScoreForCollection({ collectionType: "community", collectionId: "789" }, (err) => {
  if (err) { /* handle error */ }
});
```

---

## Dependencies

- [Perspective API Client](./perspective_api_client.md): Used for toxicity analysis.
- [models](../../../models/index.md): Sequelize models for database access.
- [logger](../../utils/logger.md): Logging utility.
- [queue](../../workers/queue.md): Job queue for analytics events.
- [async](https://caolan.github.io/async/): For parallel async operations.

---

## Example Workflow

1. Call one of the exported functions with the appropriate options and a callback.
2. The function fetches the relevant model instance from the database.
3. The text to be analyzed is translated to English if necessary.
4. The text is sent to the Perspective API for toxicity analysis.
5. The model's moderation data is updated with the results.
6. If toxicity thresholds are breached, reporting and analytics events are triggered.

---

## See Also

- [Perspective API Client](./perspective_api_client.md)
- [AcTranslationCache Model](../../../models/index.md)
- [Logger Utility](../../utils/logger.md)
- [Queue Worker](../../workers/queue.md)

---

**Note:** This module is intended for internal use in moderation and analytics pipelines. It is not an Express route handler or middleware, but is typically invoked from controllers or background jobs.