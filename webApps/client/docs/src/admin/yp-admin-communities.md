# YpAdminCommunities

`YpAdminCommunities` is a custom web component that extends `YpBaseElementWithLogin` to manage and display communities within a domain. It allows administrators to create new communities and navigate to existing ones.

## Properties

| Name   | Type          | Description                                      |
|--------|---------------|--------------------------------------------------|
| domain | YpDomainData  | The domain data object containing community data.|

## Methods

| Name            | Parameters             | Return Type | Description                                                  |
|-----------------|------------------------|-------------|--------------------------------------------------------------|
| newCommunity    |                        | void        | Redirects to the page for creating a new community.          |
| gotoCommunity   | community: YpCommunityData | void    | Redirects to the specified community page.                   |
| renderCommunity | community: YpCommunityData | TemplateResult | Returns a template result for rendering a community item. |
| render          |                        | TemplateResult | Renders the component's HTML template.                      |

## Events

- **None**

## Examples

```typescript
// Example usage of the YpAdminCommunities component
<yp-admin-communities .domain="${yourDomainData}"></yp-admin-communities>
```

Please replace `yourDomainData` with the actual `YpDomainData` object you want to pass to the component.