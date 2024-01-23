# PlausableExitPages

`PlausableExitPages` is a custom web component that extends `PlausableBasePages` to display a report of exit pages within a web application. It uses `pl-list-report` to render the data and provides various properties to customize the report, such as filters, labels, and URLs.

## Properties

| Name              | Type                  | Description                                       |
|-------------------|-----------------------|---------------------------------------------------|
| pagePath          | string                | The path to the exit pages report.                |
| proxyUrl          | string                | URL of the proxy server used for API requests.    |
| site              | string                | The identifier for the site being reported on.    |
| timer             | number                | The refresh timer for the report data.            |
| query             | string                | The query string used for API requests.           |
| externalLinkDest  | string                | The destination for external links.               |

## Methods

| Name       | Parameters        | Return Type | Description                 |
|------------|-------------------|-------------|-----------------------------|
| render     | -                 | TemplateResult | Generates the HTML template for the component. |
| fetchData  | -                 | Promise<any> | Fetches the data for the report. |

## Events

- **No custom events are defined for this component.**

## Examples

```typescript
// Example usage of the web component
<pl-exit-pages
  .proxyUrl="${'https://proxy.example.com'}"
  .site="${'exampleSite'}"
  .timer="${60}"
  .query="${'date=2023-04-01'}"
  .externalLinkDest="${'https://example.com'}"
></pl-exit-pages>
```

Please note that the above example is a hypothetical usage scenario and the actual implementation details like proxy URL, site identifier, timer interval, query string, and external link destination should be replaced with real values as per the application's requirements.