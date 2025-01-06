# YpCache

The `YpCache` class extends `YpCodeBase` and provides caching mechanisms for various data types such as activities, posts, communities, and groups. It includes methods for managing and retrieving cached data efficiently.

## Properties

| Name                           | Type                                      | Description                                                                 |
|--------------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| cachedActivityItem             | AcActivityData \| undefined               | Cached activity item data.                                                  |
| cachedPostItem                 | YpPostData \| undefined                   | Cached post item data.                                                      |
| backToDomainCommunityItems     | Record<number, YpCommunityData \| undefined> | Cache for community items by domain.                                        |
| backToCommunityGroupItems      | Record<number, YpGroupData \| undefined>  | Cache for group items by community.                                         |
| communityItemsCache            | Record<number, YpCommunityData>           | Cache for community items.                                                  |
| groupItemsCache                | Record<number, YpGroupData>               | Cache for group items.                                                      |
| postItemsCache                 | Record<number, YpPostData>                | Cache for post items.                                                       |
| currentPostListForGroup        | Record<number, Array<YpPostData>>         | Current list of posts for each group.                                       |
| postCountsForGroup             | Record<number, number>                    | Count of posts for each group.                                              |
| autoTranslateCache             | Record<string, string[] \| string>        | Cache for auto-translated strings.                                          |

## Methods

| Name                           | Parameters                                      | Return Type          | Description                                                                 |
|--------------------------------|-------------------------------------------------|----------------------|-----------------------------------------------------------------------------|
| setPostCountsForGroup          | groupId: number, postCount: number              | void                 | Sets the post count for a specific group.                                   |
| getPostCountsForGroup          | groupId: number                                 | number               | Retrieves the post count for a specific group.                              |
| setCurrentPostListForGroup     | groupId: number, posts: Array<YpPostData>       | void                 | Sets the current list of posts for a specific group.                        |
| getPostPositionInTheGroupList  | groupId: number, postId: number                 | number               | Gets the position of a post in the group's post list. Returns -1 if not found. |
| getPreviousPostInGroupList     | groupId: number, postId: number                 | YpPostData \| undefined | Retrieves the previous post in the group's post list. Returns undefined if not found. |
| getNextPostInGroupList         | groupId: number, postId: number                 | YpPostData \| undefined | Retrieves the next post in the group's post list. Returns undefined if not found. |
| addPostsToCacheLater           | posts: Array<YpPostData>                        | void                 | Adds posts to the cache after a random delay.                               |
| addPostsToCache                | posts: Array<YpPostData>                        | void                 | Adds posts to the cache immediately.                                        |
| getPostFromCache               | postId: number                                  | YpPostData \| undefined | Retrieves a post from the cache by its ID.                                  |
| updatePostInCache              | post: YpPostData                                | void                 | Updates a post in the cache.                                                |

## Examples

```typescript
const cache = new YpCache();

// Set post count for a group
cache.setPostCountsForGroup(1, 10);

// Get post count for a group
const postCount = cache.getPostCountsForGroup(1);

// Set current post list for a group
cache.setCurrentPostListForGroup(1, [{ id: 101, content: 'Post 1' }, { id: 102, content: 'Post 2' }]);

// Get position of a post in the group list
const position = cache.getPostPositionInTheGroupList(1, 101);

// Get previous post in the group list
const previousPost = cache.getPreviousPostInGroupList(1, 102);

// Get next post in the group list
const nextPost = cache.getNextPostInGroupList(1, 101);

// Add posts to cache later
cache.addPostsToCacheLater([{ id: 103, content: 'Post 3' }]);

// Add posts to cache immediately
cache.addPostsToCache([{ id: 104, content: 'Post 4' }]);

// Get post from cache
const cachedPost = cache.getPostFromCache(104);

// Update post in cache
cache.updatePostInCache({ id: 104, content: 'Updated Post 4' });
```