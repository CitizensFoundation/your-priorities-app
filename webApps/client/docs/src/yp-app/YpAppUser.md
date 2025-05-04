# YpAppUser

The `YpAppUser` class manages user authentication, session, and rights within the application. It handles login, logout, session storage, user state, and provides methods for updating user-related data such as endorsements, ratings, and memberships. It also manages polling for external login providers and handles registration questions.

## Properties

| Name                              | Type                                                                 | Description                                                                                      |
|----------------------------------- |----------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| serverApi                         | YpServerApi                                                          | The server API instance used for backend communication.                                           |
| loginForAcceptInviteParams         | { token: string; editDialog: HTMLElement; } \| null                  | Parameters for login when accepting an invite.                                                    |
| loginForEditParams                 | { editDialog: HTMLElement; newOrUpdate: boolean; params: object; refreshFunction: Function; } \| null | Parameters for login when editing.                                                                |
| loginForNewPointParams             | { postPointsElement: HTMLElement; params: { value: number; content: string } } \| null | Parameters for login when creating a new point.                                                   |
| loginForEndorseParams              | { postActionElement: HTMLElement; params: { value: number } } \| null | Parameters for login when endorsing a post.                                                       |
| loginForRatingsParams              | { postActionElement: HTMLElement; } \| null                          | Parameters for login when rating a post.                                                          |
| loginForPointQualityParams         | { pointActionElement: HTMLElement; params: { value: number } } \| null | Parameters for login when rating point quality.                                                   |
| loginForMembershipParams           | { membershipActionElement: HTMLElement; params: { value: string; content: string } } \| null | Parameters for login when joining a membership.                                                   |
| loginFor401refreshFunction         | Function \| undefined                                                | Function to call after a 401 (unauthorized) login.                                                |
| loginForNotificationSettingsParams | boolean                                                              | Indicates if login is for notification settings.                                                  |
| toastLoginTextCombined             | string \| undefined                                                  | Combined text for login toast notification.                                                       |
| toastLogoutTextCombined            | string \| undefined                                                  | Combined text for logout toast notification.                                                      |
| user                               | YpUserData \| null \| undefined                                      | The currently logged-in user data.                                                                |
| endorsementPostsIndex              | Record<number, YpEndorsement>                                        | Index of endorsements by post ID.                                                                 |
| groupCurrentVoteCountIndex         | Record<number, number>                                               | Index of current vote counts by group ID.                                                         |
| ratingPostsIndex                   | Record<number, Record<number, YpRatingData>>                         | Index of ratings by post ID and type index.                                                       |
| membershipsIndex                   | Record<string, Record<number, boolean>>                              | Index of memberships by type and ID.                                                              |
| pointQualitiesIndex                | Record<number, YpPointQuality>                                       | Index of point qualities by point ID.                                                             |
| adminRights                        | YpAdminRights \| undefined                                           | The current user's admin rights.                                                                  |
| promoterRights                     | YpPromoterRights \| undefined                                        | The current user's promoter rights.                                                               |
| memberships                        | YpMemberships \| undefined                                           | The current user's memberships.                                                                   |
| completeExternalLoginText          | string \| undefined                                                  | Text to display after completing an external login.                                               |
| isPollingForLogin                  | boolean                                                              | Indicates if polling for login is active.                                                         |
| lastLoginMethod                    | string \| undefined                                                  | The last login method used (e.g., "Facebook", "Saml2").                                           |
| facebookPopupWindow                | Window \| null                                                       | Reference to the Facebook login popup window.                                                     |
| samlPopupWindow                    | Window \| null                                                       | Reference to the SAML login popup window.                                                         |
| pollingStartedAt                   | number \| undefined                                                  | Timestamp when polling for login started.                                                         |
| hasIssuedLogout                    | boolean                                                              | Indicates if logout has been issued.                                                              |
| sessionPrefix                      | string                                                               | Prefix for session storage keys.                                                                  |
| sessionStorage                     | Storage                                                              | The session storage object (usually window.localStorage).                                         |
| browserFingerprint                 | string \| undefined                                                  | The browser fingerprint ID.                                                                       |
| browserFingerprintConfidence       | number \| undefined                                                  | Confidence score of the browser fingerprint.                                                      |

## Methods

| Name                              | Parameters                                                                                                         | Return Type         | Description                                                                                                 |
|------------------------------------|--------------------------------------------------------------------------------------------------------------------|---------------------|-------------------------------------------------------------------------------------------------------------|
| constructor                       | serverApi: YpServerApi, skipRegularInit?: boolean                                                                  | void                | Initializes the YpAppUser instance.                                                                         |
| getBrowserId                       |  | string \| null         | Retrieves or generates a unique browser ID.                                                                    |
| _setupBrowserFingerprint           |  | void                | Sets up the browser fingerprint using FingerprintJS.                                                           |
| _generateRandomString              | length: number                                                                                                    | string \| null       | Generates a random string of the specified length.                                                          |
| sessionHas                         | key: string                                                                                                       | boolean              | Checks if a session key exists.                                                                             |
| sessionGet                         | key: string                                                                                                       | any                  | Retrieves a value from session storage.                                                                     |
| sessionSet                         | key: string, value: string \| object                                                                              | void                 | Sets a value in session storage.                                                                            |
| sessionUnset                       | key: string                                                                                                       | void                 | Removes a value from session storage.                                                                       |
| sessionClear                       |  | void                | Clears all session storage.                                                                                    |
| loginForAcceptInvite               | editDialog: HTMLElement, token: string, email: string, collectionConfiguration: object \| undefined               | void                 | Initiates login for accepting an invite.                                                                    |
| loginForEdit                       | editDialog: HTMLElement, newOrUpdate: boolean, params: object, refreshFunction: Function                          | void                 | Initiates login for editing.                                                                                |
| loginForNewPoint                   | postPointsElement: HTMLElement, params: { value: number; content: string }                                        | void                 | Initiates login for creating a new point.                                                                   |
| loginForEndorse                    | postActionElement: HTMLElement, params: { value: number }                                                         | void                 | Initiates login for endorsing a post.                                                                       |
| loginForRatings                    | postActionElement: HTMLElement                                                                                   | void                 | Initiates login for rating a post.                                                                          |
| loginForPointQuality               | pointActionElement: HTMLElement, params: { value: number }                                                        | void                 | Initiates login for rating point quality.                                                                   |
| loginForMembership                 | membershipActionElement: HTMLElement, params: { value: string; content: string }                                  | void                 | Initiates login for joining a membership.                                                                   |
| loginFor401                        | refreshFunction: Function \| undefined                                                                            | void                 | Initiates login after a 401 (unauthorized) error.                                                           |
| loginForNotificationSettings       |  | void                | Initiates login for notification settings.                                                                      |
| openUserlogin                      | email?: string, collectionConfiguration?: object                                                                  | void                 | Opens the user login dialog.                                                                                |
| autoAnonymousLogin                 |  | void                | Automatically logs in as an anonymous user if no user is logged in.                                             |
| _closeUserLogin                    |  | void                | Closes the user login dialog.                                                                                   |
| _setUserLoginSpinner               |  | void                | Sets the user login spinner to false.                                                                           |
| _handleLogin                       | user: YpUserData                                                                                                 | void                 | Handles user login and updates user state.                                                                  |
| _checkLoginForParameters           |  | void                | Checks and processes login parameters for various login scenarios.                                              |
| openNotificationSettings           |  | void                | Opens the notification settings dialog.                                                                         |
| _forgotPassword                    | event: CustomEvent                                                                                               | void                 | Handles the forgot password event.                                                                           |
| _resetPassword                     | event: CustomEvent                                                                                               | void                 | Handles the reset password event.                                                                            |
| setLoggedInUser                    | user: YpUserData                                                                                                | void                 | Sets the logged-in user and updates global state.                                                           |
| removeAnonymousUser                |  | void                | Removes the anonymous user session.                                                                             |
| removeUserSession                  |  | void                | Removes the user session and updates global state.                                                              |
| loggedIn                           |  | boolean             | Checks if a user is logged in and has the correct provider/agency.                                              |
| setLocale                          | locale: string                                                                                                   | Promise<void>        | Sets the user's locale via the server API.                                                                   |
| cancelLoginPolling                 |  | void                | Cancels polling for login.                                                                                      |
| _closeAllPopups                    |  | void                | Closes all external login popups (Facebook, SAML).                                                             |
| pollForLogin                       |  | Promise<void>        | Polls the server to check if the user has logged in via an external provider.                                   |
| startPollingForLogin               |  | void                | Starts polling for login.                                                                                       |
| loginFromFacebook                  |  | void                | Handles login from Facebook.                                                                                    |
| loginFromSaml                      |  | void                | Handles login from SAML.                                                                                        |
| _completeExternalLogin             | fromString: string                                                                                               | void                 | Completes the external login process.                                                                        |
| checkLogin                         |  | void                | Checks the current login state and updates rights/memberships.                                                  |
| recheckAdminRights                 |  | void                | Rechecks admin and promoter rights.                                                                             |
| getPromoterRights                  |  | Promise<void>        | Retrieves the user's promoter rights from the server.                                                           |
| updateEndorsementForPost           | postId: number, newEndorsement: YpEndorsement, group?: YpGroupData                                              | void                 | Updates the endorsement for a post and recalculates votes if needed.                                         |
| calculateVotesLeftForGroup         | group: YpGroupData                                                                                               | void                 | Calculates the number of votes left for a group and shows a toast if changed.                                |
| _updateEndorsementPostsIndex       | user: YpUserData                                                                                                | void                 | Updates the endorsement posts index for the user.                                                            |
| _updateRatingPostsIndex            | user: YpUserData                                                                                                | void                 | Updates the rating posts index for the user.                                                                 |
| updateRatingForPost                | postId: number, typeIndex: number, newRating: YpRatingData \| undefined                                         | void                 | Updates the rating for a post and type index.                                                                |
| updatePointQualityForPost          | pointId: number, newPointQuality: YpPointQuality                                                                | void                 | Updates the point quality for a post.                                                                        |
| _updatePointQualitiesIndex         | user: YpUserData                                                                                                | void                 | Updates the point qualities index for the user.                                                              |
| _onUserChanged                     | event: CustomEvent                                                                                              | void                 | Handles user change events and updates indices.                                                              |
| logout                             |  | Promise<void>        | Logs out the user and reloads the page.                                                                         |
| checkRegistrationAnswersCurrent    |  | void                | Checks if the current user has answered registration questions.                                                 |
| setHasRegistrationAnswers          |  | void                | Sets the flag indicating the user has answered registration questions.                                          |
| _checkRegistrationAnswers          | user: YpUserData                                                                                                | void                 | Checks if the user needs to answer registration questions and opens the dialog if needed.                    |
| isloggedin                         |  | Promise<void>        | Checks if the user is logged in and updates user state accordingly.                                             |
| getAdminRights                     |  | Promise<void>        | Retrieves the user's admin rights from the server.                                                              |
| _updateMembershipsIndex            | memberships: YpMemberships                                                                                      | void                 | Updates the memberships index for the user.                                                                  |
| getMemberShips                     |  | Promise<void>        | Retrieves the user's memberships from the server.                                                               |

## Events

- **yp-forgot-password**: Emitted when the user initiates a forgot password action.
- **yp-reset-password**: Emitted when the user initiates a reset password action.
- **yp-logged-in**: Emitted when the user logs in.
- **yp-got-admin-rights**: Emitted when admin rights are retrieved.
- **yp-got-promoter-rights**: Emitted when promoter rights are retrieved.
- **yp-got-memberships**: Emitted when memberships are retrieved.
- **got-endorsements-and-qualities**: Emitted when endorsements and qualities are updated.
- **yp-open-toast**: Emitted to show a toast notification.
- **yp-close-right-drawer**: Emitted to close the right drawer.
- **yp-registration-questions-done**: Emitted when registration questions are completed.
- **yp-have-checked-admin-rights**: Emitted after admin rights have been checked.
- **yp-logged-in-via-polling**: Emitted when the user logs in via polling.

## Examples

```typescript
import { YpAppUser } from './YpAppUser';
import { YpServerApi } from '../common/YpServerApi';

const serverApi = new YpServerApi();
const appUser = new YpAppUser(serverApi);

// Check if user is logged in
appUser.checkLogin();

// Log in for editing
appUser.loginForEdit(editDialogElement, true, { some: 'param' }, () => {
  // Refresh logic
});

// Log out the user
await appUser.logout();
```
