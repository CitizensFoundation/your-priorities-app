# API Endpoint: [GET] /:id

Redirects legacy page URLs to their new canonical URLs based on the provided legacy page ID and the current domain context. If the legacy page is found, issues a 301 redirect to the new page URL. If not found, returns a 404 status.

## Request

### Parameters

| Name | Type   | In   | Description                                         | Required |
|------|--------|------|-----------------------------------------------------|----------|
| id   | string | path | The legacy page ID (may include a dash and suffix). | Yes      |

### Headers

| Name         | Type   | Description                        | Required |
|--------------|--------|------------------------------------|----------|
| Host         | string | The domain name of the request.    | Yes      |

### Body

_No request body required._

## Response

### Success (301 Moved Permanently)

Redirects to the canonical page URL.

**Location Header Example:**
```
Location: https://example.com/page/123
```

No response body is sent.

### Error (404 Not Found)

```json
{
  "error": "Not Found"
}
```
If the legacy page is not found or an error occurs, a 404 status is returned. The response body may be empty.

---

# Middleware/Utility: hostPartOfUrl

Returns the protocol and host part of the current request, used to construct absolute URLs for redirects.

## Parameters

| Name | Type   | Description                    |
|------|--------|--------------------------------|
| req  | Request| Express request object         |

## Returns

- `string`: The protocol and host (e.g., `https://example.com`).

## Example

```javascript
const baseUrl = hostPartOfUrl(req); // e.g., "https://example.com"
```

---

# Dependencies

- **models.Page**: Sequelize model for pages. Used to look up pages by legacy ID and domain.
- **auth**: Imported but not used in this file.
- **log**: Logger utility, used to log errors.
- **toJson**: Imported but not used in this file.
- **url**: Node.js URL module, used for formatting the base URL.

---

# Exported Router

This file exports an Express router with a single route:

- **GET /:id**: Handles legacy page ID redirection.

---

# See Also

- [models/index.cjs](./models/index.md)
- [authorization.cjs](./authorization.md)
- [utils/logger.cjs](./utils/logger.md)
- [utils/to_json.cjs](./utils/to_json.md)
- [Node.js url module](https://nodejs.org/api/url.html)

---

# Notes

- The route expects `req.ypDomain.id` to be set by earlier middleware (not shown here).
- The legacy page ID is extracted by splitting on `-` and taking the first segment.
- Errors are logged with context `'legacy_page_id'`.
- The redirect is permanent (HTTP 301).
