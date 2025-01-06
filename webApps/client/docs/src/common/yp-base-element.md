# YpBaseElement

`YpBaseElement` is a base class extending `LitElement` that provides properties and methods for handling themes, language settings, and media queries. It integrates with global application settings and provides utility methods for event handling and translation.

## Properties

| Name                  | Type      | Description                                                                 |
|-----------------------|-----------|-----------------------------------------------------------------------------|
| language              | string    | The current language setting, default is "en".                              |
| wide                  | boolean   | Indicates if the layout is wide, default is `false`.                        |
| rtl                   | boolean   | Indicates if the layout is right-to-left, default is `false`.               |
| hasLlm                | boolean   | Indicates if the application has LLM (Large Language Model) support, default is `false`. |
| largeFont             | boolean   | Indicates if large font is enabled, default is `false`.                     |
| themeColor            | string    | The current theme color, default is "#002255".                              |
| themeDarkMode         | boolean \| undefined | Indicates if dark mode is enabled, can be `undefined`.                  |
| themeHighContrast     | boolean \| undefined | Indicates if high contrast mode is enabled, can be `undefined`.          |
| hasStaticTheme        | boolean   | Indicates if a static theme is applied, default is `false`.                 |
| languageLoaded        | boolean   | Indicates if the language has been loaded, default is `false`.              |

## Methods

| Name                        | Parameters                                                                 | Return Type | Description                                                                 |
|-----------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| installMediaQueryWatcher    | mediaQuery: string, layoutChangedCallback: (mediaQueryMatches: boolean) => void | void        | Installs a media query watcher and triggers a callback when the query matches. |
| connectedCallback           | none                                                                       | void        | Lifecycle method called when the element is added to the document.          |
| setStaticThemeFromConfig    | none                                                                       | void        | Sets the static theme based on the global configuration.                    |
| hasBooted                   | none                                                                       | void        | Updates the `hasLlm` property based on global settings.                     |
| setupBootListener           | none                                                                       | void        | Sets up a listener for the "yp-boot-from-server" event.                     |
| setupThemeSettings          | none                                                                       | Promise<void> | Asynchronously sets up theme settings with a delay.                         |
| disconnectedCallback        | none                                                                       | void        | Lifecycle method called when the element is removed from the document.      |
| _changeThemeColor           | event: CustomEvent                                                         | void        | Updates the theme color based on the event detail.                          |
| _changeThemeDarkMode        | event: CustomEvent                                                         | void        | Updates the dark mode setting based on the event detail.                    |
| updated                     | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Lifecycle method called when properties are updated.                        |
| languageChanged             | none                                                                       | void        | Placeholder method for handling language changes.                           |
| _setupRtl                   | none                                                                       | void        | Sets the `rtl` property based on the current language.                      |
| scrimDisableAction          | event: CustomEvent                                                         | void        | Prevents default action and stops propagation of the event.                 |
| _largeFont                  | event: CustomEvent                                                         | void        | Updates the `largeFont` property based on the event detail.                 |
| _languageEvent              | event: CustomEvent                                                         | void        | Updates the language and RTL settings based on the event detail.            |
| fire                        | eventName: string, data: object \| string \| boolean \| number \| null, target: LitElement \| Document | void | Dispatches a custom event with the specified name and data.                 |
| fireGlobal                  | eventName: string, data: object \| string \| boolean \| number \| null     | void        | Dispatches a custom event globally on the document.                         |
| addListener                 | name: string, callback: Function, target: LitElement \| Document           | void        | Adds an event listener to the specified target.                             |
| addGlobalListener           | name: string, callback: Function                                           | void        | Adds a global event listener on the document.                               |
| removeListener              | name: string, callback: Function, target: LitElement \| Document           | void        | Removes an event listener from the specified target.                        |
| removeGlobalListener        | name: string, callback: Function                                           | void        | Removes a global event listener from the document.                          |
| t                           | ...args: Array<string>                                                     | string      | Translates a key using the global translation function.                     |
| $$                          | id: string                                                                 | HTMLElement \| null | Queries the shadow DOM for an element by ID.                                |
| toggleHighContrast          | none                                                                       | void        | Toggles the high contrast mode and updates local storage and global settings. |
| toggleDarkMode              | none                                                                       | void        | Toggles the dark mode and updates local storage and global settings.        |
| renderThemeToggle           | hideText: boolean                                                          | TemplateResult | Renders the theme toggle UI elements.                                       |

## Events

- **yp-language-loaded**: Emitted when the language is loaded.
- **yp-large-font**: Emitted when the large font setting changes.
- **yp-theme-color**: Emitted when the theme color changes.
- **yp-theme-applied**: Emitted when a theme is applied.
- **yp-theme-dark-mode**: Emitted when the dark mode setting changes.
- **yp-boot-from-server**: Emitted when the application boots from the server.

## Examples

```typescript
import { YpBaseElement } from './path-to-yp-base-element.js';

class MyCustomElement extends YpBaseElement {
  // Custom implementation
}

customElements.define('my-custom-element', MyCustomElement);
```