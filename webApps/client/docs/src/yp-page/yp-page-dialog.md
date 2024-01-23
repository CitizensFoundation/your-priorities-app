# YpPageDialog

The `YpPageDialog` class is a custom element that extends `YpBaseElement` to create a dialog component. It uses Material Web components to render a dialog with a title, content, and actions. The dialog can be modal and can have custom text for the close button.

## Properties

| Name            | Type                     | Description                                                                 |
|-----------------|--------------------------|-----------------------------------------------------------------------------|
| dialogTitle     | string \| undefined      | The title of the dialog.                                                    |
| page            | YpHelpPageData \| undefined | Data for the help page to be displayed in the dialog.                      |
| textButtonText  | string \| undefined      | Custom text for the text button in the dialog actions.                      |
| modal           | boolean                  | Determines if the dialog should behave as a modal, preventing interaction with the background. |

## Methods

| Name                | Parameters                        | Return Type | Description                                                                 |
|---------------------|-----------------------------------|-------------|-----------------------------------------------------------------------------|
| scrimDisableAction  | event: CustomEvent<any>           | void        | Prevents closing the dialog when clicking on the scrim if the dialog is modal. |
| render              | -                                 | TemplateResult | Renders the dialog with its content and actions.                           |
| _switchLanguage     | -                                 | void        | Switches the language of the dialog content.                                |
| pageTitle           | -                                 | string      | Returns the title of the page based on the current language.                |
| open                | page: YpHelpPageData, language: string, closeFunction: Function \| undefined, textButtonText: string \| undefined, modal: boolean | Promise<void> | Opens the dialog with the specified content and settings.                  |
| _close              | -                                 | void        | Closes the dialog and clears its content.                                   |

## Events (if any)

- **cancel**: Emitted when the user attempts to close the dialog by clicking on the scrim. If the dialog is modal, this event is stopped and prevented from closing the dialog.

## Examples

```typescript
// Example usage of the YpPageDialog
const dialog = document.createElement('yp-page-dialog') as YpPageDialog;
document.body.appendChild(dialog);

const helpPageData: YpHelpPageData = {
  title: {
    en: 'Help Page Title',
    es: 'Título de la página de ayuda'
  },
  content: {
    en: 'Help page content in English',
    es: 'Contenido de la página de ayuda en español'
  }
};

dialog.open(helpPageData, 'en', () => console.log('Dialog closed'), 'Close', true);
```