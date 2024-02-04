"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExplainAnswersAssistant = void 0;
const openai_1 = require("openai");
const baseChatBot_js_1 = require("../../llms/baseChatBot.js");
class ExplainAnswersAssistant extends baseChatBot_js_1.YpBaseChatBot {
    openaiClient;
    modelName = "gpt-4-0125-preview";
    maxTokens = 4000;
    temperature = 0.5;
    constructor(wsClientId, wsClients) {
        super(wsClientId, wsClients, undefined);
        this.openaiClient = new openai_1.OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    renderSystemPrompt() {
        return `You are a helpful assistant helping the user to explain answers the user is rating to questions. Provide detailed answers and analysis in multimedia markdown format`;
    }
    explainConversation = async (chatLog) => {
        this.setChatLog(chatLog);
        let messages = chatLog.map((message) => {
            return {
                role: message.sender,
                content: message.message,
            };
        });
        const systemMessage = {
            role: "system",
            content: this.renderSystemPrompt(),
        };
        messages.unshift(systemMessage);
        const stream = await this.openaiClient.chat.completions.create({
            model: this.llmModel,
            messages,
            max_tokens: this.maxTokens,
            temperature: this.tempeture,
            stream: true,
        });
        this.streamWebSocketResponses(stream);
    };
}
exports.ExplainAnswersAssistant = ExplainAnswersAssistant;
