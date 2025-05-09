# API Documentation: Domain Router

This file defines the main Express.js router for domain-related operations, including domain management, community folders, pages, users, moderation, analytics, campaigns, and AI image generation. It integrates with various models, services, and utility modules.

---

## Table of Contents

- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Controller/Helper Functions](#controllerhelper-functions)
- [Utility Functions](#utility-functions)
- [Exported Router](#exported-router)

---

# API Endpoints

## [GET] /:domainId/availableCommunityFolders

Get all available community folders for which the current user is an admin in the specified domain.

### Request

#### Parameters

| Name      | Type   | In   | Description                | Required |
|-----------|--------|------|----------------------------|----------|
| domainId  | string | path | Domain ID                  | Yes      |

#### Headers

| Name         | Type   | Description        | Required |
|--------------|--------|--------------------|----------|
| Authorization| string | Auth token         | Yes      |

### Response

#### Success (200)

```json
[
  {
    "id": 123,
    "name": "Community Folder Name"
  }
]
```
List of available community folders.

#### Error (500, 404)

```json
{
  "error": "Could not get availableCommunityFolders"
}
```
Error retrieving folders.

---

## [DELETE] /:domainId/:activityId/delete_activity

Soft-delete an activity in a domain.

### Request

#### Parameters

| Name       | Type   | In   | Description         | Required |
|------------|--------|------|---------------------|----------|
| domainId   | string | path | Domain ID           | Yes      |
| activityId | string | path | Activity ID         | Yes      |

### Response

#### Success (200)

```json
{
  "activityId": 123
}
```
Activity deleted.

#### Error (500)

```json
{
  "error": "Could not delete activity for domain"
}
```

---

## [GET] /:domainId/pages

Get all public pages for a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |

### Response

#### Success (200)

```json
[
  {
    "id": 1,
    "title": "Page Title",
    ...
  }
]
```
List of pages.

#### Error (500)

---

## [GET] /:domainId/pages_for_admin

Get all pages for a domain, including admin-only pages.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |

### Response

#### Success (200)

List of pages (including admin-only).

#### Error (500)

---

## [POST] /:domainId/add_page

Create a new page for a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |

#### Body

```json
{}
```
No required body fields.

### Response

#### Success (200)

Page created.

#### Error (500)

---

## [GET] /:domainId/users

Get all users for a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |

### Response

#### Success (200)

```json
[
  {
    "id": 1,
    "email": "user@example.com",
    ...
  }
]
```
List of users.

#### Error (500)

---

## [GET] /:domainId/admin_users

Get all admin users for a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |

### Response

#### Success (200)

List of admin users.

#### Error (500)

---

## [PUT] /:domainId/:pageId/update_page_locale

Update the locale of a page.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |
| pageId    | string | path | Page ID     | Yes      |

### Response

#### Success (200)

Locale updated.

#### Error (500)

---

## [PUT] /:domainId/:pageId/update_page_weight

Update the weight (ordering) of a page.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |
| pageId    | string | path | Page ID     | Yes      |

### Response

#### Success (200)

Weight updated.

#### Error (500)

---

## [PUT] /:domainId/:pageId/publish_page

Publish a page.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |
| pageId    | string | path | Page ID     | Yes      |

### Response

#### Success (200)

Page published.

#### Error (500)

---

## [PUT] /:domainId/:pageId/un_publish_page

Un-publish a page.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |
| pageId    | string | path | Page ID     | Yes      |

### Response

#### Success (200)

Page unpublished.

#### Error (500)

---

## [DELETE] /:domainId/:pageId/delete_page

Delete a page.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |
| pageId    | string | path | Page ID     | Yes      |

### Response

#### Success (200)

Page deleted.

#### Error (500)

---

## [POST] /:domainId/news_story

Create a news story point in a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |

#### Body

```json
{
  // News story data
}
```

### Response

#### Success (200)

News story created.

#### Error (500)

---

## [GET] /oldBoot

Get the current domain and optionally the current community.

### Response

#### Success (200)

```json
{
  "domain": { ... },
  "community": { ... }
}
```

#### Error (404, 500)

---

## [GET] /

Get the current domain (and optionally community) with sensitive fields removed.

### Response

#### Success (200)

```json
{
  "domain": { ... },
  "community": { ... }
}
```

---

## [GET] /:id/translatedText

Get translated text for a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| id        | string | path | Domain ID   | Yes      |

#### Query

| Name     | Type   | In    | Description         | Required |
|----------|--------|-------|---------------------|----------|
| textType | string | query | Type of text (must include "domain") | Yes |

### Response

#### Success (200)

Translation object.

#### Error (401, 404, 500)

---

## [GET] /:id

Get a domain by ID.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| id        | string | path | Domain ID   | Yes      |

### Response

#### Success (200)

Domain object.

#### Error (404, 500)

---

## [PUT] /:id

Update a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| id        | string | path | Domain ID   | Yes      |

#### Body

```json
{
  "name": "string",
  "description": "string",
  // ... other domain properties
}
```

### Response

#### Success (200)

Updated domain object.

#### Error (404, 500)

---

## [GET] /:id/my_domains

Get all domains where the current user is a user or admin.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| id        | string | path | Domain ID   | Yes      |

### Response

#### Success (200)

```json
[
  { "id": 1, "name": "Domain 1" },
  { "id": 2, "name": "Domain 2" }
]
```

#### Error (500)

---

## [POST] /:id

Create a new domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| id        | string | path | Domain ID   | Yes      |

#### Body

```json
{
  "name": "string",
  "description": "string",
  // ... other domain properties
}
```

### Response

#### Success (200)

Created domain object.

#### Error (500)

---

## [DELETE] /:id

Soft-delete a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| id        | string | path | Domain ID   | Yes      |

### Response

#### Success (200)

Domain deleted.

#### Error (404, 500)

---

## [GET] /:id/news

Get news activities for a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| id        | string | path | Domain ID   | Yes      |

### Response

#### Success (200)

News activity object.

#### Error (404, 500)

---

## [DELETE] /:domainId/:itemId/:itemType/:actionType/process_one_moderation_item

Perform a single moderation action on a domain item.

### Request

#### Parameters

| Name      | Type   | In   | Description         | Required |
|-----------|--------|------|---------------------|----------|
| domainId  | string | path | Domain ID           | Yes      |
| itemId    | string | path | Item ID             | Yes      |
| itemType  | string | path | Item type           | Yes      |
| actionType| string | path | Moderation action   | Yes      |

### Response

#### Success (200)

Moderation result.

#### Error (500)

---

## [DELETE] /:domainId/:actionType/process_many_moderation_item

Perform many moderation actions in bulk.

### Request

#### Parameters

| Name      | Type   | In   | Description         | Required |
|-----------|--------|------|---------------------|----------|
| domainId  | string | path | Domain ID           | Yes      |
| actionType| string | path | Moderation action   | Yes      |

#### Body

```json
{
  "items": [ ... ]
}
```

### Response

#### Success (200)

```json
{}
```

---

## [GET] /:domainId/flagged_content

Get all flagged content for moderation in a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |

### Response

#### Success (200)

List of flagged items.

#### Error (500)

---

## [GET] /:domainId/moderate_all_content

Get all content for moderation in a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |

### Response

#### Success (200)

List of all items.

#### Error (500)

---

## [GET] /:domainId/flagged_content_count

Get the count of flagged content for moderation in a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |

### Response

#### Success (200)

```json
{ "count": 5 }
```

#### Error (500)

---

## [DELETE] /:domainId/remove_many_admins

Remove multiple admins from a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |

#### Body

```json
{
  "userIds": [1,2,3]
}
```

### Response

#### Success (200)

---

## [DELETE] /:domainId/remove_many_users_and_delete_content

Remove multiple users and delete their content from a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |

#### Body

```json
{
  "userIds": [1,2,3]
}
```

### Response

#### Success (200)

---

## [DELETE] /:domainId/remove_many_users

Remove multiple users from a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |

#### Body

```json
{
  "userIds": [1,2,3]
}
```

### Response

#### Success (200)

---

## [DELETE] /:domainId/:userId/remove_and_delete_user_content

Remove a user and delete their content from a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |
| userId    | string | path | User ID     | Yes      |

### Response

#### Success (200)

---

## [DELETE] /:domainId/:userId/remove_admin

Remove an admin from a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |
| userId    | string | path | User ID     | Yes      |

### Response

#### Success (200)

---

## [POST] /:domainId/:email/add_admin

Add an admin to a domain by email.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |
| email     | string | path | User email  | Yes      |

### Response

#### Success (200)

---

## [DELETE] /:domainId/:userId/remove_user

Remove a user from a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |
| userId    | string | path | User ID     | Yes      |

### Response

#### Success (200)

---

## [GET] /:domainId/export_logins

Export logins for a domain as a CSV file.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |

### Response

#### Success (200)

CSV file as attachment.

#### Error (404, 500)

---

## [GET] /:id/wordcloud

Get word cloud analytics for a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| id        | string | path | Domain ID   | Yes      |

### Response

#### Success (200)

Word cloud data.

---

## [GET] /:id/similarities_weights

Get similarities weights analytics for a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| id        | string | path | Domain ID   | Yes      |

### Response

#### Success (200)

Similarities weights data.

---

## [GET] /:id/stats_posts

Get post statistics for a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| id        | string | path | Domain ID   | Yes      |

### Response

#### Success (200)

Statistics data.

---

## [GET] /:id/stats_points

Get point statistics for a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| id        | string | path | Domain ID   | Yes      |

### Response

#### Success (200)

Statistics data.

---

## [GET] /:id/stats_votes

Get vote statistics for a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| id        | string | path | Domain ID   | Yes      |

### Response

#### Success (200)

Statistics data.

---

## [PUT] /:domainId/plausibleStatsProxy

Proxy request to Plausible analytics for a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |

#### Body

```json
{
  "plausibleUrl": "string"
}
```

### Response

#### Success (200)

Plausible analytics data.

#### Error (500)

---

## [GET] /:domainId/get_campaigns

Get all active campaigns for a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |

### Response

#### Success (200)

List of campaigns.

#### Error (500)

---

## [POST] /:domainId/create_campaign

Create a new campaign for a domain.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |

#### Body

```json
{
  "configuration": { ... }
}
```

### Response

#### Success (200)

Created campaign object.

#### Error (500)

---

## [PUT] /:domainId/:campaignId/update_campaign

Update a campaign for a domain.

### Request

#### Parameters

| Name        | Type   | In   | Description | Required |
|-------------|--------|------|-------------|----------|
| domainId    | string | path | Domain ID   | Yes      |
| campaignId  | string | path | Campaign ID | Yes      |

#### Body

```json
{
  "configuration": { ... }
}
```

### Response

#### Success (200)

Updated campaign object.

#### Error (500)

---

## [DELETE] /:domainId/:campaignId/delete_campaign

Delete a campaign for a domain.

### Request

#### Parameters

| Name        | Type   | In   | Description | Required |
|-------------|--------|------|-------------|----------|
| domainId    | string | path | Domain ID   | Yes      |
| campaignId  | string | path | Campaign ID | Yes      |

### Response

#### Success (200)

---

## [POST] /:domainId/:start_generating/ai_image

Start generating an AI image for a domain.

### Request

#### Parameters

| Name             | Type   | In   | Description | Required |
|------------------|--------|------|-------------|----------|
| domainId         | string | path | Domain ID   | Yes      |
| start_generating | string | path | (unused)    | Yes      |

#### Body

```json
{
  "prompt": "string",
  "imageType": "string"
}
```

### Response

#### Success (200)

```json
{ "jobId": 123 }
```

---

## [GET] /:domainId/:jobId/poll_for_generating_ai_image

Poll for the status of an AI image generation job.

### Request

#### Parameters

| Name      | Type   | In   | Description | Required |
|-----------|--------|------|-------------|----------|
| domainId  | string | path | Domain ID   | Yes      |
| jobId     | string | path | Job ID      | Yes      |

### Response

#### Success (200)

```json
{
  "id": 123,
  "progress": 0.5,
  "error": null,
  "data": { ... }
}
```

---

# Middleware

## auth.can(permission)

Authorization middleware to check if the user has the specified permission for the domain.

### Parameters

| Name       | Type     | Description                        |
|------------|----------|------------------------------------|
| permission | string   | Permission string (e.g., 'edit domain', 'view domain') |

---

## auth.isLoggedInNoAnonymousCheck

Middleware to ensure the user is logged in (excluding anonymous users).

---

# Controller/Helper Functions

## sendDomainOrError

Handles sending a domain object or an error response.

### Parameters

| Name    | Type     | Description                        |
|---------|----------|------------------------------------|
| res     | Response | Express response object            |
| domain  | any      | Domain object or null              |
| context | string   | Context string for logging         |
| user    | any      | User object                        |
| error   | any      | Error object or string             |
| errorStatus | number | HTTP status code (optional)      |

---

## truthValueFromBody

Converts a body parameter to a boolean value.

### Parameters

| Name          | Type   | Description                |
|---------------|--------|----------------------------|
| bodyParameter | any    | Value from request body    |

### Returns

- `boolean`

---

## getAvailableCommunityFolders

Finds all community folders in a domain where the user is an admin.

### Parameters

| Name     | Type     | Description                        |
|----------|----------|------------------------------------|
| req      | Request  | Express request object             |
| domainId | string   | Domain ID                          |
| done     | function | Callback (error, folders)          |

---

## getDomain

Fetches a domain and its related communities, images, and videos, with different attributes for admins and non-admins.

### Parameters

| Name     | Type     | Description                        |
|----------|----------|------------------------------------|
| req      | Request  | Express request object             |
| domainId | string   | Domain ID                          |
| done     | function | Callback (error, domain)           |

---

## getDomainAndUser

Fetches a domain and a user by ID or email.

### Parameters

| Name      | Type     | Description                        |
|-----------|----------|------------------------------------|
| domainId  | string   | Domain ID                          |
| userId    | string   | User ID (optional)                 |
| userEmail | string   | User email (optional)              |
| callback  | function | Callback (error, domain, user)     |

---

## updateDomainProperties

Updates a domain instance with properties from the request body.

### Parameters

| Name   | Type     | Description                        |
|--------|----------|------------------------------------|
| domain | Domain   | Domain instance                    |
| req    | Request  | Express request object             |

---

# Utility Functions

## toJson

Converts an object to a JSON-safe representation.

---

## isValidDbId

Checks if a string is a valid database ID.

---

# Exported Router

This file exports the configured Express router for use in the main application.

```js
module.exports = router;
```

---

# Related Modules

- [models/index.cjs](./models/index.md)
- [authorization.cjs](./authorization.md)
- [utils/logger.cjs](./utils/logger.md)
- [utils/to_json.cjs](./utils/to_json.md)
- [services/workers/queue.cjs](./services/workers/queue.md)
- [services/engine/moderation/process_moderation_items.cjs](./services/engine/moderation/process_moderation_items.md)
- [services/engine/moderation/get_moderation_items.cjs](./services/engine/moderation/get_moderation_items.md)
- [utils/export_utils.cjs](./utils/export_utils.md)
- [utils/is_valid_db_id.cjs](./utils/is_valid_db_id.md)
- [services/engine/analytics/manager.cjs](./services/engine/analytics/manager.md)
- [services/engine/analytics/plausible/manager.cjs](./services/engine/analytics/plausible/manager.md)
- [services/engine/analytics/statsCalc.cjs](./services/engine/analytics/statsCalc.md)

---

# Notes

- All endpoints require appropriate authentication and authorization.
- Many endpoints use async/await or callback-based patterns.
- Some endpoints (e.g., campaign and AI image generation) are marked for future permission tightening.
- Error handling is consistent: logs errors and returns appropriate HTTP status codes.
- Sensitive fields are removed from domain objects before sending to clients.

---

For more details on the models and services used, see their respective documentation files.