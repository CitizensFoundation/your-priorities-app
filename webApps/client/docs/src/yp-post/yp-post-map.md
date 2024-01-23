# YpPostMap

The `YpPostMap` class is a custom element that extends `YpBaseElement` to display a map with markers representing posts. It uses `lit-google-map` to render the map and `yp-post-card` to display information about each post when a marker is clicked.

## Properties

| Name          | Type                     | Description                                           |
|---------------|--------------------------|-------------------------------------------------------|
| posts         | Array<YpPostData>        | An array of post data to be displayed on the map.     |
| groupId       | number                   | The ID of the group whose posts are to be displayed.  |
| communityId   | number                   | The ID of the community whose posts are to be shown.  |
| noPosts       | boolean                  | Indicates if there are no posts to display.           |
| selectedPost  | YpPostData               | The post data that is currently selected.             |
| collectionId  | number                   | The ID of the collection to which the posts belong.   |
| collectionType| string                   | The type of collection, e.g., 'community' or 'group'. |
| skipFitToMarkersNext | boolean           | Whether to skip fitting the map to markers next time. |

## Methods

| Name            | Parameters                  | Return Type | Description                                      |
|-----------------|-----------------------------|-------------|--------------------------------------------------|
| updated         | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called when properties change.  |
| renderInfoCard  | post: YpPostData            | TemplateResult \| typeof nothing | Renders the information card for a given post. |
| render          |                             | TemplateResult | Renders the map or a message if there are no posts. |
| resetMapHeight  |                             | void        | Resets the height of the map container.         |
| connectedCallback |                         | void        | Lifecycle method called when element is added to the DOM. |
| disconnectedCallback |                      | void        | Lifecycle method called when element is removed from the DOM. |
| _groupChanged   |                             | Promise<void> | Called when the `groupId` property changes.    |
| _communityChanged |                         | Promise<void> | Called when the `communityId` property changes. |
| _refreshAjax    |                             | void        | Refreshes the AJAX call to fetch posts.         |
| _response       | response: Array<YpPostData> | void        | Handles the response from the AJAX call.       |
| markerClick     | post: YpPostData            | void        | Handles the click event on a map marker.       |

## Events (if any)

- **yp-refresh-group-posts**: Emitted when the group posts need to be refreshed.

## Examples

```typescript
// Example usage of the YpPostMap custom element
<yp-post-map
  .posts="${this.posts}"
  .groupId="${this.groupId}"
  .communityId="${this.communityId}"
  .noPosts="${this.noPosts}"
  .selectedPost="${this.selectedPost}"
  .collectionId="${this.collectionId}"
  .collectionType="${this.collectionType}"
  .skipFitToMarkersNext="${this.skipFitToMarkersNext}">
</yp-post-map>
```

Note: The actual usage of the custom element would depend on the context in which it is used, including the data passed to its properties.