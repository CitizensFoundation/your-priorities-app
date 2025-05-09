# Service Class: FraudDeleteBase

`FraudDeleteBase` is an abstract base class for handling fraud-related deletion operations in a community platform. It extends [FraudBase](./FraudBase.md) and provides a framework for deleting items (such as posts or endorsements) in bulk, recounting related statistics, and logging audit information. This class is intended to be subclassed, with certain methods (e.g., `getItemsById`, `destroyChunkItems`) implemented in derived classes.

---

## Inheritance

- **Extends:** [FraudBase](./FraudBase.md)

---

## Constructor

### `constructor(workPackage: any)`

Initializes a new instance of `FraudDeleteBase`.

| Name        | Type | Description                        |
|-------------|------|------------------------------------|
| workPackage | any  | The work package/job context object |

---

## Properties

| Name             | Type   | Description                                               |
|------------------|--------|-----------------------------------------------------------|
| postsToRecount   | any[]  | List of post IDs/items to recount after deletion          |
| pointsToRecount  | any[]  | List of point IDs/items to recount after deletion         |
| job              | any    | The background job object (populated during execution)    |
| items            | any[]  | Items to be deleted (populated during execution)          |
| dataToProcess    | object | Data structure for items to process (populated internally)|

---

## Methods

### sliceIntoChunks

#### `sliceIntoChunks(arr: any[], chunkSize: number): any[][]`

Splits an array into chunks of a specified size.

| Name      | Type    | Description                |
|-----------|---------|----------------------------|
| arr       | any[]   | The array to split         |
| chunkSize | number  | The size of each chunk     |

**Returns:** `any[][]` — Array of chunked arrays.

---

### getItemsById (Abstract)

#### `async getItemsById(): Promise<any[] | null>`

**Abstract.** Should be implemented in a subclass. Retrieves items to be deleted by their IDs.

**Returns:** `Promise<any[] | null>` — Items to be deleted, or `null`.

---

### destroyChunkItems (Abstract)

#### `async destroyChunkItems(chunks: any[]): Promise<void>`

**Abstract.** Should be implemented in a subclass. Deletes a chunk of items.

| Name   | Type   | Description         |
|--------|--------|---------------------|
| chunks | any[]  | Array of items      |

**Returns:** `Promise<void>`

---

### getAllItemsExceptOne

#### `getAllItemsExceptOne(items: any[]): any[]`

Returns all items except one, unless only one item is present and single deletion is allowed. Used to avoid deleting all items for a user unless explicitly permitted.

| Name  | Type   | Description         |
|-------|--------|---------------------|
| items | any[]  | Array of items      |

**Returns:** `any[]` — Filtered array of items.

---

### createAuditLog

#### `async createAuditLog(): Promise<void>`

Creates an audit log entry for the deletion operation and updates the community's audit log data.

**Returns:** `Promise<void>`

---

### getAllowedSingleDelete

#### `getAllowedSingleDelete(): boolean`

Checks if the current work package allows deleting a single item.

**Returns:** `boolean`

---

### getMomentInYourPriorities

#### `getMomentInYourPriorities(): number`

Returns a timestamp (in milliseconds) for a specific date, depending on the collection type in the work package.

**Returns:** `number` — Milliseconds since epoch.

---

### getTopItems

#### `getTopItems(items: any[], type: string): any[]`

Returns the top items from a list. By default, delegates to `setupTopItems` (presumably defined in the base class).

| Name  | Type   | Description         |
|-------|--------|---------------------|
| items | any[]  | Array of items      |
| type  | string | Type of items       |

**Returns:** `any[]`

---

### destroyAllItems

#### `async destroyAllItems(chunks: any[][]): Promise<void>`

Deletes all items in the provided chunks, updating job progress after each chunk.

| Name   | Type     | Description         |
|--------|----------|---------------------|
| chunks | any[][]  | Array of item chunks|

**Returns:** `Promise<void>`

---

### deleteData

#### `async deleteData(): Promise<void>`

Deletes all items as determined by `dataToProcess`, using chunked deletion.

**Returns:** `Promise<void>`

---

### recountPosts

#### `async recountPosts(): Promise<void>`

Triggers recounting of posts affected by the deletion.

**Returns:** `Promise<void>`

---

### recountPoints

#### `async recountPoints(): Promise<void>`

Triggers recounting of points affected by the deletion.

**Returns:** `Promise<void>`

---

### recountCommunity

#### `async recountCommunity(): Promise<void>`

Triggers recounting of community statistics after deletion.

**Returns:** `Promise<void>`

---

### deleteItems

#### `async deleteItems(): Promise<void>`

Main entry point for the deletion process. Orchestrates the following steps:
1. Loads the job and items.
2. Sets up data to process.
3. Deletes the data.
4. Creates an audit log.
5. Recounts posts, points, and community stats as needed.
6. Updates job progress or error status.

**Returns:** `Promise<void>`

---

## Dependencies

- [lodash](https://lodash.com/)
- [moment](https://momentjs.com/)
- `models` (Sequelize models, e.g., `User`, `Community`, `GeneralDataStore`, `AcBackgroundJob`)
- [FraudBase](./FraudBase.md)
- [recountCommunity, recountPosts, recountPoints](../../../../utils/recount_utils.cjs)

---

## Usage Example

This class is intended to be subclassed. Example:

```javascript
const FraudDeleteBase = require('./FraudDeleteBase.cjs');

class FraudDeletePosts extends FraudDeleteBase {
  async getItemsById() {
    // Implementation for fetching posts by ID
  }
  async destroyChunkItems(chunk) {
    // Implementation for deleting a chunk of posts
  }
}
```

---

## Export

```javascript
module.exports = FraudDeleteBase;
```

---

## See Also

- [FraudBase](./FraudBase.md)
- [recount_utils.cjs](../../../../utils/recount_utils.cjs)
- [Sequelize Models](../../../../models/index.cjs)
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts) (for related agent data models, if applicable)

---

## Notes

- This class is not intended to be used directly. Subclass it and implement the abstract methods for specific deletion logic.
- Handles asynchronous operations with Promises and async/await.
- Ensures audit logging and recounting of related statistics after deletion operations.
