# YpPostCardAdd

`YpPostCardAdd` is a custom web component that extends `YpBaseElement`. It provides a user interface for adding new posts, with customizable text and styles. The component can be configured to disable new post creation and display alternative text when closed.

## Properties

| Name            | Type                  | Description                                                                 |
|-----------------|-----------------------|-----------------------------------------------------------------------------|
| disableNewPosts | Boolean               | Determines if new posts can be added. Defaults to `false`.                  |
| group           | YpGroupData \| undefined | The group data object containing configuration and language settings.       |
| index           | number \| undefined   | The index of the post card within a list or collection.                     |

## Methods

| Name                          | Parameters          | Return Type | Description                                                                 |
|-------------------------------|---------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback             | None                | void        | Lifecycle method called when the element is added to the document.          |
| render                        | None                | TemplateResult | Renders the component's template.                                           |
| _renderHiddenMagicTexts       | None                | TemplateResult | Renders hidden magic text components for translation purposes.              |
| _handleAddNewTextTranslation  | e: CustomEvent      | void        | Handles translation updates for the "add new" text.                         |
| _handleClosedTextTranslation  | e: CustomEvent      | void        | Handles translation updates for the "closed" text.                          |
| _keyDown                      | event: KeyboardEvent| void        | Handles keyboard events for triggering new post creation.                   |
| _newPost                      | None                | void        | Fires a 'new-post' event if new posts are not disabled.                     |
| _getAddNewText                | None                | string      | Retrieves the text for the "add new" button, considering translations.      |
| _getClosedText                | None                | string      | Retrieves the text for the "closed" state, considering translations.        |

## Events

- **new-post**: Emitted when a new post is initiated by the user, provided that new posts are not disabled.

## Examples

```typescript
// Example usage of the YpPostCardAdd component
import './yp-post-card-add.js';

const postCardAdd = document.createElement('yp-post-card-add');
postCardAdd.group = {
  id: 'group1',
  configuration: {
    alternativeTextForNewIdeaButton: 'Add your idea',
    alternativeTextForNewIdeaButtonClosed: 'Closed for new ideas',
    hideNewPost: false
  },
  language: 'en'
};
postCardAdd.disableNewPosts = false;
document.body.appendChild(postCardAdd);
```