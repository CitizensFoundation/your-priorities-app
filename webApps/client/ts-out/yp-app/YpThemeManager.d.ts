import { Scheme } from "../common/YpMaterialThemeHelper";
export declare class YpThemeManager {
    themes: Array<Record<string, boolean | string | Record<string, string>>>;
    selectedTheme: number | undefined;
    selectedFont: string | undefined;
    themeColor: string;
    themeDarkMode: boolean;
    themeHighContrast: boolean;
    themePrimaryColor: string | undefined;
    themeSecondaryColor: string | undefined;
    themeTertiaryColor: string | undefined;
    themeNeutralColor: string | undefined;
    isAppleDevice: boolean;
    themeScheme: Scheme;
    constructor();
    updateStyles(properties: Record<string, string>): void;
    setTheme(number: number | undefined, configuration?: YpCollectionConfiguration | undefined): void;
    themeChanged(target?: HTMLElement | undefined): void;
    getHexColor(color: string | undefined): string;
}
//# sourceMappingURL=YpThemeManager.d.ts.map