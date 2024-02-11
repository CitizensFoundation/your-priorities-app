# LANGUAGES_LIST

A constant that represents a record of language codes mapped to an object containing the language's English name and its native name.

## Properties

| Name            | Type   | Description               |
|-----------------|--------|---------------------------|
| LANGUAGES_LIST  | Record<string, { name: string; nativeName: string }> | A record where the key is a string representing the language code, and the value is an object with properties `name` and `nativeName` representing the English name and the native name of the language, respectively. |

## Examples

```typescript
// Example usage of LANGUAGES_LIST
const englishName = LANGUAGES_LIST['en'].name; // 'English'
const nativeName = LANGUAGES_LIST['en'].nativeName; // 'English'

console.log(`The English name of the language is: ${englishName}`);
console.log(`The native name of the language is: ${nativeName}`);
```