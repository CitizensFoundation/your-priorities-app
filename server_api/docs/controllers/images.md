# API Documentation: images.cjs

This file defines the Express.js router for image-related endpoints, including image upload (with S3/MinIO support), image association with posts, image deletion, and image comments. It also includes several utility functions and middleware for authentication, error handling, and activity logging.

---

## Table of Contents

- [API Endpoints](#api-endpoints)
  - [DELETE /:domainId/:imageId/deleteImageFromDomain](#api-endpoint-delete-domainidimageiddeleteimagefromdomain)
  - [DELETE /:communityId/:imageId/deleteImageFromCommunity](#api-endpoint-delete-communityidimageiddeleteimagefromcommunity)
  - [DELETE /:groupId/:imageId/deleteImageFromGroup](#api-endpoint-delete-groupidimageiddeleteimagefromgroup)
  - [GET /:imageId/comments](#api-endpoint-get-imageidcomments)
  - [GET /:imageId/commentsCount](#api-endpoint-get-imageidcommentscount)
  - [POST /:imageId/comment](#api-endpoint-post-imageidcomment)
  - [POST /](#api-endpoint-post-)
  - [GET /:postId/user_images](#api-endpoint-get-postiduser_images)
  - [POST /:postId/user_images](#api-endpoint-post-postiduser_images)
  - [PUT /:postId/user_images](#api-endpoint-put-postiduser_images)
  - [DELETE /:postId/:imageId/user_images](#api-endpoint-delete-postidimageiduser_images)
- [Middleware](#middleware)
  - [isAuthenticated](#middleware-isauthenticated)
- [Utility Functions](#utility-functions)
  - [sendError](#utility-function-senderror)
  - [sendPostUserImageActivity](#utility-function-sendpostuserimageactivity)
  - [addUserImageToPost](#utility-function-adduserimagetopost)
  - [deleteImage](#utility-function-deleteimage)
- [Configuration](#configuration)
  - [AWS S3/MinIO Setup](#configuration-aws-s3minio-setup)
- [Dependencies](#dependencies)

---

# API Endpoints

---

## API Endpoint: DELETE /:domainId/:imageId/deleteImageFromDomain

Removes an image from a domain's image collection.

### Request

#### Parameters

| Name      | Type   | In   | Description                | Required |
|-----------|--------|------|----------------------------|----------|
| domainId  | string | path | The domain's unique ID     | Yes      |
| imageId   | string | path | The image's unique ID      | Yes      |

#### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | User's auth token/session  | Yes      |

### Response

#### Success (200)

```json
{
  "success": true
}
```
Image removed from domain collection.

#### Error (4xx, 5xx)

```json
{
  "error": "description of error"
}
```
Possible errors: Unauthorized, Not found, Internal error.

---

## API Endpoint: DELETE /:communityId/:imageId/deleteImageFromCommunity

Removes an image from a community's image collection.

### Request

#### Parameters

| Name        | Type   | In   | Description                  | Required |
|-------------|--------|------|------------------------------|----------|
| communityId | string | path | The community's unique ID    | Yes      |
| imageId     | string | path | The image's unique ID        | Yes      |

#### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | User's auth token/session  | Yes      |

### Response

#### Success (200)

```json
{
  "success": true
}
```
Image removed from community collection.

#### Error (4xx, 5xx)

```json
{
  "error": "description of error"
}
```
Possible errors: Unauthorized, Not found, Internal error.

---

## API Endpoint: DELETE /:groupId/:imageId/deleteImageFromGroup

Removes an image from a group's image collection.

### Request

#### Parameters

| Name     | Type   | In   | Description               | Required |
|----------|--------|------|---------------------------|----------|
| groupId  | string | path | The group's unique ID     | Yes      |
| imageId  | string | path | The image's unique ID     | Yes      |

#### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | User's auth token/session  | Yes      |

### Response

#### Success (200)

```json
{
  "success": true
}
```
Image removed from group collection.

#### Error (4xx, 5xx)

```json
{
  "error": "description of error"
}
```
Possible errors: Unauthorized, Not found, Internal error.

---

## API Endpoint: GET /:imageId/comments

Retrieves all comments for a specific image, including user and revision details.

### Request

#### Parameters

| Name     | Type   | In   | Description           | Required |
|----------|--------|------|-----------------------|----------|
| imageId  | string | path | The image's unique ID | Yes      |

#### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | User's auth token/session  | Yes      |

### Response

#### Success (200)

```json
[
  {
    "id": 1,
    "image_id": "123",
    "created_at": "2024-01-01T00:00:00Z",
    "PointRevisions": [
      {
        "id": 1,
        "user": {
          "id": 1,
          "name": "User",
          "UserProfileImages": [
            // ...
          ]
        }
      }
    ]
  }
]
```
Array of comment objects with revision and user details.

#### Error (500)

```json
{
  "error": "Could not get comments for image"
}
```

---

## API Endpoint: GET /:imageId/commentsCount

Returns the number of comments for a specific image.

### Request

#### Parameters

| Name     | Type   | In   | Description           | Required |
|----------|--------|------|-----------------------|----------|
| imageId  | string | path | The image's unique ID | Yes      |

#### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | User's auth token/session  | Yes      |

### Response

#### Success (200)

```json
{
  "count": 5
}
```
Number of comments for the image.

#### Error (500)

```json
{
  "error": "Could not get comments count for image"
}
```

---

## API Endpoint: POST /:imageId/comment

Adds a comment to a specific image.

### Request

#### Parameters

| Name     | Type   | In   | Description           | Required |
|----------|--------|------|-----------------------|----------|
| imageId  | string | path | The image's unique ID | Yes      |

#### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | User's auth token/session  | Yes      |

#### Body

```json
{
  "comment": "This is a comment"
}
```
- `comment`: `string` (required) — The comment text.

### Response

#### Success (200)

No content (status 200).

#### Error (500)

```json
{
  "error": "Could not save comment point on image"
}
```

---

## API Endpoint: POST /

Uploads a new image to S3/MinIO, processes it with Sharp, and creates an image record.

### Request

#### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | User's auth token/session  | Yes      |

#### Query Parameters

| Name      | Type   | In    | Description                | Required |
|-----------|--------|-------|----------------------------|----------|
| itemType  | string | query | Type of item for resizing  | No       |

#### Body (multipart/form-data)

- `file`: The image file to upload (field name: `file`).

### Response

#### Success (200)

```json
{
  "id": 123,
  "user_id": 1,
  "s3_bucket_name": "bucket",
  "original_filename": "image.png",
  "formats": "{...}",
  "user_agent": "...",
  "ip_address": "..."
}
```
Image record as saved in the database.

#### Error (400, 500)

```json
{
  "error": "Unsupported file type: ..."
}
```
or
```json
{
  "error": "Failed to save image record"
}
```
or
```json
{
  "error": "Unhandled error while processing 'filename'"
}
```

---

## API Endpoint: GET /:postId/user_images

Retrieves all user images associated with a specific post.

### Request

#### Parameters

| Name    | Type   | In   | Description         | Required |
|---------|--------|------|---------------------|----------|
| postId  | string | path | The post's unique ID| Yes      |

#### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | User's auth token/session  | Yes      |

### Response

#### Success (200)

```json
[
  {
    "id": 1,
    "user_id": 1,
    "formats": "{...}",
    // ...
  }
]
```
Array of image objects.

#### Error (500)

```json
{
  "error": "Get images did not work"
}
```

---

## API Endpoint: POST /:postId/user_images

Associates an uploaded image with a post, sets metadata, and triggers moderation.

### Request

#### Parameters

| Name    | Type   | In   | Description         | Required |
|---------|--------|------|---------------------|----------|
| postId  | string | path | The post's unique ID| Yes      |

#### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | User's auth token/session  | Yes      |

#### Body

```json
{
  "uploadedPostUserImageId": 123,
  "photographerName": "John Doe",
  "description": "A nice photo"
}
```
- `uploadedPostUserImageId`: `number` (required) — The ID of the uploaded image.
- `photographerName`: `string` (optional) — Photographer's name.
- `description`: `string` (optional) — Image description.

### Response

#### Success (200)

No content (status 200).

#### Error (404, 500)

```json
{
  "error": "Post or Image Not found"
}
```
or
```json
{
  "error": "Internal error"
}
```

---

## API Endpoint: PUT /:postId/user_images

Updates the image associated with a post, optionally replacing the image and updating metadata.

### Request

#### Parameters

| Name    | Type   | In   | Description         | Required |
|---------|--------|------|---------------------|----------|
| postId  | string | path | The post's unique ID| Yes      |

#### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | User's auth token/session  | Yes      |

#### Body

```json
{
  "uploadedPostUserImageId": 124,
  "oldUploadedPostUserImageId": 123,
  "photographerName": "Jane Doe",
  "description": "Updated description"
}
```
- `uploadedPostUserImageId`: `number` (optional) — New image ID.
- `oldUploadedPostUserImageId`: `number` (required) — Old image ID.
- `photographerName`: `string` (optional) — Photographer's name.
- `description`: `string` (optional) — Image description.

### Response

#### Success (200)

No content (status 200).

#### Error (404, 500)

```json
{
  "error": "Post or Image Not found"
}
```
or
```json
{
  "error": "Internal error"
}
```

---

## API Endpoint: DELETE /:postId/:imageId/user_images

Marks an image as deleted for a specific post.

### Request

#### Parameters

| Name    | Type   | In   | Description         | Required |
|---------|--------|------|---------------------|----------|
| postId  | string | path | The post's unique ID| Yes      |
| imageId | string | path | The image's unique ID| Yes      |

#### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | User's auth token/session  | Yes      |

### Response

#### Success (200)

No content (status 200).

#### Error (500)

```json
{
  "error": "Delete did not work"
}
```

---

# Middleware

---

## Middleware: isAuthenticated

Custom authentication middleware that allows access if the user is authenticated via session or via a special API key for temporary agents.

### Parameters

| Name | Type     | Description                    |
|------|----------|--------------------------------|
| req  | Request  | Express request object         |
| res  | Response | Express response object        |
| next | Function | Express next middleware        |

**Behavior:**
- If `req.isAuthenticated()` is true, proceeds.
- If `req.query.agentFabricUserId` and a valid `x-api-key` header are present, sets `req.user` and proceeds.
- Otherwise, responds with 401 Unauthorized.

---

# Utility Functions

---

## Utility Function: sendError

Logs an error related to image processing and sends a 500 response.

### Parameters

| Name   | Type   | Description                        |
|--------|--------|------------------------------------|
| res    | Response | Express response object          |
| image  | any    | Image object                      |
| context| string | Context string for logging         |
| user   | any    | User object                       |
| error  | any    | Error object                      |

---

## Utility Function: sendPostUserImageActivity

Creates an activity record for a user image action on a post.

### Parameters

| Name   | Type   | Description                        |
|--------|--------|------------------------------------|
| req    | Request| Express request object             |
| type   | string | Activity type                      |
| post   | any    | Post object                        |
| image  | any    | Image object                       |
| callback | Function | Callback(error)                |

---

## Utility Function: addUserImageToPost

Associates an image with a post as a user image.

### Parameters

| Name    | Type     | Description                    |
|---------|----------|--------------------------------|
| postId  | string   | Post ID                        |
| imageId | string   | Image ID                       |
| callback| Function | Callback(error, post, image)   |

---

## Utility Function: deleteImage

Marks an image as deleted in the database.

### Parameters

| Name    | Type     | Description                    |
|---------|----------|--------------------------------|
| imageId | string   | Image ID                       |
| callback| Function | Callback(error)                |

---

# Configuration

---

## Configuration: AWS S3/MinIO Setup

The file configures AWS SDK for S3 or MinIO, using environment variables:

- `AWS_SECRET_ACCESS_KEY`
- `AWS_ACCESS_KEY_ID`
- `S3_ENDPOINT`
- `MINIO_ROOT_USER`
- `S3_REGION`
- `S3_BUCKET`

This configuration is used for image upload and storage.

---

# Dependencies

- [express](https://expressjs.com/)
- [multer](https://github.com/expressjs/multer)
- [multer-sharp-s3](https://github.com/venveo/multer-sharp-s3)
- [aws-sdk](https://github.com/aws/aws-sdk-js)
- [crypto](https://nodejs.org/api/crypto.html)
- [../models/index.cjs](../models/index.cjs)
- [../authorization.cjs](../authorization.cjs)
- [../utils/logger.cjs](../utils/logger.cjs)
- [../utils/to_json.cjs](../utils/to_json.cjs)
- [../services/workers/queue.cjs](../services/workers/queue.cjs)

---

# See Also

- [Image Model](../models/image.cjs.md)
- [Post Model](../models/post.cjs.md)
- [Authorization Middleware](../authorization.cjs.md)
- [Logger Utility](../utils/logger.cjs.md)
- [Queue Service](../services/workers/queue.cjs.md)

---

**Note:** This file is a router module and should be mounted in your Express app, e.g. `app.use('/images', require('./routes/images.cjs'))`.