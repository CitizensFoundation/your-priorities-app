# YpPointActions

The `YpPointActions` class is a custom web component that extends `YpBaseElement`. It provides interactive actions for points, such as upvoting, downvoting, and sharing. This component is designed to handle user interactions and update the point's quality based on user feedback.

## Properties

| Name               | Type                          | Description                                                                 |
|--------------------|-------------------------------|-----------------------------------------------------------------------------|
| point              | YpPointData \| undefined      | The data object representing the point.                                     |
| hideNotHelpful     | boolean                       | Determines if the "Not Helpful" action should be hidden.                    |
| isUpVoted          | boolean                       | Indicates if the point has been upvoted by the user.                        |
| isDownVoted        | boolean                       | Indicates if the point has been downvoted by the user.                      |
| allDisabled        | boolean                       | Disables all actions if set to true.                                        |
| hideSharing        | boolean                       | Determines if the sharing option should be hidden.                          |
| configuration      | YpGroupConfiguration \| undefined | Configuration object for the group settings.                                |
| pointQualityValue  | number \| undefined           | The current quality value of the point.                                     |
| pointUrl           | string \| undefined           | The URL associated with the point for sharing purposes.                     |

## Methods

| Name                             | Parameters                      | Return Type | Description                                                                 |
|----------------------------------|---------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback                |                                 | void        | Lifecycle method called when the element is added to the document.          |
| disconnectedCallback             |                                 | void        | Lifecycle method called when the element is removed from the document.      |
| firstUpdated                     | _changedProperties: PropertyValues | void        | Called after the element's DOM has been updated the first time.             |
| masterHideSharing                |                                 | boolean     | Returns true if sharing is hidden either by property or configuration.      |
| _sharedContent                   | event: CustomEvent              | void        | Handles the content sharing event.                                          |
| _shareTap                        | event: CustomEvent              | void        | Handles the tap event for sharing.                                          |
| _onPointChanged                  |                                 | void        | Updates qualities when the point changes.                                   |
| _updateQualitiesFromSignal       |                                 | void        | Updates qualities based on external signals.                                |
| _updateQualities                 |                                 | void        | Updates the upvote and downvote states based on the current user and point. |
| _qualityChanged                  |                                 | void        | Placeholder for handling quality changes.                                   |
| _resetClasses                    |                                 | void        | Resets CSS classes based on the current point quality value.                |
| _setPointQuality                 | value: number \| undefined      | void        | Sets the point quality value and updates the UI accordingly.                |
| generatePointQuality             | value: number                   | Promise<void> | Generates or deletes a point quality based on the current state.            |
| _pointQualityResponse            | pointQualityResponse: YpPointQualityResponse | void | Handles the response from setting a point quality.                          |
| generatePointQualityFromLogin    | value: number                   | void        | Generates point quality after user login if not already set.                |
| pointHelpful                     |                                 | void        | Handles the action for marking a point as helpful.                          |
| pointNotHelpful                  |                                 | void        | Handles the action for marking a point as not helpful.                      |

## Examples

```typescript
// Example usage of the YpPointActions component
import './yp-point-actions.js';

const pointActions = document.createElement('yp-point-actions');
pointActions.point = { id: 1, counter_quality_up: 10, counter_quality_down: 2 };
document.body.appendChild(pointActions);
```