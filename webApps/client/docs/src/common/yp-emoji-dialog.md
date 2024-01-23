# YpEmojiDialog

The `YpEmojiDialog` class is a custom web component that extends `YpBaseElement` to provide an emoji picker dialog. It uses the `picmo` library to create a popup emoji picker and the `@picmo/renderer-twemoji` for rendering emojis. The dialog can be attached to an input element to allow users to insert emojis into the text.

## Properties

| Name        | Type                        | Description                                      |
|-------------|-----------------------------|--------------------------------------------------|
| inputTarget | HTMLInputElement \| undefined | The input element target where emojis are inserted. |
| picker      | PopupPickerController \| undefined | The controller for the popup emoji picker.       |
| trigger     | HTMLElement \| undefined    | The element that triggers the opening of the emoji picker. |

## Methods

| Name                   | Parameters                  | Return Type | Description                                      |
|------------------------|-----------------------------|-------------|--------------------------------------------------|
| connectedCallback      | -                           | void        | Lifecycle method called when the component is added to the DOM. |
| disconnectedCallback   | -                           | void        | Lifecycle method called when the component is removed from the DOM. |
| createPicker           | -                           | void        | Initializes and opens the emoji picker popup.    |
| removePicker           | -                           | void        | Removes the emoji picker and cleans up resources. |
| pickEmoji              | selection: EmojiSelection   | void        | Handles the selection of an emoji and inserts it into the input target. |
| open                   | trigger: HTMLElement, inputTarget: HTMLInputElement | void | Opens the emoji picker with the specified trigger and input target. |
| i18nStrings            | -                           | Object      | Returns an object containing internationalization strings for the emoji picker. |

## Events (if any)

- **emoji:select**: Emitted when an emoji is selected from the picker.

## Examples

```typescript
// Example usage of the YpEmojiDialog component
const emojiDialog = document.createElement('yp-emoji-dialog');
const inputElement = document.querySelector('input');
const triggerElement = document.querySelector('button');

// Open the emoji picker dialog
emojiDialog.open(triggerElement, inputElement);

// Listen for emoji selection
emojiDialog.addEventListener('emoji:select', (event) => {
  console.log('Emoji selected:', event.detail);
});
```

Note: The `insertTextAtCursor` function is commented out and marked as TODO, indicating that the functionality to insert text at the cursor's current position is not yet implemented. The `pickEmoji` method currently appends the selected emoji to the end of the input's value.