# Service Module: moderation_actions.cjs

This module provides core moderation action logic for single and multiple items in a community platform. It supports actions such as delete, approve, block, anonymize, and clear flags for posts and points, and coordinates with background job queues and recount utilities. The module is designed to be used by route handlers or controllers that need to perform moderation actions on content.

---

## Exported Functions

| Name                         | Parameters                                      | Return Type | Description                                                                                 |
|------------------------------|-------------------------------------------------|-------------|---------------------------------------------------------------------------------------------|
| performSingleModerationAction | req: Request, res: Response, options: object    | void        | Handles moderation actions for a single item (post or point) and sends HTTP response.        |
| performManyModerationActions  | workPackage: object, callback: Function         | Promise<void>| Handles moderation actions for multiple items (posts and/or points) in batch.                |

---

# Service: performSingleModerationAction

Handles moderation actions (delete, approve, block, anonymize, clearFlags) for a single item (post or point). Determines the correct model and includes based on the provided options, then delegates to the internal moderation logic and sends an HTTP response.

## Parameters

| Name    | Type     | Description                                                                 |
|---------|----------|-----------------------------------------------------------------------------|
| req     | Request  | Express request object.                                                     |
| res     | Response | Express response object.                                                    |
| options | object   | Moderation options:<br>- itemType: 'post' or 'point'<br>- itemId: number<br>- actionType: 'delete' \| 'approve' \| 'block' \| 'anonymize' \| 'clearFlags'<br>- domainId, communityId, groupId, userId: (optional) for context. |

## Behavior

- Determines the correct Sequelize model (`Post` or `Point`) and includes based on the context (domain, community, group, user).
- Validates action type for user moderation (only 'delete' and 'anonymize' allowed).
- Calls internal moderation logic and sends appropriate HTTP status code.

---

# Service: performManyModerationActions

Handles moderation actions for multiple items (posts and/or points) in batch. Supports the same actions as single moderation, and also triggers recounts and background jobs as needed.

## Parameters

| Name        | Type     | Description                                                                                 |
|-------------|----------|---------------------------------------------------------------------------------------------|
| workPackage | object   | Moderation work package:<br>- items: Array of items with `id` and `modelType`<br>- actionType: 'delete' \| 'approve' \| 'block' \| 'anonymize' \| 'clearFlags'<br>- domainId, communityId, groupId, userId: (optional) for context. |
| callback    | Function | Callback function to be called after completion or error.                                   |

## Behavior

- Splits items into posts and points.
- For posts, also collects associated point IDs.
- Determines correct includes for context.
- Performs batch update for each type (post/point) using internal logic.
- Triggers background jobs for similarity processing and recounts for affected communities/groups.
- Calls the callback with error or success.

---

# Internal Functions

## moderationItemActionMaster

Handles the actual moderation action for a single item, including updating the database, triggering background jobs, and sending the HTTP response.

### Parameters

| Name    | Type     | Description                                                                 |
|---------|----------|-----------------------------------------------------------------------------|
| req     | Request  | Express request object.                                                     |
| res     | Response | Express response object.                                                    |
| options | object   | Moderation options:<br>- model: Sequelize model<br>- itemType, itemId, actionType, includes |

---

## moderationManyItemsActionMaster

Handles the actual moderation action for multiple items of the same type (post or point), including batch updating the database and triggering background jobs.

### Parameters

| Name        | Type     | Description                                                                                 |
|-------------|----------|---------------------------------------------------------------------------------------------|
| workPackage | object   | Moderation work package (see above).                                                        |
| callback    | Function | Callback function to be called after completion or error.                                   |

---

## preProcessActivities

Prepares background jobs for each item in a batch moderation action.

### Parameters

| Name        | Type     | Description                                                                                 |
|-------------|----------|---------------------------------------------------------------------------------------------|
| workPackage | object   | Moderation work package.                                                                    |
| callback    | Function | Callback function to be called after completion or error.                                   |

---

## createActivityJob

Adds background jobs to the queue for anonymization or deletion of activities related to a post or point.

### Parameters

| Name         | Type   | Description                                            |
|--------------|--------|--------------------------------------------------------|
| workPackage  | object | Moderation work package.                               |
| model        | object | Sequelize model instance (post or point).              |

---

# Dependencies

- **queue**: Background job queue for processing activities and similarities.
- **models**: Sequelize models for Post, Point, Group, etc.
- **async**: For parallel and limited concurrency processing.
- **log**: Logger utility.
- **lodash**: Utility library for array/object manipulation.
- **getAnonymousUser**: Utility to fetch the anonymous system user.
- **domainIncludes, communityIncludes, groupIncludes, userIncludes**: Functions to generate Sequelize include options for different moderation contexts.
- **recountCommunity**: Utility to trigger recounts for community statistics.

---

# Example Usage

```javascript
const { performSingleModerationAction, performManyModerationActions } = require('./moderation_actions.cjs');

// Single moderation action (Express route handler)
app.post('/moderate/item', (req, res) => {
  performSingleModerationAction(req, res, {
    itemType: 'post',
    itemId: req.body.itemId,
    actionType: req.body.actionType,
    communityId: req.body.communityId
  });
});

// Many moderation actions (batch)
const workPackage = {
  items: [
    { id: 1, modelType: 'post' },
    { id: 2, modelType: 'point' }
  ],
  actionType: 'delete',
  communityId: 123
};
performManyModerationActions(workPackage, (err) => {
  if (err) {
    console.error('Batch moderation failed', err);
  } else {
    console.log('Batch moderation succeeded');
  }
});
```

---

# Configuration and Constants

This module does not export configuration objects or constants directly, but relies on context-specific includes and models from other modules.

---

# Related Modules

- [queue.cjs](../../workers/queue.cjs)
- [logger.cjs](../../utils/logger.cjs)
- [get_anonymous_system_user.cjs](../../utils/get_anonymous_system_user.cjs)
- [recount_utils.cjs](../../../utils/recount_utils.cjs)
- [get_moderation_items.cjs](./get_moderation_items.cjs)
- [models/index.cjs](../../../models/index.cjs)

---

# See Also

- [Sequelize Documentation](https://sequelize.org/)
- [Express.js Documentation](https://expressjs.com/)

---

**Note:** This module is intended for internal use by moderation controllers or route handlers. It is not a standalone API endpoint, but provides the core business logic for moderation actions.