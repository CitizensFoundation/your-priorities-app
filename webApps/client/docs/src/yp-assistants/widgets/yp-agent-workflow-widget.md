# YpAgentWorkflowWidget

The `YpAgentWorkflowWidget` is a custom web component that extends the `YpBaseElement`. It is designed to display a workflow for an agent, showing various steps and their statuses.

## Properties

| Name              | Type   | Description                                                                 |
|-------------------|--------|-----------------------------------------------------------------------------|
| agentProductId    | String | The ID of the agent product.                                                |
| runId             | String | The ID of the current run.                                                  |
| agentName         | String | The name of the agent.                                                      |
| agentDescription  | String | A description of the agent.                                                 |
| workflowStatus    | String | The current status of the workflow. Defaults to "not_started".              |
| workflow          | String | The encoded workflow configuration.                                         |

## Methods

| Name            | Parameters                                      | Return Type             | Description                                                                 |
|-----------------|-------------------------------------------------|-------------------------|-----------------------------------------------------------------------------|
| parsedWorkflow  | None                                            | YpWorkflowConfiguration | Decodes and parses the workflow property to return a workflow configuration.|
| getStepClass    | index: number                                   | string                  | Determines the CSS class for a step based on its index and workflow status. |
| renderStep      | step: YpWorkflowStep, index: number, isLast: boolean | TemplateResult          | Renders a single step in the workflow.                                      |
| renderIcon      | type: "users" \| "sparkles"                     | TemplateResult          | Renders an icon based on the type provided.                                 |
| renderExplanation | None                                          | TemplateResult          | Renders an explanation of the step icons.                                   |
| render          | None                                            | TemplateResult          | Renders the entire workflow widget.                                         |

## Examples

```typescript
// Example usage of the YpAgentWorkflowWidget component
import './path/to/yp-agent-workflow-widget.js';

const widget = document.createElement('yp-agent-workflow-widget');
widget.agentProductId = '12345';
widget.runId = 'run-67890';
widget.agentName = 'Agent Smith';
widget.agentDescription = 'An example agent for demonstration purposes.';
widget.workflow = 'encodedWorkflowString';
document.body.appendChild(widget);
```

This component is styled using CSS and supports responsive design for different screen sizes. It uses the LitElement library for rendering and managing state. The workflow is expected to be a base64 encoded JSON string that describes the steps and their configurations.