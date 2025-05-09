export declare class YpLanguages {
    static get allLanguages(): YpLanguageData[];
    static get isoCodesNotInGoogleTranslate(): string[];
    static getEnglishName(code: string): string | undefined;
    static getNativeName(code: string): string | undefined;
    static additionalLanguages: {
        englishName: string;
        nativeName: string;
        code: string;
    }[];
    static googleTranslateLanguages: {
        englishName: string;
        nativeName: string;
        code: string;
    }[];
}
