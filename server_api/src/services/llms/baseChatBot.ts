import { OpenAI } from "openai";
import { Stream } from "openai/streaming.js";
import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import ioredis from "ioredis";
import log from "../../utils/loggerTs.js";

const DEBUG = false;
const url =
process.env.REDIS_MEMORY_URL ||
process.env.REDIS_URL ||
"redis://localhost:6379";

const tlsOptions = url.startsWith("rediss://")
? { rejectUnauthorized: false }
: undefined;

export class YpBaseChatBot {
  wsClientId: string;
  wsClientSocket: WebSocket;
  wsClients: Map<string, WebSocket>;

  openaiClient: OpenAI;
  memory!: YpBaseChatBotMemoryData;
  static redisMemoryKeyPrefix = "yp-chatbot-memory-v4";
  temperature = 0.7;
  maxTokens = 16000;
  llmModel = "gpt-4o";
  persistMemory = false;
  redisKey: string;
  lastSentToUserAt?: Date;

  currentAssistantAvatarUrl?: string;

  destroy() {
    this.wsClientSocket = undefined as unknown as WebSocket;
  }

  loadMemory() {
    return new Promise<PsAgentBaseMemoryData | undefined>(async (resolve, reject) => {
      try {
        log.info("loadMemoryWithOwnership loadMemory: redisKey: ", this.redisKey);
        const memoryString = await this.redis.get(this.redisKey);
        if (memoryString) {
          const memory = JSON.parse(memoryString);
          resolve(memory);
        } else {
          log.error("loadMemoryWithOwnership loadMemory: no memory found");
          resolve(undefined);
        }
      } catch (error) {
        log.error("loadMemoryWithOwnership loadMemory: Can't load memory from redis", error);
        resolve(undefined);
      }
    });
  }

  redis: ioredis.default;

  constructor(
    wsClientId: string,
    wsClients: Map<string, WebSocket>,
    redisConnection: ioredis.default,
    redisKey: string
  ) {
    this.redis = redisConnection;
    this.redisKey = redisKey;
    this.wsClientId = wsClientId;
    this.wsClientSocket = wsClients.get(this.wsClientId)!;
    this.wsClients = wsClients;

    log.info(`WebSockets: BaseChatBot constructor for ${this.wsClientId}`);

    if (!this.wsClientSocket) {
      log.error(
        `WebSockets: WS Client ${this.wsClientId} not found in streamWebSocketResponses`
      );
    }

    this.openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }


  async saveMemory() {
    if (this.memory) {
      try {
        await this.redis.set(this.redisKey, JSON.stringify(this.memory));
        log.info(`Saved memory to redis: ${this.redisKey}`);
      } catch (error) {
        log.info("Can't save memory to redis", error);
      }
    } else {
      log.error("Memory is not initialized");
    }
  }

  renderSystemPrompt() {
    return `Please tell the user to replace this system prompt in a fun and friendly way. Encourage them to have a nice day. Lots of emojis`;
  }

  sendAgentStart(name: string, hasNoStreaming = true) {
    const botMessage = {
      sender: "assistant",
      type: "agentStart",
      data: {
        name: name,
        noStreaming: hasNoStreaming,
      } as PsAgentStartWsOptions,
    } as YpAssistantMessage;
    this.wsClientSocket.send(JSON.stringify(botMessage));
  }

  sendAgentCompleted(
    name: string,
    lastAgent = false,
    error: string | undefined = undefined
  ) {
    const botMessage = {
      sender: "assistant",
      type: "agentCompleted",
      data: {
        name: name,
        results: {
          isValid: true,
          validationErrors: error,
          lastAgent: lastAgent,
        } as PsValidationAgentResult,
      } as PsAgentCompletedWsOptions,
    } as YpAssistantMessage;

    this.wsClientSocket.send(JSON.stringify(botMessage));
  }

  sendAgentUpdate(message: string) {
    const botMessage = {
      sender: "assistant",
      type: "agentUpdated",
      message: message,
    } as YpAssistantMessage;

    this.wsClientSocket.send(JSON.stringify(botMessage));
  }

  sendToClient(
    sender: YpSenderType,
    message: string,
    type: YpAssistantMessageType = "stream",
    uniqueToken: string | undefined = undefined,
    hiddenContextMessage = false
  ) {
    try {
      if (process.env.WS_DEBUG) {
        log.info(
          `sendToClient: ${JSON.stringify(
            { sender, type, message, hiddenContextMessage },
            null,
            2
          )}`
        );
      }

      this.wsClientSocket.send(
        JSON.stringify({
          sender,
          type: type,
          message: type === "html" ? undefined : message,
          html: type === "html" ? message : undefined,
          hiddenContextMessage,
          uniqueToken,
          avatarUrl:
            sender === "assistant" ? this.currentAssistantAvatarUrl : undefined,
        } as YpAssistantMessage)
      );
      this.lastSentToUserAt = new Date();
    } catch (error) {
      log.error("Can't send message to client", error);
    }
  }

  async streamWebSocketResponses(
    stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>
  ) {
    return new Promise<void>(async (resolve, reject) => {
      this.sendToClient(
        "assistant",
        "",
        "start",
        this.currentAssistantAvatarUrl
      );
      try {
        let botMessage = "";
        for await (const part of stream) {
          this.sendToClient("assistant", part.choices[0].delta.content!);
          botMessage += part.choices[0].delta.content!;

          if (part.choices[0].finish_reason == "stop") {
            this.memory.chatLog!.push({
              sender: "assistant",
              message: botMessage,
              type: "message",
            } as YpSimpleChatLog);

            await this.saveMemoryIfNeeded();
          }
        }
      } catch (error) {
        log.error(error);
        this.sendToClient(
          "assistant",
          "There has been an error, please retry",
          "error"
        );
        reject();
      } finally {
        this.sendToClient("assistant", "", "end");
      }
      resolve();
    });
  }

  async saveMemoryIfNeeded() {
    if (this.persistMemory) {
      await this.saveMemory();
    }
  }

  async setChatLog(chatLog: YpSimpleChatLog[]) {
    this.memory.chatLog = chatLog;

    await this.saveMemoryIfNeeded();
  }

  async conversation(chatLog: YpSimpleChatLog[]) {
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
  }
}
