import { PromptTemplate } from 'langchain';
import { ConditionalPromptSelector, isChatModel } from 'langchain.chains.prompt_selector';
import { ChatPromptTemplate, SystemMessagePromptTemplate, AIMessagePromptTemplate, HumanMessagePromptTemplate } from 'langchain.prompts.chat';

const defaultSystemTemplate: string = `Your are an advanced compact chat history creator, your are the best in the business and you never don't mistakes. You think things through.`;

const defaultChatHistoryTemplate: string = `Please refine the current chat history with the new chat message provided below. Make sure all entities are mentioned in the chat history. Keep the history very short.

Full chat history:
{full_chat_history}

Is the summary for user or chatbot: {user_or_chatbot}

Current refined chat history: {current_brief_chat_history}

New chat message: {chat_message}`;

const defaultChatHistoryPrompt: PromptTemplate = new PromptTemplate(
  defaultChatHistoryTemplate,
  ["full_chat_history", "user_or_chatbot", "current_brief_chat_history", "chat_message"]
);

function refineAndGetChatHistoryPrompt(
  currentBriefChatHistory: string,
  chatMessage: string,
  chatHistory: string,
  userOrChatbot: string,
  chatHistoryPrompt: PromptTemplate = defaultChatHistoryPrompt,
  systemTemplate: string = defaultSystemTemplate
): ChatPromptTemplate {
  const messages: ChatPromptTemplate[] = [
    new SystemMessagePromptTemplate(systemTemplate),
    new HumanMessagePromptTemplate(chatHistoryPrompt.format({
      chat_history: chatHistory,
      user_or_chatbot: userOrChatbot,
      chat_message: chatMessage,
      current_brief_chat_history: currentBriefChatHistory
    }))
  ];

  return new ChatPromptTemplate(messages);
}