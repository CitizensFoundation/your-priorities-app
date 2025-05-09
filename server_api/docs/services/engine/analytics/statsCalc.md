# Utility Module: statsUtils

This module provides utility functions for constructing Sequelize include trees for querying points/posts by domain, community, or group, as well as a function for counting model rows grouped by time periods (days, months, years) with Redis caching.

---

## Functions

### getPointDomainIncludes

Constructs a Sequelize include array for querying points (posts) that belong to a specific domain.

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| id   | number \| string | The ID of the domain to filter by. |

#### Returns

- `Array<Object>`: Sequelize include array for use in queries.

#### Example

```javascript
const includes = getPointDomainIncludes(1);
```

---

### getDomainIncludes

Constructs a Sequelize include array for querying groups and communities that belong to a specific domain.

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| id   | number \| string | The ID of the domain to filter by. |

#### Returns

- `Array<Object>`: Sequelize include array for use in queries.

---

### getPointCommunityIncludes

Constructs a Sequelize include array for querying points (posts) that belong to a specific community.

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| id   | number \| string | The ID of the community to filter by. |

#### Returns

- `Array<Object>`: Sequelize include array for use in queries.

---

### getCommunityIncludes

Constructs a Sequelize include array for querying groups that belong to a specific community.

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| id   | number \| string | The ID of the community to filter by. |

#### Returns

- `Array<Object>`: Sequelize include array for use in queries.

---

### getPointGroupIncludes

Constructs a Sequelize include array for querying points (posts) that belong to a specific group.

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| id   | number \| string | The ID of the group to filter by. |

#### Returns

- `Array<Object>`: Sequelize include array for use in queries.

---

### getGroupIncludes

Constructs a Sequelize include array for querying a specific group.

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| id   | number \| string | The ID of the group to filter by. |

#### Returns

- `Array<Object>`: Sequelize include array for use in queries.

---

### countModelRowsByTimePeriod

Counts the number of rows in a Sequelize model, grouped by day, month, and year, for a given time period. Results are cached in Redis for performance.

#### Parameters

| Name         | Type     | Description |
|--------------|----------|-------------|
| req          | Request  | Express request object. Must have `redisClient` property for Redis access. |
| cacheKey     | string   | Unique key for caching the results in Redis. |
| model        | Sequelize Model | The Sequelize model to query. |
| whereOptions | Object   | Sequelize `where` options for filtering the query. |
| includeOptions | Array  | Sequelize `include` options for related models. |
| done         | function | Callback function: `done(error, results)`. |

#### Returns

- `void` (results are returned via the `done` callback).

#### Response Format

If results are found, the callback receives an object:

```json
{
  "finalDays": [
    { "x": "YYYY-MM-DD", "y": number }
  ],
  "finalMonths": [
    { "x": "YYYY-MM", "y": number }
  ],
  "finalYears": [
    { "x": "YYYY", "y": number }
  ]
}
```

- `finalDays`: Array of objects with date and count per day.
- `finalMonths`: Array of objects with date and count per month.
- `finalYears`: Array of objects with year and count per year.

If no results are found, the callback receives an empty object `{}`.

#### Example

```javascript
countModelRowsByTimePeriod(
  req,
  'activity-login-domain-1',
  models.AcActivity,
  { type: { $in: ["activity.user.login"] }, domain_id: 1 },
  [],
  (err, results) => {
    if (err) { /* handle error */ }
    else { console.log(results); }
  }
);
```

#### Notes

- Uses Redis for caching. The cache TTL is determined by the `STATS_CACHE_TTL` environment variable (default: 5 minutes).
- Uses `moment` for date manipulation and `lodash` for grouping.
- Logs errors using the application's logger utility.

---

## Exported Members

| Name                      | Type       | Description                                      |
|---------------------------|------------|--------------------------------------------------|
| getPointDomainIncludes    | function   | See above.                                       |
| getDomainIncludes         | function   | See above.                                       |
| getPointCommunityIncludes | function   | See above.                                       |
| getCommunityIncludes      | function   | See above.                                       |
| getPointGroupIncludes     | function   | See above.                                       |
| getGroupIncludes          | function   | See above.                                       |
| countModelRowsByTimePeriod| function   | See above.                                       |

---

## Dependencies

- [Sequelize models](../../../models/index.cjs)
- [logger utility](../../utils/logger.cjs)
- [moment](https://momentjs.com/)
- [lodash](https://lodash.com/)

---

## Example Usage

```javascript
const statsUtils = require('./path/to/this/module');

const includes = statsUtils.getPointDomainIncludes(1);

statsUtils.countModelRowsByTimePeriod(
  req,
  'some-cache-key',
  models.SomeModel,
  { someField: 123 },
  includes,
  (err, results) => {
    if (err) { /* handle error */ }
    else { console.log(results); }
  }
);
```

---

## See Also

- [Sequelize Documentation](https://sequelize.org/)
- [Redis Documentation](https://redis.io/)
- [moment Documentation](https://momentjs.com/)
- [lodash Documentation](https://lodash.com/)