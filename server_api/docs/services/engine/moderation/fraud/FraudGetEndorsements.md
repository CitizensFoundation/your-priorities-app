# Service: FraudGetEndorsements

`FraudGetEndorsements` is a service class extending `FraudGetBase` that provides methods for retrieving and analyzing endorsement data for fraud detection. It interacts with Sequelize models for `Endorsement`, `User`, `Post`, `Group`, and `Community`, and provides logic to group, sort, and score endorsement items based on various fraud detection strategies.

**Location:** `./FraudGetEndorsements.cjs`

## Extends

- [FraudGetBase](./FraudGetBase.md)

## Dependencies

- [lodash](https://lodash.com/)
- Sequelize models from `../../../../models/index.cjs`

---

## Methods

### async getAllModelItems(model, getGroup)

Retrieves all endorsement items from the database, including related user, post, group, and community data. Optionally fetches group configuration if `getGroup` is true.

#### Parameters

| Name      | Type      | Description                                                                 |
|-----------|-----------|-----------------------------------------------------------------------------|
| model     | Model     | Sequelize model to query (typically `models.Endorsement`).                  |
| getGroup  | boolean   | Whether to fetch the group configuration for the first item's group.         |

#### Returns

- `Promise<{ itemsToAnalyse: Array, groupConfiguration: any }>`
  - `itemsToAnalyse`: Array of endorsement items, sorted by `post_id` and `user_agent`.
  - `groupConfiguration`: The configuration object of the group, if `getGroup` is true and group exists.

#### Example Usage

```javascript
const result = await fraudGetEndorsements.getAllModelItems(models.Endorsement, true);
console.log(result.itemsToAnalyse, result.groupConfiguration);
```

---

### async getAllItems()

Fetches all endorsement items for analysis using the `getAllModelItems` method.

#### Parameters

_None_

#### Returns

- `Promise<Array>`: Array of endorsement items to analyze.

#### Example Usage

```javascript
const items = await fraudGetEndorsements.getAllItems();
```

---

### getTopItems(items, type)

Analyzes a list of endorsement items and returns the "top" items based on the specified fraud detection strategy. Assigns a weighted confidence score to each group of suspicious items.

#### Parameters

| Name   | Type     | Description                                                                 |
|--------|----------|-----------------------------------------------------------------------------|
| items  | Array    | Array of endorsement items to analyze.                                      |
| type   | string   | The fraud detection strategy to use. Supported values:                      |
|        |          | - `"byIpUserAgentPostId"`                                                   |
|        |          | - `"byIpFingerprint"`                                                       |
|        |          | - `"byMissingFingerprint"`                                                  |
|        |          | - `"byIpFingerprintPostId"`                                                 |
|        |          | - `"byIpAddress"`                                                           |

#### Returns

- `Array`: Array of grouped and scored suspicious items, depending on the strategy.

#### Example Usage

```javascript
const suspicious = fraudGetEndorsements.getTopItems(items, "byIpUserAgentPostId");
```

#### Supported `type` values and logic

- **byIpUserAgentPostId**: Groups by IP, user agent, and post ID. Assigns confidence scores based on group size.
- **byIpFingerprint**: Groups by IP and fingerprint. Scores based on the ratio of group size to post count.
- **byMissingFingerprint**: Returns all top items without additional scoring.
- **byIpFingerprintPostId**: Groups by IP, fingerprint, and post ID. Assigns higher confidence scores for larger groups.
- **byIpAddress**: Groups by IP address. Scores based on the ratio of group size to post count.

---

## Internal Utility Methods (Inherited or Used)

- `setupTopItems(items)`: Groups and prepares items for analysis (inherited from `FraudGetBase`).
- `getPostIdsFromItems(items)`: Extracts post IDs from items (inherited from `FraudGetBase`).
- `setWeightedConfidenceScore(items, score)`: Assigns a confidence score to a group of items (inherited from `FraudGetBase`).

---

## Usage Example

```javascript
const FraudGetEndorsements = require('./FraudGetEndorsements.cjs');
const models = require('../../../../models/index.cjs');

const fraudGetEndorsements = new FraudGetEndorsements();

async function analyzeEndorsements() {
  const items = await fraudGetEndorsements.getAllItems();
  const suspicious = fraudGetEndorsements.getTopItems(items, "byIpUserAgentPostId");
  console.log(suspicious);
}
```

---

## Related Models

- **Endorsement**: The main model being analyzed.
- **User**: Related user for each endorsement.
- **Post**: Related post for each endorsement.
- **Group**: Group associated with the post.
- **Community**: Community associated with the group.

See your project's models for detailed schema documentation.

---

## Export

```javascript
module.exports = FraudGetEndorsements;
```

---

## Notes

- This class is designed for internal fraud analysis and is not an Express route handler or middleware.
- Relies heavily on lodash for sorting and grouping; a TODO note suggests refactoring to native JS.
- All database access is asynchronous and uses Sequelize ORM.
- Confidence scoring is hardcoded and may need adjustment for different fraud detection policies.

---

## See Also

- [FraudGetBase](./FraudGetBase.md)
- [Sequelize Models](../../../../models/index.cjs)
- [lodash documentation](https://lodash.com/)