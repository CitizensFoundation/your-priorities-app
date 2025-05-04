# YpConfirmationDialog

A confirmation dialog web component built with Lit and Material Web Components. It displays a customizable confirmation message, supports a final warning step, and allows for custom confirmation callbacks. The dialog can optionally hide the cancel button and emits global events when opened or closed.

## Properties

| Name                  | Type                | Description                                                                 |
|-----------------------|---------------------|-----------------------------------------------------------------------------|
| confirmationText      | string \| undefined | The text to display as the confirmation message in the dialog.              |
| onConfirmedFunction   | Function \| undefined | The function to call when the user confirms the action.                     |
| useFinalWarning       | boolean             | If true, a final warning step is shown before confirmation.                 |
| haveIssuedFinalWarning| boolean             | Tracks if the final warning has already been shown.                         |
| hideCancel            | boolean             | If true, hides the cancel button in the dialog.                             |

## Methods

| Name         | Parameters                                                                                                                                         | Return Type | Description                                                                                      |
|--------------|----------------------------------------------------------------------------------------------------------------------------------------------------|-------------|--------------------------------------------------------------------------------------------------|
| _close       | none                                                                                                                                               | void        | Fires the global event `yp-dialog-closed` when the dialog is closed.                             |
| render       | none                                                                                                                                               | unknown     | Renders the dialog template.                                                                     |
| _reset       | none                                                                                                                                               | void        | Resets the dialog state and closes the dialog.                                                   |
| open         | confirmationText: string, onConfirmedFunction: Function \| undefined, useModal?: boolean, useFinalWarning?: boolean, hideCancel?: boolean          | Promise<void> | Opens the dialog with the provided parameters and fires the global event `yp-dialog-opened`.      |
| _confirm     | none                                                                                                                                               | void        | Handles the confirmation action, including final warning logic and calling the confirmation function. |

## Events

- **yp-dialog-closed**: Emitted globally when the dialog is closed.
- **yp-dialog-opened**: Emitted globally when the dialog is opened.

## Examples

```typescript
import "./yp-confirmation-dialog.js";

const dialog = document.createElement("yp-confirmation-dialog") as any;
document.body.appendChild(dialog);

dialog.open(
  "Are you sure you want to delete this item?",
  () => { console.log("Confirmed!"); },
  false, // useModal
  true,  // useFinalWarning
  false  // hideCancel
);
```
