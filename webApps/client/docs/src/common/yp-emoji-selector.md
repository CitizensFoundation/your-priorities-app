# YpEmojiSelector

The `YpEmojiSelector` class is a web component that extends `YpBaseElement` to provide an emoji picker functionality. It is designed to be used in conjunction with an input element, allowing users to select and insert emojis into the input field.

## Properties

| Name        | Type                     | Description                                      |
|-------------|--------------------------|--------------------------------------------------|
| inputTarget | HTMLInputElement\|undefined | The input element that the emoji selector targets. |

## Methods

| Name         | Parameters | Return Type | Description                                      |
|--------------|------------|-------------|--------------------------------------------------|
| render       |            | TemplateResult | Generates the template for the emoji selector button. |
| togglePicker |            | void        | Toggles the visibility of the emoji picker dialog. |

## Events

- **None**: This class does not emit any custom events.

## Examples

```typescript
// Example usage of the YpEmojiSelector web component
<yp-emoji-selector></yp-emoji-selector>
```

Note: The `YpEmojiSelector` class uses a method `window.appDialogs.getDialogAsync` which is not defined in the provided code snippet. It is assumed to be part of the application's global scope for dialog management.