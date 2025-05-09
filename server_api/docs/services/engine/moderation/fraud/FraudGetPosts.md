# Service: FraudGetPoints

`FraudGetPoints` is a service class extending `FraudGetBase`. It provides methods for retrieving and analyzing posts for potential fraud, focusing on grouping and scoring posts based on user agent, IP address, and other attributes. This class interacts with Sequelize models for `Post`, `User`, `Group`, and `Community`.

## Extends

- [FraudGetBase](./FraudGetBase.md)

## Methods

### getAllItems()

Retrieves all posts for a specific community, including related user and group information. The results are sorted by `group_id` and `user_agent`.

#### Parameters

_None_

#### Returns

- `Promise<Array<Post>>`: Resolves to an array of post objects, each including:
  - `id`: `number`
  - `created_at`: `Date`
  - `group_id`: `number`
  - `name`: `string`
  - `user_id`: `number`
  - `user_agent`: `string`
  - `ip_address`: `string`
  - `data`: `object`
  - `User`: `{ id: number, email: string }`
  - `Group`: `{ id: number, Community: { id: number } }`

#### Description

- Fetches all posts with selected attributes.
- Includes associated `User` (with `id` and `email`) and `Group` (with `id`), and filters groups by the current `communityId` from `this.workPackage`.
- Results are sorted by `group_id` and `user_agent`.

---

### getTopItems(items, type)

Analyzes a list of items (posts) and returns the top items based on the specified fraud detection type. Assigns weighted confidence scores to items based on their frequency and the type of analysis.

#### Parameters

| Name   | Type         | Description                                                                 |
|--------|--------------|-----------------------------------------------------------------------------|
| items  | Array<any>   | Array of items (posts) to analyze.                                          |
| type   | string       | Type of fraud check: `"byIpFingerprint"`, `"byMissingFingerprint"`, or `"byIpAddress"`. |

#### Returns

- `Array<any>`: Array of top items with confidence scores set, depending on the analysis type.

#### Description

- Uses helper methods from the base class:
  - `setupTopItems(items)`: Prepares and groups items for analysis.
  - `getPostIdsFromItems(topItems)`: Extracts post IDs from grouped items.
  - `setWeightedConfidenceScore(items, score)`: Assigns a confidence score to a set of items.
- For `"byIpFingerprint"` and `"byIpAddress"`, items with a high enough frequency (relative to total post count) are assigned a weighted confidence score, with thresholds for different score levels.
- For `"byMissingFingerprint"`, simply returns the grouped items.
- If an unknown type is provided, logs a warning and returns an empty array.

---

## Dependencies

- [lodash](https://lodash.com/): Used for sorting and iterating over arrays.
- [models](../../../../models/index.cjs): Sequelize models for `Post`, `User`, `Group`, and `Community`.
- [FraudGetBase](./FraudGetBase.md): Base class providing helper methods for fraud analysis.

## Example Usage

```javascript
const FraudGetPoints = require('./FraudGetPoints.cjs');
const fraudGetPoints = new FraudGetPoints(/* workPackage, ... */);

fraudGetPoints.getAllItems()
  .then(items => {
    const topByIp = fraudGetPoints.getTopItems(items, "byIpAddress");
    // Process topByIp as needed
  })
  .catch(err => {
    // Handle error
  });
```

---

## See Also

- [FraudGetBase](./FraudGetBase.md)
- [models/index.cjs](../../../../models/index.cjs) (for Sequelize model definitions)

---

## Exported

```js
module.exports = FraudGetPoints;
```

This class is exported as a CommonJS module.