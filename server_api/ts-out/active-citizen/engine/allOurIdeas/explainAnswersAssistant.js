"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExplainAnswersAssistant = void 0;
const openai_1 = require("openai");
const baseChatBot_js_1 = require("../../llms/baseChatBot.js");
class ExplainAnswersAssistant extends baseChatBot_js_1.YpBaseChatBot {
    openaiClient;
    modelName = "gpt-4-0125-preview";
    maxTokens = 4000;
    temperature = 0.8;
    constructor(wsClientId, wsClients) {
        super(wsClientId, wsClients, undefined);
        this.openaiClient = new openai_1.OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    renderSystemPrompt() {
        return `The user is doing pairwise voting on two answers at the time, to a question, the user needs help decide what to vote on.

Instructions:
Use a relevant emoji for the first and second answers.
Use thumbs emojis for pros and thumb down emjoi for cons
Use summary emoji for summary.
Use simple and upbeat language.
Ask the user clarifying questions if needed.

Output:
* Each answer
-- One short paragraph, max three sentences, explaination in a very simple language
-- The top pro and con
-- If this is likely to be a root cause of the problem set out in the question
* Short summary in the end of which answer is better and why
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
