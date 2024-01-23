# YpApiActionDialog

`YpApiActionDialog` is a custom web component that extends `YpBaseElement` to create a dialog for confirming actions, such as deletions. It uses Material Design components and provides a way to display a confirmation text, a cancel button, and a confirm button with customizable text. It also supports a final delete warning mechanism.

## Properties

| Name                | Type                  | Description                                                                 |
|---------------------|-----------------------|-----------------------------------------------------------------------------|
| action              | string \| undefined   | The API action to be confirmed.                                              |
| method              | string \| undefined   | The HTTP method to be used for the API action.                              |
| confirmationText    | string \| undefined   | The text to be displayed in the dialog as the confirmation message.         |
| confirmButtonText   | string \| undefined   | The text to be displayed on the confirm button.                             |
| onFinishedFunction  | Function \| undefined | A callback function to be called after the action is confirmed.             |
| finalDeleteWarning  | boolean               | A flag indicating whether a final delete warning should be displayed or not.|

## Methods

| Name       | Parameters                                    | Return Type | Description                                                                                   |
|------------|-----------------------------------------------|-------------|-----------------------------------------------------------------------------------------------|
| setup      | action: string, confirmationText: string, onFinishedFunction: Function \| undefined, confirmButtonText: string \| undefined, method: string \| undefined | void        | Sets up the dialog with the specified parameters.                                             |
| open       | options: { finalDeleteWarning: boolean } \| undefined | Promise<void> | Opens the dialog with an optional parameter to display a final delete warning.                |
| _delete    | -                                             | Promise<void> | Handles the deletion action, calls the API, and invokes the onFinishedFunction if provided.   |
| _onClose   | -                                             | void        | Emits a "close" event when the dialog is closed.                                              |

## Events

- **close**: Emitted when the dialog is closed.
- **api-action-finished**: Emitted after the API action is finished.

## Examples

```typescript
// Example usage of YpApiActionDialog
const dialog = document.createElement('yp-api-action-dialog');
dialog.setup(
  'deleteItem',
  'Are you sure you want to delete this item?',
  (response) => { console.log('Item deleted:', response); },
  'Delete',
  'DELETE'
);
document.body.appendChild(dialog);
dialog.open();
```

Please note that the `_delete` and `_onClose` methods are prefixed with an underscore, indicating that they are intended to be private methods and should not be called directly from outside the class. However, they are included in the documentation as they are part of the class definition.