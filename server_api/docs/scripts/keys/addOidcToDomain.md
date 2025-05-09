# Script: update-oidc-keys.cjs

This script updates the OIDC (OpenID Connect) configuration keys for a specific domain in the database. It is intended to be run from the command line and interacts directly with the database models to update the `secret_api_keys.oidc` property of a domain.

---

## Usage

```bash
node update-oidc-keys.cjs <domainId> <clientId> <clientSecret> <issuer> <authorizationURL> <tokenURL> <userInfoURL>
```

- **domainId**: The ID of the domain to update.
- **clientId**: The OIDC client ID.
- **clientSecret**: The OIDC client secret.
- **issuer**: The OIDC issuer URL.
- **authorizationURL**: The OIDC authorization endpoint URL.
- **tokenURL**: The OIDC token endpoint URL.
- **userInfoURL**: The OIDC user info endpoint URL.

---

## Description

This script performs the following steps:

1. Reads command-line arguments for the domain ID and OIDC configuration values.
2. Looks up the domain in the database using the provided domain ID.
3. Initializes the `secret_api_keys` object if it does not exist.
4. Sets or updates the `oidc` property within `secret_api_keys` with the provided OIDC configuration.
5. Saves the updated domain record to the database.
6. Logs the process and any errors to the console.

---

## Dependencies

- [models](../../models/index.cjs): Database models, specifically expects a `Domain` model with a `secret_api_keys` field.
- [async](https://caolan.github.io/async/): Used for managing asynchronous control flow.

---

## Parameters

| Name             | Type   | Source      | Description                                 | Required |
|------------------|--------|-------------|---------------------------------------------|----------|
| domainId         | string | CLI arg [2] | The ID of the domain to update              | Yes      |
| clientId         | string | CLI arg [3] | OIDC client ID                              | Yes      |
| clientSecret     | string | CLI arg [4] | OIDC client secret                          | Yes      |
| issuer           | string | CLI arg [5] | OIDC issuer URL                             | Yes      |
| authorizationURL | string | CLI arg [6] | OIDC authorization endpoint URL             | Yes      |
| tokenURL         | string | CLI arg [7] | OIDC token endpoint URL                     | Yes      |
| userInfoURL      | string | CLI arg [8] | OIDC user info endpoint URL                 | Yes      |

---

## Database Model: [Domain](../../models/index.cjs)

The script expects the `Domain` model to have at least the following properties:

| Name             | Type   | Description                                 |
|------------------|--------|---------------------------------------------|
| id               | string | Unique identifier for the domain            |
| name             | string | Name of the domain                          |
| secret_api_keys  | object | Object containing secret API keys, including OIDC configuration |

### OIDC Configuration Structure

The `secret_api_keys.oidc` object is updated as follows:

```json
{
  "client_id": "<clientId>",
  "client_secret": "<clientSecret>",
  "issuer": "<issuer>",
  "authorizationURL": "<authorizationURL>",
  "tokenURL": "<tokenURL>",
  "userInfoURL": "<userInfoURL>"
}
```

---

## Script Flow

1. **Find Domain**  
   Uses `models.Domain.findOne({ where: { id: domainId } })` to locate the domain.

2. **Update OIDC Keys**  
   - Initializes `secret_api_keys` if not present.
   - Sets `secret_api_keys.oidc` to the new OIDC configuration.

3. **Save Changes**  
   - Calls `domain.changed('secret_api_keys', true)` to mark the field as changed.
   - Saves the domain with `domain.save({ fields: ['secret_api_keys'] })`.

4. **Error Handling**  
   - Logs and exits on errors (e.g., domain not found, database errors).

---

## Example Output

```bash
Updating OIDC keys for domain 123
Found domain: ExampleDomain
Updated secret_api_keys: {
  "oidc": {
    "client_id": "abc",
    "client_secret": "def",
    "issuer": "https://issuer.example.com",
    "authorizationURL": "https://issuer.example.com/auth",
    "tokenURL": "https://issuer.example.com/token",
    "userInfoURL": "https://issuer.example.com/userinfo"
  }
}
OIDC keys updated successfully
Finished successfully
```

---

## Error Output

```bash
Can't find domain
An error occurred: Can't find domain
```

or

```bash
Error finding domain: <error details>
An error occurred: <error details>
```

---

## Exported Constants

None.

---

## Notes

- This script is intended for administrative or deployment use and should not be exposed as a public API endpoint.
- Ensure that the database connection and models are properly configured in `../../models/index.cjs` before running the script.
- The script will terminate the Node.js process after completion (`process.exit()`).

---

## Related Files

- [models/index.cjs](../../models/index.cjs) – Database models, including the `Domain` model.