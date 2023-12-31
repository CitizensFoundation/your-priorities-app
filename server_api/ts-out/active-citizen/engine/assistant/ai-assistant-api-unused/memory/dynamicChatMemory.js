"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultRefinedHistoryPrompt_1 = require("memory/defaultRefinedHistoryPrompt");
const defaultSummarizePrompt_1 = require("memory/defaultSummarizePrompt");
const schema_1 = require("schema");
const llmChain_1 = require("chains/llmChain");
const chatModels_1 = require("chatModels");
const chatMemory_1 = require("memory/chatMemory");
class DynamicChatMemory extends chatMemory_1.BaseChatMemory {
    customSummarizePrompt = null;
    customRefinedHistoryPrompt = null;
    fullChatsLength = 0;
    summarizedChatsLength = 3;
    latestRefinedUserChatHistory = '';
    latestRefinedChatbotChatHistory = '';
    llm = new chatModels_1.ChatOpenAI({
        streaming: false,
        temperature: 0,
        model: 'gpt-4',
        maxTokens: 1024
    });
    memoryPairCount() {
        const length = this.chatMemory.messages.length - 1;
        console.log(`7777777777777777 memoryPairCount ${length / 2}`);
        return length / 2;
    }
    getUserChatbotHistory() {
        let userChatbotHistory = '';
        for (const message of this.chatMemory.messages) {
            if (message instanceof schema_1.AIMessage) {
                userChatbotHistory += `chatbot: ${message.content}\n`;
            }
            else if (message instanceof schema_1.HumanMessage) {
                userChatbotHistory += `user: ${message.content}\n`;
            }
        }
        return userChatbotHistory;
    }
    memoryVariables() {
        return ['entities', this.chatHistoryKey];
    }
    loadMemoryVariables(inputs) {
        // Return history buffer
    }
    async generateSummary(chatbotOrUser, chatMessage) {
        const summaryTemplate = (0, defaultSummarizePrompt_1.getChatSummaryPrompt)(this.getUserChatbotHistory(), chatbotOrUser, chatMessage, this.customSummarizePrompt);
        const chain = new llmChain_1.LLMChain({
            llm: this.llm,
            prompt: summaryTemplate
        });
        return await chain.arun({});
    }
    async generateRefinedHistory(currentBriefChatHistory, chatbotOrUser, chatMessage) {
        await this.llm.agenerate((0, defaultRefinedHistoryPrompt_1.refineAndGetChatHistoryPrompt)(currentBriefChatHistory, this.getUserChatbotHistory(), chatbotOrUser, chatMessage, this.customRefinedHistoryPrompt));
    }
    async processMemory() {
        if (this.memoryPairCount() > this.fullChatsLength) {
            await this.asyncSummarizeLastMessages();
        }
    }
    async asyncSummarizeLastMessages() {
        const lastUserMessage = this.chatMemory.messages[this.chatMemory.messages.length - 2];
        const lastBotMessage = this.chatMemory.messages[this.chatMemory.messages.length - 1];
        console.log(`7777777777777777 999999999 ${lastUserMessage.content} ${lastBotMessage.content}`);
        const tasks = [
        // this.generateSummary('user', lastUserMessage.content),
        // this.generateSummary('chatbot', lastBotMessage.content)
        ];
        if (false && this.memoryPairCount() > this.summarizedChatsLength + this.fullChatsLength) {
            tasks.push(this.generateRefinedHistory(this.latestRefinedUserChatHistory, 'user', lastUserMessage), this.generateRefinedHistory(this.latestRefinedChatbotChatHistory, 'chatbot', lastBotMessage));
        }
        // const results = await Promise.all(tasks);
        // console.log(`7777XXXXXX ${results}`);
        // this.chatMemory.messages[this.chatMemory.messages.length - 2].content = results[0];
        // this.chatMemory.messages[this.chatMemory.messages.length - 1].content = results[1];
        if (this.memoryPairCount() > this.summarizedChatsLength + this.fullChatsLength) {
            // this.latestRefinedChatbotChatHistory = results[2][0].generations[0][0].text;
            // this.latestRefinedUserChatHistory = results[3][0].generations[0][0].text;
            console.log('7777XXXXXX REMOVING REMOVING REMOVING');
            this.chatMemory.messages = this.chatMemory.messages.slice(0, -2);
        }
    }
    addSystemMessage(message) {
        this.chatMemory.messages.push(message);
    }
    saveContext(inputs, outputs) {
        this.chatMemory.addUserMessage(inputs['input']);
        this.chatMemory.addAIMessage(outputs['output']);
    }
}
