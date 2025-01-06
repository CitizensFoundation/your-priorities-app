# YpPromotionApp

The `YpPromotionApp` class is a custom web component that extends `YpBaseElementWithLogin`. It is designed to manage and display promotional content, analytics, and settings for different types of collections such as domains, communities, groups, and posts.

## Properties

| Name                  | Type                              | Description                                                                 |
|-----------------------|-----------------------------------|-----------------------------------------------------------------------------|
| collectionType        | string                            | The type of collection being managed (e.g., domain, community, group, post).|
| collectionId          | number \| string                  | The unique identifier for the collection.                                   |
| collectionAction      | string                            | The action to be performed on the collection, default is "config".          |
| page                  | string \| undefined               | The current page being displayed.                                           |
| pageIndex             | number                            | The index of the current page, default is 1.                                |
| collection            | YpCollectionData \| undefined     | The data of the current collection.                                         |
| currentError          | string \| undefined               | The current error message, if any.                                          |
| adminConfirmed        | boolean                           | Indicates if the admin rights are confirmed.                                |
| haveCheckedAdminRights| boolean                           | Indicates if admin rights have been checked.                                |
| haveCheckedPromoterRights | boolean                       | Indicates if promoter rights have been checked.                             |
| active                | boolean                           | Reflects the active state of the component.                                 |
| lastSnackbarText      | string \| undefined               | The text of the last snackbar message.                                      |
| useCommunityId        | string \| number \| undefined     | The community ID used for analytics, if applicable.                         |
| originalCollectionType| string \| undefined               | The original type of the collection.                                        |
| collectionURL         | string \| undefined               | The URL of the collection.                                                  |

## Methods

| Name                  | Parameters                          | Return Type | Description                                                                 |
|-----------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| constructor           | None                                | void        | Initializes the component and sets up initial properties.                   |
| connectedCallback     | None                                | void        | Lifecycle method called when the component is added to the DOM.             |
| disconnectedCallback  | None                                | void        | Lifecycle method called when the component is removed from the DOM.         |
| _getCollection        | None                                | Promise<void>| Fetches the collection data from the server.                                |
| renderTopBar          | None                                | TemplateResult | Renders the top bar of the application.                                     |
| snackbarclosed        | None                                | void        | Clears the last snackbar text.                                              |
| render                | None                                | TemplateResult | Renders the main content of the application.                                |
| renderNavigationBar   | None                                | TemplateResult | Renders the navigation bar based on the screen width.                       |
| tabChanged            | event: CustomEvent                  | void        | Handles tab change events in the navigation bar.                            |
| exitToMainApp         | None                                | void        | Redirects the user to the main application.                                 |
| _setupEventListeners  | None                                | void        | Sets up event listeners for the component.                                  |
| _removeEventListeners | None                                | void        | Removes event listeners from the component.                                 |
| _gotAdminRights       | event: CustomEvent                  | void        | Handles the event when admin rights are confirmed.                          |
| _gotPromoterRights    | event: CustomEvent                  | void        | Handles the event when promoter rights are confirmed.                       |
| _setAdminConfirmed    | None                                | void        | Sets the adminConfirmed property based on access checks.                    |
| updated               | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method called when properties are updated.                        |
| _appError             | event: CustomEvent                  | void        | Handles application errors and displays them in a dialog.                   |
| _renderPage           | None                                | TemplateResult | Renders the current page based on the pageIndex and admin rights.           |
| _settingsColorChanged | event: CustomEvent                  | void        | Fires a global event when the theme color is changed in settings.           |

## Examples

```typescript
// Example usage of the YpPromotionApp component
import './path/to/yp-promotion-app.js';

const app = document.createElement('yp-promotion-app');
document.body.appendChild(app);
```