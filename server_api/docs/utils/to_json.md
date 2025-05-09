# Utility Function: toJSONOrNull

A utility function that safely converts an object to its JSON representation if possible, or returns the object itself, or `null` if the input is falsy. This is commonly used to ensure that objects (such as database models) are serialized to plain JavaScript objects before being sent in API responses.

## Function Signature

```typescript
toJSONOrNull(item: any): any | null
```

## Parameters

| Name | Type | Description |
|------|------|-------------|
| item | any  | The input object to be converted. Can be any value, but typically an object (e.g., a database model instance). |

## Returns

- `any`: If `item` is truthy and has a `toJSON` method, returns the result of `item.toJSON()`.
- `any`: If `item` is truthy and does not have a `toJSON` method, returns `item` as is.
- `null`: If `item` is falsy (e.g., `null`, `undefined`, `0`, `''`), returns `null`.

## Description

This function is useful for normalizing the output of objects that may or may not have a `toJSON` method (such as ORM model instances). It ensures that the returned value is either a plain object (if possible), the original value, or `null` if the input is not provided.

## Example Usage

```javascript
const toJSONOrNull = require('./toJSONOrNull');

const userModel = {
  name: "Alice",
  toJSON: function() { return { name: this.name }; }
};

console.log(toJSONOrNull(userModel)); // { name: "Alice" }
console.log(toJSONOrNull({ foo: "bar" })); // { foo: "bar" }
console.log(toJSONOrNull(null)); // null
```

## Export

This function is exported as the default export of the module.

---

**See also:**  
- [MDN: Object.prototype.toJSON()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/toJSON)  
- [Express.js Response Serialization](https://expressjs.com/en/api.html#res.json)