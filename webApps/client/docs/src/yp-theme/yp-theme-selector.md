# YpThemeSelector

The `YpThemeSelector` class is a web component that allows users to select and configure a theme for their application. It provides options to choose dynamic colors or custom colors for various theme properties such as primary, secondary, tertiary, neutral, and neutral variant colors. It also allows selecting a theme scheme and variant. The component uses the `YpBaseElement` as a base class and integrates with the Material Web Components.

## Properties

| Name                      | Type                  | Description                                                                 |
|---------------------------|-----------------------|-----------------------------------------------------------------------------|
| oneDynamicThemeColor      | string \| undefined   | The dynamic theme color selected by the user.                               |
| themePrimaryColor         | string \| undefined   | The primary color of the theme.                                             |
| themeSecondaryColor       | string \| undefined   | The secondary color of the theme.                                           |
| themeTertiaryColor        | string \| undefined   | The tertiary color of the theme.                                            |
| themeNeutralColor         | string \| undefined   | The neutral color of the theme.                                             |
| themeNeutralVariantColor  | string \| undefined   | The neutral variant color of the theme.                                     |
| selectedThemeScheme       | string                | The selected theme scheme, defaults to "tonal".                             |
| selectedThemeVariant      | string                | The selected theme variant, defaults to "monochrome".                       |
| themeConfiguration        | YpThemeConfiguration  | The configuration object for the theme.                                     |
| disableSelection          | boolean \| undefined  | Indicates if the selection of theme colors is disabled.                     |
| disableMultiInputs        | boolean               | Indicates if the input for multiple theme colors is disabled.               |
| disableOneThemeColorInputs| boolean               | Indicates if the input for one dynamic theme color is disabled.             |
| hasLogoImage              | boolean               | Indicates if there is a logo image available for color extraction.          |

## Methods

| Name                | Parameters            | Return Type | Description                                                                 |
|---------------------|-----------------------|-------------|-----------------------------------------------------------------------------|
| themeColorDetected  | event: CustomEvent    | void        | Handles the detection of a theme color and updates the oneDynamicThemeColor.|
| updated             | changedProperties: Map<string \| number \| symbol, unknown> | void | Handles updates to the component's properties and theme configuration.      |
| isValidHex          | color: string \| undefined | boolean   | Checks if the provided color string is a valid hex color.                   |
| setThemeSchema      | event: CustomEvent    | void        | Sets the theme scheme based on the selected index from the dropdown.        |
| setThemeVariant     | event: CustomEvent    | void        | Sets the theme variant based on the selected index from the dropdown.       |
| handleColorInput    | event: CustomEvent    | void        | Handles input for the dynamic theme color and validates the hex value.      |
| updateDisabledInputs| None                  | void        | Updates the state of input fields based on the validity of the hex colors.  |
| currentThemeSchemaIndex | None               | number      | Gets the index of the current theme scheme in the options list.             |

## Events (if any)

- **yp-theme-color-detected**: Emitted when a theme color is detected.
- **config-updated**: Emitted when the theme configuration is updated.
- **yp-theme-configuration-updated**: Emitted globally when the theme configuration is updated.
- **yp-theme-configuration-changed**: Emitted when the theme configuration changes.

## Examples

```typescript
// Example usage of the YpThemeSelector component
<yp-theme-selector
  .themePrimaryColor="${this.themePrimaryColor}"
  .themeSecondaryColor="${this.themeSecondaryColor}"
  .themeTertiaryColor="${this.themeTertiaryColor}"
  .themeNeutralColor="${this.themeNeutralColor}"
  .themeNeutralVariantColor="${this.themeNeutralVariantColor}"
  .selectedThemeScheme="${this.selectedThemeScheme}"
  .selectedThemeVariant="${this.selectedThemeVariant}"
  .themeConfiguration="${this.themeConfiguration}"
  .disableSelection="${this.disableSelection}"
  .disableMultiInputs="${this.disableMultiInputs}"
  .disableOneThemeColorInputs="${this.disableOneThemeColorInputs}"
  .hasLogoImage="${this.hasLogoImage}"
></yp-theme-selector>
```

Note: The example assumes that the properties such as `themePrimaryColor`, `themeSecondaryColor`, etc., are defined in the context where the `YpThemeSelector` component is used.