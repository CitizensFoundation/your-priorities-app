# YpCodeBase

The `YpCodeBase` class provides utility methods for handling media queries, event management, and internationalization within a web application. It interacts with global objects and facilitates communication through custom events.

## Properties

| Name     | Type    | Description                                                                 |
|----------|---------|-----------------------------------------------------------------------------|
| language | string \| undefined | The current language setting of the application. Defaults to 'en' if not set. |
| wide     | boolean | Indicates whether the viewport width is at least 900px.                      |

## Methods

| Name                     | Parameters                                                                 | Return Type | Description                                                                                   |
|--------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------------------------|
| installMediaQueryWatcher | mediaQuery: string, layoutChangedCallback: (mediaQueryMatches: boolean) => void | void        | Sets up a media query listener and invokes the callback when the query matches or changes.     |
| _languageEvent           | event: CustomEvent                                                         | void        | Handles the 'yp-language-loaded' event to update the language property and global locale.     |
| fire                     | eventName: string, data: object \| string \| boolean \| number \| null, target: LitElement \| Document | void        | Dispatches a custom event with the specified name and data on the given target.               |
| fireGlobal               | eventName: string, data: object \| string \| boolean \| number \| null    | void        | Dispatches a custom event globally on the document.                                           |
| addListener              | name: string, callback: Function, target: LitElement \| Document          | void        | Adds an event listener for the specified event name on the given target.                      |
| addGlobalListener        | name: string, callback: Function                                          | void        | Adds a global event listener for the specified event name on the document.                    |
| showToast                | text: string, timeout: number = 4000                                      | void        | Displays a toast message using the global dialog system with a specified timeout.             |
| removeListener           | name: string, callback: Function, target: LitElement \| Document          | void        | Removes an event listener for the specified event name from the given target.                 |
| removeGlobalListener     | name: string, callback: Function                                          | void        | Removes a global event listener for the specified event name from the document.               |
| t                        | ...args: Array<string>                                                    | string      | Translates a given key using the global i18n translation system, returning an empty string if unavailable. |

## Examples

```typescript
// Example usage of the YpCodeBase class

const codeBase = new YpCodeBase();

// Listen for a custom event
codeBase.addGlobalListener('custom-event', (event) => {
  console.log('Custom event received:', event.detail);
});

// Fire a custom event
codeBase.fireGlobal('custom-event', { message: 'Hello, world!' });

// Show a toast message
codeBase.showToast('This is a toast message', 3000);

// Translate a key
const translatedText = codeBase.t('welcome_message');
console.log(translatedText);
```