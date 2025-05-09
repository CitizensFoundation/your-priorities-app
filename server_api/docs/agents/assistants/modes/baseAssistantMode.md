# Class: BaseAssistantMode

The `BaseAssistantMode` class provides a foundational abstraction for managing and rendering the state of an agent assistant's workflow and run status. It is designed to be extended by specific assistant modes and interacts closely with the [YpAgentAssistant](./agentAssistant.md) class. The class includes utility methods for rendering simplified representations of workflow steps, workflows, and agent runs, as well as a method for rendering common state information.

---

## Constructor

### `constructor(assistant: YpAgentAssistant)`

Initializes a new instance of the `BaseAssistantMode` class.

| Name      | Type               | Description                                 |
|-----------|--------------------|---------------------------------------------|
| assistant | YpAgentAssistant   | The assistant instance to operate on.       |

---

## Properties

| Name     | Type               | Description                                 |
|----------|--------------------|---------------------------------------------|
| assistant| YpAgentAssistant   | The assistant instance provided in the constructor. |
| memory   | any                | Proxy to `assistant.memory`. Used for accessing the assistant's memory state. (Protected getter) |

---

## Methods

### `renderSimplifiedWorkflowStep(step: YpAgentRunWorkflowStep | undefined): string`

Renders a simplified string representation of a workflow step.

| Name | Type                          | Description                        |
|------|-------------------------------|------------------------------------|
| step | YpAgentRunWorkflowStep \| undefined | The workflow step to render.       |

**Returns:** `string`  
A string representation of the workflow step, or an empty string if `step` is undefined.

---

### `renderSimplifiedWorkflow(workflow: YpAgentRunWorkflowConfiguration): string`

Renders a simplified string representation of an entire workflow, including all steps and the current step index.

| Name     | Type                                 | Description                |
|----------|--------------------------------------|----------------------------|
| workflow | YpAgentRunWorkflowConfiguration      | The workflow configuration to render. |

**Returns:** `string`  
A string representation of the workflow.

---

### `renderSimplifiedAgentRun(agentRun: YpAgentProductRunAttributes | undefined): string`

Renders a simplified string representation of an agent run, including status, start time, and workflow.

| Name     | Type                                 | Description                |
|----------|--------------------------------------|----------------------------|
| agentRun | YpAgentProductRunAttributes \| undefined | The agent run to render.   |

**Returns:** `string`  
A string representation of the agent run, or an empty string if `agentRun` is undefined.

---

### `async renderCommon(): Promise<string>`

Renders common state information about the current conversation mode, agent, agent run status, and workflow steps. This method is intended to be used for debugging or UI rendering purposes.

**Returns:** `Promise<string>`  
A string containing the rendered state information, or an empty string if no current mode is set.

**Side Effects:**  
- Logs information to the console for debugging.

---

## Dependencies

- [YpAgentAssistant](./agentAssistant.md): The main assistant class that this mode interacts with.
- Types used (assumed to be imported or globally available):
  - `YpAgentRunWorkflowStep`
  - `YpAgentRunWorkflowConfiguration`
  - `YpAgentProductRunAttributes`

---

## Example Usage

```typescript
import { YpAgentAssistant } from "../agentAssistant.js";
import { BaseAssistantMode } from "./baseAssistantMode.js";

const assistant = new YpAgentAssistant(/* ... */);
const mode = new BaseAssistantMode(assistant);

const workflowStep = { type: "step", name: "Step 1", description: "Do something" };
console.log(mode.renderSimplifiedWorkflowStep(workflowStep));

const workflow = {
  steps: [workflowStep],
  currentStepIndex: 0
};
console.log(mode.renderSimplifiedWorkflow(workflow));

(async () => {
  console.log(await mode.renderCommon());
})();
```

---

## See Also

- [YpAgentAssistant](./agentAssistant.md)
- [YpAgentRunWorkflowStep](#) (define or link to the type definition)
- [YpAgentRunWorkflowConfiguration](#)
- [YpAgentProductRunAttributes](#)

---

**Note:**  
This class is intended to be extended by specific assistant mode implementations, providing them with utility methods for rendering and state management.