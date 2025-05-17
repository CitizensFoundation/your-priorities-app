# YpThemeSelector

The `YpThemeSelector` is a web component that allows users to select and configure theme colors and font styles for an application. It provides options for dynamic and custom color schemes and supports various theme configurations.

## Properties

| Name                        | Type                          | Description                                                                 |
|-----------------------------|-------------------------------|-----------------------------------------------------------------------------|
| oneDynamicThemeColor        | `string \| undefined`         | The dynamic theme color selected by the user.                               |
| themePrimaryColor           | `string \| undefined`         | The primary color of the theme.                                             |
| themeSecondaryColor         | `string \| undefined`         | The secondary color of the theme.                                           |
| themeTertiaryColor          | `string \| undefined`         | The tertiary color of the theme.                                            |
| themeNeutralColor           | `string \| undefined`         | The neutral color of the theme.                                             |
| themeNeutralVariantColor    | `string \| undefined`         | The neutral variant color of the theme.                                     |
| themeBackgroundColor       | `string \| undefined`         | The background color of the theme.                                        |
| fontStyles                  | `string \| undefined`         | The font styles to be applied to the theme.                                 |
| fontImports                 | `string \| undefined`         | The font imports to be used in the theme.                                   |
| selectedThemeScheme         | `string`                      | The selected theme scheme, default is "tonal".                              |
| selectedThemeVariant        | `string`                      | The selected theme variant, default is "monochrome".                        |
| themeConfiguration          | `YpThemeConfiguration`        | The configuration object for the theme.                                     |
| disableSelection            | `boolean \| undefined`        | Whether the selection of theme options is disabled.                         |
| disableMultiInputs          | `boolean`                     | Whether multiple inputs are disabled.                                       |
| useLowestContainerSurface   | `boolean`                     | Whether to use the lowest container surface.                                |
| disableOneThemeColorInputs  | `boolean`                     | Whether the one theme color inputs are disabled.                            |
| hasLogoImage                | `boolean`                     | Whether a logo image is present.                                            |

## Methods

| Name                      | Parameters                                                                 | Return Type | Description                                                                 |
|---------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback         | None                                                                       | `void`      | Lifecycle method called when the element is added to the document.          |
| disconnectedCallback      | None                                                                       | `void`      | Lifecycle method called when the element is removed from the document.      |
| themeColorDetected        | `event: CustomEvent`                                                       | `void`      | Handles the detection of a theme color from an event.                       |
| updated                   | `changedProperties: Map<string \| number \| symbol, unknown>`              | `void`      | Lifecycle method called when properties are updated.                        |
| isValidHex                | `color: string \| undefined`                                               | `boolean`   | Checks if a given color string is a valid hex color.                        |
| setThemeSchema            | `event: CustomEvent`                                                       | `void`      | Sets the theme schema based on the selected option.                         |
| setThemeVariant           | `event: CustomEvent`                                                       | `void`      | Sets the theme variant based on the selected option.                        |
| handleColorInput          | `event: CustomEvent`                                                       | `void`      | Handles input for color fields, ensuring valid hex values.                  |
| updateDisabledInputs      | None                                                                       | `void`      | Updates the state of input fields based on current color values.            |
| get currentThemeSchemaIndex | None                                                                     | `number`    | Gets the index of the current theme schema.                                 |
| updateFontStyles          | `event: CustomEvent`                                                       | `void`      | Updates the font styles based on user input.                                |
| updateFontImports         | `event: CustomEvent`                                                       | `void`      | Updates the font imports based on user input.                               |
| setLowestContainerSurface | `event: CustomEvent`                                                       | `Promise<void>` | Sets the use of the lowest container surface based on a checkbox state.     |
| render                    | None                                                                       | `TemplateResult` | Renders the component's template.                                           |
| renderPallette            | None                                                                       | `TemplateResult` | Renders the color palette for the theme.                                    |

## Events

- **yp-theme-color-detected**: Emitted when a theme color is detected.
- **yp-theme-configuration-updated**: Emitted when the theme configuration is updated.
- **yp-theme-configuration-changed**: Emitted when the theme configuration changes.
- **get-color-from-logo**: Emitted when the user requests to get a color from a logo.

## Examples

```typescript
// Example usage of the YpThemeSelector component
import './yp-theme-selector.js';

const themeSelector = document.createElement('yp-theme-selector');
document.body.appendChild(themeSelector);

themeSelector.addEventListener('yp-theme-configuration-changed', (event) => {
  console.log('Theme configuration changed:', event.detail);
});
```