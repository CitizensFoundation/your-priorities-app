export declare class YpLanguages {
    allLanguages: YpLanguageData[];
    isoCodesNotInGoogleTranslate: string[];
    constructor();
    ensureAllLocaleFoldersAreCreated(): Promise<void>;
    getEnglishName(code: string): string | undefined;
    getNativeName(code: string): string | undefined;
    googleTranslateLanguages: {
        englishName: string;
        nativeName: string;
        code: string;
    }[];
}
//# sourceMappingURL=ypLanguages.d.ts.map