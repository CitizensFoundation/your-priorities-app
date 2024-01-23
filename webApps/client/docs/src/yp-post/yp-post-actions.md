# YpPostActions

This class represents a custom web component that provides action buttons for a post, such as voting up or down, and displaying the number of endorsements and debate points. It extends `YpBaseElement` and includes properties for configuring the appearance and behavior of the action buttons.

## Properties

| Name                        | Type                  | Description                                                                 |
|-----------------------------|-----------------------|-----------------------------------------------------------------------------|
| post                        | YpPostData            | The post data associated with the action buttons.                           |
| endorsementButtons          | string                | The style of endorsement buttons to use (e.g., "hearts", "thumbs").         |
| headerMode                  | boolean               | Indicates if the component is in header mode.                               |
| forceSmall                  | boolean               | Forces the use of small icons.                                              |
| endorseValue                | number                | The current endorsement value for the post.                                 |
| allDisabled                 | boolean               | Disables all action buttons.                                                |
| disabledTitle               | string \| undefined   | The title to display when the action buttons are disabled.                  |
| floating                    | boolean               | Indicates if the action bar is floating.                                    |
| votingDisabled              | boolean               | Indicates if voting is disabled.                                            |
| smallerIcons                | boolean               | Indicates if smaller icons should be used.                                  |
| maxNumberOfGroupVotes       | number \| undefined   | The maximum number of votes a user can cast in a group.                     |
| numberOfGroupVotes          | number \| undefined   | The current number of votes a user has cast in a group.                     |
| forceShowDebate             | boolean               | Forces the debate icon to be shown regardless of other settings.            |

## Methods

| Name                        | Parameters            | Return Type | Description                                                                 |
|-----------------------------|-----------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback           | -                     | void        | Lifecycle method that runs when the component is added to the DOM.          |
| disconnectedCallback        | -                     | void        | Lifecycle method that runs when the component is removed from the DOM.      |
| firstUpdated                | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method that runs after the component's first render. |
| render                      | -                     | TemplateResult | Renders the component's HTML template.                                    |
| isEndorsed                  | -                     | boolean     | Returns true if the post is endorsed.                                       |
| votingStateDisabled         | -                     | boolean     | Returns true if the voting state is disabled.                               |
| onlyUpVoteShowing           | -                     | boolean     | Returns true if only the upvote button should be shown.                     |
| endorseModeIconUp           | -                     | string \| undefined | Returns the icon for the upvote button based on the endorsementButtons property. |
| endorseModeIconDown         | -                     | string \| undefined | Returns the icon for the downvote button based on the endorsementButtons property. |
| customVoteUpHoverText       | -                     | string      | Returns the hover text for the upvote button.                               |
| customVoteDownHoverText     | -                     | string      | Returns the hover text for the downvote button.                             |
| _goToPostIfNotHeader        | -                     | void        | Navigates to the post if not in header mode.                                |
| hideDebate                  | -                     | boolean     | Returns true if the debate icon should be hidden.                           |
| updated                     | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method that runs when the component's properties change. |
| _updateEndorsementsFromSignal | event: CustomEvent   | void        | Updates the endorsements from a signal event.                               |
| _updateEndorsements         | event: CustomEvent \| undefined | void | Updates the endorsements.                                                  |
| endorseModeIcon             | endorsementButtons: string, upDown: string | string \| undefined | Returns the appropriate icon based on the endorsementButtons and upDown parameters. |
| _setEndorsement             | value: number         | void        | Sets the endorsement value and updates the UI accordingly.                   |
| _enableVoting               | -                     | void        | Enables voting if it is not disabled.                                       |
| generateEndorsementFromLogin | value: number         | void        | Generates an endorsement from login.                                        |
| generateEndorsement         | value: number         | Promise<void> | Generates an endorsement.                                                  |
| upVote                      | -                     | void        | Handles the upvote action.                                                  |
| downVote                    | -                     | void        | Handles the downvote action.                                                |
| _setVoteHidingStatus        | -                     | void        | Sets the vote hiding status based on the group configuration.               |

## Events (if any)

- **yp-got-endorsements-and-qualities**: Emitted when endorsements and qualities are received.

## Examples

```typescript
// Example usage of the YpPostActions component
<yp-post-actions .post=${post} endorsementButtons="hearts"></yp-post-actions>
```

Note: The actual usage of the component would depend on the context within a larger application, and the example provided is a simple illustration of how the component might be used in HTML.