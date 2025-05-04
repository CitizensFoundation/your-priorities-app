# YpAgentRunWidget

A LitElement-based web component for managing and visualizing the execution of an agent workflow. It provides UI controls for starting, stopping, and monitoring the progress of agent runs, as well as inviting users to participate in workflow steps.

## Properties

| Name               | Type                                         | Description                                                                                 |
|--------------------|----------------------------------------------|---------------------------------------------------------------------------------------------|
| agentProductId     | number                                       | The ID of the agent product associated with this run.                                       |
| runId              | number                                       | The unique identifier for the current agent run.                                            |
| agentId            | number                                       | The ID of the agent currently being executed.                                               |
| wsClientId         | string                                       | The WebSocket client ID for real-time updates.                                              |
| workflowGroupId    | number                                       | The group ID associated with the workflow.                                                  |
| agentName          | string                                       | The display name of the agent.                                                              |
| agentDescription   | string                                       | The description of the agent.                                                               |
| agentImageUrl      | string                                       | The image URL for the agent.                                                                |
| runStatus          | YpAgentProductRunStatus                      | The current status of the agent run (e.g., "ready", "running", "completed", etc.).          |
| workflow           | string                                       | The base64-encoded JSON string representing the workflow configuration.                     |
| maxRunsPerCycle    | number                                       | The maximum number of runs allowed per cycle.                                               |

## Private/State Properties

| Name           | Type                                                                 | Description                                                                                 |
|----------------|----------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| agentState     | "running" \| "paused" \| "stopped" \| "error" \| "completed"         | The internal state of the agent.                                                            |
| latestMessage  | string                                                               | The latest status or log message from the agent.                                            |
| progress       | number \| undefined                                                  | The current progress of the agent run (as a percentage).                                    |
| statusInterval | number \| undefined                                                  | The interval ID for polling agent status.                                                   |
| emailsInput    | HTMLInputElement                                                     | Reference to the email input field for inviting users.                                      |
| api            | PsServerApi                                                          | The API client for server communication.                                                    |

## Methods

| Name                          | Parameters                                                                 | Return Type         | Description                                                                                                 |
|-------------------------------|----------------------------------------------------------------------------|---------------------|-------------------------------------------------------------------------------------------------------------|
| connectedCallback             | -                                                                          | void                | Lifecycle method. Sets up workflow and status updates, and adds global event listeners.                     |
| disconnectedCallback          | -                                                                          | void                | Lifecycle method. Cleans up intervals and removes global event listeners.                                    |
| parseWorkflow                 | -                                                                          | void                | Parses the current workflow and updates agentId and workflowGroupId.                                         |
| setupInitialWorkflow          | -                                                                          | Promise<void>       | Initializes the workflow and fetches the latest workflow state from the server.                              |
| updateWorkflow                | updatedWorkflow: { workflow: YpAgentRunWorkflowConfiguration; status: YpAgentProductRunStatus } | void                | Updates the workflow and run status, removing email instructions from steps.                                 |
| get parsedWorkflow            | -                                                                          | YpAgentRunWorkflowConfiguration | Decodes and parses the workflow property into a workflow configuration object.                               |
| startStatusUpdates            | -                                                                          | void                | Starts polling the agent status at regular intervals.                                                        |
| stopStatusUpdates             | -                                                                          | void                | Stops polling the agent status.                                                                              |
| get latestMessageMarkdown     | -                                                                          | string              | Extracts a markdown report from the latest message, if present.                                              |
| getUpdatedWorkflow            | -                                                                          | Promise<void>       | Fetches the latest workflow state from the server and updates the component.                                 |
| makeSureRunIsStoppedOrAdvanced| -                                                                          | Promise<void>       | Ensures the run is stopped or advanced if the workflow step does not progress after a timeout.               |
| updateAgentStatus             | -                                                                          | Promise<void>       | Fetches the current agent status and updates the UI and workflow accordingly.                                |
| getStepClass                  | index: number                                                              | string              | Returns a CSS class for a workflow step based on its status.                                                 |
| openGroup                     | groupId: number                                                            | void                | Opens the group page in a new browser tab.                                                                   |
| renderStep                    | step: YpAgentRunWorkflowStep, index: number, isSelected: boolean           | TemplateResult      | Renders a single workflow step in the UI.                                                                    |
| renderIcon                    | type: "users" \| "sparkles"                                                | TemplateResult      | Renders an SVG icon for a workflow step.                                                                     |
| renderAgentHeader             | -                                                                          | TemplateResult      | Renders the agent header section.                                                                            |
| get shouldDisableStopButton   | -                                                                          | boolean             | Returns true if the stop button should be disabled.                                                          |
| get shouldDisableStartButton  | -                                                                          | boolean             | Returns true if the start button should be disabled.                                                         |
| get isRunning                 | -                                                                          | boolean             | Returns true if the agent is currently running.                                                              |
| get isWaitingOnUser           | -                                                                          | boolean             | Returns true if the agent is waiting on user input.                                                          |
| get isCompleted               | -                                                                          | boolean             | Returns true if the agent run is completed.                                                                  |
| renderAgentRunningStatus      | -                                                                          | TemplateResult      | Renders the running status UI, including progress and latest message.                                        |
| get runStatusForButton        | -                                                                          | "start" \| "stop"   | Returns the label for the start/stop button based on current run status.                                     |
| startNextWorkflowStep         | -                                                                          | Promise<void>       | Fires an event to start the next workflow step.                                                              |
| stopCurrentWorkflowStep       | -                                                                          | Promise<void>       | Fires an event to stop the current workflow step.                                                            |
| renderStartStopButtons        | -                                                                          | TemplateResult      | Renders the start and stop buttons.                                                                          |
| get groupId                   | -                                                                          | number              | Returns the group ID of the current workflow step.                                                           |
| sendEmailInvitesForAnons      | -                                                                          | Promise<void>       | Fires a global event to send email invites for anonymous reviewers.                                          |
| viewList                      | -                                                                          | void                | Opens the group list in a new browser tab.                                                                   |
| openMarkdownReport            | -                                                                          | void                | Fires an event to open the markdown report for the current run.                                              |
| renderCompleted               | -                                                                          | TemplateResult      | Renders the UI for a completed agent run, including a button to view the report.                             |
| renderWaitingOnUser           | -                                                                          | TemplateResult      | Renders the UI for when the agent is waiting on user input, including invite and view list options.          |
| render                       | -                                                                          | TemplateResult      | Main render method for the component.                                                                        |

## Events

- **yp-updated-agent-workflow**: Listened for to re-initialize the workflow when updated externally.
- **yp-start-next-workflow-step**: Fired when the user starts the next workflow step. Payload: `{ agentId }`.
- **yp-stop-current-workflow-step**: Fired when the user stops the current workflow step. Payload: `{ agentId }`.
- **yp-send-email-invites-for-anons**: Fired globally to send email invites for anonymous reviewers. Payload: `{ groupId, agentId, agentRunId, emails }`.
- **yp-open-markdown-report**: Fired when the user wants to view the markdown report. Payload: `{ markdownReport, agentId }`.

## Examples

```typescript
import './yp-agent-run-widget.js';

const widget = document.createElement('yp-agent-run-widget');
widget.agentProductId = 123;
widget.runId = 456;
widget.agentId = 789;
widget.wsClientId = 'ws-abc-123';
widget.workflowGroupId = 321;
widget.agentName = 'My Agent';
widget.agentDescription = 'This is a test agent.';
widget.agentImageUrl = '/images/agent.png';
widget.runStatus = 'ready';
widget.workflow = btoa(JSON.stringify({
  currentStepIndex: 0,
  steps: [
    { agentId: 789, shortName: 'Step 1', type: 'sparkles', groupId: 321, stepBackgroundColor: '#fff', stepTextColor: '#000' }
  ]
}));
widget.maxRunsPerCycle = 5;
document.body.appendChild(widget);
```
