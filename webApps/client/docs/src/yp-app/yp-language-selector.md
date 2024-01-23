# YpLanguageSelector

The `YpLanguageSelector` class is a custom web component that extends `YpBaseElement` to provide a language selection dropdown. It allows users to select a language from a predefined list of supported languages and handles the logic for auto-translation features.

## Properties

| Name                         | Type      | Description                                                                 |
|------------------------------|-----------|-----------------------------------------------------------------------------|
| refreshLanguages             | Boolean   | Indicates whether the language list should be refreshed.                    |
| noUserEvents                 | Boolean   | If true, user events will not be triggered.                                 |
| selectedLocale               | String    | The currently selected locale.                                              |
| value                        | String    | The value of the selected language.                                         |
| name                         | String    | The name of the language selector.                                          |
| autoTranslateOptionDisabled  | Boolean   | If true, the option to auto-translate is disabled.                          |
| autoTranslate                | Boolean   | Indicates whether auto-translation is currently enabled.                    |
| dropdownVisible              | Boolean   | Controls the visibility of the dropdown.                                    |
| hasServerAutoTranslation     | Boolean   | Indicates if the server supports auto-translation.                          |
| isOutsideChangeEvent         | Boolean   | Indicates if the change event originated from outside the component.        |

## Methods

| Name                   | Parameters                  | Return Type | Description                                                                 |
|------------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| updated                | changedProperties: Map      | void        | Lifecycle method that runs when properties change.                          |
| _refreshLanguage       |                             | void        | Refreshes the language dropdown.                                            |
| render                 |                             | TemplateResult | Renders the language selector template.                                    |
| _selectLanguage        | event: CustomEvent          | void        | Handles language selection.                                                 |
| connectedCallback      |                             | Promise<void> | Lifecycle method that runs when the component is added to the DOM.         |
| disconnectedCallback   |                             | void        | Lifecycle method that runs when the component is removed from the DOM.      |
| _autoTranslateEvent    | event: CustomEvent          | void        | Handles auto-translate events.                                              |
| _stopTranslation       |                             | void        | Stops the auto-translation process.                                         |
| startTranslation       |                             | void        | Starts the auto-translation process.                                        |
| canUseAutoTranslate    |                             | Boolean     | Getter that determines if auto-translation can be used.                     |
| languages              |                             | Array       | Getter that returns an array of supported languages.                        |
| _selectedLocaleChanged | oldLocale: String           | void        | Handles changes to the selected locale.                                     |

## Events

- **yp-selected-locale-changed**: Emitted when the selected locale changes.
- **yp-refresh-language-selection**: Emitted to refresh the language selection.
- **yp-auto-translate**: Emitted to toggle auto-translation.
- **yp-language-name**: Emitted with the name of the current language.
- **changed**: Emitted when the value changes.

## Examples

```typescript
// Example usage of the YpLanguageSelector web component
<yp-language-selector></yp-language-selector>
```

Please note that the above example is a simple usage scenario. The actual implementation may require additional attributes and event handling to work as expected within a specific application context.