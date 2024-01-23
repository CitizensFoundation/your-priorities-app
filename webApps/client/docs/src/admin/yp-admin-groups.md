# YpAdminGroups

`YpAdminGroups` is a custom web component that extends `YpBaseElementWithLogin` to manage and display groups within a community. It allows administrators to create new groups and navigate to existing ones.

## Properties

| Name       | Type            | Description                                      |
|------------|-----------------|--------------------------------------------------|
| community  | YpCommunityData | The community data object containing group data. |

## Methods

| Name       | Parameters     | Return Type | Description                                      |
|------------|----------------|-------------|--------------------------------------------------|
| newGroup   | -              | void        | Redirects to the page for creating a new group.  |
| gotoGroup  | group: YpGroupData | void     | Redirects to the specified group's page.        |
| renderGroup| group: YpGroupData | TemplateResult | Returns the HTML template for rendering a group item. |

## Events

- **None**

## Examples

```typescript
// Example usage of the YpAdminGroups component
<yp-admin-groups .community=${communityData}></yp-admin-groups>
```

**Note:** `YpCommunityData` and `YpGroupData` are assumed to be predefined interfaces or types representing the structure of community and group data respectively. The actual structure of these data types is not provided in the given context.