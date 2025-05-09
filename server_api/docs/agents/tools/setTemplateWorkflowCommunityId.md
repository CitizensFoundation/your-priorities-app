# Script: setTemplateWorkflowCommunityId.ts

A command-line utility script to update the `templateWorkflowCommunityId` property in the `configuration` object of a specific [YpAgentProduct](./agentProduct.md) record in the database.

---

## Description

This script is intended for administrative or migration purposes. It allows you to set or update the `templateWorkflowCommunityId` field within the `configuration` JSON of a given agent product by its ID. The script is executed via the command line and requires two arguments: the agent product ID and the new `templateWorkflowCommunityId` value.

- Connects to the database using the [sequelize](https://sequelize.org/) instance from [@policysynth/agents/dbModels/index.js](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/index.ts).
- Locates the agent product by primary key.
- Updates the `configuration.templateWorkflowCommunityId` field.
- Saves the updated record.
- Closes the database connection.

---

## Usage

```bash
ts-node setTemplateWorkflowCommunityId.ts <agentProductId> <templateWorkflowCommunityId>
```

- `<agentProductId>`: The numeric ID of the agent product to update.
- `<templateWorkflowCommunityId>`: The numeric value to set for the `templateWorkflowCommunityId` field.

---

## Command-Line Arguments

| Name                        | Type   | Description                                               | Required |
|-----------------------------|--------|-----------------------------------------------------------|----------|
| agentProductId              | number | The ID of the agent product to update                     | Yes      |
| templateWorkflowCommunityId | number | The new value for `configuration.templateWorkflowCommunityId` | Yes      |

---

## Main Function

### setTemplateWorkflowCommunityId

Updates the `templateWorkflowCommunityId` in the configuration of a specific agent product.

#### Parameters

| Name                        | Type   | Description                                               |
|-----------------------------|--------|-----------------------------------------------------------|
| agentProductId              | number | The ID of the agent product to update                     |
| templateWorkflowCommunityId | number | The new value for `configuration.templateWorkflowCommunityId` |

#### Returns

- `Promise<void>`

#### Description

- Finds the agent product by its primary key.
- If not found, logs an error and exits.
- If found, updates the `configuration.templateWorkflowCommunityId` field.
- Saves the updated agent product.
- Logs success or error messages.
- Closes the database connection at the end.

#### Example

```typescript
await setTemplateWorkflowCommunityId(123, 456);
```

---

## Error Handling

- If the agent product is not found, logs an error and exits.
- If arguments are missing or not numbers, logs usage instructions and exits.
- Any errors during the update process are logged to the console.

---

## Dependencies

- [sequelize](https://sequelize.org/) instance from [@policysynth/agents/dbModels/index.js](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/index.ts)
- [YpAgentProduct](./agentProduct.md) model

---

## Related Models

- [YpAgentProduct](./agentProduct.md): The model representing agent products, including the `configuration` field.

---

## Example Output

**Success:**
```
Successfully updated Agent Product 123 with templateWorkflowCommunityId = 456
```

**Error (not found):**
```
Agent Product with ID 123 not found.
```

**Error (invalid arguments):**
```
Usage: ts-node setTemplateWorkflowCommunityId.ts <agentProductId> <templateWorkflowCommunityId>
```

---

## Exported Constants

_None._

---

## Configuration

- No configuration objects are exported; all configuration is via command-line arguments.

---

## See Also

- [YpAgentProduct](./agentProduct.md)
- [sequelize](https://sequelize.org/)
- [@policysynth/agents/dbModels/index.js](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/index.ts)

---

## Notes

- This script is intended to be run as a standalone command-line tool, not as part of an API or web server.
- The script will close the database connection after execution, regardless of success or failure.