# Controller: AgentProductController

The `AgentProductController` class defines RESTful API endpoints for managing agent products. It handles CRUD operations, as well as fetching runs and status for a specific agent product. The controller uses [AgentProductManager](../managers/agentProductManager.md) for business logic and data access, and applies authorization middleware for access control.

## Routes

### API Endpoint: GET /api/agent-products
Retrieve a list of agent products, optionally filtered by query parameters.

#### Request

##### Parameters

| Name   | Type   | In    | Description                  | Required |
|--------|--------|-------|------------------------------|----------|
| (various query params) | string | query | Filtering options (e.g., by user, status, etc.) | No       |

##### Headers

| Name           | Type   | Description                | Required |
|----------------|--------|----------------------------|----------|
| Authorization  | string | Bearer token for auth      | Yes      |

##### Body

_None_

#### Response

##### Success (200)
```json
[
  {
    "id": 1,
    "name": "Agent Product 1",
    // ...other properties
  }
]
```
Returns an array of agent product objects.

##### Error (500)
```json
{
  "error": "Error message"
}
```
Internal server error.

---

### API Endpoint: GET /api/agent-products/:agentProductId
Retrieve a single agent product by its ID.

#### Request

##### Parameters

| Name            | Type   | In   | Description                | Required |
|-----------------|--------|------|----------------------------|----------|
| agentProductId  | number | path | ID of the agent product    | Yes      |

##### Headers

| Name           | Type   | Description                | Required |
|----------------|--------|----------------------------|----------|
| Authorization  | string | Bearer token for auth      | Yes      |

##### Body

_None_

#### Response

##### Success (200)
```json
{
  "id": 1,
  "name": "Agent Product 1",
  // ...other properties
}
```
Returns the agent product object.

##### Error (404)
```json
{
  "error": "Agent product not found"
}
```
Agent product with the given ID does not exist.

##### Error (500)
```json
{
  "error": "Error message"
}
```
Internal server error.

---

### API Endpoint: POST /api/agent-products
Create a new agent product.

#### Request

##### Parameters

_None_

##### Headers

| Name           | Type   | Description                | Required |
|----------------|--------|----------------------------|----------|
| Authorization  | string | Bearer token for auth      | Yes      |

##### Body
```json
{
  "name": "New Agent Product",
  // ...other properties
}
```
- `name`: `string` (required) — Name of the agent product.
- Other properties as required by the business logic.
- The `user_id` is automatically set from the authenticated user.

#### Response

##### Success (201)
```json
{
  "id": 2,
  "name": "New Agent Product",
  // ...other properties
}
```
Returns the created agent product object.

##### Error (500)
```json
{
  "error": "Error message"
}
```
Internal server error.

---

### API Endpoint: PUT /api/agent-products/:agentProductId
Update an existing agent product.

#### Request

##### Parameters

| Name            | Type   | In   | Description                | Required |
|-----------------|--------|------|----------------------------|----------|
| agentProductId  | number | path | ID of the agent product    | Yes      |

##### Headers

| Name           | Type   | Description                | Required |
|----------------|--------|----------------------------|----------|
| Authorization  | string | Bearer token for auth      | Yes      |

##### Body
```json
{
  "name": "Updated Name",
  // ...other updatable properties
}
```
- Properties to update for the agent product.

#### Response

##### Success (200)
```json
{
  "id": 1,
  "name": "Updated Name",
  // ...other properties
}
```
Returns the updated agent product object.

##### Error (500)
```json
{
  "error": "Error message"
}
```
Internal server error.

---

### API Endpoint: DELETE /api/agent-products/:agentProductId
Delete an agent product by its ID.

#### Request

##### Parameters

| Name            | Type   | In   | Description                | Required |
|-----------------|--------|------|----------------------------|----------|
| agentProductId  | number | path | ID of the agent product    | Yes      |

##### Headers

| Name           | Type   | Description                | Required |
|----------------|--------|----------------------------|----------|
| Authorization  | string | Bearer token for auth      | Yes      |

##### Body

_None_

#### Response

##### Success (200)
```json
{
  "message": "Agent product deleted successfully"
}
```
Confirmation message.

##### Error (500)
```json
{
  "error": "Error message"
}
```
Internal server error.

---

### API Endpoint: GET /api/agent-products/:agentProductId/runs
Get all runs for a specific agent product.

#### Request

##### Parameters

| Name            | Type   | In   | Description                | Required |
|-----------------|--------|------|----------------------------|----------|
| agentProductId  | number | path | ID of the agent product    | Yes      |

##### Headers

| Name           | Type   | Description                | Required |
|----------------|--------|----------------------------|----------|
| Authorization  | string | Bearer token for auth      | Yes      |

##### Body

_None_

#### Response

##### Success (200)
```json
[
  {
    "id": 1,
    "status": "completed",
    // ...other properties
  }
]
```
Returns an array of run objects for the agent product.

##### Error (500)
```json
{
  "error": "Error message"
}
```
Internal server error.

---

### API Endpoint: GET /api/agent-products/:agentProductId/status
Get the status of a specific agent product.

#### Request

##### Parameters

| Name            | Type   | In   | Description                | Required |
|-----------------|--------|------|----------------------------|----------|
| agentProductId  | number | path | ID of the agent product    | Yes      |

##### Headers

| Name           | Type   | Description                | Required |
|----------------|--------|----------------------------|----------|
| Authorization  | string | Bearer token for auth      | Yes      |

##### Body

_None_

#### Response

##### Success (200)
```json
{
  "status": "active"
}
```
Returns the status of the agent product.

##### Error (500)
```json
{
  "error": "Error message"
}
```
Internal server error.

---

## Middleware

All routes use the `auth.can(permission)` middleware for authorization.  
See [authorization.cjs](../../authorization.cjs) for details.

| Permission                | Description                        |
|---------------------------|------------------------------------|
| view agent products       | Allows viewing agent products      |
| create agent products     | Allows creating agent products     |
| edit agent products       | Allows editing agent products      |
| delete agent products     | Allows deleting agent products     |

---

## Controller Methods

| Method Name                | Description                                                                                  | Services Used                        |
|----------------------------|----------------------------------------------------------------------------------------------|--------------------------------------|
| getAgentProducts           | Fetches a list of agent products, optionally filtered by query params.                       | AgentProductManager.getAgentProducts |
| getAgentProduct            | Fetches a single agent product by ID.                                                        | AgentProductManager.getAgentProduct  |
| createAgentProduct         | Creates a new agent product, associating it with the authenticated user.                     | AgentProductManager.createAgentProduct|
| updateAgentProduct         | Updates an existing agent product by ID.                                                     | AgentProductManager.updateAgentProduct|
| deleteAgentProduct         | Deletes an agent product by ID.                                                              | AgentProductManager.deleteAgentProduct|
| getAgentProductRuns        | Fetches all runs for a specific agent product.                                               | AgentProductManager.getAgentProductRuns|
| getAgentProductStatus      | Fetches the status of a specific agent product.                                              | AgentProductManager.getAgentProductStatus|

---

## Dependencies

- [AgentProductManager](../managers/agentProductManager.md): Handles business logic and data access for agent products.
- [auth](../../authorization.cjs): Authorization middleware for permission checks.

---

## Custom Request Interface

The controller uses a custom request interface `YpRequest` extending `express.Request` with additional optional properties:

| Name         | Type   | Description                        |
|--------------|--------|------------------------------------|
| ypDomain     | any    | Domain context (if applicable)     |
| ypCommunity  | any    | Community context (if applicable)  |
| sso          | any    | SSO context (if applicable)        |
| redisClient  | any    | Redis client instance (if used)    |
| user         | any    | Authenticated user object          |

---

## Example Usage

```typescript
import { AgentProductController } from './controllers/AgentProductController';

const agentProductController = new AgentProductController();
app.use(agentProductController.path, agentProductController.router);
```

---

## See Also

- [AgentProductManager](../managers/agentProductManager.md)
- [authorization.cjs](../../authorization.cjs)
- [Express.js Request Object](https://expressjs.com/en/api.html#req)
