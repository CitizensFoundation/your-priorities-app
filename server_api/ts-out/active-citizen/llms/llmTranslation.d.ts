/// <reference types="../webApps/client/src/typesAoi.d.ts" />
import { OpenAI } from "openai";
export declare class YpLlmTranslation {
    openaiClient: OpenAI;
    modelName: string;
    maxTokens: number;
    temperature: number;
    constructor();
    renderSchemaSystemMessage(jsonInSchema: string, jsonOutSchema: string, lengthInfo: string): string;
    renderOneTranslationSystemMessage(): string;
    renderListTranslationSystemMessage(): string;
    renderOneTranslationUserMessage(language: string, stringToTranslate: string): string;
    renderListTranslationUserMessage(language: string, textsToTranslate: Array<string>): string;
    renderAnswersUserMessage(language: string, question: string, answer: AoiTranslationAnswerInData): string;
    renderQuestionUserMessage(language: string, question: string, questionData: AoiTranslationQuestionInData): string;
    getModerationFlag(content: string): Promise<boolean>;
    getOneTranslation(languageIsoCode: string, stringToTranslate: string): Promise<string | null | undefined>;
    getListTranslation(languageIsoCode: string, stringsToTranslate: string[]): Promise<string[] | null | undefined>;
    getChoiceTranslation(languageIsoCode: string, answerContent: string, maxCharactersInTranslation?: number): Promise<string | null | undefined>;
    getQuestionTranslation(languageIsoCode: string, question: string, maxCharactersInTranslation?: number): Promise<string | null | undefined>;
    callSimpleLlm(languageName: string, toTranslate: string[] | string, parseJson: boolean, systemRenderer: Function, userRenderer: Function): Promise<string | object | null | undefined>;
    callSchemaLlm(jsonInSchema: string, jsonOutSchema: string, lengthInfo: string, languageName: string, question: string, toTranslate: AoiTranslationAnswerInData | AoiTranslationQuestionInData | string[] | string, maxCharactersInTranslation: number | undefined, systemRenderer: Function, userRenderer: Function): Promise<string | null | undefined>;
}
//# sourceMappingURL=llmTranslation.d.ts.map