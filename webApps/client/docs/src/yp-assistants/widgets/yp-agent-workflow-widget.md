# YpAgentWorkflowWidget

A web component for displaying an agent workflow, including its steps, status, and visual representation. It decodes a base64-encoded workflow configuration and renders each step with contextual icons and styles.

## Properties

| Name             | Type     | Description                                                                 |
|------------------|----------|-----------------------------------------------------------------------------|
| agentProductId   | string   | The product ID of the agent.                                                |
| runId            | string   | The run ID associated with the workflow.                                    |
| agentName        | string   | The name of the agent.                                                      |
| agentDescription | string   | The description of the agent.                                               |
| workflowStatus   | string   | The current status of the workflow. Defaults to `"not_started"`.            |
| workflow         | string   | The base64-encoded workflow configuration.                                  |

## Methods

| Name             | Parameters                                                                 | Return Type                        | Description                                                                                      |
|------------------|----------------------------------------------------------------------------|------------------------------------|--------------------------------------------------------------------------------------------------|
| parsedWorkflow   | None                                                                       | YpAgentRunWorkflowConfiguration    | Decodes and parses the `workflow` property. Returns a default object if decoding/parsing fails.  |
| styles           | None                                                                       | CSSResultGroup                     | Returns the component's styles, including inherited styles.                                      |
| getStepClass     | index: number                                                              | string                             | Returns a CSS class for a step based on its index and the workflow status.                       |
| renderStep       | step: YpAgentRunWorkflowStep, index: number, isLast: boolean               | TemplateResult                     | Renders a single workflow step with its icon, title, and description.                            |
| renderIcon       | type: "users" \| "sparkles"                                                | TemplateResult                     | Renders an SVG icon based on the type ("users" or "sparkles").                                   |
| renderExplanation| None                                                                       | TemplateResult                     | Renders the explanation row for the workflow step icons.                                         |
| render           | None                                                                       | TemplateResult                     | Main render method. Renders the workflow steps or a message if no configuration is available.     |

## Examples

```typescript
import './yp-agent-workflow-widget';

const widget = document.createElement('yp-agent-workflow-widget');
widget.agentProductId = 'prod-123';
widget.runId = 'run-456';
widget.agentName = 'Example Agent';
widget.agentDescription = 'This is an example agent.';
widget.workflowStatus = 'running';
widget.workflow = btoa(JSON.stringify({
  currentStepIndex: 1,
  steps: [
    {
      shortName: 'Start',
      shortDescription: 'Initial step',
      type: 'sparkles',
      stepBackgroundColor: '#fff',
      stepTextColor: '#000'
    },
    {
      shortName: 'Engage',
      shortDescription: 'Engagement step',
      type: 'engagmentFromOutputConnector',
      stepBackgroundColor: '#eee',
      stepTextColor: '#111'
    }
  ]
}));
document.body.appendChild(widget);
```

---

**Note:**  
- `YpAgentRunWorkflowConfiguration` and `YpAgentRunWorkflowStep` are expected to be defined elsewhere in your codebase.
- This component extends `YpBaseElement`, which should provide localization (`t`) and layout utilities.  
- The `workflow` property must be a base64-encoded JSON string matching the expected workflow configuration structure.