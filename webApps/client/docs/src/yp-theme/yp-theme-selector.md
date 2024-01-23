# YpThemeSelector

A custom element that allows users to select a theme from a predefined list of themes.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| selectedTheme | number \| undefined | The index of the currently selected theme. |
| themeObject   | YpThemeContainerObject \| undefined | An object representing the theme data. |
| themes        | Array<Record<string, boolean \| string \| Record<string, string>>> | An array of theme objects. |

## Methods

| Name                | Parameters                        | Return Type | Description                 |
|---------------------|-----------------------------------|-------------|-----------------------------|
| updated             | changedProperties: Map<string \| number \| symbol, unknown> | void        | Called after the element’s properties have been updated. |
| connectedCallback   | -                                 | void        | Invoked when the custom element is first connected to the document's DOM. |
| _selectTheme        | event: CustomEvent                | void        | Handles the selection of a theme. |
| render              | -                                 | unknown     | Renders the element's HTML template. |
| _objectChanged      | -                                 | void        | Called when the `themeObject` property changes. |
| _selectedThemeChanged | -                               | void        | Called when the `selectedTheme` property changes. |

## Events

- **yp-theme-changed**: Emitted when the selected theme changes.

## Examples

```typescript
// Example usage of the YpThemeSelector custom element
<yp-theme-selector></yp-theme-selector>
```

Please note that the actual implementation of `YpThemeContainerObject` and `window.appGlobals` is not provided in the given code, so their definitions are assumed based on the context.