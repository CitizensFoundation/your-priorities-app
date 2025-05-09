# Script: addAdminToAllEntities.cjs

This script adds a specified user (by email) as an admin to all public domains, organizations, communities, and groups in the system. It is intended to be run from the command line and interacts directly with the database models.

---

## Usage

```bash
node addAdminToAllEntities.cjs user@example.com
```

- `user@example.com`: The email address of the user to be promoted to admin in all entities.

---

## Description

- **Purpose:**  
  Ensures that the specified user is an admin for all domains, organizations, communities, and groups in the database. If the user is not already an admin for a given entity, the script adds them as an admin.

- **Process:**  
  1. Finds the user by email.
  2. Iterates through all domains, organizations, communities, and groups.
  3. For each entity, checks if the user is already an admin.
  4. If not, adds the user as an admin for that entity.

- **Dependencies:**  
  - [models](../models/index.cjs): Sequelize models for User, Domain, Organization, Community, and Group.
  - [async](https://caolan.github.io/async/): For managing asynchronous control flow.

---

## Script Parameters

| Name      | Type   | Description                                 | Required |
|-----------|--------|---------------------------------------------|----------|
| userEmail | string | The email address of the user to be updated. | Yes      |

---

## Main Steps

### 1. Find User

- **Operation:**  
  Looks up the user in the database by the provided email.
- **Failure:**  
  If the user is not found, the script logs an error and does not proceed.

### 2. Add as Domain Admin

- **Operation:**  
  For each domain, checks if the user is already an admin (`hasDomainAdmins`).  
  If not, adds the user as an admin (`addDomainAdmins`).

### 3. Add as Organization Admin

- **Operation:**  
  For each organization, checks if the user is already an admin (`hasOrganizationAdmins`).  
  If not, adds the user as an admin (`addOrganizationAdmins`).

### 4. Add as Community Admin

- **Operation:**  
  For each community, checks if the user is already an admin (`hasCommunityAdmins`).  
  If not, adds the user as an admin (`addCommunityAdmins`).

### 5. Add as Group Admin

- **Operation:**  
  For each group, checks if the user is already an admin (`hasGroupAdmins`).  
  If not, adds the user as an admin (`addGroupAdmins`).

---

## Model Methods Used

### User Model

- `findOne({ where: { email } })`: Finds a user by email.

### Domain Model

- `findAll({ attributes: ['id', 'name'] })`: Retrieves all domains with their IDs and names.
- `hasDomainAdmins(user)`: Checks if the user is an admin of the domain.
- `addDomainAdmins(user)`: Adds the user as an admin of the domain.

### Organization Model

- `findAll()`: Retrieves all organizations.
- `hasOrganizationAdmins(user)`: Checks if the user is an admin of the organization.
- `addOrganizationAdmins(user)`: Adds the user as an admin of the organization.

### Community Model

- `findAll({ attributes: ['id', 'name'] })`: Retrieves all communities with their IDs and names.
- `hasCommunityAdmins(user)`: Checks if the user is an admin of the community.
- `addCommunityAdmins(user)`: Adds the user as an admin of the community.

### Group Model

- `findAll({ attributes: ['id', 'name'] })`: Retrieves all groups with their IDs and names.
- `hasGroupAdmins(user)`: Checks if the user is an admin of the group.
- `addGroupAdmins(user)`: Adds the user as an admin of the group.

---

## Output

- Logs progress to the console, including:
  - Whether the user was found.
  - For each entity, whether the user was already an admin or was added as an admin.
- Logs "Finished" when complete.

---

## Error Handling

- If the user is not found, logs "Can't find user" and does not proceed.
- If any error occurs during the async series, it is not explicitly handled, but the script will log "Finished" and exit.

---

## Example Output

```
Adding user@example.com as admin to all public communities and groups + domains
Found user John Doe
Adding admin user for: Domain A
Already admin for for: Domain B
Adding admin user for: Organization X
Already admin for for: Organization Y
Adding admin user for community: Community 1
Im back
Already admin for for: Community 2
Adding admin user for group: Group Alpha
Im back
Already admin for for: Group Beta
Finished
```

---

## Dependencies

- [../models/index.cjs](../models/index.cjs): Exports Sequelize models for User, Domain, Organization, Community, and Group.
- [async](https://caolan.github.io/async/): Used for managing asynchronous control flow.

---

## See Also

- [User Model](../models/index.cjs)
- [Domain Model](../models/index.cjs)
- [Organization Model](../models/index.cjs)
- [Community Model](../models/index.cjs)
- [Group Model](../models/index.cjs)

---

## Exported Constants

_None. This script is intended to be run directly and does not export any modules or constants._

---

## Notes

- This script is not intended to be used as an API endpoint or middleware, but as a one-off administrative tool.
- Ensure you have the necessary database access and permissions before running this script.
- The script uses legacy callback-based async patterns; consider refactoring to async/await for modern codebases.