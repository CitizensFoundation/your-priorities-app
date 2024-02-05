export declare class YpLanguages {
    allLanguages: YpLanguageData[];
    isoCodesNotInGoogleTranslate: string[];
    constructor();
    ensureAllLocaleFoldersAreCreated(): Promise<void>;
    googleTranslateLanguages: {
        englishName: string;
        nativeName: string;
        code: string;
    }[];
}
//# sourceMappingURL=ypLanguages.d.ts.map