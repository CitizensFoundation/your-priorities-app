# PlausibleSourcesAll

`PlausibleSourcesAll` is a custom web component that extends `PlausibleSourcesBase` to display a list of referrers/sources for a given website. It fetches and renders the top sources of traffic to the website, including the number of visitors and conversion rates if available.

## Properties

| Name       | Type            | Description                                      |
|------------|-----------------|--------------------------------------------------|
| to         | String          | The path to navigate to when a source is clicked.|

## Methods

| Name              | Parameters | Return Type | Description                                      |
|-------------------|------------|-------------|--------------------------------------------------|
| connectedCallback |            | void        | Lifecycle method that runs when the component is added to the DOM. Sets up the timer to fetch referrers. |
| fetchReferrers    |            | void        | Fetches the referrers from the API and updates the component state. |
| renderReferrer    | referrer: PlausibleReferrerData | TemplateResult | Renders a single referrer with visitor count and conversion rate. |
| renderList        |            | TemplateResult | Renders the list of referrers or a message if there's no data. |
| renderContent     |            | TemplateResult | Renders the content of the component including the list of referrers and loading state. |
| render            |            | TemplateResult | Renders the component's HTML structure. |

## Events

- **No custom events are defined in this component.**

## Examples

```typescript
// Example usage of the PlausibleSourcesAll component
<pl-sources-all .site=${{ domain: 'example.com' }}></pl-sources-all>
```

**Note:** The example assumes that the `site` property is an object with a `domain` property, and that the component is used within a context where LitElement's property binding syntax (`.property=${value}`) is supported.