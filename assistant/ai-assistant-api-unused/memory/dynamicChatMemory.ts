import { ABC } from 'abc';
import { Any, Dict, List, Optional } from 'typing';

import { refineAndGetChatHistoryPrompt } from 'memory/defaultRefinedHistoryPrompt';
import { getChatSummaryPrompt } from 'memory/defaultSummarizePrompt';
import { BaseModel, Field } from 'pydantic';
import { ChatPromptTemplate, SystemMessagePromptTemplate, AIMessagePromptTemplate, HumanMessagePromptTemplate } from 'prompts/chat';
import { AIMessage, BaseMemory, BaseMessage, HumanMessage } from 'schema';
import { LLMChain } from 'chains/llmChain';
import { ChatOpenAI } from 'chatModels';
import { BaseChatMemory, ChatMessageHistory } from 'memory/chatMemory';
import { OpenAI } from 'llms';

class DynamicChatMemory extends BaseChatMemory {
  customSummarizePrompt: ChatPromptTemplate = null;
  customRefinedHistoryPrompt: ChatPromptTemplate = null;
  fullChatsLength = 0;
  summarizedChatsLength = 3;
  latestRefinedUserChatHistory: string = '';
  latestRefinedChatbotChatHistory: string = '';

  llm = new ChatOpenAI({
    streaming: false,
    temperature: 0,
    model: 'gpt-4',
    maxTokens: 1024
  });

  memoryPairCount(): number {
    const length = this.chatMemory.messages.length - 1;
    console.log(`7777777777777777 memoryPairCount ${length / 2}`);
    return length / 2;
  }

  getUserChatbotHistory(): string {
    let userChatbotHistory = '';
    for (const message of this.chatMemory.messages) {
      if (message instanceof AIMessage) {
        userChatbotHistory += `chatbot: ${message.content}\n`;
      } else if (message instanceof HumanMessage) {
        userChatbotHistory += `user: ${message.content}\n`;
      }
    }
    return userChatbotHistory;
  }

  memoryVariables(): string[] {
    return ['entities', this.chatHistoryKey];
  }

  loadMemoryVariables(inputs: Dict<string, Any>): Dict<string, Any> {
    // Return history buffer
  }

  async generateSummary(chatbotOrUser: string, chatMessage: string): Promise<any> {
    const summaryTemplate = getChatSummaryPrompt(
      this.getUserChatbotHistory(),
      chatbotOrUser,
      chatMessage,
      this.customSummarizePrompt
    );

    const chain = new LLMChain({
      llm: this.llm,
      prompt: summaryTemplate
    });

    return await chain.arun({});
  }

  async generateRefinedHistory(currentBriefChatHistory: string, chatbotOrUser: string, chatMessage: string): Promise<void> {
    await this.llm.agenerate(
      refineAndGetChatHistoryPrompt(
        currentBriefChatHistory,
        this.getUserChatbotHistory(),
        chatbotOrUser,
        chatMessage,
        this.customRefinedHistoryPrompt
      )
    );
  }

  async processMemory(): Promise<void> {
    if (this.memoryPairCount() > this.fullChatsLength) {
      await this.asyncSummarizeLastMessages();
    }
  }

  async asyncSummarizeLastMessages(): Promise<void> {
    const lastUserMessage = this.chatMemory.messages[this.chatMemory.messages.length - 2];
    const lastBotMessage = this.chatMemory.messages[this.chatMemory.messages.length - 1];
    console.log(`7777777777777777 999999999 ${lastUserMessage.content} ${lastBotMessage.content}`);

    const tasks = [
      // this.generateSummary('user', lastUserMessage.content),
      // this.generateSummary('chatbot', lastBotMessage.content)
    ];

    if (false && this.memoryPairCount() > this.summarizedChatsLength + this.fullChatsLength) {
      tasks.push(
        this.generateRefinedHistory(this.latestRefinedUserChatHistory, 'user', lastUserMessage),
        this.generateRefinedHistory(this.latestRefinedChatbotChatHistory, 'chatbot', lastBotMessage)
      );
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

  addSystemMessage(message: string): void {
    this.chatMemory.messages.push(message);
  }

  saveContext(inputs: Dict<string, Any>, outputs: Dict<string, string>): void {
    this.chatMemory.addUserMessage(inputs['input']);
    this.chatMemory.addAIMessage(outputs['output']);
  }
}