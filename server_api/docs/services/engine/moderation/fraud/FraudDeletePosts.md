# Service Class: FraudDeletePosts

`FraudDeletePosts` is a service class responsible for handling the deletion of posts identified as fraudulent within a specific community context. It extends the [`FraudDeleteEndorsements`](./FraudDeleteEndorsements.md) class, inheriting its fraud detection and deletion logic, and specializes it for the `Post` model. The class interacts with the database models for `Post`, `Group`, `Community`, and `User` to perform bulk updates and fetch operations.

**Location:** `path/to/your/file/FraudDeletePosts.cjs`

## Inheritance

- **Extends:** [`FraudDeleteEndorsements`](./FraudDeleteEndorsements.md)

## Dependencies

- [`lodash`](https://lodash.com/) (for sorting)
- `models` (Sequelize models: `Post`, `Group`, `Community`, `User`)

---

## Methods

### destroyChunkItems(items)

Asynchronously marks a chunk of posts as deleted in the database, ensuring that only posts belonging to the correct community are affected.

#### Parameters

| Name  | Type   | Description                                 |
|-------|--------|---------------------------------------------|
| items | Array<{ id: number }> | Array of post objects to be deleted. Each object must have an `id` property. |

#### Returns

- `Promise<void>` — Resolves when the update is complete, or rejects with an error.

#### Description

- Maps the input `items` to extract their `id`s.
- Performs a bulk update on the `Post` model, setting `deleted: true` for all posts whose `id` is in the list and which belong to the specified community (via nested `Group` and `Community` includes).
- Uses Sequelize's `include` to ensure only posts in the correct community are affected.
- Resolves the promise on success, rejects on error.

#### Example Usage

```javascript
await fraudDeletePostsInstance.destroyChunkItems([{ id: 1 }, { id: 2 }]);
```

---

### getItemsById()

Fetches post items by their IDs, including related user and group information, and sorts them for further analysis.

#### Parameters

_None_

#### Returns

- `Promise<Array<Post>>` — Resolves with an array of post instances, each including selected attributes and related user/group data.

#### Description

- Fetches posts whose IDs are listed in `this.job.internal_data.idsToDelete`.
- Includes related `User` (with `id` and `email`) and `Group` (with `id`), and ensures the group belongs to the correct community.
- Selects specific attributes for each post: `id`, `created_at`, `group_id`, `user_id`, `user_agent`, `ip_address`, `data`.
- Sorts the resulting items by `group_id` and `user_agent` using lodash's `sortBy`.
- Resolves the promise with the sorted array, or rejects on error.

#### Example Usage

```javascript
const items = await fraudDeletePostsInstance.getItemsById();
```

---

## Constructor

The constructor is inherited from [`FraudDeleteEndorsements`](./FraudDeleteEndorsements.md). It is expected that `this.workPackage` and `this.job` are set up by the parent class or by the instantiating code.

---

## Related Models

- **Post**: The main model being updated and queried.
- **Group**: Used to ensure posts belong to the correct group/community.
- **Community**: Used to scope deletions to a specific community.
- **User**: Included for additional context in queries.

---

## Export

```javascript
module.exports = FraudDeletePosts;
```

---

## See Also

- [FraudDeleteEndorsements](./FraudDeleteEndorsements.md)
- [Sequelize Models](../../../../models/index.cjs)

---

## Example

```javascript
const FraudDeletePosts = require('./FraudDeletePosts.cjs');
const instance = new FraudDeletePosts(/* ...args */);

await instance.destroyChunkItems([{ id: 123 }, { id: 456 }]);
const items = await instance.getItemsById();
```

---

## Notes

- This class is intended for internal use in batch or background jobs that process fraudulent content.
- The `$in` operator in the Sequelize `where` clause is deprecated; consider using `Op.in` for future compatibility.
- All database operations are wrapped in Promises for explicit resolve/reject handling, though `async/await` alone would suffice in modern Node.js.

---

**For more information on the parent class and shared logic, see [FraudDeleteEndorsements](./FraudDeleteEndorsements.md).**