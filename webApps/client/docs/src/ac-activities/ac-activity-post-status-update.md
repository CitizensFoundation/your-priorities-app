# AcActivityPostStatusUpdate

`AcActivityPostStatusUpdate` is a custom web component that extends `YpBaseElement` to display a status update for an activity post. It includes the group name, post name, and the status change content. The post name is clickable and will navigate the user to the post.

## Properties

| Name     | Type            | Description                                      |
|----------|-----------------|--------------------------------------------------|
| activity | AcActivityData  | The activity data containing the status update.  |

## Methods

| Name       | Parameters | Return Type | Description                                      |
|------------|------------|-------------|--------------------------------------------------|
| _goToPost  |            | void        | Navigates to the post associated with the activity. |

## Events

- **click**: Emitted when the post name is clicked, triggering navigation to the post.

## Examples

```typescript
// Example usage of AcActivityPostStatusUpdate
<ac-activity-post-status-update .activity=${activityData}></ac-activity-post-status-update>
```

Replace `activityData` with the actual `AcActivityData` object you want to display.