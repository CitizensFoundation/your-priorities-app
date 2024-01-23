# AcActivities

The `AcActivities` class is a web component that displays a list of activities, such as posts or news stories, within a domain, community, group, post, or user context. It supports infinite scrolling, loading more data as the user scrolls down, and can display recommended posts. It also allows users to submit new posts if they are logged in.

## Properties

| Name                        | Type                                  | Description                                                                                   |
|-----------------------------|---------------------------------------|-----------------------------------------------------------------------------------------------|
| disableNewPosts             | Boolean                               | If true, disables the ability to submit new posts.                                            |
| noRecommendedPosts          | Boolean                               | If true, no recommended posts are shown.                                                      |
| gotInitialData              | Boolean                               | If true, indicates that the initial data has been loaded.                                     |
| activities                  | Array<AcActivityData> \| undefined    | An array of activity data objects.                                                            |
| domainId                    | number \| undefined                   | The ID of the domain context for the activities.                                              |
| collectionId                | number                                | The ID of the collection context for the activities.                                          |
| collectionType              | string                                | The type of collection context for the activities (e.g., 'domain', 'community').              |
| communityId                 | number \| undefined                   | The ID of the community context for the activities.                                           |
| groupId                     | number \| undefined                   | The ID of the group context for the activities.                                               |
| postId                      | number \| undefined                   | The ID of the post context for the activities.                                                |
| postGroupId                 | number \| undefined                   | The ID of the post group context for the activities.                                          |
| userId                      | number \| undefined                   | The ID of the user context for the activities.                                                |
| mode                        | 'activities' \| 'news_feeds'          | The mode of the component, which determines the type of data to display.                      |
| url                         | string \| undefined                   | The URL used to fetch activities data.                                                        |
| latestProcessedActivityAt   | string \| undefined                   | The timestamp of the latest processed activity.                                               |
| oldestProcessedActivityAt   | string \| undefined                   | The timestamp of the oldest processed activity.                                               |
| activityIdToDelete          | number \| undefined                   | The ID of the activity to delete.                                                             |
| recommendedPosts            | Array<YpPostData> \| undefined        | An array of recommended post data objects.                                                    |
| closeNewsfeedSubmissions    | Boolean                               | If true, closes the ability to submit new posts to the newsfeed.                              |

## Methods

| Name                | Parameters                  | Return Type | Description                                                                 |
|---------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| renderItem          | activity: AcActivityData, index: number | TemplateResult | Renders an individual activity item.                                        |
| render              |                             | TemplateResult | Renders the component content.                                              |
| scrollEvent         | event: { last: number; }    | void        | Handles the scroll event to load more data when reaching the end of the list.|
| connectedCallback   |                             | void        | Lifecycle callback that runs when the component is added to the DOM.        |
| disconnectedCallback|                             | void        | Lifecycle callback that runs when the component is removed from the DOM.    |
| _openLogin          |                             | void        | Opens the login dialog.                                                     |
| _pointDeleted       | event: CustomEvent          | void        | Removes an activity from the list when a point is deleted.                  |
| _activityDeletedResponse | event: CustomEvent     | void        | Removes an activity from the list based on a server response.               |
| _removeActivityId   | activityId: number          | void        | Removes an activity from the list by its ID.                                |
| _deleteActivity     | event: CustomEvent          | void        | Initiates the deletion of an activity.                                      |
| _reallyDelete       |                             | Promise<void> | Confirms and carries out the deletion of an activity.                      |
| _generateRequest    | typeId: number, typeName: string | void | Generates a request to load activities data.                               |
| _loadMoreData       |                             | Promise<void> | Loads more activities data when needed.                                    |
| loadNewData         |                             | Promise<void> | Loads new activities data.                                                 |
| _domainIdChanged    |                             | void        | Handles changes to the domain ID property.                                  |
| _communityIdChanged |                             | void        | Handles changes to the community ID property.                               |
| _groupIdChanged     |                             | void        | Handles changes to the group ID property.                                   |
| _postIdChanged      |                             | void        | Handles changes to the post ID property.                                    |
| _userIdChanged      |                             | void        | Handles changes to the user ID property.                                    |
| _clearScrollThreshold|                            | void        | Clears the scroll threshold.                                                |
| _getRecommendations | typeName: string, typeId: number | Promise<void> | Fetches recommended posts.                                                |
| _preProcessActivities| activities: Array<AcActivityData> | Array<AcActivityData> | Pre-processes activities data before rendering. |
| _processResponse    | activitiesResponse: AcActivitiesResponse | void | Processes the response from the server after loading activities data.      |
| scrollToItem        | item: AcActivityData        | void        | Scrolls to a specific activity item in the list.                            |
| fireResize          |                             | void        | Triggers a resize event for the list.                                       |

## Events (if any)

- **yp-open-login**: Emitted when the login dialog needs to be opened.
- **yp-refresh-activities-scroll-threshold**: Emitted to refresh the activities scroll threshold.
- **ak-delete-activity**: Emitted when an activity is requested to be deleted.
- **yp-point-deleted**: Emitted when a point is deleted.
- **yp-refresh-activities-scroll-threshold**: Emitted to clear the scroll threshold.

## Examples

```typescript
// Example usage of the AcActivities component
<ac-activities
  .domainId=${123}
  .communityId=${456}
  .groupId=${789}
  .postId=${101}
  .userId=${102}
  .collectionId=${103}
  .collectionType=${'community'}
  .mode=${'activities'}
  .disableNewPosts=${false}
  .noRecommendedPosts=${true}
  .gotInitialData=${false}
  .activities=${[/* array of AcActivityData */]}
  .recommendedPosts=${[/* array of YpPostData */]}
></ac-activities>
```

Note: The above example is a hypothetical usage scenario of the `AcActivities` component within an HTML template. The actual implementation may vary depending on the context in which it is used.