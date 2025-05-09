# Utility Module: addPostPointsToSheet.cjs

This module provides utility functions for processing and exporting "points" (comments, arguments, or feedback) associated with posts in a group context, typically for exporting to a spreadsheet (worksheet). It includes logic for formatting point content, extracting media/transcripts, and preparing data rows for export.

---

## Exported Functions

| Name                  | Parameters                                 | Return Type | Description                                                                 |
|-----------------------|--------------------------------------------|-------------|-----------------------------------------------------------------------------|
| addPostPointsToSheet  | worksheet: Worksheet, post: Post, group: Group | void        | Adds all points from a post to a worksheet, formatting and enriching data.  |

---

# Function: addPostPointsToSheet

Adds all points associated with a post to a worksheet, formatting each row with relevant metadata, content, and media information.

## Parameters

| Name      | Type       | Description                                                                 |
|-----------|------------|-----------------------------------------------------------------------------|
| worksheet | Worksheet  | The worksheet object (e.g., from ExcelJS) to which rows will be added.      |
| post      | Post       | The post object containing points and related data.                         |
| group     | Group      | The group object providing context and configuration for the post/points.    |

## Row Structure

Each point is added as a row with the following fields:

| Field              | Type    | Description                                                                                  |
|--------------------|---------|----------------------------------------------------------------------------------------------|
| groupId            | string/number | The ID of the group.                                                                |
| postId             | string/number | The ID of the post.                                                                 |
| postName           | string  | The translated or original name of the post.                                               |
| status             | string  | The status of the point.                                                                  |
| createdAt          | string  | The creation date/time of the point, formatted as "DD/MM/YY HH:mm".                       |
| email              | string  | The email of the user who created the point.                                               |
| userName           | string  | The name of the user who created the point.                                                |
| pointLocale        | string  | The language/locale of the point.                                                          |
| helpfulCount       | number  | The number of "helpful" votes for the point.                                               |
| unhelpfulCount     | number  | The number of "unhelpful" votes for the point.                                             |
| value              | string  | The value of the point, as a human-readable string ("Comment", "Point for", "Point against").|
| pointContentLatest | string  | The latest content of the point, including admin comments if present.                      |
| pointTranscript    | string  | The transcript of any media attached to the point (from `getMediaTranscripts`).            |
| mediaUrls          | string[]| Array of media URLs attached to the point (from `getPointMediaUrls`).                      |

## Behavior

- Iterates over all `Points` in the given `post`.
- For each point, constructs a row with formatted and enriched data.
- Uses helper functions to format content, extract media, and determine value text.
- Adds each row to the provided worksheet.
- Logs an error if any required data is missing.

---

# Internal Utility Functions

## Function: getPointTextWithEverything

Formats the main content of a point, including any admin comments, for export.

### Parameters

| Name  | Type   | Description                                 |
|-------|--------|---------------------------------------------|
| group | Group  | The group object for configuration/context. |
| post  | Post   | The post object containing translations.    |
| point | Point  | The point object to extract content from.   |

### Returns

- `string`: The formatted point content, including admin comments if present.

### Behavior

- Uses the latest revision or translation for the point's main content.
- Appends admin comment title, timestamp, username, and text if available.
- Returns the combined, trimmed string.
- Logs an error if required data is missing.

---

## Function: getPointValueText

Converts a point's numeric value to a human-readable string.

### Parameters

| Name  | Type   | Description                        |
|-------|--------|------------------------------------|
| value | number | The value of the point (e.g., -1, 0, 1). |

### Returns

- `string`: "Comment" (0), "Point for" (>0), or "Point against" (<0).

---

## External Dependencies

- **moment**: Used for date formatting.
- **getMediaTranscripts**: Imported from `common_utils.cjs`, extracts transcripts from point media.
- **getPointMediaUrls**: Imported from `common_utils.cjs`, extracts media URLs from a point.

---

# Example Usage

```javascript
const { addPostPointsToSheet } = require('./addPostPointsToSheet.cjs');
const worksheet = ...; // e.g., from ExcelJS
const post = ...;      // Post object with Points
const group = ...;     // Group object

addPostPointsToSheet(worksheet, post, group);
```

---

# Related Utility Modules

- [common_utils.cjs](./common_utils.md): Provides `getMediaTranscripts` and `getPointMediaUrls`.

---

# Error Handling

- Logs errors to the console if required data is missing for either `addPostPointsToSheet` or `getPointTextWithEverything`.

---

# Configuration

No configuration objects are exported from this module.

---

# Exported Constants

None.

---

# See Also

- [common_utils.cjs](./common_utils.md) for media and transcript extraction utilities.
- [moment](https://momentjs.com/) for date formatting.

---

**Note:** The types `Worksheet`, `Post`, `Group`, and `Point` are assumed to be application-specific and should be defined elsewhere in your codebase or documentation.