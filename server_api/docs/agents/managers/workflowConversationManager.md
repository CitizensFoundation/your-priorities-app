# Service: WorkflowConversationManager

The `WorkflowConversationManager` class provides business logic for managing workflow conversations. It interacts with the [YpWorkflowConversation](../models/workflowConversation.md) model to create, retrieve, update, and connect workflow conversations, as well as to fetch conversations for a specific user.

## Methods

| Name                                      | Parameters                                                                                      | Return Type                        | Description                                                                                      |
|------------------------------------------- |----------------------------------------------------------------------------------------------- |------------------------------------|--------------------------------------------------------------------------------------------------|
| createWorkflowConversation                | data: { agentProductId: number; userId?: number; configuration?: Record<string, any> }         | Promise&lt;YpWorkflowConversation&gt; | Creates a new workflow conversation with the specified agent product, user, and configuration.   |
| getWorkflowConversation                   | workflowConversationId: number                                                                 | Promise&lt;YpWorkflowConversation \| null&gt; | Retrieves a workflow conversation by its ID.                                                     |
| updateWorkflowConversation                | workflowConversationId: number, updates: Record<string, any>                                   | Promise&lt;YpWorkflowConversation&gt; | Updates an existing workflow conversation with the provided updates.                              |
| connectToWorkflowConversation             | workflowConversationId: number, connectionData: Record<string, any>                            | Promise&lt;YpWorkflowConversation&gt; | Merges connection data into the workflow conversation's configuration.                            |
| getWorkflowConversationsForUser           | userId: number                                                                                 | Promise&lt;YpWorkflowConversation[]&gt; | Retrieves all workflow conversations for a given user.                                           |
| getRunningWorkflowConversationsForUser    | userId: number                                                                                 | Promise&lt;YpWorkflowConversation[]&gt; | Retrieves all running workflow conversations (where `configuration.running === true`) for a user. |

---

## Method Details

### createWorkflowConversation

Creates a new workflow conversation.

#### Parameters

| Name            | Type                          | Description                                      |
|-----------------|------------------------------|--------------------------------------------------|
| data            | { agentProductId: number;<br>userId?: number;<br>configuration?: Record<string, any> } | Data for the new workflow conversation.          |

- `agentProductId` (`number`): The ID of the agent product associated with the workflow.
- `userId` (`number`, optional): The ID of the user who owns the workflow conversation.
- `configuration` (`Record<string, any>`, optional): Additional configuration for the workflow conversation.

#### Returns

- `Promise<YpWorkflowConversation>`: The created workflow conversation instance.

#### Throws

- `Error` if creation fails.

---

### getWorkflowConversation

Retrieves a workflow conversation by its ID.

#### Parameters

| Name                   | Type    | Description                                 |
|------------------------|---------|---------------------------------------------|
| workflowConversationId | number  | The ID of the workflow conversation to fetch.|

#### Returns

- `Promise<YpWorkflowConversation | null>`: The workflow conversation instance, or `null` if not found.

#### Throws

- `Error` if retrieval fails.

---

### updateWorkflowConversation

Updates an existing workflow conversation.

#### Parameters

| Name                   | Type                | Description                                 |
|------------------------|---------------------|---------------------------------------------|
| workflowConversationId | number              | The ID of the workflow conversation to update. |
| updates                | Record<string, any> | The fields and values to update.            |

#### Returns

- `Promise<YpWorkflowConversation>`: The updated workflow conversation instance.

#### Throws

- `Error` if the workflow conversation is not found or update fails.

---

### connectToWorkflowConversation

Merges connection data into the workflow conversation's configuration.

#### Parameters

| Name                   | Type                | Description                                 |
|------------------------|---------------------|---------------------------------------------|
| workflowConversationId | number              | The ID of the workflow conversation to connect to. |
| connectionData         | Record<string, any> | Data to merge into the configuration.       |

#### Returns

- `Promise<YpWorkflowConversation>`: The updated workflow conversation instance.

#### Throws

- `Error` if the workflow conversation is not found or update fails.

---

### getWorkflowConversationsForUser

Retrieves all workflow conversations for a specific user.

#### Parameters

| Name   | Type   | Description                  |
|--------|--------|------------------------------|
| userId | number | The ID of the user.          |

#### Returns

- `Promise<YpWorkflowConversation[]>`: Array of workflow conversations for the user.

#### Throws

- `Error` if retrieval fails.

---

### getRunningWorkflowConversationsForUser

Retrieves all running workflow conversations for a specific user. A conversation is considered "running" if its `configuration.running` property is `true`.

#### Parameters

| Name   | Type   | Description                  |
|--------|--------|------------------------------|
| userId | number | The ID of the user.          |

#### Returns

- `Promise<YpWorkflowConversation[]>`: Array of running workflow conversations for the user.

#### Throws

- `Error` if retrieval fails.

---

## Dependencies

- [YpWorkflowConversation](../models/workflowConversation.md): The Sequelize model representing workflow conversations.

---

## Example Usage

```typescript
import { WorkflowConversationManager } from './services/WorkflowConversationManager';

const manager = new WorkflowConversationManager();

// Create a new workflow conversation
const conversation = await manager.createWorkflowConversation({
  agentProductId: 123,
  userId: 456,
  configuration: { running: true }
});

// Get a workflow conversation by ID
const fetched = await manager.getWorkflowConversation(conversation.id);

// Update a workflow conversation
const updated = await manager.updateWorkflowConversation(conversation.id, { configuration: { running: false } });

// Connect to a workflow conversation
const connected = await manager.connectToWorkflowConversation(conversation.id, { lastConnected: Date.now() });

// Get all conversations for a user
const allForUser = await manager.getWorkflowConversationsForUser(456);

// Get all running conversations for a user
const runningForUser = await manager.getRunningWorkflowConversationsForUser(456);
```

---

## See Also

- [YpWorkflowConversation Model](../models/workflowConversation.md)
- [Sequelize Documentation](https://sequelize.org/)