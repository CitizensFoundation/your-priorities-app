# Controller: AgentSubscriptionController

The `AgentSubscriptionController` class manages all API endpoints related to agent subscriptions, including subscription creation, management, payment integration (Stripe), and agent run control. It wires up routes for both public and secure (permission-checked) access, and interacts with the [SubscriptionManager](./../managers/subscriptionManager.md), [YpSubscription](./../models/subscription.md), and Stripe APIs.

## Constructor

```typescript
constructor(wsClients: Map<string, WebSocket>)
```
- **wsClients**: `Map<string, WebSocket>`  
  A map of WebSocket client connections, used for real-time agent run updates.

---

## Properties

| Name                | Type                        | Description                                      |
|---------------------|-----------------------------|--------------------------------------------------|
| path                | `string`                    | Base path for all subscription-related endpoints. |
| router              | `express.Router`            | Express router instance.                         |
| subscriptionManager | `SubscriptionManager`       | Handles business logic for subscriptions.        |
| wsClients           | `Map<string, WebSocket>`    | WebSocket clients for agent run updates.         |

---

## Routes

### Public and Secure Route Initialization

- `initializeRoutes()`: Sets up routes, some without authentication.
- `initializeRoutesSecure()`: Sets up routes with permission checks using `auth.can()` middleware.

---

# API Endpoints

## [GET] /api/subscriptions/plans

Retrieve available subscription plans.

### Request

_No parameters or body required._

### Response

#### Success (200)
```json
[
  {
    "id": 1,
    "name": "Basic",
    "price": 10
  }
]
```
Array of plan objects.

#### Error (500)
```json
{ "error": "Error message" }
```

---

## [POST] /api/subscriptions

Create a new subscription (free trial only).

### Request

#### Body
```json
{
  "planIds": [1, 2],
  "isFreeTrialRequest": true
}
```
- `planIds`: `number[]` (required) – IDs of plans to subscribe to.
- `isFreeTrialRequest`: `boolean` (required) – Must be `true` for this endpoint.

#### Headers

| Name           | Type   | Description         | Required |
|----------------|--------|---------------------|----------|
| Authorization  | string | Bearer token        | Yes      |

### Response

#### Success (201)
```json
{
  "subscriptionId": 123,
  "message": "Free trial subscription created successfully"
}
```

#### Error (400/500)
```json
{ "error": "Error message" }
```

---

## [POST] /api/subscriptions/stripe-create-payment-intent

Create a Stripe payment intent for a paid subscription.

### Request

#### Body
```json
{
  "planIds": [1, 2],
  "paymentMethodId": "pm_123"
}
```
- `planIds`: `number[]` (required)
- `paymentMethodId`: `string` (required)

#### Headers

| Name           | Type   | Description         | Required |
|----------------|--------|---------------------|----------|
| Authorization  | string | Bearer token        | Yes      |

### Response

#### Success (200)
```json
{
  "clientSecret": "stripe_client_secret",
  "subscriptionId": 123
}
```

#### Error (400/500)
```json
{ "error": "Error message" }
```

---

## [POST] /api/subscriptions/stripe-webhook

Stripe webhook endpoint for payment events.

### Request

#### Headers

| Name                | Type   | Description                | Required |
|---------------------|--------|----------------------------|----------|
| stripe-signature    | string | Stripe webhook signature   | Yes      |

#### Body

Raw Stripe event payload (application/json).

### Response

#### Success (200)
```json
{ "received": true }
```

#### Error (400)
```json
{ "error": "Error message" }
```

---

## [GET] /api/subscriptions

Get all subscriptions for the authenticated user.

### Request

#### Headers

| Name           | Type   | Description         | Required |
|----------------|--------|---------------------|----------|
| Authorization  | string | Bearer token        | Yes      |

### Response

#### Success (200)
```json
[
  {
    "id": 1,
    "user_id": 42,
    "status": "active",
    ...
  }
]
```
Array of subscription objects.

#### Error (500)
```json
{ "error": "Error message" }
```

---

## [DELETE] /api/subscriptions/:subscriptionId

Cancel a subscription.

### Request

#### Parameters

| Name            | Type   | In   | Description                | Required |
|-----------------|--------|------|----------------------------|----------|
| subscriptionId  | number | path | ID of the subscription     | Yes      |

#### Headers

| Name           | Type   | Description         | Required |
|----------------|--------|---------------------|----------|
| Authorization  | string | Bearer token        | Yes      |

### Response

#### Success (200)
```json
{ "message": "Subscription cancelled successfully" }
```

#### Error (404/500)
```json
{ "error": "Error message" }
```

---

## [PUT] /api/subscriptions/:subscriptionId

Update a subscription.

### Request

#### Parameters

| Name            | Type   | In   | Description                | Required |
|-----------------|--------|------|----------------------------|----------|
| subscriptionId  | number | path | ID of the subscription     | Yes      |

#### Body

```json
{
  "status": "active"
}
```
Any updatable fields of the subscription.

#### Headers

| Name           | Type   | Description         | Required |
|----------------|--------|---------------------|----------|
| Authorization  | string | Bearer token        | Yes      |

### Response

#### Success (200)
```json
{
  "id": 1,
  "user_id": 42,
  "status": "active",
  ...
}
```
Updated subscription object.

#### Error (404/500)
```json
{ "error": "Error message" }
```

---

## [PUT] /api/subscriptions/:subscriptionId/updateAgentConfiguration

Update the agent configuration for a subscription.

### Request

#### Parameters

| Name            | Type   | In   | Description                | Required |
|-----------------|--------|------|----------------------------|----------|
| subscriptionId  | number | path | ID of the subscription     | Yes      |

#### Body

```json
{
  "requiredQuestionsAnswered": "[{\"questionId\":1,\"answer\":\"foo\"}]"
}
```
- `requiredQuestionsAnswered`: `string` (JSON stringified array, required)

#### Headers

| Name           | Type   | Description         | Required |
|----------------|--------|---------------------|----------|
| Authorization  | string | Bearer token        | Yes      |

### Response

#### Success (200)
_No content (empty response)._

#### Error (400/404/500)
```json
{ "error": "Error message" }
```

---

## [GET] /api/subscriptions/:subscriptionId/getConfigurationAnswers

Get the agent configuration answers for a subscription.

### Request

#### Parameters

| Name            | Type   | In   | Description                | Required |
|-----------------|--------|------|----------------------------|----------|
| subscriptionId  | number | path | ID of the subscription     | Yes      |

#### Headers

| Name           | Type   | Description         | Required |
|----------------|--------|---------------------|----------|
| Authorization  | string | Bearer token        | Yes      |

### Response

#### Success (200)
```json
{
  "success": true,
  "data": [
    { "questionId": 1, "answer": "foo" }
  ]
}
```

#### Error (401/404/500)
```json
{ "error": "Error message" }
```

---

## [POST] /api/subscriptions/:subscriptionId/start

Start an agent run for a subscription.

### Request

#### Parameters

| Name            | Type   | In   | Description                | Required |
|-----------------|--------|------|----------------------------|----------|
| subscriptionId  | number | path | ID of the subscription     | Yes      |

#### Body

```json
{
  "agentProductId": 1,
  "wsClientId": "client-uuid"
}
```
- `agentProductId`: `number` (required)
- `wsClientId`: `string` (required)

#### Headers

| Name           | Type   | Description         | Required |
|----------------|--------|---------------------|----------|
| Authorization  | string | Bearer token        | Yes      |

### Response

#### Success (201)
```json
{
  "agentRun": { ... },
  "subscription": { ... }
}
```

#### Error (500)
```json
{ "error": "Error message" }
```

---

## [POST] /api/subscriptions/:subscriptionId/stop

Stop an agent run for a subscription.

### Request

#### Parameters

| Name            | Type   | In   | Description                | Required |
|-----------------|--------|------|----------------------------|----------|
| subscriptionId  | number | path | ID of the subscription     | Yes      |

#### Body

```json
{
  "agentProductRunId": 1
}
```
- `agentProductRunId`: `number` (required)

#### Headers

| Name           | Type   | Description         | Required |
|----------------|--------|---------------------|----------|
| Authorization  | string | Bearer token        | Yes      |

### Response

#### Success (200)
```json
{ "message": "Agent run stopped successfully" }
```

#### Error (500)
```json
{ "error": "Error message" }
```

---

# Controller Methods

## getPlans

Retrieves available subscription plans.

## createSubscriptions

Creates a new subscription (free trial only).

## createPaymentIntent

Creates a Stripe payment intent for a paid subscription.

## handleWebhook

Handles Stripe webhook events for payment status.

## getSubscriptions

Retrieves all subscriptions for the authenticated user.

## cancelSubscription

Cancels a subscription.

## updateSubscription

Updates a subscription.

## updateAgentConfiguration

Updates the agent configuration for a subscription.

## getAgentConfigurationAnswers

Retrieves the agent configuration answers for a subscription.

## startAgentRun

Starts an agent run for a subscription.

## stopAgentRun

Stops an agent run for a subscription.

---

# Related Modules

- [SubscriptionManager](./../managers/subscriptionManager.md): Handles business logic for subscriptions.
- [YpSubscription](./../models/subscription.md): Sequelize model for subscriptions.
- [auth](../../authorization.md): Authorization middleware.
- [NotificationAgentQueueManager](./../managers/notificationAgentQueueManager.md): Manages notification agent queues.

---

# Types

## YpRequest

Custom Express request interface with additional properties.

| Name         | Type   | Description                        |
|--------------|--------|------------------------------------|
| ypDomain     | any    | Domain context                     |
| ypCommunity  | any    | Community context                  |
| sso          | any    | SSO context                        |
| redisClient  | any    | Redis client instance              |
| user         | any    | Authenticated user object          |

---

# Usage Example

```typescript
import { AgentSubscriptionController } from './controllers/SubscriptionController';
import ws from 'ws';

const wsClients = new Map<string, ws>();
const controller = new AgentSubscriptionController(wsClients);

app.use(controller.path, controller.router);
```

---

# See Also

- [SubscriptionManager](./../managers/subscriptionManager.md)
- [YpSubscription](./../models/subscription.md)
- [auth Middleware](../../authorization.md)
- [Stripe API](https://stripe.com/docs/api)
