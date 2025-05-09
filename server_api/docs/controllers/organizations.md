# API Routes: Organization Management

This module defines Express.js routes for managing organizations, including CRUD operations, user management within organizations, and related utilities. It uses authentication/authorization middleware, interacts with Sequelize models, and logs key actions.

---

## Table of Contents

- [API Endpoint: GET /:domainId/domainOrganizations](#api-endpoint-get-domaindid-domainorganizations)
- [API Endpoint: GET /:id](#api-endpoint-get-id)
- [API Endpoint: POST /:domainId](#api-endpoint-post-domaindid)
- [API Endpoint: PUT /:id](#api-endpoint-put-id)
- [API Endpoint: DELETE /:id](#api-endpoint-delete-id)
- [API Endpoint: DELETE /:organizationId/:userId/remove_user](#api-endpoint-delete-organizationid-userid-remove_user)
- [API Endpoint: POST /:organizationId/:userId/add_user](#api-endpoint-post-organizationid-userid-add_user)
- [Utility Function: sendOrganizationOrError](#utility-function-sendorganizationorerror)
- [Utility Function: getOrganizationAndUser](#utility-function-getorganizationanduser)
- [Dependencies](#dependencies)

---

# API Endpoint: GET /:domainId/domainOrganizations

Retrieve all organizations for a given domain.

## Request

### Parameters

| Name      | Type   | In   | Description                  | Required |
|-----------|--------|------|------------------------------|----------|
| domainId  | string | path | The ID of the domain         | Yes      |

### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | Bearer token (if required) | Yes      |

### Body

None.

## Response

### Success (200)

```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "domain_id": "string",
    // ...other organization fields
    "Domain": { /* domain object */ },
    "OrgLogoImgs": [ /* image objects */ ]
  }
]
```
Returns an array of organization objects with associated domain and logo images.

### Error (404)

```json
{
  "error": "Not found"
}
```
If no organizations are found.

### Error (500)

```json
{
  "error": "Internal server error"
}
```
On server or database error.

---

# API Endpoint: GET /:id

Retrieve a single organization by its ID.

## Request

### Parameters

| Name | Type   | In   | Description              | Required |
|------|--------|------|--------------------------|----------|
| id   | string | path | The ID of the organization | Yes      |

### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | Bearer token (if required) | Yes      |

### Body

None.

## Response

### Success (200)

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  // ...other organization fields
  "Domain": { /* domain object */ },
  "OrgLogoImgs": [ /* image objects */ ],
  "OrganizationHeaderImages": [ /* image objects */ ]
}
```
Returns the organization object with associated domain, logo, and header images.

### Error (404)

```json
{
  "error": "Not found"
}
```
If the organization is not found.

### Error (500)

```json
{
  "error": "Internal server error"
}
```
On server or database error.

---

# API Endpoint: POST /:domainId

Create a new organization within a domain.

## Request

### Parameters

| Name      | Type   | In   | Description                  | Required |
|-----------|--------|------|------------------------------|----------|
| domainId  | string | path | The ID of the domain         | Yes      |

### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | Bearer token (if required) | Yes      |

### Body

```json
{
  "name": "string",
  "description": "string",
  "website": "string",
  // ...fields for access and images
}
```
- `name`: string, required. Name of the organization.
- `description`: string, optional. Description of the organization.
- `website`: string, optional. Organization website.
- Additional fields for access and images as required by `convertAccessFromRadioButtons` and `setupImages`.

## Response

### Success (200)

```json
{
  "id": "string",
  "name": "string",
  // ...other organization fields
}
```
Returns the created organization object.

### Error (500)

```json
{
  "error": "Internal server error"
}
```
On validation or database error.

---

# API Endpoint: PUT /:id

Update an existing organization.

## Request

### Parameters

| Name | Type   | In   | Description              | Required |
|------|--------|------|--------------------------|----------|
| id   | string | path | The ID of the organization | Yes      |

### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | Bearer token (if required) | Yes      |

### Body

```json
{
  "name": "string",
  "description": "string",
  "website": "string",
  // ...fields for access and images
}
```
- `name`: string, required. New name.
- `description`: string, optional. New description.
- `website`: string, optional. New website.
- Additional fields for access and images as required.

## Response

### Success (200)

```json
{
  "id": "string",
  "name": "string",
  // ...updated organization fields
}
```
Returns the updated organization object.

### Error (404)

```json
{
  "error": "Not found"
}
```
If the organization is not found.

### Error (500)

```json
{
  "error": "Internal server error"
}
```
On validation or database error.

---

# API Endpoint: DELETE /:id

Soft-delete an organization (marks as deleted).

## Request

### Parameters

| Name | Type   | In   | Description              | Required |
|------|--------|------|--------------------------|----------|
| id   | string | path | The ID of the organization | Yes      |

### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | Bearer token (if required) | Yes      |

### Body

None.

## Response

### Success (200)

No content. Organization is marked as deleted.

### Error (404)

```json
{
  "error": "Not found"
}
```
If the organization is not found or not owned by the user.

### Error (500)

```json
{
  "error": "Internal server error"
}
```
On server or database error.

---

# API Endpoint: DELETE /:organizationId/:userId/remove_user

Remove a user from an organization.

## Request

### Parameters

| Name           | Type   | In   | Description                  | Required |
|----------------|--------|------|------------------------------|----------|
| organizationId | string | path | The ID of the organization   | Yes      |
| userId         | string | path | The ID of the user to remove | Yes      |

### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | Bearer token (if required) | Yes      |

### Body

None.

## Response

### Success (200)

```json
{
  "email": "user@example.com"
}
```
Returns the email of the removed user.

### Error (404)

No content. User or organization not found.

### Error (500)

No content. On server or database error.

---

# API Endpoint: POST /:organizationId/:userId/add_user

Add a user to an organization.

## Request

### Parameters

| Name           | Type   | In   | Description                  | Required |
|----------------|--------|------|------------------------------|----------|
| organizationId | string | path | The ID of the organization   | Yes      |
| userId         | string | path | The ID of the user to add    | Yes      |

### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Authorization| string | Bearer token (if required) | Yes      |

### Body

None.

## Response

### Success (200)

```json
{
  "email": "user@example.com"
}
```
Returns the email of the added user.

### Error (404)

No content. User or organization not found.

### Error (500)

No content. On server or database error.

---

# Utility Function: sendOrganizationOrError

Handles sending organization data or error responses in a consistent way.

## Parameters

| Name         | Type     | Description                                      |
|--------------|----------|--------------------------------------------------|
| res          | Response | Express response object                          |
| organization | any      | Organization object or null                      |
| context      | string   | Context string for logging                       |
| user         | any      | User object                                      |
| error        | any      | Error object or string                           |
| errorStatus  | number   | HTTP status code for error (optional)            |

- Logs errors or warnings as appropriate.
- Sends the organization object if present, otherwise sends the appropriate error status.

---

# Utility Function: getOrganizationAndUser

Fetches both an organization and a user by their IDs in parallel.

## Parameters

| Name           | Type     | Description                                      |
|----------------|----------|--------------------------------------------------|
| organizationId | string   | Organization ID                                  |
| userId         | string   | User ID                                          |
| callback       | function | Callback: (error, organization, user)            |

- Uses `async.parallel` to fetch both entities.
- Calls the callback with error or the found organization and user.

---

# Dependencies

- **models**: Sequelize models for Organization, User, Domain, Image, Group, etc. See [models/index.cjs](./models/index.md).
- **auth**: Authorization middleware. See [authorization.cjs](./authorization.md).
- **log**: Logging utility. See [utils/logger.cjs](./utils/logger.md).
- **toJson**: Utility to convert objects to JSON. See [utils/to_json.cjs](./utils/to_json.md).
- **lodash (_)**: Utility library.
- **async**: Async control flow library.

---

# Notes

- All routes require appropriate authorization via `auth.can(...)` middleware.
- Organization creation and update rely on model methods like `convertAccessFromRadioButtons`, `setupImages`, and `addOrganizationAdmins`.
- Deletion is a soft-delete (sets `deleted = true`).
- User management routes (`add_user`, `remove_user`) require both organization and user to exist.

---

For details on the Organization model, see [Organization Model](./models/Organization.md).  
For details on the User model, see [User Model](./models/User.md).  
For details on the Domain model, see [Domain Model](./models/Domain.md).  
For details on the Image model, see [Image Model](./models/Image.md).  
For details on the Group model, see [Group Model](./models/Group.md).