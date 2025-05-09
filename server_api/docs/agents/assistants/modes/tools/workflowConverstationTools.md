# Service Module: WorkflowConversationTools

The `WorkflowConversationTools` class provides a set of assistant tools for managing and interacting with workflow conversations. It extends the [BaseAssistantTools](./baseTools.md) class and is designed to be used with a [YpAgentAssistant](../../agentAssistant.md) instance. The tools include displaying running or all workflow conversations and connecting to a specific workflow conversation.

---

## Class: WorkflowConversationTools

Extends: [BaseAssistantTools](./baseTools.md)

### Constructor

#### new WorkflowConversationTools(assistant: YpAgentAssistant)

| Name      | Type             | Description                                 |
|-----------|------------------|---------------------------------------------|
| assistant | YpAgentAssistant | The assistant instance to bind the tools to |

---

## Exported Tool Properties

### show_running_workflow_conversations

Displays currently running workflow conversations.

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| name        | string   | "show_running_workflow_conversations"       |
| description | string   | Display running workflow conversations      |
| type        | string   | "function"                                  |
| parameters  | object   | No parameters required                      |
| handler     | function | Bound to `showRunningWorkflowsHandler`      |

#### Parameters

None.

#### Handler

- [showRunningWorkflowsHandler](#showrunningworkflowshandlerparams--promise-toolexecutionresult)

---

### show_all_workflow_conversations

Displays all workflow conversations.

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| name        | string   | "show_all_workflow_conversations"           |
| description | string   | Display all workflow conversations          |
| type        | string   | "function"                                  |
| parameters  | object   | No parameters required                      |
| handler     | function | Bound to `showAllWorkflowsHandler`          |

#### Parameters

None.

#### Handler

- [showAllWorkflowsHandler](#showallworkflowshandlerparams--promise-toolexecutionresult)

---

### connect_to_workflow_conversation

Connects to an existing workflow conversation.

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| name        | string   | "connect_to_workflow_conversation"          |
| description | string   | Connect to an existing workflow conversation|
| type        | string   | "function"                                  |
| parameters  | object   | Requires `workflowId` (number)              |
| handler     | function | Bound to `connectToWorkflowHandler`         |

#### Parameters

| Name       | Type   | Description                        | Required |
|------------|--------|------------------------------------|----------|
| workflowId | number | The ID of the workflow to connect  | Yes      |

#### Handler

- [connectToWorkflowHandler](#connecttoworkflowhandlerparams--workflowid-number---promise-toolexecutionresult)

---

## Methods

### showRunningWorkflowsHandler(params: {}): Promise<ToolExecutionResult>

Handler for displaying running workflow conversations. Returns an HTML widget and a success message.

#### Parameters

| Name   | Type | Description                |
|--------|------|----------------------------|
| params | {}   | No parameters are required |

#### Returns

- `Promise<ToolExecutionResult>`

#### Success Response

```json
{
  "success": true,
  "html": "<yp-workflow-widget-small running=\"true\"></yp-workflow-widget-small>",
  "uniqueToken": "runningWorkflows",
  "data": { "message": "Running workflows displayed successfully" },
  "metadata": { "timestamp": "2024-06-01T12:00:00.000Z" }
}
```

#### Error Response

```json
{
  "success": false,
  "error": "Error displaying running workflows"
}
```

---

### showAllWorkflowsHandler(params: {}): Promise<ToolExecutionResult>

Handler for displaying all workflow conversations. Returns an HTML widget and a success message.

#### Parameters

| Name   | Type | Description                |
|--------|------|----------------------------|
| params | {}   | No parameters are required |

#### Returns

- `Promise<ToolExecutionResult>`

#### Success Response

```json
{
  "success": true,
  "html": "<yp-workflow-widget-small all=\"true\"></yp-workflow-widget-small>",
  "uniqueToken": "allWorkflows",
  "data": { "message": "All workflows displayed successfully" },
  "metadata": { "timestamp": "2024-06-01T12:00:00.000Z" }
}
```

#### Error Response

```json
{
  "success": false,
  "error": "Error displaying all workflows"
}
```

---

### connectToWorkflowHandler(params: { workflowId: number }): Promise<ToolExecutionResult>

Handler for connecting to a specific workflow conversation.

#### Parameters

| Name       | Type   | Description                        |
|------------|--------|------------------------------------|
| workflowId | number | The ID of the workflow to connect  |

#### Returns

- `Promise<ToolExecutionResult>`

#### Success Response

```json
{
  "success": true,
  "data": { "message": "Connected to workflow 123 successfully" },
  "uniqueToken": "connectWorkflow_123",
  "metadata": { "timestamp": "2024-06-01T12:00:00.000Z" }
}
```

#### Error Response

```json
{
  "success": false,
  "error": "Error connecting to workflow conversation"
}
```

---

## Dependencies

- [YpAgentAssistant](../../agentAssistant.md): The assistant instance used for parameter cleaning and context.
- [BaseAssistantTools](./baseTools.md): The base class for assistant tools.
- `YpAgentEmptyProperties`: Type for empty parameter objects (imported or defined elsewhere).
- `ToolExecutionResult`: The expected return type for tool handlers (imported or defined elsewhere).

---

## Example Usage

```typescript
import { YpAgentAssistant } from "../../agentAssistant.js";
import { WorkflowConversationTools } from "./workflowConversationTools.js";

const assistant = new YpAgentAssistant(/* ... */);
const tools = new WorkflowConversationTools(assistant);

// Use as part of an assistant toolset
const runningWorkflowsTool = tools.show_running_workflow_conversations;
const allWorkflowsTool = tools.show_all_workflow_conversations;
const connectTool = tools.connect_to_workflow_conversation;
```

---

## See Also

- [YpAgentAssistant](../../agentAssistant.md)
- [BaseAssistantTools](./baseTools.md)
- [ToolExecutionResult](#) (define or link to the type definition)
- [YpAgentEmptyProperties](#) (define or link to the type definition)
