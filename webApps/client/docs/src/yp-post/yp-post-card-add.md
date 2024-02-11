# YpPostCardAdd

The `YpPostCardAdd` class is a web component that provides a user interface element for adding new posts. It extends from `YpBaseElement` and includes a button-like card that users can interact with to create a new post. The card can be disabled to prevent new posts from being created.

## Properties

| Name            | Type                | Description                                                                 |
|-----------------|---------------------|-----------------------------------------------------------------------------|
| disableNewPosts | Boolean             | Indicates whether the creation of new posts is disabled.                    |
| group           | YpGroupData\|undefined | An object containing group data, which may affect the display of the card. |
| index           | number\|undefined     | An optional index value that may be used for tracking or identification.    |

## Methods

| Name       | Parameters           | Return Type | Description                                                                                   |
|------------|----------------------|-------------|-----------------------------------------------------------------------------------------------|
| _keyDown   | event: KeyboardEvent | void        | Handles keydown events, specifically to create a new post when the Enter key is pressed.      |
| _newPost   | -                    | void        | Emits a 'new-post' event to signal the creation of a new post, unless new posts are disabled. |

## Events

- **new-post**: Emitted when the user interacts with the component to create a new post, provided that the `disableNewPosts` property is not set to `true`.

## Examples

```typescript
// Example usage of the YpPostCardAdd web component
<yp-post-card-add
  .disableNewPosts="${this.disableNewPosts}"
  .group="${this.group}"
  .index="${this.index}"
></yp-post-card-add>
```

When using this component in a web page, you can listen for the `new-post` event to handle the creation of a new post. The `disableNewPosts` property can be used to control whether the user is allowed to create new posts. The `group` property provides context that may change how the component is displayed or behaves. The `index` property can be used for additional identification or ordering if needed.