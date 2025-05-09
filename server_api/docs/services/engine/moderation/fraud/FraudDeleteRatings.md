# Service: FraudDeleteRatings

`FraudDeleteRatings` is a service class responsible for handling the deletion of fraudulent ratings in bulk. It extends the [`FraudDeleteEndorsements`](./FraudDeleteEndorsements.md) class, inheriting its core logic for chunked deletion and item retrieval, but specializes the behavior for the `Rating` model.

## Inheritance

- **Extends:** [`FraudDeleteEndorsements`](./FraudDeleteEndorsements.md)

## Methods

| Name                | Parameters         | Return Type | Description                                                                                  |
|---------------------|-------------------|-------------|----------------------------------------------------------------------------------------------|
| destroyChunkItems   | items: any[]      | Promise<any>| Deletes a chunk of rating items using the `Rating` model.                                    |
| getItemsById        | none              | Promise<any[]>| Retrieves rating items to analyze by their IDs, using the `Rating` model.                    |

---

## Method: destroyChunkItems

Deletes a chunk of rating items using the `Rating` model.

### Parameters

| Name  | Type   | Description                        |
|-------|--------|------------------------------------|
| items | any[]  | Array of items (IDs or objects) to be deleted. |

### Returns

- `Promise<any>`: Resolves when the deletion operation is complete.

### Description

This method delegates to the inherited `destroyChunkItemsByModel` method, passing in the `models.Rating` model and the provided items. It is used to perform batch deletions of ratings identified as fraudulent.

---

## Method: getItemsById

Retrieves rating items to analyze by their IDs, using the `Rating` model.

### Parameters

None

### Returns

- `Promise<any[]>`: Resolves to an array of rating items to be analyzed.

### Description

This method calls the inherited `getModelItemsById` method with the `models.Rating` model. It returns the `itemsToAnalyse` property from the result, which contains the relevant rating items.

---

# Dependencies

- [`FraudDeleteEndorsements`](./FraudDeleteEndorsements.md): The base class providing core chunked deletion and item retrieval logic.
- `models.Rating`: The Sequelize (or similar ORM) model representing ratings in the database.
- `lodash`: Imported but not used in this file (TODO: Replace with native JS if needed).

# Export

- `module.exports = FraudDeleteRatings;`

This class is exported as a CommonJS module for use in other parts of the application.

---

# See Also

- [FraudDeleteEndorsements](./FraudDeleteEndorsements.md)
- [models/index.cjs](../../../../models/index.cjs) (for the `Rating` model definition)
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts) (if related to agent-based fraud detection)

---

# Notes

- **TODO:** The file contains a note to replace lodash usage with native JavaScript, but lodash is not used directly in this file.
- This service is typically used in fraud detection and cleanup workflows, where ratings identified as fraudulent need to be removed in bulk.