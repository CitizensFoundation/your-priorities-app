# YpPostActions

The `YpPostActions` class is a custom web component that provides interactive post action buttons, such as upvote, downvote, and debate options. It extends the `YpBaseElement` and utilizes various helper classes and components to manage post interactions.

## Properties

| Name                    | Type      | Description                                                                 |
|-------------------------|-----------|-----------------------------------------------------------------------------|
| post                    | YpPostData | The post data object associated with the actions.                           |
| endorsementButtons      | string    | The type of endorsement buttons to display (e.g., "hearts", "thumbs").      |
| headerMode              | boolean   | Indicates if the component is in header mode, affecting navigation behavior.|
| forceSmall              | boolean   | Forces the component to use a smaller layout.                               |
| endorseValue            | number    | The current endorsement value for the post.                                 |
| allDisabled             | boolean   | Disables all interactive elements if true.                                  |
| disabledTitle           | string \| undefined | The title to display when actions are disabled.                  |
| floating                | boolean   | Determines if the action bar should float.                                  |
| votingDisabled          | boolean   | Disables voting actions if true.                                            |
| smallerIcons            | boolean   | Uses smaller icons for the action buttons if true.                          |
| maxNumberOfGroupVotes   | number \| undefined | The maximum number of votes allowed for the group.                  |
| numberOfGroupVotes      | number \| undefined | The current number of votes used by the group.                      |
| forceShowDebate         | boolean   | Forces the debate option to be shown.                                       |
| onlyShowDebate          | boolean   | Only shows the debate option if true.                                       |
| forceHideDebate         | boolean   | Forces the debate option to be hidden.                                      |
| hideVoteCount           | boolean   | Hides the vote count display if true.                                       |

## Methods

| Name                          | Parameters                                      | Return Type | Description                                                                 |
|-------------------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback             | -                                               | void        | Lifecycle method called when the element is added to the document.          |
| disconnectedCallback          | -                                               | void        | Lifecycle method called when the element is removed from the document.      |
| firstUpdated                  | changedProperties: Map<string \| number \| symbol, unknown> | void        | Called after the element's DOM has been updated the first time.             |
| renderDebate                  | -                                               | TemplateResult | Renders the debate section of the component.                                |
| render                        | -                                               | TemplateResult | Renders the component's template.                                           |
| isEndorsed                    | -                                               | boolean     | Returns true if the post is endorsed.                                       |
| isOpposed                     | -                                               | boolean     | Returns true if the post is opposed.                                        |
| votingStateDisabled           | -                                               | boolean     | Returns true if voting is disabled based on current state.                  |
| onlyUpVoteShowing             | -                                               | boolean     | Returns true if only the upvote button should be shown.                     |
| endorseModeIconUp             | -                                               | string      | Returns the icon for the upvote button based on the endorsement mode.       |
| endorseModeIconDown           | -                                               | string      | Returns the icon for the downvote button based on the endorsement mode.     |
| customVoteUpHoverText         | -                                               | string      | Returns the custom hover text for the upvote button.                        |
| customVoteDownHoverText       | -                                               | string      | Returns the custom hover text for the downvote button.                      |
| _goToPostIfNotHeader          | -                                               | void        | Navigates to the post if not in header mode.                                |
| hideDebate                    | -                                               | boolean     | Returns true if the debate option should be hidden.                         |
| updated                       | changedProperties: Map<string \| number \| symbol, unknown> | Promise<void> | Called after the element's DOM has been updated.                            |
| _updateEndorsementsFromSignal | event: CustomEvent                              | void        | Updates endorsements based on a received signal.                            |
| _updateEndorsements           | event?: CustomEvent                             | void        | Updates endorsements for the post.                                          |
| endorseModeIcon               | endorsementButtons: string, upDown: string      | string \| undefined | Returns the icon for the endorsement button based on mode and direction. |
| _setEndorsement               | value: number                                   | Promise<void> | Sets the endorsement value and updates the UI accordingly.                  |
| _enableVoting                 | -                                               | void        | Enables voting actions if they are not disabled.                            |
| generateEndorsementFromLogin  | value: number                                   | void        | Generates an endorsement if the user is logged in.                          |
| generateEndorsement           | value: number                                   | Promise<void> | Generates an endorsement for the post.                                      |
| upVote                        | -                                               | void        | Handles the upvote action.                                                  |
| downVote                      | -                                               | void        | Handles the downvote action.                                                |
| _setVoteHidingStatus          | -                                               | void        | Sets the status for hiding the vote count.                                  |

## Examples

```typescript
// Example usage of the YpPostActions component
import './path/to/yp-post-actions.js';

const postActions = document.createElement('yp-post-actions');
postActions.post = { /* YpPostData object */ };
document.body.appendChild(postActions);
```