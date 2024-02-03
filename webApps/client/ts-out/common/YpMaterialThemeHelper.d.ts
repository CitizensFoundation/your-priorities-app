import { Hct, Scheme as MatScheme } from '@material/material-color-utilities';
/**
 * Convert a hex value to a hct truple
 */
export declare function hctFromHex(value: string): Hct;
/**
 * Convert a hct truple to a hex value
 */
export declare function hexFromHct(hue: number, chroma: number, tone: number): string;
export declare function themeFromSourceColorWithContrast(color: string | {
    primary: string;
    secondary: string;
    tertiary: string;
    neutral: string;
    neutralVariant: string;
}, variant: MaterialDynamicVariants | undefined, isDark: boolean, scheme: MaterialColorScheme, contrast: number): {
    [key: string]: string;
};
export declare function themeFromScheme(colorScheme: MatScheme): {
    [key: string]: string;
};
export declare function applyThemeWithContrast(doc: DocumentOrShadowRoot, theme: {
    [name: string]: string;
}, ssName?: string): void;
export declare function applyThemeString(doc: DocumentOrShadowRoot, themeString: string, ssName: string): void;
//# sourceMappingURL=YpMaterialThemeHelper.d.ts.map