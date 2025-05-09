# API Documentation: Community Management Router

This file defines a comprehensive set of Express.js API endpoints for managing communities, folders, users, moderation, analytics, campaigns, and related resources. It also includes several utility and helper functions for internal use.

---

## Table of Contents

- [API Endpoints](#api-endpoints)
- [Controller/Helper Functions](#controllerhelper-functions)
- [Utility Functions](#utility-functions)
- [Exported Router](#exported-router)

---

# API Endpoints

Below is a selection of the most significant endpoints. For brevity, not all endpoints are shown; see the source for the full set.

---

## API Endpoint: GET /:communityFolderId/communityFolders

Retrieve a community folder and its communities, including open, admin, and user communities.

### Request

#### Parameters

| Name              | Type   | In   | Description                        | Required |
|-------------------|--------|------|------------------------------------|----------|
| communityFolderId | string | path | ID of the community folder         | Yes      |

#### Headers

| Name        | Type   | Description         | Required |
|-------------|--------|---------------------|----------|
| Authorization| string | Bearer token        | Yes      |

#### Body

_None_

### Response

#### Success (200)
```json
{
  "id": 1,
  "name": "Folder Name",
  "Communities": [ /* ... */ ]
}
```
Returns the community folder object with an array of communities.

#### Error (404, 500)
```json
{
  "error": "Not found"
}
```
Returns 404 if not found, 500 on server error.

---

## API Endpoint: DELETE /:communityId/:activityId/delete_activity

Soft-delete an activity from a community.

### Request

#### Parameters

| Name        | Type   | In   | Description                | Required |
|-------------|--------|------|----------------------------|----------|
| communityId | string | path | Community ID               | Yes      |
| activityId  | string | path | Activity ID                | Yes      |

#### Headers

| Name        | Type   | Description         | Required |
|-------------|--------|---------------------|----------|
| Authorization| string | Bearer token        | Yes      |

#### Body

_None_

### Response

#### Success (200)
```json
{
  "activityId": 123
}
```
Returns the deleted activity ID.

#### Error (500)
```json
{
  "error": "Could not delete activity for community"
}
```

---

## API Endpoint: DELETE /:communityId/user_membership

Remove the current user from a community.

### Request

#### Parameters

| Name        | Type   | In   | Description                | Required |
|-------------|--------|------|----------------------------|----------|
| communityId | string | path | Community ID               | Yes      |

#### Headers

| Name        | Type   | Description         | Required |
|-------------|--------|---------------------|----------|
| Authorization| string | Bearer token        | Yes      |

#### Body

_None_

### Response

#### Success (200)
```json
{
  "membershipValue": false,
  "name": "Community Name"
}
```

#### Error (404, 500)
```json
{
  "error": "Could not remove user"
}
```

---

## API Endpoint: POST /:communityId/user_membership

Add the current user to a community.

### Request

#### Parameters

| Name        | Type   | In   | Description                | Required |
|-------------|--------|------|----------------------------|----------|
| communityId | string | path | Community ID               | Yes      |

#### Headers

| Name        | Type   | Description         | Required |
|-------------|--------|---------------------|----------|
| Authorization| string | Bearer token        | Yes      |

#### Body

_None_

### Response

#### Success (200)
```json
{
  "membershipValue": true,
  "name": "Community Name"
}
```

#### Error (404, 500)
```json
{
  "error": "Could not add user"
}
```

---

## API Endpoint: GET /:domainId/getTemplates

Get all template communities for a domain, visible to the user.

### Request

#### Parameters

| Name      | Type   | In   | Description         | Required |
|-----------|--------|------|---------------------|----------|
| domainId  | string | path | Domain ID           | Yes      |

#### Headers

| Name        | Type   | Description         | Required |
|-------------|--------|---------------------|----------|
| Authorization| string | Bearer token        | Yes      |

#### Body

_None_

### Response

#### Success (200)
```json
[
  { "id": 1, "name": "Template Community" }
]
```

#### Error (500)
```json
{
  "error": "Could not get template communities"
}
```

---

## API Endpoint: POST /:communityId/:userEmail/invite_user

Invite a user to a community by email. Optionally, add directly if `addToCommunityDirectly` query param is set.

### Request

#### Parameters

| Name        | Type   | In   | Description                | Required |
|-------------|--------|------|----------------------------|----------|
| communityId | string | path | Community ID               | Yes      |
| userEmail   | string | path | User email                 | Yes      |

#### Query

| Name                  | Type    | In    | Description                        | Required |
|-----------------------|---------|-------|------------------------------------|----------|
| addToCommunityDirectly| boolean | query | If true, add user directly         | No       |

#### Headers

| Name        | Type   | Description         | Required |
|-------------|--------|---------------------|----------|
| Authorization| string | Bearer token        | Yes      |

#### Body

_None_

### Response

#### Success (200)
_No content_

#### Error (404, 500)
_No content, status only_

---

## API Endpoint: DELETE /:communityId/remove_many_admins

Remove multiple admins from a community (asynchronous, via queue).

### Request

#### Parameters

| Name        | Type   | In   | Description                | Required |
|-------------|--------|------|----------------------------|----------|
| communityId | string | path | Community ID               | Yes      |

#### Body

```json
{
  "userIds": [1, 2, 3]
}
```
- `userIds`: Array of user IDs to remove as admins.

### Response

#### Success (200)
_No content_

#### Error (500)
_No content, status only_

---

## API Endpoint: POST /:communityId/:email/add_admin

Add a user as an admin to a community by email.

### Request

#### Parameters

| Name        | Type   | In   | Description                | Required |
|-------------|--------|------|----------------------------|----------|
| communityId | string | path | Community ID               | Yes      |
| email       | string | path | User email                 | Yes      |

#### Headers

| Name        | Type   | Description         | Required |
|-------------|--------|---------------------|----------|
| Authorization| string | Bearer token        | Yes      |

#### Body

_None_

### Response

#### Success (200)
_No content_

#### Error (404, 500)
_No content, status only_

---

## API Endpoint: GET /:communityId/pages

Get all pages for a community.

### Request

#### Parameters

| Name        | Type   | In   | Description                | Required |
|-------------|--------|------|----------------------------|----------|
| communityId | string | path | Community ID               | Yes      |

#### Headers

| Name        | Type   | Description         | Required |
|-------------|--------|---------------------|----------|
| Authorization| string | Bearer token        | Yes      |

#### Body

_None_

### Response

#### Success (200)
```json
[
  { "id": 1, "title": "Page 1", ... }
]
```

#### Error (500)
_No content, status only_

---

## API Endpoint: POST /:communityId/news_story

Create a news story (point) in a community.

### Request

#### Parameters

| Name        | Type   | In   | Description                | Required |
|-------------|--------|------|----------------------------|----------|
| communityId | string | path | Community ID               | Yes      |

#### Headers

| Name        | Type   | Description         | Required |
|-------------|--------|---------------------|----------|
| Authorization| string | Bearer token        | Yes      |

#### Body

```json
{
  "title": "News Title",
  "content": "News content"
}
```
- `title`: string, required
- `content`: string, required

### Response

#### Success (200)
_No content_

#### Error (500)
_No content, status only_

---

## API Endpoint: GET /:communityId/admin_users

Get all admin users for a community.

### Request

#### Parameters

| Name        | Type   | In   | Description                | Required |
|-------------|--------|------|----------------------------|----------|
| communityId | string | path | Community ID               | Yes      |

#### Headers

| Name        | Type   | Description         | Required |
|-------------|--------|---------------------|----------|
| Authorization| string | Bearer token        | Yes      |

#### Body

_None_

### Response

#### Success (200)
```json
[
  { "id": 1, "email": "admin@example.com", ... }
]
```

#### Error (500)
_No content, status only_

---

## API Endpoint: GET /:communityId/posts

Get posts for a community, with optional sorting.

### Request

#### Parameters

| Name        | Type   | In   | Description                | Required |
|-------------|--------|------|----------------------------|----------|
| communityId | string | path | Community ID               | Yes      |

#### Query

| Name   | Type   | In    | Description                | Required |
|--------|--------|-------|----------------------------|----------|
| sortBy | string | query | Sorting method (newest, most_debated, random) | No |
| limit  | number | query | Number of posts to return  | No       |

#### Headers

| Name        | Type   | Description         | Required |
|-------------|--------|---------------------|----------|
| Authorization| string | Bearer token        | Yes      |

#### Body

_None_

### Response

#### Success (200)
```json
[
  { "id": 1, "name": "Post 1", ... }
]
```

#### Error (500)
_No content, status only_

---

## API Endpoint: GET /:id

Get a full community object by ID.

### Request

#### Parameters

| Name | Type   | In   | Description    | Required |
|------|--------|------|----------------|----------|
| id   | string | path | Community ID   | Yes      |

#### Headers

| Name        | Type   | Description         | Required |
|-------------|--------|---------------------|----------|
| Authorization| string | Bearer token        | Yes      |

#### Body

_None_

### Response

#### Success (200)
```json
{
  "id": 1,
  "name": "Community Name",
  ...
}
```

#### Error (404, 500)
_No content, status only_

---

## API Endpoint: POST /:domainId

Create a new community in a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description         | Required |
|-----------|--------|------|---------------------|----------|
| domainId  | string | path | Domain ID           | Yes      |

#### Headers

| Name        | Type   | Description         | Required |
|-------------|--------|---------------------|----------|
| Authorization| string | Bearer token        | Yes      |

#### Body

```json
{
  "name": "Community Name",
  "description": "Description",
  "hostname": "community.example.com",
  "website": "https://community.example.com",
  "in_community_folder_id": 1,
  "is_community_folder": false,
  // ... other configuration fields
}
```
See [updateCommunityConfigParameters](#utility-function-updatecommunityconfigparameters) for all possible configuration fields.

### Response

#### Success (200)
```json
{
  "id": 1,
  "name": "Community Name",
  ...
}
```

#### Error (500)
_No content, status only_

---

## API Endpoint: PUT /:id

Update a community by ID.

### Request

#### Parameters

| Name | Type   | In   | Description    | Required |
|------|--------|------|----------------|----------|
| id   | string | path | Community ID   | Yes      |

#### Headers

| Name        | Type   | Description         | Required |
|-------------|--------|---------------------|----------|
| Authorization| string | Bearer token        | Yes      |

#### Body

_Same as POST /:domainId_

### Response

#### Success (200)
```json
{
  "id": 1,
  "name": "Community Name",
  ...
}
```

#### Error (404, 500)
_No content, status only_

---

## API Endpoint: DELETE /:id

Soft-delete a community by ID.

### Request

#### Parameters

| Name | Type   | In   | Description    | Required |
|------|--------|------|----------------|----------|
| id   | string | path | Community ID   | Yes      |

#### Headers

| Name        | Type   | Description         | Required |
|-------------|--------|---------------------|----------|
| Authorization| string | Bearer token        | Yes      |

#### Body

_None_

### Response

#### Success (200)
_No content_

#### Error (404, 500)
_No content, status only_

---

## API Endpoint: DELETE /:id/delete_content

Delete all content in a community.

### Request

#### Parameters

| Name | Type   | In   | Description    | Required |
|------|--------|------|----------------|----------|
| id   | string | path | Community ID   | Yes      |

#### Headers

| Name        | Type   | Description         | Required |
|-------------|--------|---------------------|----------|
| Authorization| string | Bearer token        | Yes      |

#### Body

_None_

### Response

#### Success (200)
_No content_

#### Error (404, 500)
_No content, status only_

---

## API Endpoint: DELETE /:id/anonymize_content

Anonymize all content in a community (delayed job).

### Request

#### Parameters

| Name | Type   | In   | Description    | Required |
|------|--------|------|----------------|----------|
| id   | string | path | Community ID   | Yes      |

#### Headers

| Name        | Type   | Description         | Required |
|-------------|--------|---------------------|----------|
| Authorization| string | Bearer token        | Yes      |

#### Body

_None_

### Response

#### Success (200)
_No content_

#### Error (404, 500)
_No content, status only_

---

## API Endpoint: GET /:id/wordcloud

Get wordcloud analytics for a community.

### Request

#### Parameters

| Name | Type   | In   | Description    | Required |
|------|--------|------|----------------|----------|
| id   | string | path | Community ID   | Yes      |

#### Headers

| Name        | Type   | Description         | Required |
|-------------|--------|---------------------|----------|
| Authorization| string | Bearer token        | Yes      |

#### Body

_None_

### Response

#### Success (200)
```json
{
  // wordcloud data
}
```

#### Error (500)
_No content, status only_

---

# Controller/Helper Functions

## Function: sendCommunityOrError

Handles sending a community object or an error response.

### Parameters

| Name      | Type     | Description                                      |
|-----------|----------|--------------------------------------------------|
| res       | Response | Express response object                          |
| community | any      | Community object or ID                           |
| context   | string   | Context string for logging                       |
| user      | any      | User object                                      |
| error     | any      | Error object or message                          |
| errorStatus | number | HTTP status code (optional)                      |

---

## Function: getCommunityFolder

Fetches a community folder and its communities, including open, admin, and user communities.

### Parameters

| Name              | Type     | Description                                 |
|-------------------|----------|---------------------------------------------|
| req               | Request  | Express request object                      |
| communityFolderId | string   | ID of the community folder                  |
| done              | function | Callback function (error, communityFolder)  |

---

## Function: getCommunityAndUser

Fetches a community and a user by communityId and userId or userEmail.

### Parameters

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| communityId | string   | Community ID                                |
| userId      | string   | User ID (optional)                          |
| userEmail   | string   | User email (optional)                       |
| callback    | function | Callback function (error, community, user)  |

---

## Function: getCommunity

Fetches a community by request params and populates its groups, including admin/user-specific groups.

### Parameters

| Name | Type     | Description                                 |
|------|----------|---------------------------------------------|
| req  | Request  | Express request object                      |
| done | function | Callback function (error, community)        |

---

# Utility Functions

## Function: truthValueFromBody

Converts a body parameter to a boolean value.

### Parameters

| Name          | Type   | Description                        |
|---------------|--------|------------------------------------|
| bodyParameter | any    | Value from request body            |

### Returns

- `boolean`

---

## Function: updateCommunityConfigParameters

Updates a community instance's configuration fields from the request body.

### Parameters

| Name      | Type     | Description                                 |
|-----------|----------|---------------------------------------------|
| req       | Request  | Express request object                      |
| community | any      | Community model instance                    |

### Description

Sets a large number of configuration fields on the community instance based on the request body. Handles parsing of JSON fields, booleans, and other types.

---

# Exported Router

The file exports an Express Router instance with all the above endpoints and logic.

```js
module.exports = router;
```

---

# Related Files

- [../models/index.cjs](../models/index.md)
- [../authorization.cjs](../authorization.md)
- [../utils/logger.cjs](../utils/logger.md)
- [../utils/to_json.cjs](../utils/to_json.md)
- [../services/workers/queue.cjs](../services/workers/queue.md)
- [../services/engine/moderation/get_moderation_items.cjs](../services/engine/moderation/get_moderation_items.md)
- [../services/engine/moderation/process_moderation_items.cjs](../services/engine/moderation/process_moderation_items.md)
- [../utils/export_utils.cjs](../utils/export_utils.md)
- [../utils/community_mapping_tools.cjs](../utils/community_mapping_tools.md)
- [../services/engine/analytics/plausible/manager.cjs](../services/engine/analytics/plausible/manager.md)
- [../services/engine/analytics/manager.cjs](../services/engine/analytics/manager.md)
- [../services/engine/analytics/statsCalc.cjs](../services/engine/analytics/statsCalc.md)
- [../services/utils/translation_helpers.cjs](../services/utils/translation_helpers.md)
- [../utils/is_valid_db_id.cjs](../utils/is_valid_db_id.md)
- [../utils/copy_utils.cjs](../utils/copy_utils.md)
- [../utils/recount_utils.cjs](../utils/recount_utils.md)

---

# Notes

- All endpoints require appropriate authentication and authorization middleware.
- Many endpoints use background jobs (via `queue`) for heavy or asynchronous operations.
- The router is designed for a multi-tenant, multi-community platform with advanced moderation, analytics, and campaign features.
- For full details on request/response schemas, see the source or referenced model/service documentation.

---

**End of documentation for this file.**