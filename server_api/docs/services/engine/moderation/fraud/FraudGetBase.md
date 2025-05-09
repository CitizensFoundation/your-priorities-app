# Service Class: FraudGetBase

`FraudGetBase` is a service class extending [`FraudBase`](./FraudBase.md), designed to process, format, and compress fraud-related data for reporting or further analysis. It provides methods for time formatting, color assignment, data flattening, and custom compression, and interacts with background job models to update progress and results.

---

## Constructor

### `new FraudGetBase(workPackage: any)`

Creates a new instance of `FraudGetBase`.

| Name         | Type | Description                |
|--------------|------|----------------------------|
| workPackage  | any  | The work package context, typically containing job and collection type information. |

---

## Methods

### formatTime()

Formats the `created_at` timestamp of each item in `this.dataToProcess`:
- Adds a `createAtValue` (UNIX ms timestamp) and a formatted `created_at` string to each item's `dataValues`.

#### Parameters

None

#### Returns

`void`

---

### setBackgroundColorsFromKey()

Assigns a consistent background color to each group of items based on their `key` using the `color-hash` library. The color is stored in each item's `dataValues.backgroundColor`.

#### Parameters

None

#### Returns

`void`

---

### customCompress()

Flattens and compresses the processed data for efficient transmission and visualization. It:
- Flattens grouped items into a single array.
- Deduplicates and indexes background colors, IP addresses, user agents, emails, names, and post names.
- Replaces string values with their corresponding index in the deduplicated arrays.
- Adds group count and key index to each item.
- Handles different collection types (`endorsements`, `ratings`, `points`, `posts`, `pointQualities`) for post name indexing.

#### Parameters

None

#### Returns

`void`

#### Output Structure

After execution, `this.dataToProcess` is set to an object:

```json
{
  "cBackgroundColors": [ "string", ... ],
  "cIpAddresses": [ "string", ... ],
  "cUserAgents": [ "string", ... ],
  "cEmails": [ "string", ... ],
  "cNames": [ "string", ... ],
  "cPostNames": [ "string", ... ],
  "items": [ /* processed items */ ]
}
```

---

### async processAndGetFraudItems()

Main entry point for processing and updating fraud items. It:
1. Retrieves all items via `getAllItems()`.
2. Prepares data for processing.
3. Applies color, time formatting, and compression.
4. Updates the background job with the processed data and progress.

#### Parameters

None

#### Returns

`Promise<void>`

#### Side Effects

- Updates the background job in the database via `models.AcBackgroundJob.updateDataAsync` and `updateProgressAsync`.

---

## Inherited Methods

Inherits all methods from [`FraudBase`](./FraudBase.md), including (but not limited to):
- `getAllItems()`
- `setupDataToProcess()`

---

## Dependencies

- [`FraudBase`](./FraudBase.md): Base class for fraud processing.
- `models`: Sequelize models, especially `AcBackgroundJob`.
- `lodash`: Utility library for iteration and manipulation.
- `moment`: Date/time formatting.
- `color-hash`: Generates consistent colors from strings.

---

## Example Usage

```javascript
const FraudGetBase = require('./FraudGetBase.cjs');
const workPackage = { jobId: 123, collectionType: 'endorsements' };

const fraudProcessor = new FraudGetBase(workPackage);
await fraudProcessor.processAndGetFraudItems();
```

---

## Export

```javascript
module.exports = FraudGetBase;
```

---

## See Also

- [FraudBase](./FraudBase.md)
- [AcBackgroundJob Model](../../../../models/index.cjs)
- [color-hash documentation](https://www.npmjs.com/package/color-hash)
- [moment documentation](https://momentjs.com/)
- [lodash documentation](https://lodash.com/)