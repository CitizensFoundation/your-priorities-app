# Scheme

Type representing the different color schemes available.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| scheme        | 'tonal'\|'vibrant'\|'expressive'\|'content'\|'neutral'\|'monochrome'\|'fidelity'\|'dynamic' | The name of the color scheme. |

# generateMaterialColors

Generates a map of color names to their corresponding `DynamicColor` values based on the provided `DynamicScheme`.

## Methods

| Name                  | Parameters        | Return Type | Description                 |
|-----------------------|-------------------|-------------|-----------------------------|
| generateMaterialColors | scheme: DynamicScheme | { [key: string]: DynamicColor } | Generates a map of color names to `DynamicColor` values. |

# hctFromHex

Converts a hex color value to an HCT (Hue, Chroma, Tone) tuple.

## Methods

| Name       | Parameters        | Return Type | Description                 |
|------------|-------------------|-------------|-----------------------------|
| hctFromHex | value: string     | Hct         | Converts a hex value to an HCT tuple. |

# hexFromHct

Converts an HCT (Hue, Chroma, Tone) tuple to a hex color value.

## Methods

| Name       | Parameters                     | Return Type | Description                 |
|------------|--------------------------------|-------------|-----------------------------|
| hexFromHct | hue: number, chroma: number, tone: number | string      | Converts an HCT tuple to a hex value. |

# themeFromSourceColorWithContrast

Creates a color theme from a source color with a specified contrast ratio and scheme.

## Methods

| Name                          | Parameters                                                                                   | Return Type | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| themeFromSourceColorWithContrast | color: string\|{primary: string, secondary: string, tertiary: string, neutral: string}, isDark: boolean, scheme: Scheme, contrast: number | MatScheme   | Creates a color theme from a source color with a specified contrast ratio. |

# themeFromScheme

Generates a theme object with color properties from a given color scheme.

## Methods

| Name            | Parameters            | Return Type | Description                                      |
|-----------------|-----------------------|-------------|--------------------------------------------------|
| themeFromScheme | colorScheme: MatScheme | { [key: string]: string } | Generates a theme object from a color scheme. |

# applyThemeWithContrast

Applies a theme with contrast to a document or shadow root.

## Methods

| Name                   | Parameters                                                                 | Return Type | Description                                      |
|------------------------|----------------------------------------------------------------------------|-------------|--------------------------------------------------|
| applyThemeWithContrast | doc: DocumentOrShadowRoot, theme: {[name: string]: string}, ssName?: string | void        | Applies a theme with contrast to a document.     |

# applyThemeString

Applies a theme string to a document or shadow root.

## Methods

| Name             | Parameters                                      | Return Type | Description                                      |
|------------------|-------------------------------------------------|-------------|--------------------------------------------------|
| applyThemeString | doc: DocumentOrShadowRoot, themeString: string, ssName: string | void        | Applies a theme string to a document or shadow root. |

## Examples

```typescript
// Example usage of generating a material color scheme
const colorScheme = themeFromSourceColorWithContrast('#ff5722', false, 'vibrant', 1.1);
const theme = themeFromScheme(colorScheme);
applyThemeWithContrast(document, theme);
```

```typescript
// Example usage of converting hex to HCT and back
const hct = hctFromHex('#ff5722');
const hex = hexFromHct(hct.hue, hct.chroma, hct.tone);
console.log(hex); // Outputs the hex value corresponding to the HCT values
```