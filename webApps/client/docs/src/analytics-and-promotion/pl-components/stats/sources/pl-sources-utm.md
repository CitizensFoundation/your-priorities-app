# PlausibleSourcesUtm

`PlausibleSourcesUtm` is a custom web component that extends `PlausibleSourcesBase` to display UTM source statistics for a given site. It fetches and renders referrer data, including visitor counts and conversion rates, and provides a user interface for navigating between different UTM tags.

## Properties

| Name       | Type               | Description                                      |
|------------|--------------------|--------------------------------------------------|
| to         | string \| undefined | Optional string to define a navigation endpoint. |

## Methods

| Name            | Parameters | Return Type | Description                                                                 |
|-----------------|------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback |            | void        | Lifecycle method that is called when the component is added to the document. |
| fetchReferrers  |            | void        | Fetches referrer data from the API and updates the component state.         |
| renderReferrer  | referrer: PlausibleReferrerData | TemplateResult | Renders a single referrer's data as HTML. |
| renderList      |            | TemplateResult | Renders the list of referrers if available. |
| renderContent   |            | TemplateResult | Renders the content of the component including tabs and referrer list. |
| render          |            | TemplateResult | Renders the component's HTML structure. |

## Events

- **No custom events are defined in this component.**

## Examples

```typescript
// Example usage of the PlausibleSourcesUtm component
<pl-sources-utm .site=${{ domain: 'example.com' }}></pl-sources-utm>
```

**Note:** The example assumes that the `site` property is an object with a `domain` property, and that the `PlausibleSourcesUtm` component is used within a context where LitElement's HTML rendering is supported.