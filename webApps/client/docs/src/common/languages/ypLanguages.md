# YpLanguages

A class that provides static methods and properties to handle language data, including ISO codes, English names, native names, and additional language information not covered by Google Translate.

## Properties

| Name                          | Type                 | Description                                           |
|-------------------------------|----------------------|-------------------------------------------------------|
| allLanguages                  | YpLanguageData[]     | Static property that returns an array of all language data including ISO6391 languages, additional languages, and Google Translate languages. |
| isoCodesNotInGoogleTranslate  | string[]             | Static property that returns an array of ISO codes for languages that are not supported by Google Translate. |
| additionalLanguages           | YpLanguageData[]     | Static array of additional language data not included in Google Translate. |
| googleTranslateLanguages      | YpLanguageData[]     | Static array of language data supported by Google Translate. |

## Methods

| Name            | Parameters        | Return Type | Description                                                                 |
|-----------------|-------------------|-------------|-----------------------------------------------------------------------------|
| getEnglishName  | code: string      | string \| undefined | Static method that returns the English name of a language given its ISO code. |
| getNativeName   | code: string      | string \| undefined | Static method that returns the native name of a language given its ISO code. |

## Examples

```typescript
// Example usage to get all languages
const languages = YpLanguages.allLanguages;

// Example usage to get English name of a language by its ISO code
const englishName = YpLanguages.getEnglishName('en');

// Example usage to get native name of a language by its ISO code
const nativeName = YpLanguages.getNativeName('ja');
```

Please note that the `YpLanguageData` type is assumed to be defined elsewhere in the codebase, typically representing an object with properties for `englishName`, `nativeName`, and `code`.