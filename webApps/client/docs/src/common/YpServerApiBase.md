# YpServerApiBase

Base class for server API interactions, extending `YpCodeBase`. Provides utility methods for transforming collection types, handling fetch requests with offline support, error handling, and response processing.

## Properties

| Name         | Type     | Description                                  |
|--------------|----------|----------------------------------------------|
| baseUrlPath  | string   | The base URL path for API requests (`/api`). |

## Methods

| Name                                 | Parameters                                                                                                                                         | Return Type        | Description                                                                                                   |
|-------------------------------------- |----------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|---------------------------------------------------------------------------------------------------------------|
| static transformCollectionTypeToApi   | type: string                                                                                                                                       | string             | Transforms a singular collection type (e.g., "domain") to its API plural form (e.g., "domains").              |
| fetchWrapper                         | url: string, options?: RequestInit, showUserError?: boolean, errorId?: string \| undefined, throwError?: boolean                                   | Promise<any>       | Wrapper for `fetch` with offline support, error handling, and response processing.                             |
| accessError                          | none                                                                                                                                               | void               | Handles access errors, showing offline toast or triggering login for 401 errors.                               |
| handleResponse                       | response: Response, showUserError: boolean, errorId?: string \| undefined, throwError?: boolean                                                    | Promise<any>       | Handles the response from a fetch request, including error handling and JSON parsing.                          |

## Events

- **yp-network-error**: Fired globally when a network error occurs during a fetch request. The event detail includes the response, error information, and user error display options.

## Examples

```typescript
class MyApi extends YpServerApiBase {
  async getCommunities() {
    const url = `${this.baseUrlPath}/communities`;
    return await this.fetchWrapper(url, { method: "GET" });
  }
}

const api = new MyApi();
api.getCommunities().then(communities => {
  console.log(communities);
});
```
