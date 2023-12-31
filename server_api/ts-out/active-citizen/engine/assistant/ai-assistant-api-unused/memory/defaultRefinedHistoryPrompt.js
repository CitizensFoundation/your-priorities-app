"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const langchain_1 = require("langchain");
const langchain_prompts_chat_1 = require("langchain.prompts.chat");
const defaultSystemTemplate = `Your are an advanced compact chat history creator, your are the best in the business and you never don't mistakes. You think things through.`;
const defaultChatHistoryTemplate = `Please refine the current chat history with the new chat message provided below. Make sure all entities are mentioned in the chat history. Keep the history very short.

Full chat history:
{full_chat_history}

Is the summary for user or chatbot: {user_or_chatbot}

Current refined chat history: {current_brief_chat_history}

New chat message: {chat_message}`;
const defaultChatHistoryPrompt = new langchain_1.PromptTemplate(defaultChatHistoryTemplate, ["full_chat_history", "user_or_chatbot", "current_brief_chat_history", "chat_message"]);
function refineAndGetChatHistoryPrompt(currentBriefChatHistory, chatMessage, chatHistory, userOrChatbot, chatHistoryPrompt = defaultChatHistoryPrompt, systemTemplate = defaultSystemTemplate) {
    const messages = [
        new langchain_prompts_chat_1.SystemMessagePromptTemplate(systemTemplate),
        new langchain_prompts_chat_1.HumanMessagePromptTemplate(chatHistoryPrompt.format({
            chat_history: chatHistory,
            user_or_chatbot: userOrChatbot,
            chat_message: chatMessage,
            current_brief_chat_history: currentBriefChatHistory
        }))
    ];
    return new langchain_prompts_chat_1.ChatPromptTemplate(messages);
}
