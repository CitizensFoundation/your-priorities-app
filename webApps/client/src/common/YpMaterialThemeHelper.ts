
import {
  MaterialDynamicColors,
  argbFromHex,
  hexFromArgb,
  Hct,
  SchemeTonalSpot,
  DynamicColor,
  DynamicScheme,
  SchemeFidelity,
  SchemeVibrant,
  SchemeExpressive,
  SchemeNeutral,
  SchemeMonochrome,
  SchemeContent,
  Scheme as MatScheme,
  TonalPalette,
} from '@material/material-color-utilities';

function generateMaterialColors(scheme: DynamicScheme): {
  [key: string]: DynamicColor;
} {
  return {
    'highest-surface': MaterialDynamicColors.highestSurface(scheme),
    background: MaterialDynamicColors.background,
    'on-background': MaterialDynamicColors.onBackground,
    surface: MaterialDynamicColors.surface,
    'surface-dim': MaterialDynamicColors.surfaceDim,
    'surface-bright': MaterialDynamicColors.surfaceBright,
    'surface-container-lowest': MaterialDynamicColors.surfaceContainerLowest,
    'surface-container-low': MaterialDynamicColors.surfaceContainerLow,
    'surface-container': MaterialDynamicColors.surfaceContainer,
    'surface-container-high': MaterialDynamicColors.surfaceContainerHigh,
    'surface-container-highest': MaterialDynamicColors.surfaceContainerHighest,
    'on-surface': MaterialDynamicColors.onSurface,
    'surface-variant': MaterialDynamicColors.surfaceVariant,
    'on-surface-variant': MaterialDynamicColors.onSurfaceVariant,
    'inverse-surface': MaterialDynamicColors.inverseSurface,
    'inverse-on-surface': MaterialDynamicColors.inverseOnSurface,
    outline: MaterialDynamicColors.outline,
    'outline-variant': MaterialDynamicColors.outlineVariant,
    shadow: MaterialDynamicColors.shadow,
    scrim: MaterialDynamicColors.scrim,
    'surface-tint': MaterialDynamicColors.surfaceTint,
    primary: MaterialDynamicColors.primary,
    'on-primary': MaterialDynamicColors.onPrimary,
    'primary-container': MaterialDynamicColors.primaryContainer,
    'on-primary-container': MaterialDynamicColors.onPrimaryContainer,
    'inverse-primary': MaterialDynamicColors.inversePrimary,
    'inverse-on-primary': MaterialDynamicColors.primary,
    secondary: MaterialDynamicColors.secondary,
    'on-secondary': MaterialDynamicColors.onSecondary,
    'secondary-container': MaterialDynamicColors.secondaryContainer,
    'on-secondary-container': MaterialDynamicColors.onSecondaryContainer,
    tertiary: MaterialDynamicColors.tertiary,
    'on-tertiary': MaterialDynamicColors.onTertiary,
    'tertiary-container': MaterialDynamicColors.tertiaryContainer,
    'on-tertiary-container': MaterialDynamicColors.onTertiaryContainer,
    error: MaterialDynamicColors.error,
    'on-error': MaterialDynamicColors.onError,
    'error-container': MaterialDynamicColors.errorContainer,
    'on-error-container': MaterialDynamicColors.onErrorContainer,
  };
}

/**
 * Convert a hex value to a hct truple
 */
export function hctFromHex(value: string) {
  const hct = Hct.fromInt(argbFromHex(value));
  return hct;
}

/**
 * Convert a hct truple to a hex value
 */
export function hexFromHct(hue: number, chroma: number, tone: number) {
  const hct = Hct.from(hue, chroma, tone);
  const value = hct.toInt();
  return hexFromArgb(value);
}

/*
export declare enum Variant {
    MONOCHROME = 0,
    NEUTRAL = 1,
    TONAL_SPOT = 2,
    VIBRANT = 3,
    EXPRESSIVE = 4,
    FIDELITY = 5,
    CONTENT = 6,
    RAINBOW = 7,
    FRUIT_SALAD = 8
}

interface DynamicSchemeOptions {
    sourceColorArgb: number;
    variant: Variant;
    contrastLevel: number;
    isDark: boolean;
    primaryPalette: TonalPalette;
    secondaryPalette: TonalPalette;
    tertiaryPalette: TonalPalette;
    neutralPalette: TonalPalette;
    neutralVariantPalette: TonalPalette;
}

*/

const variantIndexMap = {
  "monochrome": 0,
  "neutral": 1,
  "tonalSpot": 2,
  "vibrant": 3,
  "expressive": 4,
  "fidelity": 5,
  "content": 6,
  "rainbow": 7,
  "fruitSalad": 8
};

export function themeFromSourceColorWithContrast(
    color: string|{primary: string, secondary: string, tertiary: string, neutral: string, neutralVariant: string},
    variant: MaterialDynamicVariants | undefined,
    isDark: boolean,
    scheme: MaterialColorScheme,
    contrast: number,
    useLowestContainerSurface: boolean
) {
  if (typeof color !== 'string' && scheme !== 'dynamic' || typeof color !== 'object' && scheme === 'dynamic') {
    throw new Error('color / scheme type mismatch');
  }
  /* import and use other schemas from m-c-u for the scheme you want, but this is the "default"
     https://github.com/material-foundation/material-color-utilities/tree/main/typescript/scheme
   */
  let colorScheme: MatScheme;
  let variantIndex;
  if (variant) {
    variantIndex = variantIndexMap[variant!];
  }

  //scheme = "vibrant";
  //console.error("scheme", scheme);
  if (scheme === 'tonal') {
    //@ts-ignore
    colorScheme = new SchemeTonalSpot(
      //@ts-ignore
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  }
  else if (scheme === 'fidelity') {
    //@ts-ignore
    colorScheme = new SchemeFidelity(
      //@ts-ignore
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'vibrant') {
    //@ts-ignore
    colorScheme = new SchemeVibrant(
      //@ts-ignore
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'expressive') {
    //@ts-ignore
    colorScheme = new SchemeExpressive(
      //@ts-ignore
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'content') {
    //@ts-ignore
    colorScheme = new SchemeContent(
      //@ts-ignore
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'neutral') {
    //@ts-ignore
    colorScheme = new SchemeNeutral(
      //@ts-ignore
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'monochrome') {
    //@ts-ignore
    colorScheme = new SchemeMonochrome(
      //@ts-ignore
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'dynamic' && typeof color === 'object') {
    console.log(color);
    const primary = Hct.fromInt(argbFromHex(color.primary));
    const secondary = Hct.fromInt(argbFromHex(color.secondary));
    const tertiary = Hct.fromInt(argbFromHex(color.tertiary));
    const neutral = Hct.fromInt(argbFromHex(color.neutral));
    const neutralVariant = Hct.fromInt(argbFromHex(color.neutralVariant));
    console.log(color.primary);
    //@ts-ignore
    colorScheme = new DynamicScheme({
      sourceColorArgb: argbFromHex(color.primary),
      variant: variantIndex===undefined ? 5 : variantIndex, // Variant.FIDELITY https://github.com/material-foundation/material-color-utilities/blob/main/typescript/scheme/variant.ts
      contrastLevel: contrast,
      isDark,
      primaryPalette: TonalPalette.fromHueAndChroma(
          primary.hue, primary.chroma),
      secondaryPalette: TonalPalette.fromHueAndChroma(
          secondary.hue, secondary.chroma),
      tertiaryPalette: TonalPalette.fromHueAndChroma(
          tertiary.hue, tertiary.chroma),
      neutralPalette: TonalPalette.fromHueAndChroma(
          neutral.hue, neutral.chroma),
      neutralVariantPalette: TonalPalette.fromHueAndChroma(
        neutralVariant.hue, neutralVariant.chroma),
    });
  }

  return themeFromScheme(colorScheme!, useLowestContainerSurface, isDark);
}

export function themeFromScheme(colorScheme: MatScheme, useLowestContainerSurface: boolean, isDark: boolean) {
  //@ts-ignore
  const colors = generateMaterialColors(colorScheme);
  const theme: { [key: string]: string } = {};

  for (const [key, value] of Object.entries(colors)) {
    //@ts-ignore
    theme[key] = hexFromArgb(value.getArgb(colorScheme));
  }

  //TODO: Lookinto this
  if (useLowestContainerSurface) {
    theme["surface"] = theme["surface-container-lowest"];
    if (!isDark) {
      theme["on-primary-container"] = theme["on-surface"];
    }
  }

  return theme;
}

export function applyThemeWithContrast(
  doc: DocumentOrShadowRoot,
  theme: {[name: string]: string},
  ssName = 'material-theme'
) {
  let styleString = ':root{';
  for (const [key, value] of Object.entries(theme)) {
    styleString += `--md-sys-color-${key}:${value};`;
  }
  styleString += '}';

  applyThemeString(doc, styleString, ssName);
}

export function applyThemeString(doc: DocumentOrShadowRoot, themeString: string, ssName: string) {
  try {
    // The replace method is part of CSSStyleSheet, so if it's callable, CSSStyleSheet should be constructible.
    const isCSSSheetConstructible = new CSSStyleSheet().replace instanceof Function;

    if (isCSSSheetConstructible) {
      // Cast window to any to bypass TypeScript's strict typing
      let ss = (window as any)[ssName] as CSSStyleSheet | undefined;

      if (!ss) {
        ss = new CSSStyleSheet();
        // Again, cast to bypass TypeScript's strict typing
        (doc as Document).adoptedStyleSheets = [...(doc as Document).adoptedStyleSheets, ss];
        (window as any)[ssName] = ss;
      }

      ss.replace(themeString).catch(console.error);
    }
  } catch (error) {
    // Fallback to using a style element
    if (doc instanceof Document && doc.head) {
      let style = doc.createElement('style');
      style.setAttribute('id', ssName);
      style.textContent = themeString;
      doc.head.appendChild(style);
    } else {
      console.error('The provided document does not have a head element.', error);
    }
  } finally {
    const event = new CustomEvent("yp-theme-applied", {
      bubbles: true,
      composed: true,
    });
    document.dispatchEvent(event);
  }
}