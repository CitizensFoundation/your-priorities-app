# PsAddConnectorDialog

The `PsAddConnectorDialog` class is a web component that provides a dialog interface for adding connectors. It extends the `YpBaseElement` and utilizes Material Web components for UI elements.

## Properties

| Name                     | Type                              | Description                                                                 |
|--------------------------|-----------------------------------|-----------------------------------------------------------------------------|
| open                     | boolean                           | Indicates whether the dialog is open.                                       |
| selectedAgentId          | number \| null                    | The ID of the selected agent.                                               |
| groupId                  | number                            | The ID of the group to which the connector belongs.                         |
| selectedInputOutputType  | "input" \| "output" \| null       | The type of connector being added, either "input" or "output".              |

## Methods

| Name                          | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback             | None                                                                       | Promise<void> | Lifecycle method called when the element is added to the document. Fetches active connector classes. |
| fetchActiveConnectorClasses   | None                                                                       | Promise<void> | Fetches the active connector classes from the server.                       |
| disableScrim                  | event: CustomEvent                                                         | void        | Disables the scrim (background overlay) when the dialog is canceled.        |
| render                        | None                                                                       | TemplateResult | Renders the dialog's HTML template.                                         |
| _handleNameInput              | e: Event                                                                   | void        | Handles input events for the connector name field.                         |
| _handleConnectorClassSelection| e: Event                                                                   | void        | Handles selection events for the connector class dropdown.                 |
| _handleClose                  | None                                                                       | void        | Handles the close event for the dialog.                                    |
| _handleAddConnector           | None                                                                       | Promise<void> | Handles the addition of a new connector, dispatching an event upon success. |

## Events

- **close**: Emitted when the dialog is closed.
- **connector-added**: Emitted when a new connector is successfully added. The event detail contains the new connector object.

## Examples

```typescript
// Example usage of the ps-add-connector-dialog component
const dialog = document.createElement('ps-add-connector-dialog');
dialog.open = true;
dialog.groupId = 123;
dialog.selectedAgentId = 456;
dialog.selectedInputOutputType = 'input';
document.body.appendChild(dialog);

dialog.addEventListener('connector-added', (event) => {
  console.log('Connector added:', event.detail.connector);
});
```