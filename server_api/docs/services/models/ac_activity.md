# Model: AcActivity

Represents an activity record in the system, such as user actions, password recovery, or invitations. Activities are used for feeds, notifications, and auditing. This model is defined using Sequelize and includes various associations, static constants, and utility methods for creating and managing activities.

## Properties

| Name                     | Type      | Description                                                                 |
|--------------------------|-----------|-----------------------------------------------------------------------------|
| access                   | number    | Access level for the activity. See static constants below.                  |
| type                     | string    | The type of activity (e.g., "activity.password.recovery").                  |
| sub_type                 | string    | Optional sub-type for further categorization.                               |
| status                   | string    | Status of the activity (e.g., "active").                                    |
| object                   | object    | JSONB object containing activity-specific data.                             |
| actor                    | object    | JSONB object describing the actor (e.g., user info).                        |
| target                   | object    | JSONB object describing the target of the activity.                         |
| context                  | object    | JSONB object for additional context.                                        |
| user_interaction_profile | object    | JSONB object for user interaction profile data.                             |
| deleted                  | boolean   | Whether the activity is deleted. Default: `false`.                          |
| created_at               | Date      | Timestamp when the activity was created.                                    |
| updated_at               | Date      | Timestamp when the activity was last updated.                               |

## Table

- **Name:** `ac_activities`
- **Timestamps:** Yes (`created_at`, `updated_at`)
- **Underscored:** Yes

## Default Scope

- Only includes activities where `deleted: false` and `status: 'active'`.

## Indexes

Several indexes are defined for efficient querying, including by type, community, group, post, user, and combinations thereof. Some are conditional on `status: 'active'` and `deleted: false`.

## Associations

| Association Type | Target Model      | Foreign Key           | Description                                      |
|------------------|------------------|-----------------------|--------------------------------------------------|
| belongsTo        | Domain           | domain_id             | The domain this activity belongs to.              |
| belongsTo        | Community        | community_id          | The community this activity belongs to.           |
| belongsTo        | Group            | group_id              | The group this activity belongs to.               |
| belongsTo        | Post             | post_id               | The post related to this activity.                |
| belongsTo        | Point            | point_id              | The point related to this activity.               |
| belongsTo        | Invite           | invite_id             | The invite related to this activity.              |
| belongsTo        | User             | user_id               | The user related to this activity.                |
| belongsTo        | Image            | image_id              | The image related to this activity.               |
| belongsTo        | PostStatusChange | post_status_change_id | The post status change related to this activity.  |
| belongsToMany    | User             | - (through: other_users) | Many-to-many with users via `other_users`.    |
| belongsToMany    | AcNotification   | - (through: notification_activities, as: 'AcActivities') | Many-to-many with notifications. |

---

# Exported Constants

## Access Level Constants

| Name                | Value | Description                                 |
|---------------------|-------|---------------------------------------------|
| ACCESS_PUBLIC       | 0     | Public access.                              |
| ACCESS_COMMUNITY    | 1     | Community-level access.                     |
| ACCESS_GROUP        | 2     | Group-level access.                         |
| ACCESS_PRIVATE      | 3     | Private access.                             |

---

# Static Methods

## AcActivity.setOrganizationUsersForActivities

Sets the `OrganizationUsers` property for the `User` associated with each activity in the provided list. This is used to enrich activity data with organization and logo information for each user.

### Parameters

| Name       | Type        | Description                                                                                 |
|------------|-------------|---------------------------------------------------------------------------------------------|
| activities | Array       | Array of activity instances (should have a `User` property).                                |
| done       | Function    | Callback function to be called when processing is complete or on error.                     |

### Description

- Filters activities to those with a `User`.
- Fetches all users (by ID) with their associated organizations and organization logo images.
- Sets the `OrganizationUsers` property on each activity's `User`.
- Calls `done()` when finished or with an error if one occurs.

---

## AcActivity.createActivity

Queues a job to create a priority activity asynchronously.

### Parameters

| Name    | Type     | Description                                      |
|---------|----------|--------------------------------------------------|
| options | object   | Options for the activity creation.                |
| callback| Function | Callback to be called after queuing the job.      |

### Description

- Adds a job to the `delayed-job` queue with type `create-priority-activity` and the provided options.
- Calls the callback immediately after queuing.

---

## AcActivity.createPasswordRecovery

Creates a password recovery activity for a user and queues it for processing.

### Parameters

| Name      | Type     | Description                                               |
|-----------|----------|-----------------------------------------------------------|
| user      | object   | The user requesting password recovery.                    |
| domain    | object   | The domain context.                                       |
| community | object   | The community context (optional).                         |
| token     | string   | The password recovery token.                              |
| done      | Function | Callback to be called with error or null on success.      |

### Description

- Builds and saves a new activity of type `activity.password.recovery`.
- Sets the actor to the user and object to include domain, community, and token.
- Sets access to `ACCESS_PRIVATE`.
- Queues the activity for processing with critical priority.
- Logs the creation and calls the callback with error or null.

---

## AcActivity.inviteCreated

Creates an invitation activity and queues it for processing.

### Parameters

| Name    | Type     | Description                                               |
|---------|----------|-----------------------------------------------------------|
| options | object   | Options for the invitation (user IDs, email, token, etc). |
| done    | Function | Callback to be called with error or null on success.      |

### Description

- Builds and saves a new activity of type `activity.user.invite`.
- Sets the actor and object with invitation details.
- Sets access to `ACCESS_PRIVATE`.
- Queues the activity for processing with critical priority.
- Logs the creation and calls the callback with error or null.

---

# Configuration

- **Indexes:** Uses a combination of custom and imported indexes for efficient querying.
- **Default Scope:** Only non-deleted, active activities are returned by default.
- **Timestamps:** Uses `created_at` and `updated_at` fields.
- **Table Name:** `ac_activities`
- **Underscored:** Field names use snake_case.

---

# Related Modules

- [logger.cjs](../utils/logger.cjs) - Logging utility.
- [queue.cjs](../workers/queue.cjs) - Job queue for background processing.
- [to_json.cjs](../utils/to_json.cjs) - Utility for JSON conversion.
- [activity_and_item_index_definitions.cjs](../engine/news_feeds/activity_and_item_index_definitions.cjs) - Common index definitions for activities and news feeds.

---

# Example Usage

```javascript
const { AcActivity } = require('./models');

// Creating a password recovery activity
AcActivity.createPasswordRecovery(user, domain, community, token, (err) => {
  if (err) {
    // handle error
  }
});

// Creating an invite activity
AcActivity.inviteCreated({
  user_id: 1,
  sender_user_id: 2,
  email: 'invitee@example.com',
  token: 'sometoken',
  invite_id: 123,
  sender_name: 'Alice',
  invite_type: 'community',
  invite_link: 'https://example.com/invite',
  community_id: 10,
  group_id: 20,
  domain_id: 5
}, (err) => {
  if (err) {
    // handle error
  }
});
```

---

# See Also

- [User](./User.md)
- [Community](./Community.md)
- [Group](./Group.md)
- [Post](./Post.md)
- [Invite](./Invite.md)
- [AcNotification](./AcNotification.md)
- [Domain](./Domain.md)
- [Image](./Image.md)
- [Point](./Point.md)
- [PostStatusChange](./PostStatusChange.md)
