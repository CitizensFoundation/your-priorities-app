# YpThemeManager

The `YpThemeManager` class is responsible for managing and applying themes, including automatic, dark mode, and high contrast themes. It provides functionality to set themes from configurations, update styles, and handle font styles and imports.

## Properties

| Name                        | Type                                                                 | Description                                                                 |
|-----------------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------|
| themes                      | Array<Record<string, boolean \| string \| Record<string, string>>>   | List of available themes with their properties.                             |
| selectedFont                | string \| undefined                                                  | The currently selected font.                                                |
| currentTheme                | string \| undefined                                                  | The currently applied theme.                                                |
| themeColor                  | string \| undefined                                                  | The primary color of the theme. Defaults to `#0327f8`.                      |
| themeDarkMode               | boolean                                                              | Indicates if dark mode is enabled.                                          |
| themeHighContrast           | boolean                                                              | Indicates if high contrast mode is enabled.                                 |
| themePrimaryColor           | string \| undefined                                                  | The primary color of the theme.                                             |
| themeSecondaryColor         | string \| undefined                                                  | The secondary color of the theme.                                           |
| themeTertiaryColor          | string \| undefined                                                  | The tertiary color of the theme.                                            |
| themeNeutralColor           | string \| undefined                                                  | The neutral color of the theme.                                             |
| themeNeutralVariantColor    | string \| undefined                                                  | The neutral variant color of the theme.                                     |
| themeVariant                | MaterialDynamicVariants \| undefined                                 | The variant of the theme.                                                   |
| useLowestContainerSurface   | boolean                                                              | Indicates if the lowest container surface should be used.                   |
| hasStaticTheme              | boolean                                                              | Indicates if a static theme is being used.                                  |
| isAppleDevice               | boolean                                                              | Indicates if the device is an Apple device.                                 |
| themeScheme                 | MaterialColorScheme                                                  | The color scheme of the theme. Defaults to `tonal`.                         |

## Methods

| Name                          | Parameters                                                                 | Return Type | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| constructor                   | -                                                                          | -           | Initializes the theme manager and sets up themes based on saved preferences.|
| setupOldThemes                | -                                                                          | void        | Sets up a list of predefined themes.                                        |
| updateStyles                  | properties: Record<string, string>                                         | void        | Updates the styles of the application with the given properties.            |
| setThemeFromOldConfiguration  | number: number \| undefined, configuration: YpCollectionConfiguration \| undefined | void        | Sets the theme based on an old configuration.                               |
| sanitizeFontStyles            | fontStyles: string                                                         | string      | Sanitizes the given font styles to allow only certain properties.           |
| sanitizeFontImports           | fontImports: string[]                                                      | string[]    | Sanitizes the given font import URLs to allow only certain domains.         |
| applyFontStyles               | fontStyles: string \| null                                                 | void        | Applies the given font styles to the document.                              |
| importFonts                   | fontImportsString: string \| null                                          | void        | Imports fonts from the given URLs into the document.                        |
| setTheme                      | number: number \| undefined, configuration: YpCollectionConfiguration \| undefined | void        | Sets the theme based on the given configuration and applies the background color. |
| updateBrowserThemeColor       | -                                                                          | void        | Updates the browser's theme color meta tag based on the current theme.      |
| updateLiveFromConfiguration   | theme: YpThemeConfiguration                                                | void        | Updates the theme live from the given configuration.                        |
| themeChanged                  | target: HTMLElement \| undefined                                           | void        | Applies the current theme settings to the document.                         |
| hexToRgb                      | hex: string                                                                | string      | Converts a hex color code to an RGB string.                                 |
| createSemiTransparentColor    | colorInt: number, opacity: number                                          | number      | Creates a semi-transparent color from the given color and opacity.          |
| intToHex                      | colorInt: number                                                           | string      | Converts an integer color value to a hex color code.                        |
| getHexColor                   | color: string \| undefined                                                 | string      | Returns a valid hex color code from the given color string.                 |

## Examples

```typescript
// Example usage of the YpThemeManager
const themeManager = new YpThemeManager();
themeManager.setTheme(0); // Apply the first theme in the list
themeManager.updateStyles({
  "--custom-property": "#ff0000"
});
```