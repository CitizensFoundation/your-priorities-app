# AcActivity

Represents an activity component that displays different types of activities such as posts, points, news stories, and status updates. It is a web component that extends `YpBaseElementWithLogin` and uses various properties to control its behavior and display.

## Properties

| Name          | Type                | Description                                       |
|---------------|---------------------|---------------------------------------------------|
| activity      | AcActivityData      | The activity data to be displayed.                |
| domainId      | number              | The ID of the domain associated with the activity.|
| communityId   | number              | The ID of the community associated with the activity.|
| groupId       | number              | The ID of the group associated with the activity. |
| postId        | number              | The ID of the post associated with the activity.  |
| postGroupId   | number              | The ID of the post group associated with the activity.|
| userId        | number              | The ID of the user associated with the activity.  |

## Methods

| Name              | Parameters        | Return Type | Description                                             |
|-------------------|-------------------|-------------|---------------------------------------------------------|
| renderActivity    | none              | TemplateResult | Renders the appropriate activity component based on the activity type. |
| render            | none              | TemplateResult | Renders the entire activity component.                   |
| fromTime          | timeValue: string | string      | Converts an ISO time string to a relative time string.   |
| fromLongTime      | timeValue: string | string      | Converts an ISO time string to a full locale date string.|
| hasActivityAccess | none              | boolean     | Determines if the current user has access to the activity.|
| _deleteActivity   | none              | void        | Emits an event to delete the activity.                   |
| _isNotActivityType| activity: AcActivityData, type: string | boolean | Checks if the activity is not of the specified type. |
| _isActivityType   | activity: AcActivityData, type: string | boolean | Checks if the activity is of the specified type.     |

## Events

- **yp-delete-activity**: Emitted when the delete activity button is clicked.

## Examples

```typescript
// Example usage of the AcActivity component
<ac-activity
  .activity="${this.someActivityData}"
  .domainId="${this.someDomainId}"
  .communityId="${this.someCommunityId}"
  .groupId="${this.someGroupId}"
  .postId="${this.somePostId}"
  .postGroupId="${this.somePostGroupId}"
  .userId="${this.someUserId}">
</ac-activity>
```

Note: `AcActivityData` is a type that should be defined elsewhere in the codebase, containing the structure of the activity data expected by this component.