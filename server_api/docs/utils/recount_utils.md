# Utility Module: recountUtils

This module provides a set of utility functions for recounting and aggregating statistics (such as endorsements, points, and user counts) for posts, points, groups, and communities in the application. It interacts with the database models to update counters and ensure data consistency.

## Functions

| Name                | Parameters                                      | Return Type | Description                                                                                 |
|---------------------|------------------------------------------------|-------------|---------------------------------------------------------------------------------------------|
| recountCommunity    | communityId: number, callback: Function         | void        | Recounts and updates all counters for a community and its groups.                           |
| recountGroup        | groupId: number, callback: Function             | void        | Recounts and updates all counters for a group.                                              |
| recountPost         | postId: number, done: Function                  | void        | Recounts and updates endorsement and point counters for a post.                              |
| recountPosts        | postIds: number[], done: Function               | void        | Recounts and updates counters for multiple posts in series.                                  |
| recountPoint        | pointId: number, done: Function                 | void        | Recounts and updates quality counters for a point.                                           |
| recountPoints       | pointIds: number[], done: Function              | void        | Recounts and updates counters for multiple points in series.                                 |
| countUsersInGroup   | groupId: number, done: Function                 | void        | Counts unique users who have interacted with a group (endorsements, ratings, points, etc.).  |

---

## Function: recountCommunity

Recounts and updates all counters for a community and its groups, including posts, points, and users.

### Parameters

| Name         | Type     | Description                                      |
|--------------|----------|--------------------------------------------------|
| communityId  | number   | The ID of the community to recount.              |
| callback     | Function | Callback function(error?: any): void             |

### Description

- Finds the community by ID, including its groups (excluding group folders).
- For each group, calls `recountGroup` to update its counters.
- Aggregates post, point, and user counts across all groups.
- Updates the community's counters in the database.

### Example

```javascript
recountCommunity(1, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Community recount complete');
  }
});
```

---

## Function: recountGroup

Recounts and updates all counters for a group, including posts, points, and users.

### Parameters

| Name      | Type     | Description                                 |
|-----------|----------|---------------------------------------------|
| groupId   | number   | The ID of the group to recount.             |
| callback  | Function | Callback function(error?: any, result?: any): void |

### Description

- Finds the group by ID.
- Uses `countAllInGroup` to get post, point, and user counts.
- Updates the group's counters in the database.

### Example

```javascript
recountGroup(1, (error, result) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Group recount complete', result);
  }
});
```

---

## Function: recountPost

Recounts and updates endorsement and point counters for a post.

### Parameters

| Name    | Type     | Description                                 |
|---------|----------|---------------------------------------------|
| postId  | number   | The ID of the post to recount.              |
| done    | Function | Callback function(error?: any): void        |

### Description

- Counts the number of up and down endorsements and points for the post.
- Updates the post's `counter_endorsements_up`, `counter_endorsements_down`, and `counter_points` fields.

### Example

```javascript
recountPost(123, (error) => {
  if (error) {
    console.error(error);
  }
});
```

---

## Function: recountPosts

Recounts and updates counters for multiple posts in series.

### Parameters

| Name     | Type      | Description                                 |
|----------|-----------|---------------------------------------------|
| postIds  | number[]  | Array of post IDs to recount.               |
| done     | Function  | Callback function(error?: any): void        |

### Description

- Iterates over the array of post IDs and calls `recountPost` for each, in series.

### Example

```javascript
recountPosts([1, 2, 3], (error) => {
  if (error) {
    console.error(error);
  }
});
```

---

## Function: recountPoint

Recounts and updates quality counters for a point.

### Parameters

| Name    | Type     | Description                                 |
|---------|----------|---------------------------------------------|
| pointId | number   | The ID of the point to recount.             |
| done    | Function | Callback function(error?: any): void        |

### Description

- Counts the number of up and down quality ratings for the point.
- Updates the point's `counter_quality_up` and `counter_quality_down` fields.

### Example

```javascript
recountPoint(456, (error) => {
  if (error) {
    console.error(error);
  }
});
```

---

## Function: recountPoints

Recounts and updates counters for multiple points in series.

### Parameters

| Name      | Type      | Description                                 |
|-----------|-----------|---------------------------------------------|
| pointIds  | number[]  | Array of point IDs to recount.              |
| done      | Function  | Callback function(error?: any): void        |

### Description

- Iterates over the array of point IDs and calls `recountPoint` for each, in series.

### Example

```javascript
recountPoints([10, 20, 30], (error) => {
  if (error) {
    console.error(error);
  }
});
```

---

## Function: countUsersInGroup

Counts unique users who have interacted with a group (via endorsements, ratings, point qualities, points, or posts).

### Parameters

| Name     | Type     | Description                                 |
|----------|----------|---------------------------------------------|
| groupId  | number   | The ID of the group.                        |
| done     | Function | Callback function(error: any, count: number, userIds: number[]): void |

### Description

- Aggregates user IDs from endorsements, ratings, point qualities, points, and posts associated with the group.
- Returns the count of unique user IDs and the list of all user IDs.

### Example

```javascript
countUsersInGroup(1, (error, count, userIds) => {
  if (error) {
    console.error(error);
  } else {
    console.log(`Unique users: ${count}`, userIds);
  }
});
```

---

## Internal Helper Functions

These are not exported but are used internally by the module:

- **countPostInGroup(groupId, done):** Counts posts in a group.
- **countPointsInGroup(groupId, done):** Counts points in a group.
- **countAllInGroup(groupId, done):** Aggregates post, point, and user counts for a group.

---

## Dependencies

- [async](https://caolan.github.io/async/)
- [lodash](https://lodash.com/)
- [fs](https://nodejs.org/api/fs.html)
- [request](https://github.com/request/request) (not used in this file)
- [models](../models/index.cjs) (Sequelize models)

---

## Exported Functions

```javascript
module.exports = {
  recountCommunity,
  recountGroup,
  recountPost,
  recountPosts,
  recountPoint,
  recountPoints,
  countUsersInGroup
};
```

---

## See Also

- [models/index.cjs](../models/index.cjs) for model definitions (e.g., Post, Point, Endorsement, Group, Community, etc.)
- [lodash documentation](https://lodash.com/docs/)
- [async documentation](https://caolan.github.io/async/)

---

## Example Usage

```javascript
const recountUtils = require('./path/to/this/module');

recountUtils.recountCommunity(1, (error) => {
  if (error) {
    console.error('Error recounting community:', error);
  } else {
    console.log('Community recount complete');
  }
});
```
