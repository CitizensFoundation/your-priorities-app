# Model: Invite

Represents an invitation entity in the system, used for inviting users to groups, communities, posts (ideas), or as friends. The model supports soft deletion, expiration, and metadata storage. It is associated with several other models, including Community, Group, Post, and User (as both sender and recipient).

## Properties

| Name         | Type      | Description                                                                 |
|--------------|-----------|-----------------------------------------------------------------------------|
| type         | number    | Type of invite. See [Invite Types](#invite-types) below. Required.          |
| expires_at   | Date      | The date and time when the invite expires.                                  |
| token        | string    | Unique token for the invite, used for validation and lookup.                |
| joined_at    | Date      | The date and time when the invite was accepted (joined).                    |
| metadata     | object    | Additional metadata for the invite, stored as JSONB.                        |
| deleted      | boolean   | Soft delete flag. If true, the invite is considered deleted. Default: false.|
| created_at   | Date      | Timestamp when the invite was created.                                      |
| updated_at   | Date      | Timestamp when the invite was last updated.                                 |

## Associations

| Association         | Model      | Foreign Key      | Description                                 |
|---------------------|------------|------------------|---------------------------------------------|
| belongsTo           | Community  | community_id     | The community to which the invite relates.  |
| belongsTo           | Group      | group_id         | The group to which the invite relates.      |
| belongsTo           | Post       | post_id          | The post (idea) to which the invite relates.|
| belongsTo (as)      | User (FromUser) | from_user_id | The user who sent the invite.               |
| belongsTo (as)      | User (ToUser)   | to_user_id   | The user who is invited.                    |

## Configuration

- **defaultScope**: Only returns invites where `deleted` is `false`.
- **timestamps**: Enabled. Uses `created_at` and `updated_at` as field names.
- **indexes**: Index on `token` where `deleted` is `false`.
- **underscored**: Uses snake_case for column names.
- **tableName**: `invites`

## Exported Constants

### Invite Types

| Constant Name                                 | Value | Description                                               |
|-----------------------------------------------|-------|-----------------------------------------------------------|
| Invite.INVITE_TO_GROUP                        | 0     | Invite to a group.                                        |
| Invite.INVITE_TO_COMMUNITY                    | 1     | Invite to a community.                                    |
| Invite.INVITE_TO_IDEA                         | 2     | Invite to a post/idea.                                    |
| Invite.INVITE_TO_FRIEND                       | 3     | Invite to become a friend.                                |
| Invite.INVITE_TO_COMMUNITY_AND_GROUP_AS_ANON  | 4     | Invite to community and group as an anonymous user.       |

## Methods

### Invite.checkIfColumnExists

Checks if a given column exists in the Invite model's attributes.

#### Parameters

| Name        | Type     | Description                        |
|-------------|----------|------------------------------------|
| columnName  | string   | The name of the column to check.   |

#### Returns

- `boolean` — Returns `true` if the column exists, `false` otherwise.

#### Example

```javascript
const exists = Invite.checkIfColumnExists('token'); // true
```

---

**See also:**  
- [Community](./Community.md)  
- [Group](./Group.md)  
- [Post](./Post.md)  
- [User](./User.md)  

**Table:** `invites`  
**Soft delete:** Supported via `deleted` flag.  
**Timestamps:** `created_at`, `updated_at`