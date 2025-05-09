# Service: FraudDeleteEndorsements

`FraudDeleteEndorsements` is a service class extending `FraudDeleteBase`. It provides specialized logic for deleting and analyzing "Endorsement" records in bulk, with additional filtering and recounting logic based on related `Post`, `Group`, and `Community` models. This service is typically used in the context of fraud detection and cleanup jobs.

**Extends:** [`FraudDeleteBase`](./FraudDeleteBase.md)

**Location:** `path/to/this/file.cjs`

## Constructor

Inherits the constructor from `FraudDeleteBase`. The parent class is expected to initialize properties such as `this.workPackage`, `this.job`, and `this.postsToRecount`.

---

## Methods

### destroyChunkItemsByModel

```typescript
async destroyChunkItemsByModel(model: any, items: Array<any>): Promise<void>
```

Marks a chunk of items as deleted in the specified model, ensuring that only items belonging to the correct community are affected. Also tracks posts that need to be recounted.

#### Parameters

| Name   | Type         | Description                                      |
|--------|--------------|--------------------------------------------------|
| model  | any          | The Sequelize model to update (e.g., Endorsement)|
| items  | Array<any>   | Array of items to be deleted (must have `id` and `post_id` fields) |

#### Returns

- `Promise<void>` — Resolves when the operation is complete.

#### Details

- Updates the `deleted` field to `true` for all items whose `id` is in the `items` array, but only if they are associated with the correct `Community` (via `Post` and `Group`).
- Adds each unique `post_id` from the items to `this.postsToRecount` for later processing.

#### Example

```javascript
await instance.destroyChunkItemsByModel(models.Endorsement, items);
```

---

### destroyChunkItems

```typescript
async destroyChunkItems(items: Array<any>): Promise<void>
```

Deletes a chunk of `Endorsement` items by marking them as deleted.

#### Parameters

| Name   | Type         | Description                                      |
|--------|--------------|--------------------------------------------------|
| items  | Array<any>   | Array of Endorsement items to be deleted         |

#### Returns

- `Promise<void>`

#### Details

- Calls `destroyChunkItemsByModel` with the `Endorsement` model.

---

### getModelItemsById

```typescript
async getModelItemsById(model: any, getGroup?: boolean): Promise<{ itemsToAnalyse: Array<any>, groupConfiguration?: any }>
```

Fetches items from the specified model by IDs, including related `User`, `Post`, `Group`, and `Community` data. Optionally retrieves the configuration for the associated group.

#### Parameters

| Name     | Type    | Description                                                                 |
|----------|---------|-----------------------------------------------------------------------------|
| model    | any     | The Sequelize model to query (e.g., Endorsement)                            |
| getGroup | boolean | If true, also fetches the configuration of the group related to the first item |

#### Returns

- `Promise<{ itemsToAnalyse: Array<any>, groupConfiguration?: any }>` — Sorted items and optional group configuration.

#### Details

- Filters items by `id` using `this.job.internal_data.idsToDelete`.
- Includes related `User` (with `id` and `email`), `Post` (with `id` and `name`), `Group`, and `Community` (filtered by `this.workPackage.communityId`).
- Sorts the results by `post_id` and `user_agent`.
- If `getGroup` is true, fetches the `configuration` field from the related `Group`.

#### Example

```javascript
const { itemsToAnalyse, groupConfiguration } = await instance.getModelItemsById(models.Endorsement, true);
```

---

### getItemsById

```typescript
async getItemsById(): Promise<Array<any>>
```

Fetches and returns the sorted list of `Endorsement` items to analyze, based on IDs in the current job.

#### Returns

- `Promise<Array<any>>` — The sorted items to analyze.

#### Details

- Calls `getModelItemsById` with the `Endorsement` model and returns only the `itemsToAnalyse` array.

#### Example

```javascript
const items = await instance.getItemsById();
```

---

## Inherited Properties

- `this.workPackage`: Contains context such as `communityId`.
- `this.job`: Contains job-specific data, including `internal_data.idsToDelete`.
- `this.postsToRecount`: Array of post IDs that need recounting after deletion.

---

## Dependencies

- [`FraudDeleteBase`](./FraudDeleteBase.md): The base class providing shared logic for fraud deletion jobs.
- `models`: Sequelize models, including `Endorsement`, `Post`, `Group`, `Community`, and `User`.
- `lodash`: Used for sorting (`_.sortBy`).

---

## Export

```typescript
module.exports = FraudDeleteEndorsements;
```

---

## See Also

- [models/index.cjs](../../../../models/index.cjs) — Sequelize models used for database operations.
- [FraudDeleteBase](./FraudDeleteBase.md) — The base class for fraud deletion logic.

---

## Example Usage

```javascript
const FraudDeleteEndorsements = require('./FraudDeleteEndorsements.cjs');
const instance = new FraudDeleteEndorsements(/* ...args */);

await instance.destroyChunkItems(items);
const itemsToAnalyse = await instance.getItemsById();
```
