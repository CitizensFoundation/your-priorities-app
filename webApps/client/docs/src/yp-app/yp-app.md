# YpApp

The `YpApp` class is a LitElement-based web component that serves as the main application container for a web application. It manages the application's state, navigation, and user interactions, and integrates with various other components and services.

## Properties

| Name                          | Type                                      | Description                                                                 |
|-------------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| homeLink                      | YpHomeLinkData \| undefined               | The home link data for the application.                                     |
| page                          | string \| undefined                       | The current page being displayed.                                           |
| scrollPosition                | number                                    | The current scroll position of the window.                                  |
| appMode                       | YpAppModes                                | The current mode of the application (e.g., "main", "admin").                |
| user                          | YpUserData \| undefined                   | The current user data.                                                      |
| backPath                      | string \| undefined                       | The path to navigate back to.                                               |
| showSearch                    | boolean                                   | Whether the search functionality is visible.                                |
| showBack                      | boolean                                   | Whether the back button is visible.                                         |
| loadingAppSpinner             | boolean                                   | Whether the loading spinner is visible.                                     |
| forwardToPostId               | string \| undefined                       | The ID of the post to forward to.                                           |
| headerTitle                   | string \| undefined                       | The title of the header.                                                    |
| numberOfUnViewedNotifications | string \| undefined                       | The number of unviewed notifications.                                       |
| hideHelpIcon                  | boolean                                   | Whether the help icon is hidden.                                            |
| autoTranslate                 | boolean                                   | Whether auto-translation is enabled.                                        |
| languageName                  | string \| undefined                       | The name of the current language.                                           |
| goForwardToPostId             | number \| undefined                       | The ID of the post to go forward to.                                        |
| showBackToPost                | boolean                                   | Whether the back to post button is visible.                                 |
| goForwardPostName             | string \| undefined                       | The name of the post to go forward to.                                      |
| pages                         | Array<YpHelpPageData>                     | The list of help pages.                                                     |
| headerDescription             | string \| undefined                       | The description of the header.                                              |
| notifyDialogHeading           | string \| undefined                       | The heading of the notification dialog.                                     |
| notifyDialogText              | string \| undefined                       | The text of the notification dialog.                                        |
| route                         | string                                    | The current route of the application.                                       |
| subRoute                      | string \| undefined                       | The sub-route of the current route.                                         |
| currentTitle                  | string \| undefined                       | The current title of the application.                                       |
| routeData                     | Record<string, string>                    | The data associated with the current route.                                 |
| userDrawerOpened              | boolean                                   | Whether the user drawer is opened.                                          |
| navDrawerOpened               | boolean                                   | Whether the navigation drawer is opened.                                    |
| notificationDrawerOpened      | boolean                                   | Whether the notification drawer is opened.                                  |
| currentTheme                  | YpThemeConfiguration \| undefined         | The current theme configuration.                                            |
| keepOpenForPost               | string \| undefined                       | The path to keep open for a post.                                           |
| keepOpenForGroup              | string \| undefined                       | The path to keep open for a group.                                          |
| breadcrumbs                   | Array<{ name: string; url: string }>      | The list of breadcrumbs for navigation.                                     |
| anchor                        | HTMLElement \| null                       | The anchor element for certain operations.                                  |
| previousSearches              | Array<string>                             | The list of previous search queries.                                        |
| storedBackPath                | string \| undefined                       | The stored back path for navigation.                                        |
| storedLastDocumentTitle       | string \| undefined                       | The stored last document title.                                             |
| useHardBack                   | boolean                                   | Whether to use hard back navigation.                                        |
| _scrollPositionMap            | Record<string, number>                    | A map of scroll positions for different pages.                              |
| goBackToPostId                | number \| undefined                       | The ID of the post to go back to.                                           |
| currentPostId                 | number \| undefined                       | The ID of the current post.                                                 |
| goForwardCount                | number                                    | The count of forward navigations.                                           |
| firstLoad                     | boolean                                   | Whether it is the first load of the application.                            |
| communityBackOverride         | Record<string, Record<string, string>> \| undefined | Overrides for community back navigation.                                    |
| touchXDown                    | number \| undefined                       | The X coordinate of the touch start event.                                  |
| touchYDown                    | number \| undefined                       | The Y coordinate of the touch start event.                                  |
| touchXUp                      | number \| undefined                       | The X coordinate of the touch end event.                                    |
| touchYUp                      | number \| undefined                       | The Y coordinate of the touch end event.                                    |
| userDrawerOpenedDelayed       | boolean                                   | Whether the user drawer is opened with a delay.                             |
| navDrawOpenedDelayed          | boolean                                   | Whether the navigation drawer is opened with a delay.                       |
| haveLoadedAdminApp            | boolean                                   | Whether the admin app has been loaded.                                      |
| haveLoadedPromotionApp        | boolean                                   | Whether the promotion app has been loaded.                                  |

## Methods

| Name                          | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| constructor                   | -                                                                          | -           | Initializes the YpApp instance and sets up global variables and event listeners. |
| setupAppGlobals               | -                                                                          | void        | Sets up the application globals.                                            |
| connectedCallback             | -                                                                          | void        | Called when the element is added to the document's DOM.                     |
| disconnectedCallback          | -                                                                          | void        | Called when the element is removed from the document's DOM.                 |
| _handleScroll                 | -                                                                          | void        | Handles the scroll event and updates the scroll position.                   |
| updated                       | changedProperties: Map<string \| number \| symbol, unknown>                | Promise<void> | Called when the element's properties have changed.                          |
| _navDrawOpened                | event: CustomEvent                                                         | void        | Handles the navigation drawer opened event.                                 |
| _languageLoaded               | -                                                                          | void        | Handles the language loaded event.                                          |
| _ypError                      | event: CustomEvent                                                         | void        | Handles the YP error event.                                                 |
| _netWorkError                 | event: CustomEvent                                                         | void        | Handles the network error event.                                            |
| _setupEventListeners          | -                                                                          | void        | Sets up the event listeners for the application.                            |
| _themeUpdated                 | event: CustomEvent                                                         | void        | Handles the theme updated event.                                            |
| _removeEventListeners         | -                                                                          | void        | Removes the event listeners for the application.                            |
| static get styles             | -                                                                          | CSSResult[] | Returns the styles for the component.                                       |
| _haveCopiedNotification       | -                                                                          | void        | Handles the copied notification event.                                      |
| _appDialogsReady              | event: CustomEvent                                                         | void        | Handles the app dialogs ready event.                                        |
| get hasStaticBadgeTheme       | -                                                                          | boolean     | Returns whether the badge theme is static.                                  |
| updateLocation                | -                                                                          | void        | Updates the location based on the current URL.                              |
| _openUserEdit                 | -                                                                          | void        | Opens the user edit dialog.                                                 |
| get isFullScreenMode          | -                                                                          | boolean     | Returns whether the application is in full screen mode.                     |
| renderNavigationIcon          | -                                                                          | TemplateResult | Renders the navigation icon.                                                |
| renderNavigation              | -                                                                          | TemplateResult | Renders the navigation elements.                                            |
| _openHelpMenu                 | -                                                                          | void        | Opens the help menu.                                                        |
| renderNonArrowNavigation      | -                                                                          | TemplateResult | Renders the non-arrow navigation elements.                                  |
| renderActionItems             | -                                                                          | TemplateResult | Renders the action items in the top bar.                                    |
| renderTopBar                  | -                                                                          | TemplateResult | Renders the top bar of the application.                                     |
| renderMainApp                 | -                                                                          | TemplateResult | Renders the main application content.                                       |
| renderGroupPage               | -                                                                          | TemplateResult | Renders the group page content.                                             |
| renderPage                    | -                                                                          | TemplateResult | Renders the current page content.                                           |
| renderDrawers                 | -                                                                          | TemplateResult | Renders the drawers for navigation and notifications.                       |
| renderFooter                  | -                                                                          | TemplateResult | Renders the footer of the application.                                      |
| renderAdminApp                | -                                                                          | TemplateResult | Renders the admin application content.                                      |
| renderPromotionApp            | -                                                                          | TemplateResult | Renders the promotion application content.                                  |
| render                        | -                                                                          | TemplateResult | Renders the entire application.                                             |
| _openNotifyDialog             | event: CustomEvent                                                         | void        | Opens the notification dialog.                                              |
| _openToast                    | event: CustomEvent                                                         | void        | Opens the toast notification.                                               |
| _resetNotifyDialogText        | -                                                                          | void        | Resets the notification dialog text.                                        |
| translatedPages               | pages: Array<YpHelpPageData>                                               | Array<YpHelpPageData> | Returns a translated copy of the pages.                                     |
| openPageFromId                | pageId: number                                                             | void        | Opens a page by its ID.                                                     |
| _openPageFromMenu             | event: Event                                                               | void        | Opens a page from the menu.                                                 |
| _openPage                     | page: YpHelpPageData                                                       | void        | Opens a specific page.                                                      |
| _getPageLocale                | page: YpHelpPageData                                                       | string      | Returns the locale of a page.                                               |
| _getLocalizePageTitle         | page: YpHelpPageData                                                       | string      | Returns the localized title of a page.                                      |
| _setPages                     | event: CustomEvent                                                         | void        | Sets the pages property from an event.                                      |
| _addBackCommunityOverride     | event: CustomEvent                                                         | void        | Adds a back community override from an event.                               |
| _goToNextPost                 | -                                                                          | void        | Navigates to the next post.                                                 |
| _goToPreviousPost             | -                                                                          | void        | Navigates to the previous post.                                             |
| _setNextPost                  | event: CustomEvent                                                         | void        | Sets the next post from an event.                                           |
| _clearNextPost                | -                                                                          | void        | Clears the next post data.                                                  |
| _setupSamlCallback            | -                                                                          | void        | Sets up the SAML callback for authentication.                               |
| _openPageFromEvent            | event: CustomEvent                                                         | void        | Opens a page from an event.                                                 |
| openUserInfoPage              | pageId: number                                                             | void        | Opens a user info page by its ID.                                           |
| _setLanguageName              | event: CustomEvent                                                         | void        | Sets the language name from an event.                                       |
| _autoTranslateEvent           | event: CustomEvent                                                         | void        | Handles the auto-translate event.                                           |
| _refreshGroup                 | -                                                                          | Promise<void> | Refreshes the group data.                                                   |
| _refreshCommunity             | -                                                                          | Promise<void> | Refreshes the community data.                                               |
| _refreshDomain                | -                                                                          | void        | Refreshes the domain data.                                                  |
| _refreshByName                | id: string                                                                 | Promise<void> | Refreshes a collection by its ID.                                           |
| _setNumberOfUnViewedNotifications | event: CustomEvent                                                     | void        | Sets the number of unviewed notifications from an event.                    |
| _redirectTo                   | event: CustomEvent                                                         | void        | Redirects to a path from an event.                                          |
| _routeChanged                 | -                                                                          | void        | Handles changes to the route.                                               |
| _routePageChanged             | oldRouteData: Record<string, string>                                       | void        | Handles changes to the route page.                                          |
| loadDataViz                   | -                                                                          | void        | Loads the data visualization component.                                     |
| _pageChanged                  | -                                                                          | void        | Handles changes to the page.                                                |
| openResetPasswordDialog       | resetPasswordToken: string                                                 | void        | Opens the reset password dialog.                                            |
| openUserNotificationsDialog   | -                                                                          | void        | Opens the user notifications dialog.                                        |
| openAcceptInvitationDialog    | inviteToken: string                                                        | void        | Opens the accept invitation dialog.                                         |
| _showPage404                  | -                                                                          | void        | Shows the 404 page.                                                         |
| _setHomeLink                  | event: CustomEvent                                                         | void        | Sets the home link from an event.                                           |
| setKeepOpenForPostsOn         | goBackToPage: string                                                       | void        | Sets the keep open for posts on a specific page.                            |
| _resetKeepOpenForPage         | -                                                                          | void        | Resets the keep open for page data.                                         |
| _closeForGroup                | -                                                                          | void        | Closes the group view.                                                      |
| _closePost                    | -                                                                          | void        | Closes the post view.                                                       |
| get closePostHeader           | -                                                                          | boolean     | Returns whether the post header is closed.                                  |
| _isGroupOpen                  | params: { groupId?: number; postId?: number }, keepOpenForPost: boolean     | boolean     | Returns whether a group is open.                                            |
| _isCommunityOpen              | params: { communityId?: number; postId?: number }, keepOpenForPost: boolean | boolean     | Returns whether a community is open.                                        |
| _isDomainOpen                 | params: { domainId?: number; postId?: number }, keepOpenForPost: boolean    | boolean     | Returns whether a domain is open.                                           |
| _openNavDrawer                | -                                                                          | Promise<void> | Opens the navigation drawer.                                                |
| _closeNavDrawer               | -                                                                          | Promise<void> | Closes the navigation drawer.                                               |
| getDialogAsync                | idName: string, callback: Function                                         | Promise<void> | Gets a dialog asynchronously.                                               |
| closeDialog                   | idName: string                                                             | void        | Closes a dialog by its ID.                                                  |
| _dialogClosed                 | event: CustomEvent                                                         | void        | Handles the dialog closed event.                                            |
| scrollPageToTop               | -                                                                          | void        | Scrolls the page to the top.                                                |
| _openUserDrawer               | -                                                                          | Promise<void> | Opens the user drawer.                                                      |
| _closeUserDrawer              | -                                                                          | Promise<void> | Closes the user drawer.                                                     |
| _openNotificationDrawer       | -                                                                          | Promise<void> | Opens the notification drawer.                                              |
| _closeNotificationDrawer      | -                                                                          | Promise<void> | Closes the notification drawer.                                             |
| get isOnDomainLoginPageAndNotLoggedIn | -                                                                  | boolean     | Returns whether the user is on the domain login page and not logged in.     |
| _login                        | -                                                                          | void        | Initiates the login process.                                                |
| _onChangeHeader               | event: CustomEvent                                                         | void        | Handles changes to the header.                                              |
| updateBreadcrumbs             | newBreadcrumb: { name: string; url: string }                               | void        | Updates the breadcrumbs for navigation.                                     |
| goBack                        | -                                                                          | void        | Navigates back to the previous page.                                        |
| _onSearch                     | e: CustomEvent                                                             | void        | Handles the search event.                                                   |
| _onUserChanged                | event: CustomEvent                                                         | void        | Handles changes to the user data.                                           |
| toggleSearch                  | -                                                                          | void        | Toggles the search functionality.                                           |
| _handleKeyDown                | event: KeyboardEvent                                                       | void        | Handles the key down event.                                                 |
| _setupTouchEvents             | -                                                                          | void        | Sets up touch events for the application.                                   |
| _removeTouchEvents            | -                                                                          | void        | Removes touch events for the application.                                   |
| _handleTouchStart             | event: any                                                                 | void        | Handles the touch start event.                                              |
| _handleTouchMove              | event: any                                                                 | void        | Handles the touch move event.                                               |
| _handleTouchEnd               | -                                                                          | void        | Handles the touch end event.                                                |

## Examples

```typescript
// Example usage of the YpApp component
import { html, LitElement } from "lit";
import "./yp-app.js";

class MyApp extends LitElement {
  render() {
    return html`
      <yp-app></yp-app>
    `;
  }
}

customElements.define("my-app", MyApp);
```