# AcActivityPointNewsStory

The `AcActivityPointNewsStory` is a custom web component that extends `AcActivityWithGroupBase`. It is designed to display a news story point with optional group headers and post names.

## Properties

| Name          | Type   | Description                                                                 |
|---------------|--------|-----------------------------------------------------------------------------|
| activity      | any    | The activity data containing Post and Point information.                    |
| hasGroupHeader| boolean| Determines if the group header should be displayed.                         |
| groupTitle    | string | The title of the group, displayed if `hasGroupHeader` is true.              |
| postId        | any    | The ID of the post, used to determine if the post name should be hidden.    |

## Methods

| Name       | Parameters | Return Type | Description                                                                 |
|------------|------------|-------------|-----------------------------------------------------------------------------|
| _goToPost  | none       | void        | Navigates to the post using `YpNavHelpers.goToPost` with the post's ID.     |

## Examples

```typescript
// Example usage of the AcActivityPointNewsStory component
import './ac-activity-point-news-story.js';

const activityElement = document.createElement('ac-activity-point-news-story');
activityElement.activity = {
  Post: {
    id: '123',
    name: 'Example Post',
    language: 'en'
  },
  Point: {
    // Point data here
  }
};
activityElement.hasGroupHeader = true;
activityElement.groupTitle = 'Group Title Example';
document.body.appendChild(activityElement);
```

This component uses the `yp-magic-text` and `yp-point-news-story` components to render the post name and news story point, respectively. The styles are defined to provide a consistent layout and appearance. The `_goToPost` method is used to handle navigation when the post name is clicked.