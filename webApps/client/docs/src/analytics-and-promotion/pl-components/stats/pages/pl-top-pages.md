# PlausableTopPages

The `PlausableTopPages` class is a web component that extends `PlausableBasePages` to display a list report of top pages. It is designed to be used in a web application to show analytics data for the top pages of a site.

## Properties

| Name              | Type   | Description                                       |
|-------------------|--------|---------------------------------------------------|
| pagePath          | string | The path to the page within the site.             |

## Methods

| Name    | Parameters | Return Type | Description |
|---------|------------|-------------|-------------|
| render  | -          | TemplateResult | Generates a template result to render the component. |

## Events

- **No events are defined for this component.**

## Examples

```typescript
// Example usage of the web component
<pl-top-pages
  .timer="${this.timer}"
  .proxyUrl="${this.proxyUrl}"
  .query="${this.query}"
  .pagePath="${this.pagePath}"
  .site="${this.site}"
  .externalLinkDest="${this.externalLinkDest}"
  color="bg-orange-50"
></pl-top-pages>
```

Please note that the example provided is a representation of how the component might be used in HTML with bound properties, and actual usage may require proper context setup.