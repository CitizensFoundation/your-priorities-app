# YpTestHelpers

This class provides helper methods for setting up the application environment, creating mock data, and configuring fetch-mock for testing purposes.

## Properties

No properties.

## Methods

| Name                  | Parameters | Return Type | Description                                                                 |
|-----------------------|------------|-------------|-----------------------------------------------------------------------------|
| setupApp              |            | Promise     | Sets up the application with necessary globals and initializes i18next.     |
| fetchMockConfig       |            | Object      | Returns the configuration object for fetch-mock headers.                     |
| getDomain             |            | YpDomainData | Returns a mock domain data object.                                          |
| getCommunity          |            | YpCommunityData | Returns a mock community data object.                                    |
| getPost               |            | YpPostData  | Returns a mock post data object.                                            |
| getPoint              |            | YpPointData | Returns a mock point data object.                                           |
| getUser               |            | YpUserData  | Returns a mock user data object.                                            |
| getGroup              |            | YpGroupData | Returns a mock group data object.                                           |
| getGroupResults       |            | Object      | Returns an object containing a mock group and a flag for non-open posts.    |
| getImages             |            | Array<YpImageData> | Returns an array of mock image data objects.                            |
| getFetchMock          |            | fetchMock   | Configures and returns a fetch-mock instance with predefined routes.        |
| renderCommonHeader    |            | TemplateResult | Returns a lit-html template for the common header.                       |

## Events (if any)

No events.

## Examples

```typescript
// Example usage of setting up the application for testing
await YpTestHelpers.setupApp();

// Example usage of getting a mock domain data object
const mockDomain = YpTestHelpers.getDomain();

// Example usage of configuring fetch-mock for testing
const mockFetch = YpTestHelpers.getFetchMock();
```

Note: The return types such as `YpDomainData`, `YpCommunityData`, `YpPostData`, `YpPointData`, `YpUserData`, `YpGroupData`, and `YpImageData` are assumed to be predefined interfaces or types representing the structure of the respective data objects. The actual structure of these types is not provided in the given context.