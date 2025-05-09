# Controller: generateSitemap

Generates and serves an XML sitemap for a given domain and (optionally) community. The sitemap includes links to domains, communities, groups, and posts, depending on the domain and community context. The result is cached in Redis for performance.

## Parameters

| Name | Type     | Description                                 |
|------|----------|---------------------------------------------|
| req  | Request  | Express request object. Expects `ypDomain`, `ypCommunity`, and `redisClient` properties. |
| res  | Response | Express response object. Used to send XML or error responses. |

---

## Request

### Parameters

| Name         | Type   | In   | Description                                                                 | Required |
|--------------|--------|------|-----------------------------------------------------------------------------|----------|
| ypDomain     | object | req  | Domain object for the current request. Must have `id` and `domain_name`.    | Yes      |
| ypCommunity  | object | req  | Community object for the current request. Optional, but if present must have `id` and `hostname`. | No       |
| redisClient  | object | req  | Redis client instance supporting `get` and `setEx` methods.                 | Yes      |

### Headers

No specific headers required for the request.

### Body

No request body is required.

---

## Response

### Success (200)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset ...>
  <url>
    <loc>https://example.com/domain/1</loc>
  </url>
  <url>
    <loc>https://example.com/community/2</loc>
  </url>
  ...
</urlset>
```

- **Content-Type:** `application/xml`
- Returns a valid XML sitemap containing URLs for the domain, communities, groups, and posts.

### Error (500)

```json
{
  "error": "Error from looking up sitemap data"
}
```

- Returned if there is a problem with domain detection, database queries, or Redis operations.

---

## Logic Overview

1. **Domain and Community Detection:**  
   - Checks for `req.ypDomain`. If missing, logs an error and returns 500.
   - Determines the base hostname for the sitemap, with special handling for certain domains.

2. **Redis Caching:**  
   - Attempts to retrieve the sitemap from Redis using a cache key based on the hostname and domain ID.
   - If found, returns the cached XML.

3. **Sitemap Generation (if not cached):**  
   - Uses `async.series` to sequentially:
     - Add the domain URL.
     - Add all public communities for the domain (if not a wildcard domain or if no community is specified).
     - Add all public/open groups for the domain/community.
     - Add all posts in public/open groups for the domain/community.
   - Handles wildcard domains differently for URL construction.

4. **Sitemap Streaming and Caching:**  
   - Uses `SitemapStream` and `streamToPromise` to generate the XML.
   - Stores the generated XML in Redis with a TTL (default 1 hour, configurable via `SITEMAP_CACHE_TTL`).
   - Returns the XML as the response.

5. **Error Handling:**  
   - Logs and returns 500 on any error during the process.

---

## Dependencies

- **models:** Database models (Community, Group, Post, Domain).
- **lodash:** Utility library for array/object manipulation.
- **sitemap:** For generating XML sitemaps.
- **stream:** Node.js stream utilities.
- **async:** For managing asynchronous control flow.
- **logger:** Custom logging utility.

---

## Utility Function: getCommunityURL

Constructs a full URL for a community based on its hostname, domain name, and path.

### Parameters

| Name        | Type   | Description                        |
|-------------|--------|------------------------------------|
| hostname    | string | Community hostname                 |
| domainName  | string | Domain name                        |
| path        | string | Path to append to the URL          |

### Returns

- `string`: The constructed URL in the format `https://{hostname}.{domainName}{path}`.

### Example

```javascript
getCommunityURL("mycommunity", "example.com", "/group/1");
// returns "https://mycommunity.example.com/group/1"
```

---

## Exported Constants

### wildCardDomainNames

A list of domain names that are treated as "wildcard" domains for special URL construction logic.

```js
[
  "betrireykjavik.is",
  "betraisland.is",
  "yrpri.org",
  "evoly.ai",
  "tarsalgo.net",
  "ypus.org",
  "idea-synergy.com",
  "localhost:4242",
]
```

---

## Example Usage

This controller is typically used as an Express route handler:

```javascript
const generateSitemap = require('./generateSitemap.cjs');

app.get('/sitemap.xml', (req, res) => {
  // req.ypDomain, req.ypCommunity, and req.redisClient must be set by middleware
  generateSitemap(req, res);
});
```

---

## Related Files

- [models/index.cjs](./models/index.md) — Database models used for querying communities, groups, posts, and domains.
- [logger.cjs](./logger.md) — Logging utility for error reporting.

---

## Notes

- The controller expects certain properties (`ypDomain`, `ypCommunity`, `redisClient`) to be set on the request object by upstream middleware.
- The sitemap is cached in Redis for performance. The cache TTL can be configured via the `SITEMAP_CACHE_TTL` environment variable.
- Special handling is included for certain domains (e.g., `parliament.scot`, `engage-southampton.ac.uk`) to override the base hostname.
- All URLs in the sitemap have spaces removed for validity.

---

**See also:**  
- [SitemapStream documentation](https://www.npmjs.com/package/sitemap)
- [Express.js Middleware Documentation](https://expressjs.com/en/guide/using-middleware.html)