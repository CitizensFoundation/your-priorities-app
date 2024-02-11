# YpApp

The `YpApp` class is a LitElement web component that serves as the main application element for a platform. It manages the application's state, including the current page, user information, notifications, and more. It also handles global events and interactions such as navigation, search, and user authentication.

## Properties

| Name                             | Type                          | Description                                                                 |
|----------------------------------|-------------------------------|-----------------------------------------------------------------------------|
| homeLink                         | YpHomeLinkData \| undefined   | Data for the home link in the navigation.                                   |
| page                             | string \| undefined           | The current page being displayed.                                           |
| appMode                          | YpAppModes                    | The mode of the app, which can be "main", "admin", "promotion", or "analytics". |
| user                             | YpUserData \| undefined       | The current user's data.                                                    |
| backPath                         | string \| undefined           | The path to navigate back to.                                               |
| showSearch                       | boolean                       | Whether the search functionality is visible.                                |
| showBack                         | boolean                       | Whether the back button is visible.                                         |
| loadingAppSpinner                | boolean                       | Whether the app is showing a loading spinner.                               |
| forwardToPostId                  | string \| undefined           | The ID of the post to navigate forward to.                                  |
| headerTitle                      | string \| undefined           | The title displayed in the app's header.                                    |
| numberOfUnViewedNotifications    | string \| undefined           | The number of unread notifications.                                         |
| hideHelpIcon                     | boolean                       | Whether to hide the help icon.                                              |
| autoTranslate                    | boolean                       | Whether auto-translation is enabled.                                        |
| languageName                     | string \| undefined           | The name of the current language.                                           |
| goForwardToPostId                | number \| undefined           | The ID of the post to go forward to.                                        |
| showBackToPost                   | boolean                       | Whether to show the back to post button.                                    |
| goForwardPostName                | string \| undefined           | The name of the post to go forward to.                                      |
| pages                            | Array<YpHelpPageData>         | A list of help pages.                                                       |
| headerDescription                | string \| undefined           | The description displayed in the app's header.                              |
| notifyDialogHeading              | string \| undefined           | The heading for the notification dialog.                                    |
| notifyDialogText                 | string \| undefined           | The text for the notification dialog.                                       |
| route                            | string                        | The current route in the app.                                               |
| subRoute                         | string \| undefined           | The sub-route within the current route.                                     |
| routeData                        | Record<string, string>        | Data associated with the current route.                                     |
| userDrawerOpened                 | boolean                       | Whether the user drawer is opened.                                          |

## Methods

| Name                             | Parameters                    | Return Type | Description                                                                 |
|----------------------------------|-------------------------------|-------------|-----------------------------------------------------------------------------|
| renderNavigationIcon             | None                          | TemplateResult | Renders the navigation icons for the app.                                  |
| renderActionItems                | None                          | TemplateResult | Renders the action items for the app's header.                             |
| renderMainApp                    | None                          | TemplateResult | Renders the main application content.                                      |
| renderGroupPage                  | None                          | TemplateResult | Renders the group page.                                                    |
| renderPage                       | None                          | TemplateResult | Renders the current page based on the `page` property.                     |
| renderTopBar                     | None                          | TemplateResult | Renders the top bar of the app, including the navigation drawer.           |
| renderFooter                     | None                          | TemplateResult | Renders the footer of the app, including snackbars and dialogs.            |
| renderAdminApp                   | None                          | TemplateResult | Renders the admin app if the `appMode` is set to "admin".                  |
| renderPromotionApp               | None                          | TemplateResult | Renders the promotion app if the `appMode` is set to "promotion" or "analytics". |
| render                           | None                          | TemplateResult | Renders the entire app, including top bar, main app, and footer.          |
| updateLocation                   | None                          | void        | Updates the location based on the current URL.                             |
| translatedPages                  | pages: Array<YpHelpPageData>  | Array<YpHelpPageData> | Returns a translated copy of the help pages.                              |
| openPageFromId                   | pageId: number                | void        | Opens a help page based on the given page ID.                              |
| goBack                           | None                          | void        | Navigates back to the previous page or path.                               |
| toggleSearch                     | None                          | void        | Toggles the search functionality.                                          |
| _toggleNavDrawer                 | None                          | void        | Toggles the navigation drawer.                                             |
| _toggleUserDrawer                | None                          | void        | Toggles the user drawer.                                                   |
| _login                           | None                          | void        | Initiates the login process for the user.                                  |

## Events

- **yp-auto-translate**: Emitted when auto-translate is toggled.
- **yp-theme-configuration-updated**: Emitted when the theme configuration is updated.
- **yp-change-header**: Emitted when the header needs to be updated.
- **yp-logged-in**: Emitted when the user logs in.
- **yp-network-error**: Emitted when there is a network error.
- **yp-refresh-domain**: Emitted when the domain needs to be refreshed.
- **yp-refresh-community**: Emitted when the community needs to be refreshed.
- **yp-refresh-group**: Emitted when the group needs to be refreshed.
- **yp-close-right-drawer**: Emitted when the right drawer needs to be closed.
- **yp-set-number-of-un-viewed-notifications**: Emitted when the number of unread notifications is updated.
- **yp-redirect-to**: Emitted when a redirection to a specific path is needed.
- **yp-set-home-link**: Emitted when the home link needs to be set.
- **yp-set-next-post**: Emitted when the next post to navigate to is set.
- **yp-set-pages**: Emitted when the help pages are set.
- **yp-clipboard-copy-notification**: Emitted when a notification about clipboard copy is needed.
- **yp-app-dialogs-ready**: Emitted when the app dialogs are ready.

## Examples

```typescript
// Example usage of the YpApp component
<yp-app></yp-app>
```

Note: The above documentation is a high-level overview of the `YpApp` class and does not cover all properties, methods, and events. The actual implementation may include additional logic and features not described here.