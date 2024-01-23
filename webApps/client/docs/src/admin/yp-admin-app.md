# YpAdminApp

The `YpAdminApp` class is a web component for managing various administrative aspects of a platform, such as configurations, translations, organizations, reports, users, moderation, and more. It extends from `YpBaseElement` and is decorated with `@customElement("yp-admin-app")`.

## Properties

| Name                  | Type                        | Description                                                                 |
|-----------------------|-----------------------------|-----------------------------------------------------------------------------|
| page                  | AdminPageOptions            | The current admin page being displayed.                                      |
| user                  | YpUserData \| undefined     | The user data for the admin user.                                            |
| active                | boolean                     | Indicates whether the admin app is active.                                   |
| route                 | string                      | The current route.                                                           |
| subRoute              | string \| undefined         | The sub-route within the admin app.                                          |
| routeData             | RouteData                   | Data extracted from the route.                                               |
| userYpCollection      | YpGroupData[]               | Collection of groups associated with the user.                               |
| forwardToYpId         | string \| undefined         | ID to forward to within the admin app.                                       |
| headerTitle           | string \| undefined         | The title displayed in the header.                                           |
| collectionType        | CollectionTypes \| string   | The type of collection being managed (e.g., domain, community, group, etc.). |
| collectionId          | number \| "new"             | The ID of the collection being managed, or "new" for creating a new one.     |
| parentCollectionId    | number \| undefined         | The ID of the parent collection, if applicable.                              |
| parentCollection      | YpCollectionData \| undefined | Data about the parent collection.                                           |
| collection            | YpCollectionData \| undefined | Data about the current collection being managed.                            |
| adminConfirmed        | boolean                     | Indicates whether the admin rights have been confirmed.                      |
| haveCheckedAdminRights| boolean                     | Indicates whether admin rights have been checked.                            |
| anchor                | HTMLElement \| null         | A reference to an anchor element.                                            |
| communityBackOverride | Record<string, Record<string, string>> \| undefined | Overrides for community back navigation.           |
| _scrollPositionMap    | object                      | A map to store scroll positions.                                             |

## Methods

| Name                   | Parameters                  | Return Type | Description                                                                 |
|------------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| updatePageFromPath     |                             | void        | Updates the current page based on the window location path.                 |
| firstUpdated           | _changedProperties: PropertyValueMap<any> \| Map<PropertyKey, unknown> | void | Lifecycle method called after the component's first render. |
| connectedCallback      |                             | void        | Lifecycle method called when the component is added to the DOM.             |
| updateLocation         |                             | void        | Updates the location based on the window location path.                     |
| disconnectedCallback   |                             | void        | Lifecycle method called when the component is removed from the DOM.         |
| _pageChanged           |                             | void        | Called when the page property changes.                                      |
| tabChanged             | event: CustomEvent          | void        | Handles tab changes in the navigation bar.                                  |
| _setupEventListeners   |                             | void        | Sets up event listeners.                                                    |
| _refreshAdminRights    |                             | void        | Refreshes the admin rights.                                                 |
| _removeEventListeners  |                             | void        | Removes event listeners.                                                    |
| _refreshGroup          |                             | void        | Refreshes the group page.                                                   |
| _refreshCommunity      |                             | void        | Refreshes the community page.                                               |
| _refreshDomain         |                             | void        | Refreshes the domain page.                                                  |
| _refreshByName         | id: string                  | void        | Refreshes a page by its ID.                                                 |
| updated                | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method called after the component's properties have changed. |
| _needsUpdate           |                             | void        | Requests an update to the component.                                        |
| renderGroupConfigPage  |                             | TemplateResult | Renders the group configuration page.                                      |
| renderCommunityConfigPage |                         | TemplateResult | Renders the community configuration page.                                  |
| renderDomainConfigPage |                             | TemplateResult | Renders the domain configuration page.                                     |
| _renderPage            |                             | TemplateResult | Renders the current page based on the `page` property.                     |
| getCollection          |                             | Promise<void> | Fetches the collection data from the server.                                |
| _setAdminFromParent    |                             | Promise<void> | Sets admin rights based on the parent collection.                           |
| _setAdminConfirmedFromParent | collection: YpCollectionData | void | Sets admin confirmed status from parent collection.                       |
| _setAdminConfirmed     |                             | void        | Sets the admin confirmed status based on the current collection.            |
| getParentCollectionType|                             | string      | Gets the parent collection type based on the current collection type.       |
| exitToMainApp          |                             | void        | Exits the admin app and redirects to the main app.                          |
| render                 |                             | TemplateResult | Renders the component.                                                     |
| _isPageSelectedClass   | page: AdminPageOptions      | string      | Returns a class if the page is selected.                                    |
| _getListHeadline       | type: AdminPageOptions      | string      | Returns the headline for a list item based on the type.                     |
| _getListSupportingText | type: AdminPageOptions      | string      | Returns the supporting text for a list item based on the type.              |
| _getListIcon           | type: AdminPageOptions      | string      | Returns the icon for a list item based on the type.                         |
| setPage                | type: AdminPageOptions      | void        | Sets the current page.                                                      |
| renderMenuListItem     | type: AdminPageOptions      | TemplateResult | Renders a menu list item.                                                  |
| renderNavigationBar    |                             | TemplateResult | Renders the navigation bar.                                                |

## Events (if any)

- **yp-network-error**: Emitted when there is a network error, such as unauthorized access.

## Examples

```typescript
// Example usage of the YpAdminApp component
<yp-admin-app></yp-admin-app>
```

Note: The actual usage of the component would involve setting up the necessary properties and handling the events appropriately.