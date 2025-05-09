# Utility Module: translationUtils

This module provides utility functions for managing translation items and caches for communities, groups, and posts. It interacts with Sequelize models (notably `AcTranslationCache`, `Post`, `Group`, and `Community`) to fetch, update, and cache translations for various text types in a multilingual application.

---

## Exported Functions

| Name                              | Parameters                                                                                                    | Return Type | Description                                                                                      |
|------------------------------------|---------------------------------------------------------------------------------------------------------------|-------------|--------------------------------------------------------------------------------------------------|
| getTranslatedTextsForCommunity     | targetLocale: string, communityId: number, done: Function                                                     | void        | Retrieves all translation items for a given community, including its groups and posts.           |
| getTranslatedTextsForGroup         | targetLocale: string, groupId: number, done: Function                                                         | void        | Retrieves all translation items for a given group and its posts, including survey/registration Qs.|
| updateTranslationForCommunity      | communityId: number, item: TranslationItem, done: Function                                                    | void        | Updates a translation for a community, with access checks for group/post/community text types.   |
| updateTranslationForGroup          | groupId: number, item: TranslationItem, done: Function                                                        | void        | Updates a translation for a group, with access checks for group/post text types.                 |
| updateAnswerTranslation            | postId: number, textType: string, targetLocale: string, translations: any, contentHash: string, done: Function| void        | Updates a translation for a post answer, using a content hash for uniqueness.                    |
| fixTargetLocale                    | itemTargetLocale: string                                                                                      | string      | Normalizes and fixes locale codes for translation keys.                                           |
| updateTranslation                  | item: TranslationItem, done: Function                                                                         | void        | Updates or creates a translation cache entry for a given item.                                   |
| updateSurveyTranslation            | groupId: number, textType: string, targetLocale: string, translations: any, questions: string[], done: Function| void        | Updates a translation for a survey, combining all question texts.                                |

---

## Types

### TranslationItem

```typescript
interface TranslationItem {
  textType: string;
  contentId: number;
  targetLocale: string;
  content?: string;
  translatedText: string;
}
```

---

## Functions

### fixTargetLocale

Normalizes and fixes locale codes for translation keys.

#### Parameters

| Name             | Type   | Description                                 |
|------------------|--------|---------------------------------------------|
| itemTargetLocale | string | The locale string to normalize (e.g., "en_US", "zh-CN"). |

#### Returns

- `string` — The normalized locale string (e.g., "en", "zh-CN", "sr-Latn").

#### Example

```javascript
fixTargetLocale("en_US"); // "en"
fixTargetLocale("zh-CN"); // "zh-CN"
fixTargetLocale("sr-latin"); // "sr-Latn"
```

---

### addItem (internal)

Adds a translation item to the items array, fetching from cache if available.

#### Parameters

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| targetLocale| string   | Target locale                                    |
| items       | any[]    | Array to push the item into                      |
| textType    | string   | Type of text (e.g., "postName", "groupContent")  |
| id          | number   | Content ID                                       |
| content     | string   | Original text content                            |
| done        | Function | Callback                                         |

---

### addTranslationsForPosts (internal)

Collects translation items for all posts.

#### Parameters

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| targetLocale| string   | Target locale                                    |
| items       | any[]    | Array to push items into                         |
| posts       | any[]    | Array of post objects                            |
| done        | Function | Callback                                         |

---

### addTranslationsForGroups (internal)

Collects translation items for all groups.

#### Parameters

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| targetLocale| string   | Target locale                                    |
| items       | any[]    | Array to push items into                         |
| groups      | any[]    | Array of group objects                           |
| done        | Function | Callback                                         |

---

### addTranslationsForCommunity (internal)

Collects translation items for a community.

#### Parameters

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| targetLocale| string   | Target locale                                    |
| items       | any[]    | Array to push items into                         |
| community   | any      | Community object                                 |
| done        | Function | Callback                                         |

---

### getTranslatedTextsForCommunity

Retrieves all translation items for a given community, including its groups and posts.

#### Parameters

| Name         | Type     | Description                                      |
|--------------|----------|--------------------------------------------------|
| targetLocale | string   | Target locale                                    |
| communityId  | number   | Community ID                                     |
| done         | Function | Callback: (result: { items: any[] } \| null, error?: any) => void |

#### Response

- On success: `{ items: TranslationItem[] }`
- On error: `done(null, error)`

---

### getTranslatedTextsForGroup

Retrieves all translation items for a given group and its posts, including survey and registration question translations.

#### Parameters

| Name         | Type     | Description                                      |
|--------------|----------|--------------------------------------------------|
| targetLocale | string   | Target locale                                    |
| groupId      | number   | Group ID                                         |
| done         | Function | Callback: (result: { items: any[], surveyQuestionTranslations?: any, registrationQuestionTranslations?: any } \| null, error?: any) => void |

#### Response

- On success: `{ items: TranslationItem[], surveyQuestionTranslations, registrationQuestionTranslations }`
- On error: `done(null, error)`

---

### updateTranslation

Updates or creates a translation cache entry for a given item.

#### Parameters

| Name | Type             | Description                                      |
|------|------------------|--------------------------------------------------|
| item | TranslationItem  | The translation item to update                   |
| done | Function         | Callback                                         |

---

### updateSurveyTranslation

Updates a translation for a survey, combining all question texts.

#### Parameters

| Name         | Type     | Description                                      |
|--------------|----------|--------------------------------------------------|
| groupId      | number   | Group ID                                         |
| textType     | string   | Text type (e.g., "surveyQuestion")               |
| targetLocale | string   | Target locale                                    |
| translations | any      | Translations object                              |
| questions    | string[] | Array of question texts                          |
| done         | Function | Callback                                         |

---

### updateAnswerTranslation

Updates a translation for a post answer, using a content hash for uniqueness.

#### Parameters

| Name         | Type     | Description                                      |
|--------------|----------|--------------------------------------------------|
| postId       | number   | Post ID                                          |
| textType     | string   | Text type (e.g., "PostAnswer")                   |
| targetLocale | string   | Target locale                                    |
| translations | any      | Translations object                              |
| contentHash  | string   | Hash of the content for uniqueness               |
| done         | Function | Callback                                         |

---

### updateTranslationForGroup

Updates a translation for a group, with access checks for group/post text types.

#### Parameters

| Name   | Type             | Description                                      |
|--------|------------------|--------------------------------------------------|
| groupId| number           | Group ID                                         |
| item   | TranslationItem  | The translation item to update                   |
| done   | Function         | Callback                                         |

---

### updateTranslationForCommunity

Updates a translation for a community, with access checks for group/post/community text types.

#### Parameters

| Name        | Type             | Description                                      |
|-------------|------------------|--------------------------------------------------|
| communityId | number           | Community ID                                     |
| item        | TranslationItem  | The translation item to update                   |
| done        | Function         | Callback                                         |

---

## Dependencies

- [Sequelize models](../../models/index.cjs): For database access to translation cache, posts, groups, and communities.
- [async](https://caolan.github.io/async/): For control flow of asynchronous operations.
- [lodash](https://lodash.com/): Utility functions (not heavily used in this file).
- [farmhash](https://github.com/rvagg/node-farmhash): For fast, non-cryptographic hashing of content.
- [fs](https://nodejs.org/api/fs.html): Not used in this file.
- [request](https://github.com/request/request): Not used in this file.

---

## Example Usage

```javascript
const translationUtils = require('./path/to/this/module');

// Get all translations for a community
translationUtils.getTranslatedTextsForCommunity('en', 123, (result, error) => {
  if (error) {
    // handle error
  } else {
    console.log(result.items);
  }
});

// Update a translation for a group
translationUtils.updateTranslationForGroup(456, {
  textType: 'groupName',
  contentId: 456,
  targetLocale: 'en',
  content: 'My Group',
  translatedText: 'Mon Groupe'
}, (error) => {
  if (error) {
    // handle error
  }
});
```

---

## Related Models

- [AcTranslationCache](../../models/index.cjs) (see your models directory)
- [Post](../../models/index.cjs)
- [Group](../../models/index.cjs)
- [Community](../../models/index.cjs)

---

## Notes

- The module is designed for use in a Node.js/Express.js backend with Sequelize ORM.
- All database operations are asynchronous and use callbacks.
- The translation cache uses a hash of the content and locale to uniquely identify translation entries.
- Some functions (e.g., `addItem`, `addTranslationsForPosts`, etc.) are internal and not exported, but are documented here for completeness.

---

## Exported Constants

_None._

---

## TODO

- Add translations for domain with `domainWelcomeHtml` (see code comment).

---

**End of documentation for `translationUtils` module.**