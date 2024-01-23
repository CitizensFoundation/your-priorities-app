# YpRecommendations

The `YpRecommendations` class is responsible for managing post recommendations, including caching, pre-fetching media, and handling recommendation callbacks for different groups.

## Properties

| Name                             | Type                                      | Description                                           |
|----------------------------------|-------------------------------------------|-------------------------------------------------------|
| recommendationsGroupCache        | Record<number, Array<YpPostData>>         | Cache of recommendations grouped by group ID.         |
| recommendationsSeenPostIds       | object \| undefined                       | Object tracking seen post IDs for recommendations.    |
| recommendationCallbacks          | Record<number, Function>                   | Callbacks for recommendation updates by group ID.     |
| lastRecommendationResponseLengths| Record<number, number>                    | Record of the last number of recommendations by group.|
| currentPostId                    | number \| undefined                       | The current post ID being considered for recommendation.|
| currentlyDownloadingIds          | Record<number, boolean>                   | Record of post IDs that are currently being downloaded to cache.|
| preCacheLimit                    | number                                    | The limit for how many items to pre-cache.            |
| serverApi                        | YpServerApi                               | Instance of `YpServerApi` to interact with the server.|

## Methods

| Name                           | Parameters                                  | Return Type | Description                                                                 |
|--------------------------------|---------------------------------------------|-------------|-----------------------------------------------------------------------------|
| getNextRecommendationForGroup  | groupId: number, currentPostId: number, recommendationCallback: Function | void        | Retrieves the next recommendation for a given group and invokes the callback.|
| _preCacheMediaForPost          | post: YpPostData                            | void        | Pre-caches media for a given post.                                          |
| _getImageFormatUrl             | images: Array<YpImageData> \| undefined, formatId: number | string      | Returns the URL for a specific image format.                                |
| _getCategoryImagePath          | post: YpPostData                            | string      | Returns the image path for a post's category icon.                          |
| _downloadItemToCache           | postId: number                              | void        | Downloads a post to the cache.                                              |
| _ensureNextItemsAreCached      | groupId: number                             | void        | Ensures that the next items in the recommendation list are cached.          |
| _getRecommendationsForGroup    | groupId: number                             | Promise<void> | Fetches recommendations for a specific group and updates the cache.        |
| _getSelectedPost               | groupId: number                             | YpPostData \| null | Selects the next post for recommendation from the cache.                  |
| reset                          |                                             | void        | Resets the recommendation caches and state.                                 |

## Examples

```typescript
// Example usage of YpRecommendations
const serverApi = new YpServerApi();
const recommendations = new YpRecommendations(serverApi);

// To get the next recommendation for a group
recommendations.getNextRecommendationForGroup(1, 123, (selectedPost) => {
  if (selectedPost) {
    console.log('Next recommendation:', selectedPost);
  } else {
    console.log('No more recommendations available.');
  }
});

// To reset the recommendation state
recommendations.reset();
```