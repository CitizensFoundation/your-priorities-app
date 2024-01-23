# YpConfirmationDialog

`YpConfirmationDialog` is a custom web component that extends `YpBaseElement` to create a confirmation dialog. It uses Material Web components to render a dialog with customizable confirmation text and actions.

## Properties

| Name                  | Type                      | Description                                                                 |
|-----------------------|---------------------------|-----------------------------------------------------------------------------|
| confirmationText      | string \| undefined       | The text to display in the confirmation dialog.                             |
| onConfirmedFunction   | Function \| undefined     | The function to call when the confirmation action is confirmed.             |
| useFinalWarning       | boolean                   | A flag to determine if a final warning should be used before confirmation.  |
| haveIssuedFinalWarning| boolean                   | Indicates if the final warning has already been issued.                     |
| hideCancel            | boolean                   | A flag to determine if the cancel button should be hidden.                  |

## Methods

| Name   | Parameters                                                                 | Return Type | Description                                                                                   |
|--------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------------------------|
| open   | confirmationText: string, onConfirmedFunction: Function \| undefined, useModal: boolean = false, useFinalWarning: boolean = false, hideCancel: boolean = false | Promise<void> | Opens the confirmation dialog with the provided parameters.                                    |
| _reset | -                                                                          | void        | Resets the dialog properties to their default states and closes the dialog.                   |
| _confirm | -                                                                        | void        | Handles the confirmation action, potentially issuing a final warning before calling the provided confirmation function and resetting the dialog. |

## Events

- **None**

## Examples

```typescript
// Example usage of YpConfirmationDialog
const dialog = document.createElement('yp-confirmation-dialog') as YpConfirmationDialog;

// Set properties
dialog.confirmationText = "Are you sure you want to proceed?";
dialog.onConfirmedFunction = () => console.log("Confirmed!");

// Open the dialog
dialog.open("Are you sure you want to proceed?", () => console.log("Confirmed!"));

// Optionally, you can specify additional parameters
dialog.open("Are you sure you want to delete?", () => console.log("Deleted!"), false, true, false);
```

Please note that the `open` method is asynchronous and returns a `Promise<void>`, which means you may need to await it or handle it with `.then()` if you need to perform actions after the dialog has opened. The `_reset` and `_confirm` methods are intended for internal use and are prefixed with an underscore to indicate that they are private methods.