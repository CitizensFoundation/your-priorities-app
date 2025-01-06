# PsEditNodeDialog

The `PsEditNodeDialog` class is a custom web component that extends `YpBaseElement`. It provides a dialog interface for editing node information, including AI model selection and structured question editing.

## Properties

| Name            | Type   | Description                                                                 |
|-----------------|--------|-----------------------------------------------------------------------------|
| open            | Boolean | Indicates whether the dialog is open.                                      |
| nodeToEditInfo  | any    | Contains information about the node to be edited.                           |
| groupId         | Number | The ID of the group associated with the node.                               |

## Methods

| Name                     | Parameters                          | Return Type | Description                                                                 |
|--------------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback        | None                                | Promise<void> | Lifecycle method called when the element is added to the document. Fetches active AI models. |
| fetchActiveAiModels      | None                                | Promise<void> | Fetches active AI models from the server API.                               |
| updated                  | changedProperties: Map<string, any> | void        | Lifecycle method called when properties change. Initializes current models if dialog is opened. |
| initializeCurrentModels  | None                                | void        | Initializes current AI and reasoning models based on node information.      |
| isReasoningModel         | modelType: PsAiModelType            | boolean     | Determines if a model type is a reasoning model.                            |
| _getCurrentModels        | None                                | void        | Retrieves current AI and reasoning models from node information.            |
| disableScrim             | event: CustomEvent                  | void        | Disables the scrim (background overlay) for the dialog.                     |
| render                   | None                                | TemplateResult | Renders the dialog's HTML template.                                         |
| _renderNodeEditHeadline  | None                                | TemplateResult | Renders the headline section of the node edit dialog.                       |
| _renderEditForm          | None                                | TemplateResult | Renders the form for editing node information.                              |
| _renderAiModelSelector   | None                                | TemplateResult | Renders the AI model selector component.                                    |
| _getInitialAnswers       | None                                | Array<{ uniqueId: string, value: any }> | Retrieves initial answers for structured questions.                         |
| _handleClose             | None                                | void        | Handles the close event for the dialog.                                     |
| _handleAiModelsChanged   | e: CustomEvent                      | void        | Handles changes to selected AI models.                                      |
| _handleSave              | None                                | void        | Handles the save event, dispatching updated configuration and model updates. |

## Events

- **close**: Emitted when the dialog is closed.
- **save**: Emitted when the save action is triggered, containing updated configuration and AI model updates.

## Examples

```typescript
// Example usage of the PsEditNodeDialog component
const dialog = document.createElement('ps-edit-node-dialog');
dialog.open = true;
dialog.nodeToEditInfo = { /* node information */ };
document.body.appendChild(dialog);

dialog.addEventListener('save', (event) => {
  console.log('Save event details:', event.detail);
});

dialog.addEventListener('close', () => {
  console.log('Dialog closed');
});
```