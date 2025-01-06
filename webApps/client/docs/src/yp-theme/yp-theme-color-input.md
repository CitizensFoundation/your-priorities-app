# YpThemeColorInput

A custom web component for inputting and selecting theme colors, extending `YpBaseElement`.

## Properties

| Name             | Type      | Description                                                                 |
|------------------|-----------|-----------------------------------------------------------------------------|
| color            | string \| undefined | The current color value in hexadecimal format.                          |
| label            | string    | The label for the text field input.                                         |
| disableSelection | boolean \| undefined | Determines if the color selection is disabled. Defaults to `false`.       |

## Methods

| Name                | Parameters                  | Return Type | Description                                                                 |
|---------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| isValidHex          | color: string \| undefined  | boolean     | Checks if the provided color string is a valid hexadecimal color code.      |
| handleColorInput    | event: CustomEvent          | void        | Handles input events to validate and update the color value.                |
| _onPaste            | event: ClipboardEvent       | void        | Placeholder for handling paste events.                                      |
| openPalette         |                             | void        | Opens the color picker palette.                                             |
| handleOutsideClick  | event: MouseEvent           | void        | Handles clicks outside the color picker to close it if active.              |
| closePalette        |                             | void        | Closes the color picker palette.                                            |
| disconnectedCallback|                             | void        | Cleans up event listeners when the component is disconnected.               |
| handleKeyDown       | event: KeyboardEvent        | void        | Handles keydown events to allow only valid hexadecimal input.               |
| handleColorChanged  | event: CustomEvent          | void        | Updates the color value when the color picker value changes.                |
| clearColor          |                             | void        | Clears the current color value.                                             |

## Examples

```typescript
// Example usage of the YpThemeColorInput component
import './path/to/yp-theme-color-input.js';

const colorInput = document.createElement('yp-theme-color-input');
colorInput.label = 'Theme Color';
colorInput.color = '#FF5733';
colorInput.disableSelection = false;

document.body.appendChild(colorInput);

colorInput.addEventListener('input', (event) => {
  console.log('Color changed:', event.detail.color);
});
```

This component provides a user interface for selecting and inputting colors in hexadecimal format, with validation and event handling for user interactions.