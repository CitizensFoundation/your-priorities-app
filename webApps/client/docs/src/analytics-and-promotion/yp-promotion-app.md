# YpPromotionApp

The `YpPromotionApp` class is a custom web component that provides a user interface for managing promotions within a platform. It extends `YpBaseElementWithLogin`, which likely provides common functionality and properties related to user authentication and session management.

## Properties

| Name                     | Type                      | Description                                                                 |
|--------------------------|---------------------------|-----------------------------------------------------------------------------|
| collectionType           | string                    | The type of collection (e.g., domain, community, group, post).              |
| collectionId             | number \| string          | The identifier for the collection.                                          |
| collectionAction         | string                    | The action to be performed on the collection, defaulting to "config".       |
| page                     | string \| undefined       | The current page being displayed.                                           |
| pageIndex                | number                    | The index of the current page being displayed.                              |
| collection               | YpCollectionData \| undefined | The data for the collection being managed.                                 |
| currentError             | string \| undefined       | The current error message, if any.                                          |
| adminConfirmed           | boolean                   | A flag indicating whether the user has confirmed admin rights.              |
| haveCheckedAdminRights   | boolean                   | A flag indicating whether admin rights have been checked.                   |
| haveCheckedPromoterRights| boolean                   | A flag indicating whether promoter rights have been checked.                |
| active                   | boolean                   | A flag indicating whether the component is active.                          |
| lastSnackbarText         | string \| undefined       | The text of the last snackbar notification.                                 |
| useCommunityId           | string \| number \| undefined | An identifier for the community to use for analytics, if applicable.      |
| originalCollectionType   | string \| undefined       | The original type of the collection before any changes.                     |
| collectionURL            | string \| undefined       | The URL for the collection.                                                 |

## Methods

| Name                | Parameters | Return Type | Description                                                                 |
|---------------------|------------|-------------|-----------------------------------------------------------------------------|
| renderTopBar        | -          | TemplateResult | Renders the top bar of the application.                                   |
| snackbarclosed      | -          | void        | Handles the event when the snackbar is closed.                              |
| render              | -          | TemplateResult | Renders the main content of the application.                              |
| renderNavigationBar | -          | TemplateResult | Renders the navigation bar for the application.                           |
| tabChanged          | event: CustomEvent | void | Handles changes to the selected tab in the navigation bar.                |
| exitToMainApp       | -          | void        | Exits the promotion app and navigates to the main application.              |
| _setupEventListeners| -          | void        | Sets up event listeners for the component.                                  |
| _removeEventListeners| -         | void        | Removes event listeners from the component.                                 |
| _gotAdminRights     | event: CustomEvent | void | Handles the event when admin rights are confirmed.                         |
| _gotPromoterRights  | event: CustomEvent | void | Handles the event when promoter rights are confirmed.                      |
| _setAdminConfirmed  | -          | void        | Sets the `adminConfirmed` property based on user rights.                    |
| updated             | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method called after the component’s properties have changed. |
| _appError           | event: CustomEvent | void | Handles application errors.                                                |
| _renderPage         | -          | TemplateResult \| nothing | Renders the content for the current page based on `pageIndex`.           |
| _settingsColorChanged| event: CustomEvent | void | Handles changes to the theme color settings.                               |

## Events

- **exit-to-app**: Fired when the user exits the promotion app to return to the main application.
- **yp-got-admin-rights**: Fired when the user's admin rights are confirmed.
- **yp-got-promoter-rights**: Fired when the user's promoter rights are confirmed.
- **yp-network-error**: Fired when there is a network error, such as unauthorized access.
- **yp-theme-color**: Fired when the theme color is changed in the settings.

## Examples

```typescript
// Example usage of the YpPromotionApp component
<yp-promotion-app
  collectionType="community"
  collectionId="123"
  collectionAction="config"
  page="analytics"
  pageIndex="1"
></yp-promotion-app>
```

This component is designed to be used within a larger application and relies on various properties and methods to provide its functionality. It includes a navigation bar, error handling, and the ability to render different pages based on the user's role and the current state of the application.