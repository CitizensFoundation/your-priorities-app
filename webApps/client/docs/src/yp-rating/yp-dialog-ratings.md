# YpDialogRatings

`YpDialogRatings` is a custom web component that extends `YpBaseElement` to provide a dialog interface for rating items within a post. It allows users to add or delete ratings for a specific post and displays custom ratings with emojis.

## Properties

| Name            | Type                  | Description                                           |
|-----------------|-----------------------|-------------------------------------------------------|
| itemName        | string \| undefined   | The name of the item being rated.                     |
| isOpen          | boolean               | Indicates if the dialog is currently open.            |
| post            | YpPostData \| undefined | The post data associated with the ratings.            |
| refreshFunction | Function \| undefined | A function to call when the dialog is closed.         |

## Methods

| Name         | Parameters                  | Return Type | Description                                                                 |
|--------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| getRating    | index: number               | number \| null | Retrieves the rating value for a given index.                               |
| _close       |                             | void        | Closes the dialog and calls the refresh function if it exists.              |
| _addRating   | event: CustomEvent          | void        | Adds a rating based on the event details and updates the server.            |
| _deleteRating| event: CustomEvent          | void        | Deletes a rating based on the event details and updates the server.         |
| open         | post: YpPostData, refreshFunction: Function | Promise<void> | Prepares and opens the dialog with the given post and refresh function. |

## Events

- **yp-rating-add**: Emitted when a new rating is added.
- **yp-rating-delete**: Emitted when a rating is deleted.

## Examples

```typescript
// Example usage of the YpDialogRatings component
const dialogRatings = document.createElement('yp-dialog-ratings');
dialogRatings.post = somePostData; // YpPostData object
dialogRatings.refreshFunction = someRefreshFunction; // Function to refresh data
document.body.appendChild(dialogRatings);

// To open the dialog
dialogRatings.open(somePostData, someRefreshFunction);
```

Please note that the `YpPostData` and `YpRatingData` types are assumed to be defined elsewhere in the codebase and are not detailed in this documentation. Additionally, the `window.appUser` and `window.serverApi` objects are used for user and server interactions, respectively, and should be defined in the global scope.