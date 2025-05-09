# Model: AcTranslationCache

The `AcTranslationCache` model provides a translation caching mechanism for various types of content in the application. It supports translation using Google Cloud Translate and, as a fallback, LLM-based translation (e.g., OpenAI). The model is responsible for storing translations, retrieving them from cache, and orchestrating translation requests for different content types, including posts, groups, and survey questions.

## Properties

| Name        | Type   | Description                                 |
|-------------|--------|---------------------------------------------|
| index_key   | string | Unique key for the translation cache entry. |
| content     | string | The translated content (JSON or text).      |
| created_at  | Date   | Timestamp when the entry was created.       |
| updated_at  | Date   | Timestamp when the entry was last updated.  |

## Indexes

- `main_index` on `index_key`

## Table Name

- `translation_cache`

## Timestamps

- `created_at`, `updated_at`

---

## Exported Constants

| Name                        | Type     | Description                                                                                 |
|-----------------------------|----------|---------------------------------------------------------------------------------------------|
| translationModelName        | string   | Name of the translation model used (default: `"gpt-4o"`).                                   |
| translationMaxTokens        | number   | Maximum number of tokens for translation (default: `2048`).                                 |
| translationTemperature      | number   | Temperature parameter for translation (default: `0.7`).                                     |
| allowedTextTypesForSettingLanguage | string[] | List of text types for which the detected language should be set on the model instance.     |

---

## Methods

### AcTranslationCache.getContentToTranslate

Retrieves the content string to be translated based on the request and the model instance.

#### Parameters

| Name          | Type     | Description                                      |
|---------------|----------|--------------------------------------------------|
| req           | Request  | Express request object (expects `query.textType`).|
| modelInstance | any      | The Sequelize model instance containing content. |

#### Returns

- `Promise<string | null>`: The content to translate, or `null` if not found.

---

### AcTranslationCache.getSurveyAnswerTranslations

Translates structured survey answers for a post.

#### Parameters

| Name           | Type     | Description                                  |
|----------------|----------|----------------------------------------------|
| postId         | number   | ID of the post.                              |
| targetLanguage | string   | Target language code.                        |
| done           | function | Callback function `(err, translations)`.     |

#### Returns

- `Promise<void>`

---

### AcTranslationCache.addSubOptionsElements

Adds sub-option texts (e.g., radio, checkbox, dropdown options) to the translation string arrays.

#### Parameters

| Name         | Type     | Description                                  |
|--------------|----------|----------------------------------------------|
| textStrings  | string[] | Array to collect text strings.               |
| combinedText | string   | Combined text for hashing.                   |
| subOptions   | any[]    | Array of sub-option objects with `.text`.    |

#### Returns

- `string`: Updated combined text.

---

### AcTranslationCache.addSubOptionsToTranslationStrings

Adds sub-option texts from a question object to the translation string arrays.

#### Parameters

| Name         | Type     | Description                                  |
|--------------|----------|----------------------------------------------|
| textStrings  | string[] | Array to collect text strings.               |
| combinedText | string   | Combined text for hashing.                   |
| question     | any      | Question object with possible sub-options.   |

#### Returns

- `string`: Updated combined text.

---

### AcTranslationCache.getRegistrationQuestionTranslations

Translates registration questions for a group.

#### Parameters

| Name           | Type     | Description                                  |
|----------------|----------|----------------------------------------------|
| groupId        | number   | ID of the group.                             |
| targetLanguage | string   | Target language code.                        |
| done           | function | Callback function `(err, translations)`.     |

#### Returns

- `Promise<void>`

---

### AcTranslationCache.getSurveyQuestionTranslations

Translates structured survey questions for a group.

#### Parameters

| Name           | Type     | Description                                  |
|----------------|----------|----------------------------------------------|
| groupId        | number   | ID of the group.                             |
| targetLanguage | string   | Target language code.                        |
| done           | function | Callback function `(err, translations)`.     |

#### Returns

- `Promise<void>`

---

### AcTranslationCache.getSurveyTranslations

Retrieves or creates translations for a set of survey strings, using cache if available.

#### Parameters

| Name                | Type     | Description                                  |
|---------------------|----------|----------------------------------------------|
| indexKey            | string   | Unique cache key for the translation set.    |
| textStrings         | string[] | Array of strings to translate.               |
| targetLanguage      | string   | Target language code.                        |
| saveLanguageToModel | any      | Model instance to update detected language.  |
| done                | function | Callback function `(err, translations)`.     |

#### Returns

- `void`

---

### AcTranslationCache.getSurveyTranslationsFromGoogle

Translates an array of strings using Google Cloud Translate.

#### Parameters

| Name            | Type     | Description                                  |
|-----------------|----------|----------------------------------------------|
| textsToTranslate| string[] | Array of strings to translate.               |
| targetLanguage  | string   | Target language code.                        |

#### Returns

- `Promise<[string[], any]>`: Array of translated strings and language info.

---

### AcTranslationCache.getTranslationFromGoogle

Translates a single string using Google Cloud Translate and caches the result.

#### Parameters

| Name              | Type     | Description                                  |
|-------------------|----------|----------------------------------------------|
| textType          | string   | Type of text being translated.               |
| indexKey          | string   | Unique cache key for the translation.        |
| contentToTranslate| string   | The content to translate.                    |
| targetLanguage    | string   | Target language code.                        |
| modelInstance     | any      | Model instance to update detected language.  |
| callback          | function | Callback function `(err, { content })`.      |

#### Returns

- `void`

---

### AcTranslationCache.getSurveyTranslationsFromLlmFallback

Translates an array of strings using an LLM-based translation fallback.

#### Parameters

| Name            | Type     | Description                                  |
|-----------------|----------|----------------------------------------------|
| textsToTranslate| string[] | Array of strings to translate.               |
| targetLanguage  | string   | Target language code.                        |

#### Returns

- `Promise<[string[], any]>`: Array of translated strings and language info.

---

### AcTranslationCache.llmGoogleTranslateFallback

Translates a single string using an LLM-based translation fallback and caches the result.

#### Parameters

| Name              | Type     | Description                                  |
|-------------------|----------|----------------------------------------------|
| textType          | string   | Type of text being translated.               |
| indexKey          | string   | Unique cache key for the translation.        |
| contentToTranslate| string   | The content to translate.                    |
| targetLanguage    | string   | Target language code.                        |
| modelInstance     | any      | Model instance to update detected language.  |
| callback          | function | Callback function `(err, { content })`.      |

#### Returns

- `Promise<void>`

---

### AcTranslationCache.getAoiTranslationFromLlm

Translates AOI (All Our Ideas) specific content using LLM-based translation.

#### Parameters

| Name              | Type     | Description                                  |
|-------------------|----------|----------------------------------------------|
| textType          | string   | Type of text being translated.               |
| indexKey          | string   | Unique cache key for the translation.        |
| contentToTranslate| string   | The content to translate.                    |
| targetLanguage    | string   | Target language code.                        |
| modelInstance     | any      | Model instance (not always used).            |
| callback          | function | Callback function `(err, { content })`.      |

#### Returns

- `Promise<void>`

---

### AcTranslationCache.fixUpLanguage

Normalizes and fixes up the target language code for translation APIs.

#### Parameters

| Name           | Type   | Description                                  |
|----------------|--------|----------------------------------------------|
| targetLanguage | string | Target language code.                        |

#### Returns

- `string`: Normalized language code.

---

### AcTranslationCache.getTranslation

Main entry point for translating a piece of content. Handles caching, translation, and updating model language fields.

#### Parameters

| Name          | Type     | Description                                  |
|---------------|----------|----------------------------------------------|
| req           | Request  | Express request object (expects `query.textType`, `query.targetLanguage`). |
| modelInstance | any      | The Sequelize model instance containing content. |
| callback      | function | Callback function `(err, { content })`.      |

#### Returns

- `Promise<void>`

---

## Configuration

- **PAIRWISE_API_HOST**: Host for Pairwise API (used for fetching AOI content).
- **PAIRWISE_USERNAME**: Username for Pairwise API.
- **PAIRWISE_PASSWORD**: Password for Pairwise API.
- **OPENAI_API_KEY**: If set, enables LLM-based translation fallback.
- **GOOGLE_APPLICATION_CREDENTIALS_JSON**: Google Cloud credentials (JSON string).
- **GOOGLE_TRANSLATE_PROJECT_ID**: Google Cloud project ID for Translate API.

---

## Dependencies

- [@google-cloud/translate](https://www.npmjs.com/package/@google-cloud/translate)
- [farmhash](https://www.npmjs.com/package/farmhash)
- [logger.cjs](../utils/logger.cjs)
- [YpLanguages](../../utils/ypLanguages.js)
- [YpLlmTranslation](../llms/llmTranslation.js)

---

## Example Usage

```javascript
const AcTranslationCache = require('./models/acTranslationCache.cjs')(sequelize, DataTypes);

// Translate a post's content
AcTranslationCache.getTranslation(req, postInstance, (err, result) => {
  if (err) {
    // handle error
  } else {
    console.log(result.content); // translated content
  }
});
```

---

## Related Files

- [YpLanguages](../../utils/ypLanguages.js)
- [YpLlmTranslation](../llms/llmTranslation.js)
- [logger.cjs](../utils/logger.cjs)

---

## Notes

- This model is designed to be used with Sequelize.
- Translation caching is based on a hash of the content and the target language.
- Supports both Google Translate and LLM-based translation fallback.
- Handles a wide variety of content types, including posts, groups, AOI questions, and survey structures.
- Updates the detected language on the model instance for certain text types.

---

For more details on the structure of AOI and survey content, see the application's data model documentation.