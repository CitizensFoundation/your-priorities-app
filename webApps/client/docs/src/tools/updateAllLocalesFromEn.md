# YpLocaleTranslation

The `YpLocaleTranslation` class is responsible for managing and translating locale-specific JSON files using the OpenAI API. It compares translations against a base English translation and updates missing translations for other locales.

## Properties

| Name            | Type   | Description                                                                 |
|-----------------|--------|-----------------------------------------------------------------------------|
| openaiClient    | OpenAI | An instance of the OpenAI client used to interact with the OpenAI API.      |
| modelName       | string | The name of the model used for translation, default is "gpt-4o".            |
| maxTokens       | number | The maximum number of tokens for the OpenAI API response, default is 8000.  |
| temperature     | number | The temperature setting for the OpenAI API, default is 0.0.                 |
| excludeKeysFromTranslation | string[] | List of keys to exclude from translation.                      |

## Methods

| Name                        | Parameters                                                                 | Return Type          | Description                                                                                     |
|-----------------------------|----------------------------------------------------------------------------|----------------------|-------------------------------------------------------------------------------------------------|
| constructor                 | -                                                                          | -                    | Initializes a new instance of the `YpLocaleTranslation` class.                                  |
| getValueByPath              | obj: any, path: any                                                        | any                  | Retrieves a value from an object using a dot-separated path.                                    |
| loadAndCompareTranslations  | -                                                                          | Promise<void>        | Loads and compares translations, updating missing translations for each locale.                 |
| setValueAtPath              | obj: any, path: any, value: any                                            | void                 | Sets a value in an object at a specified dot-separated path.                                    |
| loadJsonFile                | filePath: string                                                           | Promise<T>           | Loads a JSON file and parses it into a specified type.                                          |
| updateWithMissingKeys       | baseTranslation: any, targetTranslation: any, path?: string[]              | any                  | Updates the target translation with missing keys from the base translation.                     |
| extractMissingTranslations  | baseTranslation: any, targetTranslation: any                               | string[]             | Extracts a list of missing translation keys from the target translation.                        |
| chunkArray                  | array: T[], size: number                                                   | T[][]                | Splits an array into chunks of a specified size.                                                |
| renderSystemPrompt          | -                                                                          | string               | Renders the system prompt for the OpenAI API.                                                   |
| renderUserMessage           | language: string, textsToTranslate: Array<string>                          | string               | Renders the user message for the OpenAI API with the language and texts to translate.           |
| translateUITexts            | languageIsoCode: string, textsToTranslate: string[]                        | Promise<string[] \| undefined> | Translates UI texts to a specified language using the OpenAI API.                               |
| callLlm                     | languageName: string, inObject: string[]                                   | Promise<string[] \| undefined> | Calls the OpenAI API to translate texts and handles retries and response parsing.               |

## Examples

```typescript
(async () => {
  const translator = new YpLocaleTranslation();
  await translator.loadAndCompareTranslations();
})();
```

This example demonstrates how to create an instance of the `YpLocaleTranslation` class and call the `loadAndCompareTranslations` method to update translations for all locales.