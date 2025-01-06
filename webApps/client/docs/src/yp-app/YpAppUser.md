# YpAppUser

The `YpAppUser` class manages user authentication, session management, and user-related actions within the application. It extends the `YpCodeBase` class and interacts with various components and services to handle user login, logout, and session persistence.

## Properties

| Name                             | Type                                                                 | Description                                                                 |
|----------------------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------|
| serverApi                        | YpServerApi                                                          | Instance of the server API for making requests.                             |
| loginForAcceptInviteParams       | { token: string; editDialog: HTMLElement; } \| null                  | Parameters for login when accepting an invite.                              |
| loginForEditParams               | { editDialog: HTMLElement; newOrUpdate: boolean; params: object; refreshFunction: Function; } \| null | Parameters for login when editing.                                          |
| loginForNewPointParams           | { postPointsElement: HTMLElement; params: { value: number; content: string; }; } \| null | Parameters for login when creating a new point.                             |
| loginForEndorseParams            | { postActionElement: HTMLElement; params: { value: number; }; } \| null | Parameters for login when endorsing a post.                                 |
| loginForRatingsParams            | { postActionElement: HTMLElement; } \| null                          | Parameters for login when accessing ratings.                                |
| loginForPointQualityParams       | { pointActionElement: HTMLElement; params: { value: number; }; } \| null | Parameters for login when assessing point quality.                          |
| loginForMembershipParams         | { membershipActionElement: HTMLElement; params: { value: string; content: string; }; } \| null | Parameters for login when managing memberships.                             |
| loginFor401refreshFunction       | Function \| undefined                                                | Function to refresh the session on a 401 error.                             |
| loginForNotificationSettingsParams | boolean                                                             | Flag indicating if login is for notification settings.                      |
| toastLoginTextCombined           | string \| undefined                                                  | Combined text for login toast notifications.                                |
| toastLogoutTextCombined          | string \| undefined                                                  | Combined text for logout toast notifications.                               |
| user                             | YpUserData \| null \| undefined                                      | Current logged-in user data.                                                |
| endorsementPostsIndex            | Record<number, YpEndorsement>                                        | Index of endorsements by post ID.                                           |
| groupCurrentVoteCountIndex       | Record<number, number>                                               | Index of current vote counts by group ID.                                   |
| ratingPostsIndex                 | Record<number, Record<number, YpRatingData>>                         | Index of ratings by post ID and type index.                                 |
| membershipsIndex                 | Record<string, Record<number, boolean>>                              | Index of memberships by type and ID.                                        |
| pointQualitiesIndex              | Record<number, YpPointQuality>                                       | Index of point qualities by point ID.                                       |
| adminRights                      | YpAdminRights \| undefined                                           | Current user's admin rights.                                                |
| promoterRights                   | YpPromoterRights \| undefined                                        | Current user's promoter rights.                                             |
| memberships                      | YpMemberships \| undefined                                           | Current user's memberships.                                                 |
| completeExternalLoginText        | string \| undefined                                                  | Text for completing external login.                                         |
| isPollingForLogin                | boolean                                                              | Flag indicating if polling for login is active.                             |
| lastLoginMethod                  | string \| undefined                                                  | Last method used for login.                                                 |
| facebookPopupWindow              | Window \| null                                                       | Reference to the Facebook login popup window.                               |
| samlPopupWindow                  | Window \| null                                                       | Reference to the SAML login popup window.                                   |
| pollingStartedAt                 | number \| undefined                                                  | Timestamp when polling for login started.                                   |
| hasIssuedLogout                  | boolean                                                              | Flag indicating if a logout has been issued.                                |
| sessionPrefix                    | string                                                               | Prefix for session storage keys.                                            |
| sessionStorage                   | Storage                                                              | Reference to the session storage.                                           |
| browserFingerprint               | string \| undefined                                                  | Browser fingerprint ID.                                                     |
| browserFingerprintConfidence     | number \| undefined                                                  | Confidence score of the browser fingerprint.                                |

## Methods

| Name                             | Parameters                                                                 | Return Type | Description                                                                 |
|----------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| constructor                      | serverApi: YpServerApi, skipRegularInit: boolean = false                   | void        | Initializes a new instance of the YpAppUser class.                          |
| getBrowserId                     |                                                                            | string      | Retrieves or generates a unique browser ID.                                 |
| _setupBrowserFingerprint         |                                                                            | void        | Sets up the browser fingerprint using FingerprintJS.                        |
| _generateRandomString            | length: number                                                             | string \| null | Generates a random string of the specified length.                          |
| sessionHas                       | key: string                                                                | boolean     | Checks if a session key exists.                                             |
| sessionGet                       | key: string                                                                | any         | Retrieves a value from session storage.                                     |
| sessionSet                       | key: string, value: string \| object                                       | void        | Sets a value in session storage.                                            |
| sessionUnset                     | key: string                                                                | void        | Removes a key from session storage.                                         |
| sessionClear                     |                                                                            | void        | Clears all session storage.                                                 |
| loginForAcceptInvite             | editDialog: HTMLElement, token: string, email: string, collectionConfiguration: object \| undefined | void        | Initiates login for accepting an invite.                                    |
| loginForEdit                     | editDialog: HTMLElement, newOrUpdate: boolean, params: object, refreshFunction: Function | void        | Initiates login for editing.                                                |
| loginForNewPoint                 | postPointsElement: HTMLElement, params: { value: number; content: string; } | void        | Initiates login for creating a new point.                                   |
| loginForEndorse                  | postActionElement: HTMLElement, params: { value: number; }                 | void        | Initiates login for endorsing a post.                                       |
| loginForRatings                  | postActionElement: HTMLElement                                             | void        | Initiates login for accessing ratings.                                      |
| loginForPointQuality             | pointActionElement: HTMLElement, params: { value: number; }                | void        | Initiates login for assessing point quality.                                |
| loginForMembership               | membershipActionElement: HTMLElement, params: { value: string; content: string; } | void        | Initiates login for managing memberships.                                   |
| loginFor401                      | refreshFunction: Function                                                  | void        | Initiates login for handling 401 errors.                                    |
| loginForNotificationSettings     |                                                                            | void        | Initiates login for notification settings.                                  |
| openUserlogin                    | email: string \| undefined = undefined, collectionConfiguration: object \| undefined = undefined | void        | Opens the user login dialog.                                                |
| autoAnonymousLogin               |                                                                            | void        | Automatically logs in as an anonymous user if no user is logged in.         |
| _closeUserLogin                  |                                                                            | void        | Closes the user login dialog.                                               |
| _setUserLoginSpinner             |                                                                            | void        | Sets the user login spinner state.                                          |
| _handleLogin                     | user: YpUserData                                                           | void        | Handles user login and updates the session.                                 |
| _checkLoginForParameters         |                                                                            | void        | Checks and handles login parameters for various actions.                    |
| openNotificationSettings         |                                                                            | void        | Opens the notification settings dialog.                                     |
| _forgotPassword                  | event: CustomEvent                                                         | void        | Handles the forgot password event.                                          |
| _resetPassword                   | event: CustomEvent                                                         | void        | Handles the reset password event.                                           |
| getUser                          |                                                                            | any         | Retrieves the current user from session storage.                            |
| setLoggedInUser                  | user: YpUserData                                                           | void        | Sets the logged-in user and updates the session.                            |
| removeAnonymousUser              |                                                                            | void        | Removes the anonymous user session.                                         |
| removeUserSession                |                                                                            | void        | Removes the user session.                                                   |
| loggedIn                         |                                                                            | boolean     | Checks if a user is logged in.                                              |
| setLocale                        | locale: string                                                             | Promise<void> | Sets the user's locale.                                                     |
| cancelLoginPolling               |                                                                            | void        | Cancels the login polling process.                                          |
| _closeAllPopups                  |                                                                            | void        | Closes all open login popups.                                               |
| pollForLogin                     |                                                                            | Promise<void> | Polls the server for login status.                                          |
| startPollingForLogin             |                                                                            | void        | Starts polling for login status.                                            |
| loginFromFacebook                |                                                                            | void        | Handles login from Facebook.                                                |
| loginFromSaml                    |                                                                            | void        | Handles login from SAML.                                                    |
| _completeExternalLogin           | fromString: string                                                         | void        | Completes the external login process.                                       |
| checkLogin                       |                                                                            | void        | Checks the current login status and updates user rights.                    |
| recheckAdminRights               |                                                                            | void        | Rechecks the user's admin rights.                                           |
| getPromoterRights                |                                                                            | Promise<void> | Retrieves the user's promoter rights.                                       |
| updateEndorsementForPost         | postId: number, newEndorsement: YpEndorsement, group: YpGroupData \| undefined = undefined | void        | Updates the endorsement for a specific post.                                |
| calculateVotesLeftForGroup       | group: YpGroupData                                                         | void        | Calculates the remaining votes for a group.                                 |
| _updateEndorsementPostsIndex     | user: YpUserData                                                           | void        | Updates the endorsement posts index.                                        |
| _updateRatingPostsIndex          | user: YpUserData                                                           | void        | Updates the rating posts index.                                             |
| updateRatingForPost              | postId: number, typeIndex: number, newRating: YpRatingData \| undefined    | void        | Updates the rating for a specific post.                                     |
| updatePointQualityForPost        | pointId: number, newPointQuality: YpPointQuality                           | void        | Updates the point quality for a specific post.                              |
| _updatePointQualitiesIndex       | user: YpUserData                                                           | void        | Updates the point qualities index.                                          |
| _onUserChanged                   | event: CustomEvent                                                         | void        | Handles changes to the user data.                                           |
| logout                           |                                                                            | Promise<void> | Logs out the current user and clears the session.                           |
| checkRegistrationAnswersCurrent  |                                                                            | void        | Checks the current user's registration answers.                             |
| setHasRegistrationAnswers        |                                                                            | void        | Sets the flag indicating the user has registration answers.                 |
| _checkRegistrationAnswers        | user: YpUserData                                                           | void        | Checks if the user has completed registration answers.                      |
| isloggedin                       |                                                                            | Promise<void> | Checks if the user is logged in and updates the session accordingly.        |
| getAdminRights                   |                                                                            | Promise<void> | Retrieves the user's admin rights.                                          |
| _updateMembershipsIndex          | memberships: YpMemberships                                                 | void        | Updates the memberships index.                                              |
| getMemberShips                   |                                                                            | Promise<void> | Retrieves the user's memberships.                                           |