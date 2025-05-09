# Service Module: Analytics Importer

This module provides functions to import various entities (Domain, Community, Group, Post, Point) into an external analytics system via HTTP POST requests. It also includes several internal utility functions for media extraction and data formatting.

---

## Exported Functions

| Name             | Parameters                       | Return Type | Description                                                                 |
|------------------|----------------------------------|-------------|-----------------------------------------------------------------------------|
| importDomain     | domain: object, done: function   | void        | Imports a domain entity to the analytics system.                            |
| importCommunity  | community: object, done: function| void        | Imports a community entity to the analytics system.                         |
| importGroup      | group: object, done: function    | void        | Imports a group entity to the analytics system.                             |
| importPost       | post: object, done: function     | void        | Imports a post entity to the analytics system, including media and metadata. |
| importPoint      | point: object, done: function    | void        | Imports a point entity to the analytics system, including media and metadata.|

---

## Service: importDomain

Imports a domain entity into the analytics system by sending a POST request with the domain's properties.

### Parameters

| Name    | Type     | Description                                 |
|---------|----------|---------------------------------------------|
| domain  | object   | The domain object to import.                |
| done    | function | Callback function(error) after completion.  |

---

## Service: importCommunity

Imports a community entity into the analytics system by sending a POST request with the community's properties.

### Parameters

| Name      | Type     | Description                                 |
|-----------|----------|---------------------------------------------|
| community | object   | The community object to import.             |
| done      | function | Callback function(error) after completion.  |

---

## Service: importGroup

Imports a group entity into the analytics system by sending a POST request with the group's properties.

### Parameters

| Name    | Type     | Description                                 |
|---------|----------|---------------------------------------------|
| group   | object   | The group object to import.                 |
| done    | function | Callback function(error) after completion.  |

---

## Service: importPost

Imports a post entity into the analytics system. Handles media extraction, language resolution, description building, and access flags.

### Parameters

| Name    | Type     | Description                                 |
|---------|----------|---------------------------------------------|
| post    | object   | The post object to import.                  |
| done    | function | Callback function(error) after completion.  |

---

## Service: importPoint

Imports a point entity into the analytics system. Handles media extraction, language resolution, and access flags.

### Parameters

| Name    | Type     | Description                                 |
|---------|----------|---------------------------------------------|
| point   | object   | The point object to import.                 |
| done    | function | Callback function(error) after completion.  |

---

# Internal Utility Functions

These functions are used internally for media extraction and data formatting.

## Function: convertToString

Converts an integer to a string, logging an error if the value is falsy.

### Parameters

| Name   | Type    | Description                        |
|--------|---------|------------------------------------|
| integer| number  | The integer to convert.            |
| type   | string  | The type/context for error logging.|

### Returns

- `string` if integer is provided.
- `undefined` and logs error if integer is falsy.

---

## Function: _getVideoURL

Extracts the first video format URL from a list of video objects.

### Parameters

| Name   | Type    | Description                        |
|--------|---------|------------------------------------|
| videos | array   | Array of video objects.            |

### Returns

- `string` (URL) if available, otherwise `null`.

---

## Function: _getAudioURL

Extracts the first audio format URL from a list of audio objects.

### Parameters

| Name   | Type    | Description                        |
|--------|---------|------------------------------------|
| audios | array   | Array of audio objects.            |

### Returns

- `string` (URL) if available, otherwise `null`.

---

## Function: _getVideoPosterURL

Extracts the poster image URL for a video, optionally using a selected image index.

### Parameters

| Name               | Type    | Description                                 |
|--------------------|---------|---------------------------------------------|
| videos             | array   | Array of video objects.                     |
| images             | array   | Array of image objects (fallback).          |
| selectedImageIndex | number  | Index of the image to use (optional).       |

### Returns

- `string` (URL) if available, otherwise `null`.

---

## Function: _getImageFormatUrl

Extracts a specific image format URL from an array of image objects.

### Parameters

| Name     | Type    | Description                        |
|----------|---------|------------------------------------|
| images   | array   | Array of image objects.            |
| formatId | number  | Index of the format to extract.    |

### Returns

- `string` (URL) if available, otherwise `""`.

---

## Function: _hasCoverMediaType

Determines if a post has a specific cover media type.

### Parameters

| Name      | Type    | Description                        |
|-----------|---------|------------------------------------|
| post      | object  | The post object.                   |
| mediaType | string  | The media type to check for.       |

### Returns

- `boolean` indicating if the post has the specified cover media type.

---

# Environment Variables

The following environment variables are required for the module to function:

| Name                        | Description                                      |
|-----------------------------|--------------------------------------------------|
| AC_ANALYTICS_BASE_URL       | Base URL for the analytics API.                  |
| AC_ANALYTICS_CLUSTER_ID     | Cluster ID for the analytics API.                |
| AC_ANALYTICS_KEY            | API key for authentication with the analytics API.|

---

# Example Usage

```javascript
const analyticsImporter = require('./path/to/this/module');

// Import a domain
analyticsImporter.importDomain(domainObject, (error) => {
  if (error) {
    console.error('Failed to import domain:', error);
  } else {
    console.log('Domain imported successfully');
  }
});
```

---

# Dependencies

- [lodash](https://lodash.com/) for object merging.
- [request](https://github.com/request/request) for HTTP requests.
- `models` from `../../../models/index.cjs` for access constants.

---

# Exported Constants

None.

---

# Notes

- All import functions expect the entity object to be fully populated with required nested properties.
- Media extraction utilities expect specific data structures for images, videos, and audios.
- The module logs errors and info to the console for debugging purposes.
- The module is designed for internal use as a service layer for analytics data synchronization.

---

For related data models, see [models/index.cjs](../../../models/index.cjs).