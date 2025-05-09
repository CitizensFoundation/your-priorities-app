# Express Router Module: `routes/group.cjs`

This module defines the main Express router for group-related operations in the application. It provides a comprehensive RESTful API for managing groups, group membership, group content, campaigns, moderation, analytics, and more. The router integrates with authentication/authorization middleware, various service modules, and utility functions.

---

## Table of Contents

- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Controllers & Utility Functions](#controllers--utility-functions)
- [Exported Router](#exported-router)

---

## API Endpoints

Below is a selection of the most important endpoints. For brevity, not all endpoints are listed here; see the source for the full set.

---

### API Endpoint: `POST /:id/getPresignedAttachmentURL`

Generate a presigned AWS S3 URL for uploading an attachment to a group.

#### Request

##### Parameters

| Name      | Type   | In   | Description                | Required |
|-----------|--------|------|----------------------------|----------|
| id        | string | path | Group ID                   | Yes      |

##### Headers

| Name         | Type   | Description        | Required |
|--------------|--------|--------------------|----------|
| Authorization| string | Bearer token       | Yes      |

##### Body

```json
{
  "filename": "string",
  "contentType": "string"
}
```
- `filename`: Name of the file to upload.
- `contentType`: MIME type of the file (optional, defaults to `application/octet-stream`).

#### Response

##### Success (200)

```json
{
  "presignedUrl": "https://s3.amazonaws.com/..."
}
```
- `presignedUrl`: The generated S3 presigned URL.

##### Error (500)

```json
{
  "error": "Error getting presigned attachment url from AWS S3"
}
```

---

### API Endpoint: `DELETE /:groupId/:activityId/delete_activity`

Soft-delete an activity from a group.

#### Request

##### Parameters

| Name        | Type   | In   | Description         | Required |
|-------------|--------|------|---------------------|----------|
| groupId     | string | path | Group ID            | Yes      |
| activityId  | string | path | Activity ID         | Yes      |

##### Headers

| Name         | Type   | Description        | Required |
|--------------|--------|--------------------|----------|
| Authorization| string | Bearer token       | Yes      |

#### Response

##### Success (200)

```json
{
  "activityId": "string"
}
```

##### Error (500)

```json
{
  "error": "Could not delete activity for group"
}
```

---

### API Endpoint: `DELETE /:groupId/user_membership`

Remove the current user from a group.

#### Request

##### Parameters

| Name    | Type   | In   | Description | Required |
|---------|--------|------|-------------|----------|
| groupId | string | path | Group ID    | Yes      |

##### Headers

| Name         | Type   | Description        | Required |
|--------------|--------|--------------------|----------|
| Authorization| string | Bearer token       | Yes      |

#### Response

##### Success (200)

```json
{
  "membershipValue": false,
  "name": "Group Name"
}
```

##### Error (404/500)

---

### API Endpoint: `POST /:groupId/user_membership`

Add the current user to a group.

#### Request

##### Parameters

| Name    | Type   | In   | Description | Required |
|---------|--------|------|-------------|----------|
| groupId | string | path | Group ID    | Yes      |

##### Headers

| Name         | Type   | Description        | Required |
|--------------|--------|--------------------|----------|
| Authorization| string | Bearer token       | Yes      |

#### Response

##### Success (200)

```json
{
  "membershipValue": true,
  "name": "Group Name"
}
```

##### Error (404/500)

---

### API Endpoint: `POST /:groupId/sendEmailInvitesForAnons`

Send email invites for anonymous users to join a group.

#### Request

##### Parameters

| Name    | Type   | In   | Description | Required |
|---------|--------|------|-------------|----------|
| groupId | string | path | Group ID    | Yes      |

##### Body

```json
{
  "emails": "email1@example.com\nemail2@example.com",
  "agentRunId": "string"
}
```
- `emails`: Newline-separated list of email addresses.
- `agentRunId`: Agent run identifier.

#### Response

- `200 OK` on success.
- `400 Bad Request` if no emails provided.
- `500 Internal Server Error` on failure.

---

### API Endpoint: `POST /:groupId/:userEmail/invite_user`

Invite a user to a group by email.

#### Request

##### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| groupId   | string | path | Group ID    | Yes      |
| userEmail | string | path | User email  | Yes      |

##### Query

| Name               | Type    | Description                        | Required |
|--------------------|---------|------------------------------------|----------|
| addToGroupDirectly | boolean | If true, add user directly to group| No       |

#### Response

- `200 OK` on success.
- `404 Not Found` if user not found and `addToGroupDirectly` is true.
- `500 Internal Server Error` on failure.

---

### API Endpoint: `POST /:groupId/add_page`

Create a new page for a group.

#### Request

##### Parameters

| Name    | Type   | In   | Description | Required |
|---------|--------|------|-------------|----------|
| groupId | string | path | Group ID    | Yes      |

#### Response

- `200 OK` on success.
- `500 Internal Server Error` on failure.

---

### API Endpoint: `POST /:domainId/create_community_for_group`

Create a new community for a group.

#### Request

##### Parameters

| Name     | Type   | In   | Description | Required |
|----------|--------|------|-------------|----------|
| domainId | string | path | Domain ID   | Yes      |

##### Body

```json
{
  "name": "string",
  "hostname": "string"
}
```

#### Response

- `200 OK` on success.
- `500 Internal Server Error` on failure.

---

### API Endpoint: `POST /:communityId`

Create a new group in a community.

#### Request

##### Parameters

| Name        | Type   | In   | Description   | Required |
|-------------|--------|------|---------------|----------|
| communityId | string | path | Community ID  | Yes      |

##### Body

```json
{
  "name": "string",
  "objectives": "string",
  "themeId": "number",
  "in_group_folder_id": "number",
  "is_group_folder": "boolean",
  // ...many configuration fields
}
```

#### Response

- `200 OK` with group object on success.
- `500 Internal Server Error` on failure.

---

### API Endpoint: `PUT /:id`

Update a group.

#### Request

##### Parameters

| Name | Type   | In   | Description | Required |
|------|--------|------|-------------|----------|
| id   | string | path | Group ID    | Yes      |

##### Body

```json
{
  "name": "string",
  "objectives": "string",
  "themeId": "number",
  "moveGroupTo": "string",
  // ...many configuration fields
}
```

#### Response

- `200 OK` with group object on success.
- `404 Not Found` if group not found.
- `500 Internal Server Error` on failure.

---

### API Endpoint: `DELETE /:id`

Soft-delete a group.

#### Request

##### Parameters

| Name | Type   | In   | Description | Required |
|------|--------|------|-------------|----------|
| id   | string | path | Group ID    | Yes      |

#### Response

- `200 OK` on success.
- `404 Not Found` if group not found.
- `500 Internal Server Error` on failure.

---

### API Endpoint: `POST /:id/clone`

Clone a group (excluding users and activities).

#### Request

##### Parameters

| Name | Type   | In   | Description | Required |
|------|--------|------|-------------|----------|
| id   | string | path | Group ID    | Yes      |

#### Response

```json
{
  "id": "newGroupId"
}
```

---

### API Endpoint: `GET /:id`

Get detailed information about a group.

#### Request

##### Parameters

| Name | Type   | In   | Description | Required |
|------|--------|------|-------------|----------|
| id   | string | path | Group ID    | Yes      |

#### Response

```json
{
  "group": { /* group object */ },
  "hasNonOpenPosts": true
}
```

---

### API Endpoint: `GET /:id/posts/:filter/:categoryId/:status`

Get posts from a group, filtered and paginated.

#### Request

##### Parameters

| Name       | Type   | In   | Description                | Required |
|------------|--------|------|----------------------------|----------|
| id         | string | path | Group ID                   | Yes      |
| filter     | string | path | Filter type (e.g. "top")   | Yes      |
| categoryId | string | path | Category ID or "null"      | Yes      |
| status     | string | path | Post status (e.g. "open")  | Yes      |

##### Query

| Name        | Type   | Description                | Required |
|-------------|--------|----------------------------|----------|
| offset      | number | Pagination offset          | No       |
| randomSeed  | string | Seed for random ordering   | No       |

#### Response

```json
{
  "posts": [ /* array of posts */ ],
  "totalPostsCount": 123
}
```

---

### API Endpoint: `GET /:id/categories`

Get categories for a group.

#### Request

##### Parameters

| Name | Type   | In   | Description | Required |
|------|--------|------|-------------|----------|
| id   | string | path | Group ID    | Yes      |

#### Response

```json
[
  { /* category object */ }
]
```

---

### API Endpoint: `GET /:id/wordcloud`

Get word cloud analytics for a group.

#### Request

##### Parameters

| Name | Type   | In   | Description | Required |
|------|--------|------|-------------|----------|
| id   | string | path | Group ID    | Yes      |

#### Response

```json
{
  // word cloud data
}
```

---

## Middleware

### Middleware: `auth.can(permission)`

Authorization middleware that checks if the current user has the specified permission for the resource.

#### Parameters

| Name       | Type     | Description                        |
|------------|----------|------------------------------------|
| permission | string   | Permission string (e.g. "edit group") |

---

### Middleware: `auth.isLoggedInNoAnonymousCheck`

Ensures the user is logged in (but does not require a non-anonymous user).

---

## Controllers & Utility Functions

### Function: `sendGroupOrError`

Handles sending a group object or an error response.

#### Parameters

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| res         | Response | Express response object                     |
| group       | any      | Group object or null                        |
| context     | string   | Context string for logging                  |
| user        | any      | User object                                 |
| error       | any      | Error object or null                        |
| errorStatus | number   | HTTP status code for error (optional)       |

---

### Function: `getGroupAndUser`

Fetches a group and user by their IDs or email.

#### Parameters

| Name      | Type     | Description                                 |
|-----------|----------|---------------------------------------------|
| groupId   | string   | Group ID                                    |
| userId    | string   | User ID (optional)                          |
| userEmail | string   | User email (optional)                       |
| callback  | function | Callback `(error, group, user)`             |

---

### Function: `truthValueFromBody`

Converts a body parameter to a boolean.

#### Parameters

| Name         | Type   | Description                |
|--------------|--------|----------------------------|
| bodyParameter| any    | Value from request body    |

#### Returns

- `boolean`

---

### Function: `moveGroupTo`

Updates a group's folder association based on request body.

#### Parameters

| Name | Type     | Description                |
|------|----------|----------------------------|
| req  | Request  | Express request object     |
| group| any      | Group model instance       |

---

### Function: `updateGroupConfigParameters`

Updates a group's configuration object based on request body.

#### Parameters

| Name | Type     | Description                |
|------|----------|----------------------------|
| req  | Request  | Express request object     |
| group| any      | Group model instance       |

---

### Function: `getGroupFolder`

Fetches a group folder and its groups, with caching.

#### Parameters

| Name | Type     | Description                |
|------|----------|----------------------------|
| req  | Request  | Express request object     |
| done | function | Callback `(error, groupFolder)` |

---

### Function: `addAgentFabricUserToSessionIfNeeded`

Adds an agent fabric user to the session if required by API key.

#### Parameters

| Name | Type     | Description                |
|------|----------|----------------------------|
| req  | Request  | Express request object     |

---

### Function: `copyThemeAndLogoFromAgentFabricGroup`

Copies theme and logo images from another group.

#### Parameters

| Name           | Type   | Description                |
|----------------|--------|----------------------------|
| newGroup       | any    | New group instance         |
| agentFabricGroup| any   | Source group instance      |

---

### Function: `createGroup`

Creates a new group, including configuration and image setup.

#### Parameters

| Name | Type     | Description                |
|------|----------|----------------------------|
| req  | Request  | Express request object     |
| res  | Response | Express response object    |

---

### Function: `addVideosToGroup`

Adds video data to a group object.

#### Parameters

| Name   | Type   | Description                |
|--------|--------|----------------------------|
| group  | any    | Group model instance       |
| done   | function | Callback `(error)`       |

---

### Function: `getPostsWithAllFromIds`

Fetches posts and their related data by IDs.

#### Parameters

| Name         | Type     | Description                |
|--------------|----------|----------------------------|
| postsWithIds | array    | Array of post objects      |
| postOrder    | string   | SQL order clause           |
| done         | function | Callback `(error, posts)`  |

---

## Exported Router

This module exports the configured Express router for use in the main application.

```js
module.exports = router;
```

---

## Related Modules

- [../models/index.cjs](./models/index.md)
- [../authorization.cjs](./authorization.md)
- [../utils/logger.cjs](./utils/logger.md)
- [../utils/to_json.cjs](./utils/to_json.md)
- [../services/workers/queue.cjs](./services/workers/queue.md)
- [../utils/copy_utils.cjs](./utils/copy_utils.md)
- [../utils/export_utils.cjs](./utils/export_utils.md)
- [../utils/docx_utils.cjs](./utils/docx_utils.md)
- [../utils/is_valid_db_id.cjs](./utils/is_valid_db_id.md)
- [../services/engine/moderation/get_moderation_items.cjs](./services/engine/moderation/get_moderation_items.md)
- [../services/engine/moderation/process_moderation_items.cjs](./services/engine/moderation/process_moderation_items.md)
- [../services/engine/analytics/manager.cjs](./services/engine/analytics/manager.md)
- [../services/engine/analytics/plausible/manager.cjs](./services/engine/analytics/plausible/manager.md)
- [../services/engine/analytics/statsCalc.cjs](./services/engine/analytics/statsCalc.md)
- [../services/utils/translation_helpers.cjs](./services/utils/translation_helpers.md)

---

## Notes

- Many endpoints require authentication and specific permissions.
- The router is highly integrated with the application's models and services.
- For full details on request/response schemas, see the source or related model documentation.
- Some endpoints (e.g., moderation, analytics) rely on background job queues for processing.

---

**This documentation covers the main structure and key endpoints of the group router. For a full list of endpoints and their details, refer to the source code.**