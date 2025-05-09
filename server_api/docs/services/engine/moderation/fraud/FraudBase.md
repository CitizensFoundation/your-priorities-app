# Service Module: FraudBase

The `FraudBase` class provides a foundational service for fraud detection and analysis, designed to be extended by subclasses that implement specific fraud detection strategies. It offers a suite of utility methods for grouping, scoring, and processing collections of items (such as posts, points, or endorsements) based on various criteria like IP address, user agent, browser fingerprint, and time-based heuristics.

This module is not intended to be used directly; instead, it should be subclassed, with key methods like `getTopItems` and `getAllItems` implemented in the subclass.

## Constructor

### `new FraudBase(workPackage: object)`

| Name         | Type   | Description                                      |
|--------------|--------|--------------------------------------------------|
| workPackage  | object | Configuration object for the fraud analysis run. |

**Properties:**
- `workPackage`: The configuration for the current fraud analysis.
- `items`: The collection of items to analyze (to be set by subclass).
- `dataToProcess`: The processed data, set by `setupDataToProcess()`.

---

## Methods

### average(arr: number[]): number

Calculates the average of an array of numbers.

| Name | Type     | Description                |
|------|----------|----------------------------|
| arr  | number[] | Array of numbers to average |

**Returns:** `number` — The average value.

---

### getTopItems(): any

**Abstract method.** Should be implemented in a subclass to return the top items according to the fraud detection strategy.

**Returns:** `any` — Implementation-specific.

---

### getAllItems(): Promise<any>

**Abstract method.** Should be implemented in a subclass to asynchronously fetch all items to be analyzed.

**Returns:** `Promise<any>` — Implementation-specific.

---

### getPostIdsFromItems(topItems: Array<{ items: Array<{ post_id: string }> }>): string[]

Extracts all `post_id` values from a list of top items.

| Name     | Type   | Description                        |
|----------|--------|------------------------------------|
| topItems | Array  | Array of objects with `items` array |

**Returns:** `string[]` — Array of post IDs.

---

### setupTopItems(items: object): Array<{ key: string, count: number, items: any[] }>

Groups and sorts items by key, returning an array of objects with key, count, and items.

| Name  | Type   | Description                |
|-------|--------|----------------------------|
| items | object | Grouped items by key       |

**Returns:** `Array<{ key: string, count: number, items: any[] }>` — Sorted array of grouped items.

---

### getTopDataByIp(): any

Groups and returns top items by IP address.

**Returns:** Implementation-specific grouped data.

---

### getTopDataByIpUserAgentPostId(): any

Groups and returns top items by IP address, user agent, and post ID.

**Returns:** Implementation-specific grouped data.

---

### getTopDataByIpUserAgentPointId(): any

Groups and returns top items by IP address, user agent, and point ID.

**Returns:** Implementation-specific grouped data.

---

### getTopDataByIpFingerprintPostId(): any

Groups and returns top items by IP address, browser fingerprint, and post ID.

**Returns:** Implementation-specific grouped data.

---

### getTopDataByIpFingerprintPointId(): any

Groups and returns top items by IP address, browser fingerprint, and point ID.

**Returns:** Implementation-specific grouped data.

---

### getTopDataByIpFingerprint(): any

Groups and returns top items by IP address and browser fingerprint.

**Returns:** Implementation-specific grouped data.

---

### getTopDataByNoFingerprints(): any

Groups and returns items missing browser fingerprint or browser ID, and assigns confidence scores.

**Returns:** Implementation-specific grouped data.

---

### setupDataToProcess(): void

Sets `this.dataToProcess` based on the `selectedMethod` in the `workPackage`. Calls the appropriate grouping method.

---

### getTimeDifferentScores(items: any[]): number

Calculates a time-difference-based score for a set of items, grouping them by day and scoring based on the average time between actions.

| Name  | Type   | Description                |
|-------|--------|----------------------------|
| items | any[]  | Array of items with `created_at` property |

**Returns:** `number` — The average score for the time differences.

---

### setWeightedConfidenceScore(items: any[], score: number): void

Sets a weighted confidence score on each item's `dataValues.confidenceScore` property, based on time difference and a provided score.

| Name  | Type    | Description                |
|-------|---------|----------------------------|
| items | any[]   | Array of items to score    |
| score | number  | Base score to combine      |

---

### getStartFingerprintMoment(): number

Returns a timestamp (in ms) representing the start date for considering browser fingerprints, based on the collection type.

**Returns:** `number` — Timestamp in milliseconds.

---

### groupTopDataByIp(): object

Groups `this.items` by `ip_address`.

**Returns:** `object` — Grouped items.

---

### groupTopDataByIpUserAgentPostId(): object

Groups `this.items` by `ip_address`, `post_id`, and `user_agent`.

**Returns:** `object` — Grouped items.

---

### groupTopDataByIpUserAgentPointId(): object

Groups `this.items` by `ip_address`, `point_id`, and `user_agent`.

**Returns:** `object` — Grouped items.

---

### groupTopDataByIpFingerprintPostId(): object

Groups filtered `this.items` (with valid browser fingerprint) by `ip_address`, `post_id`, and `browserFingerprint`.

**Returns:** `object` — Grouped items.

---

### groupTopDataByIpFingerprintPointId(): object

Groups filtered `this.items` (with valid browser fingerprint) by `ip_address`, `point_id`, and `browserFingerprint`.

**Returns:** `object` — Grouped items.

---

### groupTopDataByIpFingerprint(): object

Groups filtered `this.items` (with valid browser fingerprint) by `ip_address` and `browserFingerprint`.

**Returns:** `object` — Grouped items.

---

### groupTopDataByNoFingerprints(): object

Groups filtered `this.items` (missing browser fingerprint or browser ID) by a key indicating which data is missing, and assigns confidence scores.

**Returns:** `object` — Grouped items.

---

## Exported

```js
module.exports = FraudBase;
```

---

## Example Usage

```javascript
const FraudBase = require('./FraudBase');

class MyFraudDetector extends FraudBase {
  async getAllItems() {
    // Implementation to fetch items
  }
  getTopItems(groupedData, method) {
    // Implementation to return top items
  }
}

const detector = new MyFraudDetector({ selectedMethod: 'byIpAddress', collectionType: 'posts' });
await detector.getAllItems();
detector.setupDataToProcess();
console.log(detector.dataToProcess);
```

---

## Notes

- This class is intended to be subclassed. The methods `getTopItems` and `getAllItems` must be implemented in the subclass.
- Relies on [lodash](https://lodash.com/) for grouping and iteration, and [moment.js](https://momentjs.com/) for date handling.
- The `workPackage` object should contain at least `selectedMethod` and `collectionType` properties.
- The `items` property should be set with the data to be analyzed before calling grouping or scoring methods.

---

## See Also

- [lodash documentation](https://lodash.com/docs/)
- [moment.js documentation](https://momentjs.com/docs/)

---