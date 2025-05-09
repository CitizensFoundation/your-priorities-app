# Service: FraudGetPointQualities

`FraudGetPointQualities` is a service class extending [`FraudGetBase`](./FraudGetBase.md) that provides methods for retrieving and analyzing "Point" records for fraud detection purposes. It interacts with the application's Sequelize models to fetch data and applies various heuristics to score and filter items based on different fraud analysis types.

---

## Class: FraudGetPointQualities

**Extends:** [`FraudGetBase`](./FraudGetBase.md)

### Methods

| Name            | Parameters                | Return Type | Description                                                                 |
|-----------------|--------------------------|-------------|-----------------------------------------------------------------------------|
| getAllItems     | none                     | `Promise<Array<Point>>` | Retrieves all relevant Point records with associated User, Post, Group, and Community data, filtered by the current work package's community. |
| getTopItems     | items: `Array<any>`, type: `string` | `Array<any>` | Analyzes and scores items based on the specified fraud detection type.       |

---

## Method: getAllItems

Retrieves all Point records relevant to the current work package's community, including associated User, Post, Group, and Community data. The results are sorted by `post_id` and `user_agent`.

### Parameters

_None_

### Returns

- `Promise<Array<Point>>`: Resolves to an array of Point records with the following structure:
  - `id`: `number`
  - `created_at`: `Date`
  - `post_id`: `number`
  - `user_id`: `number`
  - `user_agent`: `string`
  - `ip_address`: `string`
  - `data`: `object`
  - `User`: `{ id: number, email: string }`
  - `Post`: `{ id: number, name: string, Group: { id: number } }`

### Description

- Fetches all Point records with selected attributes.
- Includes associated User (id, email), Post (id, name), Group (id), and filters by Community (id from `this.workPackage.communityId`).
- Sorts the results by `post_id` and `user_agent` using lodash's `sortBy`.

---

## Method: getTopItems

Analyzes a list of items and scores them based on the specified fraud detection type. The method applies different heuristics and confidence scoring depending on the `type` argument.

### Parameters

| Name   | Type         | Description                                                                 |
|--------|--------------|-----------------------------------------------------------------------------|
| items  | `Array<any>` | The list of items to analyze (typically output from `getAllItems`).         |
| type   | `string`     | The type of fraud analysis to perform. Supported values:                    |
|        |              | - `"byIpUserAgentPostId"`                                                   |
|        |              | - `"byIpFingerprint"`                                                       |
|        |              | - `"byMissingFingerprint"`                                                  |
|        |              | - `"byIpFingerprintPostId"`                                                 |
|        |              | - `"byIpAddress"`                                                           |

### Returns

- `Array<any>`: The filtered and scored items, depending on the analysis type.

### Description

- Calls `setupTopItems(items)` and `getPostIdsFromItems(topItems)` (inherited from `FraudGetBase`).
- Calculates a `pointMultiplier` (set to 10) to determine scoring thresholds.
- For each supported `type`, applies different logic to:
  - Filter items based on count or count/postCount.
  - Assign a weighted confidence score to each item's sub-items using `setWeightedConfidenceScore`.
  - Return the filtered and scored items.
- If an unsupported `type` is provided, logs a warning and returns an empty array.

#### Scoring Heuristics

- **byIpUserAgentPostId**: Scores based on item count thresholds.
- **byIpFingerprint**: Scores based on item count divided by post count.
- **byMissingFingerprint**: Returns all top items without additional scoring.
- **byIpFingerprintPostId**: Scores based on item count thresholds (different from `byIpUserAgentPostId`).
- **byIpAddress**: Scores based on item count divided by post count, with higher thresholds.

---

## Dependencies

- **Lodash**: Used for sorting and iterating over arrays.
- **Sequelize Models**: Uses `models.Point`, `models.User`, `models.Post`, `models.Group`, and `models.Community` for data retrieval.
- **FraudGetBase**: Inherits utility methods such as `setupTopItems`, `getPostIdsFromItems`, and `setWeightedConfidenceScore`.

---

## Example Usage

```javascript
const FraudGetPointQualities = require('./FraudGetPointQualities.cjs');
const fraudService = new FraudGetPointQualities(workPackage);

fraudService.getAllItems()
  .then(items => {
    const topItems = fraudService.getTopItems(items, 'byIpUserAgentPostId');
    // Process topItems...
  })
  .catch(err => {
    // Handle error
  });
```

---

## See Also

- [FraudGetBase](./FraudGetBase.md)
- [Sequelize Models](../../../../models/index.cjs)
- [Lodash Documentation](https://lodash.com/docs/4.17.15)

---

## Export

```javascript
module.exports = FraudGetPointQualities;
```

This class is exported as a CommonJS module for use in other parts of the application.