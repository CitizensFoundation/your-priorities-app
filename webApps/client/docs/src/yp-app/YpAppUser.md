# YpAppUser

The `YpAppUser` class manages user-related operations such as login, logout, session management, and user data within the application. It extends the `YpCodeBase` class and interacts with the server API to perform user authentication, retrieve user data, and handle user sessions.

## Properties

| Name                                  | Type                                      | Description                                                                 |
|---------------------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| serverApi                             | YpServerApi                               | The server API instance used for making API calls.                          |
| loginForAcceptInviteParams            | { token: string; editDialog: HTMLElement; } \| null | Parameters for login related to accepting an invite.                        |
| loginForEditParams                    | { editDialog: HTMLElement; newOrUpdate: boolean; params: object; refreshFunction: Function; } \| null | Parameters for login related to editing content.                            |
| loginForNewPointParams                | { postPointsElement: HTMLElement; params: { value: number; content: string; }; } \| null | Parameters for login related to creating a new point.                      |
| loginForEndorseParams                 | { postActionElement: HTMLElement; params: { value: number; }; } \| null | Parameters for login related to endorsing a post.                           |
| loginForRatingsParams                 | { postActionElement: HTMLElement; } \| null | Parameters for login related to rating a post.                              |
| loginForPointQualityParams            | { pointActionElement: HTMLElement; params: { value: number; }; } \| null | Parameters for login related to point quality.                              |
| loginForMembershipParams              | { membershipActionElement: HTMLElement; params: { value: string; content: string; }; } \| null | Parameters for login related to membership actions.                         |
| loginFor401refreshFunction            | Function \| undefined                     | Function to refresh the page after a 401 unauthorized error.                |
| loginForNotificationSettingsParams    | boolean                                   | Indicates if login is for notification settings.                            |
| toastLoginTextCombined                | string \| undefined                       | Combined text for login toast notification.                                 |
| toastLogoutTextCombined               | string \| undefined                       | Combined text for logout toast notification.                                |
| user                                  | YpUserData \| null \| undefined           | The current logged-in user data.                                            |
| endorsementPostsIndex                 | Record<number, YpEndorsement>             | Index of endorsement posts by user.                                         |
| groupCurrentVoteCountIndex            | Record<number, number>                    | Index of current vote counts for groups.                                    |
| ratingPostsIndex                      | Record<number, Record<number, YpRatingData>> | Index of rating posts by user.                                              |
| membershipsIndex                      | Record<string, Record<number, boolean>>   | Index of memberships by user.                                               |
| pointQualitiesIndex                   | Record<number, YpPointQuality>            | Index of point qualities by user.                                           |
| adminRights                           | YpAdminRights \| undefined                | Admin rights of the current user.                                           |
| promoterRights                        | YpPromoterRights \| undefined             | Promoter rights of the current user.                                        |
| memberships                           | YpMemberships \| undefined                | Memberships of the current user.                                            |
| completeExternalLoginText             | string \| undefined                       | Text to display after completing an external login.                         |
| isPollingForLogin                     | boolean                                   | Indicates if the app is currently polling for login status.                 |
| lastLoginMethod                       | string \| undefined                       | The last method used for login.                                             |
| facebookPopupWindow                   | Window \| null                            | Reference to the Facebook login popup window.                               |
| samlPopupWindow                       | Window \| null                            | Reference to the SAML login popup window.                                   |
| pollingStartedAt                      | number \| undefined                       | Timestamp when polling for login started.                                   |
| hasIssuedLogout                       | boolean                                   | Indicates if a logout has been issued.                                      |
| sessionPrefix                         | string                                    | Prefix used for session storage keys.                                       |
| sessionStorage                        | Storage                                   | Reference to the window's local storage for session management.             |
| browserFingerprint                    | string \| undefined                       | The browser's fingerprint ID.                                               |
| browserFingerprintConfidence          | number \| undefined                       | Confidence score of the browser's fingerprint.                              |

## Methods

| Name                          | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| getBrowserId                  |                                                                            | string      | Retrieves the browser ID from local storage or generates a new one.         |
| _setupBrowserFingerprint      |                                                                            | void        | Sets up the browser fingerprint using FingerprintJS.                        |
| _generateRandomString         | length: number                                                             | string \| null | Generates a random string of the specified length.                          |
| sessionHas                    | key: string                                                                | boolean     | Checks if a session key exists in storage.                                  |
| sessionGet                    | key: string                                                                | any         | Retrieves a session value from storage.                                     |
| sessionSet                    | key: string, value: string \| object                                       | void        | Sets a session value in storage.                                            |
| sessionUnset                  | key: string                                                                | void        | Removes a session key from storage.                                         |
| sessionClear                  |                                                                            | void        | Clears all session data from storage.                                       |
| loginForAcceptInvite          | editDialog: HTMLElement, token: string, email: string, collectionConfiguration: object \| undefined | void        | Handles login for accepting an invite.                                      |
| loginForEdit                  | editDialog: HTMLElement, newOrUpdate: boolean, params: object, refreshFunction: Function | void        | Handles login for editing content.                                          |
| loginForNewPoint              | postPointsElement: HTMLElement, params: { value: number; content: string; } | void        | Handles login for creating a new point.                                     |
| loginForEndorse               | postActionElement: HTMLElement, params: { value: number; }                  | void        | Handles login for endorsing a post.                                         |
| loginForRatings               | postActionElement: HTMLElement                                              | void        | Handles login for rating a post.                                            |
| loginForPointQuality          | pointActionElement: HTMLElement, params: { value: number; }                 | void        | Handles login for point quality actions.                                    |
| loginForMembership            | membershipActionElement: HTMLElement, params: { value: string; content: string; } | void        | Handles login for membership actions.                                       |
| loginFor401                   | refreshFunction: Function                                                   | void        | Handles login for a 401 unauthorized error.                                 |
| loginForNotificationSettings  |                                                                            | void        | Handles login for notification settings.                                    |
| openUserlogin                 | email: string \| undefined, collectionConfiguration: object \| undefined    | void        | Opens the user login dialog.                                                |
| autoAnonymousLogin            |                                                                            | void        | Automatically logs in an anonymous user.                                    |
| _closeUserLogin               |                                                                            | void        | Closes the user login dialog.                                               |
| _setUserLoginSpinner          |                                                                            | void        | Sets the spinner state for the user login dialog.                           |
| _handleLogin                  | user: YpUserData                                                           | void        | Handles the user login process.                                             |
| _checkLoginForParameters      |                                                                            | void        | Checks for any pending login parameters and processes them.                 |
| openNotificationSettings      |                                                                            | void        | Opens the notification settings dialog.                                     |
| _forgotPassword               | event: CustomEvent                                                         | void        | Handles the forgot password process.                                        |
| _resetPassword                | event: CustomEvent                                                         | void        | Handles the reset password process.                                         |
| getUser                       |                                                                            | YpUserData \| null | Retrieves the current user from session storage.                            |
| setLoggedInUser               | user: YpUserData                                                           | void        | Sets the current logged-in user and updates session storage.                |
| removeAnonymousUser           |                                                                            | void        | Removes the anonymous user from session storage.                            |
| removeUserSession             |                                                                            | void        | Removes the user session from storage.                                      |
| loggedIn                      |                                                                            | boolean     | Checks if the user is currently logged in.                                  |
| setLocale                     | locale: string                                                             | Promise<void> | Sets the user's locale on the server.                                       |
| cancelLoginPolling            |                                                                            | void        | Cancels the login polling process.                                          |
| _closeAllPopups               |                                                                            | void        | Closes all popup windows related to login.                                  |
| pollForLogin                  |                                                                            | Promise<void> | Polls the server to check if the user is logged in.                         |
| startPollingForLogin          |                                                                            | void        | Starts the polling process for login.                                       |
| loginFromFacebook             |                                                                            | void        | Handles the login process from Facebook.                                    |
| loginFromSaml                 |                                                                            | void        | Handles the login process from SAML.                                        |
| _completeExternalLogin        | fromString: string                                                         | void        | Completes the external login process and displays a notification.           |
| checkLogin                    |                                                                            | void        | Checks the current login status and retrieves user data.                    |
| recheckAdminRights            |                                                                            | void        | Rechecks the admin and promoter rights for the current user.                |
| getPromoterRights             |                                                                            | Promise<void> | Retrieves the promoter rights for the current user.                         |
| updateEndorsementForPost      | postId: number, newEndorsement: YpEndorsement, group: YpGroupData \| undefined | void        | Updates the endorsement for a post.                                         |
| calculateVotesLeftForGroup    | group: YpGroupData                                                         | void        | Calculates the remaining votes for a group.                                 |
| _updateEndorsementPostsIndex  | user: YpUserData                                                           | void        | Updates the index of endorsement posts.                                     |
| _updateRatingPostsIndex       | user: YpUserData                                                           | void        | Updates the index of rating posts.                                          |
| updateRatingForPost           | postId: number, typeIndex: number, newRating: YpRatingData \| undefined    | void        | Updates the rating for a post.                                              |
| updatePointQualityForPost     | pointId: number, newPointQuality: YpPointQuality                           | void        | Updates the point quality for a post.                                       |
| _updatePointQualitiesIndex    | user: YpUserData                                                           | void        | Updates the index of point qualities.                                       |
| _onUserChanged                | user: YpUserData \| null                                                   | void        | Handles changes to the current user.                                        |
| logout                        |                                                                            | Promise<void> | Logs out the current user and updates the session.                          |
| checkRegistrationAnswersCurrent |                                                                            | void        | Checks if the current user has answered registration questions.             |
| setHasRegistrationAnswers     |                                                                            | void        | Sets the flag indicating the user has answered registration questions.      |
| _checkRegistrationAnswers     | user: YpUserData                                                           | void        | Checks if the user needs to answer registration questions.                  |
| isloggedin                    |                                                                            | Promise<void> | Checks if the user is logged in and updates the session accordingly.        |
| getAdminRights                |                                                                            | Promise<void> | Retrieves the admin rights for the current user.                            |
| _updateMembershipsIndex       | memberships: YpMemberships                                                 | void        | Updates the index of memberships.                                           |
| getMemberShips                |                                                                            | Promise<void> | Retrieves the memberships for the current user.                             |

## Events (if any)

- **yp-forgot-password**: Emitted when the user requests to reset their password.
- **yp-reset-password**: Emitted when the user is resetting their password.
- **yp-logged-in**: Emitted when the user successfully logs in.
- **yp-logged-in-via-polling**: Emitted when the user is logged in via polling.
- **yp-open-toast**: Emitted to display a toast notification.
- **yp-close-right-drawer**: Emitted to close the right drawer in the UI.
- **yp-got-promoter-rights**: Emitted when promoter rights are retrieved.
- **yp-got-admin-rights**: Emitted when admin rights are retrieved.
- **yp-have-checked-admin-rights**: Emitted after checking for admin rights.
- **yp-got-memberships**: Emitted when memberships are retrieved.
- **yp-registration-questions-done**: Emitted when registration questions are completed or not required.

## Examples

```typescript
// Example usage of the YpAppUser class
const serverApi = new YpServerApi();
const ypAppUser = new YpAppUser(serverApi);

// Check if the user is logged in
if (ypAppUser.loggedIn()) {
  console.log('User is logged in:', ypAppUser.user);
}

// Log in the user for a specific action
ypAppUser.loginForEdit(someEditDialogElement, true, { someParam: 'value' }, () => {
  console.log('Refresh function after login');
});

// Log out the user
ypAppUser.logout().then(() => {
  console.log('User has been logged out');
});
```
