# API Routes: Category Management

This module defines Express.js routes for managing categories, including viewing, creating, updating, deleting, and translating category data. It also provides endpoints for retrieving post counts associated with categories. The routes use authentication and authorization middleware, interact with Sequelize models, and log significant actions.

---

## Middleware Dependencies

- [auth.can(permission)](../authorization.cjs): Authorization middleware to check user permissions.
- [log](../utils/logger.cjs): Logging utility for info, warning, and error logs.
- [toJson](../utils/to_json.cjs): Utility to safely convert objects to JSON.

---

# API Endpoint: GET /:id

Retrieve a category by its ID, including associated group and image data.

## Request

### Parameters

| Name | Type   | In   | Description                | Required |
|------|--------|------|----------------------------|----------|
| id   | string | path | The ID of the category     | Yes      |

### Headers

| Name          | Type   | Description                | Required |
|---------------|--------|----------------------------|----------|
| Authorization | string | Bearer token (if required) | Yes      |

### Body

Not applicable.

## Response

### Success (200)

```json
{
  "id": 1,
  "name": "Category Name",
  "description": "Description",
  "Group": { /* group object */ },
  "CategoryIconImages": [ /* image objects */ ],
  "CategoryHeaderImages": [ /* image objects */ ]
}
```
Returns the category object with associated group and images.

### Error (404, 500)

```json
{
  "error": "Not found"
}
```
- 404: Category not found.
- 500: Internal server error.

---

# API Endpoint: GET /:id/translatedText

Retrieve translated text for a category, based on the `textType` query parameter.

## Request

### Parameters

| Name | Type   | In   | Description                | Required |
|------|--------|------|----------------------------|----------|
| id   | string | path | The ID of the category     | Yes      |

### Query

| Name     | Type   | In    | Description                        | Required |
|----------|--------|-------|------------------------------------|----------|
| textType | string | query | Must include "category" substring  | Yes      |

### Headers

| Name          | Type   | Description                | Required |
|---------------|--------|----------------------------|----------|
| Authorization | string | Bearer token (if required) | Yes      |

### Body

Not applicable.

## Response

### Success (200)

```json
{
  "id": 1,
  "name": "Translated Name"
}
```
Returns the translated text for the category.

### Error (401, 404, 500)

```json
{
  "error": "description of error"
}
```
- 401: Wrong `textType` query parameter.
- 404: Category not found.
- 500: Internal server error.

---

# API Endpoint: POST /:groupId

Create a new category within a group.

## Request

### Parameters

| Name    | Type   | In   | Description                | Required |
|---------|--------|------|----------------------------|----------|
| groupId | string | path | The ID of the group        | Yes      |

### Headers

| Name          | Type   | Description                | Required |
|---------------|--------|----------------------------|----------|
| Authorization | string | Bearer token (if required) | Yes      |

### Body

```json
{
  "name": "Category Name",
  "description": "Description",
  // Optionally, image data for setupImages
}
```
- `name`: string, required.
- `description`: string, optional.
- Additional fields for image setup may be included.

## Response

### Success (200)

```json
{
  "id": 1,
  "name": "Category Name",
  "description": "Description",
  // ...other category fields
}
```
Returns the created category object.

### Error (500)

```json
{
  "error": "description of error"
}
```
- 500: Internal server error.

---

# API Endpoint: PUT /:id

Update an existing category's name, description, and images.

## Request

### Parameters

| Name | Type   | In   | Description                | Required |
|------|--------|------|----------------------------|----------|
| id   | string | path | The ID of the category     | Yes      |

### Headers

| Name          | Type   | Description                | Required |
|---------------|--------|----------------------------|----------|
| Authorization | string | Bearer token (if required) | Yes      |

### Body

```json
{
  "name": "Updated Name",
  "description": "Updated Description",
  // Optionally, image data for setupImages
}
```
- `name`: string, required.
- `description`: string, optional.
- Additional fields for image setup may be included.

## Response

### Success (200)

```json
{
  "id": 1,
  "name": "Updated Name",
  "description": "Updated Description",
  // ...other category fields
}
```
Returns the updated category object.

### Error (404, 500)

```json
{
  "error": "description of error"
}
```
- 404: Category not found.
- 500: Internal server error.

---

# API Endpoint: DELETE /:id

Soft-delete a category if it has no associated posts.

## Request

### Parameters

| Name | Type   | In   | Description                | Required |
|------|--------|------|----------------------------|----------|
| id   | string | path | The ID of the category     | Yes      |

### Headers

| Name          | Type   | Description                | Required |
|---------------|--------|----------------------------|----------|
| Authorization | string | Bearer token (if required) | Yes      |

### Body

Not applicable.

## Response

### Success (200)

No content. Indicates successful deletion.

### Error (401, 404, 500)

```json
{
  "error": "description of error"
}
```
- 401: Category has posts and cannot be deleted.
- 404: Category not found.
- 500: Internal server error.

---

# API Endpoint: GET /:id/getPostsCount

Get the number of posts associated with a category.

## Request

### Parameters

| Name | Type   | In   | Description                | Required |
|------|--------|------|----------------------------|----------|
| id   | string | path | The ID of the category     | Yes      |

### Headers

| Name          | Type   | Description                | Required |
|---------------|--------|----------------------------|----------|
| Authorization | string | Bearer token (if required) | Yes      |

### Body

Not applicable.

## Response

### Success (200)

```json
{
  "count": 5
}
```
Returns the number of posts in the category.

### Error (500)

```json
{
  "error": "description of error"
}
```
- 500: Internal server error.

---

# Utility Function: sendCategoryOrError

Handles sending a category object or an error response, with appropriate logging.

## Parameters

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| res         | Response | Express response object                          |
| category    | any      | The category object or ID                        |
| context     | string   | Context string for logging                       |
| user        | any      | User object for logging                          |
| error       | any      | Error object or message                          |
| errorStatus | number   | HTTP status code for error (optional)            |

## Description

- Sends the category object if no error.
- Logs and sends an error status if an error is present or category is missing.
- Used throughout the routes for consistent error handling.

---

# Exported Router

This module exports an Express router with all the above endpoints.

---

# Related Models and Utilities

- **Category Model**: See [models/index.cjs](../models/index.cjs) for the Sequelize model definition.
- **Group Model**: See [models/index.cjs](../models/index.cjs).
- **Image Model**: See [models/index.cjs](../models/index.cjs).
- **AcTranslationCache**: Used for translation caching.
- **AcActivity**: Used for activity logging.
- **Post Model**: Used for post count and deletion checks.

---

# See Also

- [Authorization Middleware](../authorization.cjs)
- [Logger Utility](../utils/logger.cjs)
- [toJson Utility](../utils/to_json.cjs)
- [Category Model](../models/index.cjs)
