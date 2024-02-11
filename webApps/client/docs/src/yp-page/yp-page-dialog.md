# YpPageDialog

The `YpPageDialog` class is a custom element that extends `YpBaseElement` to create a dialog component. It uses Material Web components to render a dialog with a title, content, and actions. The dialog can be modal and its content is dynamically set based on the provided page data.

## Properties

| Name            | Type                      | Description                                           |
|-----------------|---------------------------|-------------------------------------------------------|
| dialogTitle     | string \| undefined       | The title of the dialog.                              |
| page            | YpHelpPageData \| undefined | The data object containing the content for the dialog.|
| textButtonText  | string \| undefined       | The text to display on the button in the dialog.      |
| modal           | boolean                   | Whether the dialog is modal or not.                   |
| closeFunction   | Function \| undefined     | A function to call when the dialog is closed.         |

## Methods

| Name                | Parameters                                  | Return Type | Description                                                                 |
|---------------------|---------------------------------------------|-------------|-----------------------------------------------------------------------------|
| scrimDisableAction  | event: CustomEvent<any>                     | void        | Prevents closing the dialog if it is modal by stopping event propagation.   |
| render              | -                                           | TemplateResult | Renders the dialog with its content, actions, and optional title and icon. |
| _switchLanguage     | -                                           | void        | Switches the language of the dialog content.                                |
| pageTitle           | -                                           | string      | Returns the title of the page based on the current language.                |
| open                | page: YpHelpPageData, language: string, closeFunction: Function \| undefined, textButtonText: string \| undefined, modal: boolean | Promise<void> | Opens the dialog with the specified content and settings.                   |
| _close              | -                                           | void        | Closes the dialog and clears its content.                                   |

## Events

- **cancel**: Emitted when an attempt is made to close the dialog. If the dialog is modal, this event is intercepted to prevent closing.

## Examples

```typescript
// Example usage of the YpPageDialog
const dialog = document.createElement('yp-page-dialog');
dialog.open(pageData, 'en', () => console.log('Dialog closed'), 'OK', true);
document.body.appendChild(dialog);
```

Please note that the `YpHelpPageData` type is referenced in the properties but not defined in the provided code. You should ensure that this type is defined elsewhere in your codebase for the documentation to be accurate.