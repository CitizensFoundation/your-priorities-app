# YpAccessHelpers

A utility class providing static methods to check access rights for various objects like groups, communities, domains, posts, images, and points based on the user's admin or promoter rights.

## Methods

| Name                        | Parameters                                                                 | Return Type | Description                                                                                   |
|-----------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------------------------|
| _hasAdminRights             | objectId: number, adminRights: Array\<YpCollectionData\>                   | boolean     | Checks if the user has admin rights for the given object ID within the provided admin rights. |
| _hasPromoterAccess          | object: YpCollectionData \| YpImageData \| YpPointData \| YpPostData, objectId: number, promoterRights: Array\<YpCollectionData\> | boolean     | Checks if the user has promoter access for the given object.                                  |
| checkGroupPromoterAccess    | group: YpGroupData                                                         | boolean     | Checks if the user has promoter access to the specified group.                                |
| checkCommunityPromoterAccess| community: YpCommunityData                                                 | boolean     | Checks if the user has promoter access to the specified community.                            |
| _hasAccess                  | object: YpCollectionData \| YpImageData \| YpPointData \| YpPostData, objectId: number, adminRights: Array\<YpCollectionData\> | boolean     | Checks if the user has access to the given object based on admin rights.                      |
| hasImageAccess              | image: YpImageData, post: YpPostData                                       | boolean     | Checks if the user has access to the specified image within a post.                           |
| checkPostAccess             | post: YpPostData                                                           | boolean     | Checks if the user has access to the specified post.                                          |
| checkPointAccess            | point: YpPointData                                                         | boolean     | Checks if the user has access to the specified point.                                         |
| checkPostAdminOnlyAccess    | post: YpPostData                                                           | boolean     | Checks if the user has admin-only access to the specified post.                               |
| checkGroupAccess            | group: YpGroupData                                                         | boolean     | Checks if the user has access to the specified group.                                         |
| checkCommunityAccess        | community: YpCommunityData                                                 | boolean     | Checks if the user has access to the specified community.                                     |
| checkDomainAccess           | domain: YpDomainData                                                       | boolean     | Checks if the user has access to the specified domain.                                        |
| hasUserAccess               | user: YpUserData                                                           | boolean     | Checks if the user has access to the specified user profile.                                  |

## Examples

```typescript
// Example usage to check if a user has admin rights
const hasAdmin = YpAccessHelpers._hasAdminRights(objectId, adminRightsArray);

// Example usage to check if a user has promoter access to a group
const hasGroupPromoterAccess = YpAccessHelpers.checkGroupPromoterAccess(groupData);

// Example usage to check if a user has access to a post
const hasPostAccess = YpAccessHelpers.checkPostAccess(postData);
```