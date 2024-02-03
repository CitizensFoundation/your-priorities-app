export declare class YpThemeManager {
    themes: Array<Record<string, boolean | string | Record<string, string>>>;
    selectedTheme: number | undefined;
    selectedFont: string | undefined;
    themeColor: string | undefined;
    themeDarkMode: boolean;
    themeHighContrast: boolean;
    themePrimaryColor: string | undefined;
    themeSecondaryColor: string | undefined;
    themeTertiaryColor: string | undefined;
    themeNeutralColor: string | undefined;
    themeNeutralVariantColor: string | undefined;
    themeVariant: MaterialDynamicVariants | undefined;
    static themeScemesOptionsWithName: {
        name: string;
        value: string;
    }[];
    static themeVariantsOptionsWithName: {
        name: string;
        value: string;
    }[];
    isAppleDevice: boolean;
    themeScheme: MaterialColorScheme;
    constructor();
    setupOldThemes(): void;
    updateStyles(properties: Record<string, string>): void;
    setThemeFromOldConfiguration(number: number | undefined, configuration?: YpCollectionConfiguration | undefined): void;
    setTheme(number: number | undefined, configuration?: YpCollectionConfiguration | undefined): void;
    updateLiveFromConfiguration(theme: YpThemeConfiguration): void;
    themeChanged(target?: HTMLElement | undefined): void;
    getHexColor(color: string | undefined): string;
}
//# sourceMappingURL=YpThemeManager.d.ts.map