# Utility Module: exportUtils

This module provides a set of utility functions for exporting data related to posts, users, logins, and associated media in a community/group context. It is primarily used for generating CSV export files for reporting and administrative purposes. The module interacts with Sequelize models and provides data cleaning, formatting, and aggregation utilities.

---

## Exported Functions

| Name                              | Parameters                                                                 | Return Type | Description                                                                                 |
|------------------------------------|----------------------------------------------------------------------------|-------------|---------------------------------------------------------------------------------------------|
| getExportFileDataForGroup          | group: Group, hostName: string, callback: Function                         | void        | Generates a CSV export of all posts in a group, including metadata and media.               |
| getLoginsExportDataForCommunity    | communityId: number, hostName: string, callback: Function                  | void        | Generates a CSV export of user login activities for a community.                            |
| getLoginsExportDataForDomain       | domainId: number, hostName: string, callback: Function                     | void        | Generates a CSV export of user login activities for a domain.                               |
| getGroupPosts                      | group: Group, hostName: string, callback: Function                         | void        | Retrieves all posts for a group, including related models, and passes them to a callback.   |
| getUsersForCommunity               | communityId: number, callback: Function                                    | void        | Generates a CSV export of all users in a community.                                         |
| getDescriptionHeaders              | group: Group                                                               | string      | Returns CSV headers for post descriptions, supporting structured questions if configured.   |
| getPostUrl                         | post: Post, hostname?: string                                              | string      | Returns the full URL for a post, using the provided or default hostname.                    |
| getCategory                        | post: Post                                                                 | string      | Returns the category name for a post, if available.                                         |
| getImages                          | post: Post                                                                 | string      | Returns a CSV-safe string of image URLs for a post.                                         |
| clean                              | text: string                                                               | string      | Cleans and sanitizes a string for CSV output.                                               |
| getDescriptionColumns              | group: Group, post: Post                                                   | string      | Returns CSV columns for post descriptions, supporting structured answers if configured.     |
| getPointsDown                      | post: Post                                                                 | string      | Returns a CSV-safe string of all "down" points for a post.                                  |
| getPointsUp                        | post: Post                                                                 | string      | Returns a CSV-safe string of all "up" points for a post.                                    |
| getUserEmail                       | post: Post                                                                 | string      | Returns the user's email for a post, or "hidden" if email export is disabled.               |
| getRatingHeaders                   | customRatings: Array<{name: string}>                                       | string      | Returns CSV headers for custom ratings.                                                     |
| getContactData                     | post: Post                                                                 | string      | Returns CSV-safe contact data for a post.                                                   |
| getLocation                        | post: Post                                                                 | string      | Returns latitude and longitude as a CSV string for a post.                                  |
| getAttachmentData                  | post: Post                                                                 | string      | Returns CSV-safe attachment data for a post.                                                |
| getMediaURLs                       | post: Post                                                                 | string      | Returns a CSV-safe string of all media URLs for a post.                                     |
| getMediaTranscripts                | post: Post                                                                 | string      | Returns the transcript text for a post's media, if available.                               |
| getPostRatings                     | customRatings: Array, postRatings: Array                                   | string      | Returns CSV columns for post ratings.                                                       |

---

## Function Documentation

### getExportFileDataForGroup

Generates a CSV export of all posts in a group, including metadata, points, images, contact data, attachments, media, and ratings.

#### Parameters

| Name     | Type   | Description                                      |
|----------|--------|--------------------------------------------------|
| group    | Group  | The group object (Sequelize model instance).     |
| hostName | string | The hostname to use for generating post URLs.    |
| callback | Function | Callback function (error, csvString).          |

#### Example
```javascript
getExportFileDataForGroup(group, 'example.com', (err, csv) => {
  // handle csv or error
});
```

---

### getLoginsExportDataForCommunity

Generates a CSV export of user login activities for a specific community.

#### Parameters

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| communityId | number | The ID of the community.                         |
| hostName    | string | The hostname (not used in output, for consistency). |
| callback    | Function | Callback function (error, csvString).          |

---

### getLoginsExportDataForDomain

Generates a CSV export of user login activities for a specific domain.

#### Parameters

| Name      | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| domainId  | number | The ID of the domain.                            |
| hostName  | string | The hostname (not used in output, for consistency). |
| callback  | Function | Callback function (error, csvString).          |

---

### getGroupPosts

Retrieves all posts for a group, including related models (category, group, revisions, points, images, user, media), and passes them to a callback.

#### Parameters

| Name     | Type   | Description                                      |
|----------|--------|--------------------------------------------------|
| group    | Group  | The group object (Sequelize model instance).     |
| hostName | string | The hostname to use for generating post URLs.    |
| callback | Function | Callback function (posts, error, categories).  |

---

### getUsersForCommunity

Generates a CSV export of all users in a community, including their ID, name, email, and SSN.

#### Parameters

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| communityId | number | The ID of the community.                         |
| callback    | Function | Callback function (error, csvString).          |

---

### getDescriptionHeaders

Returns CSV headers for post descriptions. If the group has structured questions configured, returns those as headers; otherwise, returns "Description".

#### Parameters

| Name  | Type  | Description                        |
|-------|-------|------------------------------------|
| group | Group | The group object.                  |

#### Returns

- `string`: CSV header string.

---

### getPostUrl

Returns the full URL for a post, using the provided or default hostname.

#### Parameters

| Name     | Type   | Description                                      |
|----------|--------|--------------------------------------------------|
| post     | Post   | The post object.                                 |
| hostname | string | (Optional) Hostname to use for the URL.          |

#### Returns

- `string`: The full post URL.

---

### getCategory

Returns the category name for a post, if available.

#### Parameters

| Name | Type | Description      |
|------|------|------------------|
| post | Post | The post object. |

#### Returns

- `string`: Category name or empty string.

---

### getImages

Returns a CSV-safe string of image URLs for a post, including header and user images.

#### Parameters

| Name | Type | Description      |
|------|------|------------------|
| post | Post | The post object. |

#### Returns

- `string`: Quoted, comma-separated image URLs.

---

### clean

Cleans and sanitizes a string for CSV output by replacing problematic characters and trimming whitespace.

#### Parameters

| Name | Type   | Description         |
|------|--------|---------------------|
| text | string | The input string.   |

#### Returns

- `string`: Cleaned string.

---

### getDescriptionColumns

Returns CSV columns for post descriptions. If the group has structured questions, returns answers as columns; otherwise, returns the post description.

#### Parameters

| Name  | Type  | Description      |
|-------|-------|------------------|
| group | Group | The group object.|
| post  | Post  | The post object. |

#### Returns

- `string`: CSV columns for description.

---

### getPointsDown

Returns a CSV-safe string of all "down" points (negative value) for a post.

#### Parameters

| Name | Type | Description      |
|------|------|------------------|
| post | Post | The post object. |

#### Returns

- `string`: Quoted, newline-separated points.

---

### getPointsUp

Returns a CSV-safe string of all "up" points (positive value) for a post.

#### Parameters

| Name | Type | Description      |
|------|------|------------------|
| post | Post | The post object. |

#### Returns

- `string`: Quoted, newline-separated points.

---

### getUserEmail

Returns the user's email for a post, or "hidden" if email export is disabled.

#### Parameters

| Name | Type | Description      |
|------|------|------------------|
| post | Post | The post object. |

#### Returns

- `string`: User email or "hidden".

---

### getRatingHeaders

Returns CSV headers for custom ratings.

#### Parameters

| Name         | Type   | Description                        |
|--------------|--------|------------------------------------|
| customRatings| Array<{name: string}> | Array of custom rating objects. |

#### Returns

- `string`: CSV header string for ratings.

---

### getContactData

Returns CSV-safe contact data (name, email, telephone) for a post.

#### Parameters

| Name | Type | Description      |
|------|------|------------------|
| post | Post | The post object. |

#### Returns

- `string`: Quoted, comma-separated contact data.

---

### getLocation

Returns latitude and longitude as a CSV string for a post.

#### Parameters

| Name | Type | Description      |
|------|------|------------------|
| post | Post | The post object. |

#### Returns

- `string`: Comma-separated latitude and longitude.

---

### getAttachmentData

Returns CSV-safe attachment data (URL, filename) for a post.

#### Parameters

| Name | Type | Description      |
|------|------|------------------|
| post | Post | The post object. |

#### Returns

- `string`: Quoted, comma-separated attachment data.

---

### getMediaURLs

Returns a CSV-safe string of all media URLs (audio/video) for a post and its points.

#### Parameters

| Name | Type | Description      |
|------|------|------------------|
| post | Post | The post object. |

#### Returns

- `string`: Quoted, newline-separated media URLs.

---

### getMediaTranscripts

Returns the transcript text for a post's media, if available.

#### Parameters

| Name | Type | Description      |
|------|------|------------------|
| post | Post | The post object. |

#### Returns

- `string`: Quoted transcript text or empty string.

---

### getPostRatings

Returns CSV columns for post ratings, including count and average for each custom rating.

#### Parameters

| Name         | Type   | Description                        |
|--------------|--------|------------------------------------|
| customRatings| Array  | Array of custom rating objects.    |
| postRatings  | Array  | Array of post rating objects.      |

#### Returns

- `string`: CSV columns for ratings.

---

## Internal Utility Functions

These functions are used internally and are not exported:

- `cleanDescription(text: string): string` — Cleans description text for CSV.
- `getPoints(points: Array<Point>): string` — Aggregates and cleans point content.
- `getPointsUpOrDown(post: Post, value: number): string` — Gets points with positive or negative value.
- `getImageFormatUrl(image: Image, formatId: number): string` — Gets image URL for a specific format.
- `getMediaFormatUrl(media: Media, formatId: number): string` — Gets media URL for a specific format.

---

## Example Usage

```javascript
const exportUtils = require('./exportUtils.cjs');

exportUtils.getExportFileDataForGroup(group, 'example.com', (err, csv) => {
  if (err) throw err;
  // Do something with csv
});

exportUtils.getLoginsExportDataForCommunity(123, 'example.com', (err, csv) => {
  // Handle login export
});
```

---

## Dependencies

- [Sequelize models](../models/index.cjs)
- [async](https://caolan.github.io/async/)
- [lodash](https://lodash.com/)
- [moment](https://momentjs.com/)

---

## Configuration and Constants

- `hostName`: Used as the default hostname for generating URLs.
- `skipEmail`: If set to `true`, user emails are hidden in exports.

---

## See Also

- [models/index.cjs](../models/index.cjs) — Sequelize models used for data retrieval.
- [async documentation](https://caolan.github.io/async/)
- [lodash documentation](https://lodash.com/)
- [moment documentation](https://momentjs.com/)

---

**Note:** This module is designed for internal use in administrative and reporting tools. It assumes the presence of specific Sequelize models and data structures. For more details on the models, refer to your application's model definitions.