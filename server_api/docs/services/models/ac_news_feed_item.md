# Model: AcNewsFeedItem

Represents a news feed item in the application, typically used to aggregate and display activities or notifications in a user's feed. This model is defined using Sequelize and includes associations to several other models, such as Domain, Community, Group, Post, Point, User, Promotion, AcNotification, and AcActivity.

## Properties

| Name                | Type      | Description                                                                 |
|---------------------|-----------|-----------------------------------------------------------------------------|
| type                | string    | The type of the news feed item. Required.                                   |
| latest_activity_at  | Date      | Timestamp of the latest activity related to this item. Required.             |
| status              | string    | Status of the item (default: `'active'`). Required.                         |
| deleted             | boolean   | Indicates if the item is deleted (default: `false`). Required.              |
| created_at          | Date      | Timestamp when the item was created. Managed by Sequelize.                   |
| updated_at          | Date      | Timestamp when the item was last updated. Managed by Sequelize.              |

## Configuration

- **defaultScope**: Only includes items where `status` is `'active'` and `deleted` is `false`.
- **indexes**: 
  - Inherits indexes from `commonIndexForActivitiesAndNewsFeeds('latest_activity_at')`.
  - Index on `id` where `deleted` is `false`.
  - Index on `ac_notification_id` where `status` is `'active'` and `deleted` is `false`.
  - Index on `ac_activity_id` where `status` is `'active'` and `deleted` is `false`.
- **timestamps**: Enabled. Uses `created_at` and `updated_at` as field names.
- **underscored**: Enabled. Field names use snake_case.
- **tableName**: `'ac_news_feed_items'`.

## Associations

| Association Type | Target Model      | Foreign Key           | Description                                      |
|------------------|------------------|-----------------------|--------------------------------------------------|
| belongsTo        | Domain           | domain_id             | The domain this news feed item belongs to.        |
| belongsTo        | Community        | community_id          | The community this news feed item belongs to.     |
| belongsTo        | Group            | group_id              | The group this news feed item belongs to.         |
| belongsTo        | Post             | post_id               | The post associated with this news feed item.     |
| belongsTo        | Point            | point_id              | The point associated with this news feed item.    |
| belongsTo        | User             | user_id               | The user associated with this news feed item.     |
| belongsTo        | Promotion        | promotion_id          | The promotion associated with this news feed item.|
| belongsTo        | AcNotification   | ac_notification_id    | The notification associated with this item.       |
| belongsTo        | AcActivity       | ac_activity_id        | The activity associated with this item.           |

## Indexes

- Inherits indexes from [`commonIndexForActivitiesAndNewsFeeds`](../engine/news_feeds/activity_and_item_index_definitions.md) (applied to `latest_activity_at`).
- Index on `id` where `deleted` is `false`.
- Index on `ac_notification_id` where `status` is `'active'` and `deleted` is `false`.
- Index on `ac_activity_id` where `status` is `'active'` and `deleted` is `false`.

## Example

```javascript
const { AcNewsFeedItem } = require('./models');

const item = await AcNewsFeedItem.create({
  type: 'post',
  latest_activity_at: new Date(),
  status: 'active',
  deleted: false
});
```

## Related Modules

- [commonIndexForActivitiesAndNewsFeeds](../engine/news_feeds/activity_and_item_index_definitions.md): Provides common index definitions for activities and news feeds.

---

**Note:** This model is typically used as part of a larger news feed or activity stream system, aggregating references to various entities (posts, points, notifications, etc.) for efficient querying and display.