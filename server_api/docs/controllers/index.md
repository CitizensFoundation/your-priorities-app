# API Router: index.cjs

This module defines the main router for serving the frontend index.html file for various routes in the application. It dynamically injects site-specific and environment-specific data into the HTML, supports multiple branded deployments, and handles caching for performance. The router supports both the new and old versions of the frontend client.

---

## API Endpoints

### [GET] /
Serves the main index.html file for the root path, with dynamic branding and sharing data.

#### Request

##### Parameters
_None_

##### Headers
| Name           | Type   | Description                | Required |
|----------------|--------|----------------------------|----------|
| Cookie         | string | Session or auth cookies    | No       |

##### Body
_None_

#### Response

##### Success (200)
```html
<!-- HTML content of index.html with dynamic replacements -->
<!DOCTYPE html>
<html lang="en">
  ...
</html>
```
Returns the HTML content of the index page, with branding, analytics, and sharing data injected.

##### Error (500)
```text
Server error
```
Returned if there is an error processing the index file.

---

### [GET] /domain{/*splat}
### [GET] /organization{/*splat}
### [GET] /community{/*splat}
### [GET] /agent_bundle{/*splat}
### [GET] /group{/*splat}
### [GET] /post{/*splat}
### [GET] /user{/*splat}

All these routes serve the index.html file, with dynamic data based on the URL and request context. The same request/response structure as the root endpoint applies.

---

## Controller: sendIndex

Handles the logic for serving the index.html file, including cache management, dynamic data injection, and error handling.

### Parameters

| Name | Type     | Description                  |
|------|----------|------------------------------|
| req  | Request  | Express request object       |
| res  | Response | Express response object      |

### Responsibilities

- Determines which version of the frontend to serve (new or old).
- Loads and caches the appropriate index.html file.
- Injects branding, analytics, and sharing data into the HTML.
- Handles errors and falls back to hardcoded or environment-based defaults if needed.

---

## Service/Utility Functions

### replaceSiteData

Injects site-specific and environment-specific data into the index.html file, including analytics scripts, branding, and sharing metadata.

#### Parameters

| Name           | Type    | Description                                 |
|----------------|---------|---------------------------------------------|
| indexFileData  | string  | Raw HTML content of index.html              |
| req            | Request | Express request object                      |
| useNewVersion  | boolean | Whether to use the new frontend version     |

#### Returns

- `Promise<string>`: The HTML content with all replacements applied.

---

### replaceSharingData

Replaces sharing metadata (title, description, URL, etc.) in the HTML based on the current collection (domain, community, group, or post).

#### Parameters

| Name           | Type    | Description                                 |
|----------------|---------|---------------------------------------------|
| req            | Request | Express request object                      |
| indexFileData  | string  | HTML content to modify                      |

#### Returns

- `Promise<string>`: HTML with sharing data replaced.

---

### getCollection

Determines the current collection (domain, community, group, or post) based on the request URL and parameters.

#### Parameters

| Name | Type    | Description                  |
|------|---------|------------------------------|
| req  | Request | Express request object       |

#### Returns

- `Promise<{ collection: any }>`: The relevant collection object.

---

### cacheIndexFile

Reads and caches the index.html file for a given version (new or old).

#### Parameters

| Name      | Type   | Description                        |
|-----------|--------|------------------------------------|
| filePath  | string | Path to the index.html file        |
| versionKey| string | 'newVersion' or 'oldVersion'       |

#### Returns

- `Promise<void>`

---

### initializeIndexCache

Initializes the cache for both the new and old index.html files at server startup.

#### Returns

- `Promise<void>`

---

### replaceWithHardCodedFallback

Fallback function to inject hardcoded branding and description data into the HTML if dynamic sharing data fails.

#### Parameters

| Name           | Type    | Description                                 |
|----------------|---------|---------------------------------------------|
| req            | Request | Express request object                      |
| indexFileData  | string  | HTML content to modify                      |

#### Returns

- `string`: HTML with fallback data replaced.

---

### Branding Replacement Functions

Each of the following functions replaces branding placeholders in the HTML for a specific deployment/brand:

- `replaceForBetterReykjavik`
- `replaceForBetterReykjavikFallback`
- `replaceForBetterIceland`
- `replaceForBetterIcelandFallback`
- `replaceForYrpri`
- `replaceForYrpriFallback`
- `replaceForEngageBritain`
- `replaceForEngageBritainFallback`
- `replaceForMyCityChallenge`
- `replaceForMyCityChallengeFallback`
- `replaceForTarsalgo`
- `replaceForTarsalgoFallback`
- `replaceForOpenMontana`
- `replaceForOpenMontanaFallback`
- `replaceForParlScot`
- `replaceForParlScotFallback`
- `replaceForJungesWien`
- `replaceForJungesWienFallback`
- `replaceForSmarterNJ`
- `replaceForSmarterNJFallback`
- `replaceForCommunityFund`
- `replaceForCommunityFundFallback`
- `replaceFromEnv`
- `replaceFromEnvFallback`

#### Parameters

| Name           | Type    | Description                                 |
|----------------|---------|---------------------------------------------|
| data           | string  | HTML content to modify                      |

#### Returns

- `string`: HTML with branding placeholders replaced.

---

### Analytics and Script Injection Utilities

#### getGA4Code

Generates the Google Analytics 4 script block.

| Name | Type   | Description                |
|------|--------|----------------------------|
| tag  | string | GA4 tag ID                 |

**Returns:** `string` (HTML script block)

#### getPlausibleCode

Generates the Plausible Analytics script block.

| Name       | Type   | Description                |
|------------|--------|----------------------------|
| dataDomain | string | Plausible data domain      |

**Returns:** `string` (HTML script block)

#### ziggeoHeaders

Generates Ziggeo video API script and stylesheet tags.

| Name                  | Type   | Description                |
|-----------------------|--------|----------------------------|
| ziggeoApplicationToken| string | Ziggeo application token   |

**Returns:** `string` (HTML and script tags)

---

## Exported Constants

### indexCache

Cache object for storing the contents and last modified times of the new and old index.html files.

| Property    | Type   | Description                                 |
|-------------|--------|---------------------------------------------|
| newVersion  | object | `{ data: string|null, lastModified: string|null }` |
| oldVersion  | object | `{ data: string|null, lastModified: string|null }` |

---

## Dependencies

- [express](https://expressjs.com/)
- [logger.cjs](../utils/logger.cjs)
- [to_json.cjs](../utils/to_json.cjs)
- [sharing_parameters.cjs](../utils/sharing_parameters.cjs)
- [models](../models/index.cjs)
- [fs](https://nodejs.org/api/fs.html)
- [path](https://nodejs.org/api/path.html)

---

## Example Usage

This router is typically mounted at the root of the Express app:

```javascript
const indexRouter = require('./routes/index.cjs');
app.use('/', indexRouter);
```

---

## See Also

- [logger.cjs](../utils/logger.cjs.md)
- [sharing_parameters.cjs](../utils/sharing_parameters.cjs.md)
- [models](../models/index.cjs.md)
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)

---