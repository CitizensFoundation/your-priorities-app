# YpCache

The `YpCache` class extends the `YpCodeBase` class and is responsible for caching various items such as activities, posts, communities, groups, and auto-translate data. It provides methods to add posts to the cache, retrieve posts from the cache, and update posts in the cache.

## Properties

| Name                          | Type                                             | Description                                           |
|-------------------------------|--------------------------------------------------|-------------------------------------------------------|
| cachedActivityItem            | AcActivityData \| undefined                      | Cached item of type `AcActivityData`.                 |
| cachedPostItem                | YpPostData \| undefined                          | Cached item of type `YpPostData`.                     |
| backToDomainCommunityItems    | Record<number, YpCommunityData \| undefined>     | Cache for domain community items by their IDs.        |
| backToCommunityGroupItems     | Record<number, YpGroupData \| undefined>         | Cache for community group items by their IDs.         |
| communityItemsCache           | Record<number, YpCommunityData>                  | Cache for community items by their IDs.               |
| groupItemsCache               | Record<number, YpGroupData>                      | Cache for group items by their IDs.                   |
| postItemsCache                | Record<number, YpPostData>                       | Cache for post items by their IDs.                    |
| autoTranslateCache            | Record<string, string[] \| string>               | Cache for auto-translate data by language codes.      |

## Methods

| Name                  | Parameters                  | Return Type                | Description                                                                 |
|-----------------------|-----------------------------|----------------------------|-----------------------------------------------------------------------------|
| addPostsToCacheLater  | posts: Array<YpPostData>    | void                       | Schedules the addition of posts to the cache after a random delay.          |
| addPostsToCache       | posts: Array<YpPostData>    | void                       | Adds an array of posts to the cache.                                        |
| getPostFromCache      | postId: number              | YpPostData \| undefined    | Retrieves a post from the cache by its ID.                                  |
| updatePostInCache     | post: YpPostData            | void                       | Updates the cache with the provided post data.                              |

## Examples

```typescript
// Example usage of adding posts to the cache
const ypCache = new YpCache();
const posts: Array<YpPostData> = [
  // ... array of YpPostData items
];
ypCache.addPostsToCache(posts);

// Example usage of getting a post from the cache
const postId = 123;
const cachedPost = ypCache.getPostFromCache(postId);
if (cachedPost) {
  // ... use the cached post
}

// Example usage of updating a post in the cache
const updatedPost: YpPostData = {
  // ... updated post data
};
ypCache.updatePostInCache(updatedPost);
```