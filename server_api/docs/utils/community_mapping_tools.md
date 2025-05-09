# Service Module: Community Map Utilities

This module provides utility functions for generating hierarchical maps of communities and their groups, including support for translation and name truncation. It interacts with the database models for `Community`, `Group`, and `AcTranslationCache`.

---

## Exported Functions

| Name                | Parameters                                      | Return Type         | Description                                                      |
|---------------------|------------------------------------------------|---------------------|------------------------------------------------------------------|
| getMapForCommunity  | communityId: number, options: object           | Promise\<MapNode\>  | Generates a hierarchical map for a given community and its groups.|

---

## Function: getMapForCommunity

Generates a hierarchical map structure for a given community, including its groups. Optionally supports translation of names and truncation.

### Parameters

| Name         | Type    | Description                                                                 |
|--------------|---------|-----------------------------------------------------------------------------|
| communityId  | number  | The ID of the community to generate the map for.                            |
| options      | object  | Options object. If `options.targetLocale` is set, attempts to translate names.|

### Returns

- **Promise\<MapNode\>**  
  Resolves to a map object representing the community and its groups.

### Example Response

```json
{
  "name": "Community Name (C-1)",
  "children": [
    {
      "name": "Group Name (G-2)",
      "link": "/group/2",
      "children": []
    }
  ]
}
```

### Description

- Finds the community by `communityId`.
- Builds a tree structure with the community as the root and its groups as children.
- If a group is configured as a link to another community, recursively includes that community's map.
- Names are truncated to 25 characters and suffixed with the entity type and ID.
- If `options.targetLocale` is set, attempts to fetch translated names (currently always uses `"en"` as the target language).

---

## Internal Utility Functions

### Function: getCommunityMap

Recursively builds the map structure for a community and its groups.

#### Parameters

| Name         | Type    | Description                                                                 |
|--------------|---------|-----------------------------------------------------------------------------|
| communityId  | number  | The ID of the community to process.                                         |
| map          | object  | The map node to which the community and its groups will be added.           |
| options      | object  | Options object. If `options.targetLocale` is set, attempts to translate names.|

#### Returns

- **Promise\<void\>**

#### Description

- Finds the community and its groups.
- For each group, checks if it links to another community and recurses if so.
- Adds group nodes to the community's `children` array.
- Handles missing communities by adding a "Not found" node.

---

### Function: getTranslationForMap

Fetches a translation for a given text type and model instance from the translation cache.

#### Parameters

| Name           | Type    | Description                                         |
|----------------|---------|-----------------------------------------------------|
| textType       | string  | The type of text to translate (e.g., "communityName").|
| model          | object  | The model instance (e.g., Community or Group).      |
| targetLanguage | string  | The target language code (e.g., "en").              |

#### Returns

- **Promise\<string \| undefined\>**

#### Description

- Uses `models.AcTranslationCache.getTranslation` to fetch the translation.
- Resolves with the translated content if found, otherwise resolves with `undefined`.

---

### Function: truncate

Truncates a string to a specified length, optionally at word boundaries, and appends a suffix.

#### Parameters

| Name      | Type     | Description                                                      |
|-----------|----------|------------------------------------------------------------------|
| input     | string   | The string to truncate.                                          |
| length    | number   | Maximum length of the result (default: 255).                     |
| killwords | boolean  | If true, truncates at the exact length; otherwise at word boundary.|
| end       | string   | Suffix to append (default: "...").                               |

#### Returns

- **string**

#### Description

- Truncates the input string to the specified length.
- If `killwords` is false, truncates at the last space before the limit.
- Appends the `end` string (default: "...").

---

## Data Structures

### MapNode

Represents a node in the community map tree.

| Name      | Type     | Description                                 |
|-----------|----------|---------------------------------------------|
| name      | string   | The display name of the node.               |
| link      | string   | (Optional) URL path to the community/group. |
| type      | string   | (Optional) Type of the node ("Community").  |
| children  | array    | Array of child MapNode objects.             |

---

## Dependencies

- **models**: Imported from `../models/index.cjs`. Should provide:
  - `Community`: Sequelize model for communities.
  - `Group`: Sequelize model for groups.
  - `AcTranslationCache`: Provides `getTranslation` for translation lookups.

---

## Example Usage

```javascript
const { getMapForCommunity } = require('./path/to/this/module');

getMapForCommunity(1, { targetLocale: true })
  .then(map => {
    console.log(JSON.stringify(map, null, 2));
  })
  .catch(err => {
    console.error(err);
  });
```

---

## Exported Members

| Name                | Type       | Description                                      |
|---------------------|------------|--------------------------------------------------|
| getMapForCommunity  | function   | See above. Main entry point for generating maps. |

---

## See Also

- [Community Model](../models/Community.md)
- [Group Model](../models/Group.md)
- [AcTranslationCache Model](../models/AcTranslationCache.md)

---