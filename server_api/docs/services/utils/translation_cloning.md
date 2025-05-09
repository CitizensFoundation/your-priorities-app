# Service Module: translation_cloner.cjs

This module provides utility functions for cloning translation entries in the `AcTranslationCache` model for various entities such as posts, communities, groups, and points. It is used to duplicate translation records when duplicating or copying these entities, ensuring that all relevant translations are also copied to the new entity.

## Dependencies

- [models](../../models/index.cjs): Provides access to Sequelize models, especially `AcTranslationCache`.
- [async](https://caolan.github.io/async/): Used for asynchronous control flow (parallel and forEach).
- [lodash](https://lodash.com/): Utility library (imported but not directly used in this file).
- [fs](https://nodejs.org/api/fs.html): Node.js file system module (imported but not directly used in this file).
- [request](https://github.com/request/request): HTTP request library (imported but not directly used in this file).
- [farmhash](https://github.com/rvagg/node-farmhash): Used for generating hash values for content.
- [fixTargetLocale](./translation_helpers.cjs): Imported but not used in this file.

---

## Exported Functions

| Name                        | Parameters                                                                 | Return Type | Description                                                                                 |
|-----------------------------|----------------------------------------------------------------------------|-------------|---------------------------------------------------------------------------------------------|
| cloneTranslationForPoint    | inPoint: object, outPoint: object, done: function                          | void        | Clones all translation entries for a point from `inPoint` to `outPoint`.                    |
| cloneTranslationForPost     | inPost: object, outPost: object, done: function                            | void        | Clones all translation entries for a post from `inPost` to `outPost`.                       |
| cloneTranslationForCommunity| inCommunity: object, outCommunity: object, done: function                  | void        | Clones all translation entries for a community from `inCommunity` to `outCommunity`.        |
| cloneTranslationForGroup    | inGroup: object, outGroup: object, done: function                          | void        | Clones all translation entries for a group from `inGroup` to `outGroup`.                    |
| cloneTranslationForConfig   | textType: string, inObjectId: number, outObjectId: number, callback: function | void        | Clones all config translation entries for a given type and object ID.                       |

---

## Internal Functions

### getTranslationsForSearch

Fetches all translation cache entries for a specific text type, object ID, and content hash.

#### Parameters

| Name     | Type     | Description                                                      |
|----------|----------|------------------------------------------------------------------|
| textType | string   | The type of text (e.g., "postName", "communityContent").         |
| id       | number   | The ID of the source object.                                     |
| content  | string   | The content to hash for the search key.                          |
| callback | function | Callback function `(error, translations)`                        |

---

### getTranslationsConfigSearch

Fetches all translation cache entries for a specific text type and object ID, regardless of content.

#### Parameters

| Name     | Type     | Description                                                      |
|----------|----------|------------------------------------------------------------------|
| textType | string   | The type of text (e.g., "GroupQuestions").                       |
| id       | number   | The ID of the source object.                                     |
| callback | function | Callback function `(error, translations)`                        |

---

### updateIndexKey

Updates the object ID in a translation cache index key.

#### Parameters

| Name               | Type   | Description                                 |
|--------------------|--------|---------------------------------------------|
| current_index_key  | string | The current index key (e.g., "postName-1-..."). |
| objectId           | number | The new object ID to insert into the key.   |

#### Returns

- `string`: The updated index key.

---

### cloneTranslations

Clones an array of translation cache entries to a new object ID. If a translation with the new index key already exists, it updates its content; otherwise, it creates a new entry.

#### Parameters

| Name         | Type     | Description                                                      |
|--------------|----------|------------------------------------------------------------------|
| translations | array    | Array of translation cache entries (Sequelize instances).        |
| objectId     | number   | The new object ID to use in the index key.                       |
| callback     | function | Callback function `(error)` called when all cloning is complete. |

---

### cloneTranslationForItem

Clones translation entries for a specific text type and content from one object ID to another.

#### Parameters

| Name        | Type     | Description                                                      |
|-------------|----------|------------------------------------------------------------------|
| textType    | string   | The type of text (e.g., "postName").                             |
| inObjectId  | number   | The source object ID.                                            |
| outObjectId | number   | The destination object ID.                                       |
| content     | string   | The content to hash for the search key.                          |
| callback    | function | Callback function `(error)`                                      |

---

### cloneTranslationForConfig

Clones config translation entries for a specific text type from one object ID to another.

#### Parameters

| Name        | Type     | Description                                                      |
|-------------|----------|------------------------------------------------------------------|
| textType    | string   | The type of config text (e.g., "GroupQuestions").                |
| inObjectId  | number   | The source object ID.                                            |
| outObjectId | number   | The destination object ID.                                       |
| callback    | function | Callback function `(error)`                                      |

---

## Detailed Exported Function Documentation

---

### Service: cloneTranslationForPoint

Clones all translation entries for a point from `inPoint` to `outPoint`. It copies the translation for the latest point revision's content.

#### Parameters

| Name     | Type   | Description                                      |
|----------|--------|--------------------------------------------------|
| inPoint  | object | Source point object (must have `id` and `PointRevisions`). |
| outPoint | object | Destination point object (must have `id`).       |
| done     | function | Callback function `(error)` when done.         |

---

### Service: cloneTranslationForPost

Clones all translation entries for a post from `inPost` to `outPost`. It copies both the post name and description translations.

#### Parameters

| Name     | Type   | Description                                      |
|----------|--------|--------------------------------------------------|
| inPost   | object | Source post object (must have `id`, `name`, `description`). |
| outPost  | object | Destination post object (must have `id`).        |
| done     | function | Callback function `(error)` when done.         |

---

### Service: cloneTranslationForCommunity

Clones all translation entries for a community from `inCommunity` to `outCommunity`. It copies both the community name and description translations.

#### Parameters

| Name         | Type   | Description                                      |
|--------------|--------|--------------------------------------------------|
| inCommunity  | object | Source community object (must have `id`, `name`, `description`). |
| outCommunity | object | Destination community object (must have `id`).   |
| done         | function | Callback function `(error)` when done.         |

---

### Service: cloneTranslationForGroup

Clones all translation entries for a group from `inGroup` to `outGroup`. It copies the group name, objectives, and config translations for group questions and registration questions.

#### Parameters

| Name     | Type   | Description                                      |
|----------|--------|--------------------------------------------------|
| inGroup  | object | Source group object (must have `id`, `name`, `objectives`). |
| outGroup | object | Destination group object (must have `id`).       |
| done     | function | Callback function `(error)` when done.         |

---

### Service: cloneTranslationForConfig

Clones all config translation entries for a given type and object ID.

#### Parameters

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| textType    | string | The type of config text (e.g., "GroupQuestions").|
| inObjectId  | number | Source object ID.                                |
| outObjectId | number | Destination object ID.                           |
| callback    | function | Callback function `(error)` when done.         |

---

## Example Usage

```javascript
const {
  cloneTranslationForPost,
  cloneTranslationForCommunity,
  cloneTranslationForGroup,
  cloneTranslationForPoint,
  cloneTranslationForConfig
} = require('./translation_cloner.cjs');

// Example: Clone translations for a post
cloneTranslationForPost(inPost, outPost, (error) => {
  if (error) {
    console.error('Error cloning post translations:', error);
  } else {
    console.log('Post translations cloned successfully.');
  }
});
```

---

## Related Models

- **[AcTranslationCache](../../models/index.cjs)**: Sequelize model representing the translation cache table. Used for storing and retrieving translation entries.

---

## Notes

- The module uses callbacks for asynchronous operations (not Promises or async/await).
- The translation cache index key format is important for correct operation: `${textType}-${id}-%-${hash}`.
- If a translation entry with the new index key already exists, its content is updated; otherwise, a new entry is created.
- The module is intended for internal use in the backend when duplicating entities that have translatable content.

---

## See Also

- [translation_helpers.cjs](./translation_helpers.md) (for related translation utilities)
- [AcTranslationCache Model](../../models/index.md) (for schema details)
