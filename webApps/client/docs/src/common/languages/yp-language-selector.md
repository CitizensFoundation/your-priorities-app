# YpLanguageSelector

A web component for selecting languages, supporting autocomplete, highlighted languages, and auto-translation features. Integrates with Material Web Components and provides events for language changes and translation actions.

## Properties

| Name                        | Type       | Description                                                                                  |
|-----------------------------|------------|----------------------------------------------------------------------------------------------|
| refreshLanguages            | boolean    | Triggers a refresh of the language list when toggled.                                        |
| noUserEvents                | boolean    | If true, disables user event handling and server requests.                                   |
| selectedLocale              | string \| undefined | The currently selected locale code.                                                          |
| value                       | string     | The value of the selected language (locale code).                                            |
| autocompleteText            | string     | The current text in the autocomplete input.                                                  |
| name                        | string     | The name attribute for the selector (for forms).                                             |
| autoTranslateOptionDisabled | boolean    | If true, disables the auto-translate option.                                                 |
| autoTranslate               | boolean    | Indicates if auto-translation is currently active.                                           |
| dropdownVisible             | boolean    | Controls the visibility of the language dropdown/autocomplete.                               |
| hasServerAutoTranslation    | boolean    | Indicates if the server supports auto-translation.                                           |
| isOutsideChangeEvent        | boolean    | Internal flag to track if a change event is from outside the component.                      |

## Methods

| Name                    | Parameters                                                                 | Return Type | Description                                                                                       |
|-------------------------|----------------------------------------------------------------------------|-------------|---------------------------------------------------------------------------------------------------|
| updated                 | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Lifecycle method called when properties are updated. Fires `yp-selected-locale-changed` event.    |
| _refreshLanguage        | none                                                                       | void        | Refreshes the language dropdown by toggling its visibility.                                       |
| foundAutoCompleteLanguages | none                                                                    | YpLanguageMenuItem[] | Returns the list of languages matching the autocomplete text.                                      |
| openMenu                | none                                                                       | Promise<void> | Opens the language selection menu and clears the text field.                                      |
| _autoCompleteChange     | event: CustomEvent                                                         | void        | Handles changes in the autocomplete text field.                                                   |
| _selectLanguage         | event: CustomEvent                                                         | void        | Handles language selection from the menu and saves the selection to localStorage.                 |
| renderMenuItem          | index: number, item: YpLanguageMenuItem                                    | unknown     | Renders a single language menu item.                                                              |
| renderAutoComplete      | none                                                                       | unknown     | Renders the autocomplete text field and language menu.                                            |
| render                  | none                                                                       | unknown     | Renders the main template for the component.                                                      |
| connectedCallback       | none                                                                       | Promise<void> | Lifecycle method called when the component is added to the DOM. Sets up listeners and checks server translation support. |
| disconnectedCallback    | none                                                                       | void        | Lifecycle method called when the component is removed from the DOM. Removes global listeners.     |
| firstUpdated            | _changedProperties: PropertyValueMap<any> \| Map<PropertyKey, unknown>     | void        | Lifecycle method called after the first update. Sets the text field value based on the language.  |
| _autoTranslateEvent     | event: CustomEvent                                                         | void        | Handles the `yp-auto-translate` event to toggle auto-translation.                                 |
| _stopTranslation        | none                                                                       | void        | Stops auto-translation, fires events, and shows a toast notification.                             |
| startTranslation        | none                                                                       | void        | Starts auto-translation, fires events, and shows a toast notification.                            |
| canUseAutoTranslate     | none                                                                       | boolean     | Returns true if auto-translation can be used based on current state and server support.           |
| languages               | none                                                                       | YpLanguageMenuItem[] | Returns the list of available languages, with highlighted languages at the top.                   |
| _selectedLocaleChanged  | oldLocale: string                                                          | void        | Handles changes to the selected locale, fires events, and updates user/app state.                 |

## Events

- **yp-selected-locale-changed**: Fired when the selected locale changes. Payload: `selectedLocale`.
- **changed**: Fired when the value (locale) changes. Payload: `value`.
- **yp-language-name**: Fired when the language name is needed (e.g., after translation actions). Payload: English name of the language.

## Examples

```typescript
import "./yp-language-selector.js";

html`
  <yp-language-selector
    .selectedLocale=${"en"}
    .autoTranslateOptionDisabled=${false}
    .noUserEvents=${false}
    @yp-selected-locale-changed=${(e) => console.log("Locale changed:", e.detail)}
  ></yp-language-selector>
`
```

---

**Type Definitions Used:**

```typescript
interface YpLanguageMenuItem {
  language: string;
  name: string;
}
```

**Note:**  
- This component depends on global objects like `window.appGlobals`, `window.appUser`, and `window.appDialogs`.
- It uses Material Web Components for UI elements.
- The `YpLanguages` utility provides language data and helpers.  
- The component extends `YpBaseElement`, which should provide base functionality for Lit-based elements.