# AcActivities

AcActivities is a custom web component that extends YpBaseElementWithLogin. It is responsible for displaying a list of activities, such as posts or news stories, within a domain, community, group, post, or user collection. It supports infinite scrolling, loading more data as the user scrolls down, and can display recommended posts alongside the main list of activities.

## Properties

| Name                        | Type                              | Description                                                                                   |
|-----------------------------|-----------------------------------|-----------------------------------------------------------------------------------------------|
| disableNewPosts             | Boolean                           | If true, new posts are disabled.                                                              |
| noRecommendedPosts          | Boolean                           | If true, no recommended posts are shown.                                                      |
| gotInitialData              | Boolean                           | If true, initial data has been loaded.                                                        |
| activities                  | Array<AcActivityData> \| undefined | The list of activities to display.                                                            |
| domainId                    | number \| undefined               | The ID of the domain to fetch activities from.                                                |
| collectionId                | number                            | The ID of the collection to fetch activities from.                                            |
| collectionType              | string                            | The type of collection to fetch activities from (e.g., 'domain', 'community', 'group').       |
| communityId                 | number \| undefined               | The ID of the community to fetch activities from.                                             |
| groupId                     | number \| undefined               | The ID of the group to fetch activities from.                                                 |
| postId                      | number \| undefined               | The ID of the post to fetch activities from.                                                  |
| postGroupId                 | number \| undefined               | The ID of the post group to fetch activities from.                                            |
| userId                      | number \| undefined               | The ID of the user to fetch activities from.                                                  |
| mode                        | 'activities' \| 'news_feeds'      | The mode of the component, determining the type of data to fetch.                             |
| url                         | string \| undefined               | The URL to fetch activities from.                                                             |
| latestProcessedActivityAt   | string \| undefined               | The timestamp of the latest processed activity.                                               |
| oldestProcessedActivityAt   | string \| undefined               | The timestamp of the oldest processed activity.                                               |
| activityIdToDelete          | number \| undefined               | The ID of the activity to delete.                                                             |
| recommendedPosts            | Array<YpPostData> \| undefined     | The list of recommended posts to display.                                                     |
| closeNewsfeedSubmissions    | Boolean                           | If true, newsfeed submissions are closed.                                                     |

## Methods

| Name                | Parameters                  | Return Type | Description                                                                 |
|---------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| renderItem          | activity: AcActivityData, index: number | TemplateResult | Renders an individual activity item.                                        |
| render              |                             | TemplateResult | Renders the component content.                                              |
| scrollEvent         | event: { last: number; }   | void        | Handles the scroll event to load more data.                                 |
| connectedCallback   |                             | void        | Lifecycle method called when the component is added to the DOM.             |
| disconnectedCallback|                             | void        | Lifecycle method called when the component is removed from the DOM.         |
| _openLogin          |                             | void        | Opens the login dialog.                                                     |
| _pointDeleted       | event: CustomEvent          | void        | Handles the deletion of a point.                                            |
| _deleteActivity     | event: CustomEvent          | void        | Requests confirmation for deleting an activity.                             |
| _reallyDelete       |                             | Promise<void> | Actually deletes the activity after confirmation.                           |
| _generateRequest    | typeId: number, typeName: string | void        | Generates the request URL and initiates data loading.                       |
| _loadMoreData       |                             | Promise<void> | Loads more activities when the user scrolls down.                           |
| loadNewData         |                             | Promise<void> | Loads new data for the activities list.                                     |
| _domainIdChanged    |                             | void        | Called when the domainId property changes.                                  |
| _communityIdChanged |                             | void        | Called when the communityId property changes.                               |
| _groupIdChanged     |                             | void        | Called when the groupId property changes.                                   |
| _postIdChanged      |                             | void        | Called when the postId property changes.                                    |
| _userIdChanged      |                             | void        | Called when the userId property changes.                                    |
| _clearScrollThreshold|                            | void        | Clears the scroll threshold.                                                |
| _getRecommendations | typeName: string, typeId: number | Promise<void> | Fetches recommended posts for the given type and ID.                        |
| _preProcessActivities| activities: Array<AcActivityData> | Array<AcActivityData> | Pre-processes activities before rendering.                                  |
| _processResponse    | activitiesResponse: AcActivitiesResponse | void        | Processes the response from the server and updates the activities list.     |
| scrollToItem        | item: AcActivityData        | void        | Scrolls to a specific activity item in the list.                            |
| fireResize          |                             | void        | Fires a resize event for the activities list.                               |

## Events (if any)

- **yp-point-deleted**: Emitted when a point is deleted.
- **yp-refresh-activities-scroll-threshold**: Emitted to refresh the scroll threshold.
- **yp-delete-activity**: Emitted when an activity is requested to be deleted.

## Examples

```typescript
// Example usage of the AcActivities component
<ac-activities
  .domainId=${123}
  .communityId=${456}
  .groupId=${789}
  .postId=${101}
  .userId=${102}
  .collectionType=${'community'}
  .collectionId=${456}
></ac-activities>
```

Please note that the above example is a hypothetical usage within an HTML template and assumes the necessary properties are set and the component is properly integrated within a web application.