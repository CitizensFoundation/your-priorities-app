# Service Module: YpCjsCodeReview

A utility class for recursively reviewing all `.cjs` (CommonJS) JavaScript files in a directory tree for potential crash-causing issues using the OpenAI GPT-4o model. The class reads files, sends their contents to the OpenAI API with a system prompt focused on crash detection, and prints the review results.

---

## Class: YpCjsCodeReview

### Properties

| Name         | Type     | Description                                                                                 |
|--------------|----------|---------------------------------------------------------------------------------------------|
| openaiClient | OpenAI   | Instance of the OpenAI client, initialized with the API key from `process.env.OPENAI_API_KEY`.|
| modelName    | string   | The OpenAI model to use for code review. Default: `"gpt-4o"`.                              |
| maxTokens    | number   | Maximum number of tokens for the LLM response. Default: `4000`.                            |
| temperature  | number   | Sampling temperature for the LLM. Default: `0.0` (deterministic output).                   |

---

### Constructor

#### `constructor()`

Initializes the `openaiClient` with the API key from the environment variable `OPENAI_API_KEY`.

---

### Methods

#### `readFilesRecursively(dir: string): Promise<string[]>`

Recursively traverses a directory, collecting all `.cjs` file paths, excluding `node_modules` and `ts-out` directories.

| Parameter | Type   | Description                |
|-----------|--------|----------------------------|
| dir       | string | Root directory to traverse. |

**Returns:** `Promise<string[]>`  
A promise that resolves to an array of `.cjs` file paths.

---

#### `reviewCjsFiles(): Promise<void>`

Finds all `.cjs` files in the current directory and subdirectories, reads their contents, sends them to the LLM for review, and prints the results to the console.

**Returns:** `Promise<void>`

---

#### `renderSystemPrompt(): string`

Generates the system prompt for the LLM, instructing it to only report on crash-related issues.

**Returns:** `string`  
The system prompt string.

---

#### `renderUserMessage(codeToReview: string): string`

Generates the user message for the LLM, embedding the code to be reviewed.

| Parameter     | Type   | Description                        |
|---------------|--------|------------------------------------|
| codeToReview  | string | The code content to be reviewed.   |

**Returns:** `string`  
The user message string.

---

#### `callLlm(codeToReview: string): Promise<string | undefined | null>`

Sends the code to the OpenAI LLM for review, handling up to 3 retries on error.

| Parameter     | Type   | Description                        |
|---------------|--------|------------------------------------|
| codeToReview  | string | The code content to be reviewed.   |

**Returns:** `Promise<string \| undefined \| null>`  
The LLM's review result, or `undefined` if all retries fail.

---

## Script Execution

At the end of the file, the following script is executed:

```typescript
(async () => {
  const translator = new YpCjsCodeReview();
  await translator.reviewCjsFiles();
})();
```

This immediately instantiates the `YpCjsCodeReview` class and runs the review process on all `.cjs` files in the current directory tree.

---

## Dependencies

- [openai](https://www.npmjs.com/package/openai): For interacting with the OpenAI API.
- [fs](https://nodejs.org/api/fs.html): For file system operations.
- [path](https://nodejs.org/api/path.html): For file path manipulations.
- [util](https://nodejs.org/api/util.html): For promisifying callback-based APIs.
- [jsonrepair](https://www.npmjs.com/package/jsonrepair): Imported but **not used** in this file.

---

## Environment Variables

| Name              | Description                                 | Required |
|-------------------|---------------------------------------------|----------|
| OPENAI_API_KEY    | API key for authenticating with OpenAI API. | Yes      |

---

## Example Usage

```typescript
import { YpCjsCodeReview } from './YpCjsCodeReview';

(async () => {
  const reviewer = new YpCjsCodeReview();
  await reviewer.reviewCjsFiles();
})();
```

---

## Exported Entities

| Name              | Type     | Description                                  |
|-------------------|----------|----------------------------------------------|
| YpCjsCodeReview   | class    | Main class for reviewing `.cjs` files.       |

---

## Notes

- The script is designed to be run as a standalone Node.js process.
- Only `.cjs` files are reviewed; other file types are ignored.
- The review is focused **exclusively on crash-related issues** as per the system prompt.
- The `jsonrepair` import is unused and can be removed for optimization.

---

## See Also

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference/introduction)
- [Node.js fs module](https://nodejs.org/api/fs.html)
- [Node.js path module](https://nodejs.org/api/path.html)
