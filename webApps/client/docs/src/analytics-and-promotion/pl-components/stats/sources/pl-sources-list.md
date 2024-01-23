# PlausibleSourcesList

`PlausibleSourcesList` is a custom web component that extends `PlausibleBaseElementWithState` to display different types of source lists based on the selected tab. It is responsible for managing the state of the selected tab and rendering the appropriate source list component.

## Properties

| Name            | Type    | Description                                                                 |
|-----------------|---------|-----------------------------------------------------------------------------|
| tabKey          | String  | A unique key associated with the current site's domain to store the tab state. |
| tab             | String  | The currently selected tab option.                                          |
| alwaysShowNoRef | Boolean | A flag to determine whether to always show the 'No Referrer' option.        |

## Methods

| Name             | Parameters        | Return Type | Description                                                                 |
|------------------|-------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback | none              | void        | Lifecycle method that runs when the component is added to the DOM. It initializes the tab state. |
| tabChanged        | e: CustomEvent   | void        | Handles the change of the selected tab and updates the storage accordingly. |

## Events

- **tab-changed**: Emitted when the tab selection changes.

## Examples

```typescript
// Example usage of the PlausibleSourcesList web component
<pl-sources-list
  .tab="${this.tab}"
  .proxyUrl="${this.proxyUrl}"
  .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
  .query="${this.query}"
  .site="${this.site}"
  .alwaysShowNoRef="${this.alwaysShowNoRef}"
  .timer="${this.timer}"
  @tab-changed="${this.tabChanged}"
></pl-sources-list>
```

Note: The `PlausibleSourcesTabOptions` type used in the `tab` property is not defined in the provided code snippet. It is assumed to be a custom type that should be documented separately if it is part of the public API.