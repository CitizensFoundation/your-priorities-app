# API Endpoint: GET /:externalId/points

Retrieves a list of points associated with all communities matching the given `externalId`. The endpoint authenticates the user via an API key in the `X-API-KEY` header, verifies admin access to the relevant communities, and returns up to 100 points with related user, post, group, community, audio, and revision data. Supports filtering and ordering via query parameters.

---

## Request

### Parameters

| Name         | Type   | In    | Description                                                                 | Required |
|--------------|--------|-------|-----------------------------------------------------------------------------|----------|
| externalId   | string | path  | The external identifier for the community/communities to fetch points from. | Yes      |
| byHelpfulCount | boolean | query | If set, orders points by helpful count (upvotes - downvotes) descending.   | No       |
| fromDate     | string (ISO 8601) | query | Only include points created at or after this date.                        | No       |
| toDate       | string (ISO 8601) | query | Only include points created at or before this date.                       | No       |
| postId       | string | query | Only include points belonging to the specified post.                        | No       |
| offset       | number | query | Offset for pagination (default: 0).                                         | No       |

### Headers

| Name        | Type   | Description                                  | Required |
|-------------|--------|----------------------------------------------|----------|
| X-API-KEY   | string | API key for authenticating the user.         | Yes      |

### Body

No request body is required for this endpoint.

---

## Response

### Success (200)

```json
{
  "count": 2,
  "rows": [
    {
      "id": 123,
      "name": "Point title",
      "content": "Point content",
      "user_id": 1,
      "value": 10,
      "counter_quality_up": 5,
      "counter_quality_down": 1,
      "embed_data": {},
      "language": "en",
      "created_at": "2024-06-01T12:00:00Z",
      "public_data": {},
      "User": {
        "id": 1,
        "name": "Alice",
        "facebook_id": null,
        "twitter_id": null,
        "google_id": null,
        "github_id": null,
        "private_profile_data": {
          "registration_answers": {}
        },
        "UserProfileImages": [
          {
            "id": 10,
            "formats": {}
          }
        ]
      },
      "PointRevisions": [
        {
          "content": "Initial content",
          "value": 10,
          "embed_data": {},
          "created_at": "2024-06-01T12:00:00Z"
        }
      ],
      "PointAudios": [
        {
          "id": 5,
          "formats": {},
          "updated_at": "2024-06-01T13:00:00Z",
          "listenable": true
        }
      ],
      "Post": {
        "id": 99,
        "group_id": 7,
        "name": "Post name",
        "Group": {
          "id": 7,
          "name": "Group name",
          "Community": {
            "id": 3,
            "name": "Community name"
          }
        }
      }
    }
  ]
}
```

- `count`: Total number of points matching the query.
- `rows`: Array of point objects, each with user, post, group, community, audio, and revision data.

### Error (4xx, 5xx)

#### Unauthorized (401)

```json
{
  "error": "Unauthorized"
}
```
- Returned if the API key is missing, invalid, or the user is not an admin of the relevant communities.

#### Forbidden (401 with custom text)

```text
No admin access to community id: {communityId}
```
- Returned if the user is not an admin of one or more matched communities.

#### Internal Server Error (500)

```json
{
  "error": "Internal server error"
}
```
- Returned for unexpected errors.

---

# Middleware: loginUserFromHeader

Authenticates a user based on the `X-API-KEY` header. If a valid user is found, logs them in using `req.logIn`. Used as the first step in the endpoint's async series.

## Parameters

| Name | Type    | Description                        |
|------|---------|------------------------------------|
| req  | Request | Express request object             |
| res  | Response| Express response object            |
| done | function| Callback to continue or abort flow |

---

# Utility Module: logger

Handles logging of errors and other information. Used throughout the route for error reporting.

## Functions

| Name   | Parameters         | Return Type | Description                |
|--------|--------------------|-------------|----------------------------|
| error  | message: string, meta: object | void        | Logs an error message with metadata. |

---

# Utility Module: to_json

Utility for converting data to JSON. Not directly used in this file, but imported for possible use in response formatting.

---

# Service: models (Sequelize Models)

Provides access to all database models, including `User`, `Community`, `Point`, `Post`, `Group`, `Audio`, `Image`, `PointRevision`, and related methods.

## Methods (used in this file)

| Name                                 | Parameters         | Return Type | Description                                 |
|--------------------------------------|--------------------|-------------|---------------------------------------------|
| User.findOne                         | options: object    | Promise<User>| Finds a user by criteria.                   |
| Community.findAll                    | options: object    | Promise<Community[]>| Finds all communities by criteria.      |
| Point.findAndCountAll                | options: object    | Promise<{count, rows}>| Finds and counts points.           |
| Point.setVideosForPoints             | points: array, cb: function | void | Attaches video data to points.              |
| Point.setOrganizationUsersForPoints  | points: array, cb: function | void | Attaches organization user data to points.  |

---

# Exported Router

The file exports an Express router with the `/points` endpoint for externalId-based community point retrieval.

---

# Dependencies

- [express](https://expressjs.com/)
- [async](https://caolan.github.io/async/)
- [lodash](https://lodash.com/)
- [moment](https://momentjs.com/)
- [Sequelize](https://sequelize.org/) (via `models`)
- [logger](../utils/logger.cjs)
- [to_json](../utils/to_json.cjs)
- [authorization](../authorization.cjs) (imported but not used in this file)

---

# See Also

- [models/index.cjs](../models/index.cjs.md)
- [logger](../utils/logger.cjs.md)
- [to_json](../utils/to_json.cjs.md)
- [authorization](../authorization.cjs.md)
