# YpBaseElement

`YpBaseElement` is a class that extends `LitElement` and provides a base element with properties and methods related to language, theme, and layout settings.

## Properties

| Name                | Type                      | Description                                           |
|---------------------|---------------------------|-------------------------------------------------------|
| language            | string                    | The current language setting.                         |
| wide                | boolean                   | Indicates if the layout is wide.                      |
| rtl                 | boolean                   | Indicates if the text direction is right-to-left.     |
| hasLlm              | boolean                   | Unknown property, possibly related to a specific feature. |
| largeFont           | boolean                   | Indicates if the font size is large.                  |
| themeColor          | string                    | The color theme of the element.                       |
| themeDarkMode       | boolean \| undefined      | Indicates if the dark mode theme is enabled.          |
| themeHighContrast   | boolean \| undefined      | Indicates if the high contrast theme is enabled.      |

## Methods

| Name                    | Parameters                                  | Return Type | Description                                                                 |
|-------------------------|---------------------------------------------|-------------|-----------------------------------------------------------------------------|
| isAppleDevice           |                                             | boolean     | Returns true if the user agent is an Apple device.                           |
| installMediaQueryWatcher| mediaQuery: string, layoutChangedCallback: (mediaQueryMatches: boolean) => void | void        | Installs a media query watcher that triggers the callback on media query changes. |
| connectedCallback       |                                             | void        | Lifecycle method that runs when the element is added to the DOM.             |
| hasBooted               |                                             | void        | Method to be called when the application has booted.                         |
| setupBootListener       |                                             | void        | Sets up a global listener for the 'yp-boot-from-server' event.               |
| setupThemeSettings      |                                             | Promise<void> | Asynchronously sets up theme settings with a delay.                          |
| disconnectedCallback    |                                             | void        | Lifecycle method that runs when the element is removed from the DOM.         |
| _changeThemeColor       | event: CustomEvent                          | void        | Changes the theme color based on the provided event detail.                  |
| _changeThemeDarkMode    | event: CustomEvent                          | void        | Changes the dark mode setting based on the provided event detail.            |
| updated                 | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method that runs when the element's properties have changed.       |
| languageChanged         |                                             | void        | Method to be overridden if needed when the language property changes.        |
| isSafari                |                                             | boolean     | Returns true if the browser is Safari.                                       |
| _setupRtl               |                                             | void        | Sets up the right-to-left text direction based on the current language.      |
| scrimDisableAction      | event: CustomEvent                          | void        | Prevents the default action and stops propagation of the event.              |
| _largeFont              | event: CustomEvent                          | void        | Changes the large font setting based on the provided event detail.           |
| _languageEvent          | event: CustomEvent                          | void        | Changes the language setting based on the provided event detail.             |
| fire                    | eventName: string, data: object \| string \| boolean \| number \| null, target: LitElement \| Document | void        | Dispatches a custom event with the specified name and detail.                 |
| fireGlobal              | eventName: string, data: object \| string \| boolean \| number \| null | void        | Dispatches a custom event with the specified name and detail on the document. |
| addListener             | name: string, callback: Function, target: LitElement \| Document | void        | Adds an event listener to the specified target.                              |
| addGlobalListener       | name: string, callback: Function            | void        | Adds a global event listener to the document.                                |
| removeListener          | name: string, callback: Function, target: LitElement \| Document | void        | Removes an event listener from the specified target.                         |
| removeGlobalListener    | name: string, callback: Function            | void        | Removes a global event listener from the document.                           |
| t                       | ...args: Array<string>                      | string      | Translates a key using the global i18n translation function.                  |
| $$                      | id: string                                  | HTMLElement \| null | Selects and returns an element from the shadow DOM.                          |
| toggleHighContrast      |                                             | void        | Toggles the high contrast theme setting.                                     |
| toggleDarkMode          |                                             | void        | Toggles the dark mode theme setting.                                         |
| renderThemeToggle       | hideText: boolean                           | TemplateResult | Renders the theme toggle buttons with optional text visibility.              |

## Events (if any)

- **yp-language-loaded**: Emitted when the language is loaded.
- **yp-large-font**: Emitted when the large font setting is changed.
- **yp-theme-color**: Emitted when the theme color is changed.
- **yp-theme-dark-mode**: Emitted when the dark mode setting is changed.
- **yp-boot-from-server**: Emitted when the application has booted.

## Examples

```typescript
// Example usage of the YpBaseElement
const ypBaseElement = document.createElement('yp-base-element');
ypBaseElement.language = 'en';
ypBaseElement.wide = true;
ypBaseElement.rtl = false;
// ... set other properties and methods as needed
document.body.appendChild(ypBaseElement);
```
