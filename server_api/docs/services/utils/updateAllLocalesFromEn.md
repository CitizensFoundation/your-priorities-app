# Service: YpLocaleTranslation

The `YpLocaleTranslation` class provides automated translation management for website backend locale files. It compares the base English translation with other locale files, identifies missing or outdated translations, and uses the OpenAI API to generate translations for missing strings. The class supports nested translation keys and ensures that brand names are not translated. It is designed to be run as a script to update all locale translation files in the `./locales` directory.

---

## Constructor

### `constructor()`
Initializes the `YpLocaleTranslation` instance, setting up the OpenAI client using the `OPENAI_API_KEY` environment variable.

---

## Properties

| Name                      | Type         | Description                                                                 |
|---------------------------|--------------|-----------------------------------------------------------------------------|
| `openaiClient`            | `OpenAI`     | Instance of the OpenAI API client.                                          |
| `modelName`               | `string`     | The OpenAI model to use (default: `"gpt-4o"`).                              |
| `maxTokens`               | `number`     | Maximum tokens for OpenAI completions (default: `4000`).                    |
| `temperature`             | `number`     | Temperature for OpenAI completions (default: `0.0`).                        |
| `excludeKeysFromTranslation` | `string[]` | List of keys to exclude from translation (e.g., brand names, social media). |

---

## Methods

### `getValueByPath(obj: any, path: string): any`
Retrieves a value from a nested object using a dot-separated path.

#### Parameters

| Name | Type   | Description                        |
|------|--------|------------------------------------|
| obj  | `any`  | The object to search.              |
| path | `any`  | Dot-separated path (e.g., `"a.b.c"`). |

#### Returns

- `any`: The value at the specified path, or an empty string if not found.

---

### `async loadAndCompareTranslations(): Promise<void>`
Loads the base English translation and all other locale translation files, compares them, identifies missing or outdated translations, and updates the locale files with new translations using the OpenAI API.

#### Process

1. Loads the base English translation from `./locales/en/translation.json`.
2. Iterates over all locale directories (excluding `en`).
3. Loads each locale's translation file.
4. Updates the locale translation with missing keys from the base translation.
5. Identifies missing or outdated translations.
6. Chunks missing translations and translates them using OpenAI.
7. Updates the locale translation file with the new translations.

---

### `setValueAtPath(obj: any, path: string, value: any): void`
Sets a value in a nested object using a dot-separated path.

#### Parameters

| Name  | Type   | Description                        |
|-------|--------|------------------------------------|
| obj   | `any`  | The object to modify.              |
| path  | `any`  | Dot-separated path (e.g., `"a.b.c"`). |
| value | `any`  | The value to set.                  |

---

### `private async loadJsonFile<T>(filePath: string): Promise<T>`
Reads and parses a JSON file asynchronously.

#### Parameters

| Name      | Type     | Description                |
|-----------|----------|----------------------------|
| filePath  | `string` | Path to the JSON file.     |

#### Returns

- `Promise<T>`: Parsed JSON object.

---

### `private updateWithMissingKeys(baseTranslation: any, targetTranslation: any, path?: string[]): any`
Recursively updates the target translation object with missing keys from the base translation.

#### Parameters

| Name             | Type      | Description                                 |
|------------------|-----------|---------------------------------------------|
| baseTranslation  | `any`     | The base (English) translation object.      |
| targetTranslation| `any`     | The target locale translation object.       |
| path             | `string[]`| (Optional) Current path for recursion.      |

#### Returns

- `any`: Updated translation object.

---

### `private extractMissingTranslations(baseTranslation: any, targetTranslation: any): string[]`
Finds all translation keys that are missing or need updating in the target translation.

#### Parameters

| Name             | Type   | Description                                 |
|------------------|--------|---------------------------------------------|
| baseTranslation  | `any`  | The base (English) translation object.      |
| targetTranslation| `any`  | The target locale translation object.       |

#### Returns

- `string[]`: Array of dot-separated paths for missing translations.

---

### `private chunkArray<T>(array: T[], size: number): T[][]`
Splits an array into chunks of a specified size.

#### Parameters

| Name  | Type     | Description                |
|-------|----------|----------------------------|
| array | `T[]`    | The array to chunk.        |
| size  | `number` | The chunk size.            |

#### Returns

- `T[][]`: Array of chunked arrays.

---

### `renderSystemPrompt(): string`
Returns the system prompt for the OpenAI translation assistant.

#### Returns

- `string`: The system prompt.

---

### `renderUserMessage(language: string, textsToTranslate: string[]): string`
Returns the user message for the OpenAI translation assistant.

#### Parameters

| Name            | Type         | Description                        |
|-----------------|--------------|------------------------------------|
| language        | `string`     | Target language name.              |
| textsToTranslate| `string[]`   | Array of strings to translate.     |

#### Returns

- `string`: The user message.

---

### `async translateUITexts(languageIsoCode: string, textsToTranslate: string[]): Promise<string[] | undefined>`
Translates an array of UI texts to the specified language using OpenAI.

#### Parameters

| Name            | Type         | Description                        |
|-----------------|--------------|------------------------------------|
| languageIsoCode | `string`     | ISO code of the target language.   |
| textsToTranslate| `string[]`   | Array of strings to translate.     |

#### Returns

- `Promise<string[] | undefined>`: Array of translated strings, or `undefined` on error.

---

### `async callLlm(languageName: string, inObject: string[]): Promise<string[] | undefined>`
Calls the OpenAI API to translate an array of strings, with retry logic and JSON repair.

#### Parameters

| Name         | Type         | Description                        |
|--------------|--------------|------------------------------------|
| languageName | `string`     | Name of the target language.       |
| inObject     | `string[]`   | Array of strings to translate.     |

#### Returns

- `Promise<string[] | undefined>`: Array of translated strings, or `undefined` on error.

---

## Exported Constants

### `excludeKeysFromTranslation: string[]`
A list of keys that should not be translated (e.g., brand names, social media platforms).

```typescript
[
  "facebook",
  "twitter",
  "linkedin",
  "adwords",
  "snapchat",
  "instagram",
  "youtube",
  "tiktok",
  "allOurIdeas"
]
```

---

## Usage Example

```typescript
import { YpLocaleTranslation } from './path/to/YpLocaleTranslation';

(async () => {
  const translator = new YpLocaleTranslation();
  await translator.loadAndCompareTranslations();
})();
```

---

## Dependencies

- [OpenAI](https://www.npmjs.com/package/openai): For language model translation.
- [jsonrepair](https://www.npmjs.com/package/jsonrepair): For repairing malformed JSON from LLM output.
- [YpLanguages](../../utils/ypLanguages.js): Utility for language name resolution.
- Node.js built-in modules: `fs`, `path`, `util`.

---

## Related Files

- [YpLanguages](../../utils/ypLanguages.md): Language utility module.

---

## Notes

- The script expects translation files to be located in `./locales/{locale}/translation.json`.
- The OpenAI API key must be set in the environment variable `OPENAI_API_KEY`.
- Brand names and certain keys are excluded from translation to preserve their integrity.
- The translation process is chunked to avoid exceeding token limits.
- The script is intended to be run as a standalone process for updating translation files.