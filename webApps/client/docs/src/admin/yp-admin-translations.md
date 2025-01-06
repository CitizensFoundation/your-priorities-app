# YpAdminTranslations

The `YpAdminTranslations` class is a web component that extends `YpAdminPage` and is used for managing translations in an admin interface. It provides functionality to view, edit, and auto-translate text items for different languages.

## Properties

| Name            | Type                              | Description                                                                 |
|-----------------|-----------------------------------|-----------------------------------------------------------------------------|
| items           | Array<YpTranslationTextData> \| undefined | An array of translation text data items to be managed.                       |
| waitingOnData   | boolean                           | Indicates whether the component is waiting for data to be loaded.           |
| editActive      | Record<string, boolean>           | A record to track which items are currently being edited.                   |
| collection      | YpCollectionData \| undefined     | The collection data associated with the translations.                       |
| targetLocale    | string \| undefined               | The target locale for translations.                                         |
| baseMaxLength   | number \| undefined               | The base maximum length for text fields, adjusted based on content.         |
| supportedLanguages | YpLanguageData[]               | An array of supported languages for translation.                            |

## Methods

| Name              | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| getTranslationText | None                                                                      | Promise<void> | Fetches translation text data for the specified collection and locale.      |
| connectedCallback | None                                                                      | void        | Lifecycle method called when the component is added to the document.        |
| selectLanguage    | event: CustomEvent                                                        | void        | Handles language selection changes and fetches translation text.            |
| openEdit          | item: YpTranslationTextData                                               | void        | Opens the edit mode for a specific translation item.                        |
| cancelEdit        | item: YpTranslationTextData                                               | void        | Cancels the edit mode for a specific translation item.                      |
| saveItem          | item: YpTranslationTextData, options?: { saveDirectly: boolean }          | void        | Saves the edited translation item, optionally saving directly.              |
| autoTranslate     | item: YpTranslationTextData                                               | Promise<void> | Automatically translates a specific item using an external API.             |
| getUrlFromTextType | item: YpTranslationTextData                                               | string \| null | Constructs a URL based on the text type of the item for translation.        |
| languages         | None                                                                      | YpLanguageMenuItem[] | Returns a sorted list of language menu items, highlighting specific locales. |
| getMaxLength      | item: YpTranslationTextData, baseLength: number                           | number      | Determines the maximum length for a text field based on the item type.      |
| textChanged       | event: CustomEvent                                                        | void        | Handles changes in text fields and adjusts the maximum length accordingly.  |
| renderItem        | item: YpTranslationTextData                                               | TemplateResult | Renders a translation item with options to edit or auto-translate.          |
| render            | None                                                                      | TemplateResult | Renders the component's template, including language selection and items.   |

## Examples

```typescript
// Example usage of the YpAdminTranslations component
import './yp-admin-translations.js';

const translationsComponent = document.createElement('yp-admin-translations');
document.body.appendChild(translationsComponent);
```