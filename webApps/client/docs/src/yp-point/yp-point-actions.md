# YpPointActions

A web component for displaying and managing "helpful" and "not helpful" actions (voting) on a point, including upvote/downvote buttons, counters, and sharing options. Integrates with user authentication, server API, and global app events.

## Properties

| Name               | Type                              | Description                                                                                 |
|--------------------|-----------------------------------|---------------------------------------------------------------------------------------------|
| point              | YpPointData \| undefined          | The point data object for which actions are displayed.                                      |
| hideNotHelpful     | boolean                           | If true, hides the "not helpful" (downvote) action.                                         |
| isUpVoted          | boolean                           | Indicates if the current user has upvoted this point.                                       |
| isDownVoted        | boolean                           | Indicates if the current user has downvoted this point.                                     |
| allDisabled        | boolean                           | If true, disables all action buttons.                                                       |
| hideSharing        | boolean                           | If true, hides sharing options.                                                             |
| configuration      | YpGroupConfiguration \| undefined | Optional configuration object, e.g., to control sharing visibility.                         |
| pointQualityValue  | number \| undefined               | The current user's quality value for this point (1 for upvote, -1 for downvote, undefined). |
| pointUrl           | string \| undefined               | The URL of the point, used for sharing.                                                     |

## Methods

| Name                              | Parameters                                                                 | Return Type | Description                                                                                                   |
|----------------------------------- |----------------------------------------------------------------------------|-------------|---------------------------------------------------------------------------------------------------------------|
| render                            | none                                                                       | unknown     | Renders the component's template.                                                                             |
| connectedCallback                 | none                                                                       | void        | Lifecycle method called when the element is added to the DOM. Sets up event listeners.                        |
| disconnectedCallback              | none                                                                       | void        | Lifecycle method called when the element is removed from the DOM. Cleans up event listeners.                  |
| firstUpdated                      | _changedProperties: PropertyValues                                         | void        | Lifecycle method called after the first update. Initializes qualities.                                        |
| masterHideSharing                 | none                                                                       | boolean     | Returns true if sharing should be hidden, based on property and configuration.                                |
| _sharedContent                    | event: CustomEvent                                                         | void        | Handles the event when content is shared, logs activity.                                                      |
| _shareTap                         | event: CustomEvent                                                         | void        | Handles the tap on the share button, opens the share dialog.                                                  |
| _onPointChanged                   | none                                                                       | void        | Updates qualities when the point changes.                                                                     |
| _updateQualitiesFromSignal        | none                                                                       | void        | Updates qualities in response to a global signal/event.                                                       |
| _updateQualities                  | none                                                                       | void        | Updates the upvote/downvote state based on the current user's data.                                           |
| _qualityChanged                   | none                                                                       | void        | Placeholder for handling quality change logic.                                                                |
| _resetClasses                     | none                                                                       | void        | Updates CSS classes for upvote/downvote selection.                                                            |
| _setPointQuality                  | value: number \| undefined                                                 | void        | Sets the current point quality value and updates classes.                                                     |
| generatePointQuality              | value: number                                                              | Promise<void>| Sends a request to the server to set or remove the user's quality (vote) for the point.                       |
| _pointQualityResponse             | pointQualityResponse: YpPointQualityResponse                               | void        | Handles the server response after setting point quality, updates counters and state.                          |
| generatePointQualityFromLogin     | value: number                                                              | void        | Generates point quality after login if the user hasn't already voted.                                         |
| pointHelpful                      | none                                                                       | void        | Handles the "helpful" (upvote) action, disables buttons, logs activity, and sends request.                    |
| pointNotHelpful                   | none                                                                       | void        | Handles the "not helpful" (downvote) action, disables buttons, logs activity, and sends request.              |

## Examples

```typescript
import "./yp-point-actions.js";

html`
  <yp-point-actions
    .point="${pointData}"
    .hideNotHelpful="${false}"
    .isUpVoted="${false}"
    .isDownVoted="${false}"
    .allDisabled="${false}"
    .hideSharing="${false}"
    .configuration="${groupConfig}"
    .pointQualityValue="${undefined}"
    .pointUrl="${'https://example.com/point/123'}"
  ></yp-point-actions>
`
```
