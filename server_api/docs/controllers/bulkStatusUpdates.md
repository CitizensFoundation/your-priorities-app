# API Routes: BulkStatusUpdate Router

This module defines API endpoints for managing **BulkStatusUpdate** resources within a community context. It provides CRUD operations, configuration updates, and actions such as performing bulk status updates and sending test notifications. All routes require appropriate authorization.

**Dependencies:**
- [models/index.cjs](../models/index.cjs): Sequelize models, including `BulkStatusUpdate`, `Community`, and `User`.
- [authorization.cjs](../authorization.cjs): Authorization middleware.
- [utils/logger.cjs](../utils/logger.cjs): Logging utility.
- [utils/to_json.cjs](../utils/to_json.cjs): Utility for serializing objects to JSON.
- [services/workers/queue.cjs](../services/workers/queue.cjs): Job queue for background processing.

---

## API Endpoint: GET /:communityId

Retrieve all **BulkStatusUpdate** records for a given community.

### Request

#### Parameters

| Name         | Type   | In   | Description                        | Required |
|--------------|--------|------|------------------------------------|----------|
| communityId  | string | path | ID of the community                | Yes      |

#### Headers

| Name           | Type   | Description                  | Required |
|----------------|--------|------------------------------|----------|
| Authorization  | string | Bearer token or session info | Yes      |

#### Body

_None_

### Response

#### Success (200)
```json
[
  {
    "id": 1,
    "name": "Bulk Update 1",
    "community_id": "123",
    "user_id": "456",
    // ...other BulkStatusUpdate fields
    "Community": {
      // Community fields
    }
  }
]
```
Returns an array of BulkStatusUpdate objects, each including the associated Community.

#### Error (404, 500)
```json
{
  "error": "Not found"
}
```
- 404: No BulkStatusUpdate found for the community.
- 500: Internal server error.

---

## API Endpoint: POST /:communityId

Create a new **BulkStatusUpdate** for a community.

### Request

#### Parameters

| Name         | Type   | In   | Description                        | Required |
|--------------|--------|------|------------------------------------|----------|
| communityId  | string | path | ID of the community                | Yes      |

#### Headers

| Name           | Type   | Description                  | Required |
|----------------|--------|------------------------------|----------|
| Authorization  | string | Bearer token or session info | Yes      |

#### Body
```json
{
  "name": "Spring Update",
  "emailHeader": "<h1>Header</h1>",
  "emailFooter": "<footer>Footer</footer>"
}
```
- `name` (string): Name of the bulk status update. **Required**
- `emailHeader` (string): Email header HTML/text. **Optional**
- `emailFooter` (string): Email footer HTML/text. **Optional**

### Response

#### Success (200)
```json
{
  "id": 1,
  "name": "Spring Update",
  "community_id": "123",
  "user_id": "456",
  "config": { /* config object */ },
  "templates": []
}
```
Returns the created BulkStatusUpdate object.

#### Error (500)
```json
{
  "error": "Error message"
}
```
- 500: Internal server error.

---

## API Endpoint: PUT /:communityId/:id/perform_bulk_status_update

Trigger the processing of a bulk status update (e.g., send notifications).

### Request

#### Parameters

| Name         | Type   | In   | Description                        | Required |
|--------------|--------|------|------------------------------------|----------|
| communityId  | string | path | ID of the community                | Yes      |
| id           | string | path | ID of the BulkStatusUpdate         | Yes      |

#### Headers

| Name           | Type   | Description                  | Required |
|----------------|--------|------------------------------|----------|
| Authorization  | string | Bearer token or session info | Yes      |

#### Body

_None_

### Response

#### Success (200)
```json
{}
```
- Triggers background processing. No content is returned on success.

#### Error (404, 500)
```json
{
  "error": "Not found"
}
```
- 404: BulkStatusUpdate not found.
- 500: Internal server error.

---

## API Endpoint: PUT /:id

Update the name of a **BulkStatusUpdate**.

### Request

#### Parameters

| Name         | Type   | In   | Description                        | Required |
|--------------|--------|------|------------------------------------|----------|
| id           | string | path | ID of the BulkStatusUpdate         | Yes      |

#### Headers

| Name           | Type   | Description                  | Required |
|----------------|--------|------------------------------|----------|
| Authorization  | string | Bearer token or session info | Yes      |

#### Body
```json
{
  "name": "Updated Name"
}
```
- `name` (string): New name for the BulkStatusUpdate. **Required**

### Response

#### Success (200)
```json
{
  "id": 1,
  "name": "Updated Name",
  // ...other fields
}
```
Returns the updated BulkStatusUpdate object.

#### Error (404, 500)
```json
{
  "error": "Not found"
}
```
- 404: BulkStatusUpdate not found.
- 500: Internal server error.

---

## API Endpoint: PUT /:id/sendTest

Send a test notification for a **BulkStatusUpdate**.

### Request

#### Parameters

| Name         | Type   | In   | Description                        | Required |
|--------------|--------|------|------------------------------------|----------|
| id           | string | path | ID of the BulkStatusUpdate         | Yes      |

#### Headers

| Name           | Type   | Description                  | Required |
|----------------|--------|------------------------------|----------|
| Authorization  | string | Bearer token or session info | Yes      |

#### Body

_None_

### Response

#### Success (200)
```json
{
  "id": 1,
  // ...other fields
}
```
Returns the BulkStatusUpdate object after sending the test.

#### Error (404, 500)
```json
{
  "error": "Not found"
}
```
- 404: BulkStatusUpdate not found.
- 500: Internal server error.

---

## API Endpoint: PUT /:communityId/:id/updateConfig

Update a configuration property of a **BulkStatusUpdate**.

### Request

#### Parameters

| Name         | Type   | In   | Description                        | Required |
|--------------|--------|------|------------------------------------|----------|
| communityId  | string | path | ID of the community                | Yes      |
| id           | string | path | ID of the BulkStatusUpdate         | Yes      |

#### Headers

| Name           | Type   | Description                  | Required |
|----------------|--------|------------------------------|----------|
| Authorization  | string | Bearer token or session info | Yes      |

#### Body
```json
{
  "configName": "someConfigKey",
  "configValue": "newValue"
}
```
- `configName` (string): Name of the config property to update. **Required**
- `configValue` (any): New value for the config property. **Required**

### Response

#### Success (200)
```json
{
  "id": 1,
  "config": {
    "someConfigKey": "newValue"
  }
  // ...other fields
}
```
Returns the updated BulkStatusUpdate object.

#### Error (404, 500)
```json
{
  "error": "Not found"
}
```
- 404: BulkStatusUpdate not found.
- 500: Internal server error.

---

## API Endpoint: DELETE /:communityId/:id

Soft-delete a **BulkStatusUpdate** (marks as deleted).

### Request

#### Parameters

| Name         | Type   | In   | Description                        | Required |
|--------------|--------|------|------------------------------------|----------|
| communityId  | string | path | ID of the community                | Yes      |
| id           | string | path | ID of the BulkStatusUpdate         | Yes      |

#### Headers

| Name           | Type   | Description                  | Required |
|----------------|--------|------------------------------|----------|
| Authorization  | string | Bearer token or session info | Yes      |

#### Body

_None_

### Response

#### Success (200)
No content. Returns HTTP 200 on successful deletion.

#### Error (404, 500)
```json
{
  "error": "Not found"
}
```
- 404: BulkStatusUpdate not found.
- 500: Internal server error.

---

# Utility Function: sendBulkStatusUpdateOrError

Handles sending a BulkStatusUpdate response or an error, with appropriate logging.

## Parameters

| Name             | Type     | Description                                      |
|------------------|----------|--------------------------------------------------|
| res              | Response | Express response object                          |
| bulkStatusUpdate | any      | The BulkStatusUpdate object or null              |
| context          | string   | Context string for logging                       |
| user             | any      | User object (requesting user)                    |
| error            | any      | Error object or message                          |
| errorStatus      | number   | HTTP status code for error (optional)            |

## Usage
Called internally by route handlers to standardize error/success responses and logging.

---

# Utility Function: getBulkStatusUpdateAndUser

Fetches a BulkStatusUpdate and (optionally) a User by their IDs in parallel.

## Parameters

| Name                | Type     | Description                                 |
|---------------------|----------|---------------------------------------------|
| bulkStatusUpdateId  | string   | ID of the BulkStatusUpdate                  |
| userId              | string   | ID of the User (optional)                   |
| callback            | function | Callback: (error, bulkStatusUpdate, user)   |

## Usage
Used for internal logic where both a BulkStatusUpdate and a User are needed.

---

# Middleware: auth.can(permission)

Authorization middleware that checks if the current user has the specified permission.

## Parameters

| Name       | Type     | Description                        |
|------------|----------|------------------------------------|
| permission | string   | Permission string (e.g., 'edit bulkStatusUpdate') |

## Usage
Applied to all routes to enforce access control.

---

# Model: BulkStatusUpdate

Represents a bulk status update operation for a community.

## Properties

| Name          | Type     | Description                        |
|---------------|----------|------------------------------------|
| id            | string   | Unique identifier                  |
| name          | string   | Name of the bulk status update     |
| community_id  | string   | Associated community ID            |
| user_id       | string   | ID of the user who created it      |
| config        | object   | Configuration object               |
| templates     | array    | Array of templates                 |
| deleted       | boolean  | Soft-delete flag                   |
| ...           | ...      | Other model fields                 |

See [models/BulkStatusUpdate](../models/index.cjs) for full schema.

---

# Service: queue.add

Adds a job to the background processing queue.

## Parameters

| Name       | Type     | Description                        |
|------------|----------|------------------------------------|
| jobName    | string   | Name of the job (e.g., 'process-notification-delivery') |
| payload    | object   | Data to pass to the job            |
| priority   | string   | Job priority (e.g., 'high')        |

## Usage
Used to trigger background processing for bulk status updates.

---

# Exported Router

This module exports an Express Router with all the above endpoints for use in the main application.

---

**See also:**
- [Authorization Middleware](../authorization.cjs)
- [BulkStatusUpdate Model](../models/index.cjs)
- [Logger Utility](../utils/logger.cjs)
- [Queue Service](../services/workers/queue.cjs)
