# Utility Module: sharingUtils

This module provides utility functions for generating sharing parameters, constructing full URLs, and parsing/splitting URLs in the context of an Express.js application. It is primarily used to support social sharing features and campaign-based customizations.

---

## Functions

| Name                   | Parameters                                                                                  | Return Type         | Description                                                                                  |
|------------------------|---------------------------------------------------------------------------------------------|---------------------|----------------------------------------------------------------------------------------------|
| getSharingParameters   | req: Request, collection: any, url: string, imageUrl: string                                | Promise<object>     | Generates sharing parameters for a given collection, optionally customizing via campaign data.|
| getFullUrl             | req: Request                                                                               | string              | Constructs the full URL (including protocol and host) for the current request.                |
| getSplitUrl            | req: Request                                                                               | object              | Splits the request URL and extracts path components and IDs for further processing.           |

---

## Function: getSharingParameters

Generates sharing parameters (title, description, URL, image, locale) for a given collection (e.g., domain, community, group, post, user). If a valid `utm_content` query parameter is present, it customizes the parameters using campaign configuration.

### Parameters

| Name        | Type     | Description                                                                                 |
|-------------|----------|---------------------------------------------------------------------------------------------|
| req         | Request  | Express request object. Used to access query parameters.                                    |
| collection  | any      | The collection object (domain, community, group, post, or user) to generate parameters for. |
| url         | string   | The base URL to use for sharing.                                                            |
| imageUrl    | string   | The default image URL to use for sharing.                                                   |

### Returns

- **Promise<object>**: Resolves to an object containing sharing parameters:
  - `title`: string
  - `description`: string
  - `url`: string
  - `imageUrl`: string
  - `locale`: string

### Example

```typescript
const params = await getSharingParameters(req, community, "https://example.com/community/1", "https://img.com/img.png");
```

### Description

- If `req.query.utm_content` is present and numeric, attempts to fetch a campaign and override `imageUrl` and `description` from the campaign's configuration.
- The `title` and `description` are derived from the collection, with some special handling for domains (e.g., "Betri Reykjavík").
- Escapes double quotes in the description.

---

## Function: getFullUrl

Constructs the full URL (including protocol and host) for the current request, handling special cases for `_escaped_fragment_` (used by some crawlers).

### Parameters

| Name | Type     | Description                |
|------|----------|----------------------------|
| req  | Request  | Express request object.    |

### Returns

- **string**: The fully qualified URL for the current request.

### Example

```typescript
const fullUrl = getFullUrl(req);
```

### Description

- If the URL starts with `/?_escaped_fragment_=`, it removes this fragment and normalizes the path.
- Uses the `url` module to format the full URL.

---

## Function: getSplitUrl

Splits the request URL into its path components and extracts an ID from the path, handling special cases for `_escaped_fragment_`.

### Parameters

| Name | Type     | Description                |
|------|----------|----------------------------|
| req  | Request  | Express request object.    |

### Returns

- **object**: An object with the following properties:
  - `splitUrl`: string[] — The URL split by `/`.
  - `splitPath`: number — The index offset for the path (1 or 2).
  - `id`: string | undefined — The extracted ID from the path, if present.
  - `url`: string — The possibly modified URL.

### Example

```typescript
const { splitUrl, splitPath, id, url } = getSplitUrl(req);
```

### Description

- If the URL starts with `/?_escaped_fragment_=`, decodes `%2F` to `/` and adjusts the split path index.
- Extracts the ID from the path, removing any query string.

---

## Internal Function: updateParametersFromCampaign

**Not exported** — Used internally by `getSharingParameters`.

Fetches a campaign by `utmContent` and collection type/id, and updates the sharing parameters with campaign-specific configuration if available.

### Parameters

| Name           | Type     | Description                                                                 |
|----------------|----------|-----------------------------------------------------------------------------|
| utmContent     | string   | The campaign ID from the `utm_content` query parameter.                     |
| collectionType | string   | The type of collection (domain, community, group, post, user).              |
| collectionId   | string   | The ID of the collection.                                                   |
| parameters     | object   | The current sharing parameters to be updated.                               |

### Returns

- **Promise<object>**: Resolves to the updated parameters object.

---

## Dependencies

- [models](../models/index.cjs): Used to access the `Campaign` model for campaign lookups.
- [url](https://nodejs.org/api/url.html): Node.js URL module for formatting URLs.

---

## Exported Members

| Name                 | Type       | Description                                      |
|----------------------|------------|--------------------------------------------------|
| getSharingParameters | Function   | See above.                                       |
| getFullUrl           | Function   | See above.                                       |
| getSplitUrl          | Function   | See above.                                       |

---

## Usage Example

```javascript
const sharingUtils = require('./path/to/sharingUtils');

app.get('/share/:type/:id', async (req, res) => {
  const collection = await getCollection(req.params.type, req.params.id);
  const params = await sharingUtils.getSharingParameters(req, collection, sharingUtils.getFullUrl(req), '');
  res.json(params);
});
```

---

## See Also

- [Campaign Model](../models/index.cjs)
- [Express Request Object](https://expressjs.com/en/api.html#req)
