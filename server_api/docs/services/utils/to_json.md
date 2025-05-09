# Utility Function: toJSONOrNull

A utility function that attempts to convert an object to its JSON representation by calling its `toJSON()` method. If the input object does not have a `toJSON()` method, or if the input is falsy, the function returns `null`.

## Function Signature

```typescript
toJSONOrNull(item: any): any | null
```

## Parameters

| Name | Type | Description |
|------|------|-------------|
| item | any  | The object to be converted to JSON. Should have a `toJSON()` method. |

## Returns

- `any`: The result of `item.toJSON()` if `item` is truthy and has a `toJSON()` method.
- `null`: If `item` is falsy or does not have a `toJSON()` method.

## Description

This function is useful for safely serializing objects that may or may not implement a `toJSON()` method. It is commonly used when working with ORM models (such as Mongoose or Sequelize) that provide a `toJSON()` method for serialization.

## Example Usage

```javascript
const toJSONOrNull = require('./toJSONOrNull');

const user = {
  name: 'Alice',
  toJSON() {
    return { name: this.name };
  }
};

const result = toJSONOrNull(user);
// result: { name: 'Alice' }

const plainObject = { name: 'Bob' };
const result2 = toJSONOrNull(plainObject);
// result2: null

const result3 = toJSONOrNull(null);
// result3: null
```

## Export

This function is exported as the default export of the module.

---

**See also:**  
- [MDN: Object.prototype.toJSON()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/toJSON)  
- [Node.js: JSON.stringify()](https://nodejs.org/api/json.html#jsonstringifyvalue-replacer-space)