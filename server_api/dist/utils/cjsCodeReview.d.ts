import { OpenAI } from "openai";
export declare class YpCjsCodeReview {
    openaiClient: OpenAI;
    modelName: string;
    maxTokens: number;
    temperature: number;
    constructor();
    readFilesRecursively(dir: string): Promise<string[]>;
    reviewCjsFiles(): Promise<void>;
    renderSystemPrompt(): string;
    renderUserMessage(codeToReview: string): string;
    callLlm(codeToReview: string): Promise<string | undefined | null>;
}
