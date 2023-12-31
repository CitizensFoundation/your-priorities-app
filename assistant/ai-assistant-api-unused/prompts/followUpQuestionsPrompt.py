import { PromptTemplate } from 'langchain';
import { ConditionalPromptSelector, isChatModel } from 'langchain.chains.prompt_selector';
import { ChatPromptTemplate, SystemMessagePromptTemplate, AIMessagePromptTemplate, HumanMessagePromptTemplate } from 'langchain.prompts.chat';

function getFollowUpQuestionsPrompt(lastQuestion: string, lastAiAnswer: string, configuration: any): ChatPromptTemplate {
  const systemPrompt = configuration.prompts.followUps.system;
  const prompt = configuration.prompts.followUps.prompt;

  const messages = [
    SystemMessagePromptTemplate.fromTemplate(systemPrompt),
    HumanMessagePromptTemplate.fromTemplate(lastQuestion),
    AIMessagePromptTemplate.fromTemplate(lastAiAnswer),
    HumanMessagePromptTemplate.fromTemplate(prompt),
  ];

  return ChatPromptTemplate.fromMessages(messages);
}