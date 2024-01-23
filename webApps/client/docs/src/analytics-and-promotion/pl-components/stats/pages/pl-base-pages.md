# PlausableBasePages

This class extends `PlausibleBaseElementWithState` and manages the base functionality for pages within the Plausible analytics dashboard.

## Properties

| Name     | Type                | Description                           |
|----------|---------------------|---------------------------------------|
| pagePath | string \| undefined | The path of the page being represented. |

## Methods

| Name               | Parameters                        | Return Type | Description                                         |
|--------------------|-----------------------------------|-------------|-----------------------------------------------------|
| connectedCallback  |                                   | void        | Invoked when the component is added to the document. |
| fetchData          |                                   | Promise     | Fetches data for the page using the API.             |
| externalLinkDest   | page: PlausiblePageData           | string      | Constructs an external link for a given page.        |

## Events

None.

## Examples

```typescript
// Example usage of PlausableBasePages
```

Please note that the example usage is not provided, and the `PlausiblePageData` type used in the `externalLinkDest` method is not defined in the provided code snippet. Additional information would be needed to give a complete example and to document the `PlausiblePageData` type.