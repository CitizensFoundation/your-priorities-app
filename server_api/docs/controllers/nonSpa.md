# API Router: botController.cjs

This file defines an Express.js router that serves as a controller for bot-friendly endpoints, rendering structured HTML for bots (such as social media crawlers or chatbots) to preview domains, communities, groups, posts, and users. It supports translation, pagination, and dynamic sharing parameters.

---

## API Endpoint: GET /{*splat}

Handles all GET requests for bot-friendly previews of various entities (domain, community, group, post, user) based on the URL path and parameters.

### Description

- Parses the incoming URL to determine the entity type and ID.
- Supports pagination for communities, groups, posts, and points via query parameters.
- Renders a 'bot' view with structured data for bots.
- Handles translation if requested via query parameters.
- Returns 404 or 500 on errors or if the entity is not found.

### Request

#### Parameters

| Name             | Type    | In    | Description                                                                 | Required |
|------------------|---------|-------|-----------------------------------------------------------------------------|----------|
| splat            | string  | path  | Wildcard path, used to route to the correct entity (domain, community, etc) | Yes      |
| communitiesOffset| number  | query | Offset for paginating communities in a domain                               | No       |
| postsOffset      | number  | query | Offset for paginating posts in a group                                      | No       |
| pointsOffset     | number  | query | Offset for paginating points in a post                                      | No       |
| locale / l       | string  | query | Target language for translation                                             | No       |
| startAutoTranslate / t | boolean | query | Whether to trigger translation of content                                  | No       |

#### Headers

| Name         | Type   | Description        | Required |
|--------------|--------|--------------------|----------|
| (none)       |        |                    |          |

#### Body

Not applicable (GET request).

### Response

#### Success (200)

Renders the `bot` view with a context object containing:

```json
{
  "url": "string",
  "title": "string",
  "descriptionText": "string",
  "imageUrl": "string",
  "locale": "string",
  "contentType": "string",
  "subItemsUrlbase": "string",
  "subItemContainerName": "string",
  "backUrl": "string",
  "backText": "string",
  "moreUrl": "string|null",
  "moreText": "string|null",
  "subItemPoints": [],
  "subItemIds": []
}
```

- The exact fields depend on the entity type (domain, community, group, post, user).
- For paginated lists, `moreUrl` and `moreText` are provided if more items are available.

#### Error (4xx, 5xx)

```json
{
  "error": "description of error"
}
```

- 404: Entity not found or invalid ID.
- 500: Internal server error.

---

# Controller Functions

## sendDomain(id, communitiesOffset, req, res)

Renders a bot-friendly view for a domain and its public communities.

### Parameters

| Name             | Type     | Description                                 |
|------------------|----------|---------------------------------------------|
| id               | string   | Domain ID                                   |
| communitiesOffset| number   | Offset for paginating communities           |
| req              | Request  | Express request object                      |
| res              | Response | Express response object                     |

- Fetches the domain and its logo.
- Fetches up to 1000 public communities in the domain.
- Supports pagination via `communitiesOffset`.
- Renders the `bot` view with sharing parameters and community list.

---

## sendCommunity(id, req, res)

Renders a bot-friendly view for a community and its public groups.

### Parameters

| Name | Type     | Description                |
|------|----------|----------------------------|
| id   | string   | Community ID               |
| req  | Request  | Express request object     |
| res  | Response | Express response object    |

- Fetches the community, its logo, and up to 10,000 public groups.
- If translation is requested, translates name and description.
- Renders the `bot` view with sharing parameters and group list.

---

## sendGroup(id, postsOffset, req, res)

Renders a bot-friendly view for a group and its posts.

### Parameters

| Name       | Type     | Description                |
|------------|----------|----------------------------|
| id         | string   | Group ID                   |
| postsOffset| number   | Offset for paginating posts|
| req        | Request  | Express request object     |
| res        | Response | Express response object    |

- Fetches the group, its logo, and up to 1000 posts.
- If translation is requested, translates name and objectives.
- Renders the `bot` view with sharing parameters and post list.

---

## sendPost(id, pointsOffset, req, res)

Renders a bot-friendly view for a post and its points.

### Parameters

| Name        | Type     | Description                |
|-------------|----------|----------------------------|
| id          | string   | Post ID                    |
| pointsOffset| number   | Offset for paginating points|
| req         | Request  | Express request object     |
| res         | Response | Express response object    |

- Fetches the post, its header image, and up to 1000 points.
- Renders the `bot` view with sharing parameters and point list.

---

## sendUser(id, req, res)

Renders a bot-friendly view for a user.

### Parameters

| Name | Type     | Description                |
|------|----------|----------------------------|
| id   | string   | User ID                    |
| req  | Request  | Express request object     |
| res  | Response | Express response object    |

- Fetches the user and their profile image.
- Renders the `bot` view with sharing parameters.

---

## completeSendingCommunity(community, req, res)

Helper to render a community for bots, after translation if needed.

### Parameters

| Name      | Type     | Description                |
|-----------|----------|----------------------------|
| community | Object   | Community instance         |
| req       | Request  | Express request object     |
| res       | Response | Express response object    |

---

## completeSendingGroup(group, postsInfo, postsOffset, req, res)

Helper to render a group for bots, after translation if needed.

### Parameters

| Name      | Type     | Description                |
|-----------|----------|----------------------------|
| group     | Object   | Group instance             |
| postsInfo | Object   | Posts info (rows, count)   |
| postsOffset| number  | Offset for paginating posts|
| req       | Request  | Express request object     |
| res       | Response | Express response object    |

---

## getTranslation(modelInstance, textType, targetLanguage, done)

Fetches a translation for a given model instance and text type.

### Parameters

| Name           | Type     | Description                        |
|----------------|----------|------------------------------------|
| modelInstance  | Object   | The model instance to translate    |
| textType       | string   | Type of text (e.g., 'communityName')|
| targetLanguage | string   | Target language code               |
| done           | Function | Callback(error, translation)       |

---

## translateCommunity(community, req, res)

Translates a community's name and description, then renders for bots.

### Parameters

| Name      | Type     | Description                |
|-----------|----------|----------------------------|
| community | Object   | Community instance         |
| req       | Request  | Express request object     |
| res       | Response | Express response object    |

---

## translateGroup(group, postsInfo, postsOffset, req, res)

Translates a group's name and objectives, then renders for bots.

### Parameters

| Name      | Type     | Description                |
|-----------|----------|----------------------------|
| group     | Object   | Group instance             |
| postsInfo | Object   | Posts info (rows, count)   |
| postsOffset| number  | Offset for paginating posts|
| req       | Request  | Express request object     |
| res       | Response | Express response object    |

---

# Utility Functions and Modules Used

- [getSharingParameters, getFullUrl, getSplitUrl](./utils/sharing_parameters.md): For generating sharing URLs and parsing incoming URLs.
- [isValidDbId](./utils/is_valid_db_id.md): Validates database IDs.
- [logger](./utils/logger.md): For logging errors, warnings, and info.
- [toJson](./utils/to_json.md): Converts models to JSON (not directly used in this file).
- [lodash](https://lodash.com/): Used for array manipulation (e.g., `_.dropRight`).
- [async](https://caolan.github.io/async/): Used for series execution of asynchronous functions.

---

# Constants

## ITEM_LIMIT

- **Type:** `number`
- **Value:** `1000`
- **Description:** The maximum number of items (communities, posts, points) to fetch per page for bot rendering.

---

# Models Used

- **Domain**: Represents a domain, with logo images and associated communities.
- **Community**: Represents a community, with logo images and associated groups.
- **Group**: Represents a group, with logo images and associated posts.
- **Post**: Represents a post, with header images and associated points.
- **User**: Represents a user, with profile images.
- **Image**: Represents an image, with formats.
- **Point**: Represents a point (argument or comment) on a post.

See the [models/index.cjs](../models/index.cjs) for detailed model definitions.

---

# Export

```js
module.exports = router;
```

Exports the Express router for use in the main application.

---

# Example Usage

```js
const botController = require('./routes/botController.cjs');
app.use('/', botController);
```

---

# See Also

- [utils/sharing_parameters.cjs](./utils/sharing_parameters.md)
- [utils/is_valid_db_id.cjs](./utils/is_valid_db_id.md)
- [models/index.cjs](../models/index.cjs)
- [utils/logger.cjs](./utils/logger.md)
