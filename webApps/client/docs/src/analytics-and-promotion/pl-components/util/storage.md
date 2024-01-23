# MemStore

Interface representing the in-memory storage structure.

## Properties

| Name | Type                  | Description                           |
|------|-----------------------|---------------------------------------|
| key  | string                | The key in the storage.               |
| value| string \| undefined   | The value associated with the key.    |

# Functions

## setItem

Sets the value for the specified key either in local storage or in-memory store.

| Name       | Parameters            | Return Type | Description                 |
|------------|-----------------------|-------------|-----------------------------|
| setItem    | key: string, value: string | void      | Stores a value by key.      |

## getItem

Retrieves the value for the specified key from local storage or in-memory store.

| Name       | Parameters            | Return Type | Description                 |
|------------|-----------------------|-------------|-----------------------------|
| getItem    | key: string           | string \| null | Retrieves a value by key.  |

## testLocalStorageAvailability

Checks if the local storage is available and functional.

| Name                         | Parameters | Return Type | Description                 |
|------------------------------|------------|-------------|-----------------------------|
| testLocalStorageAvailability |            | boolean     | Checks local storage availability. |

## Examples

```typescript
// Set an item in local storage or in-memory store
setItem('userToken', 'abc123');

// Get an item from local storage or in-memory store
const userToken = getItem('userToken');
console.log(userToken); // Outputs: 'abc123' or null if not set
```