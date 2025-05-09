# Service Module: news_feed_dynamic.cjs

This module provides core business logic for dynamically generating and curating a user's news feed. It interacts with the database models, applies recommendation logic, filters, deduplication, and manages processed ranges for efficient news feed delivery. The main exported functions are `getNewsFeedItems` and `getCuratedNewsItems`.

---

## Exported Functions

| Name                | Parameters                                 | Return Type | Description                                                                                 |
|---------------------|--------------------------------------------|-------------|---------------------------------------------------------------------------------------------|
| getNewsFeedItems    | options: object, callback: Function        | void        | Retrieves news feed items for a user, ordered and filtered according to provided options.    |
| getCuratedNewsItems | options: object, callback: Function        | void        | Retrieves a curated, deduplicated, and recommendation-aware news feed for a user.            |

---

## Function: getNewsFeedItems

Retrieves news feed items for a user, ordered by latest activity and including related models. Used to fetch the current news feed, typically for display in the UI.

### Parameters

| Name     | Type     | Description                                      |
|----------|----------|--------------------------------------------------|
| options  | object   | Query options (user, filters, limit, etc.)       |
| callback | Function | Callback function (error, items)                 |

#### `options` object may include:
- `user_id`: `number` – The ID of the user whose feed is being fetched.
- `limit`: `number` – Maximum number of items to return (default: 20).
- Additional filters as required by `getCommonWhereOptions`.

### Callback Signature

```js
function callback(error: Error | null, items: Array<AcNewsFeedItem>)
```

### Description

- Fetches news feed items from the `AcNewsFeedItem` model.
- Orders by `latest_activity_at` descending and includes related activity, user, organization, and images.
- Applies filters and limits as specified in `options`.

---

## Function: getCuratedNewsItems

Retrieves a curated news feed for a user, ensuring deduplication, recommendation filtering, and efficient range processing. This is the main entry point for generating a user's dynamic news feed.

### Parameters

| Name     | Type     | Description                                      |
|----------|----------|--------------------------------------------------|
| options  | object   | Query options (user, filters, etc.)              |
| callback | Function | Callback function (error, activities, oldestActivityAt) |

#### `options` object may include:
- `user_id`: `number` – The ID of the user.
- `domain_id`, `community_id`, `group_id`, `post_id`: `number` – Contextual filters.
- `afterDate`, `beforeDate`: `string` (ISO date) – Date range filters.

### Callback Signature

```js
function callback(
  error: Error | null,
  activities: Array<AcActivity> | undefined,
  oldestActivityAt: string | null | undefined
)
```

### Description

- Uses a loop to ensure only non-empty processed ranges are returned.
- If new activities exist since the last processed range, generates a new news feed from activities.
- Otherwise, fetches news feed items from the last processed range.
- Handles deduplication, recommendation filtering, and range management.

---

## Internal Functions

### getAllActivities

Fetches all activities relevant to the news feed, filtered by key activity types and options.

#### Parameters

| Name     | Type     | Description                                      |
|----------|----------|--------------------------------------------------|
| options  | object   | Query options                                    |
| callback | Function | Callback function (error, activities)            |

---

### filterRecommendations

Filters activities based on recommendations, ensuring a minimum threshold of recommended items and supplementing with non-recommended ones as needed.

#### Parameters

| Name         | Type     | Description                                      |
|--------------|----------|--------------------------------------------------|
| allActivities| Array    | List of activities to filter                     |
| options      | object   | Filtering options (user_id, date range, etc.)    |
| callback     | Function | Callback function (error, filteredActivities)    |

---

### removeDuplicates

Removes activities that are already present in the user's news feed.

#### Parameters

| Name         | Type     | Description                                      |
|--------------|----------|--------------------------------------------------|
| allActivities| Array    | List of activities to deduplicate                |
| options      | object   | Filtering options                                |
| callback     | Function | Callback function (error, deduplicatedActivities)|

---

### createNewsFeedItemsFromActivities

Creates new news feed items in the database from a list of activities.

#### Parameters

| Name         | Type     | Description                                      |
|--------------|----------|--------------------------------------------------|
| allActivities| Array    | List of activities to insert                     |
| options      | object   | Contextual options (user, domain, etc.)          |
| callback     | Function | Callback function (error, result)                |

---

### loadOtherNewsItemsInRange

Loads other news feed items created from notifications within a specific activity range.

#### Parameters

| Name           | Type     | Description                                      |
|----------------|----------|--------------------------------------------------|
| latestActivity | object   | The latest activity object                       |
| oldestActivity | object   | The oldest activity object                       |
| options        | object   | Filtering options                                |
| callback       | Function | Callback function (error, newsItems)             |

---

### createProcessedRange

Creates a record in the database marking the processed range of activities for the news feed.

#### Parameters

| Name           | Type     | Description                                      |
|----------------|----------|--------------------------------------------------|
| latestActivity | object   | The latest activity object                       |
| oldestActivity | object   | The oldest activity object                       |
| options        | object   | Contextual options                               |
| callback       | Function | Callback function (error, result)                |

---

### generateNewsFeedFromActivities

Orchestrates the process of generating a news feed from activities, including filtering, deduplication, and range management.

#### Parameters

| Name     | Type     | Description                                      |
|----------|----------|--------------------------------------------------|
| options  | object   | Query options                                    |
| callback | Function | Callback function (error, finalActivities, oldestActivityAt) |

---

### getNewsFeedItemsFromProcessedRange

Fetches news feed items from a previously processed range. If the range is empty, marks it as deleted.

#### Parameters

| Name          | Type     | Description                                      |
|---------------|----------|--------------------------------------------------|
| processedRange| object   | The processed range object                       |
| options       | object   | Filtering options                                |
| callback      | Function | Callback function (error, possibleEmptyRanges, activities, oldestActivityAt) |

---

## Constants

| Name                         | Type   | Value | Description                                               |
|------------------------------|--------|-------|-----------------------------------------------------------|
| GENERAL_NEWS_FEED_LIMIT      | number | 20    | Default maximum number of news feed items to return.      |
| RECOMMENDATION_FILTER_THRESHOLD | number | 14    | Minimum number of recommended items to include in feed.   |

---

## Dependencies

- [models](../../../models/index.cjs): Sequelize models for database access.
- [async](https://caolan.github.io/async/): For control flow (series, parallel, whilst).
- [log](../../utils/logger.cjs): Logging utility.
- [lodash](https://lodash.com/): Utility functions for array/object manipulation.
- [getRecommendationFor](../recommendations/events_manager.cjs): Recommendation engine.
- [news_feeds_utils.cjs](./news_feeds_utils.cjs): Utility functions for news feed logic.
- [airbrake](../../utils/airbrake.cjs): Error reporting (optional, if configured).

---

## Example Usage

```javascript
const newsFeedDynamic = require('./news_feed_dynamic.cjs');

const options = {
  user_id: 123,
  domain_id: 1,
  community_id: 2,
  group_id: 3,
  post_id: 4,
  limit: 10
};

newsFeedDynamic.getCuratedNewsItems(options, (error, activities, oldestActivityAt) => {
  if (error) {
    // handle error
  } else {
    // activities is an array of AcActivity objects
    // oldestActivityAt is the timestamp of the oldest activity in the range
  }
});
```

---

## Related Modules

- [news_feeds_utils.cjs](./news_feeds_utils.md): Utility functions for news feed logic.
- [events_manager.cjs](../recommendations/events_manager.md): Recommendation logic.
- [logger.cjs](../../utils/logger.md): Logging utility.
- [airbrake.cjs](../../utils/airbrake.md): Error reporting.

---

## Models Used

- `AcNewsFeedItem`: News feed item model.
- `AcActivity`: Activity model.
- `AcNewsFeedProcessedRange`: Model for processed activity ranges.
- `User`, `Organization`, `Image`: Related models for user and organization data.

For model details, see the [models documentation](../../../models/index.md).

---

## Notes

- This module is not an Express route handler, but is intended to be used by controllers or route handlers to provide news feed data.
- All database operations are performed using Sequelize.
- Error handling is robust, with optional Airbrake integration for error reporting.
- The logic ensures that users receive a mix of recommended and non-recommended activities, with deduplication and range management for efficiency.

---

**Exports:**
```js
module.exports = {
  getNewsFeedItems,
  getCuratedNewsItems
};
```
