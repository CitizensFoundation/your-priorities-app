# PlausableEntryPages

`PlausableEntryPages` is a custom web component that extends `PlausableBasePages` to display a report of entry pages with unique entrances. It renders a `pl-list-report` component with specific properties and methods to fetch and display the data.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| pagePath      | string | The path of the entry pages. |
| proxyUrl      | string | The URL of the proxy server. |
| site          | string | The site for which the report is generated. |
| query         | string | The query parameters for the report. |
| externalLinkDest | string | The destination for external links. |
| timer         | number | The timer for refreshing the report. |

## Methods

| Name       | Parameters        | Return Type | Description                 |
|------------|-------------------|-------------|-----------------------------|
| render     | -                 | TemplateResult | Renders the `pl-list-report` component with the appropriate properties. |
| fetchData  | -                 | Promise<any> | Fetches the data for the report. |

## Events

- **N/A**: This component does not emit any custom events.

## Examples

```typescript
// Example usage of the PlausableEntryPages component
<pl-entry-pages
  .proxyUrl="${'https://proxy.example.com'}"
  .site="${'example.com'}"
  .pagePath="${'/entry-pages'}"
  .query="${'some-query-parameters'}"
  .externalLinkDest="${'https://external.example.com'}"
  .timer="${3000}"
></pl-entry-pages>
```

Note: The `.fetchDataFunction` property is set to the `fetchData` method within the component and is not directly set in the example usage.