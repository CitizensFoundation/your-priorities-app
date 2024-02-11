/// <reference types="../webApps/client/src/typesAoi.d.ts" />
import { OpenAI } from "openai";
import { Stream } from "openai/streaming";
import { WebSocket } from "ws";
export declare class AiHelper {
    openaiClient: OpenAI;
    wsClientSocket: WebSocket | undefined;
    modelName: string;
    maxTokens: number;
    temperature: number;
    cacheExpireTime: number;
    redisClient?: any;
    cacheKeyForFullResponse?: string;
    constructor(wsClientSocket?: WebSocket | undefined);
    streamChatCompletions(messages: any[]): Promise<void>;
    sendToClient(sender: string, message: string, type?: string): void;
    streamWebSocketResponses(stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>): Promise<void>;
    getAnswerIdeas(question: string, previousIdeas: string[] | null, firstMessage: string | null): Promise<string | null | undefined>;
    getAiAnalysis(questionId: number, contextPrompt: string, answers: AoiChoiceData[], cacheKeyForFullResponse: string, redisClient: any, locale: string, topOrBottomIdeasText: string, typeOfAnalysisText: string): Promise<string | null | undefined>;
}
//# sourceMappingURL=aiHelper.d.ts.map