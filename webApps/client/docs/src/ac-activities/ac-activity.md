# AcActivity

The `AcActivity` class is a web component that extends `YpBaseElementWithLogin`. It is designed to display and manage different types of activities within a community or group context. The component supports rendering various activity types such as posts, points, and status updates.

## Properties

| Name        | Type                      | Description                                                                 |
|-------------|---------------------------|-----------------------------------------------------------------------------|
| activity    | AcActivityData \| undefined | The activity data object containing details about the activity to be displayed. |
| domainId    | number \| undefined       | The ID of the domain associated with the activity.                          |
| communityId | number \| undefined       | The ID of the community associated with the activity.                       |
| groupId     | number \| undefined       | The ID of the group associated with the activity.                           |
| postId      | number \| undefined       | The ID of the post associated with the activity.                            |
| postGroupId | number \| undefined       | The ID of the post group associated with the activity.                      |
| userId      | number \| undefined       | The ID of the user associated with the activity.                            |

## Methods

| Name              | Parameters                  | Return Type | Description                                                                 |
|-------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| renderActivity    | None                        | TemplateResult | Renders the appropriate activity component based on the activity type.      |
| render            | None                        | TemplateResult | Renders the main activity content including user information and activity details. |
| fromTime          | timeValue: string           | string      | Converts an ISO time string to a relative time string.                      |
| fromLongTime      | timeValue: string           | string      | Converts an ISO time string to a full locale date-time string.              |
| hasActivityAccess | None                        | boolean     | Checks if the current user has access to the activity based on domain, community, group, or post. |
| _deleteActivity   | None                        | void        | Fires an event to delete the current activity.                              |
| _isNotActivityType| activity: AcActivityData, type: string | boolean | Checks if the activity type does not match the specified type.              |
| _isActivityType   | activity: AcActivityData, type: string | boolean | Checks if the activity type matches the specified type.                     |

## Events

- **yp-delete-activity**: Emitted when an activity is deleted, providing the activity ID as event detail.

## Examples

```typescript
// Example usage of the ac-activity component
import './ac-activity.js';

const activityElement = document.createElement('ac-activity');
activityElement.activity = {
  id: 1,
  type: 'activity.post.new',
  created_at: '2023-10-01T12:00:00Z',
  User: { /* user data */ },
  Domain: { /* domain data */ },
  Community: { /* community data */ },
  Group: { /* group data */ },
  Post: { /* post data */ }
};
document.body.appendChild(activityElement);
```