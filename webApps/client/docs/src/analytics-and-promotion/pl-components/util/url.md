# Functions

This TypeScript file defines a set of utility functions for constructing URLs and manipulating query parameters.

## Methods

| Name                | Parameters                  | Return Type | Description                                                                 |
|---------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| apiPath             | site: Site, path: string = '' | string      | Constructs an API path using the provided `site` object and optional `path`. |
| siteBasePath        | site: Site, path: string = '' | string      | Constructs a base path for a site using the provided `site` object and optional `path`. |
| sitePath            | site: Site, path: string = '' | string      | Constructs a full path for a site, including the current query string, using the provided `site` object and optional `path`. |
| setQuery            | key: string, value: string  | string      | Updates the query string of the current URL by setting the given `key` to the specified `value`. Returns the updated URL path with the new query string. |
| setQuerySearch      | key: string, value: string  | string      | Updates the query string of the current URL by setting the given `key` to the specified `value`. Returns the new query string without the URL path. |
| externalLinkForPage | domain: string, page: string | string      | Constructs an external link for a given `page` using the specified `domain`. |

## Types

### Site

| Name    | Type   | Description               |
|---------|--------|---------------------------|
| domain  | string | The domain of the site.   |

## Examples

```typescript
// Example usage of apiPath
const siteInfo: Site = { domain: 'example.com' };
const apiEndpoint = apiPath(siteInfo, '/users');
// apiEndpoint would be "/api/stats/example.com/users"

// Example usage of siteBasePath
const basePath = siteBasePath(siteInfo, '/dashboard');
// basePath would be "/example.com/dashboard"

// Example usage of sitePath
const fullPath = sitePath(siteInfo, '/dashboard');
// fullPath would include the current query string, e.g., "/example.com/dashboard?query=value"

// Example usage of setQuery
const updatedPath = setQuery('page', '2');
// updatedPath would be "/currentPath?page=2"

// Example usage of setQuerySearch
const updatedSearch = setQuerySearch('page', '2');
// updatedSearch would be "page=2"

// Example usage of externalLinkForPage
const externalLink = externalLinkForPage('example.com', '/about');
// externalLink would be "https://currentHostname/about"
```