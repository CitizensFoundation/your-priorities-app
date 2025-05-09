# Utility Function: truncate

A utility function for truncating strings to a specified length, with options to cut at word boundaries or not, and to customize the truncation suffix.

---

## Description

This function truncates a given string (`input`) to a specified maximum length (`length`). It can either cut off at the exact character limit or at the last word boundary before the limit, depending on the `killwords` flag. A custom string (`end`) can be appended to indicate truncation; by default, this is `'...'`.

---

## Parameters

| Name      | Type     | Description                                                                 |
|-----------|----------|-----------------------------------------------------------------------------|
| input     | string   | The string to be truncated.                                                 |
| length    | number   | The maximum length of the truncated string (default: 255).                  |
| killwords | boolean  | If `true`, truncates at the exact length, possibly cutting words in half.   |
| end       | string   | The string to append to the end of the truncated string (default: `'...'`). |

---

## Returns

| Type   | Description                                 |
|--------|---------------------------------------------|
| string | The truncated string, possibly with suffix. |

---

## Behavior

- If `input` is falsy (e.g., `null`, `undefined`, or `''`), returns an empty string.
- If `input.length` is less than or equal to `length`, returns `input` unchanged.
- If `killwords` is `true`, truncates at the exact character limit.
- If `killwords` is `false`, truncates at the last space before the limit (if any), otherwise at the limit.
- Appends `end` (or `'...'` if not provided) to the truncated string.

---

## Examples

```javascript
const truncate = require('./truncate');

// Truncate at word boundary (default)
truncate('The quick brown fox jumps over the lazy dog', 15, false);
// Output: 'The quick brown...'

// Truncate at exact length, possibly cutting words
truncate('The quick brown fox jumps over the lazy dog', 15, true);
// Output: 'The quick brow...'

// Custom truncation suffix
truncate('Hello world', 5, true, ' [truncated]');
// Output: 'Hello [truncated]'

// No truncation needed
truncate('Short text', 50);
// Output: 'Short text'

// Empty input
truncate('', 10);
// Output: ''
```

---

## Usage

This utility is useful for shortening text for previews, summaries, or UI elements where space is limited.

---

## Export

This function is exported as a CommonJS module.

---

## See Also

- [String.prototype.substring() - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring)
- [String.prototype.lastIndexOf() - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf)
