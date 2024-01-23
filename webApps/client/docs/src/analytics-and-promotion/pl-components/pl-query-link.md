# PlausibleQueryLink

The `PlausibleQueryLink` class extends `PlausibleBaseElement` to provide a custom element that creates a navigable link based on query data.

## Properties

| Name            | Type                      | Description                                       |
|-----------------|---------------------------|---------------------------------------------------|
| onClickFunction | Function                  | Function to be executed when the link is clicked. |
| query           | PlausibleQueryData        | Query data for the current state.                 |
| to              | PlausibleQueryData        | Query data for the destination state.             |
| history         | BrowserHistory            | Browser history object for navigation.            |

## Methods

| Name     | Parameters        | Return Type | Description                                      |
|----------|-------------------|-------------|--------------------------------------------------|
| onClick  | e: CustomEvent    | void        | Handles click events and navigates to the query. |
| render   | -                 | TemplateResult | Returns a template result to render the element. |

## Events

- **N/A**: This class does not emit any custom events.

## Examples

```typescript
// Example usage of the PlausibleQueryLink web component
<pl-query-link
  .query=${{ /* current query data */ }}
  .to=${{ /* destination query data */ }}
  .history=${/* BrowserHistory instance */}
></pl-query-link>
```

Please note that the `PlausibleQueryData` and `BrowserHistory` types are not defined in the provided code snippet. You should refer to their respective definitions to understand the structure and usage of these types.