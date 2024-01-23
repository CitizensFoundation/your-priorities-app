# YpRating

`YpRating` is a custom web component that extends `YpBaseElement` to provide a rating system using emojis. Users can rate by clicking on the emoji icons, which can be configured to be read-only or interactive. The component supports a maximum of 5 ratings and emits custom events when a rating is added or deleted.

## Properties

| Name            | Type             | Description                                           |
|-----------------|------------------|-------------------------------------------------------|
| emoji           | string \| undefined | The emoji character used for displaying the ratings.  |
| votingDisabled  | boolean          | If true, disables the ability to vote.                |
| readOnly        | boolean          | If true, the component is in read-only mode.          |
| postId          | number \| undefined | The ID of the post associated with the ratings.       |
| ratingIndex     | number \| undefined | The index of the rating within the post.              |
| numberOf        | number \| undefined | The total number of ratings to display.               |
| rate            | number           | The current rate selected by the user.                |
| currentRatings  | Array<number> \| undefined | An array representing the current ratings.         |

## Methods

| Name        | Parameters            | Return Type | Description                                         |
|-------------|-----------------------|-------------|-----------------------------------------------------|
| isActive    | index: number, rate: number | string      | Returns a class name if the index is active based on the rate. |
| _postIdChanged | none                  | void        | Resets the ratings when the postId property changes. |
| _resetRatings | none                  | void        | Resets the ratings to their default state.          |
| _setRate    | e: CustomEvent        | void        | Sets the rate based on the user's selection.        |

## Events

- **yp-rating-add**: Emitted when a new rating is added. The event detail includes `postId`, `ratingIndex`, and `rate`.
- **yp-rating-delete**: Emitted when an existing rating is deleted. The event detail includes `postId` and `ratingIndex`.

## Examples

```typescript
// Example usage of the YpRating component
<yp-ratings
  emoji="🌟"
  .postId=${123}
  .ratingIndex=${1}
  .numberOf=${5}
  .rate=${3}
  .votingDisabled=${false}
  .readOnly=${false}
></yp-ratings>
```

Note: The above example assumes you have the necessary setup to use web components in your application.