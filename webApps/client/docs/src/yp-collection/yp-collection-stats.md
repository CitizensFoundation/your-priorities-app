# YpCollectionStats

The `YpCollectionStats` class is a custom web component that extends `YpBaseElement`. It is used to display statistical information about a collection, such as the number of posts, groups, communities, points, and users, depending on the type of collection.

## Properties

| Name           | Type                  | Description                                                                 |
|----------------|-----------------------|-----------------------------------------------------------------------------|
| collection     | YpCollectionData \| undefined | The data object containing statistical information about the collection.     |
| collectionType | string \| undefined   | The type of the collection, which determines which statistics are displayed. |

## Methods

| Name   | Parameters | Return Type | Description                                                                 |
|--------|------------|-------------|-----------------------------------------------------------------------------|
| render | None       | TemplateResult | Renders the HTML template for the component based on the collection data and type. |

## Examples

```typescript
// Example usage of the yp-collection-stats component
import './path/to/yp-collection-stats.js';

const collectionStatsElement = document.createElement('yp-collection-stats');
collectionStatsElement.collection = {
  counter_posts: 100,
  counter_groups: 5,
  counter_communities: 2,
  counter_points: 1500,
  counter_users: 300
};
collectionStatsElement.collectionType = 'community';
document.body.appendChild(collectionStatsElement);
```

This component uses the `YpFormattingHelpers` to format numbers for display and includes conditional rendering based on the `collectionType` property to show or hide specific statistics. The component also uses Material Design icons to visually represent different statistics.