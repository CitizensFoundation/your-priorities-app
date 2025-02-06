# PsEditNodeDialog

A custom web component for editing node configurations, including AI model selections and structured questions.

## Properties

| Name            | Type   | Description                                                                 |
|-----------------|--------|-----------------------------------------------------------------------------|
| open            | Boolean | Indicates whether the dialog is open.                                      |
| nodeToEditInfo  | any    | Information about the node to be edited.                                    |
| groupId         | number | The ID of the group to which the node belongs.                              |

## Methods

| Name                     | Parameters                          | Return Type | Description                                                                 |
|--------------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback        | None                                | Promise<void> | Lifecycle method called when the element is added to the document. Fetches active AI models. |
| fetchActiveAiModels      | None                                | Promise<void> | Fetches the active AI models for the current group.                         |
| updated                  | changedProperties: Map<string, any> | void        | Lifecycle method called when properties change. Initializes models if dialog is opened. |
| initializeCurrentModels  | None                                | void        | Initializes the current AI and reasoning models based on the node information. |
| isReasoningModel         | modelType: PsAiModelType            | boolean     | Determines if a model type is a reasoning model.                            |
| _getCurrentModels        | None                                | void        | Retrieves and sets the current AI and reasoning models from the node information. |
| disableScrim             | event: CustomEvent                  | void        | Disables the scrim (background overlay) for the dialog.                     |
| render                   | None                                | TemplateResult | Renders the dialog's HTML template.                                         |
| _renderNodeEditHeadline  | None                                | TemplateResult | Renders the headline section of the node edit dialog.                       |
| _renderEditForm          | None                                | TemplateResult | Renders the form for editing node configurations.                           |
| _renderAiModelSelector   | None                                | TemplateResult | Renders the AI model selector component.                                    |
| _getInitialAnswers       | None                                | Array<{ uniqueId: string, value: any }> | Retrieves initial answers for structured questions.                        |
| _handleClose             | None                                | void        | Handles the close event of the dialog.                                      |
| _handleAiModelsChanged   | e: CustomEvent                      | void        | Handles changes in AI model selections.                                     |
| _handleSave              | None                                | void        | Handles the save event, dispatching updated configurations and model selections. |

## Events

- **close**: Emitted when the dialog is closed.
- **save**: Emitted when the save action is triggered, containing updated configurations and AI model updates.

## Examples

```typescript
// Example usage of the ps-edit-node-dialog component
const dialog = document.createElement('ps-edit-node-dialog');
dialog.open = true;
dialog.nodeToEditInfo = {
  // Node information here
};
document.body.appendChild(dialog);

dialog.addEventListener('save', (event) => {
  console.log('Save event details:', event.detail);
});

dialog.addEventListener('close', () => {
  console.log('Dialog closed');
});
```