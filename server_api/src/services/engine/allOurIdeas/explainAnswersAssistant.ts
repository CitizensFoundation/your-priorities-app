import { OpenAI } from "openai";
import { Stream } from "openai/streaming";
import { WebSocket } from "ws";

import { YpBaseChatBot } from "../../llms/baseChatBot.js";
import { url } from "inspector";
import ioredis from "ioredis";
import { v4 as uuidv4 } from "uuid";
const tlsOptions = process.env.REDIS_MEMORY_URL?.startsWith("rediss://")
  ? { rejectUnauthorized: false }
  : undefined;

export class ExplainAnswersAssistant extends YpBaseChatBot {
  openaiClient: OpenAI;
  modelName = "gpt-4o";
  maxTokens = 4000;
  temperature = 0.8;
  languageName: string;

  constructor(
    wsClientId: string,
    wsClients: Map<string, WebSocket>,
    languageName: string
  ) {
    const redisConnection = new ioredis.default(
      process.env.REDIS_MEMORY_URL ||
        process.env.REDIS_URL ||
        "redis://localhost:6379",
      {
        tls: tlsOptions,
      }
    );
    super(
      wsClientId,
      wsClients,
      redisConnection,
      `${
        YpBaseChatBot.redisMemoryKeyPrefix
      }-${uuidv4()}-explain-answers-assistant`
    );

    this.languageName = languageName;
    this.openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  renderSystemPrompt() {
    return `The user is doing pairwise voting on two answers at the time, to a question, the user needs help deciding what to vote on.

Instructions:
Use a relevant emoji for the first and second answers.
Use thumbs emojis for pros and thumb down emjoi for cons
Use summary emoji for summary.
Use simple and upbeat language.
Ask the user clarifying questions if needed.
Always answers in the language the user asks for.

Output:
* Each answer
-- One short paragraph, max three sentences, explanation in a very simple language
-- The top pro and con
-- If this is likely to be a root cause of the problem set out in the question
* Never offer the user your opinion as we don't want to influence the user, they must make their own decision.
* Always output in this language: ${this.languageName}
`;
  }

  explainConversation = async (chatLog: YpSimpleChatLog[]) => {
    this.setChatLog(chatLog);

    let messages: any[] = chatLog.map((message: YpSimpleChatLog) => {
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
      temperature: this.temperature,
      stream: true,
    });

    this.streamWebSocketResponses(stream);
  };
}
