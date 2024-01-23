# AcActivityPointNewsStory

`AcActivityPointNewsStory` is a custom web component that extends `AcActivityWithGroupBase`. It is designed to display a news story post within an activity feed, including the post's name and associated point news story. It supports navigation to the post when the post name is clicked.

## Properties

| Name         | Type   | Description                                       |
|--------------|--------|---------------------------------------------------|
| hidePostName | boolean | Determines whether the post name should be hidden, based on the presence of a `postId`. |

## Methods

| Name       | Parameters | Return Type | Description |
|------------|------------|-------------|-------------|
| _goToPost  |            | void        | Navigates to the post associated with the activity when the post name is clicked. |

## Events

- **click**: Emitted when the post name (`yp-magic-text`) is clicked, triggering the `_goToPost` method.

## Examples

```typescript
// Example usage of AcActivityPointNewsStory
<ac-activity-point-news-story></ac-activity-point-news-story>
```

Note: The actual usage would typically involve binding the `activity` property with relevant data to display the news story post.