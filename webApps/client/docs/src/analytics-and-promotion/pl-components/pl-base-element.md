# PlausibleBaseElement

`PlausibleBaseElement` is a class that extends `LitElement` to provide additional features such as internationalization, right-to-left text support, media query watchers, and custom event handling.

## Properties

| Name      | Type    | Description                                   |
|-----------|---------|-----------------------------------------------|
| language  | string  | The current language setting.                 |
| rtl       | boolean | A flag indicating if text should be RTL.      |
| wide      | boolean | A flag indicating if the layout is wide.      |

## Methods

| Name                     | Parameters                                             | Return Type | Description                                                                                   |
|--------------------------|--------------------------------------------------------|-------------|-----------------------------------------------------------------------------------------------|
| connectedCallback        | -                                                      | void        | Lifecycle method that runs when the element is added to the DOM.                              |
| installMediaQueryWatcher | mediaQuery: string, layoutChangedCallback: Function    | void        | Installs a media query watcher that invokes a callback when the media query state changes.    |
| disconnectedCallback     | -                                                      | void        | Lifecycle method that runs when the element is removed from the DOM.                          |
| updated                  | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method that runs when the element's properties have changed.                        |
| languageChanged          | -                                                      | void        | Called when the `language` property changes. Override to provide custom behavior.             |
| fire                     | eventName: string, data: object \| string \| boolean \| number \| null, target: LitElement \| Document | void        | Dispatches a custom event with the given name and detail.                                     |
| fireGlobal               | eventName: string, data: object \| string \| boolean \| number \| null | void        | Dispatches a custom event at the document level.                                              |
| addListener              | name: string, callback: Function, target: LitElement \| Document | void        | Adds an event listener to the given target.                                                   |
| addGlobalListener        | name: string, callback: Function                       | void        | Adds a global event listener to the document.                                                 |
| removeListener           | name: string, callback: Function, target: LitElement \| Document | void        | Removes an event listener from the given target.                                              |
| removeGlobalListener     | name: string, callback: Function                       | void        | Removes a global event listener from the document.                                            |
| t                        | ...args: Array<string>                                 | string      | Translates a given key using the i18n translation system.                                     |
| getTooltipText           | item: PlausibleListItemData                            | string \| undefined | Returns the tooltip text for a given item, if available.                                      |
| renderIcon               | item: PlausibleListItemData                            | string \| undefined | Returns the icon for a given item, if available.                                              |
| $$                       | id: string                                             | HTMLElement \| null | Selects and returns an element from the shadow DOM using the given ID.                        |

## Events

- **language-loaded**: Emitted when the language is loaded and ready to be used.

## Examples

```typescript
// Example usage of PlausibleBaseElement
class MyCustomElement extends PlausibleBaseElement {
  // Custom logic here
}
```

Please note that `PlausibleListItemData` is referenced in the methods `getTooltipText` and `renderIcon`, but its definition is not provided in the given code. You should define this type according to your application's requirements.