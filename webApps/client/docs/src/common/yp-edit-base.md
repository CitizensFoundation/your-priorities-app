# YpEditBase

`YpEditBase` is an abstract class that extends `YpBaseElement` and provides a base for creating editable components. It includes properties and methods for handling the editing process, such as setting up the form, responding to form submissions, and managing image uploads.

## Properties

| Name                     | Type                                                         | Description                                                                 |
|--------------------------|--------------------------------------------------------------|-----------------------------------------------------------------------------|
| new                      | Boolean                                                      | Indicates whether the item is new and should be created or is existing and should be updated. |
| editHeaderText           | String \| undefined                                          | The header text to display in the edit dialog.                              |
| saveText                 | String \| undefined                                          | The text for the save button, which can change depending on the edit state. |
| snackbarText             | String \| undefined                                          | The text to display in a snackbar notification after an action.             |
| params                   | Record<string, string\|boolean\|number\|object> \| undefined | Parameters to pass to the edit form.                                        |
| method                   | String                                                       | The HTTP method to use when submitting the form, typically 'POST' or 'PUT'. |
| refreshFunction          | Function \| undefined                                        | A function to call to refresh data after form submission.                   |
| uploadedLogoImageId      | number \| undefined                                          | The ID of the uploaded logo image.                                          |
| imagePreviewUrl          | string \| undefined                                          | The URL for previewing the uploaded image.                                  |
| uploadedHeaderImageId    | number \| undefined                                          | The ID of the uploaded header image.                                        |
| uploadedDefaultDataImageId | number \| undefined                                        | The ID of the uploaded default data image.                                  |
| uploadedDefaultPostImageId | number \| undefined                                        | The ID of the uploaded default post image.                                  |

## Methods

| Name                | Parameters                                      | Return Type | Description                                                                 |
|---------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| customRedirect      | unknown: YpDatabaseItem                         | void        | A method for subclassing to handle custom redirection after form submission. |
| setupAfterOpen      | params?: YpEditFormParams                       | void        | A method for subclassing to perform setup after the edit dialog is opened.  |
| customFormResponse  | event?: CustomEvent                             | void        | A method for subclassing to handle custom form responses.                   |
| clear               |                                                 | void        | Abstract method that should be implemented to clear the form fields.        |
| setupTranslation    |                                                 | void        | Abstract method that should be implemented to set up translations.          |
| updated             | changedProperties: Map<string\|number\|symbol, unknown> | void | Overrides the `updated` method to handle changes in properties.             |
| connectedCallback   |                                                 | void        | Overrides the `connectedCallback` method to add event listeners.            |
| disconnectedCallback|                                                 | void        | Overrides the `disconnectedCallback` method to remove event listeners.      |
| open                | newItem: boolean, params: Record<string, string\|boolean\|number\|object> | Promise<void> | Opens the edit dialog with the provided parameters.                         |
| close               |                                                 | void        | Closes the edit dialog.                                                     |

## Events (if any)

- **yp-form-response**: Emitted when the form response is received. The event detail contains the response data.

## Examples

```typescript
// Example usage of YpEditBase in a subclass
class MyEditComponent extends YpEditBase {
  // Implement abstract methods
  clear(): void {
    // Clear form fields
  }

  setupTranslation(): void {
    // Set up translations for the component
  }

  // Optionally override methods
  customRedirect(item: YpDatabaseItem): void {
    // Custom redirect logic
  }

  // Use the open method to open the edit dialog
  openEditDialog(newItem: boolean, params: Record<string, string | boolean | number | object>): void {
    this.open(newItem, params);
  }
}
```

Please note that `YpDatabaseItem`, `YpEditFormParams`, and `YpEditDialog` are not defined in the provided code snippet, so you should ensure these types are defined elsewhere in your codebase.