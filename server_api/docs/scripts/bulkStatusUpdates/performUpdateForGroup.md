# Script: performBulkUpdateScript.cjs

This script performs a bulk status update on posts within a specified group, using a template-based system. It is intended to be run from the command line and interacts directly with the database models to update post statuses and create news stories for each update.

---

## Usage

```bash
node performBulkUpdateScript.cjs <bulkStatusUpdateId> <userIdToPostNewsStory> <groupId>
```

- `<bulkStatusUpdateId>`: The ID of the `BulkStatusUpdate` record to process.
- `<userIdToPostNewsStory>`: The user ID to attribute news stories to.
- `<groupId>`: The group ID within the bulk update configuration to process.

---

## Process Overview

1. **Fetch BulkStatusUpdate**: Loads the specified `BulkStatusUpdate` record.
2. **Iterate Groups**: Finds the group matching the provided `groupId`.
3. **Iterate Posts**: For each post in the group:
   - Updates the post's `official_status` if a new status is specified.
   - Determines the template content to use for the news story.
   - Creates a news story via the `Point.createNewsStory` method.
4. **Error Handling**: Logs errors and exits the process when complete.

---

## Dependencies

- [models](../../models/index.cjs): Database models (e.g., `BulkStatusUpdate`, `User`, `Post`, `Point`).
- [async](https://caolan.github.io/async/): For asynchronous control flow.
- [lodash](https://lodash.com/): Utility functions.
- [moment](https://momentjs.com/): Date/time utilities (not used in this script).

---

## Configuration

### Command-Line Arguments

| Name                    | Type   | Description                                               | Required |
|-------------------------|--------|-----------------------------------------------------------|----------|
| bulkStatusUpdateId      | string | The ID of the `BulkStatusUpdate` to process.              | Yes      |
| userIdToPostNewsStory   | string | The user ID to attribute news stories to.                 | Yes      |
| groupId                 | string | The group ID within the bulk update configuration.        | Yes      |

---

## Main Logic

### 1. Fetch BulkStatusUpdate

- **Model**: `BulkStatusUpdate`
- **Query**: `findOne({ where: { id } })`
- **Purpose**: Loads the bulk update configuration, including groups and templates.

### 2. Group and Post Iteration

- **Group Selection**: Only processes the group matching the provided `groupId`.
- **Post Processing**:
  - For each post with a `newOfficialStatus`:
    - Finds the appropriate template by `selectedTemplateName`.
    - If no template content is found, uses `uniqueStatusMessage` if available.
    - Updates the post's `official_status`.
    - Creates a news story using `Point.createNewsStory`.

### 3. Template Selection

#### Utility Function: `getTemplate`

Finds a template by title from a list of templates.

#### Parameters

| Name      | Type     | Description                        |
|-----------|----------|------------------------------------|
| templates | Array    | List of template objects           |
| title     | string   | Title of the template to find      |

#### Returns

- `Object | undefined`: The matching template object, or `undefined` if not found.

#### Example

```javascript
const template = getTemplate(update.templates, post.selectedTemplateName);
```

---

## Model Interactions

### BulkStatusUpdate

- **Properties Used**:
  - `id`: The unique identifier.
  - `name`: Name of the bulk update.
  - `config.groups`: Array of group objects, each with `id` and `posts`.
  - `templates`: Array of template objects.

### User

- **Method**: `findOne({ where: { id: userIdToPostNewsStory } })`
- **Purpose**: Ensures the user exists before posting news stories.

### Post

- **Method**: `findOne({ where: { id: post.id } })`
- **Purpose**: Loads the post to update its `official_status`.

### Point

- **Method**: `createNewsStory(context, data, callback)`
- **Purpose**: Creates a news story for the post update.

#### Parameters

| Name    | Type   | Description                                 |
|---------|--------|---------------------------------------------|
| context | Object | Context object (useragent, clientIp, user)  |
| data    | Object | News story data (subType, post_id, etc.)    |
| callback| Function | Callback for completion/error             |

---

## Error Handling

- Logs errors to the console.
- If a user or post is not found, logs an error and continues.
- If no template content is found for a post, logs an error for that post.

---

## Utility Function: getTemplate

Finds a template by its title from a list of templates.

### Parameters

| Name      | Type     | Description                        |
|-----------|----------|------------------------------------|
| templates | Array    | List of template objects           |
| title     | string   | Title of the template to find      |

### Returns

- `Object | undefined`: The matching template object, or `undefined` if not found.

### Example

```javascript
const template = getTemplate(update.templates, post.selectedTemplateName);
```

---

## Example Output

```
Update: 123 name: Bulk Update Example
{ ...config }
[ ...templates ]
42: "Status updated to Approved"
Bulk status update has been applied.
```

---

## Exported Constants

None.

---

## Notes

- This script is intended for administrative/batch operations and should be run with care.
- It directly modifies post statuses and creates news stories in the database.
- Ensure that the user ID provided has the necessary permissions for posting news stories.

---

## Related Files

- [models/index.cjs](../../models/index.cjs): Database models used by this script.
- [BulkStatusUpdate Model](../../models/BulkStatusUpdate.md)
- [Post Model](../../models/Post.md)
- [User Model](../../models/User.md)
- [Point Model](../../models/Point.md)

---

## See Also

- [async.eachSeries documentation](https://caolan.github.io/async/v3/docs.html#eachSeries)
- [async.series documentation](https://caolan.github.io/async/v3/docs.html#series)
- [Lodash forEach documentation](https://lodash.com/docs/4.17.15#forEach)
