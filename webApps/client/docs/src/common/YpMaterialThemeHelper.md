# generateMaterialColors

Generates a map of color names to their corresponding `DynamicColor` values based on a given `DynamicScheme`.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| -             | -      | -                         |

## Methods

| Name                  | Parameters            | Return Type | Description                                             |
|-----------------------|-----------------------|-------------|---------------------------------------------------------|
| generateMaterialColors | scheme: DynamicScheme | Object      | Returns a map of color names to `DynamicColor` objects. |

## Examples

```typescript
// Example usage of generateMaterialColors
const colorScheme = new DynamicScheme({ /* ...scheme options... */ });
const materialColors = generateMaterialColors(colorScheme);
```

# hctFromHex

Converts a hex color value to an HCT (Hue, Chroma, Tone) tuple.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| -             | -      | -                         |

## Methods

| Name       | Parameters        | Return Type | Description                             |
|------------|-------------------|-------------|-----------------------------------------|
| hctFromHex | value: string     | Object      | Converts a hex value to an HCT tuple.   |

## Examples

```typescript
// Example usage of hctFromHex
const hctColor = hctFromHex('#ff5722');
```

# hexFromHct

Converts an HCT (Hue, Chroma, Tone) tuple to a hex color value.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| -             | -      | -                         |

## Methods

| Name       | Parameters                        | Return Type | Description                             |
|------------|-----------------------------------|-------------|-----------------------------------------|
| hexFromHct | hue: number, chroma: number, tone: number | string      | Converts an HCT tuple to a hex value.   |

## Examples

```typescript
// Example usage of hexFromHct
const hexColor = hexFromHct(30, 60, 90);
```

# themeFromSourceColorWithContrast

Creates a color theme from a source color with a specified contrast level.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| -             | -      | -                         |

## Methods

| Name                        | Parameters                                                                                                      | Return Type | Description                                                                                   |
|-----------------------------|-----------------------------------------------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------------------------|
| themeFromSourceColorWithContrast | color: string \| {primary: string, secondary: string, tertiary: string, neutral: string, neutralVariant: string}, variant: MaterialDynamicVariants \| undefined, isDark: boolean, scheme: MaterialColorScheme, contrast: number | Object      | Creates a color theme based on the source color, variant, scheme type, darkness, and contrast. |

## Examples

```typescript
// Example usage of themeFromSourceColorWithContrast
const colorTheme = themeFromSourceColorWithContrast('#ff5722', 'vibrant', true, 'dynamic', 1.5);
```

# themeFromScheme

Generates a theme object from a given color scheme.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| -             | -      | -                         |

## Methods

| Name            | Parameters            | Return Type | Description                                     |
|-----------------|-----------------------|-------------|-------------------------------------------------|
| themeFromScheme | colorScheme: MatScheme | Object      | Generates a theme object from a color scheme.   |

## Examples

```typescript
// Example usage of themeFromScheme
const colorScheme = new DynamicScheme({ /* ...scheme options... */ });
const theme = themeFromScheme(colorScheme);
```

# applyThemeWithContrast

Applies a theme with contrast to a document or shadow root.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| -             | -      | -                         |

## Methods

| Name                  | Parameters                                                                 | Return Type | Description                                               |
|-----------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------|
| applyThemeWithContrast | doc: DocumentOrShadowRoot, theme: {[name: string]: string}, ssName?: string | void        | Applies a theme with contrast to a document or shadow root. |

## Examples

```typescript
// Example usage of applyThemeWithContrast
const theme = { /* ...theme properties... */ };
applyThemeWithContrast(document, theme);
```

# applyThemeString

Applies a theme string to a document or shadow root.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| -             | -      | -                         |

## Methods

| Name             | Parameters                                              | Return Type | Description                                         |
|------------------|---------------------------------------------------------|-------------|-----------------------------------------------------|
| applyThemeString | doc: DocumentOrShadowRoot, themeString: string, ssName: string | void        | Applies a CSS theme string to a document or shadow root. |

## Examples

```typescript
// Example usage of applyThemeString
const themeString = ':root { --md-sys-color-primary: #6200ee; }';
applyThemeString(document, themeString);
```