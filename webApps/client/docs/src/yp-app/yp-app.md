# YpApp

The `YpApp` class is a LitElement-based web component that serves as the main application container for a web application. It manages the application's state, routing, and user interactions, and provides methods for handling various events and rendering different parts of the application.

## Properties

| Name                          | Type                                      | Description                                                                 |
|-------------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| homeLink                      | YpHomeLinkData \| undefined               | The home link data for the application.                                     |
| page                          | string \| undefined                       | The current page being displayed.                                           |
| scrollPosition                | number                                    | The current scroll position of the window.                                  |
| appMode                       | YpAppModes                                | The current mode of the application (e.g., "main", "admin").                |
| user                          | YpUserData \| undefined                   | The current user data.                                                      |
| backPath                      | string \| undefined                       | The path to navigate back to.                                               |
| showSearch                    | boolean                                   | Whether to show the search functionality.                                   |
| showBack                      | boolean                                   | Whether to show the back button.                                            |
| loadingAppSpinner             | boolean                                   | Whether to show the loading spinner for the app.                            |
| forwardToPostId               | string \| undefined                       | The ID of the post to forward to.                                           |
| headerTitle                   | string \| undefined                       | The title of the header.                                                    |
| numberOfUnViewedNotifications | string \| undefined                       | The number of unviewed notifications.                                       |
| hideHelpIcon                  | boolean                                   | Whether to hide the help icon.                                              |
| autoTranslate                 | boolean                                   | Whether auto-translation is enabled.                                        |
| languageName                  | string \| undefined                       | The name of the current language.                                           |
| goForwardToPostId             | number \| undefined                       | The ID of the post to go forward to.                                        |
| showBackToPost                | boolean                                   | Whether to show the back to post button.                                    |
| goForwardPostName             | string \| undefined                       | The name of the post to go forward to.                                      |
| pages                         | Array<YpHelpPageData>                     | The list of help pages.                                                     |
| headerDescription             | string \| undefined                       | The description of the header.                                              |
| notifyDialogHeading           | string \| undefined                       | The heading of the notification dialog.                                     |
| notifyDialogText              | string \| undefined                       | The text of the notification dialog.                                        |
| route                         | string                                    | The current route.                                                          |
| subRoute                      | string \| undefined                       | The current sub-route.                                                      |
| currentTitle                  | string \| undefined                       | The current title of the page.                                              |
| routeData                     | Record<string, string>                    | The data associated with the current route.                                 |
| userDrawerOpened              | boolean                                   | Whether the user drawer is opened.                                          |
| navDrawerOpened               | boolean                                   | Whether the navigation drawer is opened.                                    |
| notificationDrawerOpened      | boolean                                   | Whether the notification drawer is opened.                                  |
| currentTheme                  | YpThemeConfiguration \| undefined         | The current theme configuration.                                            |
| keepOpenForPost               | string \| undefined                       | The path to keep open for a post.                                           |
| keepOpenForGroup              | string \| undefined                       | The path to keep open for a group.                                          |
| breadcrumbs                   | Array<{ name: string; url: string }>      | The list of breadcrumbs for navigation.                                     |

## Methods

| Name                          | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| setupAppGlobals               | None                                                                       | void        | Sets up the application globals.                                            |
| connectedCallback             | None                                                                       | void        | Called when the element is added to the document's DOM.                     |
| disconnectedCallback          | None                                                                       | void        | Called when the element is removed from the document's DOM.                 |
| _handleScroll                 | None                                                                       | void        | Handles the scroll event.                                                   |
| updated                       | changedProperties: Map<string \| number \| symbol, unknown>                | Promise<void> | Called when the element's properties have changed.                          |
| _navDrawOpened                | event: CustomEvent                                                         | void        | Handles the navigation drawer opened event.                                 |
| _languageLoaded               | None                                                                       | void        | Handles the language loaded event.                                          |
| _ypError                      | event: CustomEvent                                                         | void        | Handles the YP error event.                                                 |
| _netWorkError                 | event: CustomEvent                                                         | void        | Handles the network error event.                                            |
| _setupEventListeners          | None                                                                       | void        | Sets up the event listeners for the application.                            |
| _themeUpdated                 | event: CustomEvent                                                         | void        | Handles the theme updated event.                                            |
| _removeEventListeners         | None                                                                       | void        | Removes the event listeners for the application.                            |
| static get styles             | None                                                                       | CSSResult[] | Returns the styles for the component.                                       |
| _haveCopiedNotification       | None                                                                       | void        | Handles the copied notification event.                                      |
| _appDialogsReady              | event: CustomEvent                                                         | void        | Handles the app dialogs ready event.                                        |
| hasStaticBadgeTheme           | None                                                                       | boolean     | Returns whether the badge theme is static.                                  |
| updateLocation                | None                                                                       | void        | Updates the location based on the current route.                            |
| _openUserEdit                 | None                                                                       | void        | Opens the user edit dialog.                                                 |
| isFullScreenMode              | None                                                                       | boolean     | Returns whether the application is in full-screen mode.                     |
| renderNavigationIcon          | None                                                                       | TemplateResult | Renders the navigation icon.                                                |
| renderNavigation              | None                                                                       | TemplateResult | Renders the navigation elements.                                            |
| _openHelpMenu                 | None                                                                       | void        | Opens the help menu.                                                        |
| renderNonArrowNavigation      | None                                                                       | TemplateResult | Renders the non-arrow navigation elements.                                  |
| renderActionItems             | None                                                                       | TemplateResult | Renders the action items in the top bar.                                    |
| renderTopBar                  | None                                                                       | TemplateResult | Renders the top bar of the application.                                     |
| renderMainApp                 | None                                                                       | TemplateResult | Renders the main application content.                                       |
| renderGroupPage               | None                                                                       | TemplateResult | Renders the group page.                                                     |
| renderPage                    | None                                                                       | TemplateResult | Renders the current page based on the route.                                |
| renderDrawers                 | None                                                                       | TemplateResult | Renders the drawers for navigation and notifications.                       |
| renderFooter                  | None                                                                       | TemplateResult | Renders the footer of the application.                                      |
| renderAdminApp                | None                                                                       | TemplateResult | Renders the admin application content.                                      |
| renderPromotionApp            | None                                                                       | TemplateResult | Renders the promotion application content.                                  |
| render                        | None                                                                       | TemplateResult | Renders the entire application.                                             |
| _openNotifyDialog             | event: CustomEvent                                                         | void        | Opens the notification dialog.                                              |
| _openToast                    | event: CustomEvent                                                         | void        | Opens the toast notification.                                               |
| _resetNotifyDialogText        | None                                                                       | void        | Resets the notification dialog text.                                        |
| translatedPages               | pages: Array<YpHelpPageData>                                               | Array<YpHelpPageData> | Returns the translated pages.                                               |
| openPageFromId                | pageId: number                                                             | void        | Opens a page by its ID.                                                     |
| _openPageFromMenu             | event: Event                                                               | void        | Opens a page from the menu.                                                 |
| _openPage                     | page: YpHelpPageData                                                       | void        | Opens a specific page.                                                      |
| _getPageLocale                | page: YpHelpPageData                                                       | string      | Returns the locale of a page.                                               |
| _getLocalizePageTitle         | page: YpHelpPageData                                                       | string      | Returns the localized title of a page.                                      |
| _setPages                     | event: CustomEvent                                                         | void        | Sets the pages for the application.                                         |
| _addBackCommunityOverride     | event: CustomEvent                                                         | void        | Adds a back community override.                                             |
| _goToNextPost                 | None                                                                       | void        | Navigates to the next post.                                                 |
| _goToPreviousPost             | None                                                                       | void        | Navigates to the previous post.                                             |
| _setNextPost                  | event: CustomEvent                                                         | void        | Sets the next post to navigate to.                                          |
| _clearNextPost                | None                                                                       | void        | Clears the next post navigation data.                                       |
| _setupSamlCallback            | None                                                                       | void        | Sets up the SAML callback for authentication.                               |
| _openPageFromEvent            | event: CustomEvent                                                         | void        | Opens a page from an event.                                                 |
| openUserInfoPage              | pageId: number                                                             | void        | Opens a user info page by its ID.                                           |
| _setLanguageName              | event: CustomEvent                                                         | void        | Sets the language name.                                                     |
| _autoTranslateEvent           | event: CustomEvent                                                         | void        | Handles the auto-translate event.                                           |
| _refreshGroup                 | None                                                                       | void        | Refreshes the group data.                                                   |
| _refreshCommunity             | None                                                                       | void        | Refreshes the community data.                                               |
| _refreshDomain                | None                                                                       | void        | Refreshes the domain data.                                                  |
| _refreshByName                | id: string                                                                 | void        | Refreshes a collection by its ID.                                           |
| _setNumberOfUnViewedNotifications | event: CustomEvent                                                     | void        | Sets the number of unviewed notifications.                                  |
| _redirectTo                   | event: CustomEvent                                                         | void        | Redirects to a specified path.                                              |
| _routeChanged                 | None                                                                       | void        | Handles changes to the route.                                               |
| _routePageChanged             | oldRouteData: Record<string, string>                                       | void        | Handles changes to the page based on the route.                             |
| loadDataViz                   | None                                                                       | void        | Loads the data visualization component.                                     |
| _pageChanged                  | None                                                                       | void        | Handles changes to the current page.                                        |
| openResetPasswordDialog       | resetPasswordToken: string                                                 | void        | Opens the reset password dialog.                                            |
| openUserNotificationsDialog   | None                                                                       | void        | Opens the user notifications dialog.                                        |
| openAcceptInvitationDialog    | inviteToken: string                                                        | void        | Opens the accept invitation dialog.                                         |
| _showPage404                  | None                                                                       | void        | Shows the 404 page.                                                         |
| _setHomeLink                  | event: CustomEvent                                                         | void        | Sets the home link for the application.                                     |
| setKeepOpenForPostsOn         | goBackToPage: string                                                       | void        | Sets the path to keep open for posts.                                       |
| _resetKeepOpenForPage         | None                                                                       | void        | Resets the keep open for page data.                                         |
| _closeForGroup                | None                                                                       | void        | Closes the group view.                                                      |
| _closePost                    | None                                                                       | void        | Closes the post view.                                                       |
| closePostHeader               | None                                                                       | boolean     | Returns whether the post header should be closed.                           |
| _isGroupOpen                  | params: { groupId?: number; postId?: number }, keepOpenForPost: boolean    | boolean     | Returns whether a group is open.                                            |
| _isCommunityOpen              | params: { communityId?: number; postId?: number }, keepOpenForPost: boolean | boolean     | Returns whether a community is open.                                        |
| _isDomainOpen                 | params: { domainId?: number; postId?: number }, keepOpenForPost: boolean   | boolean     | Returns whether a domain is open.                                           |
| _openNavDrawer                | None                                                                       | Promise<void> | Opens the navigation drawer.                                                |
| _closeNavDrawer               | None                                                                       | Promise<void> | Closes the navigation drawer.                                               |
| getDialogAsync                | idName: string, callback: Function                                         | Promise<void> | Gets a dialog asynchronously.                                               |
| closeDialog                   | idName: string                                                             | void        | Closes a dialog by its ID.                                                  |
| _dialogClosed                 | event: CustomEvent                                                         | void        | Handles the dialog closed event.                                            |
| scrollPageToTop               | None                                                                       | void        | Scrolls the page to the top.                                                |
| _openUserDrawer               | None                                                                       | Promise<void> | Opens the user drawer.                                                      |
| _closeUserDrawer              | None                                                                       | Promise<void> | Closes the user drawer.                                                     |
| _openNotificationDrawer       | None                                                                       | Promise<void> | Opens the notification drawer.                                              |
| _closeNotificationDrawer      | None                                                                       | Promise<void> | Closes the notification drawer.                                             |
| isOnDomainLoginPageAndNotLoggedIn | None                                                                  | boolean     | Returns whether the user is on the domain login page and not logged in.     |
| _login                        | None                                                                       | void        | Initiates the login process.                                                |
| _onChangeHeader               | event: CustomEvent                                                         | void        | Handles changes to the header.                                              |
| updateBreadcrumbs             | newBreadcrumb: { name: string; url: string }                               | void        | Updates the breadcrumbs for navigation.                                     |
| goBack                        | None                                                                       | void        | Navigates back to the previous page.                                        |
| _onSearch                     | e: CustomEvent                                                             | void        | Handles the search event.                                                   |
| _onUserChanged                | event: CustomEvent                                                         | void        | Handles changes to the user data.                                           |
| toggleSearch                  | None                                                                       | void        | Toggles the search functionality.                                           |
| _handleKeyDown                | event: KeyboardEvent                                                       | void        | Handles the key down event.                                                 |
| _setupTouchEvents             | None                                                                       | void        | Sets up touch events for the application.                                   |
| _removeTouchEvents            | None                                                                       | void        | Removes touch events for the application.                                   |
| _handleTouchStart             | event: any                                                                 | void        | Handles the touch start event.                                              |
| _handleTouchMove              | event: any                                                                 | void        | Handles the touch move event.                                               |
| _handleTouchEnd               | None                                                                       | void        | Handles the touch end event.                                                |

## Examples

```typescript
// Example usage of the YpApp component
import { YpApp } from './path-to-yp-app.js';

const app = new YpApp();
document.body.appendChild(app);
```