# PlausibleSourcesReferres

This class extends `PlausibleSourcesAll` and is responsible for fetching referrer data for a specific source from the Plausible API.

## Properties

| Name       | Type   | Description               |
|------------|--------|---------------------------|
| loading    | boolean | Indicates if the data is currently being loaded. |
| referrers  | PlausibleReferrerData[] \| undefined | Holds the referrer data once it is fetched. |
| proxyUrl   | string \| undefined | The URL of the proxy server to use for API requests. |
| site       | any | The site object containing domain information. |
| query      | any | The query object containing filters and other parameters for the API request. |
| showNoRef  | boolean \| undefined | A flag to determine whether to show 'no referrer' data. |

## Methods

| Name            | Parameters | Return Type | Description |
|-----------------|------------|-------------|-------------|
| fetchReferrers  | none       | void        | Overrides the `fetchReferrers` method from `PlausibleSourcesAll` to fetch referrer data for a specific source. |

## Events

- No events are defined in this class.

## Examples

```typescript
// Example usage of PlausibleSourcesReferres
const plausibleSourcesReferres = document.createElement('pl-sources-referrers');
plausibleSourcesReferres.proxyUrl = 'https://proxy.example.com';
plausibleSourcesReferres.site = { domain: 'example.com' };
plausibleSourcesReferres.query = { filters: { "source": "Google" } };
plausibleSourcesReferres.showNoRef = true;
plausibleSourcesReferres.fetchReferrers();
```

Note: The `PlausibleReferrerData` type is not defined in the provided code snippet. It should be defined elsewhere in the codebase, and it represents the structure of the referrer data returned by the Plausible API.