# YpAdminApp

The `YpAdminApp` class is a web component for managing various administrative aspects of a platform, such as configuration, translations, organizations, reports, users, admins, moderation, AI analysis, groups, communities, and more. It extends from `YpBaseElement` and uses the `@customElement` decorator to define the custom element tag as `yp-admin-app`.

## Properties

| Name                  | Type                      | Description                                                                 |
|-----------------------|---------------------------|-----------------------------------------------------------------------------|
| page                  | AdminPageOptions          | The current admin page being displayed.                                      |
| user                  | YpUserData \| undefined   | The user data object, if available.                                          |
| active                | boolean                   | Indicates whether the admin app is active.                                   |
| route                 | string                    | The current route as a string.                                               |
| subRoute              | string \| undefined       | The sub-route within the current route.                                      |
| routeData             | RouteData                 | Data extracted from the route, such as the current page.                     |
| userYpCollection      | YpGroupData[]             | An array of group data objects associated with the user.                     |
| forwardToYpId         | string \| undefined       | An ID to forward to within the admin app.                                    |
| headerTitle           | string \| undefined       | The title displayed in the header of the admin app.                          |
| collectionType        | CollectionTypes \| string | The type of collection being managed (e.g., domain, community, group, etc.). |
| collectionId          | number \| "new"           | The ID of the collection being managed, or "new" for creating a new one.     |
| parentCollectionId    | number \| undefined       | The ID of the parent collection, if applicable.                              |
| parentCollection      | YpCollectionData \| undefined | Data about the parent collection.                                        |
| collection            | YpCollectionData \| undefined | Data about the current collection being managed.                         |
| adminConfirmed        | boolean                   | Indicates whether the admin status has been confirmed.                       |
| haveCheckedAdminRights| boolean                   | Indicates whether admin rights have been checked.                            |

## Methods

| Name               | Parameters        | Return Type | Description                 |
|--------------------|-------------------|-------------|-----------------------------|
| updatePageFromPath | None              | void        | Updates the page based on the current path. |
| updateLocation     | None              | void        | Updates the location based on the current path. |
| _pageChanged       | None              | void        | Called when the page property changes. |
| tabChanged         | event: CustomEvent| void        | Handles changes in the navigation tab. |
| _setupEventListeners | None            | void        | Sets up event listeners for the component. |
| _refreshAdminRights | None             | void        | Refreshes the admin rights. |
| _removeEventListeners | None           | void        | Removes event listeners from the component. |
| _refreshGroup      | None              | void        | Refreshes the group page. |
| _refreshCommunity  | None              | void        | Refreshes the community page. |
| _refreshDomain     | None              | void        | Refreshes the domain page. |
| _refreshByName     | id: string        | void        | Refreshes a page by its ID. |
| updated            | changedProperties: Map<string \| number \| symbol, unknown> | void | Called when the component's properties are updated. |
| _needsUpdate       | None              | void        | Requests an update of the component. |
| renderGroupConfigPage | None           | TemplateResult | Renders the group configuration page. |
| renderCommunityConfigPage | None       | TemplateResult | Renders the community configuration page. |
| renderDomainConfigPage | None          | TemplateResult | Renders the domain configuration page. |
| _renderPage        | None              | TemplateResult | Renders the current admin page. |
| getCollection      | None              | Promise<void> | Retrieves the current collection data. |
| _setAdminFromParent | None             | Promise<void> | Sets admin confirmed status based on parent collection. |
| _setAdminConfirmedFromParent | collection: YpCollectionData | void | Sets admin confirmed status from a parent collection. |
| _setAdminConfirmed | None              | void        | Sets the admin confirmed status based on the current collection. |
| getParentCollectionType | None         | string      | Gets the parent collection type based on the current collection type. |
| exitToMainApp      | None              | void        | Exits to the main application. |
| render             | None              | TemplateResult | Renders the component. |
| _isPageSelectedClass | page: AdminPageOptions | string | Returns a class if the page is selected. |
| _getListHeadline   | type: AdminPageOptions | string | Gets the headline for a list item. |
| _getListSupportingText | type: AdminPageOptions | string | Gets the supporting text for a list item. |
| _getListIcon       | type: AdminPageOptions | string | Gets the icon for a list item. |
| setPage            | type: AdminPageOptions | void  | Sets the current page. |
| renderMenuListItem | type: AdminPageOptions | TemplateResult | Renders a menu list item. |
| renderNavigationBar | None             | TemplateResult | Renders the navigation bar. |

## Events (if any)

- **yp-network-error**: Emitted when there is a network error, such as unauthorized access.

## Examples

```typescript
// Example usage of the YpAdminApp component
<yp-admin-app></yp-admin-app>
```

Note: The actual usage of the component would involve setting up the necessary properties and handling events as needed for the specific context in which it is used.