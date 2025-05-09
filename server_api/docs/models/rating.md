# Model: Rating

Represents a rating entity in the application, which can be associated with either a post or a point. Each rating is linked to a user, and includes metadata such as IP address and user agent. The model supports soft deletion via the `deleted` flag and stores additional arbitrary data in a JSONB column.

## Properties

| Name         | Type      | Description                                                                 |
|--------------|-----------|-----------------------------------------------------------------------------|
| value        | number    | The rating value. Required.                                                 |
| type_index   | number    | An integer representing the type/category of the rating. Required.          |
| ip_address   | string    | The IP address from which the rating was submitted. Required.               |
| user_agent   | string    | The user agent string of the client submitting the rating. Required.        |
| deleted      | boolean   | Soft delete flag. If true, the rating is considered deleted. Default: false.|
| data         | object    | Optional. Arbitrary JSON data associated with the rating.                   |
| created_at   | Date      | Timestamp when the rating was created.                                      |
| updated_at   | Date      | Timestamp when the rating was last updated.                                 |
| post_id      | number    | (FK) ID of the associated post, if any.                                     |
| point_id     | number    | (FK) ID of the associated point, if any.                                    |
| user_id      | number    | (FK) ID of the user who submitted the rating.                               |

## Configuration

- **underscored**: `true`  
  Uses snake_case for automatically added attributes (e.g., `created_at`).
- **tableName**: `'ratings'`  
  The table name in the database.
- **timestamps**: `true`  
  Enables automatic `created_at` and `updated_at` fields.
- **defaultScope**:  
  By default, queries only return ratings where `deleted` is `false`.
- **indexes**:  
  Multiple indexes are defined to optimize queries involving `post_id`, `point_id`, `user_id`, `type_index`, and `deleted`.

## Associations

| Association Type | Target Model | Foreign Key | Description                                 |
|------------------|--------------|-------------|---------------------------------------------|
| belongsTo        | Post         | post_id     | The post this rating is associated with.    |
| belongsTo        | Point        | point_id    | The point this rating is associated with.   |
| belongsTo        | User         | user_id     | The user who submitted the rating.          |

## Example

```javascript
// Creating a new rating
const rating = await Rating.create({
  value: 5,
  type_index: 1,
  ip_address: '192.168.1.1',
  user_agent: 'Mozilla/5.0',
  post_id: 123,
  user_id: 456
});
```

## Indexes

| Fields                                      | Purpose                                      |
|----------------------------------------------|----------------------------------------------|
| post_id, deleted                            | Fast lookup of ratings for a post (not deleted) |
| post_id, user_id, deleted                   | Fast lookup of a user's rating for a post    |
| post_id, user_id, type_index, deleted       | Fast lookup by post, user, and type          |
| point_id, deleted                           | Fast lookup of ratings for a point (not deleted) |
| point_id, user_id, deleted                  | Fast lookup of a user's rating for a point   |
| point_id, user_id, type_index, deleted      | Fast lookup by point, user, and type         |
| user_id, deleted                            | Fast lookup of all ratings by a user         |

---

**See also:**  
- [Post](./Post.md)  
- [Point](./Point.md)  
- [User](./User.md)  

**File:** `models/rating.js`