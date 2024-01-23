# YpBaseElement

YpBaseElement is a class that extends LitElement to provide additional properties and methods for internationalization, theming, and responsive design.

## Properties

| Name           | Type                      | Description                                      |
|----------------|---------------------------|--------------------------------------------------|
| language       | string                    | The current language setting.                    |
| wide           | boolean                   | Indicates if the layout is in a wide state.      |
| rtl            | boolean                   | Indicates if the text direction is right-to-left.|
| largeFont      | boolean                   | Indicates if large font mode is enabled.         |
| themeColor     | string                    | The current theme color.                         |
| themeDarkMode  | boolean \| undefined      | Indicates if the dark mode theme is enabled.     |

## Methods

| Name                  | Parameters                        | Return Type | Description                                                                 |
|-----------------------|-----------------------------------|-------------|-----------------------------------------------------------------------------|
| isAppleDevice         |                                   | boolean     | Returns true if the current device is an Apple device.                      |
| connectedCallback     |                                   | void        | Lifecycle method that runs when the element is added to the DOM.            |
| disconnectedCallback  |                                   | void        | Lifecycle method that runs when the element is removed from the DOM.        |
| _changeThemeColor     | event: CustomEvent                | void        | Handles the change of theme color.                                          |
| _changeThemeDarkMode  | event: CustomEvent                | void        | Handles the change of dark mode theme.                                      |
| updated               | changedProperties: Map            | void        | Lifecycle method that runs when the element's properties have changed.      |
| languageChanged       |                                   | void        | Method to override when the language property changes.                      |
| isSafari              |                                   | boolean     | Returns true if the current browser is Safari.                              |
| _setupRtl             |                                   | void        | Sets up the right-to-left text direction based on the current language.     |
| scrimDisableAction    | event: CustomEvent                | void        | Prevents the default action and stops propagation for an event.             |
| _largeFont            | event: CustomEvent                | void        | Handles the change of large font mode.                                      |
| _languageEvent        | event: CustomEvent                | void        | Handles the change of language.                                             |
| fire                  | eventName: string, data: object \| string \| boolean \| number \| null, target: LitElement \| Document | void | Dispatches a custom event. |
| fireGlobal            | eventName: string, data: object \| string \| boolean \| number \| null | void | Dispatches a custom event to the document. |
| addListener           | name: string, callback: Function, target: LitElement \| Document | void | Adds an event listener. |
| addGlobalListener     | name: string, callback: Function  | void        | Adds a global event listener to the document.                               |
| removeListener        | name: string, callback: Function, target: LitElement \| Document | void | Removes an event listener. |
| removeGlobalListener  | name: string, callback: Function  | void        | Removes a global event listener from the document.                          |
| t                     | ...args: Array<string>            | string      | Translates a given key using the i18n translation system.                   |
| $$                    | id: string                        | HTMLElement \| null | Selects and returns an element from the shadow DOM. |

## Events (if any)

- **yp-language-loaded**: Emitted when the language is loaded.
- **yp-large-font**: Emitted when the large font setting is toggled.
- **yp-theme-color**: Emitted when the theme color is changed.
- **yp-theme-dark-mode**: Emitted when the dark mode setting is toggled.

## Examples

```typescript
// Example usage of YpBaseElement
class MyCustomElement extends YpBaseElement {
  // Custom logic here
}
```

Note: The `rtlLanguages` static getter is not documented as it is not decorated with `@property` and is intended for internal use within the class.