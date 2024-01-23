# YpCodeBase

The `YpCodeBase` class provides a set of utility methods for handling global events, firing custom events, managing language settings, and displaying toast notifications. It also includes a responsive design feature that adjusts a `wide` property based on the viewport width.

## Properties

| Name        | Type                  | Description                                      |
|-------------|-----------------------|--------------------------------------------------|
| language    | string \| undefined   | The current language setting.                    |
| wide        | boolean               | Indicates if the viewport is wider than 900px.   |

## Methods

| Name                | Parameters                                  | Return Type | Description                                                                 |
|---------------------|---------------------------------------------|-------------|-----------------------------------------------------------------------------|
| constructor         |                                             | void        | Initializes media query watcher and sets up language based on global state. |
| _languageEvent      | event: CustomEvent                          | void        | Handles the language change event and updates the language property.        |
| fire                | eventName: string, data: object \| string \| boolean \| number \| null, target: LitElement \| Document | void        | Fires a custom event on the specified target.                               |
| fireGlobal          | eventName: string, data: object \| string \| boolean \| number \| null | void        | Fires a custom event on the global document object.                         |
| addListener         | name: string, callback: Function, target: LitElement \| Document | void        | Adds an event listener to the specified target.                             |
| addGlobalListener   | name: string, callback: Function            | void        | Adds a global event listener to the document object.                        |
| showToast           | text: string, timeout: number               | void        | Displays a toast message with the specified text and timeout.               |
| removeListener      | name: string, callback: Function, target: LitElement \| Document | void        | Removes an event listener from the specified target.                        |
| removeGlobalListener| name: string, callback: Function            | void        | Removes a global event listener from the document object.                   |
| t                   | ...args: Array<string>                      | string      | Retrieves a translation for the given key from the global i18nTranslation.  |

## Events

- **yp-language-loaded**: Triggered when the language is loaded or changed. It updates the `language` property and the global locale.

## Examples

```typescript
// Example usage of adding a global listener
const codeBase = new YpCodeBase();
codeBase.addGlobalListener('custom-event', (event) => {
  console.log('Custom event received:', event);
});

// Example usage of firing a global event
codeBase.fireGlobal('custom-event', { message: 'Hello World!' });

// Example usage of showing a toast
codeBase.showToast('This is a toast message', 3000);
```