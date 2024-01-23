# PlausibleBaseElement

`PlausibleBaseElement` is a class that extends `LitElement` to provide additional features such as internationalization, right-to-left (RTL) support, and responsive design capabilities. It includes properties for language, text direction, and screen width, as well as methods for event handling and translation.

## Properties

| Name     | Type    | Description                                      |
|----------|---------|--------------------------------------------------|
| language | String  | The current language setting.                    |
| rtl      | Boolean | A flag indicating if RTL layout should be used.  |
| wide     | Boolean | A flag indicating if the screen is wide.         |

## Methods

| Name                  | Parameters                                  | Return Type | Description                                                                 |
|-----------------------|---------------------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback     |                                             | void        | Lifecycle method that runs when the element is added to the DOM.            |
| disconnectedCallback  |                                             | void        | Lifecycle method that runs when the element is removed from the DOM.        |
| updated               | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method that runs when the element's properties have changed.      |
| languageChanged       |                                             | void        | A method that can be overridden to react to language changes.               |
| _setupRtl             |                                             | void        | Sets up the RTL layout based on the current language.                       |
| _languageEvent        | event: CustomEvent                          | void        | Handles the 'language-loaded' event and updates the language accordingly.   |
| fire                  | eventName: string, data: object \| string \| boolean \| number \| null, target: LitElement \| Document | void        | Dispatches a custom event with the specified name and details.              |
| fireGlobal            | eventName: string, data: object \| string \| boolean \| number \| null | void        | Dispatches a custom event at the document level.                            |
| addListener           | name: string, callback: Function, target: LitElement \| Document | void        | Adds an event listener to the specified target.                             |
| addGlobalListener     | name: string, callback: Function            | void        | Adds a global event listener to the document.                               |
| removeListener        | name: string, callback: Function, target: LitElement \| Document | void        | Removes an event listener from the specified target.                        |
| removeGlobalListener  | name: string, callback: Function            | void        | Removes a global event listener from the document.                          |
| t                     | ...args: Array<string>                      | string      | Translates a given key using the i18n translation system.                   |
| getTooltipText        | item: PlausibleListItemData                 | string \| undefined | Returns the tooltip text for a given item.                                  |
| renderIcon            | item: PlausibleListItemData                 | string \| undefined | Returns the icon for a given item if it exists.                             |
| $$                    | id: string                                  | HTMLElement \| null | Selects and returns an element from the shadow DOM by its ID.               |

## Events

- **language-loaded**: Emitted when the language is loaded and ready to be used.

## Examples

```typescript
// Example usage of PlausibleBaseElement
class MyCustomElement extends PlausibleBaseElement {
  // Custom logic for a component that extends PlausibleBaseElement
}
```

Note: `PlausibleListItemData` is referenced in the methods `getTooltipText` and `renderIcon`, but its definition is not provided in the given code. It should be documented separately if it is part of the public API.