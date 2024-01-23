# YpPostCardAdd

`YpPostCardAdd` is a custom web component that extends `YpBaseElement` to provide a user interface for adding new posts. It displays a card that users can interact with to create a new post. The card can be disabled to prevent new posts from being added.

## Properties

| Name            | Type              | Description                                                                 |
|-----------------|-------------------|-----------------------------------------------------------------------------|
| disableNewPosts | Boolean           | If true, disables the ability to add new posts.                             |
| group           | YpGroupData       | The group data object containing configuration for the new post card.       |
| index           | number            | An optional index value that may be used for tracking the card's position.  |

## Methods

| Name       | Parameters            | Return Type | Description                                                                 |
|------------|-----------------------|-------------|-----------------------------------------------------------------------------|
| _keyDown   | event: KeyboardEvent  | void        | Handles keydown events, specifically to create a new post when Enter is pressed. |
| _newPost   | none                  | void        | Emits a 'new-post' event to signal the creation of a new post, unless disabled. |

## Events

- **new-post**: Emitted when the user interacts with the card to create a new post, provided that `disableNewPosts` is false.

## Examples

```typescript
// Example usage of the YpPostCardAdd component
<yp-post-card-add .group="{...}" .disableNewPosts="{...}" .index="{...}"></yp-post-card-add>
```

Note: Replace `{...}` with actual property values.