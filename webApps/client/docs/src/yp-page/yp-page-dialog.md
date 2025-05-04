# YpPageDialog

A custom dialog web component for displaying help pages with support for multiple languages, modal behavior, and customizable actions. Extends `YpBaseElement` and uses Material Web Components for dialog and buttons.

## Properties

| Name           | Type                        | Description                                                                 |
|----------------|----------------------------|-----------------------------------------------------------------------------|
| dialogTitle    | string \| undefined        | The title of the dialog.                                                    |
| page           | YpHelpPageData \| undefined| The help page data to display in the dialog.                                |
| textButtonText | string \| undefined        | The text for the main action button in the dialog.                          |
| modal          | boolean                    | If true, disables closing the dialog by clicking the scrim (default: false).|
| closeFunction  | Function \| undefined      | Optional function to call when the dialog is closed.                        |

## Methods

| Name                | Parameters                                                                                                                                         | Return Type | Description                                                                                                 |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|-------------|-------------------------------------------------------------------------------------------------------------|
| scrimDisableAction  | event: CustomEvent<any>                                                                                                                            | void        | Prevents dialog from closing via scrim if `modal` is true.                                                  |
| render              | None                                                                                                                                               | unknown     | Renders the dialog template.                                                                                |
| _switchLanguage     | None                                                                                                                                               | void        | Switches the language between "en" and "is", updates locale, and logs the activity.                         |
| pageTitle           | None (getter)                                                                                                                                      | string      | Returns the localized title of the current page, or an empty string if no page is set.                      |
| open                | page: YpHelpPageData, language: string, closeFunction?: Function, textButtonText?: string, modal?: boolean                                         | Promise<void>| Opens the dialog with the specified page, language, optional close function, button text, and modal option. |
| _close              | None                                                                                                                                               | void        | Closes the dialog, clears content, logs the activity, and calls the close function if provided.             |

## Examples

```typescript
import "./yp-page-dialog.js";

const dialog = document.createElement("yp-page-dialog") as any;
document.body.appendChild(dialog);

const helpPage: YpHelpPageData = {
  title: { en: "Help", is: "Hjálp" },
  content: { en: "<p>English help content</p>", is: "<p>Íslenskt hjálparefni</p>" }
};

dialog.open(helpPage, "en", () => {
  console.log("Dialog closed");
}, "Got it!", true);
```
