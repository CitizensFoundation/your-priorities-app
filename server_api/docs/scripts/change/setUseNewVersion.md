# Script: setDomainUseNewVersionStatus.cjs

This script updates the `useNewVersion` flag in the `configuration` object of a specific Domain record in the database. It is intended to be run from the command line and is not an API endpoint or middleware, but a utility script for administrative or migration purposes.

---

## Usage

```bash
node setDomainUseNewVersionStatus.cjs <domainId> <useNewVersionStatus>
```

- `<domainId>`: The ID of the domain to update.
- `<useNewVersionStatus>`: Must be either `"true"` or `"false"` (as a string).

---

## Description

- Fetches a Domain by its ID.
- If found, sets the `configuration.useNewVersion` property to the boolean value of `useNewVersionStatus`.
- Saves the updated Domain.
- Logs the result and exits the process.

---

## Parameters

| Name                | Type    | Source      | Description                                      | Required |
|---------------------|---------|-------------|--------------------------------------------------|----------|
| domainId            | string  | CLI arg #1  | The ID of the domain to update                   | Yes      |
| useNewVersionStatus | string  | CLI arg #2  | `"true"` or `"false"` (as string, not boolean)   | Yes      |

---

## Behavior

1. Loads the `Domain` model from `../../models/index.cjs`.
2. Reads `domainId` and `useNewVersionStatus` from command-line arguments.
3. Finds the domain with the given ID.
4. If found:
    - Logs the domain name.
    - If `useNewVersionStatus` is `"true"` or `"false"`:
        - Sets `domain.configuration.useNewVersion` to the corresponding boolean.
        - Saves the domain.
        - Logs the update.
    - Else:
        - Logs "Invalid useNewVersionStatus".
    - Exits the process.
5. If not found:
    - Logs "Can't find user".
    - Exits the process.

---

## Example

```bash
node setDomainUseNewVersionStatus.cjs 123 true
```
- Sets `configuration.useNewVersion` to `true` for the domain with ID `123`.

---

## Dependencies

- [Domain Model](../../models/index.cjs)  
  The script expects the `Domain` model to be available and to support:
    - `findOne({ where: { id } })`
    - `set(path, value)`
    - `save()`
    - `domain_name` property

---

## Output

- Logs the domain name if found.
- Logs the result of the update or an error message.
- Exits the process.

---

## Error Handling

- If the domain is not found, logs "Can't find user".
- If `useNewVersionStatus` is not `"true"` or `"false"`, logs "Invalid useNewVersionStatus".

---

## Related Models

- [Domain](../../models/index.cjs)  
  The `Domain` model should have a `configuration` object with a `useNewVersion` boolean property.

---

## Exported Constants

_None. This script does not export any constants or functions._

---

## Notes

- This script is intended for command-line use only.
- It is synchronous in its flow, using async/await for database operations.
- The script terminates the process after completion or error.

---