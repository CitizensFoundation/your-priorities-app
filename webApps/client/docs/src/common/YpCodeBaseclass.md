# YpCodeBase

The `YpCodeBase` class provides a set of utility methods for handling media queries, global events, firing custom events, and internationalization within a web application.

## Properties

| Name       | Type                  | Description                                      |
|------------|-----------------------|--------------------------------------------------|
| language   | string \| undefined   | The current language set for the application.    |
| wide       | boolean               | A boolean indicating if the media query matches. |

## Methods

| Name                    | Parameters                                                                 | Return Type | Description                                                                                   |
|-------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------------------------|
| constructor             |                                                                            | void        | Initializes the class, sets up media query watcher, and language event listener.              |
| installMediaQueryWatcher| mediaQuery: string, layoutChangedCallback: (mediaQueryMatches: boolean) => void | void        | Installs a media query watcher that triggers a callback when the media query state changes.   |
| _languageEvent          | event: CustomEvent                                                         | void        | Handles the language change event and updates the language property.                          |
| fire                    | eventName: string, data: object \| string \| boolean \| number \| null, target: LitElement \| Document | void        | Fires a custom event with the given name and data on the specified target.                    |
| fireGlobal              | eventName: string, data: object \| string \| boolean \| number \| null     | void        | Fires a custom event with the given name and data on the global document object.              |
| addListener             | name: string, callback: Function, target: LitElement \| Document           | void        | Adds an event listener for the specified event name and callback on the target.               |
| addGlobalListener       | name: string, callback: Function                                           | void        | Adds a global event listener for the specified event name and callback on the document.       |
| showToast               | text: string, timeout: number                                              | void        | Displays a toast message with the specified text and timeout duration.                        |
| removeListener          | name: string, callback: Function, target: LitElement \| Document           | void        | Removes an event listener for the specified event name and callback from the target.          |
| removeGlobalListener    | name: string, callback: Function                                           | void        | Removes a global event listener for the specified event name and callback from the document.  |
| t                       | ...args: Array<string>                                                     | string      | Translates a given key using the internationalization translation function if available.      |

## Events (if any)

- **yp-language-loaded**: Triggered when the language is loaded or changed. It updates the language property and the global locale.

## Examples

```typescript
// Example usage of installing a media query watcher
const codeBase = new YpCodeBase();
codeBase.installMediaQueryWatcher('(min-width: 900px)', (matches) => {
  console.log(`Media query matches: ${matches}`);
});

// Example usage of firing a global event
codeBase.fireGlobal('custom-event', { message: 'Hello World!' });

// Example usage of showing a toast
codeBase.showToast('This is a toast message', 3000);

// Example usage of translating a key
const translatedText = codeBase.t('hello_key');
console.log(translatedText);
```