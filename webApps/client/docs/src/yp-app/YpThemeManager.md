# YpThemeManager

The `YpThemeManager` class is responsible for managing themes within an application. It handles theme selection, theme color customization, dark mode, high contrast mode, and broadcasting theme changes. It also maintains a list of predefined themes and provides methods to update styles based on the selected theme.

## Properties

| Name                      | Type                                                         | Description                                                                 |
|---------------------------|--------------------------------------------------------------|-----------------------------------------------------------------------------|
| themes                    | Array<Record<string, boolean \| string \| Record<string, string>>> | A list of predefined themes with their properties.                          |
| selectedTheme             | number \| undefined                                          | The index of the currently selected theme.                                  |
| selectedFont              | string \| undefined                                          | The name of the currently selected font.                                    |
| themeColor                | string \| undefined                                          | The primary color of the current theme.                                     |
| themeDarkMode             | boolean                                                      | Indicates whether the dark mode is enabled.                                 |
| themeHighContrast         | boolean                                                      | Indicates whether the high contrast mode is enabled.                        |
| themePrimaryColor         | string \| undefined                                          | The primary color of the current theme.                                     |
| themeSecondaryColor       | string \| undefined                                          | The secondary color of the current theme.                                   |
| themeTertiaryColor        | string \| undefined                                          | The tertiary color of the current theme.                                    |
| themeNeutralColor         | string \| undefined                                          | The neutral color of the current theme.                                     |
| themeNeutralVariantColor  | string \| undefined                                          | The neutral variant color of the current theme.                             |
| themeVariant              | MaterialDynamicVariants \| undefined                        | The variant of the current theme.                                           |
| isAppleDevice             | boolean                                                      | Indicates whether the current device is an Apple device.                    |
| themeScheme               | MaterialColorScheme                                          | The color scheme of the current theme.                                      |
| channel                   | BroadcastChannel                                             | A channel for broadcasting theme color changes.                             |

## Methods

| Name                        | Parameters                                              | Return Type | Description                                                                 |
|-----------------------------|---------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| updateStyles                | properties: Record<string, string>                      | void        | Updates the styles of the application based on the provided properties.     |
| setThemeFromOldConfiguration| number: number \| undefined, configuration: YpCollectionConfiguration \| undefined | void        | Sets the theme based on an old configuration format.                        |
| setTheme                    | number: number \| undefined, configuration: YpCollectionConfiguration \| undefined | void        | Sets the theme based on the provided configuration.                         |
| updateLiveFromConfiguration | theme: YpThemeConfiguration                             | void        | Updates the live theme based on the provided theme configuration.           |
| themeChanged                | target: HTMLElement \| undefined                        | void        | Applies the theme changes to the application.                               |
| getHexColor                 | color: string \| undefined                              | string      | Returns a hex color string based on the provided color value.               |

## Events (if any)

- **yp-large-font**: Emitted when a theme with large fonts is selected or deselected.

## Examples

```typescript
// Example usage of the YpThemeManager class
const themeManager = new YpThemeManager();
themeManager.themeDarkMode = true; // Enable dark mode
themeManager.themeColor = "#ff0000"; // Set a custom theme color
themeManager.themeChanged(); // Apply the theme changes
```

Note: The `YpCollectionConfiguration` and `YpThemeConfiguration` types are referenced in the methods but are not defined within the provided code snippet. These would be defined elsewhere in the application code.