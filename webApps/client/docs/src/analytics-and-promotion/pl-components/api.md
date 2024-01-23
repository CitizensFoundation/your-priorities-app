# ApiError

Represents an API error with a custom message.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| name          | string | The name of the error.    |
| message       | string | The error message.        |
| stack         | string | The stack trace.          |

## Methods

No methods.

## Events

No events.

# Functions

## setSharedLinkAuth

Sets the shared link authorization token.

| Name       | Parameters        | Return Type | Description                 |
|------------|-------------------|-------------|-----------------------------|
| setSharedLinkAuth | auth: string | void        | Sets the SHARED_LINK_AUTH variable with the provided auth token. |

## cancelAll

Cancels all ongoing API requests.

| Name       | Parameters        | Return Type | Description                 |
|------------|-------------------|-------------|-----------------------------|
| cancelAll |  | void        | Aborts all ongoing fetch requests and reinitializes the AbortController. |

## serializeQuery

Serializes the query parameters for the API request.

| Name       | Parameters        | Return Type | Description                 |
|------------|-------------------|-------------|-----------------------------|
| serializeQuery | query: PlausibleQueryData, extraQuery: any | string        | Serializes the given query parameters into a query string. |

## get

Performs a GET request to the specified URL.

| Name       | Parameters        | Return Type | Description                 |
|------------|-------------------|-------------|-----------------------------|
| get | proxyUrl: string \| undefined, url: string \| Request, query: PlausibleQueryData, ...extraQuery: any[] | Promise<any>        | If a proxy URL is provided, it calls `getWithProxy`, otherwise it calls `getDirect`. |

## getWithProxy

Performs a GET request to the specified URL using a proxy.

| Name       | Parameters        | Return Type | Description                 |
|------------|-------------------|-------------|-----------------------------|
| getWithProxy | proxyUrl: string, url: string \| Request, query: PlausibleQueryData, ...extraQuery: any[] | Promise<any>        | Performs a GET request using a proxy server by sending a PUT request to the proxy URL with the target URL and query parameters. |

## getDirect

Performs a direct GET request to the specified URL.

| Name       | Parameters        | Return Type | Description                 |
|------------|-------------------|-------------|-----------------------------|
| getDirect | url: string \| Request, query: PlausibleQueryData, ...extraQuery: any[] | Promise<any>        | Performs a direct GET request to the specified URL with the provided query parameters. |

# Types

## PlausibleQueryData

Type definition for the query data used in API requests.

## PlausibleQueryStringsData

Type definition for the query strings data derived from `PlausibleQueryData`.

## Examples

```typescript
// Example usage of setting shared link authorization
setSharedLinkAuth('your_auth_token');

// Example usage of canceling all requests
cancelAll();

// Example usage of serializing a query
const query = {
  period: '30d',
  date: new Date(),
  filters: { browser: 'Firefox' }
};
const serializedQuery = serializeQuery(query);

// Example usage of performing a GET request
get('https://api.example.com/data', { period: '30d' }).then(data => {
  console.log(data);
});
```

Please note that the actual implementation of `PlausibleQueryData` and `PlausibleQueryStringsData` types are not provided in the given code snippet. You would need to define these types based on the expected structure of the query data for the API requests.