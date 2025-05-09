# Utility Module: isValidDbId

A utility module for validating database ID values. The primary function exported is `isValidDbId`, which checks whether a given value is a valid integer database ID (excluding strings containing a dot, e.g., "123.45").

---

## Functions

| Name         | Parameters         | Return Type | Description                                                                 |
|--------------|--------------------|-------------|-----------------------------------------------------------------------------|
| isValidDbId  | dbId: any          | boolean     | Checks if the input is a valid integer database ID (no decimals, not falsy).|

---

## Function: isValidDbId

Checks whether the provided `dbId` is a valid integer database ID. The function returns `false` if:

- The value is falsy (e.g., `null`, `undefined`, `0`, `''`).
- The value is a string containing a dot (`"."`), indicating a decimal or non-integer.
- The value cannot be parsed as an integer.
- The value is not an integer.

Otherwise, returns `true`.

### Parameters

| Name | Type | Description                                 |
|------|------|---------------------------------------------|
| dbId | any  | The value to validate as a database ID.     |

### Returns

- `boolean`: `true` if the value is a valid integer database ID, `false` otherwise.

---

## Examples

```javascript
const { isValidDbId } = require('./isValidDbId');

isValidDbId(123);        // true
isValidDbId("456");      // true
isValidDbId("123.45");   // false
isValidDbId(null);       // false
isValidDbId("abc");      // false
isValidDbId(0);          // false
isValidDbId(undefined);  // false
```

---

## Exported Members

| Name        | Type     | Description                        |
|-------------|----------|------------------------------------|
| isValidDbId | function | See [isValidDbId](#function-isvaliddbid) |

---

This utility is typically used to validate route parameters or request body fields that are expected to be integer database IDs before performing database operations.