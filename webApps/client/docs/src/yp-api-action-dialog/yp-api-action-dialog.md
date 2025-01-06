# YpApiActionDialog

A custom dialog component for confirming API actions, extending the `YpBaseElement`.

## Properties

| Name                | Type       | Description                                                                 |
|---------------------|------------|-----------------------------------------------------------------------------|
| action              | string \| undefined | The API action to be confirmed.                                             |
| method              | string \| undefined | The HTTP method to be used for the API action. Defaults to "DELETE".        |
| confirmationText    | string \| undefined | The text displayed in the dialog to confirm the action.                     |
| confirmButtonText   | string \| undefined | The text for the confirmation button. Defaults to "delete" if not provided. |
| onFinishedFunction  | Function \| undefined | A callback function to be executed after the API action is completed.       |
| finalDeleteWarning  | boolean    | Indicates if a final delete warning should be shown. Defaults to `false`.     |

## Methods

| Name              | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| setup             | action: string, confirmationText: string, onFinishedFunction: Function \| undefined = undefined, confirmButtonText: string \| undefined = undefined, method: string \| undefined = undefined | void        | Configures the dialog with the specified action, confirmation text, and optional parameters. |
| open              | options: { finalDeleteWarning: boolean } \| undefined = undefined          | Promise<void> | Opens the dialog, optionally showing a final delete warning.                |
| _delete           | None                                                                       | Promise<void> | Executes the delete action, confirming with the user if necessary.          |
| _onClose          | None                                                                       | void        | Fires a "close" event when the dialog is closed.                            |

## Examples

```typescript
// Example usage of the YpApiActionDialog component
const dialog = document.createElement('yp-api-action-dialog') as YpApiActionDialog;
dialog.setup('deleteItem', 'Are you sure you want to delete this item?', (response) => {
  console.log('Action finished:', response);
});
document.body.appendChild(dialog);
dialog.open({ finalDeleteWarning: true });
```