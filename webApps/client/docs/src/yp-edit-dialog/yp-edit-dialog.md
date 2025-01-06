# YpEditDialog

The `YpEditDialog` class is a custom web component that extends `YpBaseElement`. It provides a dialog interface for editing forms with various properties and methods to handle form submission, validation, and user interactions.

## Properties

| Name                      | Type                      | Description                                                                 |
|---------------------------|---------------------------|-----------------------------------------------------------------------------|
| `action`                  | `string \| undefined`     | The action URL for form submission.                                         |
| `tablet`                  | `boolean`                 | Indicates if the device is a tablet.                                        |
| `baseAction`              | `string \| undefined`     | The base action URL used for constructing the final action URL.             |
| `cancelText`              | `string \| undefined`     | Text for the cancel button.                                                 |
| `buttonText`              | `string \| undefined`     | Text for the button.                                                        |
| `method`                  | `string`                  | HTTP method for form submission, default is "POST".                         |
| `customValidationFunction`| `Function \| undefined`   | Custom function for form validation.                                        |
| `errorText`               | `string \| undefined`     | Text to display in case of an error.                                        |
| `snackbarText`            | `string \| undefined`     | Text for the snackbar notification.                                         |
| `snackbarTextCombined`    | `string \| undefined`     | Combined text for the snackbar notification.                                |
| `saveText`                | `string \| undefined`     | Text for the save button.                                                   |
| `response`                | `object \| undefined`     | The response object from form submission.                                   |
| `params`                  | `YpEditFormParams \| undefined` | Parameters for the form.                                               |
| `doubleWidth`             | `boolean`                 | Indicates if the dialog should be double width.                             |
| `icon`                    | `string \| undefined`     | Icon to display in the dialog.                                              |
| `opened`                  | `boolean`                 | Indicates if the dialog is open.                                            |
| `useNextTabAction`        | `boolean`                 | Indicates if the next tab action should be used.                            |
| `nextActionText`          | `string \| undefined`     | Text for the next action button.                                            |
| `uploadingState`          | `boolean`                 | Indicates if a file upload is in progress.                                  |
| `disableDialog`           | `boolean`                 | Indicates if the dialog is disabled.                                        |
| `confirmationText`        | `string \| undefined`     | Text for confirmation before submission.                                    |
| `heading`                 | `string`                  | The heading text for the dialog.                                            |
| `name`                    | `string \| undefined`     | The name of the dialog.                                                     |
| `customSubmit`            | `boolean`                 | Indicates if a custom submit action is used.                                |
| `hideAllActions`          | `boolean`                 | Indicates if all actions should be hidden.                                  |

## Methods

| Name                  | Parameters                          | Return Type | Description                                                                 |
|-----------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| `renderMobileView`    | `()`                                | `TemplateResult` | Renders the mobile view of the dialog.                                      |
| `renderDesktopView`   | `()`                                | `TemplateResult` | Renders the desktop view of the dialog.                                     |
| `render`              | `()`                                | `TemplateResult` | Renders the dialog based on the current state.                              |
| `narrow`              | `()`                                | `boolean`   | Determines if the dialog should be in narrow mode.                          |
| `scrollResize`        | `()`                                | `void`      | Handles scroll resize events.                                               |
| `updated`             | `changedProperties: Map<string \| number \| symbol, unknown>` | `void` | Lifecycle method called when properties are updated.                        |
| `_fileUploadStarting` | `()`                                | `void`      | Handles the start of a file upload.                                         |
| `_fileUploadComplete` | `()`                                | `void`      | Handles the completion of a file upload.                                    |
| `_nextTab`            | `()`                                | `void`      | Fires the "next-tab-action" event.                                          |
| `computeClass`        | `()`                                | `string`    | Computes the CSS class for the dialog based on its state.                   |
| `connectedCallback`   | `()`                                | `void`      | Lifecycle method called when the element is added to the document.          |
| `disconnectedCallback`| `()`                                | `void`      | Lifecycle method called when the element is removed from the document.      |
| `open`                | `()`                                | `void`      | Opens the dialog.                                                           |
| `close`               | `()`                                | `void`      | Closes the dialog.                                                          |
| `_formSubmitted`      | `()`                                | `void`      | Handles form submission events.                                             |
| `_formResponse`       | `event: CustomEvent`                | `void`      | Handles form response events.                                               |
| `_formError`          | `event: CustomEvent`                | `void`      | Handles form error events.                                                  |
| `_formInvalid`        | `()`                                | `void`      | Handles form invalid events.                                                |
| `submit`              | `()`                                | `void`      | Submits the form.                                                           |
| `_setSubmitDisabledStatus` | `status: boolean`              | `void`      | Sets the disabled status of the submit buttons.                             |
| `hasLongSaveText`     | `()`                                | `boolean`   | Checks if the save text is long.                                            |
| `hasLongTitle`        | `()`                                | `boolean`   | Checks if the title is long.                                                |
| `_reallySubmit`       | `validate: boolean = true`          | `Promise<void>` | Submits the form with optional validation.                                  |
| `submitForce`         | `()`                                | `void`      | Forces the form to submit.                                                  |
| `getForm`             | `()`                                | `YpForm`    | Returns the form element.                                                   |
| `stopSpinner`         | `()`                                | `void`      | Stops the spinner.                                                          |
| `validate`            | `()`                                | `void`      | Validates the form.                                                         |
| `_showErrorDialog`    | `errorText: string`                 | `void`      | Shows an error dialog with the specified text.                              |
| `_clearErrorText`     | `()`                                | `void`      | Clears the error text and closes the error dialog.                          |

## Events

- **next-tab-action**: Emitted when the next tab action is triggered.
- **yp-open-toast**: Emitted to open a toast notification with a message.
- **yp-form-invalid**: Emitted when the form is invalid.
- **yp-custom-form-submit**: Emitted for custom form submission handling.

## Examples

```typescript
// Example usage of the YpEditDialog component
const dialog = document.createElement('yp-edit-dialog');
dialog.heading = 'Edit Item';
dialog.action = '/submit-form';
dialog.saveText = 'Save Changes';
document.body.appendChild(dialog);
dialog.open();
```