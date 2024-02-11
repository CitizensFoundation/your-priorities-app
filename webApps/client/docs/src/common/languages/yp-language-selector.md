# YpLanguageSelector

`YpLanguageSelector` is a custom web component that allows users to select a language from a dropdown menu. It is built using Lit, an efficient, expressive, extensible web components library. The component is designed to integrate with the Your Priorities (Yp) platform, providing language selection and auto-translation features.

## Properties

| Name                        | Type      | Description                                                                 |
|-----------------------------|-----------|-----------------------------------------------------------------------------|
| refreshLanguages            | Boolean   | If true, triggers a refresh of the language options.                        |
| noUserEvents                | Boolean   | If true, user events such as language change will not be emitted.           |
| selectedLocale              | String    | The currently selected locale code.                                         |
| value                       | String    | The value of the selected language.                                         |
| autocompleteText            | String    | The text used for filtering languages in the autocomplete dropdown.         |
| name                        | String    | The name of the language selector.                                          |
| autoTranslateOptionDisabled | Boolean   | If true, disables the option to auto-translate.                             |
| autoTranslate               | Boolean   | If true, indicates that auto-translation is currently enabled.              |
| dropdownVisible             | Boolean   | If true, the dropdown for language selection is visible.                    |
| hasServerAutoTranslation    | Boolean   | If true, indicates that the server supports auto-translation.               |
| isOutsideChangeEvent        | Boolean   | If true, indicates that the change event was triggered from outside.        |

## Methods

| Name                   | Parameters            | Return Type | Description                                                                                   |
|------------------------|-----------------------|-------------|-----------------------------------------------------------------------------------------------|
| updated                | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called after the component's properties have been updated.                   |
| _refreshLanguage       |                       | void        | Refreshes the language options by toggling the visibility of the dropdown.                    |
| openMenu               |                       | Promise<void> | Opens the language selection menu.                                                            |
| _autoCompleteChange    | event: CustomEvent    | void        | Handles changes in the autocomplete text field.                                               |
| _selectLanguage        | event: CustomEvent    | void        | Selects a language based on the user's choice in the menu.                                    |
| renderMenuItem         | index: number, item: YpLanguageMenuItem | TemplateResult | Renders a single menu item for a language.                                                    |
| renderAutoComplete     |                       | TemplateResult | Renders the autocomplete dropdown for language selection.                                     |
| connectedCallback      |                       | Promise<void> | Lifecycle method called when the component is added to the DOM.                               |
| disconnectedCallback   |                       | void        | Lifecycle method called when the component is removed from the DOM.                           |
| firstUpdated           | _changedProperties: PropertyValueMap<any> \| Map<PropertyKey, unknown> | void        | Lifecycle method called after the component's first render.                                   |
| _autoTranslateEvent    | event: CustomEvent    | void        | Handles the auto-translate toggle event.                                                      |
| _stopTranslation       |                       | void        | Stops the auto-translation feature.                                                           |
| startTranslation       |                       | void        | Starts the auto-translation feature.                                                          |
| canUseAutoTranslate    |                       | Boolean     | Getter that determines if auto-translation can be used based on various conditions.           |
| languages              |                       | YpLanguageMenuItem[] | Getter that returns an array of language menu items.                                          |
| _selectedLocaleChanged | oldLocale: string     | void        | Handles changes to the selected locale and updates the component state accordingly.           |

## Events

- **yp-selected-locale-changed**: Emitted when the selected locale changes.
- **yp-refresh-language-selection**: Emitted to trigger a refresh of the language selection.
- **yp-language-name**: Emitted with the English name of the selected language.
- **changed**: Emitted when the selected language value changes.

## Examples

```typescript
// Example usage of the YpLanguageSelector component
<yp-language-selector
  .selectedLocale="${this.selectedLocale}"
  @yp-selected-locale-changed="${(e) => this.handleLocaleChange(e)}"
></yp-language-selector>
```

Note: The above example assumes you have a method `handleLocaleChange` to handle the `yp-selected-locale-changed` event and a property `selectedLocale` to bind the selected locale.