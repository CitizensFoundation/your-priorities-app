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
        return `The user is doing pairwise voting on two answers at the time, to a provided question, the user needs help decide what to vote on.
Please output a short very simple explaination of each answer.
Please help explain to the user the top pro and con of each answer, to help the user make up their mind on which one to vote on.
Only output the top pro and con for each answer, and make sure to keep it short and to the point.
In the end provide a very short summary of your assessment of which answer is better, and why.
Ask the user clarifying questions if needed.
`;
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
