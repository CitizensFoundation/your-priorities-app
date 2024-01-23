# YpEditDialog

This class represents a custom element that provides a dialog interface for editing content. It extends `YpBaseElement` and integrates with various Material Design components to create a responsive and interactive user interface.

## Properties

| Name                      | Type                          | Description                                                                 |
|---------------------------|-------------------------------|-----------------------------------------------------------------------------|
| action                    | string \| undefined           | The action URL for the form submission.                                     |
| tablet                    | boolean                       | Indicates if the device is a tablet.                                        |
| baseAction                | string \| undefined           | The base action URL for form submission, before adding specific parameters. |
| cancelText                | string \| undefined           | The text for the cancel button.                                             |
| buttonText                | string \| undefined           | The text for the button.                                                    |
| method                    | string                        | The HTTP method for form submission (e.g., "POST").                         |
| customValidationFunction  | Function \| undefined         | A custom validation function for the form.                                  |
| errorText                 | string \| undefined           | The text to display when there is an error.                                 |
| snackbarText              | string \| undefined           | The text to display in a snackbar notification.                             |
| snackbarTextCombined      | string \| undefined           | Combined text for the snackbar notification.                                |
| saveText                  | string \| undefined           | The text for the save button.                                               |
| response                  | object \| undefined           | The response object from the form submission.                               |
| params                    | YpEditFormParams \| undefined | Additional parameters for the form submission.                              |
| doubleWidth               | boolean                       | Indicates if the dialog should be double width.                             |
| icon                      | string \| undefined           | The icon to display in the dialog.                                          |
| opened                    | boolean                       | Indicates if the dialog is currently open.                                  |
| useNextTabAction          | boolean                       | Indicates if the next tab action should be used.                            |
| nextActionText            | string \| undefined           | The text for the next action button.                                        |
| uploadingState            | boolean                       | Indicates if a file upload is in progress.                                  |
| confirmationText          | string \| undefined           | The text for the confirmation dialog.                                       |
| heading                   | string                        | The heading text for the dialog.                                            |
| name                      | string \| undefined           | The name of the dialog.                                                     |
| customSubmit              | boolean                       | Indicates if a custom submit action should be used.                         |

## Methods

| Name                    | Parameters | Return Type | Description                                                                 |
|-------------------------|------------|-------------|-----------------------------------------------------------------------------|
| renderMobileView        | -          | TemplateResult | Renders the mobile view of the dialog.                                      |
| renderDesktopView       | -          | TemplateResult | Renders the desktop view of the dialog.                                     |
| render                  | -          | TemplateResult | Renders the dialog.                                                         |
| scrollResize            | -          | void        | Handles resizing of the scrollable area.                                    |
| updated                 | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method called after the element’s properties have changed.       |
| _fileUploadStarting     | -          | void        | Sets the uploading state to true.                                           |
| _fileUploadComplete     | -          | void        | Sets the uploading state to false.                                          |
| _nextTab                | -          | void        | Emits an event to navigate to the next tab.                                 |
| computeClass            | -          | string      | Computes the class for the dialog based on its state.                       |
| connectedCallback       | -          | void        | Lifecycle method called when the element is added to the document’s DOM.    |
| disconnectedCallback    | -          | void        | Lifecycle method called when the element is removed from the document’s DOM.|
| open                    | -          | void        | Opens the dialog.                                                           |
| close                   | -          | void        | Closes the dialog.                                                          |
| _formSubmitted          | -          | void        | Handles the form submission event.                                          |
| _formResponse           | event: CustomEvent | void | Handles the form response event.                                            |
| _formError              | event: CustomEvent | void | Handles the form error event.                                               |
| _formInvalid            | -          | void        | Handles the form invalid event.                                              |
| _submit                 | -          | void        | Submits the form or opens a confirmation dialog if needed.                  |
| _setSubmitDisabledStatus| status: boolean | void | Sets the disabled status of the submit buttons.                             |
| _reallySubmit           | validate: boolean = true | Promise<void> | Submits the form after validation.                                         |
| submitForce             | -          | void        | Forces the form submission.                                                  |
| getForm                 | -          | YpForm \| null | Returns the form element.                                                   |
| stopSpinner             | -          | void        | Stops the spinner animation.                                                |
| validate                | -          | void        | Validates the form.                                                         |
| _showErrorDialog        | errorText: string | void | Shows the error dialog with the provided text.                              |
| _clearErrorText         | -          | void        | Clears the error text and closes the error dialog.                          |

## Events (if any)

- **yp-dialog-closed**: Emitted when the dialog is closed.
- **yp-form-submit**: Emitted when the form is submitted.
- **yp-form-response**: Emitted when a response is received after form submission.
- **yp-form-error**: Emitted when there is an error during form submission.
- **yp-form-invalid**: Emitted when the form is invalid.
- **file-upload-starting**: Emitted when a file upload is starting.
- **file-upload-complete**: Emitted when a file upload is complete.
- **yp-custom-form-submit**: Emitted when a custom form submission is triggered.
- **yp-open-toast**: Emitted to open a toast notification with the provided text.
- **next-tab-action**: Emitted to navigate to the next tab.

## Examples

```typescript
// Example usage of the YpEditDialog
const editDialog = document.createElement('yp-edit-dialog');
editDialog.action = '/api/save';
editDialog.heading = 'Edit Profile';
editDialog.opened = true;
document.body.appendChild(editDialog);
```

Note: The actual usage of the `YpEditDialog` would involve more setup, including providing the form content via slots, setting up event listeners, and handling the form submission and response.