# YpServerApiBase

The `YpServerApiBase` class extends `YpCodeBase` and provides methods to interact with server APIs, including a fetch wrapper and response handling.

## Properties

| Name         | Type   | Description                                   |
|--------------|--------|-----------------------------------------------|
| baseUrlPath  | string | The base path for the API endpoints.          |

## Methods

| Name                          | Parameters                                                                 | Return Type            | Description                                                                                   |
|-------------------------------|----------------------------------------------------------------------------|------------------------|-----------------------------------------------------------------------------------------------|
| transformCollectionTypeToApi  | type: string                                                               | string                 | Static method to transform a collection type to its corresponding API type.                   |
| fetchWrapper                  | url: string, options: RequestInit, showUserError: boolean, errorId: string \| undefined, throwError: boolean | Promise<any>           | Protected method to perform fetch requests with error handling and offline support.           |
| handleResponse                | response: Response, showUserError: boolean, errorId: string \| undefined, throwError: boolean          | Promise<any \| null>   | Protected method to handle the response from fetch requests, including error handling.        |

## Examples

```typescript
// Example usage of the YpServerApiBase class to perform an API call
const apiBase = new YpServerApiBase();
const options: RequestInit = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

apiBase.fetchWrapper('https://example.com/api/data', options)
  .then(data => {
    console.log('Data fetched successfully:', data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
```

```typescript
// Example usage of the static method transformCollectionTypeToApi
const apiType = YpServerApiBase.transformCollectionTypeToApi('user');
console.log(apiType); // Outputs: 'users'
```
