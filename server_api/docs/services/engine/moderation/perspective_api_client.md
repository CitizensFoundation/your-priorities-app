# Service Module: Perspective

A Node.js client for the [Google Perspective API](https://www.perspectiveapi.com/), providing methods to analyze text for toxicity and other attributes. Handles text validation, HTML stripping, truncation, and error management. Exposes custom error classes for granular error handling.

---

## Configuration

| Name      | Type   | Description                          | Required |
|-----------|--------|--------------------------------------|----------|
| apiKey    | string | Google Perspective API key           | Yes      |

---

## Class: Perspective

Main class for interacting with the Perspective API.

### Constructor

#### Parameters

| Name    | Type   | Description                        | Required |
|---------|--------|------------------------------------|----------|
| options | object | Configuration object (see above)   | Yes      |

#### Example

```javascript
const Perspective = require('./perspective');
const client = new Perspective({ apiKey: 'YOUR_API_KEY' });
```

---

### Method: analyze

Analyzes a given text for toxicity and other attributes using the Perspective API.

#### Parameters

| Name    | Type    | Description                                                                 | Required |
|---------|---------|-----------------------------------------------------------------------------|----------|
| text    | string &#124; object | The text to analyze, or a pre-formed Perspective API request object | Yes      |
| options | object  | Optional settings (see below)                                               | No       |

#### Options

| Name         | Type     | Default | Description                                                                 |
|--------------|----------|---------|-----------------------------------------------------------------------------|
| stripHTML    | boolean  | true    | Whether to strip HTML tags from the text                                    |
| truncate     | boolean  | false   | Whether to truncate text to the max allowed length                          |
| doNotStore   | boolean  | true    | Whether to prevent the API from storing the comment data                    |
| validate     | boolean  | true    | Whether to validate text for emptiness and length                           |
| attributes   | object &#124; string[] | {TOXICITY: {}} | Attributes to request from the API (object or array of attribute names) |

#### Returns

- `Promise<object>`: Resolves with the Perspective API response data.

#### Example

```javascript
client.analyze('You are awesome!', { attributes: ['TOXICITY', 'INSULT'] })
  .then(result => console.log(result))
  .catch(err => console.error(err));
```

---

### Method: getAnalyzeCommentPayload

Builds the request payload for the Perspective API, handling text processing, attribute selection, and validation.

#### Parameters

| Name    | Type    | Description                                                                 | Required |
|---------|---------|-----------------------------------------------------------------------------|----------|
| text    | string &#124; object | The text to analyze, or a pre-formed Perspective API request object | Yes      |
| options | object  | Optional settings (see above)                                               | No       |

#### Returns

- `object`: The payload object to send to the Perspective API.

---

## Exported Error Classes

The following custom error classes are attached as static properties to the `Perspective` class for granular error handling.

### Perspective.PerspectiveAPIClientError

Base error class for all Perspective API client errors.

#### Properties

| Name    | Type   | Description                |
|---------|--------|----------------------------|
| message | string | Error message              |
| name    | string | 'PerspectiveAPIClientError'|

---

### Perspective.TextEmptyError

Thrown when the input text is empty after processing.

#### Properties

| Name    | Type   | Description                |
|---------|--------|----------------------------|
| message | string | 'text must not be empty'   |
| name    | string | 'TextEmptyError'           |

---

### Perspective.TextTooLongError

Thrown when the input text exceeds the maximum allowed length and truncation is not enabled.

#### Properties

| Name    | Type   | Description                                      |
|---------|--------|--------------------------------------------------|
| message | string | 'text must not be greater than 20480 characters in length' |
| name    | string | 'TextTooLongError'                               |

---

### Perspective.ResponseError

Thrown when the Perspective API returns an error response.

#### Properties

| Name     | Type   | Description                        |
|----------|--------|------------------------------------|
| message  | string | Error message from the API          |
| response | object | The full error response from axios  |
| name     | string | 'ResponseError'                    |

---

## Utility Constants

| Name                  | Type    | Description                                      |
|-----------------------|---------|--------------------------------------------------|
| COMMENT_ANALYZER_URL  | string  | Perspective API endpoint URL                     |
| MAX_LENGTH            | number  | Maximum allowed text length (20480 characters)   |

---

## Example Usage

```javascript
const Perspective = require('./perspective');
const client = new Perspective({ apiKey: 'YOUR_API_KEY' });

client.analyze('<b>You suck!</b>', { stripHTML: true, attributes: ['TOXICITY'] })
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    if (err instanceof Perspective.TextEmptyError) {
      // Handle empty text
    } else if (err instanceof Perspective.TextTooLongError) {
      // Handle too long text
    } else if (err instanceof Perspective.ResponseError) {
      // Handle API error
    } else {
      // Handle other errors
    }
  });
```

---

## Dependencies

- [axios](https://www.npmjs.com/package/axios): For HTTP requests.
- [striptags](https://www.npmjs.com/package/striptags): For removing HTML tags from text.
- [lodash](https://www.npmjs.com/package/lodash): For object manipulation and safe property access.

---

## See Also

- [Google Perspective API Documentation](https://developers.perspectiveapi.com/s/docs)
