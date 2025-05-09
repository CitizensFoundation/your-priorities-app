# Service: YpLlmTranslation

The `YpLlmTranslation` class provides advanced translation services using OpenAI's LLM (Large Language Model) for Your Priorities applications. It supports translation of plain text, lists of strings, and HTML content, with special handling for UI constraints and moderation. It also includes utility methods for extracting and replacing translatable strings in HTML, and for rendering system/user messages for LLM prompts.

---

## Constructor

### `constructor()`
Initializes the `YpLlmTranslation` service, setting up the OpenAI client with the API key from environment variables.

---

## Properties

| Name         | Type     | Description                                                      |
|--------------|----------|------------------------------------------------------------------|
| openaiClient | OpenAI   | Instance of the OpenAI client for LLM API calls.                 |
| modelName    | string   | The OpenAI model used for translation (default: `"gpt-4o"`).     |
| maxTokens    | number   | Maximum tokens for LLM responses (default: `4000`).              |
| temperature  | number   | Sampling temperature for LLM (default: `0.0`).                   |

---

## Methods

### HTML Extraction and Replacement

#### `extractHtmlStrings(html: string): string[]`
Extracts all user-facing strings from the provided HTML, including text nodes and relevant attributes (e.g., `placeholder`, `value`, `label`).

- **Parameters:**
  - `html` (`string`): The HTML content to extract strings from.
- **Returns:** `string[]` — Array of unique, non-empty strings found in the HTML.

#### `replaceHtmlStrings(html: string, originalStrings: string[], translatedStrings: string[]): string`
Replaces the original user-facing strings in the HTML with their corresponding translations.

- **Parameters:**
  - `html` (`string`): The original HTML content.
  - `originalStrings` (`string[]`): Array of strings to be replaced.
  - `translatedStrings` (`string[]`): Array of translated strings, in the same order as `originalStrings`.
- **Returns:** `string` — The HTML with translated strings.

---

### LLM System/User Message Renderers

#### `renderSchemaSystemMessage(jsonInSchema: string, jsonOutSchema: string, lengthInfo: string): string`
Renders a system prompt for schema-based translation tasks.

#### `renderSchemaTryAgainSystemMessage(jsonInSchema: string, jsonOutSchema: string, lengthInfo: string, currentToLong: string): string`
Renders a system prompt for retrying translation when the previous result was too long.

#### `renderOneTranslationSystemMessage(): string`
Renders a system prompt for single-string translation.

#### `renderListTranslationSystemMessage(): string`
Renders a system prompt for translating a list of strings.

#### `renderOneTranslationUserMessage(language: string, stringToTranslate: string): string`
Renders a user prompt for single-string translation.

#### `renderListTranslationUserMessage(language: string, textsToTranslate: string[]): string`
Renders a user prompt for list translation.

#### `renderAnswersUserMessage(language: string, question: string, answer: AoiTranslationAnswerInData): string`
Renders a user prompt for translating answers.

#### `renderQuestionUserMessage(language: string, question: string, questionData: AoiTranslationQuestionInData): string`
Renders a user prompt for translating a question.

---

### Moderation

#### `getModerationFlag(content: string): Promise<boolean>`
Checks if the provided content is flagged by OpenAI's moderation endpoint.

- **Parameters:**
  - `content` (`string`): The content to check.
- **Returns:** `Promise<boolean>` — `true` if flagged, `false` otherwise.

---

### Translation Methods

#### `getHtmlTranslation(languageIsoCode: string, htmlToTranslate: string): Promise<string | null | undefined>`
Translates all user-facing strings in the provided HTML to the target language.

- **Parameters:**
  - `languageIsoCode` (`string`): ISO code of the target language.
  - `htmlToTranslate` (`string`): HTML content to translate.
- **Returns:** `Promise<string | null | undefined>` — Translated HTML, or `null`/`undefined` on error.

#### `getOneTranslation(languageIsoCode: string, stringToTranslate: string): Promise<string | null | undefined>`
Translates a single string to the target language.

- **Parameters:**
  - `languageIsoCode` (`string`): ISO code of the target language.
  - `stringToTranslate` (`string`): The string to translate.
- **Returns:** `Promise<string | null | undefined>` — Translated string, or `null`/`undefined` on error.

#### `getListTranslation(languageIsoCode: string, stringsToTranslate: string[]): Promise<string[] | null | undefined>`
Translates a list of strings to the target language.

- **Parameters:**
  - `languageIsoCode` (`string`): ISO code of the target language.
  - `stringsToTranslate` (`string[]`): Array of strings to translate.
- **Returns:** `Promise<string[] | null | undefined>` — Array of translated strings, or `null`/`undefined` on error.

#### `getChoiceTranslation(languageIsoCode: string, answerContent: string, maxCharactersInTranslation = 140): Promise<string | null | undefined>`
Translates a choice/answer string, enforcing a maximum character limit.

- **Parameters:**
  - `languageIsoCode` (`string`): ISO code of the target language.
  - `answerContent` (`string`): The answer string to translate.
  - `maxCharactersInTranslation` (`number`, optional): Max allowed length (default: 140).
- **Returns:** `Promise<string | null | undefined>` — Translated string, or `null`/`undefined` on error.

#### `getQuestionTranslation(languageIsoCode: string, question: string, maxCharactersInTranslation = 300): Promise<string | null | undefined>`
Translates a question string, enforcing a maximum character limit.

- **Parameters:**
  - `languageIsoCode` (`string`): ISO code of the target language.
  - `question` (`string`): The question string to translate.
  - `maxCharactersInTranslation` (`number`, optional): Max allowed length (default: 300).
- **Returns:** `Promise<string | null | undefined>` — Translated string, or `null`/`undefined` on error.

---

### LLM Call Utilities

#### `callSimpleLlm(languageName: string, toTranslate: string[] | string, parseJson: boolean, systemRenderer: Function, userRenderer: Function): Promise<string | object | null | undefined>`
Calls the LLM for simple translation tasks, optionally parsing the result as JSON.

- **Parameters:**
  - `languageName` (`string`): Name of the target language.
  - `toTranslate` (`string[] | string`): String(s) to translate.
  - `parseJson` (`boolean`): Whether to parse the result as JSON.
  - `systemRenderer` (`Function`): Function to render the system prompt.
  - `userRenderer` (`Function`): Function to render the user prompt.
- **Returns:** `Promise<string | object | null | undefined>` — LLM output.

#### `callSchemaLlm(jsonInSchema: string, jsonOutSchema: string, lengthInfo: string, languageName: string, question: string, toTranslate: AoiTranslationAnswerInData | AoiTranslationQuestionInData | string[] | string, maxCharactersInTranslation: number | undefined, systemRenderer: Function, userRenderer: Function): Promise<string | null | undefined>`
Calls the LLM for schema-based translation tasks, enforcing output length constraints.

- **Parameters:**
  - `jsonInSchema` (`string`): Input JSON schema description.
  - `jsonOutSchema` (`string`): Output JSON schema description.
  - `lengthInfo` (`string`): Length constraint description.
  - `languageName` (`string`): Name of the target language.
  - `question` (`string`): The question string (if applicable).
  - `toTranslate` (`AoiTranslationAnswerInData | AoiTranslationQuestionInData | string[] | string`): Data to translate.
  - `maxCharactersInTranslation` (`number | undefined`): Max allowed length.
  - `systemRenderer` (`Function`): Function to render the system prompt.
  - `userRenderer` (`Function`): Function to render the user prompt.
- **Returns:** `Promise<string | null | undefined>` — Translated string, or `null`/`undefined` on error.

---

## Types Used

### `AoiTranslationAnswerInData`
```typescript
interface AoiTranslationAnswerInData {
  answerToTranslate: string;
}
```
Input schema for answer translation.

### `AoiTranslationQuestionInData`
```typescript
interface AoiTranslationQuestionInData {
  questionToTranslate: string;
}
```
Input schema for question translation.

### `AoiTranslationAnswerOutData`
```typescript
interface AoiTranslationAnswerOutData {
  translatedContent: string;
}
```
Output schema for translation responses.

---

## Dependencies

- [OpenAI](https://www.npmjs.com/package/openai): For LLM-based translation and moderation.
- [cheerio](https://www.npmjs.com/package/cheerio): For HTML parsing and manipulation.
- [jsonrepair](https://www.npmjs.com/package/jsonrepair): For fixing malformed JSON from LLM output.
- [YpLanguages](../../utils/ypLanguages.md): Utility for language name lookups.

---

## Example Usage

```typescript
const translator = new YpLlmTranslation();
const translatedHtml = await translator.getHtmlTranslation('es', '<div>Hello <input placeholder="Name"></div>');
console.log(translatedHtml);
```

---

## See Also

- [YpLanguages](../../utils/ypLanguages.md)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference/introduction)
- [cheerio Documentation](https://cheerio.js.org/)

---

**Note:** This service is designed for use in Your Priorities and similar applications where high-quality, context-aware translation is required, especially for user interfaces and user-generated content.