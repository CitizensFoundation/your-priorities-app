# PlausibleMoreLink

`PlausibleMoreLink` is a custom web component that extends `PlausibleBaseElement`. It is used to render a link that navigates to a more detailed view of a list of items. The link is only displayed if the list contains items.

## Properties

| Name     | Type                      | Description                                      |
|----------|---------------------------|--------------------------------------------------|
| url      | string                    | The URL to navigate to when the link is clicked. |
| endpoint | string                    | The endpoint to append to the site's domain.     |
| site     | PlausibleSiteData         | The site data object.                            |
| list     | PlausibleListItemData[]   | The list of items to determine if the link is displayed. |

## Methods

No public methods are documented.

## Events

No events are documented.

## Examples

```typescript
// Example usage of the PlausibleMoreLink web component
<pl-more-link
  url="https://example.com/more"
  endpoint="details"
  .site=${{ domain: 'example.com' }}
  .list=${[{ /* ... list item data ... */ }]}
></pl-more-link>
```

Note: The example assumes `PlausibleSiteData` and `PlausibleListItemData` are predefined interfaces or types with the necessary structure to be used as properties for this component.