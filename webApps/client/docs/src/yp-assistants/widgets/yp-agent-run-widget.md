# YpAgentRunWidget

The `YpAgentRunWidget` is a web component that manages and displays the status of an agent's workflow run. It provides functionality to start, stop, and monitor the progress of the workflow steps.

## Properties

| Name              | Type                              | Description                                                                 |
|-------------------|-----------------------------------|-----------------------------------------------------------------------------|
| agentProductId    | number                            | The ID of the agent product.                                                |
| runId             | number                            | The ID of the current run.                                                  |
| agentId           | number                            | The ID of the agent.                                                        |
| wsClientId        | string                            | The WebSocket client ID.                                                    |
| workflowGroupId   | number                            | The ID of the workflow group.                                               |
| agentName         | string                            | The name of the agent.                                                      |
| agentDescription  | string                            | The description of the agent.                                               |
| agentImageUrl     | string                            | The URL of the agent's image.                                               |
| runStatus         | YpAgentProductRunStatus           | The current status of the run.                                              |
| workflow          | string                            | The encoded workflow configuration.                                         |
| maxRunsPerCycle   | number                            | The maximum number of runs allowed per cycle.                               |

## Methods

| Name                          | Parameters                                                                 | Return Type  | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------|--------------|-----------------------------------------------------------------------------|
| connectedCallback             | None                                                                       | void         | Lifecycle method called when the element is added to the document.          |
| parseWorkflow                 | None                                                                       | void         | Parses the current workflow configuration.                                  |
| setupInitialWorkflow          | None                                                                       | Promise<void> | Sets up the initial workflow configuration.                                 |
| updateWorkflow                | updatedWorkflow: { workflow: YpWorkflowConfiguration; status: YpAgentProductRunStatus; } | void         | Updates the workflow configuration and status.                              |
| get parsedWorkflow            | None                                                                       | YpWorkflowConfiguration | Returns the parsed workflow configuration.                                  |
| disconnectedCallback          | None                                                                       | void         | Lifecycle method called when the element is removed from the document.      |
| startStatusUpdates            | None                                                                       | void         | Starts periodic updates of the agent's status.                              |
| stopStatusUpdates             | None                                                                       | void         | Stops periodic updates of the agent's status.                               |
| get latestMessageMarkdown     | None                                                                       | string       | Extracts and returns the markdown report from the latest message.           |
| getUpdatedWorkflow            | None                                                                       | Promise<void> | Fetches and updates the workflow configuration from the server.             |
| makeSureRunIsStoppedOrAdvanced| None                                                                       | Promise<void> | Ensures the current run is stopped or advanced if necessary.                |
| updateAgentStatus             | None                                                                       | Promise<void> | Updates the agent's status and handles state transitions.                   |
| getStepClass                  | index: number                                                              | string       | Returns the CSS class for a workflow step based on its index and status.    |
| renderStep                    | step: YpWorkflowStep, index: number, isSelected: boolean                   | TemplateResult | Renders a single workflow step.                                             |
| renderIcon                    | type: "users" \| "sparkles"                                                | TemplateResult | Renders an icon based on the type.                                          |
| renderAgentHeader             | None                                                                       | TemplateResult | Renders the agent header section.                                           |
| get shouldDisableStopButton   | None                                                                       | boolean      | Determines if the stop button should be disabled.                           |
| get shouldDisableStartButton  | None                                                                       | boolean      | Determines if the start button should be disabled.                          |
| get isRunning                 | None                                                                       | boolean      | Checks if the workflow is currently running.                                |
| get isWaitingOnUser           | None                                                                       | boolean      | Checks if the workflow is waiting on user input.                            |
| get isCompleted               | None                                                                       | boolean      | Checks if the workflow is completed.                                        |
| renderAgentRunningStatus      | None                                                                       | TemplateResult | Renders the agent's running status section.                                 |
| get runStatusForButton        | None                                                                       | string       | Returns the label for the start/stop button based on the current run status.|
| startNextWorkflowStep         | None                                                                       | Promise<void> | Starts the next step in the workflow.                                       |
| stopCurrentWorkflowStep       | None                                                                       | Promise<void> | Stops the current step in the workflow.                                     |
| renderStartStopButtons        | None                                                                       | TemplateResult | Renders the start and stop buttons.                                         |
| get groupId                   | None                                                                       | string       | Returns the group ID of the current workflow step.                          |
| sendEmailInvitesForAnons      | None                                                                       | Promise<void> | Sends email invites for anonymous users.                                    |
| viewList                      | None                                                                       | void         | Opens a new window to view the list of group members.                       |
| openMarkdownReport            | None                                                                       | void         | Opens the markdown report in a new window.                                  |
| renderCompleted               | None                                                                       | TemplateResult | Renders the completed state of the workflow.                                |
| renderWaitingOnUser           | None                                                                       | TemplateResult | Renders the waiting on user state of the workflow.                          |
| render                        | None                                                                       | TemplateResult | Renders the entire component.                                               |

## Examples

```typescript
// Example usage of the YpAgentRunWidget component
const widget = document.createElement('yp-agent-run-widget');
widget.agentProductId = 123;
widget.runId = 456;
widget.agentId = 789;
widget.wsClientId = 'client-123';
widget.workflowGroupId = 101112;
widget.agentName = 'Example Agent';
widget.agentDescription = 'This is an example agent.';
widget.agentImageUrl = 'http://example.com/image.png';
widget.runStatus = 'ready';
widget.workflow = 'encodedWorkflowString';
widget.maxRunsPerCycle = 5;
document.body.appendChild(widget);
```