# Service Module: AgentTools

The `AgentTools` class provides a suite of assistant tools for managing and interacting with agent workflows, runs, and configuration widgets in a Policy Synth context. It extends [BaseAssistantTools](./baseTools.md) and interacts with [YpAgentAssistant](../../agentAssistant.md) and [AgentModels](./models/agents.md) to perform business logic related to agent workflow management, run lifecycle, and UI widget rendering.

---

## Class: AgentTools

### Extends
- [BaseAssistantTools](./baseTools.md)

### Constructor

#### `constructor(assistant: YpAgentAssistant)`
Initializes the `AgentTools` instance with a reference to the assistant and sets up the agent models.

| Name      | Type              | Description                        |
|-----------|-------------------|------------------------------------|
| assistant | YpAgentAssistant  | The assistant instance to use.     |

---

## Properties

| Name                                | Type                | Description                                      |
|------------------------------------- |---------------------|--------------------------------------------------|
| agentModels                         | AgentModels         | Instance for agent-related data/model operations. |

---

## Tool Definitions

Each tool is exposed as a getter returning an object with metadata and a handler function.

---

### Tool: showAgentWorkflowOverviewWidget

Shows the workflow widget overview for the current agent.

#### Definition

```typescript
get showAgentWorkflowOverviewWidget: {
  name: string;
  description: string;
  type: "function";
  parameters: {
    type: "object";
    properties: YpAgentEmptyProperties;
  };
  handler: (params: YpAgentEmptyProperties) => Promise<ToolExecutionResult>;
}
```

#### Handler: `showAgentWorkflowOverviewWidgetHandler(params: YpAgentEmptyProperties): Promise<ToolExecutionResult>`

- Fetches the current agent and workflow.
- Renders a `<yp-agent-workflow-widget>` with agent and workflow data.
- Emits a message to the AI model session about the next step for the user.

##### Parameters

| Name   | Type                  | Description                |
|--------|-----------------------|----------------------------|
| params | YpAgentEmptyProperties| No properties (empty obj). |

##### Returns

- `ToolExecutionResult` with `success`, `html`, and `data` (including agent, run, workflow JSON, and message).

##### Error Handling

- Returns `success: false` and an error message if any step fails.

---

### Tool: showAgentRunWidget

Shows the agent run widget for the current agent run.

#### Definition

```typescript
get showAgentRunWidget: { ... }
```

#### Handler: `showAgentRunWidgetHandler(params: YpAgentEmptyProperties): Promise<ToolExecutionResult>`

- Fetches the current agent, run, and subscription.
- Renders a `<yp-agent-run-widget>` for the current run.

##### Parameters

| Name   | Type                  | Description                |
|--------|-----------------------|----------------------------|
| params | YpAgentEmptyProperties| No properties (empty obj). |

##### Returns

- `ToolExecutionResult` with `success`, `html`, `uniqueToken`, and `data` (agent, run, subscription).

##### Error Handling

- Returns `success: false` and an error message if no active run is found or on error.

---

### Tool: createNewAgentRunReadyToRunFirstWorkflowStep

Creates a new agent run, ready to execute the first workflow step, after user confirmation.

#### Definition

```typescript
get createNewAgentRunReadyToRunFirstWorkflowStep: { ... }
```

#### Handler: `createNewAgentRunReadyToRunFirstWorkflowStepHandler(params: YpAgentRunStartParams): Promise<ToolExecutionResult>`

- Checks for user confirmation and subscription.
- Starts a new agent run and renders the run widget.

##### Parameters

| Name                        | Type   | Description                                 | Required |
|-----------------------------|--------|---------------------------------------------|----------|
| hasVerballyConfirmedTheRun  | boolean| User confirmation to start the new run.     | Yes      |

##### Returns

- `ToolExecutionResult` with `success`, `html`, `uniqueToken`, and `data` (message, agentRun, subscription).

##### Error Handling

- Returns `success: false` and an error message if confirmation or subscription is missing, or on error.

---

### Tool: startCurrentRunAgentNextWorkflowStep

Starts the next workflow step for the current agent run, after user confirmation.

#### Definition

```typescript
async startCurrentRunAgentNextWorkflowStep(): Promise<{ ... }>
```

#### Handler: `startCurrentRunAgentNextWorkflowStepHandler(params: YpAgentRunStartNextWorkflowStepParams): Promise<ToolExecutionResult>`

- Checks for user confirmation.
- Starts the next workflow step, updates the run, and renders the run widget.

##### Parameters

| Name                                                        | Type   | Description                                             | Required |
|-------------------------------------------------------------|--------|---------------------------------------------------------|----------|
| userHasVerballyConfirmedStartOfNextWorkflowStepWithTheAgentName | boolean| User confirmation to start the next workflow step.      | Yes      |

##### Returns

- `ToolExecutionResult` with `success`, `html`, `uniqueToken`, and `data` (result of workflow step start).

##### Error Handling

- Returns `success: false` and an error message if confirmation is missing, no active run, or on error.

---

### Tool: stopCurrentAgentWorkflow

Stops the currently running agent workflow step, after user confirmation.

#### Definition

```typescript
get stopCurrentAgentWorkflow: { ... }
```

#### Handler: `stopCurrentAgentWorkflowHandler(params: YpAgentRunStopCurrentWorkflowStepParams): Promise<ToolExecutionResult>`

- Checks for user confirmation.
- Stops the current workflow step, updates the run, and renders the run widget.

##### Parameters

| Name                                                        | Type   | Description                                             | Required |
|-------------------------------------------------------------|--------|---------------------------------------------------------|----------|
| userHasVerballyConfirmedStopCurrentWorkflowStepWithTheAgentName | boolean| User confirmation to stop the current workflow step.    | Yes      |

##### Returns

- `ToolExecutionResult` with `success`, `html`, `uniqueToken`, and `data` (result of workflow step stop).

##### Error Handling

- Returns `success: false` and an error message if confirmation is missing or on error.

---

### Tool: deactivateAgent

Deactivates the agent after a long-running task has started.

#### Definition

```typescript
get deactivateAgent: { ... }
```

#### Handler: `deactivateAgentHandler(params: YpAgentEmptyProperties): Promise<ToolExecutionResult>`

- (Currently a stub; deactivation logic is commented out.)
- Returns a success message.

##### Parameters

| Name   | Type                  | Description                |
|--------|-----------------------|----------------------------|
| params | YpAgentEmptyProperties| No properties (empty obj). |

##### Returns

- `ToolExecutionResult` with `success` and a message.

##### Error Handling

- Returns `success: false` and an error message on error.

---

### Tool: showConfigurationWidget

Shows the configuration widget for the current agent.

#### Definition

```typescript
get showConfigurationWidget: { ... }
```

#### Handler: `showConfigurationWidgetHandler(params: YpAgentEmptyProperties): Promise<ToolExecutionResult>`

- Fetches the current agent, subscription, and plan.
- Renders a `<yp-agent-configuration-widget>` with required questions.

##### Parameters

| Name   | Type                  | Description                |
|--------|-----------------------|----------------------------|
| params | YpAgentEmptyProperties| No properties (empty obj). |

##### Returns

- `ToolExecutionResult` with `success`, `html`, `uniqueToken`, and `data` (agent, subscription).

##### Error Handling

- Returns `success: false` and an error message if agent, subscription, or plan is missing, or on error.

---

### Tool: submitConfiguration

Submits the configuration for the current agent by simulating a UI click.

#### Definition

```typescript
get submitConfiguration: { ... }
```

#### Handler: `submitConfigurationHandler(params: YpAgentEmptyProperties): Promise<ToolExecutionResult>`

- Simulates a UI click event for submitting agent configuration.

##### Parameters

| Name   | Type                  | Description                |
|--------|-----------------------|----------------------------|
| params | YpAgentEmptyProperties| No properties (empty obj). |

##### Returns

- `ToolExecutionResult` with `success`, `clientEvents`, and a message.

##### Error Handling

- Returns `success: false` and an error message on error.

---

## Utility Methods

### `getSimpleWorkflow(workflow: YpAgentRunWorkflowConfiguration): YpAgentRunWorkflowConfiguration`

Returns a copy of the workflow with `emailInstructions` removed from each step.

| Name     | Type                              | Description                |
|----------|-----------------------------------|----------------------------|
| workflow | YpAgentRunWorkflowConfiguration   | The workflow configuration |

---

### `renderAgentRunWidget(agent: YpAgentProductAttributes, run: YpAgentProductRunAttributes): Promise<string>`

Renders the HTML for the agent run widget, encoding the workflow as base64.

| Name  | Type                        | Description                |
|-------|-----------------------------|----------------------------|
| agent | YpAgentProductAttributes    | The agent product object   |
| run   | YpAgentProductRunAttributes | The agent run object       |

**Returns:** `Promise<string>` - The HTML string for the widget.

---

## Dependencies

- [YpAgentAssistant](../../agentAssistant.md)
- [BaseAssistantTools](./baseTools.md)
- [AgentModels](./models/agents.md)
- Various types: `YpAgentEmptyProperties`, `YpAgentRunStartParams`, `YpAgentRunStartNextWorkflowStepParams`, `YpAgentRunStopCurrentWorkflowStepParams`, `ToolExecutionResult`, `YpAgentRunWorkflowConfiguration`, `YpAgentRunWorkflowStep`, `YpAgentProductAttributes`, `YpAgentProductRunAttributes`, `UserClass`, `ToolClientEventUiClick`, `YpStructuredAnswer`

---

## Example Usage

```typescript
const agentTools = new AgentTools(assistantInstance);

// Show workflow overview widget
const result = await agentTools.showAgentWorkflowOverviewWidget.handler({});
if (result.success) {
  // Render result.html in UI
}

// Start next workflow step
const startStepTool = await agentTools.startCurrentRunAgentNextWorkflowStep();
const result2 = await startStepTool.handler({
  userHasVerballyConfirmedStartOfNextWorkflowStepWithTheAgentName: true
});
```

---

## See Also

- [BaseAssistantTools](./baseTools.md)
- [AgentModels](./models/agents.md)
- [YpAgentAssistant](../../agentAssistant.md)
- [Policy Synth Agent Model](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)

---

## Exported

- `AgentTools` (class)