# YpLanguageSelector

The `YpLanguageSelector` is a web component that allows users to select a language from a list of available languages. It provides features such as autocomplete for language selection, auto-translation options, and the ability to save the selected language locale.

## Properties

| Name                        | Type      | Description                                                                 |
|-----------------------------|-----------|-----------------------------------------------------------------------------|
| `refreshLanguages`          | Boolean   | Indicates whether the language list should be refreshed.                    |
| `noUserEvents`              | Boolean   | If true, user events are not triggered.                                     |
| `selectedLocale`            | String    | The currently selected locale.                                              |
| `value`                     | String    | The value of the selected language.                                         |
| `autocompleteText`          | String    | The text used for filtering languages in autocomplete.                      |
| `name`                      | String    | The name attribute for the component.                                       |
| `autoTranslateOptionDisabled` | Boolean | Disables the auto-translate option if true.                                 |
| `autoTranslate`             | Boolean   | Indicates whether auto-translation is enabled.                              |
| `dropdownVisible`           | Boolean   | Controls the visibility of the language dropdown.                           |
| `hasServerAutoTranslation`  | Boolean   | Indicates if server-side auto-translation is available.                     |
| `isOutsideChangeEvent`      | Boolean   | Tracks if the change event is triggered from outside the component.         |

## Methods

| Name                      | Parameters                                      | Return Type | Description                                                                 |
|---------------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| `updated`                 | `changedProperties: Map<string | number | symbol, unknown>` | void        | Called when the component is updated. Handles changes to `selectedLocale`.  |
| `_refreshLanguage`        |                                                 | void        | Refreshes the language list and toggles the dropdown visibility.            |
| `get styles`              |                                                 | CSSResult[] | Returns the styles for the component.                                       |
| `get foundAutoCompleteLanguages` |                                         | Array       | Filters and returns languages matching the autocomplete text.               |
| `openMenu`                |                                                 | Promise<void> | Opens the language selection menu.                                          |
| `_autoCompleteChange`     | `event: CustomEvent`                            | void        | Updates the autocomplete text based on user input.                          |
| `_selectLanguage`         | `event: CustomEvent`                            | void        | Sets the selected language based on user selection.                         |
| `renderMenuItem`          | `index: number, item: YpLanguageMenuItem`       | TemplateResult | Renders a menu item for a language.                                         |
| `renderAutoComplete`      |                                                 | TemplateResult | Renders the autocomplete text field and language menu.                      |
| `render`                  |                                                 | TemplateResult | Renders the component's template.                                           |
| `connectedCallback`       |                                                 | Promise<void> | Lifecycle method called when the component is added to the DOM.             |
| `disconnectedCallback`    |                                                 | void        | Lifecycle method called when the component is removed from the DOM.         |
| `firstUpdated`            | `_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>` | void | Called after the first update of the component.                             |
| `_autoTranslateEvent`     | `event: CustomEvent`                            | void        | Handles auto-translate events.                                              |
| `_stopTranslation`        |                                                 | void        | Stops the auto-translation process.                                         |
| `startTranslation`        |                                                 | void        | Starts the auto-translation process.                                        |
| `get canUseAutoTranslate` |                                                 | Boolean     | Determines if auto-translation can be used based on current settings.       |
| `get languages`           |                                                 | YpLanguageMenuItem[] | Returns a sorted list of available languages.                               |
| `_selectedLocaleChanged`  | `oldLocale: string`                            | void        | Handles changes to the selected locale and updates related settings.        |

## Events

- **yp-selected-locale-changed**: Emitted when the selected locale changes.
- **changed**: Emitted when the language value changes.
- **yp-language-name**: Emitted with the English name of the selected language.

## Examples

```typescript
// Example usage of the YpLanguageSelector component
import './yp-language-selector.js';

const languageSelector = document.createElement('yp-language-selector');
document.body.appendChild(languageSelector);

languageSelector.addEventListener('yp-selected-locale-changed', (event) => {
  console.log('Selected locale changed:', event.detail);
});
```