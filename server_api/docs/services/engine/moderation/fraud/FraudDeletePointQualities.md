# Service: FraudDeletePointQualities

`FraudDeletePointQualities` is a service class extending `FraudDeleteBase`. It provides specialized logic for deleting (soft-deleting) `PointQuality` records in bulk, ensuring that only records belonging to a specific community (as defined by the `workPackage`) are affected. It also tracks which `Point` entities need to be recounted after deletion.

**Location:** `path/to/this/file/FraudDeletePointQualities.cjs`

## Extends

- [FraudDeleteBase](./FraudDeleteBase.md)

## Constructor

Inherits the constructor from `FraudDeleteBase`. The class expects the following properties to be available (typically set by the base class or the job context):

- `this.workPackage.communityId`: The community context for deletion.
- `this.job.internal_data.idsToDelete`: Array of `PointQuality` IDs to delete.
- `this.pointsToRecount`: Array to track `Point` IDs that need recounting.

---

## Methods

### destroyChunkItems(items)

Soft-deletes a chunk of `PointQuality` items by setting their `deleted` property to `true`. Only items belonging to the specified community are affected. Also tracks which `Point` entities need to be recounted.

#### Parameters

| Name  | Type    | Description                                 |
|-------|---------|---------------------------------------------|
| items | Array<{ id: number, Point: { id: number } }> | Array of `PointQuality` items to delete. Each item must have an `id` and a nested `Point` object with an `id`. |

#### Returns

- `Promise<void>` — Resolves when the operation is complete.

#### Description

- Performs a bulk update on the `PointQuality` model, setting `deleted: true` for all items whose `id` is in the provided array and which belong to the correct community (checked via nested includes).
- For each item, if its `Point.id` is not already in `this.pointsToRecount`, it is added to that array.

#### Example

```javascript
await fraudDeletePointQualities.destroyChunkItems([
  { id: 1, Point: { id: 10 } },
  { id: 2, Point: { id: 11 } }
]);
```

---

### getItemsById()

Fetches all `PointQuality` items by their IDs (from `this.job.internal_data.idsToDelete`), including related `User`, `Point`, `Post`, `Group`, and `Community` data. Only items belonging to the specified community are returned. The results are sorted by `point_id` and `user_agent`.

#### Parameters

None

#### Returns

- `Promise<Array<PointQuality>>` — Resolves to an array of `PointQuality` items with included associations.

#### Description

- Queries the `PointQuality` model for all records whose `id` is in `this.job.internal_data.idsToDelete`.
- Includes related `User`, `Point`, `Post`, `Group`, and `Community` models for context and validation.
- Only items belonging to the specified community are included.
- The result is sorted by `point_id` and `user_agent` using `lodash.sortBy`.

#### Example

```javascript
const items = await fraudDeletePointQualities.getItemsById();
```

---

## Dependencies

- [lodash](https://lodash.com/) — Used for sorting the result set.
- [models](../../../../models/index.cjs) — Sequelize models for database access.
- [FraudDeleteBase](./FraudDeleteBase.md) — Base class providing shared deletion logic.

---

## Usage Example

```javascript
const FraudDeletePointQualities = require('./FraudDeletePointQualities.cjs');
const instance = new FraudDeletePointQualities(/* ...args */);

const items = await instance.getItemsById();
await instance.destroyChunkItems(items);
```

---

## See Also

- [FraudDeleteBase](./FraudDeleteBase.md)
- [PointQuality Model](../../../../models/PointQuality.md) (if available)
- [Sequelize Documentation](https://sequelize.org/)

---

## Notes

- The code uses `$in` for Sequelize queries, which may be deprecated in favor of `Op.in`. Consider updating for compatibility.
- The code uses Lodash for sorting; a TODO comment suggests replacing this with native JS.
- The deletion is a "soft delete" (sets `deleted: true`), not a hard delete.
- The class is designed for use in a batch job or background task context, not as a direct API endpoint.

---

## Export

```javascript
module.exports = FraudDeletePointQualities;
```
Exports the `FraudDeletePointQualities` class for use in other modules.