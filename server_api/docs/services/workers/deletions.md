# Service Module: deletion_worker.cjs

This module provides a comprehensive set of asynchronous service functions for handling deletion, anonymization, and recounting of content and user data within a hierarchical structure of domains, communities, groups, posts, and points. It is designed to be used as a worker for processing deletion and user-removal jobs, ensuring data consistency and proper counter updates throughout the system.

## Overview

- Handles deletion and anonymization of user content at various levels (point, post, group, community, domain).
- Updates and resets counters for posts, points, endorsements, and users.
- Removes users, admins, and promoters from groups, communities, and domains.
- Supports batch operations for efficiency.
- Integrates with activity logging and notification systems.
- Ensures referential integrity and data consistency after deletions.

---

## Exported Class: DeletionWorker

A singleton worker class that processes deletion and user-removal work packages.

### Methods

#### process(workPackage, callback)

Processes a deletion or user-removal work package according to its `type`.

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| workPackage | object   | The work package containing details for the operation. See below for structure. |
| callback    | function | Callback function `(error?: any) => void`.        |

**WorkPackage Structure (varies by type):**
- `type`: string (required) — The operation type (see supported types below).
- Other fields depend on the operation type, e.g., `userId`, `groupId`, `communityId`, `domainId`, `postId`, `pointId`, `userIds`, `anonymousUserId`, `resetCounters`, `useNotification`, etc.

**Supported `type` values:**
- `delete-point-content`
- `delete-point-activities`
- `delete-post-content`
- `delete-post-activities`
- `delete-group-content`
- `delete-community-content`
- `delete-user-content`
- `delete-group-user-content`
- `delete-community-user-content`
- `delete-domain-user-content`
- `delete-user-endorsements`
- `move-user-endorsements`
- `remove-many-group-admins`
- `remove-many-group-promoters`
- `remove-many-group-users`
- `remove-many-group-users-and-delete-content`
- `remove-many-community-admins`
- `remove-many-community-promoters`
- `remove-many-community-users`
- `remove-many-community-users-and-delete-content`
- `remove-many-domain-admins`
- `remove-many-domain-users`
- `remove-many-domain-users-and-delete-content`

**Example Usage:**
```javascript
const deletionWorker = require('./deletion_worker.cjs');
deletionWorker.process({ type: 'delete-user-content', userId: 123, anonymousUserId: 1 }, (err) => {
  if (err) { /* handle error */ }
});
```

---

## Key Internal Functions

### getGroupAndUser(groupId, userId, userEmail, callback)

Fetches a group and a user (by ID or email).

| Name      | Type     | Description                  |
|-----------|----------|------------------------------|
| groupId   | number   | Group ID                     |
| userId    | number   | User ID (optional)           |
| userEmail | string   | User email (optional)        |
| callback  | function | `(error, group, user)`       |

---

### getCommunityAndUser(communityId, userId, userEmail, callback)

Fetches a community and a user (by ID or email).

| Name         | Type     | Description                  |
|--------------|----------|------------------------------|
| communityId  | number   | Community ID                 |
| userId       | number   | User ID (optional)           |
| userEmail    | string   | User email (optional)        |
| callback     | function | `(error, community, user)`   |

---

### getDomainAndUser(domainId, userId, userEmail, callback)

Fetches a domain and a user (by ID or email).

| Name      | Type     | Description                  |
|-----------|----------|------------------------------|
| domainId  | number   | Domain ID                    |
| userId    | number   | User ID (optional)           |
| userEmail | string   | User email (optional)        |
| callback  | function | `(error, domain, user)`      |

---

### recountPost(postId, callback)

Recalculates and updates counters for a post (endorsements up/down, points).

| Name    | Type     | Description         |
|---------|----------|---------------------|
| postId  | number   | Post ID             |
| callback| function | `(error?)`          |

---

### recountGroup(workPackage, callback)

Recalculates and updates counters for a group (posts, points, users).

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ groupId: number }`|
| callback    | function | `(error?)`          |

---

### recountCommunity(workPackage, callback)

Recalculates and updates counters for a community (posts, points, users), optionally deep-counting all groups.

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| workPackage | object   | `{ communityId: number, doDeepGroupCounting?: boolean }` |
| callback    | function | `(error?)`                                  |

---

### recountDomain(workPackage, callback)

Recalculates and updates counters for a domain (posts, points).

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ domainId: number }`|
| callback    | function | `(error?)`          |

---

### recountGroupFromPostId(postId, callback)

Recalculates group counters based on a post ID.

| Name    | Type     | Description         |
|---------|----------|---------------------|
| postId  | number   | Post ID             |
| callback| function | `(error?)`          |

---

### resetCountForCommunityForGroup(groupId, callback)

Resets post and point counters for a community based on its groups.

| Name    | Type     | Description         |
|---------|----------|---------------------|
| groupId | number   | Group ID            |
| callback| function | `(error?)`          |

---

### deletePointContent(workPackage, callback)

Deletes (soft) all activities and quality ratings for a point.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ pointId: number, ... }`|
| callback    | function | `(error?)`          |

---

### deletePointActivities(workPackage, callback)

Deletes (soft) all activities, revisions, and quality ratings for a point.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ pointId: number, ... }`|
| callback    | function | `(error?)`          |

---

### deletePostActivities(workPackage, callback)

Deletes (soft) all activities and endorsements for a post.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ postId: number, ... }`|
| callback    | function | `(error?)`          |

---

### deletePostContent(workPackage, callback)

Deletes (soft) all content related to a post, including points, activities, and endorsements. Optionally resets counters and sends notifications.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ postId: number, ... }`|
| callback    | function | `(error?)`          |

---

### deleteGroupContent(workPackage, callback)

Deletes (soft) all content related to a group, including posts and activities. Optionally resets counters and sends notifications.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ groupId: number, ... }`|
| callback    | function | `(error?)`          |

---

### deleteCommunityContent(workPackage, callback)

Deletes (soft) all content related to a community, including groups and activities. Optionally resets counters and sends notifications.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ communityId: number, ... }`|
| callback    | function | `(error?)`          |

---

### deleteUserEndorsements(workPackage, callback)

Deletes (soft) all endorsements by a user and decrements counters on posts.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ userId: number }`|
| callback    | function | `(error?)`          |

---

### deleteUserGroupEndorsements(workPackage, callback)

Deletes (soft) all endorsements by a user in a specific group and decrements counters.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ userId: number, groupId: number }`|
| callback    | function | `(error?)`          |

---

### moveUserEndorsements(workPackage, callback)

Moves all endorsements from one user to another.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ fromUserId: number, toUserId: number }`|
| callback    | function | `(error?)`          |

---

### deleteUserContent(workPackage, callback)

Deletes (soft) and anonymizes all content by a user across the system.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ userId: number, anonymousUserId: number }`|
| callback    | function | `(error?)`          |

---

### deleteUserGroupContent(workPackage, callback)

Deletes (soft) and anonymizes all content by a user in a specific group.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ userId: number, groupId: number, anonymousUserId: number }`|
| callback    | function | `(error?)`          |

---

### deleteUserCommunityContent(workPackage, callback)

Deletes (soft) and anonymizes all content by a user in a specific community.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ userId: number, communityId: number, anonymousUserId: number }`|
| callback    | function | `(error?)`          |

---

### deleteUserDomainContent(workPackage, callback)

Deletes (soft) and anonymizes all content by a user in a specific domain.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ userId: number, domainId: number, anonymousUserId: number }`|
| callback    | function | `(error?)`          |

---

### removeManyGroupAdmins(workPackage, callback)

Removes multiple users as admins from a group.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ userIds: number[], groupId: number }`|
| callback    | function | `(error?)`          |

---

### removeManyGroupPromoters(workPackage, callback)

Removes multiple users as promoters from a group.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ userIds: number[], groupId: number }`|
| callback    | function | `(error?)`          |

---

### removeManyCommunityAdmins(workPackage, callback)

Removes multiple users as admins from a community.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ userIds: number[], communityId: number }`|
| callback    | function | `(error?)`          |

---

### removeManyCommunityPromoters(workPackage, callback)

Removes multiple users as promoters from a community.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ userIds: number[], communityId: number }`|
| callback    | function | `(error?)`          |

---

### removeManyDomainAdmins(workPackage, callback)

Removes multiple users as admins from a domain.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ userIds: number[], domainId: number }`|
| callback    | function | `(error?)`          |

---

### removeManyGroupUsers(workPackage, callback)

Removes multiple users from a group.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ userIds: number[], groupId: number }`|
| callback    | function | `(error?)`          |

---

### removeManyCommunityUsers(workPackage, callback)

Removes multiple users from a community.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ userIds: number[], communityId: number }`|
| callback    | function | `(error?)`          |

---

### removeManyDomainUsers(workPackage, callback)

Removes multiple users from a domain.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ userIds: number[], domainId: number }`|
| callback    | function | `(error?)`          |

---

### removeManyGroupUsersAndDeleteContent(workPackage, callback)

Removes multiple users from a group and deletes their content.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ userIds: number[], groupId: number, anonymousUserId: number }`|
| callback    | function | `(error?)`          |

---

### removeManyCommunityUsersAndDeleteContent(workPackage, callback)

Removes multiple users from a community and deletes their content.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ userIds: number[], communityId: number, anonymousUserId: number }`|
| callback    | function | `(error?)`          |

---

### removeManyDomainUsersAndDeleteContent(workPackage, callback)

Removes multiple users from a domain and deletes their content.

| Name        | Type     | Description         |
|-------------|----------|---------------------|
| workPackage | object   | `{ userIds: number[], domainId: number, anonymousUserId: number }`|
| callback    | function | `(error?)`          |

---

## Dependencies

- [async](https://caolan.github.io/async/)
- [lodash](https://lodash.com/)
- [models](../../models/index.cjs) — Sequelize models for Domain, Community, Group, Post, Point, User, etc.
- [logger](../utils/logger.cjs) — Logging utility.
- [queue](./queue.cjs) — Job queue for background processing.
- [i18n](../utils/i18n.cjs) — Internationalization utility.
- [to_json](../utils/to_json.cjs) — Utility for object serialization.
- [get_anonymous_system_user](../utils/get_anonymous_system_user.cjs) — Fetches the anonymous system user.
- [airbrake](../utils/airbrake.cjs) — Error reporting (optional, if configured).

---

## Error Handling

All functions use Node.js-style callbacks `(error, ...)`. Errors are logged and, where appropriate, notifications are sent to users.

---

## Example Usage

```javascript
const deletionWorker = require('./deletion_worker.cjs');

// Delete all content for a user and anonymize
deletionWorker.process({
  type: 'delete-user-content',
  userId: 123,
  anonymousUserId: 1
}, (err) => {
  if (err) {
    console.error('Deletion failed:', err);
  } else {
    console.log('User content deleted and anonymized.');
  }
});
```

---

## See Also

- [models/index.cjs](../../models/index.cjs) for model definitions.
- [queue.cjs](./queue.cjs) for job queueing.
- [logger.cjs](../utils/logger.cjs) for logging.
- [get_anonymous_system_user.cjs](../utils/get_anonymous_system_user.cjs) for anonymous user logic.

---

**Note:** This module is intended for internal use in background job processing and should not be exposed directly to end-users. All deletions are soft (i.e., set `deleted: true`) to preserve referential integrity and allow for potential recovery or auditing.