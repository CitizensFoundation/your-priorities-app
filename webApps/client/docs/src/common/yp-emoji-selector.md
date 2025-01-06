# YpEmojiSelector

The `YpEmojiSelector` is a web component that provides an emoji selection interface. It extends the `YpBaseElement` and allows users to open an emoji dialog to select emojis and insert them into a specified input target.

## Properties

| Name        | Type                        | Description                                                                 |
|-------------|-----------------------------|-----------------------------------------------------------------------------|
| inputTarget | HTMLInputElement \| undefined | The input element where the selected emoji will be inserted.                |
| open        | boolean                     | A boolean indicating whether the emoji dialog is open or closed. Defaults to `false`. |

## Methods

| Name         | Parameters | Return Type | Description                                                                 |
|--------------|------------|-------------|-----------------------------------------------------------------------------|
| togglePicker | None       | Promise<void> | Toggles the emoji picker dialog. Opens the dialog and sets the `open` property to `true`. |

## Examples

```typescript
// Example usage of the YpEmojiSelector component
import { html, LitElement } from 'lit';
import './yp-emoji-selector.js';

class MyComponent extends LitElement {
  render() {
    return html`
      <input id="myInput" type="text" />
      <yp-emoji-selector .inputTarget="${this.shadowRoot?.getElementById('myInput')}"></yp-emoji-selector>
    `;
  }
}

customElements.define('my-component', MyComponent);
```

In this example, the `YpEmojiSelector` is used alongside an input element. When the emoji button is clicked, the emoji dialog opens, allowing the user to select an emoji to be inserted into the input field.