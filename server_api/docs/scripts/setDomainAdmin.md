# Script: addAdminToDomain.cjs

This script adds a specified user as an admin to a given domain in the database. It is intended to be run from the command line and interacts directly with the application's models to perform the operation.

---

## Usage

```bash
node addAdminToDomain.cjs <userEmail> <domainId>
```

- `<userEmail>`: The email address of the user to be added as an admin.
- `<domainId>`: The ID of the domain to which the user will be added as an admin.

---

## Description

This script performs the following steps:

1. **Finds the user** by the provided email address.
2. **Finds the domain** by the provided domain ID.
3. **Checks if the user is already an admin** for the domain.
4. **Adds the user as an admin** if they are not already an admin.
5. Logs the process and exits.

---

## Parameters

| Name        | Type   | In      | Description                                 | Required |
|-------------|--------|---------|---------------------------------------------|----------|
| userEmail   | string | argv[2] | The email address of the user to add.       | Yes      |
| domainId    | string | argv[3] | The ID of the domain to add the user to.    | Yes      |

---

## Process Flow

1. **User Lookup**
   - Uses `models.User.findOne({where: {email: userEmail}})` to find the user.
   - If the user is not found, logs an error and exits.

2. **Domain Lookup and Admin Assignment**
   - Uses `models.Domain.findOne({where: {id: domainId}})` to find the domain.
   - Checks if the user is already an admin using `domain.hasDomainAdmins(user)`.
   - If not already an admin, adds the user as an admin with `domain.addDomainAdmins(user)`.

3. **Completion**
   - Logs "Finished" and exits the process.

---

## Dependencies

- [models](../models/index.cjs): The application's Sequelize models, including `User` and `Domain`.
- [async](https://caolan.github.io/async/): Used for sequential asynchronous control flow.

---

## Models Used

### [User](../models/index.cjs) (Sequelize Model)
Represents a user in the system.

#### Properties (relevant)
| Name   | Type   | Description                |
|--------|--------|----------------------------|
| email  | string | The user's email address.  |
| name   | string | The user's display name.   |

### [Domain](../models/index.cjs) (Sequelize Model)
Represents a domain in the system.

#### Methods (relevant)
| Name                | Parameters         | Return Type | Description                                      |
|---------------------|--------------------|-------------|--------------------------------------------------|
| hasDomainAdmins     | user: User         | Promise\<boolean\> | Checks if the user is an admin for the domain.   |
| addDomainAdmins     | user: User         | Promise     | Adds the user as an admin for the domain.        |

---

## Example Output

```bash
Adding alice@example.com as admin to domain 42
Found user Alice
Adding admin user for: Example Domain
Finished
```

If the user is already an admin:

```bash
Adding alice@example.com as admin to domain 42
Found user Alice
Already admin for for: Example Domain
Finished
```

If the user is not found:

```bash
Adding bob@example.com as admin to domain 42
Can't find user
Finished
```

---

## Error Handling

- If the user is not found, the script logs "Can't find user" and exits.
- If the domain is not found or another error occurs, the script may exit silently after logging "Finished".

---

## Exported Constants

_None. This script is intended to be run directly and does not export any modules or functions._

---

## See Also

- [models/index.cjs](../models/index.cjs) for the definition of `User` and `Domain` models.
- [async documentation](https://caolan.github.io/async/) for details on the async control flow library.

---

## Notes

- This script is intended for administrative or development use only.
- Ensure you have the necessary database access and permissions before running this script.
