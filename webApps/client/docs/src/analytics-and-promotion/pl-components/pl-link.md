# PlausibleLink

`PlausibleLink` is a web component that extends `PlausibleBaseElement` to create a navigable link within a single-page application (SPA). It updates the browser's history stack using the History API.

## Properties

| Name   | Type   | Description                                      |
|--------|--------|--------------------------------------------------|
| to     | string \| undefined | The path to navigate to when the link is clicked. |

## Methods

| Name    | Parameters   | Return Type | Description                                      |
|---------|--------------|-------------|--------------------------------------------------|
| onClick | e: Event     | void        | Handles the click event, preventing the default link behavior and manually updating the browser's history. |

## Events

- **popstate**: Emitted after updating the browser's history to simulate navigation.

## Examples

```typescript
// Example usage of PlausibleLink
<pl-link to="/some/path">Navigate to Some Path</pl-link>
```

Note: The `currentUri` getter and the `styles` static method are internal to the component and are not part of the public API, hence they are not documented in the Properties or Methods sections.