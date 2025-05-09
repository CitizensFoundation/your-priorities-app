# Service: FraudDeletePointQualities

`FraudDeletePointQualities` is a service class extending `FraudDeleteBase`. It provides specialized logic for deleting "Point" entities (likely representing user contributions or votes) in bulk, with additional checks and recount triggers for related posts. It interacts with the application's Sequelize models, especially `Point`, `Post`, `Group`, `Community`, and `User`.

**Extends:** [`FraudDeleteBase`](./FraudDeleteBase.md)

## Methods

| Name              | Parameters         | Return Type | Description                                                                                 |
|-------------------|-------------------|-------------|---------------------------------------------------------------------------------------------|
| destroyChunkItems | items: Array<any> | Promise<void> | Marks a chunk of Point items as deleted and updates recount tracking for related posts.      |
| getItemsById      | none              | Promise<Array<any>> | Retrieves Point items by IDs, including related User, Post, Group, and Community data.       |

---

## Method: destroyChunkItems

Marks a batch of Point items as deleted in the database and tracks related posts for recounting. Ensures that only Points belonging to the correct Community (via nested includes) are affected.

### Parameters

| Name  | Type        | Description                                 |
|-------|-------------|---------------------------------------------|
| items | Array<any>  | Array of Point items to be deleted. Each item should have at least an `id` and a `Post` property. |

### Returns

- `Promise<void>` — Resolves when the operation is complete.

### Description

- Updates the `deleted` flag to `true` for all Points whose IDs are in the `items` array.
- Ensures Points belong to the correct Community by traversing related models (`Post` → `Group` → `Community`).
- For each item, if its related Post's ID is not already in `this.postsToRecount`, adds it to the list for later recounting.

### Example

```javascript
await fraudDeletePointQualities.destroyChunkItems([
  { id: 1, Post: { id: 10 } },
  { id: 2, Post: { id: 11 } }
]);
```

---

## Method: getItemsById

Fetches Point items by their IDs, including related User, Post, Group, and Community data, and sorts them for further analysis.

### Parameters

None

### Returns

- `Promise<Array<any>>` — Resolves to an array of Point items with included associations.

### Description

- Finds all Points whose IDs are listed in `this.job.internal_data.idsToDelete`.
- Includes associated User (with `id` and `email`), Post (with `id` and `name`), Group, and Community (filtered by `this.workPackage.communityId`).
- Returns a sorted array of items, sorted by `point_id` and `user_agent`.

### Example

```javascript
const items = await fraudDeletePointQualities.getItemsById();
```

---

## Properties (Inherited and Used)

| Name                | Type         | Description                                                                 |
|---------------------|--------------|-----------------------------------------------------------------------------|
| workPackage         | any          | Contains context for the current work, including `communityId`.             |
| job                 | any          | Contains job-specific data, including `internal_data.idsToDelete`.          |
| postsToRecount      | Array<number>| List of Post IDs that need to be recounted after deletion.                  |

---

## Dependencies

- [`FraudDeleteBase`](./FraudDeleteBase.md): The base class providing shared fraud deletion logic.
- `models`: Sequelize models, including `Point`, `Post`, `Group`, `Community`, and `User`.
- `lodash`: Used for sorting items.

---

## Export

```javascript
module.exports = FraudDeletePointQualities;
```

---

## See Also

- [FraudDeleteBase](./FraudDeleteBase.md)
- [Sequelize Models](../../../../models/index.cjs)
- [Lodash Documentation](https://lodash.com/docs/4.17.15)

---

**Note:**  
- This class is intended for internal use in batch deletion and recounting logic, likely as part of a larger fraud detection or moderation system.
- All database operations are performed using Sequelize ORM, and the class expects certain properties (`workPackage`, `job`, `postsToRecount`) to be set by the parent class or calling context.