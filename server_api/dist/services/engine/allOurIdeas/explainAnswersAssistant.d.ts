import { OpenAI } from "openai";
import { WebSocket } from "ws";
import { YpBaseChatBot } from "../../llms/baseChatBot.js";
export declare class ExplainAnswersAssistant extends YpBaseChatBot {
    openaiClient: OpenAI;
    modelName: string;
    maxTokens: number;
    temperature: number;
    languageName: string;
    constructor(wsClientId: string, wsClients: Map<string, WebSocket>, languageName: string);
    renderSystemPrompt(): string;
    explainConversation: (chatLog: YpSimpleChatLog[]) => Promise<void>;
}
