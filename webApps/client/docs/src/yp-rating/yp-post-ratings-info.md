# YpPostRatingsInfo

The `YpPostRatingsInfo` class is a web component that extends `YpBaseElement` and is responsible for displaying rating information related to a post. It allows users to view custom ratings and interact with them if voting is enabled.

## Properties

| Name            | Type                             | Description                                                                 |
|-----------------|----------------------------------|-----------------------------------------------------------------------------|
| post            | YpPostData \| undefined          | The post data object containing information about the post and its ratings.  |
| hasWidthA       | boolean                          | Flag to indicate if a specific width style should be applied.                |
| hasWidthB       | boolean                          | Flag to indicate if a different width style should be applied.               |
| hasWidthC       | boolean                          | Flag to indicate if another width style should be applied.                   |
| hasWidthD       | boolean                          | Flag to indicate if yet another width style should be applied.               |
| active          | boolean                          | Flag to indicate if the component is active.                                 |
| allDisabled     | boolean                          | Flag to indicate if all interactions are disabled.                           |
| votingDisabled  | boolean                          | Flag to indicate if voting is disabled.                                      |
| isEndorsed      | boolean                          | Flag to indicate if the post is endorsed.                                    |
| cardMode        | boolean                          | Flag to indicate if the component is in card mode.                           |
| customRatings   | Array<YpCustomRatingsData> \| undefined | Array of custom ratings data objects.                                       |

## Methods

| Name               | Parameters | Return Type | Description                                                                 |
|--------------------|------------|-------------|-----------------------------------------------------------------------------|
| updated            | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called when properties have changed.                       |
| render             |            | TemplateResult \| typeof nothing | Renders the component's HTML template.                                      |
| getRating          | ratingIndex: number | number       | Retrieves the average rating for a given rating index.                      |
| getRatingsCount    | ratingIndex: number | number \| string | Retrieves the count of ratings for a given rating index.                    |
| _fireRefresh       |            | void        | Dispatches a 'refresh' event with the post's id.                            |
| openRatingsDialog  |            | void        | Opens the ratings dialog for the post if voting is enabled and user is logged in. |
| _onPostChanged     |            | void        | Handles changes to the `post` property and updates the component state.     |

## Events (if any)

- **refresh**: Emitted when the ratings information needs to be refreshed, typically after a user interaction.

## Examples

```typescript
// Example usage of the YpPostRatingsInfo component
<yp-post-ratings-info .post=${somePostData}></yp-post-ratings-info>
```

Please note that the actual usage of the component would depend on the context within the application and the data provided to it.