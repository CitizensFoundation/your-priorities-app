# API Routes: Audio Upload and Transcoding

This module defines API endpoints for audio upload support, audio listen tracking, upload completion, pre-signed upload URL generation, and audio transcoding management. It uses [Express.js](https://expressjs.com/), integrates with authentication/authorization middleware, and interacts with the `Audio` model and related services.

---

## API Endpoint: GET /hasAudioUploadSupport

Checks if the server is configured to support audio uploads (i.e., required S3 buckets are set).

### Request

#### Parameters

_None_

#### Headers

_None_

#### Body

_None_

### Response

#### Success (200)
```json
{
  "hasAudioUploadSupport": true
}
```
- `hasAudioUploadSupport` (`boolean`): Indicates if audio upload is supported (based on environment variables).

#### Error

_No error responses expected._

---

## API Endpoint: PUT /audioListen

Increments the listen count for a specific audio file.

### Request

#### Parameters

| Name     | Type   | In   | Description                | Required |
|----------|--------|------|----------------------------|----------|
| audioId  | number | body | ID of the audio to update  | Yes      |
| longPlaytime | boolean | body | If true, increments `long_listens` instead of `listens` | No |

#### Headers

_None_

#### Body
```json
{
  "audioId": 123,
  "longPlaytime": true
}
```
- `audioId` (`number`): The ID of the audio file.
- `longPlaytime` (`boolean`, optional): If true, increments the `long_listens` counter.

### Response

#### Success (200)
_No content (status only)._

#### Error (200)
```json
// No error body, but logs error internally.
```
- Errors are logged but always return 200.

---

## API Endpoint: PUT /:postId/completeAndAddToPost

Completes an audio upload and adds it to a post. Requires `edit post` permission.

### Request

#### Parameters

| Name     | Type   | In   | Description                | Required |
|----------|--------|------|----------------------------|----------|
| postId   | string | path | ID of the post             | Yes      |
| audioId  | number | body | ID of the audio to add     | Yes      |
| appLanguage | string | body | Application language code | No      |

#### Headers

| Name             | Type   | Description                | Required |
|------------------|--------|----------------------------|----------|
| accept-language  | string | Used to determine browser language | No   |

#### Body
```json
{
  "audioId": 123,
  "appLanguage": "en"
}
```
- `audioId` (`number`): The ID of the audio file.
- `appLanguage` (`string`, optional): The language code of the app.

### Response

#### Success (200)
_Response is handled by `models.Audio.completeUploadAndAddToCollection`._

#### Error
_Error responses are handled by the model/controller._

---

## API Endpoint: POST /:groupId/createAndGetPreSignedUploadUrl

Creates and returns a pre-signed URL for uploading audio. Requires `create media` permission.

### Request

#### Parameters

| Name     | Type   | In   | Description                | Required |
|----------|--------|------|----------------------------|----------|
| groupId  | string | path | ID of the group            | Yes      |

#### Headers

_None_

#### Body

_Defined by `models.Audio.createAndGetSignedUploadUrl`._

### Response

#### Success (200)
_Response is handled by `models.Audio.createAndGetSignedUploadUrl`._

#### Error
_Error responses are handled by the model/controller._

---

## API Endpoint: POST /createAndGetPreSignedUploadUrlLoggedIn

Creates and returns a pre-signed URL for uploading audio for logged-in users (no anonymous check).

### Request

#### Parameters

_None_

#### Headers

_None_

#### Body

_Defined by `models.Audio.createAndGetSignedUploadUrl`._

### Response

#### Success (200)
_Response is handled by `models.Audio.createAndGetSignedUploadUrl`._

#### Error
_Error responses are handled by the model/controller._

---

## API Endpoint: POST /:groupId/:audioId/startTranscoding

Starts transcoding for an audio file. Requires `create media` permission.

### Request

#### Parameters

| Name     | Type   | In   | Description                | Required |
|----------|--------|------|----------------------------|----------|
| groupId  | string | path | ID of the group            | Yes      |
| audioId  | string | path | ID of the audio file       | Yes      |
| audioPostUploadLimitSec | number | body | Post upload time limit (seconds) | No |
| audioPointUploadLimitSec | number | body | Point upload time limit (seconds) | No |

#### Headers

_None_

#### Body
```json
{
  "audioPostUploadLimitSec": 60,
  "audioPointUploadLimitSec": 30
}
```
- `audioPostUploadLimitSec` (`number`, optional): Limit for post upload in seconds.
- `audioPointUploadLimitSec` (`number`, optional): Limit for point upload in seconds.

### Response

#### Success (200)
_Response is handled by `models.Audio.startTranscoding`._

#### Error (404, 500)
```json
// No error body, but logs error internally.
```
- 404: Audio not found or user mismatch.
- 500: Internal error.

---

## API Endpoint: POST /:audioId/startTranscodingLoggedIn

Starts transcoding for an audio file for logged-in users (no anonymous check).

### Request

#### Parameters

| Name     | Type   | In   | Description                | Required |
|----------|--------|------|----------------------------|----------|
| audioId  | string | path | ID of the audio file       | Yes      |
| audioPostUploadLimitSec | number | body | Post upload time limit (seconds) | No |
| audioPointUploadLimitSec | number | body | Point upload time limit (seconds) | No |

#### Headers

_None_

#### Body
```json
{
  "audioPostUploadLimitSec": 60,
  "audioPointUploadLimitSec": 30
}
```
- See above.

### Response

#### Success (200)
_Response is handled by `models.Audio.startTranscoding`._

#### Error (404, 500)
- See above.

---

## API Endpoint: PUT /:audioId/getTranscodingJobStatus

Gets the status of a transcoding job for an audio file.

### Request

#### Parameters

| Name     | Type   | In   | Description                | Required |
|----------|--------|------|----------------------------|----------|
| audioId  | string | path | ID of the audio file       | Yes      |

#### Headers

_None_

#### Body

_None_

### Response

#### Success (200)
_Response is handled by `models.Audio.getTranscodingJobStatus`._

#### Error (404, 500)
- 404: Audio not found or user mismatch.
- 500: Internal error.

---

# Middleware

## auth.can(permission)

Authorization middleware that checks if the user has the specified permission.

### Parameters

| Name     | Type   | Description              |
|----------|--------|--------------------------|
| permission | string | Permission string (e.g., 'edit post', 'create media') |

## auth.isLoggedInNoAnonymousCheck

Middleware that ensures the user is logged in (but does not check for anonymous users).

---

# Utility Modules Used

- **logger.cjs**: Logging utility for error and info logs.
- **to_json.cjs**: Utility for converting objects to JSON (not directly used in this file).
- **queue.cjs**: Worker queue service (not directly used in this file).

---

# Related Models and Services

- **models.Audio**: The main model for audio file operations. Exposes methods:
  - `findOne`
  - `increment`
  - `completeUploadAndAddToCollection`
  - `createAndGetSignedUploadUrl`
  - `startTranscoding`
  - `getTranscodingJobStatus`

See [models/index.cjs](./models/index.md) and [models/Audio](./models/Audio.md) for details.

---

# Export

This module exports an Express router with all the above endpoints.

---

# See Also

- [authorization.cjs](./authorization.md)
- [models/index.cjs](./models/index.md)
- [utils/logger.cjs](./utils/logger.md)
- [services/workers/queue.cjs](./services/workers/queue.md)
