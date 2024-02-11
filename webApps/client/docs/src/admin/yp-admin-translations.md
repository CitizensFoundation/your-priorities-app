# YpAdminTranslations

Brief description of the class.

## Properties

| Name          | Type                                      | Description               |
|---------------|-------------------------------------------|---------------------------|
| items         | Array<YpTranslationTextData> \| undefined | Brief description.        |
| waitingOnData | Boolean                                   | Brief description.        |
| editActive    | Record<string, boolean>                   | Brief description.        |
| collection    | YpCollectionData \| undefined             | Brief description.        |
| targetLocale  | String \| undefined                       | Brief description.        |
| baseMaxLength | Number \| undefined                       | Brief description.        |

## Methods

| Name             | Parameters                            | Return Type | Description                 |
|------------------|---------------------------------------|-------------|-----------------------------|
| getTranslationText | none                                | Promise<void> | Fetches translation texts.  |
| selectLanguage   | event: CustomEvent                    | void        | Handles language selection. |
| openEdit         | item: YpTranslationTextData           | void        | Opens the edit mode for an item. |
| cancelEdit       | item: YpTranslationTextData           | void        | Cancels the edit mode for an item. |
| saveItem         | item: YpTranslationTextData, options: { saveDirectly: boolean } \| undefined | void | Saves the edited translation item. |
| autoTranslate    | item: YpTranslationTextData           | Promise<void> | Automatically translates an item. |
| getUrlFromTextType | item: YpTranslationTextData         | string \| null | Gets the URL based on text type. |
| textChanged      | event: CustomEvent                    | void        | Handles text change events. |
| renderItem       | item: YpTranslationTextData           | TemplateResult | Renders a translation item. |

## Events (if any)

- **None**: This class does not emit any custom events.

## Examples

```typescript
// Example usage of YpAdminTranslations
// Assuming you have a LitElement environment set up and the custom element 'yp-admin-translations' is registered

// Add the 'yp-admin-translations' element to your HTML
<html>
  <body>
    <yp-admin-translations></yp-admin-translations>
  </body>
</html>

// In your TypeScript file, you can interact with the element's properties and methods
const translationsComponent = document.querySelector('yp-admin-translations');

// Set properties
translationsComponent.items = [
  {
    indexKey: 'exampleKey',
    contentId: 1,
    originalText: 'Original text',
    textType: 'postContent',
    translatedText: 'Translated text',
    extraId: null,
    targetLocale: 'en'
  }
];
translationsComponent.waitingOnData = true; // Show loading indicator
translationsComponent.targetLocale = 'en'; // Set target locale for translations

// Call methods
translationsComponent.getTranslationText(); // Fetch translation texts
translationsComponent.selectLanguage(new CustomEvent('language-select', { detail: { value: 'en' } })); // Select a language
translationsComponent.openEdit(translationsComponent.items[0]); // Open edit mode for the first item
translationsComponent.cancelEdit(translationsComponent.items[0]); // Cancel edit mode for the first item
translationsComponent.saveItem(translationsComponent.items[0]); // Save the first item
translationsComponent.autoTranslate(translationsComponent.items[0]); // Auto-translate the first item
```
