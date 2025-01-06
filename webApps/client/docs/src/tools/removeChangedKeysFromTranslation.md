# RemoveKeysFromTranslations

This class is designed to remove specific keys from translation JSON files located in a specified directory, excluding certain locales.

## Properties

| Name           | Type     | Description                                                                 |
|----------------|----------|-----------------------------------------------------------------------------|
| localesDir     | string   | The directory where locale folders are located.                             |
| excludeLocales | string[] | An array of locale names to exclude from processing.                        |
| keysToRemove   | string[] | An array of keys that should be removed from the translation files.         |

## Methods

| Name                  | Parameters                  | Return Type | Description                                                                 |
|-----------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| removeKeys            | None                        | Promise<void> | Asynchronously processes each locale directory, removing specified keys from translation files. |
| loadJsonFile          | filePath: string            | Promise<T>  | Asynchronously reads and parses a JSON file from the given file path.       |
| removeKeysFromTranslation | translation: Translation, keysToRemove: string[] | Translation | Recursively removes specified keys from a translation object.               |

## Examples

```typescript
// Example usage of the RemoveKeysFromTranslations class
(async () => {
  const remover = new RemoveKeysFromTranslations();
  await remover.removeKeys();
})();
```