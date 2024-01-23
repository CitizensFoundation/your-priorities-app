# YpPostCard

`YpPostCard` is a custom web component that represents a card layout for displaying a post. It includes a cover media section, post title, description, tags, and actions such as sharing and rating. The card can be displayed in a mini version and can be configured to hide certain elements based on group configuration.

## Properties

| Name              | Type                  | Description                                                                 |
|-------------------|-----------------------|-----------------------------------------------------------------------------|
| selectedMenuItem  | string \| undefined   | The currently selected menu item.                                           |
| mini              | boolean               | Determines if the card should be displayed in a mini version.               |
| isAudioCover      | boolean               | Indicates if the cover media is of type audio.                              |
| post              | YpPostData            | The post data to be displayed on the card.                                  |

## Methods

| Name                        | Parameters | Return Type | Description                                                                                   |
|-----------------------------|------------|-------------|-----------------------------------------------------------------------------------------------|
| renderDescription           |            | TemplateResult \| nothing | Renders the post description or structured answers.                                           |
| renderTags                  |            | TemplateResult \| nothing | Renders the post tags.                                                                        |
| render                      |            | TemplateResult \| nothing | Renders the complete post card with all its elements.                                         |
| _sharedContent              | event: CustomEvent | void        | Handles the shared content event.                                                             |
| _fullPostUrl                |            | string       | Composes the full URL to the post.                                                            |
| structuredAnswersFormatted  |            | string       | Formats the structured answers into a string.                                                 |
| _onBottomClick              | event: CustomEvent | void        | Prevents propagation of click events on the bottom area of the card.                          |
| clickOnA                    |            | void        | Simulates a click on the main area link.                                                      |
| _getPostLink                | post: YpPostData | string       | Generates the link to the post based on the post data and group configuration.                |
| _shareTap                   | event: CustomEvent | void        | Handles the share tap event.                                                                  |
| hideDescription             |            | boolean      | Determines if the post description should be hidden based on the mini state and group config. |
| goToPostIfNotHeader         | event: CustomEvent | void        | Navigates to the post if not in header mode.                                                  |
| updated                     | changedProperties: Map<string \| number \| symbol, unknown> | void        | Lifecycle method called when properties have changed.                                         |
| updateDescriptionIfEmpty    | description: string | void        | Updates the post description if it is empty.                                                  |
| _refresh                    |            | void        | Refreshes the component.                                                                      |
| _openReport                 |            | void        | Opens the report dialog for the post.                                                         |
| _onReport                   |            | void        | Handles the report action.                                                                    |

## Events

- **refresh**: Emitted when the component requests a refresh.
- **open**: Emitted when the report dialog is opened.

## Examples

```typescript
// Example usage of the YpPostCard component
<yp-post-card .post="${post}" mini="${false}"></yp-post-card>
```

Please note that the above example assumes that `post` is a variable containing valid `YpPostData` and is used within a LitElement template context.