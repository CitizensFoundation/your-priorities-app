# YpCollectionStats

A custom element that displays statistics for a collection, such as the number of posts, groups, communities, points, and users.

## Properties

| Name           | Type                  | Description                                      |
|----------------|-----------------------|--------------------------------------------------|
| collection     | YpCollectionData      | The collection data to display statistics for.   |
| collectionType | string                | The type of collection, e.g., 'community' or 'domain'. |

## Methods

No public methods are documented.

## Events

No events are documented.

## Examples

```typescript
// Example usage of the YpCollectionStats web component
<yp-collection-stats .collection=${collectionData} collectionType="community"></yp-collection-stats>
```

Please note that `YpCollectionData` should be defined elsewhere in your codebase, and `collectionData` should be an instance of `YpCollectionData` with the necessary properties filled in.