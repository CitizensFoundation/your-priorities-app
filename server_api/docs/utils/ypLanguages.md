# Utility Module: YpLanguages

The `YpLanguages` class provides a comprehensive utility for working with language codes, names, and metadata. It aggregates language data from the [iso-639-1](https://www.npmjs.com/package/iso-639-1) package, as well as custom lists for additional languages and Google Translate-supported languages. This utility is useful for applications that need to display, validate, or map language codes to human-readable names.

---

## Data Model: YpLanguageData

Represents a language entry.

| Name        | Type   | Description                        |
|-------------|--------|------------------------------------|
| englishName | string | The English name of the language   |
| nativeName  | string | The native name of the language    |
| code        | string | The language code (e.g., "en", "fr", "zh-cn") |

---

## Static Properties

### `YpLanguages.additionalLanguages`

A static array of additional language objects not present in the ISO 639-1 standard or Google Translate list.

#### Example
```json
[
  {
    "englishName": "Arabic - Egypt",
    "nativeName": "العربية",
    "code": "ar-eg"
  },
  ...
]
```

### `YpLanguages.googleTranslateLanguages`

A static array of language objects supported by Google Translate, including their English and native names and codes.

#### Example
```json
[
  {
    "englishName": "Afrikaans",
    "nativeName": "Afrikaans",
    "code": "af"
  },
  ...
]
```

---

## Static Getters

### `YpLanguages.allLanguages: YpLanguageData[]`

Returns a combined array of all languages, including:
- Languages from the ISO 639-1 standard,
- Additional custom languages,
- Google Translate-supported languages.

Duplicates (by code) are avoided.

#### Example
```typescript
const all = YpLanguages.allLanguages;
console.log(all.length); // Number of unique languages
```

---

### `YpLanguages.isoCodesNotInGoogleTranslate: string[]`

Returns an array of language codes that are present in `allLanguages` but **not** in `googleTranslateLanguages`.

#### Example
```typescript
const notInGoogle = YpLanguages.isoCodesNotInGoogleTranslate;
console.log(notInGoogle); // e.g., ["ar-eg", "pt-br", ...]
```

---

## Static Methods

### `YpLanguages.getEnglishName(code: string): string | undefined`

Returns the English name for a given language code. If the code is not found, returns `undefined`. Handles case-insensitive matching and also replaces underscores with hyphens for compatibility.

#### Parameters

| Name | Type   | Description                        |
|------|--------|------------------------------------|
| code | string | The language code to look up       |

#### Returns

- `string | undefined`: The English name of the language, or `undefined` if not found.

#### Example
```typescript
YpLanguages.getEnglishName('en');      // "English"
YpLanguages.getEnglishName('pt-br');   // "Portuguese - Brazil"
YpLanguages.getEnglishName('zh_cn');   // "Chinese (Simplified)"
```

---

### `YpLanguages.getNativeName(code: string): string | undefined`

Returns the native name for a given language code. If the code is not found, returns `undefined`. Case-insensitive.

#### Parameters

| Name | Type   | Description                        |
|------|--------|------------------------------------|
| code | string | The language code to look up       |

#### Returns

- `string | undefined`: The native name of the language, or `undefined` if not found.

#### Example
```typescript
YpLanguages.getNativeName('en');      // "English"
YpLanguages.getNativeName('pt-br');   // "Português"
```

---

## Usage Examples

```typescript
import { YpLanguages } from './YpLanguages';

// Get all supported languages
const allLangs = YpLanguages.allLanguages;

// Get English name for a code
const enName = YpLanguages.getEnglishName('fr'); // "French"

// Get native name for a code
const nativeName = YpLanguages.getNativeName('fr'); // "Français"

// Find codes not supported by Google Translate
const notInGoogle = YpLanguages.isoCodesNotInGoogleTranslate;
```

---

## Exported Constants

- `YpLanguages.additionalLanguages`: Array of custom language objects.
- `YpLanguages.googleTranslateLanguages`: Array of Google Translate language objects.

---

## Dependencies

- [iso-639-1](https://www.npmjs.com/package/iso-639-1): Used to fetch standard ISO 639-1 language codes and names.

---

## See Also

- [iso-639-1 documentation](https://www.npmjs.com/package/iso-639-1)
- [YpLanguages source file](./YpLanguages.md) (if linking internally)

---

## Notes

- The class is designed for static usage; do not instantiate.
- Language codes are compared in a case-insensitive manner.
- The utility is suitable for internationalization (i18n) features, language pickers, and validation in web applications.