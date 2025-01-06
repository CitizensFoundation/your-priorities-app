# YpLanguages

The `YpLanguages` class provides a comprehensive list of languages, combining data from ISO6391, additional languages, and Google Translate supported languages. It offers methods to retrieve language names in English and native formats based on language codes.

## Properties

| Name                      | Type               | Description                                                                 |
|---------------------------|--------------------|-----------------------------------------------------------------------------|
| additionalLanguages       | YpLanguageData[]   | A static array of additional languages not covered by ISO6391 or Google Translate. |
| googleTranslateLanguages  | YpLanguageData[]   | A static array of languages supported by Google Translate.                  |

## Methods

| Name                          | Parameters          | Return Type         | Description                                                                 |
|-------------------------------|---------------------|---------------------|-----------------------------------------------------------------------------|
| allLanguages                  | None                | YpLanguageData[]    | Returns a combined list of all languages from ISO6391, additional, and Google Translate languages. |
| isoCodesNotInGoogleTranslate  | None                | string[]            | Returns a list of ISO language codes that are not supported by Google Translate. |
| getEnglishName                | code: string        | string              | Returns the English name of the language for the given code. If not found, returns the code itself. |
| getNativeName                 | code: string        | string \| undefined | Returns the native name of the language for the given code. If not found, returns undefined. |

## Examples

```typescript
// Example usage of the YpLanguages class

// Get all languages
const languages = YpLanguages.allLanguages;
console.log(languages);

// Get English name for a language code
const englishName = YpLanguages.getEnglishName('es');
console.log(englishName); // Output: "Spanish"

// Get native name for a language code
const nativeName = YpLanguages.getNativeName('es');
console.log(nativeName); // Output: "Español"

// Get ISO codes not supported by Google Translate
const isoCodesNotInGoogle = YpLanguages.isoCodesNotInGoogleTranslate;
console.log(isoCodesNotInGoogle);
```

## Types

```typescript
interface YpLanguageData {
  englishName: string;
  nativeName: string;
  code: string;
}
```