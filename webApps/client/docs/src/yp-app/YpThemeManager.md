# YpThemeManager

The `YpThemeManager` class is responsible for managing themes, including their selection and application. It handles theme colors, dark mode, high contrast mode, and font settings for a user interface.

## Properties

| Name                | Type                                                         | Description                                                                 |
|---------------------|--------------------------------------------------------------|-----------------------------------------------------------------------------|
| themes              | Array<Record<string, boolean \| string \| Record<string, string>>> | A list of theme objects with properties for background, primary, and secondary colors, and optionally fonts. |
| selectedTheme       | number \| undefined                                           | The index of the currently selected theme.                                  |
| selectedFont        | string \| undefined                                           | The name of the currently selected font.                                    |
| themeColor          | string                                                       | The base color for the theme.                                               |
| themeDarkMode       | boolean                                                      | Indicates whether dark mode is enabled.                                     |
| themeHighContrast   | boolean                                                      | Indicates whether high contrast mode is enabled.                            |
| themePrimaryColor   | string \| undefined                                           | The primary color for the theme.                                            |
| themeSecondaryColor | string \| undefined                                           | The secondary color for the theme.                                          |
| themeTertiaryColor  | string \| undefined                                           | The tertiary color for the theme.                                           |
| themeNeutralColor   | string \| undefined                                           | The neutral color for the theme.                                            |
| isAppleDevice       | boolean                                                      | Indicates whether the current device is an Apple device.                    |
| themeScheme         | Scheme                                                       | The color scheme used for the theme.                                        |

## Methods

| Name          | Parameters                                              | Return Type | Description                                                                                   |
|---------------|---------------------------------------------------------|-------------|-----------------------------------------------------------------------------------------------|
| updateStyles  | properties: Record<string, string>                      | void        | Updates the styles of the application with the given properties.                              |
| setTheme      | number: number \| undefined, configuration: YpCollectionConfiguration \| undefined | void        | Sets the theme based on the provided theme index or configuration object.                     |
| themeChanged  | target: HTMLElement \| undefined                        | void        | Applies the theme changes to the target element or the document body if no target is provided.|
| getHexColor   | color: string \| undefined                              | string      | Converts a color string to a hex color code, defaulting to black if the input is invalid.     |

## Examples

```typescript
// Example usage of the YpThemeManager class
const themeManager = new YpThemeManager();

// Update styles with new properties
themeManager.updateStyles({
  "--mdc-theme-primary": "#0057ff",
  "--mdc-theme-secondary": "#ff0000"
});

// Set a theme by index
themeManager.setTheme(3);

// Change the theme color and apply changes
themeManager.themeColor = "#ff5722";
themeManager.themeChanged();

// Get a hex color from a string
const hexColor = themeManager.getHexColor("ff5722"); // Returns "#ff5722"
```