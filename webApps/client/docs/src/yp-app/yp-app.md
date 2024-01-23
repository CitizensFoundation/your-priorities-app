# YpApp

The `YpApp` class is a LitElement web component that serves as the main application element for a web application. It manages the application's state, including the current page, user information, and various UI elements such as navigation drawers, dialogs, and toasts.

## Properties

| Name                             | Type                          | Description                                                                 |
|----------------------------------|-------------------------------|-----------------------------------------------------------------------------|
| homeLink                         | YpHomeLinkData \| undefined   | Data for the home link.                                                     |
| page                             | string \| undefined           | The current page of the application.                                        |
| appMode                          | YpAppModes                    | The mode of the application, such as "main", "admin", "promotion", etc.     |
| user                             | YpUserData \| undefined       | Data for the current user.                                                  |
| backPath                         | string \| undefined           | The path to navigate back to.                                               |
| showSearch                       | boolean                       | Whether the search UI should be shown.                                      |
| showBack                         | boolean                       | Whether the back button should be shown.                                    |
| loadingAppSpinner                | boolean                       | Whether the application spinner should be shown.                            |
| forwardToPostId                  | string \| undefined           | The ID of the post to navigate forward to.                                  |
| headerTitle                      | string \| undefined           | The title to display in the application header.                             |
| numberOfUnViewedNotifications    | string \| undefined           | The number of unviewed notifications.                                       |
| hideHelpIcon                     | boolean                       | Whether the help icon should be hidden.                                     |
| autoTranslate                    | boolean                       | Whether automatic translation is enabled.                                   |
| languageName                     | string \| undefined           | The name of the current language.                                           |
| goForwardToPostId                | number \| undefined           | The ID of the post to go forward to.                                        |
| showBackToPost                   | boolean                       | Whether the back to post button should be shown.                            |
| goForwardPostName                | string \| undefined           | The name of the post to go forward to.                                      |
| pages                            | Array<YpHelpPageData>         | An array of help page data.                                                 |
| headerDescription                | string \| undefined           | The description to display in the application header.                       |
| notifyDialogHeading              | string \| undefined           | The heading for the notification dialog.                                    |
| notifyDialogText                 | string \| undefined           | The text for the notification dialog.                                       |
| route                            | string                        | The current route of the application.                                       |
| subRoute                         | string \| undefined           | The sub-route of the application.                                           |
| routeData                        | Record<string, string>        | Data for the current route.                                                 |
| userDrawerOpened                 | boolean                       | Whether the user drawer is opened.                                          |

## Methods

| Name                             | Parameters                    | Return Type | Description                                                                 |
|----------------------------------|-------------------------------|-------------|-----------------------------------------------------------------------------|
| renderNavigationIcon             | None                          | TemplateResult | Renders the navigation icons for the application.                           |
| renderActionItems                | None                          | TemplateResult | Renders the action items for the application.                               |
| renderMainApp                    | None                          | TemplateResult | Renders the main application UI.                                            |
| renderGroupPage                  | None                          | TemplateResult | Renders the group page UI.                                                  |
| renderPage                       | None                          | TemplateResult | Renders the current page UI.                                                |
| renderTopBar                     | None                          | TemplateResult | Renders the top bar UI.                                                     |
| renderFooter                     | None                          | TemplateResult | Renders the footer UI.                                                      |
| renderAdminApp                   | None                          | TemplateResult | Renders the admin application UI.                                           |
| renderPromotionApp               | None                          | TemplateResult | Renders the promotion application UI.                                       |
| render                           | None                          | TemplateResult | Renders the entire application UI.                                          |
| updateLocation                   | None                          | void        | Updates the location based on the current URL.                              |
| loadDataViz                      | None                          | void        | Loads the data visualization component.                                     |
| setupTheme                       | None                          | void        | Sets up the theme for the application.                                      |
| toggleDarkMode                   | None                          | void        | Toggles the dark mode theme.                                                |
| toggleHighContrastMode           | None                          | void        | Toggles the high contrast mode theme.                                       |
| openResetPasswordDialog          | resetPasswordToken: string    | void        | Opens the reset password dialog.                                            |
| openUserNotificationsDialog      | None                          | void        | Opens the user notifications dialog.                                        |
| openAcceptInvitationDialog       | inviteToken: string           | void        | Opens the accept invitation dialog.                                         |
| openPageFromId                   | pageId: number                | void        | Opens a help page based on the given ID.                                    |
| openUserInfoPage                 | pageId: number                | void        | Opens a user info page based on the given ID.                               |
| setKeepOpenForPostsOn            | goBackToPage: string          | void        | Sets the application to keep open for posts.                                |
| goBack                           | None                          | void        | Navigates back to the previous page.                                        |
| toggleSearch                     | None                          | void        | Toggles the search UI.                                                      |
| scrollPageToTop                  | None                          | void        | Scrolls the page to the top.                                                |
| closeDialog                      | idName: string                | void        | Closes the specified dialog.                                                |
| getDialogAsync                   | idName: string, callback: Function | void        | Gets a dialog asynchronously and executes a callback.                       |

## Events

- **yp-auto-translate**: Emitted when the auto-translate setting is changed.
- **yp-change-header**: Emitted when the header information is changed.
- **yp-logged-in**: Emitted when the user logs in or out.
- **yp-network-error**: Emitted when there is a network error.
- **yp-open-toast**: Emitted to open a toast message.
- **yp-open-notify-dialog**: Emitted to open the notification dialog.
- **yp-dialog-closed**: Emitted when a dialog is closed.
- **yp-refresh-domain**: Emitted to refresh the domain data.
- **yp-refresh-community**: Emitted to refresh the community data.
- **yp-refresh-group**: Emitted to refresh the group data.
- **yp-close-right-drawer**: Emitted to close the right drawer.
- **yp-set-number-of-un-viewed-notifications**: Emitted to set the number of unviewed notifications.
- **yp-redirect-to**: Emitted to redirect to a specific path.
- **yp-set-home-link**: Emitted to set the home link data.
- **yp-set-next-post**: Emitted to set the next post data.
- **yp-set-pages**: Emitted to set the help pages data.
- **yp-clipboard-copy-notification**: Emitted when text is copied to the clipboard.

## Examples

```typescript
// Example usage of the YpApp component
<yp-app></yp-app>
```

Note: The above documentation is a high-level overview of the `YpApp` class and does not include all properties, methods, and events. The actual implementation may include additional logic and features not captured in this summary.