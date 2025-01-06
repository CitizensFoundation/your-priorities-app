# YpEmojiDialog

`YpEmojiDialog` is a custom web component that provides an emoji picker dialog. It allows users to select emojis and insert them into a specified input field.

## Properties

| Name        | Type                          | Description                                      |
|-------------|-------------------------------|--------------------------------------------------|
| inputTarget | HTMLInputElement \| undefined | The input element where the selected emoji will be inserted. |

## Methods

| Name         | Parameters                                      | Return Type | Description                                                                 |
|--------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| closeDialog  | None                                            | void        | Closes the emoji dialog and emits a "dialog-closed" event.                  |
| open         | trigger: HTMLElement, inputTarget: HTMLInputElement | void        | Opens the emoji dialog and sets the target input element for emoji insertion. |
| emojiClick   | e: CustomEvent                                  | void        | Handles the emoji selection event, inserts the emoji into the input target, and closes the dialog. |

## Examples

```typescript
// Example usage of the YpEmojiDialog component
const emojiDialog = document.createElement('yp-emoji-dialog') as YpEmojiDialog;
document.body.appendChild(emojiDialog);

const inputElement = document.querySelector('input#emojiInput') as HTMLInputElement;
const triggerElement = document.querySelector('button#openEmojiDialog') as HTMLElement;

triggerElement.addEventListener('click', () => {
  emojiDialog.open(triggerElement, inputElement);
});
```

This example demonstrates how to create an instance of `YpEmojiDialog`, append it to the document, and open the dialog when a button is clicked, targeting a specific input element for emoji insertion.