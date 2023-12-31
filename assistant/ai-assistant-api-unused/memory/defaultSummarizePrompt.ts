import { PromptTemplate } from 'langchain';
import { ConditionalPromptSelector, isChatModel } from 'langchain.chains.prompt_selector';
import { ChatPromptTemplate, SystemMessagePromptTemplate, AIMessagePromptTemplate, HumanMessagePromptTemplate } from 'langchain.prompts.chat';

const defaultSystemTemplate: string = `Your are an advanced text summarizer. You think things through.`;

const defaultChatSummaryTemplate: string = `Please summarize the chat message below, keep the summary very short and relevant to the chat history. Make sure all entities are mentioned in the summary.
You always talk about ideas you are summarizing not Chatbot suggests". Those are ideas from people who submitted them.

Shortened chat history:
{shortened_chat_history}

Is the summary for user or chatbot: {user_or_chatbot}

Chat message to summarize: {chat_message}`;

const defaultChatSummaryPrompt: PromptTemplate = new PromptTemplate(
  defaultChatSummaryTemplate,
  ["shortened_chat_history", "user_or_chatbot", "chat_message"]
);

function getChatSummaryPrompt(
  shortened_chat_history: string,
  user_or_chatbot: string,
  chat_message: string,
  summary_prompt: PromptTemplate | null,
  system_template: string = defaultSystemTemplate
): ChatPromptTemplate {
  if (summary_prompt === null) {
    summary_prompt = defaultChatSummaryPrompt;
  }
  console.log(`7777777777777777 1 ${shortened_chat_history}`);
  console.log(`7777777777777777 2 ${user_or_chatbot}`);
  console.log(`7777777777777777 3 ${chat_message}`);
  console.log(`7777777777777777 4 ${summary_prompt}`);
  console.log(`7777777777777777 5 ${system_template}`);

  const messages = [
    SystemMessagePromptTemplate.fromTemplate(system_template),
    HumanMessagePromptTemplate.fromTemplate(summary_prompt.format({
      shortened_chat_history: shortened_chat_history,
      user_or_chatbot: user_or_chatbot,
      chat_message: chat_message
    }))
  ];

  return ChatPromptTemplate.fromMessages(messages);
}