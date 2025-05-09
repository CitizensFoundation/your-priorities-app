# API Endpoint: GET /:id

Redirects legacy post URLs to their new canonical URL based on the legacy post ID. This endpoint is used to maintain backward compatibility with old post links by mapping a legacy post identifier to the current post and issuing a 301 redirect to the new URL.

## Request

### Parameters

| Name | Type   | In   | Description                                      | Required |
|------|--------|------|--------------------------------------------------|----------|
| id   | string | path | The legacy post ID (may include a dash and suffix)| Yes      |

### Headers

| Name         | Type   | Description                        | Required |
|--------------|--------|------------------------------------|----------|
| Host         | string | The host header for URL generation | Yes      |

### Body

No request body is required.

## Response

### Success (301 Moved Permanently)

Redirects to the canonical post URL.

**Location Header Example:**
```
Location: https://yourdomain.com/post/123
```

No response body is sent.

### Error (404 Not Found)

```json
{
  "error": "Not Found"
}
```
Returned if the legacy post ID does not map to a valid post, or if an error occurs during lookup.

---

# Middleware/Utility: hostPartOfUrl

Generates the protocol and host part of the current request's URL. Used to construct absolute URLs for redirects.

## Parameters

| Name | Type   | Description                |
|------|--------|----------------------------|
| req  | Request| Express request object     |

## Returns

- `string`: The protocol and host part of the URL (e.g., `https://example.com`).

---

# Dependencies

- **models**: [../models/index.cjs](../models/index.cjs)  
  Provides access to ORM models: `Post`, `Group`, `Community`, `Domain`.
- **auth**: [../authorization.cjs](../authorization.cjs)  
  (Imported but not used in this file.)
- **log**: [../utils/logger.cjs](../utils/logger.cjs)  
  Used for error logging.
- **toJson**: [../utils/to_json.cjs](../utils/to_json.cjs)  
  (Imported but not used in this file.)
- **url**: Node.js built-in module for URL formatting.

---

# Route Handler: GET /:id

## Description

- Extracts the legacy post ID from the URL path parameter (splitting on `-` to remove any suffix).
- Looks up the post in the database by `legacy_post_id`, ensuring the post is associated with the current domain (`req.ypDomain.id`).
- If found, issues a 301 redirect to the canonical post URL (`/post/:id`).
- If not found or on error, responds with 404 Not Found and logs the error.

## Parameters

| Name | Type   | Description                |
|------|--------|----------------------------|
| req  | Request| Express request object     |
| res  | Response| Express response object   |

---

# Exported

- **router**: Express Router instance with the legacy post redirect route.

---

# Example Usage

```http
GET /12345-legacy-title HTTP/1.1
Host: example.com
```

**Response:**
```
HTTP/1.1 301 Moved Permanently
Location: https://example.com/post/6789
```

---

# See Also

- [models/index.cjs](../models/index.cjs)
- [utils/logger.cjs](../utils/logger.cjs)
- [utils/to_json.cjs](../utils/to_json.cjs)
- [authorization.cjs](../authorization.cjs)
