# YpAgentConfigurationWidget

The `YpAgentConfigurationWidget` is a custom web component that extends `YpBaseElement`. It is designed to handle the configuration of an agent, including fetching and submitting configuration data.

## Properties

| Name                             | Type    | Description                                                                 |
|----------------------------------|---------|-----------------------------------------------------------------------------|
| agentProductId                   | number  | The product ID of the agent.                                                |
| agentName                        | string  | The name of the agent.                                                      |
| subscriptionId                   | string  | The subscription ID associated with the agent.                              |
| domainId                         | number  | The domain ID for the agent configuration.                                  |
| agentDescription                 | string  | A description of the agent.                                                 |
| agentImageUrl                    | string  | The URL of the agent's image.                                               |
| requiredQuestions                | string  | JSON string of required questions for the agent configuration.              |
| requiredQuestionsAnswered        | string  | JSON string of answers to the required questions.                           |
| haveSubmittedConfigurationPastSecond | boolean | Flag indicating if the configuration has been submitted past the second.    |
| serverApi                        | YpAssistantServerApi | Instance of the server API for handling configuration requests.             |

## Methods

| Name                        | Parameters | Return Type | Description                                                                 |
|-----------------------------|------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback           | None       | void        | Lifecycle method called when the element is added to the document.          |
| disconnectedCallback        | None       | void        | Lifecycle method called when the element is removed from the document.      |
| firstUpdated                | None       | Promise<void> | Called after the element's DOM has been updated the first time.             |
| getAgentConfiguration       | None       | Promise<void> | Fetches the agent configuration from the server.                            |
| getPrefillValue             | question: YpStructuredQuestionData | string | Retrieves the prefilled value for a given question.                         |
| submitConfiguration         | None       | Promise<void> | Submits the agent configuration to the server.                              |
| sendError                   | message: string | void        | Displays an error message using a snackbar.                                 |
| parsedRequiredQuestions     | None       | YpStructuredQuestionData[] | Parses and returns the required questions as an array.                      |
| parsedRequiredQuestionsAnswered | None   | YpStructuredAnswer[] | Parses and returns the answered questions as an array.                      |
| renderAgentHeader           | None       | TemplateResult | Renders the header section of the agent configuration widget.               |
| render                      | None       | TemplateResult | Renders the entire agent configuration widget.                              |

## Events

- **agent-configuration-submitted**: Emitted when the agent configuration is successfully submitted.

## Examples

```typescript
// Example usage of the YpAgentConfigurationWidget
import './path/to/yp-agent-configuration-widget.js';

const widget = document.createElement('yp-agent-configuration-widget');
widget.agentProductId = 123;
widget.agentName = 'Agent Smith';
widget.subscriptionId = 'sub-456';
widget.domainId = 789;
widget.agentDescription = 'This is a test agent.';
widget.agentImageUrl = 'https://example.com/agent-image.png';
widget.requiredQuestions = JSON.stringify([
  { uniqueId: 'q1', questionText: 'What is your name?' },
  { uniqueId: 'q2', questionText: 'What is your quest?' }
]);
document.body.appendChild(widget);
```