# YpConfirmationDialog

A custom web component that provides a confirmation dialog with optional final warning and cancel button visibility.

## Properties

| Name                  | Type       | Description                                                                 |
|-----------------------|------------|-----------------------------------------------------------------------------|
| confirmationText      | string \| undefined | The text to display in the confirmation dialog.                                |
| onConfirmedFunction   | Function \| undefined | A callback function to execute when the confirmation is accepted.              |
| useFinalWarning       | boolean    | Indicates whether a final warning should be issued before confirming.         |
| haveIssuedFinalWarning| boolean    | Tracks whether the final warning has been issued.                             |
| hideCancel            | boolean    | Determines whether the cancel button should be hidden in the dialog.          |

## Methods

| Name               | Parameters                                                                 | Return Type | Description                                                                 |
|--------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| _close             | None                                                                       | void        | Fires a global event indicating the dialog has been closed.                 |
| render             | None                                                                       | TemplateResult | Renders the HTML template for the dialog.                                    |
| _reset             | None                                                                       | void        | Resets the dialog properties to their default values and closes the dialog. |
| open               | confirmationText: string, onConfirmedFunction: Function \| undefined, useModal: boolean, useFinalWarning: boolean, hideCancel: boolean | Promise<void> | Opens the dialog with specified options and fires a global event.           |
| _confirm           | None                                                                       | void        | Handles the confirmation action, issuing a final warning if necessary.      |

## Events

- **yp-dialog-closed**: Emitted when the dialog is closed.
- **yp-dialog-opened**: Emitted when the dialog is opened.

## Examples

```typescript
// Example usage of the YpConfirmationDialog component
const dialog = document.createElement('yp-confirmation-dialog');
dialog.open(
  "Are you sure you want to proceed?",
  () => console.log("Confirmed!"),
  false,
  true,
  false
);
document.body.appendChild(dialog);
```