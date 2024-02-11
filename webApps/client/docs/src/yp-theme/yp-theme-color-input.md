# YpThemeColorInput

`YpThemeColorInput` is a custom web component that extends `YpBaseElement` to provide a color input field with a label, an optional clear button, and a color picker palette. It allows users to input hexadecimal color values.

## Properties

| Name             | Type                 | Description                                                                 |
|------------------|----------------------|-----------------------------------------------------------------------------|
| color            | string \| undefined  | The currently selected color in hexadecimal format.                         |
| label            | string               | The label for the color input field.                                        |
| disableSelection | boolean \| undefined | A flag to indicate whether the color selection should be disabled or not.   |

## Methods

| Name                  | Parameters                  | Return Type | Description                                                                                   |
|-----------------------|-----------------------------|-------------|-----------------------------------------------------------------------------------------------|
| isValidHex            | color: string \| undefined  | boolean     | Checks if the provided string is a valid hexadecimal color value.                             |
| handleColorInput      | event: CustomEvent          | void        | Handles input events on the color input field and validates the color.                        |
| _onPaste              | event: ClipboardEvent       | void        | Handles paste events on the color input field and sanitizes the pasted text.                  |
| openPalette           |                             | void        | Opens the color picker palette.                                                              |
| handleOutsideClick    | event: MouseEvent           | void        | Handles clicks outside the color picker palette to close it.                                  |
| closePalette          |                             | void        | Closes the color picker palette.                                                             |
| disconnectedCallback  |                             | void        | Cleans up event listeners when the component is removed from the DOM.                         |
| handleKeyDown         | event: KeyboardEvent        | void        | Handles keydown events to restrict input to valid hexadecimal characters.                     |
| handleColorChanged    | event: CustomEvent          | void        | Updates the color property when a new color is selected from the color picker.                |
| clearColor            |                             | void        | Clears the currently selected color.                                                         |
| render                |                             | TemplateResult | Returns the template for the component with the color input field and color picker. |

## Events

- **input**: Emitted when the color value is changed by the user.

## Examples

```typescript
// Example usage of the YpThemeColorInput component
<yp-theme-color-input label="Primary Color" .color="${this.primaryColor}"></yp-theme-color-input>
```

Please note that the actual usage may vary depending on the context within which the component is used, and the example assumes that `this.primaryColor` is a property containing a valid hexadecimal color value.