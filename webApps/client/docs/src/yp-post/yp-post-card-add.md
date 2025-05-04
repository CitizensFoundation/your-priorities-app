# YpPostCardAdd

A web component for displaying an "Add New Post" card, typically used in group or forum interfaces. It provides a Material Design FAB (Floating Action Button) for creating new posts, with support for custom button text, localization, and group-based configuration. The component also handles disabled states and alternative text for closed groups.

## Properties

| Name             | Type                        | Description                                                                                  |
|------------------|-----------------------------|----------------------------------------------------------------------------------------------|
| disableNewPosts  | boolean                     | If true, disables the ability to add new posts (button is disabled and shows closed text).   |
| group            | YpGroupData \| undefined    | The group context for the post card, used for configuration and localization.                |
| index            | number \| undefined         | Optional index, used for identifying the card in a list or for translation purposes.         |

## Methods

| Name                           | Parameters                                   | Return Type | Description                                                                                      |
|--------------------------------|----------------------------------------------|-------------|--------------------------------------------------------------------------------------------------|
| connectedCallback              | none                                         | void        | Lifecycle method called when the element is added to the DOM. Initializes button and closed text. |
| render                         | none                                         | unknown     | Renders the component's template, including the FAB and hidden translation elements.              |
| _renderHiddenMagicTexts        | none                                         | unknown     | Renders hidden `<yp-magic-text>` elements for translation support.                               |
| _handleAddNewTextTranslation   | e: CustomEvent                               | void        | Handles new translation event for the "add new" button text.                                      |
| _handleClosedTextTranslation   | e: CustomEvent                               | void        | Handles new translation event for the "closed" button text.                                       |
| _keyDown                       | event: KeyboardEvent                         | void        | Handles keyboard events (Enter or Space) to trigger new post creation.                            |
| _newPost                       | none                                         | void        | Fires the 'new-post' event if new posts are not disabled.                                         |
| _getAddNewText                 | none                                         | string      | Returns the default or configured text for the "add new" button.                                  |
| _getClosedText                 | none                                         | string      | Returns the default or configured text for the "closed" state.                                    |

## Events

- **new-post**: Fired when the user clicks the FAB or presses Enter/Space while focused, and new posts are not disabled.

## Examples

```typescript
import './yp-post-card-add.js';

html`
  <yp-post-card-add
    .group="${myGroupData}"
    .index="${0}"
    ?disableNewPosts="${false}"
  ></yp-post-card-add>
`;
```

---

**Note:**  
- The component uses Material Web Components (`md-fab`, `md-icon`) and a custom `<yp-magic-text>` for translation/localization.
- The `group` property should be an object with a `configuration` property that may contain `alternativeTextForNewIdeaButton` and `alternativeTextForNewIdeaButtonClosed`.
- The component extends `YpBaseElement` and uses styles from `ShadowStyles`.
- The `new-post` event should be handled by the parent component to open a post creation dialog or similar UI.