import { YpBaseChatBot } from "active-citizen/llms/baseChatBot.js";
import { OpenAI } from "openai";
import { Stream } from "openai/streaming.js";
import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import ioredis from "ioredis";
import {
  type ChatCompletionMessageParam,
  type ChatCompletionCreateParams,
  ChatCompletionTool
} from "openai/resources/chat/completions";
import { FunctionDefinition } from "openai/resources/shared.mjs";

export interface ChatbotFunction {
  name: string;
  description: string;
  parameters: FunctionDefinition['parameters'];
  handler: (params: any) => Promise<void>;
}

interface ToolCall {
  id: string;
  name: string;
  arguments: string;
}

interface ChatbotMode {
  name: string;
  systemPrompt: string;
  functions: ChatbotFunction[];
  description: string;
  routingRules?: string[]; // Hints for the LLM to detect this mode
}

interface YpBaseAssistantMemoryData extends YpBaseChatBotMemoryData {
  currentMode?: string;
  modeData?: Record<string, any>;
}

export abstract class YpBaseAssistant extends YpBaseChatBot {
  wsClientId: string;
  wsClientSocket: WebSocket;
  openaiClient: OpenAI;
  memory!: YpBaseAssistantMemoryData;
  protected modes: Map<string, ChatbotMode> = new Map();
  protected availableFunctions: Map<string, ChatbotFunction> = new Map();

  modelName = "gpt-4o";

  constructor(wsClientId: string, wsClients: Map<string, WebSocket>) {
    super(wsClientId, wsClients);
    this.wsClientId = wsClientId;
    this.wsClientSocket = wsClients.get(this.wsClientId)!;
    this.openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.initializeModes();
    this.registerCoreFunctions();
  }

  /**
   * Abstract method that subclasses must implement to define their modes
   * This is where all the mode-specific configuration happens
   */
  protected abstract defineAvailableModes(): ChatbotMode[];

  /**
   * Initialize modes from subclass definitions
   */
  private initializeModes(): void {
    const modes = this.defineAvailableModes();

    for (const mode of modes) {
      this.modes.set(mode.name, mode);

      // Register mode's functions
      for (const func of mode.functions) {
        this.availableFunctions.set(func.name, func);
      }
    }

    // Set initial mode if none exists
    if (!this.memory.currentMode && modes.length > 0) {
      this.memory.currentMode = modes[0].name;
    }
  }

  protected convertToOpenAIMessages(chatLog: PsSimpleChatLog[]): ChatCompletionMessageParam[] {
    return chatLog.map(message => ({
      role: message.sender === "bot" ? "assistant" : "user",
      content: message.message,
    })) as ChatCompletionMessageParam[];
  }

  /**
   * Register core functions available in all modes
   */
  private registerCoreFunctions(): void {
    const switchModeFunction: ChatbotFunction = {
      name: 'switch_mode',
      description: 'Switch to a different conversation mode',
      parameters: {
        type: 'object',
        properties: {
          mode: {
            type: 'string',
            enum: Array.from(this.modes.keys())
          },
          reason: { type: 'string' }
        },
        required: ['mode']
      },
      handler: async (params) => {
        await this.handleModeSwitch(params.mode, params.reason);
      }
    };

    this.availableFunctions.set(switchModeFunction.name, switchModeFunction);
  }

  /**
   * Get current mode's functions
   */
  protected getCurrentModeFunctions(): ChatbotFunction[] {
    const currentMode = this.modes.get(this.memory.currentMode!);
    if (!currentMode) return [];

    // Combine mode-specific functions with core functions
    return [
      ...currentMode.functions,
      this.availableFunctions.get('switch_mode')!
    ];
  }

  /**
   * Get current mode's system prompt
   */
  protected getCurrentSystemPrompt(): string {
    const currentMode = this.modes.get(this.memory.currentMode!);
    if (!currentMode) return 'You are a helpful assistant.';

    return currentMode.systemPrompt;
  }

  /**
   * Handle mode switching
   */
  private async handleModeSwitch(newMode: string, reason?: string): Promise<void> {
    if (!this.modes.has(newMode)) {
      throw new Error(`Invalid mode: ${newMode}`);
    }

    const oldMode = this.memory.currentMode;
    this.memory.currentMode = newMode;

    // Clear mode-specific data when changing modes
    this.memory.modeData = {};

    await this.saveMemory();

    this.sendToClient(
      "bot",
      `Switching from ${oldMode} to ${newMode}${reason ? ': ' + reason : ''}`
    );
  }

  /**
   * Handle streaming responses and function calls that may come in chunks
   */
  async streamWebSocketResponses(
  stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>
) {
  return new Promise<void>(async (resolve, reject) => {
    this.sendToClient("bot", "", "start");
    try {
      let botMessage = "";
      const toolCalls = new Map<string, ToolCall>();

      for await (const part of stream) {
        if (!part.choices?.[0]?.delta) {
          console.error("Unexpected response format:", JSON.stringify(part));
          continue;
        }

        const delta = part.choices[0].delta;

        if ('tool_calls' in delta && delta.tool_calls) {
          // Handle tool calls
          for (const toolCall of delta.tool_calls) {
            if (toolCall.id) {
              if (!toolCalls.has(toolCall.id)) {
                toolCalls.set(toolCall.id, {
                id: toolCall.id,
                name: toolCall.function?.name ?? '',  // Use nullish coalescing
                  arguments: toolCall.function?.arguments ?? ''  // Use nullish coalescing
                });
              } else {
                const existingCall = toolCalls.get(toolCall.id)!;
              if (toolCall.function?.name) {
                existingCall.name = existingCall.name + toolCall.function.name;
              }
              if (toolCall.function?.arguments) {
                existingCall.arguments = existingCall.arguments + toolCall.function.arguments;
                }
              }
            } else {
              console.error("Tool call ID is missing:", toolCall);
            }
          }
        } else if ('content' in delta && delta.content) {
          // Handle regular message streaming
          const content = delta.content ?? '';  // Use nullish coalescing
          this.sendToClient("bot", content);
          botMessage += content;
        }

        // Rest of the code remains the same...
      }
    } catch (error) {
      console.error("Stream processing error:", error);
      this.sendToClient("bot", "There has been an error, please retry", "error");
      reject(error);
    } finally {
      this.sendToClient("bot", "", "end");
      resolve();
    }
  });
}

  /**
   * Main conversation handler with updated function handling
   */
  async conversation(chatLog: PsSimpleChatLog[]) {
    await this.setChatLog(chatLog);

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: this.getCurrentSystemPrompt()
      },
      ...this.convertToOpenAIMessages(chatLog)
    ];

    try {
      // Convert functions to tools format
      const tools: ChatCompletionTool[] = this.getCurrentModeFunctions().map(f => ({
        type: 'function',
        function: {
          name: f.name,
          description: f.description,
          parameters: f.parameters,
        }
      }));

      const stream = await this.openaiClient.chat.completions.create({
        model: this.modelName,
        messages,
        tools,
        tool_choice: 'auto',
        stream: true,
      });

      await this.streamWebSocketResponses(stream);
    } catch (error) {
      console.error("Error in conversation:", error);
      this.sendToClient("bot", "Error processing request", "error");
    }
  }

}