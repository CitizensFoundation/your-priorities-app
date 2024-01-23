# PlausibleQueryButton

`PlausibleQueryButton` is a custom web component that extends `PlausibleBaseElement`. It represents a button that, when clicked, navigates to a specified query and optionally executes an additional click handler.

## Properties

| Name      | Type                     | Description                                                                 |
|-----------|--------------------------|-----------------------------------------------------------------------------|
| disabled  | Boolean                  | Indicates whether the button is disabled.                                   |
| query     | PlausibleQueryData       | The query data used when navigating to a new query.                         |
| onClick   | Function \| undefined    | An optional function to be called when the button is clicked.               |
| history   | BrowserHistory           | The browser history object used for navigation.                             |
| to        | PlausibleQueryData       | The query data to navigate to when the button is clicked.                   |

## Methods

| Name    | Parameters                | Return Type | Description                                                                 |
|---------|---------------------------|-------------|-----------------------------------------------------------------------------|
| render  | -                         | TemplateResult | Generates a template result for rendering the button with attached events. |

## Events

- **click**: Emitted when the button is clicked. It prevents the default action, navigates to the specified query, optionally calls the `onClick` handler, and updates the browser history.

## Examples

```typescript
// Example usage of PlausibleQueryButton
<pl-query-button
  .disabled=${false}
  .query=${{ /* PlausibleQueryData properties */ }}
  .onClick=${(event: CustomEvent) => { /* custom click handler */ }}
  .history=${new BrowserHistory()}
  .to=${{ /* PlausibleQueryData properties */ }}
></pl-query-button>
```

Note: `PlausibleQueryData` and `BrowserHistory` types should be defined elsewhere in your codebase, and their detailed structures are not provided in this example.