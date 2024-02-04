import { OpenAI } from "openai";
export declare class YpLocaleTranslation {
    openaiClient: OpenAI;
    modelName: string;
    maxTokens: number;
    temperature: number;
    constructor();
    loadAndCompareTranslations(): Promise<void>;
    setValueAtPath(obj: any, path: string, value: any): void;
    private loadJsonFile;
    private updateWithMissingKeys;
    private extractMissingTranslations;
    private chunkArray;
    renderSystemPrompt(): string;
    renderUserMessage(language: string, textsToTranslate: Array<string>): string;
    translateUITexts(languageIsoCode: string, textsToTranslate: string[]): Promise<string[] | undefined>;
    callLlm(languageName: string, inObject: string[]): Promise<string[] | undefined>;
}
//# sourceMappingURL=updateAllLocalesFromEn.d.ts.map