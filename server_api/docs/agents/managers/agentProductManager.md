# Service: AgentProductManager

The `AgentProductManager` class provides business logic for managing agent products, including CRUD operations, retrieving associated runs, and querying status. It interacts with the following models:

- [YpAgentProduct](../models/agentProduct.md)
- [YpSubscriptionPlan](../models/subscriptionPlan.md)
- [YpAgentProductRun](../models/agentProductRun.md)

It uses Sequelize for database operations.

---

## Methods

| Name                      | Parameters                                                                 | Return Type                | Description                                                                                 |
|---------------------------|----------------------------------------------------------------------------|----------------------------|---------------------------------------------------------------------------------------------|
| getAgentProducts          | filters?: any                                                              | Promise<YpAgentProduct[]>  | Retrieves all agent products, optionally filtered by the provided criteria.                  |
| getAgentProduct           | agentProductId: number                                                     | Promise<YpAgentProduct\| null> | Retrieves a specific agent product by its ID.                                               |
| createAgentProduct        | data: any                                                                  | Promise<YpAgentProduct>    | Creates a new agent product with the provided data.                                          |
| updateAgentProduct        | agentProductId: number, updates: any                                       | Promise<YpAgentProduct>    | Updates an existing agent product with the given updates.                                    |
| deleteAgentProduct        | agentProductId: number                                                     | Promise<void>              | Deletes an agent product by its ID.                                                          |
| getAgentProductRuns       | agentProductId: number                                                     | Promise<YpAgentProductRun[]> | Retrieves all runs associated with a specific agent product.                                 |
| getAgentProductStatus     | agentProductId: number                                                     | Promise<any>               | Retrieves the status of a specific agent product.                                            |

---

### Method Details

---

#### getAgentProducts

Retrieves all agent products, optionally filtered by the provided criteria.

**Parameters**

| Name    | Type | Description                |
|---------|------|----------------------------|
| filters | any  | (Optional) Filter criteria |

**Returns:** `Promise<YpAgentProduct[]>`  
A promise that resolves to an array of agent products.

**Throws:**  
Error if fetching agent products fails.

---

#### getAgentProduct

Retrieves a specific agent product by its ID.

**Parameters**

| Name           | Type   | Description                |
|----------------|--------|----------------------------|
| agentProductId | number | The ID of the agent product|

**Returns:** `Promise<YpAgentProduct | null>`  
A promise that resolves to the agent product or `null` if not found.

**Throws:**  
Error if fetching the agent product fails.

---

#### createAgentProduct

Creates a new agent product with the provided data.

**Parameters**

| Name | Type | Description                |
|------|------|----------------------------|
| data | any  | Data for the new product   |

**Returns:** `Promise<YpAgentProduct>`  
A promise that resolves to the created agent product.

**Throws:**  
Error if creation fails.

---

#### updateAgentProduct

Updates an existing agent product with the given updates.

**Parameters**

| Name           | Type   | Description                        |
|----------------|--------|------------------------------------|
| agentProductId | number | The ID of the agent product        |
| updates        | any    | Fields to update                   |

**Returns:** `Promise<YpAgentProduct>`  
A promise that resolves to the updated agent product.

**Throws:**  
Error if the agent product is not found or update fails.

---

#### deleteAgentProduct

Deletes an agent product by its ID.

**Parameters**

| Name           | Type   | Description                |
|----------------|--------|----------------------------|
| agentProductId | number | The ID of the agent product|

**Returns:** `Promise<void>`  
A promise that resolves when deletion is complete.

**Throws:**  
Error if the agent product is not found or deletion fails.

---

#### getAgentProductRuns

Retrieves all runs associated with a specific agent product.

**Parameters**

| Name           | Type   | Description                |
|----------------|--------|----------------------------|
| agentProductId | number | The ID of the agent product|

**Returns:** `Promise<YpAgentProductRun[]>`  
A promise that resolves to an array of agent product runs.

**Throws:**  
Error if fetching runs fails.

---

#### getAgentProductStatus

Retrieves the status of a specific agent product.

**Parameters**

| Name           | Type   | Description                |
|----------------|--------|----------------------------|
| agentProductId | number | The ID of the agent product|

**Returns:** `Promise<any>`  
A promise that resolves to the status of the agent product.

**Throws:**  
Error if the agent product is not found or fetching status fails.

---

## Example Usage

```typescript
import { AgentProductManager } from './AgentProductManager';

const manager = new AgentProductManager();

// Get all agent products
const products = await manager.getAgentProducts();

// Get a specific agent product
const product = await manager.getAgentProduct(1);

// Create a new agent product
const newProduct = await manager.createAgentProduct({ name: 'New Product', ... });

// Update an agent product
const updatedProduct = await manager.updateAgentProduct(1, { name: 'Updated Name' });

// Delete an agent product
await manager.deleteAgentProduct(1);

// Get runs for an agent product
const runs = await manager.getAgentProductRuns(1);

// Get status of an agent product
const status = await manager.getAgentProductStatus(1);
```

---

## Related Models

- [YpAgentProduct](../models/agentProduct.md)
- [YpSubscriptionPlan](../models/subscriptionPlan.md)
- [YpAgentProductRun](../models/agentProductRun.md)

---

## Dependencies

- [sequelize](https://sequelize.org/) (imported from `@policysynth/agents/dbModels/sequelize.js`)