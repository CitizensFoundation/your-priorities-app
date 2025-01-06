# YpAgentConfigurationWidget

The `YpAgentConfigurationWidget` is a custom web component that extends `YpBaseElement`. It is designed to handle the configuration of an agent, including submitting configuration data to a server and managing user input for required questions.

## Properties

| Name                             | Type    | Description                                                                 |
|----------------------------------|---------|-----------------------------------------------------------------------------|
| agentProductId                   | number  | The product ID of the agent.                                                |
| agentName                        | string  | The name of the agent.                                                      |
| subscriptionId                   | string  | The subscription ID associated with the agent.                              |
| domainId                         | number  | The domain ID related to the agent.                                         |
| agentDescription                 | string  | A description of the agent.                                                 |
| agentImageUrl                    | string  | The URL of the agent's image.                                               |
| requiredQuestions                | string  | JSON string of required questions for configuration.                        |
| requiredQuestionsAnswered        | string  | JSON string of answers to the required questions.                           |
| haveSubmittedConfigurationPastSecond | boolean | Flag indicating if the configuration has been submitted past a second.      |
| serverApi                        | YpAssistantServerApi | Instance of the server API for submitting configurations.                  |

## Methods

| Name                        | Parameters | Return Type | Description                                                                 |
|-----------------------------|------------|-------------|-----------------------------------------------------------------------------|
| constructor                 |            |             | Initializes the component and sets up the server API instance.              |
| connectedCallback           |            | void        | Lifecycle method called when the element is added to the document.          |
| disconnectedCallback        |            | void        | Lifecycle method called when the element is removed from the document.      |
| submitConfiguration         |            | Promise<void> | Submits the agent configuration to the server after validation.             |
| sendError                   | message: string | void        | Displays an error message using a snackbar.                                 |
| parsedRequiredQuestions     |            | YpStructuredQuestionData[] | Parses and returns the required questions from the JSON string.             |
| parsedRequiredQuestionsAnswered |            | YpStructuredAnswer[] | Parses and returns the answered questions from the JSON string.             |
| renderAgentHeader           |            | TemplateResult | Renders the header section of the agent configuration widget.               |
| render                      |            | TemplateResult | Renders the entire component, including the form for required questions.    |

## Events

- **agent-configuration-submitted**: Emitted when the agent configuration is successfully submitted.

## Examples

```typescript
// Example usage of the YpAgentConfigurationWidget
import './path/to/yp-agent-configuration-widget.js';

const widget = document.createElement('yp-agent-configuration-widget');
widget.agentProductId = 123;
widget.agentName = 'Example Agent';
widget.subscriptionId = 'sub-456';
widget.domainId = 789;
widget.agentDescription = 'This is an example agent.';
widget.agentImageUrl = 'https://example.com/image.png';
widget.requiredQuestions = JSON.stringify([
  { uniqueId: 'q1', questionText: 'What is your name?' },
  { uniqueId: 'q2', questionText: 'What is your age?' }
]);
widget.requiredQuestionsAnswered = JSON.stringify([
  { uniqueId: 'q1', value: 'John Doe' }
]);

document.body.appendChild(widget);
```