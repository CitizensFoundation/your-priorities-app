# PlausableDevices

PlausableDevices is a custom web component that extends `PlausibleBaseElementWithState` to display device-related statistics such as browser usage, operating system usage, and screen sizes. It allows users to switch between different modes (browser, OS, size) to view the corresponding reports.

## Properties

| Name       | Type                | Description                                                                 |
|------------|---------------------|-----------------------------------------------------------------------------|
| tabKey     | string              | A unique key associated with the current page tab.                          |
| storedTab  | string \| undefined | The stored tab value, which persists the selected mode across sessions.     |
| mode       | string \| undefined | The current mode of the component, determining which report to display.     |

## Methods

| Name         | Parameters        | Return Type | Description                                                                 |
|--------------|-------------------|-------------|-----------------------------------------------------------------------------|
| setMode      | mode: string      | void        | Sets the current mode and updates the stored tab value.                      |
| renderBrowsers | -               | TemplateResult | Renders the browser usage report.                                           |
| renderBrowserVersions | -        | TemplateResult | Renders the browser versions report for a specific browser.                 |
| renderOperatingSystems | -       | TemplateResult | Renders the operating system usage report.                                  |
| renderOperatingSystemVersions | - | TemplateResult | Renders the operating system versions report for a specific OS.             |
| renderScreenSizes | -           | TemplateResult | Renders the screen sizes report with icons and tooltips.                    |
| iconFor      | screenSize: string | TemplateResult \| typeof nothing | Returns an icon corresponding to the screen size. |
| renderContent | -               | TemplateResult | Renders the content based on the current mode.                              |
| renderPill   | name: string, mode: string | TemplateResult | Renders a pill element for mode switching.         |
| override render | -             | TemplateResult | Renders the entire component with header and content based on the mode.     |

## Events

- **No custom events are defined in this component.**

## Examples

```typescript
// Example usage of the PlausableDevices web component
<pl-devices
  .tabKey="${'pageTab__example.com'}"
  .storedTab="${'browser'}"
  .mode="${'browser'}"
></pl-devices>
```

Note: The above example assumes that the component is used within a context where `site`, `proxyUrl`, `query`, and `timer` properties are provided, as these are used within the component's methods but not explicitly defined as properties of the component.