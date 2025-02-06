# YpAdminApp

The `YpAdminApp` class is a custom web component that extends `YpBaseElement`. It serves as the main administrative interface for managing various aspects of a platform, such as configurations, users, and content moderation.

## Properties

| Name                  | Type                                      | Description                                                                 |
|-----------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| `page`                | `AdminPageOptions`                        | The current page being displayed.                                           |
| `user`                | `YpUserData \| undefined`                 | The current user data.                                                      |
| `active`              | `boolean`                                 | Reflects whether the component is active.                                   |
| `route`               | `string`                                  | The current route path.                                                     |
| `subRoute`            | `string \| undefined`                     | The sub-route path.                                                         |
| `routeData`           | `RouteData`                               | Data related to the current route.                                          |
| `userYpCollection`    | `YpGroupData[]`                           | Collection of user groups.                                                  |
| `forwardToYpId`       | `string \| undefined`                     | ID to forward to.                                                           |
| `headerTitle`         | `string \| undefined`                     | Title for the header.                                                       |
| `collectionType`      | `CollectionTypes \| "post" \| "groups" \| "communities" \| "profile_image"` | The type of collection being managed.                                       |
| `collectionId`        | `number \| "new"`                         | The ID of the collection or "new" for a new collection.                     |
| `parentCollectionId`  | `number \| undefined`                     | The ID of the parent collection.                                            |
| `parentCollection`    | `YpCollectionData \| undefined`           | Data of the parent collection.                                              |
| `collection`          | `YpCollectionData \| undefined`           | Data of the current collection.                                             |
| `adminConfirmed`      | `boolean`                                 | Indicates if the admin rights are confirmed.                                |
| `haveCheckedAdminRights` | `boolean`                              | Indicates if admin rights have been checked.                                |
| `anchor`              | `HTMLElement \| null`                     | The anchor element for the component.                                       |
| `_scrollPositionMap`  | `Record<string, number>`                  | Map to store scroll positions.                                              |
| `communityBackOverride` | `Record<string, Record<string, string>> \| undefined` | Overrides for community back navigation.                                    |

## Methods

| Name                      | Parameters                                                                 | Return Type | Description                                                                 |
|---------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| `constructor`             | -                                                                          | `void`      | Initializes the component and sets up event listeners.                      |
| `updatePageFromPath`      | -                                                                          | `void`      | Updates the page based on the current path.                                 |
| `firstUpdated`            | `_changedProperties: PropertyValueMap<any> \| Map<PropertyKey, unknown>`   | `void`      | Called after the first update of the component.                             |
| `connectedCallback`       | -                                                                          | `void`      | Called when the component is added to the document.                         |
| `updateLocation`          | -                                                                          | `void`      | Updates the location based on the current path.                             |
| `disconnectedCallback`    | -                                                                          | `void`      | Called when the component is removed from the document.                     |
| `_pageChanged`            | -                                                                          | `void`      | Handles changes to the current page.                                        |
| `tabChanged`              | `event: CustomEvent`                                                       | `void`      | Handles changes to the navigation tab.                                      |
| `_setupEventListeners`    | -                                                                          | `void`      | Sets up global event listeners.                                             |
| `_refreshAdminRights`     | -                                                                          | `void`      | Refreshes admin rights.                                                     |
| `_removeEventListeners`   | -                                                                          | `void`      | Removes global event listeners.                                             |
| `_refreshGroup`           | -                                                                          | `void`      | Refreshes the group page.                                                   |
| `_refreshCommunity`       | -                                                                          | `void`      | Refreshes the community page.                                               |
| `_refreshDomain`          | -                                                                          | `void`      | Refreshes the domain page.                                                  |
| `_refreshByName`          | `id: string`                                                               | `void`      | Refreshes a page by its ID.                                                 |
| `updated`                 | `changedProperties: Map<string \| number \| symbol, unknown>`              | `void`      | Called after the component is updated.                                      |
| `_needsUpdate`            | -                                                                          | `void`      | Requests an update for the component.                                       |
| `updateFromCollection`    | -                                                                          | `void`      | Updates the component from the current collection.                          |
| `renderGroupConfigPage`   | -                                                                          | `TemplateResult` | Renders the group configuration page.                                       |
| `renderCommunityConfigPage` | -                                                                        | `TemplateResult` | Renders the community configuration page.                                   |
| `renderDomainConfigPage`  | -                                                                          | `TemplateResult` | Renders the domain configuration page.                                      |
| `_renderPage`             | -                                                                          | `TemplateResult` | Renders the current page based on the admin confirmation and page type.     |
| `getCollection`           | -                                                                          | `Promise<void>` | Fetches the current collection data.                                        |
| `_getAdminCollection`     | -                                                                          | `Promise<void>` | Fetches the parent collection data for admin confirmation.                  |
| `_setAdminFromParent`     | -                                                                          | `Promise<void>` | Sets admin rights based on the parent collection.                           |
| `_setAdminConfirmedFromParent` | `collection: YpCollectionData`                                        | `void`      | Confirms admin rights based on the parent collection.                       |
| `_setAdminConfirmed`      | -                                                                          | `void`      | Confirms admin rights based on the current collection.                      |
| `getParentCollectionType` | -                                                                          | `string`    | Returns the type of the parent collection.                                  |
| `exitToMainApp`           | -                                                                          | `void`      | Exits the admin app and redirects to the main app.                          |
| `render`                  | -                                                                          | `TemplateResult` | Renders the component.                                                      |
| `_isPageSelectedClass`    | `page: AdminPageOptions`                                                   | `string`    | Returns the CSS class for the selected page.                                |
| `_getListHeadline`        | `type: AdminPageOptions`                                                   | `string`    | Returns the headline for a list item based on the page type.                |
| `_getListSupportingText`  | `type: AdminPageOptions`                                                   | `string`    | Returns the supporting text for a list item based on the page type.         |
| `_getListIcon`            | `type: AdminPageOptions`                                                   | `string`    | Returns the icon for a list item based on the page type.                    |
| `setPage`                 | `type: AdminPageOptions`                                                   | `void`      | Sets the current page and triggers a global refresh event.                  |
| `renderMenuListItem`      | `type: AdminPageOptions`                                                   | `TemplateResult` | Renders a menu list item for the navigation bar.                            |
| `isAllOurIdeasGroupType`  | -                                                                          | `boolean`   | Checks if the current group type is "allOurIdeas".                          |
| `renderNavigationBar`     | -                                                                          | `TemplateResult` | Renders the navigation bar based on the screen width.                       |

## Examples

```typescript
// Example usage of the YpAdminApp web component
import './yp-admin-app.js';

const adminApp = document.createElement('yp-admin-app');
document.body.appendChild(adminApp);
```