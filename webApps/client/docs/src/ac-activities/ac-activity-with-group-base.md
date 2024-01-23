# AcActivityWithGroupBase

Brief description of the class.

## Properties

| Name        | Type             | Description               |
|-------------|------------------|---------------------------|
| postId      | number \| undefined | The ID of the post.        |
| groupId     | number \| undefined | The ID of the group.       |
| communityId | number \| undefined | The ID of the community.   |
| activity    | AcActivityData    | The activity data object. |

## Methods

| Name            | Parameters | Return Type | Description                 |
|-----------------|------------|-------------|-----------------------------|
| hasGroupHeader  |            | boolean     | Returns a boolean indicating if the activity has a group header. |
| groupTitle      |            | string      | Returns the title of the group associated with the activity. |

## Examples

```typescript
// Example usage of AcActivityWithGroupBase
const activityWithGroupBase = new AcActivityWithGroupBase();

// Setting properties
activityWithGroupBase.postId = 123;
activityWithGroupBase.groupId = 456;
activityWithGroupBase.communityId = 789;

// Accessing computed properties
const hasHeader = activityWithGroupBase.hasGroupHeader;
const title = activityWithGroupBase.groupTitle;
```