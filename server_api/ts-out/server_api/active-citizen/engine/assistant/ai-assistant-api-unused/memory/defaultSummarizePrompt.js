"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const langchain_1 = require("langchain");
const langchain_prompts_chat_1 = require("langchain.prompts.chat");
const defaultSystemTemplate = `Your are an advanced text summarizer. You think things through.`;
const defaultChatSummaryTemplate = `Please summarize the chat message below, keep the summary very short and relevant to the chat history. Make sure all entities are mentioned in the summary.
You always talk about ideas you are summarizing not Chatbot suggests". Those are ideas from people who submitted them.

Shortened chat history:
{shortened_chat_history}

Is the summary for user or chatbot: {user_or_chatbot}

Chat message to summarize: {chat_message}`;
const defaultChatSummaryPrompt = new langchain_1.PromptTemplate(defaultChatSummaryTemplate, ["shortened_chat_history", "user_or_chatbot", "chat_message"]);
function getChatSummaryPrompt(shortened_chat_history, user_or_chatbot, chat_message, summary_prompt, system_template = defaultSystemTemplate) {
    if (summary_prompt === null) {
        summary_prompt = defaultChatSummaryPrompt;
    }
    console.log(`7777777777777777 1 ${shortened_chat_history}`);
    console.log(`7777777777777777 2 ${user_or_chatbot}`);
    console.log(`7777777777777777 3 ${chat_message}`);
    console.log(`7777777777777777 4 ${summary_prompt}`);
    console.log(`7777777777777777 5 ${system_template}`);
    const messages = [
        langchain_prompts_chat_1.SystemMessagePromptTemplate.fromTemplate(system_template),
        langchain_prompts_chat_1.HumanMessagePromptTemplate.fromTemplate(summary_prompt.format({
            shortened_chat_history: shortened_chat_history,
            user_or_chatbot: user_or_chatbot,
            chat_message: chat_message
        }))
    ];
    return langchain_prompts_chat_1.ChatPromptTemplate.fromMessages(messages);
}
