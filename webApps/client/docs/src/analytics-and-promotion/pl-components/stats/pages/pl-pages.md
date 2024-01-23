# PlausablePages

The `PlausablePages` class is a web component that extends `PlausibleBaseElementWithState` to display different page statistics for a website, such as top pages, entry pages, and exit pages. It allows users to switch between these different modes using a tab-like interface.

## Properties

| Name       | Type                  | Description                                      |
|------------|-----------------------|--------------------------------------------------|
| tabKey     | string                | Unique key to store the current tab state.       |
| storedTab  | string \| undefined   | The stored tab value retrieved from storage.     |
| mode       | string \| undefined   | The current mode of the page display ('pages', 'entry-pages', 'exit-pages'). |

## Methods

| Name         | Parameters    | Return Type | Description                                      |
|--------------|---------------|-------------|--------------------------------------------------|
| setMode      | mode: string  | void        | Sets the current mode and updates the storage.   |
| renderContent|               | unknown     | Renders the content based on the current mode.   |
| renderPill   | name: string, mode: string | unknown | Renders a pill for switching modes. |
| render       |               | unknown     | Renders the component based on the current state.|

## Events

- **No events are defined in this class.**

## Examples

```typescript
// Example usage of the PlausablePages web component
<pl-pages
  .site=${yourSiteObject}
  .query=${yourQueryObject}
  .timer=${yourTimerObject}
  .proxyUrl="${yourProxyUrl}"
></pl-pages>
```

Please note that the `renderContent`, `renderPill`, and `render` methods return a `TemplateResult` from the `lit-html` library, which is not a TypeScript primitive type. The actual return type is specific to the `lit-html` rendering engine and is used to render the component's HTML template.