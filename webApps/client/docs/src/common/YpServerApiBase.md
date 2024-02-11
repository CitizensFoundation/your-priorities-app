# YpServerApiBase

The `YpServerApiBase` class extends `YpCodeBase` and provides base functionalities for server API interactions, including a method to transform collection types to API endpoints, a fetch wrapper for network requests, and a response handler.

## Properties

| Name         | Type   | Description                                      |
|--------------|--------|--------------------------------------------------|
| baseUrlPath  | string | The base path for the API, defaulting to "/api". |

## Methods

| Name                          | Parameters                                                                 | Return Type            | Description                                                                                   |
|-------------------------------|----------------------------------------------------------------------------|------------------------|-----------------------------------------------------------------------------------------------|
| transformCollectionTypeToApi  | type: string                                                               | string                 | Static method to transform a given collection type to its corresponding API endpoint string.  |
| fetchWrapper                  | url: string, options: RequestInit, showUserError: boolean, errorId: string \| undefined, throwError: boolean | Promise<any>           | Protected method to perform fetch requests with error handling and offline support.           |
| handleResponse                | response: Response, showUserError: boolean, errorId: string \| undefined, throwError: boolean | Promise<any \| null>   | Protected method to handle the response from fetch requests, including error management.      |

## Examples

```typescript
// Example usage of the YpServerApiBase class to transform a collection type to an API endpoint
const apiEndpoint = YpServerApiBase.transformCollectionTypeToApi('user');
console.log(apiEndpoint); // Output: "users"

// Example usage of the YpServerApiBase class to perform a fetch request
const serverApiBase = new YpServerApiBase();
serverApiBase.fetchWrapper('https://example.com/api/data', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your-token-here'
  }
}).then(data => {
  console.log(data);
}).catch(error => {
  console.error('Fetch error:', error);
});
```

Please note that the actual implementation of the `YpServerApiBase` class may include additional methods, properties, and events that are not documented here. This documentation provides an overview of the key components of the class as it pertains to API interactions.