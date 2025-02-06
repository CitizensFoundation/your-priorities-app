# YpApiActionDialog

`YpApiActionDialog` is a custom web component that extends `YpBaseElement`. It provides a dialog interface for confirming API actions, such as deletions, with optional final warnings and customizable confirmation text and button labels.

## Properties

| Name                | Type       | Description                                                                 |
|---------------------|------------|-----------------------------------------------------------------------------|
| action              | string \| undefined | The API action to be performed.                                           |
| method              | string \| undefined | The HTTP method to be used for the API action. Defaults to "DELETE".      |
| confirmationText    | string \| undefined | The text displayed in the dialog to confirm the action.                   |
| confirmButtonText   | string \| undefined | The text displayed on the confirmation button. Defaults to "delete".      |
| onFinishedFunction  | Function \| undefined | A callback function to be executed after the API action is completed.     |
| finalDeleteWarning  | boolean    | Indicates if a final delete warning should be shown. Defaults to `false`.   |

## Methods

| Name             | Parameters                                                                 | Return Type | Description                                                                 |
|------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| render           | None                                                                       | TemplateResult | Renders the dialog component.                                               |
| _onClose         | None                                                                       | void        | Handles the dialog close event and fires related events.                    |
| setup            | action: string, confirmationText: string, onFinishedFunction: Function \| undefined = undefined, confirmButtonText: string \| undefined = undefined, method: string \| undefined = undefined | void        | Configures the dialog with the specified action, text, and method.          |
| open             | options: { finalDeleteWarning: boolean } \| undefined = undefined          | Promise<void> | Opens the dialog and optionally sets the final delete warning.              |
| _delete          | None                                                                       | Promise<void> | Executes the delete action, handles confirmation, and calls the callback.   |

## Events

- **close**: Emitted when the dialog is closed.
- **yp-dialog-closed**: Emitted globally when the dialog is closed.
- **yp-dialog-opened**: Emitted globally when the dialog is opened.
- **api-action-finished**: Emitted when the API action is completed.

## Examples

```typescript
// Example usage of the YpApiActionDialog component
const dialog = document.createElement('yp-api-action-dialog');
dialog.setup(
  'deleteItem',
  'Are you sure you want to delete this item?',
  (response) => console.log('Action finished:', response),
  'Confirm Delete'
);
document.body.appendChild(dialog);
dialog.open({ finalDeleteWarning: true });
```