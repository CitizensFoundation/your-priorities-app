# User Management Scripts

This folder contains small helper scripts for managing users from the command line.

## createUserAddDomain.ts
Create a new user and add them to a domain.

```bash
node createUserAddDomain.js <domainId> <email> <name> <password> [ssn]
```

## removeUserFromDomain.ts
Remove an existing user from a domain.

```bash
node removeUserFromDomain.js <domainId> <email>
```

## updateUserSsnFromEmail.ts
Update the SSN for a user found by email address.

```bash
node updateUserSsnFromEmail.js <email> <ssn>
```

## updatePasswordFromSsn.ts
Set a new password for a user identified by SSN.

```bash
node updatePasswordFromSsn.js <ssn> <newPassword>
```

## listDomainUsersWithSsn.ts
List users belonging to a domain that have a registered SSN.

```bash
node listDomainUsersWithSsn.js <domainId>
```

