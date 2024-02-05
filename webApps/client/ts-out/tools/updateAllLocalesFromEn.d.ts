import { OpenAI } from "openai";
export declare class YpLocaleTranslation {
    openaiClient: OpenAI;
    modelName: string;
    maxTokens: number;
    temperature: number;
    constructor();
    getValueByPath(obj: any, path: any): any;
    loadAndCompareTranslations(): Promise<void>;
    setValueAtPath(obj: any, path: any, value: any): void;
    private loadJsonFile;
    private updateWithMissingKeys;
    excludeKeysFromTranslation: string[];
    private extractMissingTranslations;
    private chunkArray;
    renderSystemPrompt(): string;
    renderUserMessage(language: string, textsToTranslate: Array<string>): string;
    translateUITexts(languageIsoCode: string, textsToTranslate: string[]): Promise<string[] | undefined>;
    callLlm(languageName: string, inObject: string[]): Promise<string[] | undefined>;
}
//# sourceMappingURL=updateAllLocalesFromEn.d.ts.map