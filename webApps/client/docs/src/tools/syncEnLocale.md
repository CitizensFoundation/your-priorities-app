# TranslationProcessor

This class provides functionality to process translation files by extracting translation keys from source files, updating the translation file with new keys, and removing unused keys.

## Properties

| Name                  | Type   | Description                                                                 |
|-----------------------|--------|-----------------------------------------------------------------------------|
| srcDirectory          | string | The source directory to search for files.                                   |
| translationFilePath   | string | The path to the translation file to be updated.                             |
| outputFilePath        | string | The path where the updated translation file will be saved.                  |

## Methods

| Name                      | Parameters                                                                 | Return Type  | Description                                                                                     |
|---------------------------|----------------------------------------------------------------------------|--------------|-------------------------------------------------------------------------------------------------|
| findFiles                 | directory: string, extensionRegex: RegExp, foundFiles: string[] = []       | Promise<string[]> | Recursively finds .js and .ts files in a directory, excluding paths with 'test'.                |
| readFileContent           | filePath: string                                                           | Promise<string> | Reads the content of a file.                                                                    |
| extractTranslationKeys    | fileContent: string                                                        | string[]     | Extracts translation keys from file content using regex patterns.                               |
| readTranslationFile       | filePath: string                                                           | Promise<any> | Reads and parses the translation file.                                                          |
| saveUpdatedTranslationFile| filePath: string, content: any                                             | Promise<void>| Saves the updated translation file.                                                             |
| updateTranslations        | usedKeys: string[], translations: any                                      | { updatedTranslations: any; deletedCount: number; newCount: number } | Updates translations by removing unused keys and adding new keys. Returns counts of changes. |
| processTranslations       |                                                                            | Promise<void>| Main function to process translations by finding files, extracting keys, and updating the translation file. |

## Examples

```typescript
// Example usage of the TranslationProcessor

// Execute the main function to process translations
processTranslations();
```

This documentation provides an overview of the `TranslationProcessor` class, detailing its properties and methods, along with their parameters and return types. The class is designed to handle translation file updates by identifying and managing translation keys within a specified source directory.