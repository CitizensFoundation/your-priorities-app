# MaterialColorUtilities

This module provides utilities for generating and applying Material Design color schemes using dynamic color generation and HCT (Hue, Chroma, Tone) color space.

## Properties

| Name               | Type   | Description                                                                 |
|--------------------|--------|-----------------------------------------------------------------------------|
| variantIndexMap    | object | A mapping of variant names to their corresponding index values.             |

## Methods

| Name                          | Parameters                                                                                                                                                                                                 | Return Type | Description                                                                                           |
|-------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|-------------------------------------------------------------------------------------------------------|
| generateMaterialColors        | scheme: DynamicScheme                                                                                                                                                                                     | { [key: string]: DynamicColor } | Generates a set of dynamic colors based on the provided color scheme.                                  |
| hctFromHex                    | value: string                                                                                                                                                                                             | Hct         | Converts a hex color value to an HCT color object.                                                    |
| hexFromHct                    | hue: number, chroma: number, tone: number                                                                                                                                                                 | string      | Converts HCT color values to a hex color string.                                                      |
| themeFromSourceColorWithContrast | color: string \| {primary: string, secondary: string, tertiary: string, neutral: string, neutralVariant: string}, variant: MaterialDynamicVariants \| undefined, isDark: boolean, scheme: MaterialColorScheme, contrast: number, useLowestContainerSurface: boolean | { [key: string]: string } | Generates a theme from a source color with specified contrast and variant.                             |
| themeFromScheme               | colorScheme: MatScheme, useLowestContainerSurface: boolean, isDark: boolean                                                                                                                               | { [key: string]: string } | Generates a theme from a given color scheme.                                                          |
| applyThemeWithContrast        | doc: DocumentOrShadowRoot, theme: {[name: string]: string}, ssName: string = 'material-theme'                                                                                                             | void        | Applies a theme with contrast to a document or shadow root.                                           |
| applyThemeString              | doc: DocumentOrShadowRoot, themeString: string, ssName: string                                                                                                                                           | void        | Applies a theme string to a document or shadow root, using CSSStyleSheet if constructible, otherwise falls back to a style element. |

## Events

- **yp-theme-applied**: Dispatched when a theme is successfully applied to the document.

## Examples

```typescript
import { themeFromSourceColorWithContrast, applyThemeWithContrast } from './MaterialColorUtilities';

const theme = themeFromSourceColorWithContrast('#6200EE', 'vibrant', false, 'tonal', 1, false);
applyThemeWithContrast(document, theme);
```