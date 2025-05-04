# YpApp

The `YpApp` class is the main application shell for the Yp web application. It manages global state, routing, navigation, user sessions, event handling, and the rendering of the main app layout, including drawers, dialogs, top bar, and page content. It extends `YpBaseElement` and is registered as the `<yp-app>` custom element.

## Properties

| Name                              | Type                                                      | Description                                                                                   |
|------------------------------------|-----------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| homeLink                          | YpHomeLinkData \| undefined                              | The home link data for navigation.                                                            |
| page                              | string \| undefined                                       | The current page identifier.                                                                  |
| scrollPosition                    | number                                                    | The current scroll position of the window.                                                    |
| appMode                           | "main" \| "admin" \| "promotion" \| "analytics"           | The current application mode.                                                                 |
| user                              | YpUserData \| undefined                                   | The currently logged-in user data.                                                            |
| backPath                          | string \| undefined                                       | The path to navigate back to.                                                                 |
| showSearch                        | boolean                                                   | Whether to show the search UI.                                                                |
| showBack                          | boolean                                                   | Whether to show the back navigation button.                                                   |
| loadingAppSpinner                 | boolean                                                   | Whether to show the loading spinner for app transitions.                                      |
| forwardToPostId                   | string \| undefined                                       | The ID of the post to forward to.                                                             |
| headerTitle                       | string \| undefined                                       | The current header title.                                                                     |
| numberOfUnViewedNotifications     | string \| undefined                                       | The number of unviewed notifications (as a string, e.g., "9+").                              |
| hideHelpIcon                      | boolean                                                   | Whether to hide the help icon in the top bar.                                                 |
| autoTranslate                     | boolean                                                   | Whether auto-translation is enabled.                                                          |
| languageName                      | string \| undefined                                       | The name of the current language.                                                             |
| goForwardToPostId                 | number \| undefined                                       | The ID of the post to go forward to.                                                          |
| showBackToPost                    | boolean                                                   | Whether to show the "back to post" UI.                                                        |
| goForwardPostName                 | string \| undefined                                       | The name of the post to go forward to.                                                        |
| pages                             | Array<YpHelpPageData>                                     | The list of help pages available.                                                             |
| headerDescription                 | string \| undefined                                       | The current header description.                                                               |
| notifyDialogHeading               | string \| undefined                                       | The heading for the notification dialog.                                                      |
| notifyDialogText                  | string \| undefined                                       | The text for the notification dialog.                                                         |
| route                             | string                                                    | The current route path.                                                                       |
| subRoute                          | string \| undefined                                       | The sub-route path.                                                                           |
| currentTitle                      | string \| undefined                                       | The current document title.                                                                   |
| routeData                         | Record<string, string>                                    | The current route parameters.                                                                 |
| userDrawerOpened                  | boolean                                                   | Whether the user drawer is open.                                                              |
| navDrawerOpened                   | boolean                                                   | Whether the navigation drawer is open.                                                        |
| notificationDrawerOpened          | boolean                                                   | Whether the notification drawer is open.                                                      |
| currentTheme                      | YpThemeConfiguration \| undefined                         | The current theme configuration.                                                              |
| keepOpenForPost                   | string \| undefined                                       | The path to keep open for a post (for modal navigation).                                      |
| keepOpenForGroup                  | string \| undefined                                       | The path to keep open for a group (for modal navigation).                                     |
| breadcrumbs                       | Array<{ name: string; url: string }>                      | The current navigation breadcrumbs.                                                           |

### Internal/Instance Properties

| Name                              | Type                                                      | Description                                                                                   |
|------------------------------------|-----------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| anchor                            | HTMLElement \| null                                       | The anchor element for menus.                                                                 |
| previousSearches                  | Array<string>                                             | List of previous search queries.                                                              |
| storedBackPath                    | string \| undefined                                       | Stored back path for modal navigation.                                                        |
| storedLastDocumentTitle           | string \| undefined                                       | Stored document title for modal navigation.                                                   |
| useHardBack                       | boolean                                                   | Whether to use a hard back navigation (full page reload).                                     |
| _scrollPositionMap                | Record<string, number>                                    | Map of scroll positions per page.                                                             |
| goBackToPostId                    | number \| undefined                                       | The ID of the post to go back to.                                                             |
| currentPostId                     | number \| undefined                                       | The current post ID.                                                                          |
| goForwardCount                    | number                                                    | The number of times the user has gone forward in post navigation.                             |
| firstLoad                         | boolean                                                   | Whether this is the first load of the app.                                                    |
| communityBackOverride             | Record<string, Record<string, string>> \| undefined       | Overrides for community back navigation.                                                      |
| touchXDown, touchYDown            | number \| undefined                                       | Touch start coordinates for swipe navigation.                                                 |
| touchXUp, touchYUp                | number \| undefined                                       | Touch end coordinates for swipe navigation.                                                   |
| userDrawerOpenedDelayed           | boolean                                                   | Delayed state for user drawer open.                                                           |
| navDrawOpenedDelayed              | boolean                                                   | Delayed state for nav drawer open.                                                            |
| haveLoadedAdminApp                | boolean                                                   | Whether the admin app has been loaded.                                                        |
| haveLoadedPromotionApp            | boolean                                                   | Whether the promotion app has been loaded.                                                    |

## Methods

| Name                                 | Parameters                                                                 | Return Type         | Description                                                                                   |
|-------------------------------------- |----------------------------------------------------------------------------|---------------------|-----------------------------------------------------------------------------------------------|
| constructor                          | -                                                                          | void                | Initializes the app, sets up global singletons, and translation system.                       |
| setupAppGlobals                      | -                                                                          | void                | Sets up global app globals.                                                                   |
| connectedCallback                    | -                                                                          | void                | Lifecycle: sets up event listeners and routing.                                               |
| disconnectedCallback                 | -                                                                          | void                | Lifecycle: removes event listeners.                                                           |
| updated                              | changedProperties: Map<string \| number \| symbol, unknown>                | Promise<void>       | Handles updates, including dynamic loading of admin/promotion apps.                           |
| _navDrawOpened                       | event: CustomEvent                                                         | void                | Handles nav drawer open/close with delay.                                                     |
| _languageLoaded                      | -                                                                          | void                | Sets language loaded flag.                                                                    |
| _ypError                             | event: CustomEvent                                                         | void                | Handles application errors and opens error dialog.                                            |
| _netWorkError                        | event: CustomEvent                                                         | void                | Handles network errors and opens error dialog.                                                |
| _setupEventListeners                 | -                                                                          | void                | Adds all global and local event listeners.                                                    |
| _themeUpdated                        | event: CustomEvent                                                         | void                | Updates the theme configuration.                                                              |
| _removeEventListeners                | -                                                                          | void                | Removes all global and local event listeners.                                                 |
| _haveCopiedNotification              | -                                                                          | void                | Shows a notification that content was copied to clipboard.                                    |
| _appDialogsReady                     | event: CustomEvent                                                         | void                | Sets global appDialogs when ready.                                                            |
| hasStaticBadgeTheme                  | -                                                                          | boolean             | Returns true if the current theme uses a static badge color.                                  |
| updateLocation                       | -                                                                          | void                | Updates the route and app mode based on the current URL.                                      |
| _openUserEdit                        | -                                                                          | void                | Opens the user edit dialog.                                                                   |
| isFullScreenMode                     | -                                                                          | boolean             | Returns true if the app is in full screen mode (agent workflow).                              |
| renderNavigationIcon                 | -                                                                          | TemplateResult      | Renders the navigation icon button.                                                           |
| renderNavigation                     | -                                                                          | TemplateResult      | Renders the navigation/back/close icons based on state.                                       |
| _openHelpMenu                        | -                                                                          | void                | Opens the help menu.                                                                          |
| renderNonArrowNavigation             | -                                                                          | TemplateResult      | Renders the non-arrow navigation icon.                                                        |
| renderActionItems                    | -                                                                          | TemplateResult      | Renders the action items in the top bar (help, notifications, user, login, etc).              |
| renderTopBar                         | -                                                                          | TemplateResult      | Renders the top app bar.                                                                      |
| renderMainApp                        | -                                                                          | TemplateResult      | Renders the main app content area.                                                            |
| renderGroupPage                      | -                                                                          | TemplateResult      | Renders the group page.                                                                       |
| renderPage                           | -                                                                          | TemplateResult      | Renders the current page based on the route.                                                  |
| renderDrawers                        | -                                                                          | TemplateResult      | Renders the navigation, notification, and user drawers.                                       |
| renderFooter                         | -                                                                          | TemplateResult      | Renders the app footer, including update toast and dialogs.                                   |
| renderAdminApp                       | -                                                                          | TemplateResult      | Renders the admin app if in admin mode.                                                       |
| renderPromotionApp                   | -                                                                          | TemplateResult      | Renders the promotion/analytics app if in those modes.                                        |
| render                               | -                                                                          | TemplateResult      | Main render method for the app.                                                               |
| _openNotifyDialog                    | event: CustomEvent                                                         | void                | Opens the notification dialog with provided text.                                             |
| _openToast                           | event: CustomEvent                                                         | void                | Opens the snackbar toast with provided text.                                                  |
| _resetNotifyDialogText               | -                                                                          | void                | Resets and closes the notification dialog.                                                    |
| translatedPages                      | pages: Array<YpHelpPageData>                                               | Array<YpHelpPageData>| Returns a deep copy of the help pages array.                                                  |
| openPageFromId                       | pageId: number                                                             | void                | Opens a help page by its ID.                                                                  |
| _openPageFromMenu                    | event: Event                                                               | void                | Opens a help page from the help menu.                                                         |
| _openPage                            | page: YpHelpPageData                                                       | void                | Opens a help page dialog.                                                                     |
| _getPageLocale                       | page: YpHelpPageData                                                       | string              | Gets the best locale for a help page.                                                         |
| _getLocalizePageTitle                | page: YpHelpPageData                                                       | string              | Gets the localized title for a help page.                                                     |
| _setPages                            | event: CustomEvent                                                         | void                | Sets the help pages array.                                                                    |
| _addBackCommunityOverride            | event: CustomEvent                                                         | void                | Adds a back navigation override for a community.                                              |
| _goToNextPost                        | -                                                                          | void                | Navigates to the next recommended post.                                                       |
| _goToPreviousPost                    | -                                                                          | void                | Navigates back to the previous post.                                                          |
| _setNextPost                         | event: CustomEvent                                                         | void                | Sets the next post to navigate to.                                                            |
| _clearNextPost                       | -                                                                          | void                | Clears the next post navigation state.                                                        |
| _setupSamlCallback                   | -                                                                          | void                | Sets up SAML login callback listener.                                                         |
| _openPageFromEvent                   | event: CustomEvent                                                         | void                | Opens a help page from a custom event.                                                        |
| openUserInfoPage                     | pageId: number                                                             | void                | Opens a user info help page by its index.                                                     |
| _setLanguageName                     | event: CustomEvent                                                         | void                | Sets the current language name.                                                               |
| _autoTranslateEvent                  | event: CustomEvent                                                         | void                | Sets the auto-translate state.                                                                |
| _refreshGroup                        | -                                                                          | Promise<void>       | Refreshes the group page.                                                                     |
| _refreshCommunity                    | -                                                                          | Promise<void>       | Refreshes the community page.                                                                 |
| _refreshDomain                       | -                                                                          | void                | Refreshes the domain page.                                                                    |
| _refreshByName                       | id: string                                                                 | Promise<void>       | Refreshes a collection page by its element ID.                                                |
| _setNumberOfUnViewedNotifications    | event: CustomEvent                                                         | void                | Sets the number of unviewed notifications.                                                    |
| _redirectTo                          | event: CustomEvent                                                         | void                | Redirects to a given path.                                                                    |
| _routeChanged                        | -                                                                          | Promise<void>       | Handles route changes and updates the page.                                                   |
| _routePageChanged                    | oldRouteData: Record<string, string>                                       | void                | Handles changes to the route page and manages scroll/transition logic.                        |
| loadDataViz                          | -                                                                          | void                | Loads the data visualization dialog.                                                          |
| _pageChanged                         | -                                                                          | void                | Handles logic when the page changes (analytics, etc).                                         |
| openResetPasswordDialog              | resetPasswordToken: string                                                 | void                | Opens the reset password dialog.                                                              |
| openUserNotificationsDialog          | -                                                                          | void                | Opens the user notifications dialog.                                                          |
| openAcceptInvitationDialog           | inviteToken: string                                                        | void                | Opens the accept invitation dialog.                                                           |
| _showPage404                         | -                                                                          | void                | Sets the page to the 404 view.                                                                |
| _setHomeLink                         | event: CustomEvent                                                         | void                | Sets the home link data.                                                                      |
| setKeepOpenForPostsOn                | goBackToPage: string                                                       | void                | Sets the keep open for post modal navigation state.                                           |
| _resetKeepOpenForPage                | -                                                                          | void                | Resets the keep open for page state.                                                          |
| _closeForGroup                       | -                                                                          | void                | Closes the group modal navigation.                                                            |
| _closePost                           | -                                                                          | void                | Closes the post modal navigation.                                                             |
| closePostHeader (getter)             | -                                                                          | boolean             | Returns true if the post header should be closed.                                             |
| _isGroupOpen                         | params: { groupId?: number; postId?: number }, keepOpenForPost?: boolean   | boolean             | Returns true if a group is open.                                                              |
| _isCommunityOpen                     | params: { communityId?: number; postId?: number }, keepOpenForPost?: boolean| boolean            | Returns true if a community is open.                                                          |
| _isDomainOpen                        | params: { domainId?: number; postId?: number }, keepOpenForPost?: boolean  | boolean             | Returns true if a domain is open.                                                             |
| _openNavDrawer                       | -                                                                          | Promise<void>       | Opens the navigation drawer.                                                                  |
| _closeNavDrawer                      | -                                                                          | Promise<void>       | Closes the navigation drawer.                                                                 |
| getDialogAsync                       | idName: string, callback: Function                                         | Promise<void>       | Gets a dialog asynchronously from the dialog container.                                        |
| closeDialog                          | idName: string                                                             | void                | Closes a dialog by ID.                                                                        |
| _dialogClosed                        | event: CustomEvent                                                         | void                | Handles dialog closed events.                                                                 |
| scrollPageToTop                      | -                                                                          | void                | Scrolls the main area to the top.                                                             |
| _openUserDrawer                      | -                                                                          | Promise<void>       | Opens the user drawer.                                                                        |
| _closeUserDrawer                     | -                                                                          | Promise<void>       | Closes the user drawer.                                                                       |
| _openNotificationDrawer              | -                                                                          | Promise<void>       | Opens the notification drawer.                                                                |
| _closeNotificationDrawer             | -                                                                          | Promise<void>       | Closes the notification drawer.                                                               |
| isOnDomainLoginPageAndNotLoggedIn    | -                                                                          | boolean             | Returns true if on the domain login page and not logged in.                                   |
| isOnAgentBundleLoginPageAndNotLoggedIn| -                                                                         | boolean             | Returns true if on the agent bundle login page and not logged in.                             |
| _login                               | -                                                                          | void                | Initiates the login process.                                                                  |
| _onChangeHeader                      | event: CustomEvent                                                         | void                | Handles changes to the header (title, breadcrumbs, etc).                                      |
| updateBreadcrumbs                    | newBreadcrumb: { name: string; url: string }                               | void                | Updates the navigation breadcrumbs.                                                           |
| goBack                               | -                                                                          | void                | Navigates back to the previous page or path.                                                  |
| _onSearch                            | e: CustomEvent                                                             | void                | Handles search events.                                                                        |
| _onUserChanged                       | event: CustomEvent                                                         | void                | Handles user login/logout events.                                                             |
| toggleSearch                         | -                                                                          | void                | Toggles the search UI.                                                                        |
| _handleKeyDown                       | event: KeyboardEvent                                                       | void                | Handles keyboard events (e.g., Escape for closing modals).                                    |
| _setupTouchEvents                    | -                                                                          | void                | Sets up touch event listeners for swipe navigation.                                           |
| _removeTouchEvents                   | -                                                                          | void                | Removes touch event listeners.                                                                |
| _handleTouchStart                    | event: any                                                                 | void                | Handles touch start for swipe navigation.                                                     |
| _handleTouchMove                     | event: any                                                                 | void                | Handles touch move for swipe navigation.                                                      |
| _handleTouchEnd                      | -                                                                          | void                | Handles touch end for swipe navigation.                                                       |

## Examples

```typescript
import { html, render } from "lit";
import "./yp-app.js";

const app = document.createElement("yp-app");
document.body.appendChild(app);

// Access global app state
console.log(window.app.user);

// Programmatically open a help page
window.app.openPageFromId(123);

// Open the user drawer
window.app._openUserDrawer();
```
