# AcActivities

The `AcActivities` class is a web component that extends `YpBaseElementWithLogin`. It is designed to display a list of activities, manage user interactions, and handle data loading and rendering for activities and recommended posts.

## Properties

| Name                        | Type                                | Description                                                                 |
|-----------------------------|-------------------------------------|-----------------------------------------------------------------------------|
| disableNewPosts             | boolean                             | Determines if new posts are disabled.                                       |
| noRecommendedPosts          | boolean                             | Indicates if there are no recommended posts.                                |
| gotInitialData              | boolean                             | Indicates if the initial data has been loaded.                              |
| activities                  | Array<AcActivityData> \| undefined  | The list of activities to display.                                          |
| domainId                    | number \| undefined                 | The ID of the domain associated with the activities.                        |
| label                       | string \| undefined                 | The label for the component.                                                |
| addLabel                    | string \| undefined                 | The label for adding new content.                                           |
| notLoggedInLabel            | string \| undefined                 | The label displayed when the user is not logged in.                         |
| collectionId                | number                              | The ID of the collection associated with the activities.                    |
| collectionType              | string                              | The type of collection (e.g., domain, community, group, post, user).        |
| communityId                 | number \| undefined                 | The ID of the community associated with the activities.                     |
| groupId                     | number \| undefined                 | The ID of the group associated with the activities.                         |
| postId                      | number \| undefined                 | The ID of the post associated with the activities.                          |
| postGroupId                 | number \| undefined                 | The ID of the post group associated with the activities.                    |
| userId                      | number \| undefined                 | The ID of the user associated with the activities.                          |
| mode                        | "activities" \| "news_feeds"        | The mode of the component, either "activities" or "news_feeds".             |
| url                         | string \| undefined                 | The URL for fetching activities data.                                       |
| latestProcessedActivityAt   | string \| undefined                 | The timestamp of the latest processed activity.                             |
| oldestProcessedActivityAt   | string \| undefined                 | The timestamp of the oldest processed activity.                             |
| activityIdToDelete          | number \| undefined                 | The ID of the activity to be deleted.                                       |
| recommendedPosts            | Array<YpPostData> \| undefined      | The list of recommended posts.                                              |
| closeNewsfeedSubmissions    | boolean                             | Indicates if newsfeed submissions are closed.                               |

## Methods

| Name                      | Parameters                                      | Return Type | Description                                                                 |
|---------------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| updated                   | changedProperties: Map<string \| number \| symbol, unknown> | void        | Called when the component is updated. Handles changes to specific properties. |
| renderItem                | activity: AcActivityData, index: number         | TemplateResult | Renders an individual activity item.                                        |
| render                    |                                                 | TemplateResult | Renders the component's template.                                           |
| scrollEvent               | event: { last: number }                         | void        | Handles scroll events to load more data if needed.                          |
| connectedCallback         |                                                 | void        | Called when the component is added to the document. Sets up event listeners.|
| disconnectedCallback      |                                                 | void        | Called when the component is removed from the document. Cleans up event listeners. |
| _openLogin                |                                                 | void        | Fires an event to open the login dialog.                                    |
| _pointDeleted             | event: CustomEvent                              | void        | Handles the deletion of a point from the activities.                        |
| wideListOffset            |                                                 | string      | Computes the offset for wide lists.                                         |
| ironListResizeScrollThreshold |                                           | number      | Computes the scroll threshold for resizing the list.                        |
| ironListPaddingTop        |                                                 | number      | Computes the padding top for the list.                                      |
| _removeActivityId         | activityId: number                              | void        | Removes an activity by its ID.                                              |
| _deleteActivity           | event: CustomEvent                              | void        | Initiates the deletion of an activity.                                      |
| _reallyDelete             |                                                 | Promise<void> | Confirms and deletes an activity.                                           |
| _generateRequest          | typeId: number, typeName: string                | void        | Generates a request to load activities based on type and ID.                |
| _loadMoreData             |                                                 | Promise<void> | Loads more activity data from the server.                                   |
| loadNewData               |                                                 | Promise<void> | Loads new activity data from the server.                                    |
| _domainIdChanged          |                                                 | void        | Handles changes to the domain ID.                                           |
| _communityIdChanged       |                                                 | void        | Handles changes to the community ID.                                        |
| _groupIdChanged           |                                                 | void        | Handles changes to the group ID.                                            |
| _postIdChanged            |                                                 | void        | Handles changes to the post ID.                                             |
| _userIdChanged            |                                                 | void        | Handles changes to the user ID.                                             |
| _clearScrollThreshold     |                                                 | void        | Clears the scroll threshold.                                                |
| _getRecommendations       | typeName: string, typeId: number                | Promise<void> | Fetches recommended posts based on type and ID.                             |
| _preProcessActivities     | activities: Array<AcActivityData>               | Array<AcActivityData> | Pre-processes activities before rendering.                                  |
| _processResponse          | activitiesResponse: AcActivitiesResponse, newData: boolean | void | Processes the response from the server and updates the activities list.     |
| scrollToItem              | item: AcActivityData                            | void        | Scrolls to a specific activity item.                                        |
| fireResize                |                                                 | void        | Fires a resize event for the activities list.                               |

## Events

- **yp-open-login**: Emitted to open the login dialog.
- **yp-point-deleted**: Emitted when a point is deleted from the activities.
- **yp-refresh-activities-scroll-threshold**: Emitted to refresh the scroll threshold for activities.
- **yp-delete-activity**: Emitted to initiate the deletion of an activity.

## Examples

```typescript
// Example usage of the AcActivities component
import './ac-activities.js';

const activitiesElement = document.createElement('ac-activities');
activitiesElement.domainId = 123;
activitiesElement.collectionType = 'domain';
document.body.appendChild(activitiesElement);
```