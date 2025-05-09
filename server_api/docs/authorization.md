# Utility Module: auth.cjs

This module provides a comprehensive authentication and authorization system for an Express.js application, supporting role-based access control (RBAC) for users, groups, communities, domains, organizations, posts, points, images, categories, and bulk status updates. It integrates with the application's data models and supports both user-based and API key-based authentication, including advanced SAML and SSN-based login checks.

## Overview

- **Purpose:** Centralized authentication and authorization logic for all major entities and actions in the application.
- **Key Features:**
  - Role and entity registration for RBAC.
  - Middleware for authentication checks.
  - Support for anonymous, SAML, and API key logins.
  - Fine-grained access checks for create, view, edit, and vote actions.
  - Integration with Sequelize models for dynamic permission checks.

---

## Exported Functions

### isAuthenticated(req, group?)

Checks if the request is authenticated, considering group configuration and anonymous user rules.

| Name  | Type    | Description                                 |
|-------|---------|---------------------------------------------|
| req   | Request | Express request object                      |
| group | Object? | Optional group object for context           |

**Returns:** `boolean`  
Returns `true` if the user is authenticated (including anonymous user logic), otherwise `false`.

---

### isAuthenticatedNoAnonymousCheck(req)

Checks if the request is authenticated, ignoring anonymous user logic.

| Name  | Type    | Description                                 |
|-------|---------|---------------------------------------------|
| req   | Request | Express request object                      |

**Returns:** `boolean`  
Returns `true` if the user is authenticated (ignores anonymous user logic).

---

### isLoggedIn(req, res, next)

Express middleware that checks if the user is authenticated (including anonymous user logic). Calls `next()` if authenticated, otherwise passes a 401 error.

| Name | Type     | Description                  |
|------|----------|------------------------------|
| req  | Request  | Express request object       |
| res  | Response | Express response object      |
| next | Function | Express next function        |

---

### isLoggedInNoAnonymousCheck(req, res, next)

Express middleware that checks if the user is authenticated (ignoring anonymous user logic). Calls `next()` if authenticated, otherwise passes a 401 error.

| Name | Type     | Description                  |
|------|----------|------------------------------|
| req  | Request  | Express request object       |
| res  | Response | Express response object      |
| next | Function | Express next function        |

---

### authNeedsGroupForCreate(group, req, done)

Checks if the user is authorized to create an entity in a group context.

| Name  | Type     | Description                                 |
|-------|----------|---------------------------------------------|
| group | Object   | Group object                                |
| req   | Request  | Express request object                      |
| done  | Function | Callback: `(error, authorized: boolean)`    |

---

### authNeedsGroupAdminForCreate(group, req, done)

Checks if the user is a group admin or owner for create actions.

| Name  | Type     | Description                                 |
|-------|----------|---------------------------------------------|
| group | Object   | Group object                                |
| req   | Request  | Express request object                      |
| done  | Function | Callback: `(error, authorized: boolean)`    |

---

### authNeedsCommunnityAdminForCreate(community, req, done)

Checks if the user is a community admin or owner for create actions.

| Name      | Type     | Description                                 |
|-----------|----------|---------------------------------------------|
| community | Object   | Community object                            |
| req       | Request  | Express request object                      |
| done      | Function | Callback: `(error, authorized: boolean)`    |

---

### hasCommunitySsnLoginListAccess(community, req, done)

Checks if the user has access to a community via SSN login list.

| Name      | Type     | Description                                 |
|-----------|----------|---------------------------------------------|
| community | Object   | Community object                            |
| req       | Request  | Express request object                      |
| done      | Function | Callback: `(error, authorized: boolean)`    |

---

### hasCommunityAccess(community, req, done)

Checks if the user has access to a community (user, admin, or SSN list).

| Name      | Type     | Description                                 |
|-----------|----------|---------------------------------------------|
| community | Object   | Community object                            |
| req       | Request  | Express request object                      |
| done      | Function | Callback: `(error, authorized: boolean)`    |

---

### hasDomainAdmin(domainId, req, done)

Checks if the user is a domain admin or owner.

| Name     | Type     | Description                                 |
|----------|----------|---------------------------------------------|
| domainId | string   | Domain ID                                   |
| req      | Request  | Express request object                      |
| done     | Function | Callback: `(error, authorized: boolean)`    |

---

### isGroupMemberOrOpenToCommunityMember(group, req, done)

Checks if the user is a group member, group admin, or community member/admin for open groups.

| Name  | Type     | Description                                 |
|-------|----------|---------------------------------------------|
| group | Object   | Group object                                |
| req   | Request  | Express request object                      |
| done  | Function | Callback: `(error, authorized: boolean)`    |

---

## Role and Entity Registration

The module uses the `role` and `entity` registration pattern to define RBAC logic for all major entities. Each role is a function that receives the entity, request, and a callback, and determines if the user is authorized.

### Example: Registering a Role

```js
auth.role("group.admin", function (group, req, done) {
  // ...authorization logic...
});
```

### Example: Registering an Entity

```js
auth.entity("group", function (req, done) {
  // ...extract group from URL...
});
```

### Registered Roles

| Role Name                                 | Entity Type         | Description                                                                                  |
|--------------------------------------------|---------------------|----------------------------------------------------------------------------------------------|
| user.admin                                | user                | User is admin of their own user entity                                                       |
| domain.admin                              | domain              | User is admin of a domain                                                                    |
| domain.viewUser                           | domain              | User can view a domain                                                                       |
| organization.admin                        | organization        | User is admin of an organization                                                             |
| organization.viewUser                     | organization        | User can view an organization                                                                |
| bulkStatusUpdates.admin                   | community           | User is admin of bulk status updates for a community                                         |
| community.marketing                       | community           | User is community admin or promoter                                                          |
| group.marketing                           | group               | User is group admin or promoter                                                              |
| community.admin                           | community           | User is admin of a community                                                                 |
| community.viewUser                        | community           | User can view a community                                                                    |
| group.admin                               | group               | User is admin of a group                                                                     |
| group.viewUser                            | group               | User can view a group                                                                        |
| group.addTo                               | group               | User can add to a group                                                                      |
| post.admin                                | post                | User is admin of a post                                                                      |
| post.statusChange                         | post                | User can change status of a post                                                             |
| post.viewUser                             | post                | User can view a post                                                                         |
| post.vote                                 | post                | User can vote on a post                                                                      |
| point.admin                               | point               | User is admin of a point                                                                     |
| point.viewUser                            | point               | User can view a point                                                                        |
| point.addTo                               | point               | User can add to a point                                                                      |
| point.vote                                | point               | User can vote on a point                                                                     |
| image.viewUser                            | image               | User can view an image                                                                       |
| category.admin                            | category            | User is admin of a category                                                                  |
| category.viewUser                         | category            | User can view a category                                                                     |
| createCommunityBulkStatusUpdate.createBulkStatusUpdate | community | User can create a bulk status update in a community                                          |
| createGroupCategory.createCategory         | group               | User can create a category in a group                                                        |
| createGroupPost.createPost                 | group               | User can create a post in a group                                                            |
| createGroupPoint.createPoint               | group               | User can create a point in a group                                                           |
| createCommunityGroup.createGroup           | community           | User can create a group in a community                                                       |
| createDomainCommunity.createCommunity      | domain              | User can create a community in a domain                                                      |
| createDomainOrganization.createDomainOrganization | domain        | User can create an organization in a domain                                                  |
| createCommunityOrganization.createCommunityOrganization | community | User can create an organization in a community                                               |

### Registered Entities

| Entity Name                    | Extraction Logic (from URL)                |
|--------------------------------|--------------------------------------------|
| user                           | `/users/:userId`                          |
| domain                         | `/domains/:domainId`, `/videos/:id`, etc. |
| organization                   | `/organizations/:organizationId`          |
| bulkStatusUpdates              | `/bulk_status_updates/:communityId`       |
| community                      | `/communities/:communityId`, `/videos/:id`, etc. |
| group                          | `/groups/:groupId`, `/allOurIdeas/:id`, etc. |
| post                           | `/posts/:postId`, `/images/:id`, etc.     |
| point                          | `/points/:pointId`, `/videos/:id`, etc.   |
| image                          | `/images/:imageId`                        |
| category                       | `/categories/:categoryId`                 |
| createCommunityBulkStatusUpdate| `/bulk_status_updates/:communityId`       |
| createGroupCategory            | `/categories/:groupId`                    |
| createGroupPost                | `/posts/:groupId`, `/videos/:id`, etc.    |
| createGroupPoint               | `/points/:groupId`                        |
| createCommunityGroup           | `/groups/:communityId`, `/allOurIdeas/:id`|
| createDomainCommunity          | `/communities/:communityId`, `/groups/:id`, `/allOurIdeas/:id` |
| createDomainOrganization       | `/organizations/:domainId`                |
| createCommunityOrganization    | `/organizations/:communityId`             |

---

## Action Registration

The module maps high-level actions to one or more roles, enabling RBAC checks for application features.

| Action Name                    | Roles Required                                 |
|--------------------------------|------------------------------------------------|
| edit domain                    | domain.admin                                   |
| edit organization              | organization.admin                             |
| edit community                 | community.admin                                |
| edit group                     | group.admin                                    |
| edit post                      | post.admin                                     |
| send status change             | post.statusChange                              |
| edit user                      | user.admin                                     |
| edit category                  | category.admin                                 |
| edit point                     | point.admin                                    |
| delete point                   | point.admin                                    |
| edit bulkStatusUpdate          | bulkStatusUpdates.admin                        |
| edit community marketing       | community.marketing                            |
| edit group marketing           | group.marketing                                |
| view organization              | organization.viewUser                          |
| view domain                    | domain.viewUser                                |
| view community                 | community.viewUser                             |
| view group                     | group.viewUser                                 |
| add to group                   | group.addTo                                    |
| view post                      | post.viewUser                                  |
| view category                  | category.viewUser                              |
| view point                     | point.viewUser                                 |
| add to point                   | point.addTo                                    |
| view image                     | image.viewUser                                 |
| vote on post                   | post.vote                                      |
| vote on point                  | point.vote                                     |
| rate post                      | post.vote                                      |
| add post user images           | post.vote                                      |
| create domainOrganization      | createDomainOrganization.createDomainOrganization|
| create communityOrganization   | createCommunityOrganization.createCommunityOrganization|
| create community               | createDomainCommunity.createCommunity          |
| create group                   | createCommunityGroup.createGroup               |
| create post                    | createGroupPost.createPost                     |
| create media                   | createGroupPost.createPost                     |
| create category                | createGroupCategory.createCategory             |
| create point                   | createGroupPoint.createPoint                   |
| create bulkStatusUpdate        | createCommunityBulkStatusUpdate.createBulkStatusUpdate|

---

## Internal Utility Functions

### isAuthenticatedAndCorrectLoginProvider(req, group, done)

Performs advanced authentication checks, including SAML and SSN-based login provider validation.

| Name  | Type     | Description                                 |
|-------|----------|---------------------------------------------|
| req   | Request  | Express request object                      |
| group | Object   | Group object                                |
| done  | Function | Callback: `(authorized: boolean)`           |

---

## Example Usage

### Middleware Usage

```javascript
const auth = require('./auth.cjs');

app.post('/groups/:groupId/posts', auth.isLoggedIn, (req, res) => {
  // Only authenticated users can create posts in a group
});
```

### Role Check Usage

```javascript
auth.role("group.admin", function (group, req, done) {
  // Custom logic for group admin
});
```

---

## Dependencies

- [models/index.cjs](./models/index.cjs): Sequelize models for all entities.
- [./utils/logger.cjs](./utils/logger.cjs): Logging utility.
- [./utils/to_json.cjs](./utils/to_json.cjs): JSON utility (not directly used in this file).
- `authorized`: External RBAC library (assumed to provide `role`, `entity`, `action` registration).

---

## Environment Variables

- `PS_TEMP_AGENTS_FABRIC_GROUP_API_KEY`: If set, allows API key-based authentication for certain actions.

---

## Notes

- All callbacks follow the Node.js convention: `done(error, result)` or `done(result)` for some role/entity functions.
- The module is designed to be extensible for new entities, roles, and actions.
- For more details on the models used (e.g., Group, Community, Domain, Organization, Post, Point, Image, Category), see the [models documentation](./models/index.cjs.md).

---

## See Also

- [models/index.cjs](./models/index.cjs.md)
- [./utils/logger.cjs](./utils/logger.cjs.md)
- [./utils/to_json.cjs](./utils/to_json.cjs.md)
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts) (for agent-related logic, if applicable)

---

**Module Export:**  
The module exports the `auth` object, which includes all role/entity/action registrations and utility functions described above.