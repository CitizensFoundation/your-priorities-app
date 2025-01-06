# PsAddAgentDialog

The `PsAddAgentDialog` class is a web component that provides a dialog interface for adding a new agent. It allows users to input an agent name, select an agent class, and choose AI models for the agent.

## Properties

| Name           | Type    | Description                                                                 |
|----------------|---------|-----------------------------------------------------------------------------|
| open           | Boolean | Indicates whether the dialog is open.                                       |
| parentAgentId  | Number  | The ID of the parent agent.                                                 |
| groupId        | Number  | The ID of the group to which the agent belongs.                             |

## Methods

| Name                      | Parameters | Return Type | Description                                                                 |
|---------------------------|------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback         | None       | Promise<void> | Lifecycle method called when the element is added to the document. Fetches active agent classes and AI models. |
| fetchActiveAgentClasses   | None       | Promise<void> | Fetches the active agent classes for the specified group.                   |
| fetchActiveAiModels       | None       | Promise<void> | Fetches the active AI models for the specified group.                       |
| render                    | None       | TemplateResult | Renders the dialog interface.                                               |
| _handleNameInput          | e: Event   | void        | Handles input events for the agent name field.                              |
| _handleAgentClassSelection| e: Event   | void        | Handles selection events for the agent class dropdown.                      |
| _handleAiModelsChanged    | e: CustomEvent | void    | Handles changes in the selected AI models.                                  |
| _handleClose              | None       | void        | Handles the closing of the dialog.                                          |
| disableScrim              | event: CustomEvent | void | Disables the scrim (background overlay) when the dialog is canceled.        |
| _handleAddAgent           | None       | Promise<void> | Handles the addition of a new agent, including validation and API call.     |

## Events

- **close**: Emitted when the dialog is closed.
- **agent-added**: Emitted when a new agent is successfully added, with the agent details in the event detail.

## Examples

```typescript
// Example usage of the ps-add-agent-dialog component
const dialog = document.createElement('ps-add-agent-dialog');
dialog.open = true;
dialog.parentAgentId = 1;
dialog.groupId = 123;
document.body.appendChild(dialog);

dialog.addEventListener('agent-added', (event) => {
  console.log('New agent added:', event.detail.agent);
});
```