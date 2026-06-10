import { OpenAI } from "openai";
import { WebSocket } from "ws";
export declare class AiHelper {
    openaiClient: OpenAI;
    wsClientSocket: WebSocket | undefined;
    modelName: string;
    answerIdeasModelName: string;
    analysisModelName: string;
    maxTokens: number;
    temperature: number;
    cacheExpireTime: number;
    redisClient?: any;
    cacheKeyForFullResponse?: string;
    usesMaxCompletionTokens(modelName: string): boolean;
    constructor(wsClientSocket?: WebSocket | undefined);
    moderationSystemPrompt: (instructions: string) => string;
    moderationUserPrompt: (question: string, answer: string) => string;
    getModerationResponse: (instructions: string, question: string, answerToModerate: string) => Promise<boolean>;
    streamChatCompletions(messages: any[], modelName?: string, uniqueToken?: string): Promise<void>;
    sendToClient(sender: string, message: string, type?: string, uniqueToken?: string): void;
    streamWebSocketResponses(stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>, uniqueToken?: string): Promise<void>;
    getAnswerIdeas(question: string, previousIdeas: string[] | null, firstMessage: string | null): Promise<string | null | undefined>;
    getAiAnalysis(questionId: number, contextPrompt: string, answers: AoiChoiceData[], cacheKeyForFullResponse: string, redisClient: any, locale: string, topOrBottomIdeasText: string, typeOfAnalysisText: string, uniqueToken?: string): Promise<string | null | undefined>;
}
