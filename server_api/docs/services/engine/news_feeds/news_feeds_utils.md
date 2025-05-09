# Utility Module: newsFeedUtils

This module provides utility functions and configuration constants for querying and processing news feed and activity data, particularly for filtering by date, user, and related entities. It is designed to work with Sequelize models and is used to build complex query options, retrieve date ranges, and define default includes for activity-related queries.

---

## Exported Functions

### activitiesDefaultIncludes(options)
Returns an array of Sequelize include definitions for querying activities with all relevant associations (User, Domain, Community, Group, Post, Point, etc.), with attributes and conditions tailored to the provided options.

#### Parameters

| Name    | Type     | Description                                                                 |
|---------|----------|-----------------------------------------------------------------------------|
| options | object   | Options object, may include `domain_id`, `community_id`, etc.               |

#### Returns

- `Array<object>`: Array of Sequelize include definitions.

---

### getCommonWhereOptions(options)
Builds a Sequelize-compatible `where` object for filtering entities by common fields (status, deleted, user, type, domain, community, group, post) and date filters.

#### Parameters

| Name    | Type     | Description                                                                 |
|---------|----------|-----------------------------------------------------------------------------|
| options | object   | Filtering options (see below for supported keys).                           |

**Supported keys in `options`:**
- `user_id`: `number` or `string`
- `type`: `string`
- `domain_id`: `number` or `string`
- `community_id`: `number` or `string`
- `group_id`: `number` or `string`
- `post_id`: `number` or `string`
- Date filter keys (see `getCommonWhereDateOptions`)

#### Returns

- `object`: Sequelize `where` filter object.

---

### getCommonWhereDateOptions(options)
Builds a Sequelize-compatible `where` object for filtering by date columns, supporting a variety of before/after and inclusive/exclusive date filters.

#### Parameters

| Name    | Type     | Description                                                                 |
|---------|----------|-----------------------------------------------------------------------------|
| options | object   | Date filtering options (see below for supported keys).                      |

**Supported keys in `options`:**
- `dateColumn`: `string` (required) — The column name to filter on.
- `beforeFilter`: `Date|string|number` — Exclusive upper bound.
- `afterFilter`: `Date|string|number` — Exclusive lower bound.
- `beforeOrEqualFilter`: `Date|string|number` — Inclusive upper bound.
- `afterOrEqualFilter`: `Date|string|number` — Inclusive lower bound.
- `beforeDate`: `Date|string|number` — Additional exclusive upper bound.
- `afterDate`: `Date|string|number` — Additional exclusive lower bound.

#### Returns

- `object`: Sequelize `where` filter object for date conditions.

---

### getActivityDate(options, callback)
Finds the most recent or oldest activity date for `AcActivity` matching the given options.

#### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| options  | object   | Filtering options (see `getCommonWhereOptions`).                            |
| callback | function | Callback function `(error: Error|null, date: Date|null) => void`            |

#### Returns

- `void` (calls callback with result).

---

### getNewsFeedDate(options, type, callback)
Finds the most recent or oldest news feed item date for `AcNewsFeedItem` matching the given options and type.

#### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| options  | object   | Filtering options (see `getCommonWhereOptions`).                            |
| type     | string   | News feed item type.                                                        |
| callback | function | Callback function `(error: Error|null, date: Date|null) => void`            |

#### Returns

- `void` (calls callback with result).

---

### getProcessedRange(options, callback)
Finds the most recent or oldest processed range for `AcNewsFeedProcessedRange` matching the given options.

#### Parameters

| Name     | Type     | Description                                                                 |
|----------|----------|-----------------------------------------------------------------------------|
| options  | object   | Filtering options (see `getCommonWhereOptions`).                            |
| callback | function | Callback function `(error: Error|null, item: object|null) => void`          |

#### Returns

- `void` (calls callback with result).

---

## Exported Constants

### defaultKeyActivities

```js
[
  'activity.post.status.change',
  'activity.point.new',
  'activity.post.new',
  'activity.point.newsStory.new'
]
```

- **Type:** `string[]`
- **Description:** List of activity types considered as "key" for news feed and activity processing.

---

### excludeActivitiesFromFilter

```js
[
  'activity.point.newsStory.new',
  'activity.post.status.change'
]
```

- **Type:** `string[]`
- **Description:** List of activity types to be excluded from certain filters.

---

## Example Usage

```javascript
const newsFeedUtils = require('./path/to/newsFeedUtils');

// Build a where filter for activities by user and date
const where = newsFeedUtils.getCommonWhereOptions({
  user_id: 123,
  dateColumn: 'created_at',
  afterDate: '2024-01-01'
});

// Get the latest activity date for a user
newsFeedUtils.getActivityDate({ user_id: 123 }, (err, date) => {
  if (err) throw err;
  console.log('Latest activity date:', date);
});

// Get Sequelize include definitions for querying activities
const includes = newsFeedUtils.activitiesDefaultIncludes({ domain_id: 1 });
```

---

## See Also

- [Sequelize Documentation](https://sequelize.org/master/manual/model-querying-basics.html)
- [models/index.cjs](../../../models/index.cjs) — for model definitions used in includes and queries.

---

## Functions Table

| Name                        | Parameters                                                                 | Return Type         | Description                                                      |
|-----------------------------|----------------------------------------------------------------------------|---------------------|------------------------------------------------------------------|
| activitiesDefaultIncludes   | options: object                                                            | Array<object>       | Returns Sequelize include definitions for activity queries.       |
| getCommonWhereOptions       | options: object                                                            | object              | Builds a `where` filter for common fields and date filters.       |
| getCommonWhereDateOptions   | options: object                                                            | object              | Builds a `where` filter for date columns with flexible options.   |
| getActivityDate             | options: object, callback: function                                        | void                | Finds the latest/oldest activity date for `AcActivity`.           |
| getNewsFeedDate             | options: object, type: string, callback: function                          | void                | Finds the latest/oldest news feed item date for `AcNewsFeedItem`. |
| getProcessedRange           | options: object, callback: function                                        | void                | Finds the latest/oldest processed range for `AcNewsFeedProcessedRange`. |

---

## Notes

- All date filters are designed to be compatible with Sequelize's legacy `$lt`, `$gt`, `$lte`, `$gte`, `$or`, and `$and` operators.
- The module is intended for internal use in news feed and activity processing logic, not as a public API endpoint.
- The `activitiesDefaultIncludes` function is essential for constructing complex queries with all necessary associations for activity feeds.

---

## Related Files

- [models/index.cjs](../../../models/index.cjs) — Sequelize model definitions used throughout this module.

---