# API Router: Video Management

This Express.js router provides endpoints for managing video uploads, transcoding, and association with posts, groups, communities, and domains. It includes endpoints for video upload support checks, view counting, upload completion, video removal, pre-signed upload URL generation, transcoding, and video metadata management.

---

## Table of Contents

- [API Endpoint: GET /hasVideoUploadSupport](#api-endpoint-get-hasvideouploadsupport)
- [API Endpoint: PUT /videoView](#api-endpoint-put-videoview)
- [API Endpoint: PUT /:postId/completeAndAddToPost](#api-endpoint-put-postidcompleteandaddtopost)
- [API Endpoint: PUT /:groupId/completeAndAddToGroup](#api-endpoint-put-groupidcompleteandaddtogroup)
- [API Endpoint: PUT /:communityId/completeAndAddToCommunity](#api-endpoint-put-communityidcompleteandaddtocommunity)
- [API Endpoint: PUT /:domainId/completeAndAddToDomain](#api-endpoint-put-domainidcompleteandaddtodomain)
- [API Endpoint: DELETE /:domainId/:videoId/deleteVideoFromDomain](#api-endpoint-delete-domainidvideoiddeletevideofromdomain)
- [API Endpoint: DELETE /:communityId/:videoId/deleteVideoFromCommunity](#api-endpoint-delete-communityidvideoiddeletevideofromcommunity)
- [API Endpoint: DELETE /:groupId/:videoId/deleteVideoFromGroup](#api-endpoint-delete-groupidvideoiddeletevideofromgroup)
- [API Endpoint: POST /:groupId/createAndGetPreSignedUploadUrl](#api-endpoint-post-groupidcreateandgetpresigneduploadurl)
- [API Endpoint: POST /createAndGetPreSignedUploadUrlLoggedIn](#api-endpoint-post-createandgetpresigneduploadurlloggedin)
- [API Endpoint: POST /:groupId/:videoId/startTranscoding](#api-endpoint-post-groupidvideoidstarttranscoding)
- [API Endpoint: POST /:videoId/startTranscodingLoggedIn](#api-endpoint-post-videoidstarttranscodingloggedin)
- [API Endpoint: GET /:videoId/formatsAndImages](#api-endpoint-get-videoidformatsandimages)
- [API Endpoint: PUT /:videoId/setVideoCover](#api-endpoint-put-videoidsetvideocover)
- [API Endpoint: PUT /:videoId/getTranscodingJobStatus](#api-endpoint-put-videoidgettranscodingjobstatus)
- [Middleware: auth.can(permission)](#middleware-authcanpermission)
- [Middleware: auth.isLoggedInNoAnonymousCheck](#middleware-authisloggedinnoanonymouscheck)
- [Utility: startTranscoding](#utility-starttranscoding)
- [Dependencies](#dependencies)

---

# API Endpoint: GET /hasVideoUploadSupport

Checks if the server supports video and transcript uploads based on environment variables.

## Request

### Parameters

_None_

### Headers

_None_

### Body

_None_

## Response

### Success (200)
```json
{
  "hasTranscriptSupport": true,
  "hasVideoUploadSupport": true
}
```
- `hasTranscriptSupport`: `boolean` — Whether transcript upload is supported.
- `hasVideoUploadSupport`: `boolean` — Whether video upload is supported.

### Error

_No error responses expected._

---

# API Endpoint: PUT /videoView

Increments the view count for a video. If `longPlaytime` is true, increments `long_views`; otherwise, increments `views`.

## Request

### Parameters

_None_

### Headers

_None_

### Body
```json
{
  "videoId": "string",
  "longPlaytime": true
}
```
- `videoId`: `string` — The ID of the video to increment views for. **Required**
- `longPlaytime`: `boolean` — If true, increments `long_views`; otherwise, increments `views`.

## Response

### Success (200)
_No content_

### Error

- Logs error and returns 200 even on error.

---

# API Endpoint: PUT /:postId/completeAndAddToPost

Completes a video upload and associates the video with a post.

## Request

### Parameters

| Name   | Type   | In   | Description                | Required |
|--------|--------|------|----------------------------|----------|
| postId | string | path | The ID of the post         | Yes      |

### Headers

| Name            | Type   | Description                        | Required |
|-----------------|--------|------------------------------------|----------|
| accept-language | string | Used to determine browser language | No       |

### Body
```json
{
  "videoId": "string",
  "appLanguage": "string"
}
```
- `videoId`: `string` — The ID of the video to associate. **Required**
- `appLanguage`: `string` — The application language.

## Response

### Success (200)
_Response depends on `models.Video.completeUploadAndAddToCollection` implementation._

### Error

_Error handling is managed by the controller/service._

---

# API Endpoint: PUT /:groupId/completeAndAddToGroup

Completes a video upload and associates the video with a group.

## Request

### Parameters

| Name    | Type   | In   | Description              | Required |
|---------|--------|------|--------------------------|----------|
| groupId | string | path | The ID of the group      | Yes      |

### Headers

_None_

### Body
```json
{
  "videoId": "string"
}
```
- `videoId`: `string` — The ID of the video to associate. **Required**

## Response

### Success (200)
_Response depends on `models.Video.completeUploadAndAddToCollection` implementation._

### Error

_Error handling is managed by the controller/service._

---

# API Endpoint: PUT /:communityId/completeAndAddToCommunity

Completes a video upload and associates the video with a community.

## Request

### Parameters

| Name        | Type   | In   | Description                  | Required |
|-------------|--------|------|------------------------------|----------|
| communityId | string | path | The ID of the community      | Yes      |

### Headers

_None_

### Body
```json
{
  "videoId": "string"
}
```
- `videoId`: `string` — The ID of the video to associate. **Required**

## Response

### Success (200)
_Response depends on `models.Video.completeUploadAndAddToCollection` implementation._

### Error

_Error handling is managed by the controller/service._

---

# API Endpoint: PUT /:domainId/completeAndAddToDomain

Completes a video upload and associates the video with a domain.

## Request

### Parameters

| Name     | Type   | In   | Description             | Required |
|----------|--------|------|-------------------------|----------|
| domainId | string | path | The ID of the domain    | Yes      |

### Headers

_None_

### Body
```json
{
  "videoId": "string"
}
```
- `videoId`: `string` — The ID of the video to associate. **Required**

## Response

### Success (200)
_Response depends on `models.Video.completeUploadAndAddToCollection` implementation._

### Error

_Error handling is managed by the controller/service._

---

# API Endpoint: DELETE /:domainId/:videoId/deleteVideoFromDomain

Removes a video from a domain.

## Request

### Parameters

| Name     | Type   | In   | Description             | Required |
|----------|--------|------|-------------------------|----------|
| domainId | string | path | The ID of the domain    | Yes      |
| videoId  | string | path | The ID of the video     | Yes      |

### Headers

_None_

### Body

_None_

## Response

### Success (200)
_Response depends on `models.Video.removeVideoFromCollection` implementation._

### Error

_Error handling is managed by the controller/service._

---

# API Endpoint: DELETE /:communityId/:videoId/deleteVideoFromCommunity

Removes a video from a community.

## Request

### Parameters

| Name        | Type   | In   | Description                  | Required |
|-------------|--------|------|------------------------------|----------|
| communityId | string | path | The ID of the community      | Yes      |
| videoId     | string | path | The ID of the video          | Yes      |

### Headers

_None_

### Body

_None_

## Response

### Success (200)
_Response depends on `models.Video.removeVideoFromCollection` implementation._

### Error

_Error handling is managed by the controller/service._

---

# API Endpoint: DELETE /:groupId/:videoId/deleteVideoFromGroup

Removes a video from a group.

## Request

### Parameters

| Name    | Type   | In   | Description              | Required |
|---------|--------|------|--------------------------|----------|
| groupId | string | path | The ID of the group      | Yes      |
| videoId | string | path | The ID of the video      | Yes      |

### Headers

_None_

### Body

_None_

## Response

### Success (200)
_Response depends on `models.Video.removeVideoFromCollection` implementation._

### Error

_Error handling is managed by the controller/service._

---

# API Endpoint: POST /:groupId/createAndGetPreSignedUploadUrl

Creates a video record and returns a pre-signed upload URL for a group.

## Request

### Parameters

| Name    | Type   | In   | Description              | Required |
|---------|--------|------|--------------------------|----------|
| groupId | string | path | The ID of the group      | Yes      |

### Headers

_None_

### Body

_Defined by `models.Video.createAndGetSignedUploadUrl`_

## Response

### Success (200)
_Response depends on `models.Video.createAndGetSignedUploadUrl` implementation._

### Error

_Error handling is managed by the controller/service._

---

# API Endpoint: POST /createAndGetPreSignedUploadUrlLoggedIn

Creates a video record and returns a pre-signed upload URL for a logged-in user.

## Request

### Parameters

_None_

### Headers

_None_

### Body

_Defined by `models.Video.createAndGetSignedUploadUrl`_

## Response

### Success (200)
_Response depends on `models.Video.createAndGetSignedUploadUrl` implementation._

### Error

_Error handling is managed by the controller/service._

---

# API Endpoint: POST /:groupId/:videoId/startTranscoding

Starts transcoding for a video in a group. Only the video owner can start transcoding.

## Request

### Parameters

| Name    | Type   | In   | Description              | Required |
|---------|--------|------|--------------------------|----------|
| groupId | string | path | The ID of the group      | Yes      |
| videoId | string | path | The ID of the video      | Yes      |

### Headers

_None_

### Body
```json
{
  "videoPostUploadLimitSec": 60,
  "videoPointUploadLimitSec": 30,
  "aspect": "16:9"
}
```
- `videoPostUploadLimitSec`: `number` — Post upload time limit in seconds.
- `videoPointUploadLimitSec`: `number` — Point upload time limit in seconds.
- `aspect`: `string` — Aspect ratio.

## Response

### Success (200)
_Response depends on `models.Video.startTranscoding` implementation._

### Error (404, 500)
```json
{
  "error": "Can't find video or not same user"
}
```
- 404 if video not found or not owned by user.
- 500 on server error.

---

# API Endpoint: POST /:videoId/startTranscodingLoggedIn

Starts transcoding for a video for a logged-in user. Only the video owner can start transcoding.

## Request

### Parameters

| Name    | Type   | In   | Description              | Required |
|---------|--------|------|--------------------------|----------|
| videoId | string | path | The ID of the video      | Yes      |

### Headers

_None_

### Body
```json
{
  "videoPostUploadLimitSec": 60,
  "videoPointUploadLimitSec": 30,
  "aspect": "16:9"
}
```
- `videoPostUploadLimitSec`: `number` — Post upload time limit in seconds.
- `videoPointUploadLimitSec`: `number` — Point upload time limit in seconds.
- `aspect`: `string` — Aspect ratio.

## Response

### Success (200)
_Response depends on `models.Video.startTranscoding` implementation._

### Error (404, 500)
```json
{
  "error": "Can't find video or not same user"
}
```
- 404 if video not found or not owned by user.
- 500 on server error.

---

# API Endpoint: GET /:videoId/formatsAndImages

Returns available video formats and associated images for a video, if the user is the owner.

## Request

### Parameters

| Name    | Type   | In   | Description              | Required |
|---------|--------|------|--------------------------|----------|
| videoId | string | path | The ID of the video      | Yes      |

### Headers

_None_

### Body

_None_

## Response

### Success (200)
```json
{
  "previewVideoUrl": "string",
  "videoImages": ["string"]
}
```
- `previewVideoUrl`: `string` — URL to the preview video.
- `videoImages`: `string[]` — Array of image URLs.

### Error (404, 500)
```json
{
  "error": "Can't find video or not same user"
}
```
- 404 if video not found or not owned by user.
- 500 on server error.

---

# API Endpoint: PUT /:videoId/setVideoCover

Sets the cover frame index for a video, if the user is the owner.

## Request

### Parameters

| Name    | Type   | In   | Description              | Required |
|---------|--------|------|--------------------------|----------|
| videoId | string | path | The ID of the video      | Yes      |

### Headers

_None_

### Body
```json
{
  "frameIndex": 0
}
```
- `frameIndex`: `number` — The index of the frame to set as cover. **Required**

## Response

### Success (200)
_No content_

### Error (404, 500)
```json
{
  "error": "Can't find video or not same user"
}
```
- 404 if video not found or not owned by user.
- 500 on server error.

---

# API Endpoint: PUT /:videoId/getTranscodingJobStatus

Gets the transcoding job status for a video, if the user is the owner.

## Request

### Parameters

| Name    | Type   | In   | Description              | Required |
|---------|--------|------|--------------------------|----------|
| videoId | string | path | The ID of the video      | Yes      |

### Headers

_None_

### Body

_None_

## Response

### Success (200)
_Response depends on `models.Video.getTranscodingJobStatus` implementation._

### Error (404, 500)
```json
{
  "error": "Can't find video or not same user"
}
```
- 404 if video not found or not owned by user.
- 500 on server error.

---

# Middleware: auth.can(permission)

Authorization middleware that checks if the user has the specified permission.

## Parameters

| Name       | Type     | Description                        |
|------------|----------|------------------------------------|
| permission | string   | The permission to check (e.g., "edit post", "edit group", "create media") |

## Usage

Used as route middleware to protect endpoints.

---

# Middleware: auth.isLoggedInNoAnonymousCheck

Authorization middleware that checks if the user is logged in (excluding anonymous users).

## Parameters

| Name | Type    | Description                  |
|------|---------|------------------------------|
| req  | Request | Express request object       |
| res  | Response| Express response object      |
| next | Function| Express next function        |

## Usage

Used as route middleware to protect endpoints for logged-in users.

---

# Utility: startTranscoding

Controller utility function to start transcoding for a video, ensuring the user is the owner.

## Parameters

| Name | Type    | Description                  |
|------|---------|------------------------------|
| req  | Request | Express request object       |
| res  | Response| Express response object      |

## Description

- Looks up the video by `videoId` in the path.
- Checks if the current user is the owner.
- If so, calls `models.Video.startTranscoding`.
- Otherwise, logs an error and returns 404.

---

# Dependencies

- [express](https://expressjs.com/) — Web framework.
- [multer](https://github.com/expressjs/multer) — Middleware for handling `multipart/form-data`.
- [lodash](https://lodash.com/) — Utility library.
- [../models/index.cjs](../models/index.md) — Application data models.
- [../authorization.cjs](../authorization.md) — Authorization middleware.
- [../utils/logger.cjs](../utils/logger.md) — Logging utility.
- [../utils/to_json.cjs](../utils/to_json.md) — JSON conversion utility.
- [../services/workers/queue.cjs](../services/workers/queue.md) — Worker queue service.

---

# Export

This module exports the configured Express router for use in the main application.

```js
module.exports = router;
```

---

**See also:**
- [Video Model](../models/index.md) for details on the `Video` model and its methods.
- [Authorization Middleware](../authorization.md) for permission and login checks.
- [Logger Utility](../utils/logger.md) for logging errors and events.
