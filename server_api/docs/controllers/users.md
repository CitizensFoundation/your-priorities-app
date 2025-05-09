# Express Router: User API (`routes/user.cjs`)

This file defines the main user-related API endpoints for authentication, registration, user profile management, moderation, password reset, invite handling, and third-party authentication (OAuth/SAML/OIDC) in the application. It uses Express.js, Sequelize models, and various utility modules.

---

## Table of Contents

- [Authentication & Session](#authentication--session)
  - [POST /login](#api-endpoint-post-login)
  - [POST /logout](#api-endpoint-post-logout)
  - [GET /loggedInUser/isloggedin](#api-endpoint-get-loggedinuserisloggedin)
- [Registration](#registration)
  - [POST /register](#api-endpoint-post-register)
  - [POST /register_anonymously](#api-endpoint-post-register_anonymously)
  - [PUT /setRegistrationAnswers](#api-endpoint-put-setregistrationanswers)
- [User Profile & Management](#user-profile--management)
  - [PUT /:id](#api-endpoint-put-id)
  - [GET /:id](#api-endpoint-get-id)
  - [DELETE /delete_current_user](#api-endpoint-delete-delete_current_user)
  - [DELETE /anonymize_current_user](#api-endpoint-delete-anonymize_current_user)
  - [PUT /loggedInUser/setLocale](#api-endpoint-put-loggedinusersetlocale)
- [Moderation](#moderation)
  - [DELETE /:userId/:itemId/:itemType/:actionType/process_one_moderation_item](#api-endpoint-delete-useriditemiditemtypeactiontypeprocess_one_moderation_item)
  - [DELETE /:userId/:actionType/process_many_moderation_item](#api-endpoint-delete-useridactiontypeprocess_many_moderation_item)
  - [GET /:userId/moderate_all_content](#api-endpoint-get-useridmoderate_all_content)
- [Admin/Promoter Rights & Memberships](#adminpromoter-rights--memberships)
  - [GET /loggedInUser/promoterRights](#api-endpoint-get-loggedinuserpromoterrights)
  - [GET /loggedInUser/adminRights](#api-endpoint-get-loggedinuseradminrights)
  - [GET /loggedInUser/adminRightsWithNames](#api-endpoint-get-loggedinuseradminrightswithnames)
  - [GET /loggedInUser/memberships](#api-endpoint-get-loggedinusermemberships)
  - [GET /loggedInUser/membershipsWithNames](#api-endpoint-get-loggedinusermembershipswithnames)
- [Password Reset](#password-reset)
  - [POST /forgot_password](#api-endpoint-post-forgot_password)
  - [GET /reset/:token](#api-endpoint-get-resettoken)
  - [POST /reset/:token](#api-endpoint-post-resettoken)
- [Invites](#invites)
  - [GET /get_invite_info/:token](#api-endpoint-get-get_invite_infotoken)
  - [POST /accept_invite/:token](#api-endpoint-post-accept_invitetoken)
- [Email & Account Linking](#email--account-linking)
  - [PUT /missingEmail/setEmail](#api-endpoint-put-missingemailsetemail)
  - [PUT /missingEmail/emailConfirmationShown](#api-endpoint-put-missingemailemailconfirmationshown)
  - [PUT /missingEmail/linkAccounts](#api-endpoint-put-missingemaillinkaccounts)
- [Third-Party Authentication](#third-party-authentication)
- [Miscellaneous](#miscellaneous)
  - [POST /createActivityFromApp](#api-endpoint-post-createactivityfromapp)
  - [GET /available/groups](#api-endpoint-get-availablegroups)
  - [GET /has/AutoTranslation](#api-endpoint-get-hasautotranslation)
  - [GET /has/PlausibleSiteName](#api-endpoint-get-hasplausiblesitename)
  - [GET /PlausibleFavIcon/:sourceName](#api-endpoint-get-plausiblefavicon-sourcename)
  - [GET /:id/status_update/:bulkStatusUpdateId](#api-endpoint-get-idstatus_updatebulkstatusupdateid)
  - [DELETE /disconnectFacebookLogin](#api-endpoint-delete-disconnectfacebooklogin)
  - [DELETE /disconnectSamlLogin](#api-endpoint-delete-disconnectsamllogin)
  - [POST /createApiKey](#api-endpoint-post-createapikey)

---

## Authentication & Session

### API Endpoint: POST /login

Authenticate a user using local strategy and return user data with profile, endorsements, ratings, and point qualities.

#### Request

##### Body

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

##### Headers

| Name           | Type   | Description         | Required |
|----------------|--------|---------------------|----------|
| Content-Type   | string | application/json    | Yes      |

#### Response

##### Success (200)

```json
{
  "id": 1,
  "name": "User Name",
  "Endorsements": [...],
  "Ratings": [...],
  "PointQualities": [...],
  "hasRegistrationAnswers": true,
  "missingEmail": false
}
```

##### Error (401/500)

```json
{
  "message": "Authentication failed"
}
```

---

### API Endpoint: POST /logout

Logs out the current user and destroys the session.

#### Request

No body required.

#### Response

##### Success (200)

No content.

##### Error (500)

No content.

---

### API Endpoint: GET /loggedInUser/isloggedin

Checks if the user is authenticated and returns user data if so.

#### Request

No parameters.

#### Response

##### Success (200)

```json
{
  "id": 1,
  "name": "User Name",
  "Endorsements": [...],
  "Ratings": [...],
  "PointQualities": [...],
  "hasRegistrationAnswers": true,
  "missingEmail": false
}
```

##### Not logged in

```json
{
  "notLoggedIn": true
}
```

---

## Registration

### API Endpoint: POST /register

Registers a new user.

#### Request

##### Body

```json
{
  "email": "user@example.com",
  "name": "User Name",
  "password": "password",
  "registration_answers": { ... }
}
```

#### Response

##### Success (200)

Returns the created user object (without password).

##### Error (401/500)

```json
{
  "status": 401,
  "message": "SequelizeUniqueConstraintError",
  "type": "internal"
}
```

---

### API Endpoint: POST /register_anonymously

Registers an anonymous user for a group.

#### Request

##### Body

```json
{
  "groupId": 123,
  "oneTimeLoginName": "Anonymous",
  "registration_answers": { ... },
  "trackingParameters": { ... }
}
```

#### Response

##### Success (200)

Returns the created or found anonymous user object.

##### Error (401/500)

```json
{
  "status": 401,
  "message": "SequelizeUniqueConstraintError",
  "type": "internal"
}
```

---

### API Endpoint: PUT /setRegistrationAnswers

Sets registration answers for the logged-in user.

#### Request

##### Body

```json
{
  "registration_answers": { ... }
}
```

#### Response

##### Success (200)

No content.

##### Error (401/500)

No content.

---

## User Profile & Management

### API Endpoint: PUT /:id

Edits a user's profile. Requires `edit user` permission.

#### Request

##### Parameters

| Name | Type   | In   | Description         | Required |
|------|--------|------|---------------------|----------|
| id   | number | path | User ID             | Yes      |

##### Body

```json
{
  "name": "New Name",
  "email": "new@example.com",
  "description": "New description",
  "notifications_settings": "{...}"
}
```

#### Response

##### Success (200)

Returns the updated user object.

##### Error (500)

```json
{
  "duplicateEmail": true,
  "isError": true
}
```

---

### API Endpoint: GET /:id

**Note:** This endpoint is currently disabled and always returns 401.

---

### API Endpoint: DELETE /delete_current_user

Deletes the currently logged-in user (soft delete).

#### Response

##### Success (200)

No content.

##### Error (401/404/500)

No content.

---

### API Endpoint: DELETE /anonymize_current_user

Anonymizes the currently logged-in user.

#### Response

##### Success (200)

No content.

##### Error (401/404/500)

No content.

---

### API Endpoint: PUT /loggedInUser/setLocale

Sets the default locale for the logged-in user.

#### Request

##### Body

```json
{
  "locale": "en"
}
```

#### Response

##### Success (200)

No content.

##### Error (500)

No content.

---

## Moderation

### API Endpoint: DELETE /:userId/:itemId/:itemType/:actionType/process_one_moderation_item

Performs a single moderation action on a user's item. Requires `edit user` permission.

#### Request

##### Parameters

| Name      | Type   | In   | Description         | Required |
|-----------|--------|------|---------------------|----------|
| userId    | number | path | User ID             | Yes      |
| itemId    | number | path | Item ID             | Yes      |
| itemType  | string | path | Type of item        | Yes      |
| actionType| string | path | Moderation action   | Yes      |

#### Response

##### Success (200)

No content.

##### Error (500)

No content.

---

### API Endpoint: DELETE /:userId/:actionType/process_many_moderation_item

Queues multiple moderation actions for processing. Requires `edit user` permission.

#### Request

##### Parameters

| Name      | Type   | In   | Description         | Required |
|-----------|--------|------|---------------------|----------|
| userId    | number | path | User ID             | Yes      |
| actionType| string | path | Moderation action   | Yes      |

##### Body

```json
{
  "items": [ ... ]
}
```

#### Response

##### Success (200)

```json
{}
```

---

### API Endpoint: GET /:userId/moderate_all_content

Gets all content by a user for moderation. Requires `edit user` permission.

#### Request

##### Parameters

| Name   | Type   | In   | Description | Required |
|--------|--------|------|-------------|----------|
| userId | number | path | User ID     | Yes      |

#### Response

##### Success (200)

Returns an array of moderation items.

##### Error (500)

No content.

---

## Admin/Promoter Rights & Memberships

### API Endpoint: GET /loggedInUser/promoterRights

Returns the communities and groups where the user has promoter rights.

#### Response

##### Success (200)

```json
{
  "CommunityPromoters": [...],
  "GroupPromoters": [...]
}
```

##### Not a promoter

```json
"0"
```

---

### API Endpoint: GET /loggedInUser/adminRights

Returns the domains, communities, groups, and organizations where the user has admin rights.

#### Response

##### Success (200)

```json
{
  "DomainAdmins": [...],
  "CommunityAdmins": [...],
  "GroupAdmins": [...],
  "OrganizationAdmins": [...]
}
```

##### Not an admin

```json
"0"
```

---

### API Endpoint: GET /loggedInUser/adminRightsWithNames

Returns admin rights with names and additional info.

#### Query Parameters

| Name    | Type    | In    | Description                | Required |
|---------|---------|-------|----------------------------|----------|
| getAll  | boolean | query | If true, returns all items | No       |

#### Response

Same as `/adminRights`, but with more detailed info.

---

### API Endpoint: GET /loggedInUser/memberships

Returns the user's memberships in domains, communities, groups, and organizations.

#### Response

```json
{
  "DomainUsers": [...],
  "CommunityUsers": [...],
  "GroupUsers": [...],
  "OrganizationUsers": [...]
}
```

---

### API Endpoint: GET /loggedInUser/membershipsWithNames

Returns memberships with names and additional info.

#### Response

Same as `/memberships`, but with more detailed info.

---

## Password Reset

### API Endpoint: POST /forgot_password

Initiates password reset by generating a token and sending an email.

#### Request

##### Body

```json
{
  "email": "user@example.com"
}
```

#### Response

##### Success (200)

No content.

##### Error (404/500)

No content.

---

### API Endpoint: GET /reset/:token

Gets user info for a valid password reset token.

#### Request

##### Parameters

| Name  | Type   | In   | Description         | Required |
|-------|--------|------|---------------------|----------|
| token | string | path | Password reset token| Yes      |

#### Response

##### Success (200)

Returns user object.

##### Error (404/500)

```json
{
  "error": "not_found"
}
```

---

### API Endpoint: POST /reset/:token

Resets the user's password using a valid token.

#### Request

##### Parameters

| Name  | Type   | In   | Description         | Required |
|-------|--------|------|---------------------|----------|
| token | string | path | Password reset token| Yes      |

##### Body

```json
{
  "password": "newpassword"
}
```

#### Response

##### Success (200)

Returns user object.

##### Error (404/500)

```json
{
  "error": "not_found"
}
```

---

## Invites

### API Endpoint: GET /get_invite_info/:token

Gets information about an invite.

#### Request

##### Parameters

| Name  | Type   | In   | Description         | Required |
|-------|--------|------|---------------------|----------|
| token | string | path | Invite token        | Yes      |

#### Response

##### Success (200)

```json
{
  "configuration": { ... },
  "targetName": "Group or Community Name",
  "inviteName": "Inviter Name",
  "targetEmail": "invitee@example.com"
}
```

##### Error (404)

No content.

---

### API Endpoint: POST /accept_invite/:token

Accepts an invite and adds the user to the group or community.

#### Request

##### Parameters

| Name  | Type   | In   | Description         | Required |
|-------|--------|------|---------------------|----------|
| token | string | path | Invite token        | Yes      |

#### Response

##### Success (200)

```json
{
  "name": "Group or Community Name",
  "redirectTo": "/group/123"
}
```

##### Error (404)

No content.

---

## Email & Account Linking

### API Endpoint: PUT /missingEmail/setEmail

Sets the email for a user who is missing one.

#### Request

##### Body

```json
{
  "email": "user@example.com"
}
```

#### Response

##### Success (200)

```json
{
  "email": "user@example.com"
}
```

##### Already registered

```json
{
  "alreadyRegistered": true
}
```

---

### API Endpoint: PUT /missingEmail/emailConfirmationShown

Marks that the email confirmation has been shown to the user.

#### Response

##### Success (200)

No content.

---

### API Endpoint: PUT /missingEmail/linkAccounts

Links two user accounts (e.g., social login to email/password).

#### Request

##### Body

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

#### Response

##### Success (200)

```json
{
  "email": "user@example.com",
  "accountLinked": true
}
```

##### Error

```json
{
  "error": "wrong password"
}
```

---

## Third-Party Authentication

### Facebook

- **GET /auth/facebook**: Initiates Facebook login.
- **GET /auth/facebook/callback**: Handles Facebook login callback.

### Google

- **GET /auth/google**: Initiates Google login.
- **GET /auth/google/callback**: Handles Google login callback.

### Twitter

- **GET /auth/twitter/callback**: Handles Twitter login callback.

### GitHub

- **GET /auth/github**: Initiates GitHub login.
- **GET /auth/github/callback**: Handles GitHub login callback.

### SAML/OIDC

- **GET /auth/saml**: Initiates SAML login.
- **GET /auth/oidc**: Initiates OIDC login.
- **GET /auth/audkenni**: Initiates Audkenni login.
- **GET /auth/oidc/callback**: Handles OIDC login callback.
- **GET /auth/audkenni/callback**: Handles Audkenni login callback.

---

## Miscellaneous

### API Endpoint: POST /createActivityFromApp

Creates an activity from the app (for analytics/auditing).

#### Request

##### Body

```json
{
  "actor": "...",
  "type": "...",
  "object": { ... },
  "target": "...",
  "path_name": "...",
  "context": "...",
  "event_time": "...",
  "sessionId": "...",
  "user_agent": "...",
  "userLocale": "...",
  "userAutoTranslate": "...",
  "screen_width": "...",
  "originalQueryString": "...",
  "referrer": "...",
  "url": "...",
  "domainId": 1,
  "communityId": 2,
  "groupId": 3,
  "postId": 4,
  "pointId": 5
}
```

#### Response

##### Success (200)

No content.

---

### API Endpoint: GET /available/groups

Returns all public groups in the current domain.

#### Response

```json
{
  "groups": [ ... ],
  "domainId": 1
}
```

---

### API Endpoint: GET /has/AutoTranslation

Checks if auto-translation is available.

#### Response

```json
{
  "hasAutoTranslation": true
}
```

---

### API Endpoint: GET /has/PlausibleSiteName

Returns the Plausible analytics site name if set.

#### Response

```json
{
  "plausibleSiteName": "example.com"
}
```

---

### API Endpoint: GET /PlausibleFavIcon/:sourceName

Returns the favicon for a Plausible analytics source.

#### Request

##### Parameters

| Name       | Type   | In   | Description         | Required |
|------------|--------|------|---------------------|----------|
| sourceName | string | path | Source name         | Yes      |

#### Response

##### Success (200)

Returns the icon file.

##### Error (404/500)

No content.

---

### API Endpoint: GET /:id/status_update/:bulkStatusUpdateId

Returns status update information for a user and a bulk status update.

#### Request

##### Parameters

| Name              | Type   | In   | Description         | Required |
|-------------------|--------|------|---------------------|----------|
| id                | number | path | User ID             | Yes      |
| bulkStatusUpdateId| number | path | Bulk status update  | Yes      |

#### Response

```json
{
  "config": { ... },
  "templates": [ ... ],
  "community": { ... }
}
```

---

### API Endpoint: DELETE /disconnectFacebookLogin

Disconnects the user's Facebook login.

#### Response

##### Success (200)

No content.

---

### API Endpoint: DELETE /disconnectSamlLogin

Disconnects the user's SAML login.

#### Response

##### Success (200)

No content.

---

### API Endpoint: POST /createApiKey

Creates a new API key for the logged-in user.

#### Response

```json
{
  "apiKey": "generated-api-key"
}
```

---

## Utility Functions

### Function: logoutFromSession

Destroys the session and clears the session cookie.

#### Parameters

| Name       | Type     | Description                       |
|------------|----------|-----------------------------------|
| req        | Request  | Express request object            |
| res        | Response | Express response object           |
| statusCode | number   | HTTP status code (default: 200)   |

---

### Function: sendUserOrError

Sends the user object or an error response.

#### Parameters

| Name     | Type     | Description                       |
|----------|----------|-----------------------------------|
| res      | Response | Express response object           |
| user     | Object   | User object                       |
| context  | string   | Context string for logging        |
| error    | Error    | Error object                      |
| errorStatus | number| HTTP error status code            |

---

### Function: getUserWithAll

Fetches a user and their endorsements, ratings, and point qualities.

#### Parameters

| Name                | Type     | Description                       |
|---------------------|----------|-----------------------------------|
| userId              | number   | User ID                           |
| getPrivateProfileData | boolean| Whether to include private data   |
| callback            | function | Callback (error, user)            |

---

### Function: setUserProfileData

Sets registration answers in the user's private profile data.

#### Parameters

| Name        | Type   | Description                       |
|-------------|--------|-----------------------------------|
| user        | Object | User object                       |
| profileData | Object | Registration answers              |

---

### Function: setSAMLSettingsOnUser

Sets SAML-related settings on the user object based on referrer and context.

#### Parameters

| Name   | Type     | Description                       |
|--------|----------|-----------------------------------|
| req    | Request  | Express request object            |
| user   | Object   | User object                       |
| done   | function | Callback function                 |

---

### Function: completeCreationOfApiKey

Sets and saves a new API key for the user.

#### Parameters

| Name   | Type     | Description                       |
|--------|----------|-----------------------------------|
| user   | Object   | User object                       |
| apiKey | string   | API key string                    |
| res    | Response | Express response object           |

---

## Dependencies

- [models](../models/index.cjs): Sequelize models for User, Group, Community, etc.
- [auth](../authorization.cjs): Authorization middleware.
- [log](../utils/logger.cjs): Logging utility.
- [toJson](../utils/to_json.cjs): Utility to convert objects to JSON.
- [queue](../services/workers/queue.cjs): Job queue for background processing.
- [getAllModeratedItemsByUser](../services/engine/moderation/get_moderation_items.cjs)
- [performSingleModerationAction](../services/engine/moderation/process_moderation_items.cjs)
- [sendPlausibleFavicon](../services/engine/analytics/plausible/manager.cjs)

---

## Notes

- Many endpoints require authentication or specific permissions.
- Some endpoints are disabled or return static responses for security reasons.
- The file uses async/await, async.waterfall, and async.parallel for asynchronous operations.
- The router is exported for use in the main Express app.

---

**See also:**
- [User Model](../models/user.md)
- [Authorization Middleware](../authorization.md)
- [Queue Service](../services/workers/queue.md)
- [Moderation Services](../services/engine/moderation/get_moderation_items.md)
- [Logger Utility](../utils/logger.md)
