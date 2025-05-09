# Service: FraudGetPointQualities

`FraudGetPointQualities` is a service class extending [`FraudGetBase`](./FraudGetBase.md) that provides methods for retrieving and analyzing "PointQuality" records, typically for fraud detection purposes. It interacts with the application's Sequelize models to fetch data and applies various heuristics to score and group items based on different fraud analysis types.

**Location:** `services/fraud/FraudGetPointQualities.cjs`

## Inheritance

- **Extends:** [`FraudGetBase`](./FraudGetBase.md)

## Dependencies

- [`lodash`](https://lodash.com/) (for collection manipulation)
- `models` (Sequelize models, e.g., `PointQuality`, `User`, `Point`, `Post`, `Group`, `Community`)

---

## Methods

| Name                | Parameters                                   | Return Type | Description                                                                                 |
|---------------------|----------------------------------------------|-------------|---------------------------------------------------------------------------------------------|
| getAllItems         | none                                         | `Promise<Array<PointQuality>>` | Fetches all `PointQuality` records with related user, point, post, group, and community data.|
| getPointIdsFromItems| `topItems: Array<any>`                       | `Array<number>` | Extracts all `point_id` values from a nested items structure.                                |
| getTopItems         | `items: Array<any>, type: string`            | `Array<any>` | Groups, scores, and filters items based on the specified fraud analysis `type`.              |

---

### async getAllItems()

Fetches all `PointQuality` records from the database, including related `User`, `Point`, `Post`, `Group`, and `Community` data. Only records belonging to the current `workPackage.communityId` are included. The results are sorted by `post_id` and `user_agent`.

#### Returns

- `Promise<Array<PointQuality>>`: A promise that resolves to an array of `PointQuality` records with included associations.

#### Example Response

```json
[
  {
    "id": 1,
    "created_at": "2024-06-01T12:00:00Z",
    "value": 5,
    "point_id": 123,
    "user_id": 456,
    "user_agent": "Mozilla/5.0",
    "ip_address": "192.168.1.1",
    "data": {},
    "User": {
      "id": 456,
      "email": "user@example.com"
    },
    "Point": {
      "id": 123,
      "Post": {
        "id": 789,
        "name": "Example Post",
        "Group": {
          "id": 321
        }
      }
    }
  }
]
```

---

### getPointIdsFromItems(topItems: Array<any>): Array<number>

Extracts all `point_id` values from a nested structure of items. Each `topItem` is expected to have an `items` array, and each item in that array should have a `point_id` property.

#### Parameters

| Name      | Type         | Description                                 |
|-----------|--------------|---------------------------------------------|
| topItems  | `Array<any>` | Array of grouped items with nested `items`. |

#### Returns

- `Array<number>`: An array of all `point_id` values found in the nested items.

---

### getTopItems(items: Array<any>, type: string): Array<any>

Groups, scores, and filters items based on the specified fraud analysis `type`. The method uses different heuristics and scoring rules depending on the `type` argument.

#### Parameters

| Name  | Type           | Description                                                                 |
|-------|----------------|-----------------------------------------------------------------------------|
| items | `Array<any>`   | The list of items to analyze.                                               |
| type  | `string`       | The type of fraud analysis to perform. Supported values:                    |
|       |                | - `"byIpUserAgentPointId"`                                                  |
|       |                | - `"byIpFingerprint"`                                                       |
|       |                | - `"byMissingFingerprint"`                                                  |
|       |                | - `"byIpFingerprintPointId"`                                                |
|       |                | - `"byIpAddress"`                                                           |

#### Returns

- `Array<any>`: The filtered and scored top items according to the analysis type.

#### Scoring Logic

- For each type, items are grouped and scored using `setWeightedConfidenceScore` (inherited from `FraudGetBase`).
- The scoring thresholds and logic vary by type (see source for details).

#### Example Usage

```javascript
const fraudGetPointQualities = new FraudGetPointQualities(workPackage);
const items = await fraudGetPointQualities.getAllItems();
const topItems = fraudGetPointQualities.getTopItems(items, "byIpUserAgentPointId");
```

---

## Internal Utility Methods

These methods are used internally and are not exported, but are important for understanding the class's operation:

- `setupTopItems(items)`: Groups and prepares items for analysis (inherited from `FraudGetBase`).
- `setWeightedConfidenceScore(items, score)`: Assigns a confidence score to a set of items (inherited from `FraudGetBase`).

---

## Model Associations

The following Sequelize models are used (see your project's `models/index.cjs`):

- **PointQuality**: The main model being queried.
- **User**: Associated via `user_id`.
- **Point**: Associated via `point_id`.
- **Post**: Associated via `Point`.
- **Group**: Associated via `Post`.
- **Community**: Associated via `Group`, filtered by `communityId`.

---

## Export

```javascript
module.exports = FraudGetPointQualities;
```

---

## See Also

- [FraudGetBase](./FraudGetBase.md)
- [Sequelize Models](../../../../models/index.cjs)
- [Lodash Documentation](https://lodash.com/)

---

## Notes

- The code currently uses Lodash for collection manipulation; a TODO notes that this should be refactored to use native JavaScript methods.
- The scoring and grouping logic is tightly coupled to the fraud analysis domain and may require domain knowledge for further customization.

---

**For further details on the base class and utility methods, see [FraudGetBase](./FraudGetBase.md).**