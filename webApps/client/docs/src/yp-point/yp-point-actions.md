# YpPointActions

A custom element that provides actions related to a point, such as voting if a point is helpful or not, and sharing the point.

## Properties

| Name               | Type                     | Description                                                                 |
|--------------------|--------------------------|-----------------------------------------------------------------------------|
| point              | YpPointData \| undefined | The point data associated with the actions.                                 |
| hideNotHelpful     | boolean                  | If true, hides the not helpful action.                                      |
| isUpVoted          | boolean                  | Indicates whether the point has been upvoted by the user.                   |
| allDisabled        | boolean                  | If true, all actions are disabled.                                          |
| hideSharing        | boolean                  | If true, hides the sharing action.                                          |
| configuration      | YpGroupConfiguration \| undefined | Configuration for the group, may affect visibility of sharing.         |
| pointQualityValue  | number \| undefined      | The current quality value of the point.                                     |
| pointUrl           | string \| undefined      | The URL to the point, used for sharing.                                     |

## Methods

| Name                            | Parameters        | Return Type | Description                                                                 |
|---------------------------------|-------------------|-------------|-----------------------------------------------------------------------------|
| masterHideSharing               | -                 | boolean     | Determines if sharing should be hidden based on `hideSharing` and configuration. |
| _sharedContent                  | event: CustomEvent| void        | Handles the shared content event by logging the activity.                    |
| _shareTap                       | event: CustomEvent| void        | Handles the share tap event by opening the share dialog and logging the activity. |
| _onPointChanged                 | -                 | void        | Called when the point property changes. Updates qualities accordingly.       |
| _updateQualitiesFromSignal      | -                 | void        | Updates the qualities of the point from a signal.                            |
| _updateQualities                | -                 | void        | Updates the qualities of the point based on the user's point qualities.      |
| _qualityChanged                 | -                 | void        | Called when the quality of the point changes.                                |
| _resetClasses                   | -                 | void        | Resets the classes for the upvote and downvote actions based on the point quality value. |
| _setPointQuality                | value: number \| undefined | void | Sets the point quality value and resets classes accordingly.               |
| generatePointQuality            | value: number     | Promise<void> | Generates a point quality based on the given value.                         |
| _pointQualityResponse           | pointQualityResponse: YpPointQualityResponse | void | Handles the response after setting point quality.                          |
| generatePointQualityFromLogin   | value: number     | void        | Generates point quality from login if there's no existing quality for the point. |
| pointHelpful                    | -                 | void        | Marks the point as helpful, disables all actions, and logs the activity.    |
| pointNotHelpful                 | -                 | void        | Marks the point as not helpful, disables all actions, and logs the activity. |

## Events (if any)

- **yp-got-endorsements-and-qualities**: Emitted when endorsements and qualities are received, triggering an update in point qualities.

## Examples

```typescript
// Example usage of the YpPointActions web component
<yp-point-actions
  .point="${this.pointData}"
  .hideNotHelpful="${false}"
  .isUpVoted="${true}"
  .allDisabled="${false}"
  .hideSharing="${false}"
  .configuration="${this.groupConfiguration}"
  .pointQualityValue="${1}"
  .pointUrl="${'https://example.com/point/123'}">
</yp-point-actions>
```