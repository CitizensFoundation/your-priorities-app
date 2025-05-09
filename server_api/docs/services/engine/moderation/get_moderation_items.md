# Service Module: moderationService

This module provides utility functions and service methods for retrieving and counting moderated items (such as posts and points) in the system, filtered by domain, community, group, or user. It builds complex Sequelize include trees for querying related models and formats moderation data for downstream use (e.g., moderation dashboards).

---

## Exported Functions

| Name                                 | Parameters                | Return Type | Description                                                                                 |
|-------------------------------------- |--------------------------|-------------|---------------------------------------------------------------------------------------------|
| domainIncludes                       | domainId: number         | Array       | Returns Sequelize include tree for filtering by domain.                                      |
| communityIncludes                    | communityId: number      | Array       | Returns Sequelize include tree for filtering by community.                                   |
| groupIncludes                        | groupId: number          | Array       | Returns Sequelize include tree for filtering by group.                                       |
| userIncludes                         | userId: number           | Array       | Returns Sequelize include tree for filtering by user.                                        |
| getAllModeratedItemsByDomain         | options: object, callback: function | void        | Retrieves all moderated items filtered by domain.                                            |
| getAllModeratedItemsByUser           | options: object, callback: function | void        | Retrieves all moderated items filtered by user.                                              |
| getAllModeratedItemsByCommunity      | options: object, callback: function | void        | Retrieves all moderated items filtered by community.                                         |
| getAllModeratedItemsByGroup          | options: object, callback: function | void        | Retrieves all moderated items filtered by group.                                             |
| countAllModeratedItemsByDomain       | options: object, callback: function | void        | Counts all moderated items filtered by domain.                                               |
| countAllModeratedItemsByCommunity    | options: object, callback: function | void        | Counts all moderated items filtered by community.                                            |
| countAllModeratedItemsByGroup        | options: object, callback: function | void        | Counts all moderated items filtered by group.                                                |
| countAllModeratedItemsByUser         | options: object, callback: function | void        | Counts all moderated items filtered by user.                                                 |

---

## Functions

### domainIncludes

Returns a Sequelize include tree for filtering items by a specific domain.

#### Parameters

| Name      | Type   | Description                |
|-----------|--------|----------------------------|
| domainId  | number | The ID of the domain.      |

#### Returns

- `Array`: Sequelize include configuration.

---

### communityIncludes

Returns a Sequelize include tree for filtering items by a specific community.

#### Parameters

| Name         | Type   | Description                |
|--------------|--------|----------------------------|
| communityId  | number | The ID of the community.   |

#### Returns

- `Array`: Sequelize include configuration.

---

### groupIncludes

Returns a Sequelize include tree for filtering items by a specific group.

#### Parameters

| Name     | Type   | Description                |
|----------|--------|----------------------------|
| groupId  | number | The ID of the group.       |

#### Returns

- `Array`: Sequelize include configuration.

---

### userIncludes

Returns a Sequelize include tree for filtering items by a specific user.

#### Parameters

| Name    | Type   | Description                |
|---------|--------|----------------------------|
| userId  | number | The ID of the user.        |

#### Returns

- `Array`: Sequelize include configuration.

---

### getAllModeratedItemsByDomain

Retrieves all moderated items (posts and points) filtered by a specific domain.

#### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| options  | object   | Query options (must include `domainId` and other filtering/paging options). |
| callback | function | Callback function `(error, items)`                                          |

#### Returns

- `void` (results are passed to callback)

---

### getAllModeratedItemsByCommunity

Retrieves all moderated items (posts and points) filtered by a specific community.

#### Parameters

| Name     | Type     | Description                                                                   |
|----------|----------|-------------------------------------------------------------------------------|
| options  | object   | Query options (must include `communityId` and other filtering/paging options).|
| callback | function | Callback function `(error, items)`                                            |

#### Returns

- `void` (results are passed to callback)

---

### getAllModeratedItemsByGroup

Retrieves all moderated items (posts and points) filtered by a specific group.

#### Parameters

| Name     | Type     | Description                                                               |
|----------|----------|---------------------------------------------------------------------------|
| options  | object   | Query options (must include `groupId` and other filtering/paging options).|
| callback | function | Callback function `(error, items)`                                        |

#### Returns

- `void` (results are passed to callback)

---

### getAllModeratedItemsByUser

Retrieves all moderated items (posts and points) filtered by a specific user.

#### Parameters

| Name     | Type     | Description                                                              |
|----------|----------|--------------------------------------------------------------------------|
| options  | object   | Query options (must include `userId` and other filtering/paging options).|
| callback | function | Callback function `(error, items)`                                       |

#### Returns

- `void` (results are passed to callback)

---

### countAllModeratedItemsByDomain

Counts all moderated items (posts and points) filtered by a specific domain.

#### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| options  | object   | Query options (must include `domainId` and other filtering/paging options). |
| callback | function | Callback function `(error, count)`                                          |

#### Returns

- `void` (results are passed to callback)

---

### countAllModeratedItemsByCommunity

Counts all moderated items (posts and points) filtered by a specific community.

#### Parameters

| Name     | Type     | Description                                                                   |
|----------|----------|-------------------------------------------------------------------------------|
| options  | object   | Query options (must include `communityId` and other filtering/paging options).|
| callback | function | Callback function `(error, count)`                                            |

#### Returns

- `void` (results are passed to callback)

---

### countAllModeratedItemsByGroup

Counts all moderated items (posts and points) filtered by a specific group.

#### Parameters

| Name     | Type     | Description                                                               |
|----------|----------|---------------------------------------------------------------------------|
| options  | object   | Query options (must include `groupId` and other filtering/paging options).|
| callback | function | Callback function `(error, count)`                                        |

#### Returns

- `void` (results are passed to callback)

---

### countAllModeratedItemsByUser

Counts all moderated items (posts and points) filtered by a specific user.

#### Parameters

| Name     | Type     | Description                                                              |
|----------|----------|--------------------------------------------------------------------------|
| options  | object   | Query options (must include `userId` and other filtering/paging options).|
| callback | function | Callback function `(error, count)`                                       |

#### Returns

- `void` (results are passed to callback)

---

## Internal Utility Functions

These are not exported but are key to the module's operation.

### getModelModeration

Fetches all moderation items for a given model (e.g., Post, Point) with filtering and includes.

#### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| options  | object   | Query options: model, includes, order, attributes, allContent, etc.         |
| callback | function | Callback function `(error, items)`                                          |

---

### countModelModeration

Counts all moderation items for a given model (e.g., Post, Point) with filtering and includes.

#### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| options  | object   | Query options: model, includes, allContent, etc.                            |
| callback | function | Callback function `(error, count)`                                          |

---

### getAllModeratedItemsByMaster

Fetches all moderated items (posts and points) using a shared logic base, with custom includes.

#### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| options  | object   | Query options: includes, userId, etc.                                       |
| callback | function | Callback function `(error, items)`                                          |

---

### countAllModeratedItemsByMaster

Counts all moderated items (posts and points) using a shared logic base, with custom includes.

#### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| options  | object   | Query options: includes, userId, etc.                                       |
| callback | function | Callback function `(error, count)`                                          |

---

### getPushItem

Formats a moderation item (post or point) into a standardized object for downstream use.

#### Parameters

| Name   | Type   | Description                                 |
|--------|--------|---------------------------------------------|
| type   | string | Either `'post'` or `'point'`.               |
| model  | object | The Sequelize model instance.                |

#### Returns

- `object`: Formatted moderation item.

---

### getItems

Combines and sorts posts and points into a single array of formatted moderation items.

#### Parameters

| Name    | Type    | Description                                 |
|---------|---------|---------------------------------------------|
| posts   | Array   | Array of post model instances.              |
| points  | Array   | Array of point model instances.             |
| options | object  | Options object (e.g., `allContent`).        |

#### Returns

- `Array`: Sorted and formatted moderation items.

---

### _toPercent

Converts a number (e.g., toxicity score) to a percentage string.

#### Parameters

| Name    | Type    | Description                                 |
|---------|---------|---------------------------------------------|
| number  | number  | The number to convert.                      |

#### Returns

- `string | undefined`: Percentage string (e.g., `'85%'`), or `undefined` if input is falsy.

---

## Example Usage

```javascript
const moderationService = require('./path/to/this/module');

// Get all moderated items for a domain
moderationService.getAllModeratedItemsByDomain(
  { domainId: 123, allContent: false },
  (err, items) => {
    if (err) throw err;
    console.log(items);
  }
);

// Count all moderated items for a user
moderationService.countAllModeratedItemsByUser(
  { userId: 456 },
  (err, count) => {
    if (err) throw err;
    console.log('Total moderated items for user:', count);
  }
);
```

---

## Dependencies

- [Sequelize models](../../../models/index.cjs)
- [async](https://caolan.github.io/async/)
- [lodash](https://lodash.com/)
- [moment](https://momentjs.com/)
- [logger utility](../../utils/logger.cjs)
- [i18n utility](../../utils/i18n.cjs)

---

## See Also

- [Group Model](../../../models/index.cjs)
- [Community Model](../../../models/index.cjs)
- [Domain Model](../../../models/index.cjs)
- [User Model](../../../models/index.cjs)
- [Post Model](../../../models/index.cjs)
- [Point Model](../../../models/index.cjs)
- [PointRevision Model](../../../models/index.cjs)
- [Audio Model](../../../models/index.cjs)
- [Image Model](../../../models/index.cjs)

---

**Note:** This module is intended for internal use in moderation dashboards and admin tools. It is not an Express route handler but is typically called from controllers or service layers.