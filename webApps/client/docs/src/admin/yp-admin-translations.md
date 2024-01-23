# YpAdminTranslations

This class is a custom element that extends `YpAdminPage` and is responsible for managing translation texts within an admin interface. It allows users to view, edit, and auto-translate texts for different content types within a collection.

## Properties

| Name            | Type                                      | Description                                                                 |
|-----------------|-------------------------------------------|-----------------------------------------------------------------------------|
| items           | Array<YpTranslationTextData> \| undefined | An array of translation text data items.                                    |
| waitingOnData   | boolean                                   | A flag indicating whether the component is waiting for data to be loaded.   |
| editActive      | Record<string, boolean>                   | A record of which items are currently being edited.                         |
| collection      | YpCollectionData \| undefined             | The collection data associated with the translations.                       |
| targetLocale    | string \| undefined                       | The target locale for which translations are being managed.                 |
| baseMaxLength   | number \| undefined                       | The base maximum length for text inputs.                                    |
| supportedLanguages | Record<string, string>                  | A record of supported languages with their locale codes as keys.            |

## Methods

| Name            | Parameters                          | Return Type | Description                                                                 |
|-----------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| getTranslationText | none                              | Promise<void> | Fetches translation texts for the current collection and target locale.     |
| selectLanguage  | event: CustomEvent                  | void        | Handles the language selection event and fetches translation texts.         |
| openEdit        | item: YpTranslationTextData         | void        | Activates edit mode for a given translation text item.                      |
| cancelEdit      | item: YpTranslationTextData         | void        | Cancels edit mode for a given translation text item.                        |
| saveItem        | item: YpTranslationTextData, options: { saveDirectly: boolean } \| undefined | void | Saves the edited translation text item.                                    |
| autoTranslate   | item: YpTranslationTextData         | Promise<void> | Automatically translates a given translation text item.                     |
| getUrlFromTextType | item: YpTranslationTextData      | string \| null | Determines the API URL based on the text type of the translation item.     |
| getMaxLength    | item: YpTranslationTextData, baseLength: number | number | Calculates the maximum length for a text input based on the text type.     |
| textChanged     | event: CustomEvent                  | void        | Handles changes to the text input and adjusts the maximum length if needed. |
| renderItem      | item: YpTranslationTextData         | TemplateResult | Renders a single translation text item.                                    |

## Events

- **None specified**

## Examples

```typescript
// Example usage of the YpAdminTranslations custom element
<yp-admin-translations></yp-admin-translations>
```

Please note that the actual usage of this custom element would involve more setup, including providing the necessary properties such as `collection`, `targetLocale`, and others, as well as integrating with the backend API for fetching and updating translation texts.