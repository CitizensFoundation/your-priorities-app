# Service Module: copy_utils.cjs

This module provides a comprehensive set of utility functions for deep copying and cloning communities, groups, posts, and related entities (such as pages, points, endorsements, ratings, activities, and media) within a platform. It is designed to support complex duplication scenarios, including copying entire communities with or without users, posts, points, and endorsements, as well as more granular operations like copying a single group or post.

The module relies on Sequelize models (imported from `../models/index.cjs`), the `async` library for control flow, and several translation and recount utilities.

---

## Exported Functions

| Name                                                      | Parameters                                                                                                    | Return Type | Description                                                                                      |
|-----------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|-------------|--------------------------------------------------------------------------------------------------|
| copyCommunityNoUsersNoEndorsementsOneGroup                | communityId: number, groupId: number, toDomainId: number, done: Function                                      | void        | Copies a community, but only a single group, without users, endorsements, or activities.         |
| copyCommunityNoUsersNoEndorsements                        | communityId: number, toDomainId: number, done: Function                                                       | void        | Copies a community with all groups, posts, and points, but without users, endorsements, or activities. |
| copyCommunityNoUsersNoEndorsementsNoPoints                | communityId: number, toDomainId: number, done: Function                                                       | void        | Copies a community with all groups and posts, but without users, endorsements, points, or activities. |
| copyCommunityWithEverything                               | communityId: number, toDomainId: number, options: object, done: Function                                      | void        | Copies a community with all groups, posts, and points.                                           |
| clonePagesForGroup                                        | inGroup: Group, outGroup: Group, done: Function                                                               | void        | Clones all pages associated with a group from one group to another.                              |
| deepCopyCommunityOnlyStructureWithAdminsAndPosts           | communityId: number, toDomainId: number, done: Function                                                       | void        | Deep copies only the structure (groups, posts, admins) of a community, skipping users and points.|
| clonePagesForCommunity                                    | inCommunity: Community, outCommunity: Community, done: Function                                               | void        | Clones all pages associated with a community from one community to another.                      |
| copyCommunity                                             | fromCommunityId: number, toDomainId: number, options: object, linkFromOptions: object, done: Function         | void        | Core function to copy a community, with flexible options for what to include/exclude.            |
| copyCommunityOnlyGroups                                   | communityId: number, toDomainId: number, done: Function                                                       | void        | Copies only the groups of a community, skipping posts, points, users, and activities.            |
| copyGroup                                                 | fromGroupId: number, toCommunityIn: Community, toDomainId: number, options: object, done: Function            | void        | Copies a group, including its categories, admins, users, media, and optionally posts and points. |
| copyPost                                                  | fromPostId: number, toGroupId: number, options: object, done: Function                                        | void        | Copies a post, including its media, translations, endorsements, ratings, revisions, and points.  |

---

## Function: clonePagesForCollection

Clones all `Page` records associated with a given collection (e.g., Group or Community) from one instance to another, updating references and optionally the welcome page.

### Parameters

| Name           | Type      | Description                                                                 |
|----------------|-----------|-----------------------------------------------------------------------------|
| model          | Model     | Sequelize model (e.g., Group or Community)                                  |
| modelRelField  | string    | The foreign key field in the Page model (e.g., "group_id", "community_id")  |
| inCollection   | object    | The source collection instance                                              |
| outCollection  | object    | The destination collection instance                                         | 
| done           | Function  | Callback function (error: Error \| null)                                    |

---

## Function: clonePagesForGroup

Clones all pages from one group to another.

### Parameters

| Name     | Type   | Description                        |
|----------|--------|------------------------------------|
| inGroup  | Group  | Source group instance              |
| outGroup | Group  | Destination group instance         |
| done     | Function | Callback function (error: Error \| null) |

---

## Function: clonePagesForCommunity

Clones all pages from one community to another.

### Parameters

| Name         | Type      | Description                        |
|--------------|-----------|------------------------------------|
| inCommunity  | Community | Source community instance          |
| outCommunity | Community | Destination community instance     |
| done         | Function  | Callback function (error: Error \| null) |

---

## Function: copyPost

Copies a post and all its related data (media, translations, endorsements, ratings, revisions, user images, header images, points, and activities) from one group to another.

### Parameters

| Name        | Type     | Description                                                                 |
|-------------|----------|-----------------------------------------------------------------------------|
| fromPostId  | number   | ID of the post to copy                                                      |
| toGroupId   | number   | ID of the destination group                                                 |
| options     | object   | Copy options (see below)                                                    |
| done        | Function | Callback function (error: Error \| null, newPost: Post)                     |

#### Options

| Name                           | Type    | Description                                                                 |
|--------------------------------|---------|-----------------------------------------------------------------------------|
| copyPoints                     | boolean | Whether to copy points associated with the post                             |
| toCategoryId                   | number  | If set, assigns the new post to this category                               |
| skipUsers                      | boolean | If true, resets user counters                                               |
| resetEndorsementCounters       | boolean | If true, resets endorsement counters                                        |
| createCopyActivities           | boolean | If true, creates activity records for the copy actions                      |
| skipEndorsementQualitiesAndRatings | boolean | If true, skips copying endorsements and ratings                         |
| skipActivities                 | boolean | If true, skips copying activities                                           |

---

## Function: copyGroup

Copies a group and all its related data (categories, admins, users, media, posts, and optionally points) to a new community.

### Parameters

| Name            | Type      | Description                                                                 |
|-----------------|-----------|-----------------------------------------------------------------------------|
| fromGroupId     | number    | ID of the group to copy                                                     |
| toCommunityIn   | Community | Destination community instance                                              |
| toDomainId      | number    | ID of the destination domain                                                |
| options         | object    | Copy options (see below)                                                    |
| done            | Function  | Callback function (error: Error \| null, newGroup: Group)                   |

#### Options

| Name                | Type    | Description                                                               |
|---------------------|---------|---------------------------------------------------------------------------|
| skipUsers           | boolean | If true, skips copying users                                              |
| copyPoints          | boolean | If true, copies points                                                    |
| copyPosts           | boolean | If true, copies posts                                                     |
| setInGroupFolderId  | number  | If set, assigns the new group to this folder                              |
| deepCopyLinks       | boolean | If true, deep copies linked communities                                   |
| recountGroupPosts   | boolean | If true, recounts posts after copy                                        |

---

## Function: copyCommunity

Core function to copy a community, with flexible options for what to include/exclude (groups, posts, points, users, endorsements, activities, etc.).

### Parameters

| Name            | Type      | Description                                                                 |
|-----------------|-----------|-----------------------------------------------------------------------------|
| fromCommunityId | number    | ID of the community to copy                                                 |
| toDomainId      | number    | ID of the destination domain                                                |
| options         | object    | Copy options (see below)                                                    |
| linkFromOptions | object    | Optional. If set, sets custom back URL/name in the new community            |
| done            | Function  | Callback function (error: Error \| null, newCommunity: Community)           |

#### Options

| Name                | Type    | Description                                                               |
|---------------------|---------|---------------------------------------------------------------------------|
| copyGroups          | boolean | If true, copies groups                                                    |
| copyPosts           | boolean | If true, copies posts                                                     |
| copyPoints          | boolean | If true, copies points                                                    |
| skipUsers           | boolean | If true, skips copying users                                              |
| skipEndorsementQualitiesAndRatings | boolean | If true, skips copying endorsements and ratings                |
| resetEndorsementCounters | boolean | If true, resets endorsement counters                                 |
| skipActivities      | boolean | If true, skips copying activities                                         |
| copyOneGroupId      | number  | If set, only copies the specified group                                   |
| deepCopyLinks       | boolean | If true, deep copies linked communities                                   |
| recountGroupPosts   | boolean | If true, recounts posts after copy                                        |

---

## Function: copyCommunityWithEverything

Copies a community with all groups, posts, and points.

### Parameters

| Name        | Type     | Description                                                                 |
|-------------|----------|-----------------------------------------------------------------------------|
| communityId | number   | ID of the community to copy                                                 |
| toDomainId  | number   | ID of the destination domain                                                |
| options     | object   | Copy options (overrides defaults)                                           |
| done        | Function | Callback function (error: Error \| null, newCommunity: Community)           |

---

## Function: deepCopyCommunityOnlyStructureWithAdminsAndPosts

Deep copies only the structure (groups, posts, admins) of a community, skipping users and points.

### Parameters

| Name        | Type     | Description                                                                 |
|-------------|----------|-----------------------------------------------------------------------------|
| communityId | number   | ID of the community to copy                                                 |
| toDomainId  | number   | ID of the destination domain                                                |
| done        | Function | Callback function (error: Error \| null, newCommunity: Community)           |

---

## Function: copyCommunityNoUsersNoEndorsementsNoPoints

Copies a community with all groups and posts, but without users, endorsements, points, or activities. After copying, recounts the community.

### Parameters

| Name        | Type     | Description                                                                 |
|-------------|----------|-----------------------------------------------------------------------------|
| communityId | number   | ID of the community to copy                                                 |
| toDomainId  | number   | ID of the destination domain                                                |
| done        | Function | Callback function (error: Error \| null, newCommunity: Community)           |

---

## Function: copyCommunityNoUsersNoEndorsements

Copies a community with all groups, posts, and points, but without users, endorsements, or activities.

### Parameters

| Name        | Type     | Description                                                                 |
|-------------|----------|-----------------------------------------------------------------------------|
| communityId | number   | ID of the community to copy                                                 |
| toDomainId  | number   | ID of the destination domain                                                |
| done        | Function | Callback function (error: Error \| null, newCommunity: Community)           |

---

## Function: copyCommunityNoUsersNoEndorsementsOneGroup

Copies a community, but only a single group, without users, endorsements, or activities.

### Parameters

| Name        | Type     | Description                                                                 |
|-------------|----------|-----------------------------------------------------------------------------|
| communityId | number   | ID of the community to copy                                                 |
| groupId     | number   | ID of the group to copy                                                     |
| toDomainId  | number   | ID of the destination domain                                                |
| done        | Function | Callback function (error: Error \| null, newCommunity: Community)           |

---

## Function: copyCommunityOnlyGroups

Copies only the groups of a community, skipping posts, points, users, and activities.

### Parameters

| Name        | Type     | Description                                                                 |
|-------------|----------|-----------------------------------------------------------------------------|
| communityId | number   | ID of the community to copy                                                 |
| toDomainId  | number   | ID of the destination domain                                                |
| done        | Function | Callback function (error: Error \| null, newCommunity: Community)           |

---

## Internal Dependencies

- **models**: Sequelize models for all entities (Community, Group, Post, Page, User, Image, Video, Audio, Category, Endorsement, Rating, Point, Activity, etc.).
- **async**: For control flow (series, eachSeries, forEach).
- **cloneTranslationForGroup, cloneTranslationForCommunity, cloneTranslationForPoint, cloneTranslationForPost**: Utility functions for cloning translations (see [translation_cloning.cjs](./../services/utils/translation_cloning.md)).
- **recountCommunity**: Utility to recount community statistics (see [recount_utils.cjs](./recount_utils.md)).

---

## Example Usage

```javascript
const copyUtils = require('./copy_utils.cjs');

// Copy a community with everything
copyUtils.copyCommunityWithEverything(1, 2, {}, (err, newCommunity) => {
  if (err) {
    console.error('Copy failed:', err);
  } else {
    console.log('New community ID:', newCommunity.id);
  }
});

// Copy only the structure (no users, no points)
copyUtils.deepCopyCommunityOnlyStructureWithAdminsAndPosts(1, 2, (err, newCommunity) => {
  // ...
});
```

---

## Notes

- All copy functions are asynchronous and use callbacks in the Node.js style: `done(error, result)`.
- The module is designed for internal use in migration, duplication, or template creation scenarios.
- The copying process is deep and attempts to preserve relationships, media, and translations, but can be customized via options to skip or reset certain data.
- For more details on the models and their relationships, see the [models documentation](../models/index.md).

---

## See Also

- [translation_cloning.cjs](./../services/utils/translation_cloning.md)
- [recount_utils.cjs](./recount_utils.md)
- [models/index.cjs](../models/index.md)
