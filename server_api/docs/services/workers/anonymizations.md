# Service Module: AnonymizationWorker

The `AnonymizationWorker` module provides a set of asynchronous functions to anonymize user-related content and activities across various entities (posts, points, groups, communities, users) in the database. It also supports notifying users about upcoming anonymization actions. This is typically used for GDPR compliance or similar privacy requirements.

## Overview

- **Location:** `services/anonymization_worker.cjs`
- **Exports:** Singleton instance of `AnonymizationWorker`
- **Dependencies:** Sequelize models, async, lodash, logger, queue, i18n, utility functions

---

## Methods

| Name                        | Parameters                                   | Return Type | Description                                                                                  |
|-----------------------------|----------------------------------------------|-------------|----------------------------------------------------------------------------------------------|
| process                     | workPackage: object, callback: function      | void        | Main entry point. Processes a work package for anonymization or notification.                |
| anonymizePointActivities    | workPackage: object, callback: function      | void        | Anonymizes user activities and revisions for a specific point.                               |
| anonymizePostActivities     | workPackage: object, callback: function      | void        | Anonymizes user activities for a specific post.                                              |
| anonymizePointContent       | workPackage: object, callback: function      | void        | Anonymizes all content and activities related to a point.                                    |
| anonymizePostContent        | workPackage: object, callback: function      | void        | Anonymizes all content and activities related to a post, including points and endorsements.  |
| anonymizeGroupContent       | workPackage: object, callback: function      | void        | Anonymizes all content and activities for a group, including posts, points, and revisions.   |
| anonymizeCommunityContent   | workPackage: object, callback: function      | void        | Anonymizes all content and activities for a community, including all groups.                 |
| anonymizeUserContent        | workPackage: object, callback: function      | void        | Anonymizes all content and activities for a specific user across all entities.               |
| notifyGroupUsers            | workPackage: object, callback: function      | void        | Notifies all users in a group about upcoming anonymization.                                  |
| notifyCommunityUsers        | workPackage: object, callback: function      | void        | Notifies all users in a community about upcoming anonymization.                              |
| getAllUsers                 | groupIds: array, communityId: number, callback: function | void | Helper to collect all users with content in given groups/communities.                        |

---

## Method Details

### AnonymizationWorker.prototype.process

Main entry point for processing anonymization or notification work packages.

#### Parameters

| Name        | Type     | Description                                                                 |
|-------------|----------|-----------------------------------------------------------------------------|
| workPackage | object   | The work package describing the anonymization or notification task.          |
| callback    | function | Callback function `(error?: any) => void`.                                  |

#### Work Package Structure

| Property         | Type      | Description                                                                 |
|------------------|-----------|-----------------------------------------------------------------------------|
| type             | string    | Type of operation (see below).                                              |
| userId           | number    | User ID to anonymize (if applicable).                                       |
| postId           | number    | Post ID to anonymize (if applicable).                                       |
| pointId          | number    | Point ID to anonymize (if applicable).                                      |
| groupId          | number    | Group ID to anonymize (if applicable).                                      |
| communityId      | number    | Community ID to anonymize (if applicable).                                  |
| skipActivities   | boolean   | If true, skips activity anonymization (optional).                           |
| skipNotification | boolean   | If true, skips notification after anonymization (optional).                 |
| postName         | string    | Name of the post (for notifications, optional).                             |
| groupName        | string    | Name of the group (for notifications, optional).                            |
| communityName    | string    | Name of the community (for notifications, optional).                        |

#### Supported `type` values

- `'anonymize-post-content'`
- `'anonymize-post-activities'`
- `'anonymize-point-content'`
- `'anonymize-point-activities'`
- `'anonymize-group-content'`
- `'anonymize-community-content'`
- `'anonymize-user-content'`
- `'notify-group-users'`
- `'notify-community-users'`

#### Example

```javascript
const worker = require('./services/anonymization_worker.cjs');
worker.process({ type: 'anonymize-post-content', postId: 123, userId: 456 }, (err) => {
  if (err) { /* handle error */ }
});
```

---

### anonymizePointActivities

Anonymizes all activities and revisions for a specific point by replacing the user ID with the anonymous user.

#### Parameters

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| workPackage | object   | Must include `pointId`, `userId`, and `anonymousUserId`. |
| callback    | function | Callback `(error?: any) => void`.           |

---

### anonymizePostActivities

Anonymizes all activities for a specific post by replacing the user ID with the anonymous user.

#### Parameters

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| workPackage | object   | Must include `postId` and `anonymousUserId`.|
| callback    | function | Callback `(error?: any) => void`.           |

---

### anonymizePointContent

Anonymizes all content and activities related to a point, including activities, quality, and revisions.

#### Parameters

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| workPackage | object   | Must include `pointId` and `anonymousUserId`. Optional: `skipActivities`. |
| callback    | function | Callback `(error?: any) => void`.           |

---

### anonymizePostContent

Anonymizes all content and activities related to a post, including activities, points, endorsements, and contact data.

#### Parameters

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| workPackage | object   | Must include `postId` and `anonymousUserId`. Optional: `skipActivities`, `skipNotification`. |
| callback    | function | Callback `(error?: any) => void`.           |

---

### anonymizeGroupContent

Anonymizes all content and activities for a group, including posts, points, point revisions, and point qualities.

#### Parameters

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| workPackage | object   | Must include `groupId` and `anonymousUserId`. Optional: `skipNotification`. |
| callback    | function | Callback `(error?: any) => void`.           |

---

### anonymizeCommunityContent

Anonymizes all content and activities for a community, including all groups within the community.

#### Parameters

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| workPackage | object   | Must include `communityId` and `anonymousUserId`. |
| callback    | function | Callback `(error?: any) => void`.           |

---

### anonymizeUserContent

Anonymizes all content and activities for a specific user across all entities.

#### Parameters

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| workPackage | object   | Must include `userId` and `anonymousUserId`.|
| callback    | function | Callback `(error?: any) => void`.           |

---

### notifyGroupUsers

Notifies all users in a group about upcoming anonymization of their content.

#### Parameters

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| workPackage | object   | Must include `groupId` and `groupName`.     |
| callback    | function | Callback `(error?: any) => void`.           |

---

### notifyCommunityUsers

Notifies all users in a community about upcoming anonymization of their content.

#### Parameters

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| workPackage | object   | Must include `communityId` and `communityName`. |
| callback    | function | Callback `(error?: any) => void`.           |

---

### getAllUsers

Helper function to collect all users with content in given groups and/or community.

#### Parameters

| Name        | Type     | Description                                 |
|-------------|----------|---------------------------------------------|
| groupIds    | array    | Array of group IDs.                         |
| communityId | number   | Community ID (optional).                    |
| callback    | function | Callback `(error: any, users: Array<{id, pointIds, postIds}>) => void`. |

---

## Work Package Example

```json
{
  "type": "anonymize-post-content",
  "postId": 123,
  "userId": 456,
  "postName": "Example Post",
  "skipNotification": false
}
```

---

## Error Handling

All methods use Node.js-style callbacks. If an error occurs, the first argument to the callback will be an error object or string. On success, the first argument will be `null` or `undefined`.

---

## Export

```javascript
module.exports = new AnonymizationWorker();
```

Exports a singleton instance of the `AnonymizationWorker` class.

---

## Related Models

- [AcActivity](../../models/index.cjs)
- [Point](../../models/index.cjs)
- [PointRevision](../../models/index.cjs)
- [PointQuality](../../models/index.cjs)
- [Post](../../models/index.cjs)
- [Group](../../models/index.cjs)
- [Community](../../models/index.cjs)
- [Endorsement](../../models/index.cjs)

---

## Utility Dependencies

- [logger](../utils/logger.cjs)
- [queue](./queue.cjs)
- [i18n](../utils/i18n.cjs)
- [to_json](../utils/to_json.cjs)
- [get_anonymous_system_user](../utils/get_anonymous_system_user.cjs)
- [airbrake](../utils/airbrake.cjs) (optional, if configured)

---

## Example Usage

```javascript
const anonymizationWorker = require('./services/anonymization_worker.cjs');

anonymizationWorker.process({
  type: 'anonymize-user-content',
  userId: 123
}, (err) => {
  if (err) {
    console.error('Anonymization failed:', err);
  } else {
    console.log('Anonymization complete');
  }
});
```

---

## See Also

- [queue.cjs](./queue.md)
- [logger.cjs](../utils/logger.md)
- [get_anonymous_system_user.cjs](../utils/get_anonymous_system_user.md)
- [AcActivity Model](../../models/index.md)
- [Point Model](../../models/index.md)
- [Post Model](../../models/index.md)
- [Group Model](../../models/index.md)
- [Community Model](../../models/index.md)
