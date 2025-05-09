# Script: addPairwiseQuestionToGroup.cjs

This script is a command-line utility for updating a group's configuration in the database to associate a specific pairwise question (from AllOurIdeas) with a group. It is intended for administrative or migration purposes and is not exposed as an API endpoint.

---

## Purpose

- Updates the `configuration.allOurIdeas.earl.question_id` and `configuration.allOurIdeas.earl.question.id` fields of a `Group` record in the database.
- Used to link a pairwise question (by its ID) to a group (by its ID).

---

## Usage

```bash
node addPairwiseQuestionToGroup.cjs <questionId> <groupId>
```

- `<questionId>`: The ID of the pairwise question to associate.
- `<groupId>`: The ID of the group to update.

---

## Parameters

| Name        | Type   | Source      | Description                                 | Required |
|-------------|--------|-------------|---------------------------------------------|----------|
| questionId  | string | CLI arg #1  | The ID of the pairwise question to add.     | Yes      |
| groupId     | string | CLI arg #2  | The ID of the group to update.              | Yes      |

---

## Process Flow

1. **Input Parsing**: Reads `questionId` and `groupId` from command-line arguments.
2. **Group Lookup**: Fetches the group with the specified `groupId` from the database.
3. **Configuration Check**: Verifies that the group has an `allOurIdeas` configuration with an `earl` property.
4. **Update**: Sets the `question_id` and `question.id` fields in the configuration to the provided `questionId`.
5. **Save**: Persists the updated group configuration to the database.
6. **Logging & Exit**: Logs success or error messages and exits the process.

---

## Dependencies

- [models/index.cjs](../models/index.cjs): Provides access to the database models, including `Group`.

---

## Database Model: Group

The script interacts with the `Group` model. For full details, see [Group](../models/Group.md).

### Relevant Properties

| Name                                      | Type   | Description                                      |
|--------------------------------------------|--------|--------------------------------------------------|
| id                                        | string | Unique identifier for the group.                 |
| configuration.allOurIdeas.earl.question_id | string | The ID of the associated pairwise question.      |
| configuration.allOurIdeas.earl.question.id | string | The ID of the associated pairwise question.      |

---

## Example

```bash
node addPairwiseQuestionToGroup.cjs 12345 67890
```

- Associates the pairwise question with ID `12345` to the group with ID `67890`.

---

## Error Handling

- If the group is not found or does not have the required configuration, logs an error and exits.
- If a database or other error occurs, logs the error and exits.

### Example Error Output

```text
Group does not have allOurIdeas configuration
```

```text
Error:  <error details>
```

---

## Exported Constants

_None. This script is intended to be run directly and does not export any modules or functions._

---

## See Also

- [Group Model Documentation](../models/Group.md)
- [AllOurIdeas Integration Documentation](../docs/allOurIdeas.md) (if available)

---

## Notes

- This script directly modifies the database. Use with caution.
- Ensure you have appropriate permissions and backups before running in production environments.