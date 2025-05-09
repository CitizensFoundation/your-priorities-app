# API Endpoint: GET /:id

Redirects legacy user IDs to the new user URL based on the provided legacy user ID. If the user is found, issues a 301 redirect to the new user URL; otherwise, returns a 404 status.

## Request

### Parameters

| Name | Type   | In   | Description                                      | Required |
|------|--------|------|--------------------------------------------------|----------|
| id   | string | path | The legacy user ID (may include a dash and suffix)| Yes      |

### Headers

| Name         | Type   | Description                | Required |
|--------------|--------|----------------------------|----------|
| Host         | string | Host header for URL building| Yes      |

### Body

No request body.

## Response

### Success (301 Moved Permanently)

Redirects to the new user URL.

**Location Header Example:**
```
Location: https://yourdomain.com/user/123
```

No response body.

### Error (404 Not Found)

```json
{
  "error": "User not found"
}
```
If the user is not found or an error occurs, a 404 status is returned. The actual implementation sends an empty response body, but the above is a suggested error format.

---

# Middleware/Utility: hostPartOfUrl

Builds the protocol and host part of the URL from the request object.

## Parameters

| Name | Type   | Description                |
|------|--------|----------------------------|
| req  | Request| Express request object      |

## Returns

- `string`: The protocol and host part of the URL (e.g., `https://example.com`).

---

# Dependencies

- **models.User**: Used to query the user by legacy ID and domain. See [models/index.cjs](../models/index.cjs.md).
- **auth**: Imported but not used in this file. See [authorization.cjs](../authorization.cjs.md).
- **log**: Used to log errors. See [utils/logger.cjs](../utils/logger.cjs.md).
- **toJson**: Imported but not used in this file. See [utils/to_json.cjs](../utils/to_json.cjs.md).
- **url**: Node.js core module for URL formatting.

---

# Exported Router

This file exports an Express router with a single route:

- `GET /:id`: Handles legacy user ID redirection.

---

# Example Usage

Mount this router in your Express app:

```javascript
const legacyUserRouter = require('./path/to/this/router.cjs');
app.use('/legacy-user', legacyUserRouter);
```

A request to `/legacy-user/123-abc` will attempt to find the user with `legacy_user_id = 123` and redirect if found.

---

# Notes

- The route expects `req.ypDomain.id` to be set by previous middleware.
- Only the part before the dash in the `id` parameter is used for lookup.
- Redirects use HTTP 301 (Moved Permanently).
- Errors are logged with context `'legacy_user_id'`.
