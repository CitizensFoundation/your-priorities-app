# Controller: generateManifest

Generates and serves a [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) JSON for a community or domain, including dynamic icon selection and app naming based on the request context. This manifest is typically used for Progressive Web Apps (PWAs) to define how the app appears to the user and how it can be launched.

## Parameters

| Name | Type     | Description                        |
|------|----------|------------------------------------|
| req  | Request  | Express request object. Expects `ypCommunity` and/or `ypDomain` objects with `configuration` properties attached (typically via middleware). |
| res  | Response | Express response object. Used to send the manifest JSON. |

## Request

### Headers

None required.

### Body

Not applicable (manifest is generated based on request context).

## Response

### Success (200)

```json
{
  "display": "standalone",
  "start_url": "/?utm_source=web_app_manifest",
  "theme_color": "#103458",
  "background_color": "#ffffff",
  "orientation": "any",
  "icons": [
    {
      "src": "/images/manifest_yp/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/images/manifest_yp/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "short_name": "Community",
  "name": "Community Name"
}
```

- `icons`: Array of icon objects, either default or generated from a custom image.
- `short_name`: Short name for the app (max 12 characters).
- `name`: Full name for the app.

### Error (500)

```json
{
  "error": "Error from generating manifest data"
}
```

- Returns HTTP 500 if there is an error generating the manifest (e.g., image not found).

---

# Utility Function: setupIconsFromDefault

Returns a default set of icons for the manifest.

## Parameters

| Name     | Type       | Description                                 |
|----------|------------|---------------------------------------------|
| callback | function   | Node-style callback `(err, icons)`          |

## Example

```javascript
setupIconsFromDefault((err, icons) => {
  // icons is an array of default icon objects
});
```

---

# Utility Function: setupIconsFromImage

Generates an array of icon objects for the manifest from a custom image, using the `Image` model.

## Parameters

| Name     | Type     | Description                                 |
|----------|----------|---------------------------------------------|
| imageId  | number   | ID of the image in the database             |
| callback | function | Node-style callback `(err, icons)`          |

- Looks up the image by `imageId` in the database.
- Expects the `formats` property of the image to be a JSON string array of image URLs for various sizes.

## Example

```javascript
setupIconsFromImage(123, (err, icons) => {
  // icons is an array of icon objects for the manifest
});
```

---

# Dependencies

- **models**: Imports the database models, specifically expects an `Image` model with a `formats` property.
- **lodash**: Utility library (not directly used in this file).
- **async**: Used for control flow (`async.series`).

---

# Exported

| Name             | Type       | Description                                 |
|------------------|------------|---------------------------------------------|
| generateManifest | function   | Express route/controller for serving the manifest. |

---

# Example Usage

```javascript
const express = require('express');
const generateManifest = require('./path/to/this/file');

const app = express();

app.get('/manifest.json', generateManifest);
```

---

# Related Models

- [Image](../models/index.cjs): The `Image` model is expected to have an `id` and a `formats` property (JSON string array of image URLs).

---

# Notes

- The controller expects `req.ypCommunity` and/or `req.ypDomain` to be populated, typically by earlier middleware.
- The manifest's `short_name` is truncated to 12 characters if longer.
- If a custom icon is not found, falls back to default icons.
- Errors are logged and result in a 500 response with no body (except for a log entry).

---

# See Also

- [Web App Manifest documentation (MDN)](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Express.js Response API](https://expressjs.com/en/4x/api.html#res)
