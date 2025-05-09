# Service Class: FraudGetRatings

`FraudGetRatings` is a service class for fraud detection and analysis of "ratings" in the system. It extends the [`FraudGetEndorsements`](./FraudGetEndorsements.md) class, inheriting its methods and logic, and specializes them for the context of ratings. The class is designed to analyze rating data, group it according to various criteria, and assign confidence scores to potential fraud patterns.

## Inheritance

- **Extends:** [`FraudGetEndorsements`](./FraudGetEndorsements.md)

## Dependencies

- [`lodash`](https://lodash.com/) (as `_`)
- [`FraudGetEndorsements`](./FraudGetEndorsements.md)
- `models.Rating` (from `../../../../models/index.cjs`)

---

## Constructor

### `new FraudGetRatings(workPackage)`

Creates a new instance of `FraudGetRatings`.

| Name        | Type     | Description                        |
|-------------|----------|------------------------------------|
| workPackage | any      | The work package/context for analysis. |

---

## Properties

| Name               | Type   | Description                                      |
|--------------------|--------|--------------------------------------------------|
| groupConfiguration | object \| null | Stores group configuration after item retrieval. |

---

## Methods

### async getAllItems()

Retrieves all rating items to be analyzed for fraud, using the `models.Rating` model. Also stores the group configuration for later use.

#### Returns

- `Promise<Array<any>>`: An array of items to analyze.

#### Description

- Calls `getAllModelItems` (inherited from `FraudGetEndorsements`) with the `Rating` model.
- Stores the `groupConfiguration` for use in fraud analysis.
- Returns the items to be analyzed.

---

### getTopItems(items: any[], type: string): any[]

Analyzes the provided items and returns the "top" suspicious items based on the specified grouping type. Assigns weighted confidence scores to items based on their statistical outlier status.

#### Parameters

| Name  | Type     | Description                                      |
|-------|----------|--------------------------------------------------|
| items | any[]    | Array of items to analyze.                       |
| type  | string   | The grouping type for analysis. Supported values:<br>- `"byIpUserAgentPostId"`<br>- `"byIpFingerprint"`<br>- `"byMissingFingerprint"`<br>- `"byIpFingerprintPostId"`<br>- `"byIpAddress"` |

#### Returns

- `any[]`: Array of top suspicious items, each with a confidence score.

#### Description

- Calls `setupTopItems` and `getPostIdsFromItems` (inherited from `FraudGetEndorsements`) to prepare and group items.
- Calculates the number of unique posts and the total ratings count (from `groupConfiguration` if available).
- For each supported `type`, applies different statistical thresholds to determine which items are suspicious and assigns a weighted confidence score using `setWeightedConfidenceScore`.
- Returns the filtered and scored items for further processing.

#### Confidence Score Assignment

- The confidence score is set based on the ratio of item count to total ratings (and/or post count), with higher ratios indicating higher suspicion.
- The scoring thresholds and logic differ for each `type`.

#### Supported Types and Logic

| Type                    | Logic/Thresholds                                                                                 |
|-------------------------|--------------------------------------------------------------------------------------------------|
| byIpUserAgentPostId     | Score: 70–95, based on (item.count / ratingsCount)                                               |
| byIpFingerprint         | Score: 80–99, based on (item.count / postCount / ratingsCount)                                   |
| byMissingFingerprint    | Returns all topItems as-is (no scoring)                                                          |
| byIpFingerprintPostId   | Score: 80–100, based on (item.count / ratingsCount)                                              |
| byIpAddress             | Score: 50–90, based on (item.count / postCount / ratingsCount)                                   |
| (other/unknown)         | Logs a warning and returns an empty array                                                        |

---

## Example Usage

```javascript
const FraudGetRatings = require('./FraudGetRatings.cjs');
const workPackage = { /* ... */ };
const fraudGetRatings = new FraudGetRatings(workPackage);

(async () => {
  const items = await fraudGetRatings.getAllItems();
  const suspicious = fraudGetRatings.getTopItems(items, 'byIpUserAgentPostId');
  // suspicious now contains items with confidence scores
})();
```

---

## Internal/Inherited Methods Used

- `getAllModelItems(model, includeGroupConfig)`
- `setupTopItems(items)`
- `getPostIdsFromItems(items)`
- `setWeightedConfidenceScore(items, score)`

These are inherited from [`FraudGetEndorsements`](./FraudGetEndorsements.md).

---

## Export

- `module.exports = FraudGetRatings;`

---

## See Also

- [`FraudGetEndorsements`](./FraudGetEndorsements.md)
- [models.Rating](../../../../models/index.cjs)
- [Lodash documentation](https://lodash.com/)

---

## Notes

- This class is intended for internal service use, not as an Express route handler or middleware.
- The actual structure of items and the group configuration depends on the implementation of `FraudGetEndorsements` and the `Rating` model.
- Confidence scoring logic is subject to change based on fraud detection requirements.