import { OpenAI } from "openai";
import { Stream } from "openai/streaming.js";
import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import ioredis from "ioredis";
import {
  type ChatCompletionMessageParam,
  type ChatCompletionCreateParams,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
import { FunctionDefinition } from "openai/resources/shared.mjs";
import { YpBaseChatBot } from "../../active-citizen/llms/baseChatBot.js";


const DEBUG = false;

export interface ToolExecutionResult<T = unknown> {
  success: boolean;
  data?: T;
  html?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Enhanced ChatbotFunction interface with result type
 */
export interface ChatbotFunction {
  name: string;
  description: string;
  type?: string;
  parameters: FunctionDefinition["parameters"];
  handler: (params: any) => Promise<ToolExecutionResult>;
  resultSchema?: FunctionDefinition["parameters"]; // Schema for the result data
}

/**
 * Message format for tool results
 */
interface ToolResponseMessage {
  role: "tool";
  content: string;
  tool_call_id: string;
  name: string;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: string;
  startTime?: number; // For timeout tracking
}

export interface AssistantModeData<T = unknown> {
  type: string;
  data: T;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/**
 * Common modes that implementations might use
 */
export enum CommonModes {
  ErrorRecovery = "error_recovery",
}

export interface ChatbotMode {
  name: string;
  systemPrompt: string;
  functions: ChatbotFunction[];
  description: string;
  routingRules?: string[];
  allowedTransitions?: string[]; // Allowed next modes
  cleanup?: () => Promise<void>; // Cleanup function
}

interface YpBaseAssistantMemoryData extends YpBaseChatBotMemoryData {
  redisKey: string;
  currentMode?: string;
  modeData?: AssistantModeData;
  modeHistory?: Array<{
    mode: string;
    timestamp: number;
    reason?: string;
  }>;
}

export abstract class YpBaseAssistant extends YpBaseChatBot {
  wsClientId: string;
  wsClientSocket: WebSocket;
  wsClients: Map<string, WebSocket>;
  openaiClient: OpenAI;
  memory!: YpBaseAssistantMemoryData;
  protected modes: Map<string, ChatbotMode> = new Map();
  protected availableFunctions: Map<string, ChatbotFunction> = new Map();
  protected toolCallTimeout = 30000; // 30 seconds
  protected maxModeTransitions = 10; // Prevent infinite mode transitions

  redis: ioredis.Redis;

  modelName = "gpt-4o";

  constructor(
    wsClientId: string,
    wsClients: Map<string, WebSocket>,
    redis: ioredis.Redis
  ) {
    super(wsClientId, wsClients);
    this.redis = redis;
    this.wsClientId = wsClientId;
    this.wsClientSocket = wsClients.get(this.wsClientId)!;
    this.wsClients = wsClients;
    this.openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.initializeModes();
    this.registerCoreFunctions();
  }

  /**
   * Convert tool result to message format
   */
  protected convertToolResultToMessage(
    toolCall: ToolCall,
    result: ToolExecutionResult
  ): ToolResponseMessage {
    if (DEBUG) {
      console.log(`convertToolResultToMessage: ${JSON.stringify(toolCall, null, 2)}`);
    }
    return {
      role: "tool",
      content: JSON.stringify(result.data),
      tool_call_id: toolCall.id,
      name: toolCall.name,
    };
  }


  /**
   * Handle executing tool calls with results
   */
  async handleToolCalls(
    toolCalls: Map<string, ToolCall>
  ): Promise<void> {
    if (DEBUG) {
      console.log(`====================================> handleToolCalls: ${JSON.stringify(Array.from(toolCalls.values()), null, 2)}`);
    }
    const toolResponses: ToolResponseMessage[] = [];

    for (const toolCall of toolCalls.values()) {
      try {
        const func = this.availableFunctions.get(toolCall.name);
        if (!func) {
          throw new Error(`Unknown function: ${toolCall.name}`);
        }

        let parsedArgs;
        try {
          parsedArgs = JSON.parse(toolCall.arguments);
        } catch (e) {
          throw new Error(`Invalid function arguments: ${toolCall.arguments}`);
        }

        // Execute the function and get result
        const result = await func.handler(parsedArgs);
        if (DEBUG) {
          console.log(`----------------------------------> Tool execution result:`, JSON.stringify(result, null, 2));
        }

        // Store the result in memory for context
        if (result.success && result.data) {
          await this.setModeData(`${toolCall.name}_result`, result.data);
        }

        // Convert result to message
        const responseMessage = this.convertToolResultToMessage(
          toolCall,
          result
        );
        toolResponses.push(responseMessage);

        // Generate a user-friendly message based on the tool result
        const resultMessage = `<contextFromRetrievedData>${JSON.stringify(result.data, null, 2)}</contextFromRetrievedData>`;
        if (result.data) {
          this.sendToClient("bot", resultMessage, "hiddenContextMessage", true);
          this.memory.chatLog!.push({
            sender: "bot",
            hiddenContextMessage: true,
            message: resultMessage,
          });
          await this.saveMemoryIfNeeded();
        } else {
          console.error(`No data returned from tool execution: ${toolCall.name}`);
        }

        if (result.html) {
          this.sendToClient("bot", result.html, "html", true);
        }

        // If error, throw it after recording the result
        if (!result.success) {
          throw new Error(result.error || "Unknown error in tool execution");
        }
      } catch (error) {
        console.error(`Error executing tool ${toolCall.name}:`, error);
        throw error;
      }
    }

    // Create a new completion with tool results
    if (toolResponses.length > 0) {
      await this.handleToolResponses(toolResponses);
    }
  }

  /**
   * Handle tool responses by creating a new completion
   */
  async handleToolResponses(
    toolResponses: ToolResponseMessage[]
  ): Promise<void> {
    if (DEBUG) {
      console.log(`handleToolResponses: ${JSON.stringify(toolResponses, null, 2)}`);
    }
    // Get existing chat messages
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: this.getCurrentSystemPrompt(),
      },
      ...this.convertToOpenAIMessages(this.memory.chatLog || []),
      {
        role: "assistant",
        content: null,
        tool_calls: Array.from(toolResponses.values()).map(response => ({
          id: response.tool_call_id,
          type: "function",
          function: {
            name: response.name,
            arguments: "{}" // The actual arguments don't matter here
          }
        }))
      },
      ...toolResponses,
    ];

    try {
      const stream = await this.openaiClient.chat.completions.create({
        model: this.modelName,
        messages,
        tools: this.getCurrentModeFunctions().map((f) => ({
          type: "function",
          function: {
            name: f.name,
            description: f.description,
            parameters: f.parameters,
          },
        })),
        tool_choice: "auto",
        stream: true,
      });

      await this.streamWebSocketResponses(stream);
    } catch (error) {
      console.error("Error handling tool responses:", error);
      throw error;
    }
  }

  /**
   * Abstract method that subclasses must implement to define their modes
   */
  abstract defineAvailableModes(): ChatbotMode[];

  /**
   * Initialize modes from subclass definitions
   */
  initializeModes(): void {
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

  /**
   * Register core functions available in all modes
   */
  registerCoreFunctions(): void {
    const switchModeFunction: ChatbotFunction = {
      name: "switch_mode",
      type: "function",
      description: "Switch to a different conversation mode. Never switch to and from the same mode.",
      parameters: {
        type: "object",
        properties: {
          mode: {
            type: "string",
            enum: Array.from(this.modes.keys()),
          },
          reason: { type: "string" },
        },
        required: ["mode"],
      },

      /*resultSchema: {
        type: "object",
        properties: {
          previousMode: { type: "string" },
          newMode: { type: "string" },
          timestamp: { type: "string" },
          transitionReason: { type: "string" },
        },
      },*/
      handler: async (params): Promise<ToolExecutionResult> => {
        try {
          const previousMode = this.memory.currentMode;
          await this.handleModeSwitch(params.mode, params.reason);

          return {
            success: true,
            data: {
              previousMode,
              newMode: params.mode,
              timestamp: new Date().toISOString(),
              transitionReason: params.reason || "No reason provided",
            },
            metadata: {
              modeHistoryLength: this.memory.modeHistory?.length || 0,
            },
          };
        } catch (error) {
          return {
            success: false,
            error:
              error instanceof Error ? error.message : "Failed to switch mode",
            metadata: {
              attemptedMode: params.mode,
              currentMode: this.memory.currentMode,
            },
          };
        }
      },
    };

    this.availableFunctions.set(switchModeFunction.name, switchModeFunction);
  }

  /**
   * Get current mode's functions
   */
  getCurrentModeFunctions(): ChatbotFunction[] {
    const currentMode = this.modes.get(this.memory.currentMode!);
    if (!currentMode) return [];

    // Combine mode-specific functions with core functions
    return [
      ...currentMode.functions,
      this.availableFunctions.get("switch_mode")!,
    ];
  }

  /**
   * Get current mode's system prompt
   */
  getCurrentSystemPrompt(): string {
    const currentMode = this.modes.get(this.memory.currentMode!);
    if (!currentMode) return "You are a helpful assistant.";

    return currentMode.systemPrompt;
  }

  /**
   * Validate mode transition
   */
  protected validateModeTransition(fromMode: string, toMode: string): boolean {
    const currentMode = this.modes.get(fromMode);
    if (!currentMode) return false;

    // Check if transition is allowed
    if (
      currentMode.allowedTransitions &&
      !currentMode.allowedTransitions.includes(toMode)
    ) {
      return false;
    }

    // Check for maximum transitions
    const transitionCount = this.memory.modeHistory?.length ?? 0;
    if (transitionCount >= this.maxModeTransitions) {
      return false;
    }

    return true;
  }

  /**
   * Clean up mode-specific resources
   */
  protected async cleanupMode(mode: string): Promise<void> {
    const modeConfig = this.modes.get(mode);
    if (modeConfig?.cleanup) {
      await modeConfig.cleanup();
    }

    // Archive mode data if needed
    if (this.memory.modeData) {
      const archiveKey = `mode_data_archive:${this.memory.redisKey}:${mode}`;
      await this.redis.set(archiveKey, JSON.stringify(this.memory.modeData));
    }
  }

  /**
   * Set mode data with type safety
   */
  async setModeData<T>(type: string, data: T): Promise<void> {
    this.memory.modeData = {
      type,
      data,
      timestamp: Date.now(),
    };
    await this.saveMemory();
  }

  /**
   * Get mode data with type safety
   */
  protected getModeData<T>(): T | undefined {
    return this.memory.modeData?.data as T | undefined;
  }

  /**
   * Main conversation handler with updated function handling
   */
  async conversation(chatLog: PsSimpleChatLog[]) {
    await this.setChatLog(chatLog);

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: this.getCurrentSystemPrompt(),
      },
      ...this.convertToOpenAIMessages(chatLog),
    ];

    try {
      // Convert functions to tools format
      const tools: ChatCompletionTool[] = this.getCurrentModeFunctions().map(
        (f) => ({
          type: "function",
          function: {
            name: f.name,
            description: f.description,
            parameters: f.parameters,
          },
        })
      );

      const stream = await this.openaiClient.chat.completions.create({
        model: this.modelName,
        messages,
        tools,
        tool_choice: "auto",
        stream: true,
      });

      await this.streamWebSocketResponses(stream);
    } catch (error) {
      console.error("Error in conversation:", error);
      this.sendToClient("bot", "Error processing request", "error");
    }
  }

  /**
   * Convert chat log to OpenAI message format
   */
  protected convertToOpenAIMessages(
    chatLog: PsSimpleChatLog[]
  ): ChatCompletionMessageParam[] {
    return chatLog.map((message) => ({
      role: message.sender === "bot" ? "assistant" : "user",
      content: message.message,
    })) as ChatCompletionMessageParam[];
  }

  /**
   * Handle mode switching
   */
  async handleModeSwitch(
    newMode: string,
    reason?: string
  ): Promise<void> {
    if (DEBUG) {
      console.log(`handleModeSwitch: ${newMode}${reason ? ": " + reason : ""}`);
    }
    const oldMode = this.memory.currentMode;

    if (!this.modes.has(newMode)) {
      throw new Error(`Invalid mode: ${newMode}`);
    }

    if (oldMode === newMode) {
      console.error(`Trying to switch to the same mode: ${oldMode} to ${newMode}`);
      return;
    }
    if (oldMode && !this.validateModeTransition(oldMode, newMode)) {
      throw new Error(`Invalid mode transition from ${oldMode} to ${newMode}`);
    }

    // Perform cleanup of old mode
    if (oldMode) {
      await this.cleanupMode(oldMode);
    }

    // Update mode history
    if (!this.memory.modeHistory) {
      this.memory.modeHistory = [];
    }
    this.memory.modeHistory.push({
      mode: newMode,
      timestamp: Date.now(),
      reason,
    });

    this.memory.currentMode = newMode;
    this.memory.modeData = undefined; // Clear mode data

    await this.saveMemory();

    this.sendToClient(
      "bot",
      `Switching from ${oldMode} to ${newMode}${reason ? ": " + reason : ""}`
    );
  }

  /**
   * Handle streaming responses and function calls with comprehensive debugging
   */
  async streamWebSocketResponses(
    stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>
  ) {
    return new Promise<void>(async (resolve, reject) => {
      if (DEBUG) console.log("Starting streamWebSocketResponses");
      this.sendToClient("bot", "", "start");

      try {
        let botMessage = "";
        const toolCalls = new Map<string, ToolCall>();
        const toolCallArguments = new Map<string, string>();
        let currentToolCallId: string | null = null;

        for await (const part of stream) {
          if (DEBUG) {
            console.log("Received stream part:", JSON.stringify(part, null, 2));
          }

          if (!part.choices?.[0]?.delta) {
            if (DEBUG) console.log("Skipping invalid stream part - no choices or delta");
            continue;
          }

          const delta = part.choices[0].delta;
          if (DEBUG) {
            console.log("Processing delta:", JSON.stringify(delta, null, 2));
          }

          if ("tool_calls" in delta && delta.tool_calls) {
            if (DEBUG) console.log("Processing tool calls in delta");

            for (const toolCall of delta.tool_calls) {
              // If we have a new tool call ID, update the current ID
              if (toolCall.id) {
                if (DEBUG) console.log(`Setting current tool call ID to: ${toolCall.id}`);
                currentToolCallId = toolCall.id;
              }

              // Always use the currentToolCallId for processing
              if (currentToolCallId) {
                const now = Date.now();

                if (DEBUG) {
                  console.log(`Processing tool call ${currentToolCallId}:`, {
                    name: toolCall.function?.name,
                    newArguments: toolCall.function?.arguments,
                    exists: toolCalls.has(currentToolCallId)
                  });
                }

                // Initialize tool call if it's new
                if (!toolCalls.has(currentToolCallId)) {
                  if (DEBUG) console.log(`Initializing new tool call ${currentToolCallId}`);

                  toolCalls.set(currentToolCallId, {
                    id: currentToolCallId,
                    name: toolCall.function?.name ?? "",
                    arguments: "",
                    startTime: now,
                  });
                  toolCallArguments.set(currentToolCallId, "");
                }

                const existingCall = toolCalls.get(currentToolCallId)!;

                // Check timeout
                if (now - existingCall.startTime! > this.toolCallTimeout) {
                  if (DEBUG) console.log(`Tool call timeout for ${existingCall.name}`);
                  throw new Error(`Tool call timeout for ${existingCall.name}`);
                }

                // Update name if provided
                if (toolCall.function?.name) {
                  if (DEBUG) console.log(`Updating tool call name to ${toolCall.function.name}`);
                  existingCall.name = toolCall.function.name;
                }

                // Concatenate arguments if provided
                if (toolCall.function?.arguments) {
                  const currentArgs = toolCallArguments.get(currentToolCallId) || "";
                  const newArgs = currentArgs + toolCall.function.arguments;
                  if (DEBUG) {
                    console.log(`Updating arguments for ${currentToolCallId}:`, {
                      previous: currentArgs,
                      new: toolCall.function.arguments,
                      combined: newArgs
                    });
                  }
                  toolCallArguments.set(currentToolCallId, newArgs);
                  existingCall.arguments = newArgs;
                }

                toolCalls.set(currentToolCallId, existingCall);

                if (DEBUG) {
                  console.log(`Current state of tool call ${currentToolCallId}:`, {
                    name: existingCall.name,
                    arguments: existingCall.arguments
                  });
                }
              } else {
                if (DEBUG) console.log("No current tool call ID available");
              }
            }
          } else if ("content" in delta && delta.content) {
            if (DEBUG) console.log("Processing content:", delta.content);
            const content = delta.content;
            this.sendToClient("bot", content);
            botMessage += content;
          }

          const finishReason = part.choices[0].finish_reason;
          if (DEBUG) {
            console.log("Finish reason:", finishReason);
            if (finishReason === "tool_calls") {
              console.log("Final state of all tool calls:",
                Object.fromEntries(toolCalls.entries())
              );
            }
          }

          if (finishReason === "tool_calls") {
            // Reset current tool call ID
            currentToolCallId = null;

            // Validate all accumulated arguments are valid JSON before proceeding
            for (const [id, call] of toolCalls) {
              try {
                if (DEBUG) {
                  console.log(`Validating JSON for tool call ${id}:`, call.arguments);
                }
                // Handle empty arguments case
                if (!call.arguments.trim()) {
                  call.arguments = "{}";  // Set default empty object
                }
                JSON.parse(call.arguments); // Validate JSON
              } catch (e) {
                if (DEBUG) {
                  console.error(`JSON validation failed for ${id}:`, e);
                  console.log("Invalid arguments:", call.arguments);
                }
                throw new Error(
                  `Invalid JSON in function arguments for ${call.name}: ${call.arguments}`
                );
              }
            }

            if (DEBUG) console.log("Executing tool calls");
            await this.handleToolCalls(toolCalls);

            if (DEBUG) console.log("Clearing tool calls and arguments");
            toolCalls.clear();
            toolCallArguments.clear();
          } else if (finishReason === "stop") {
            if (botMessage) {
              if (DEBUG) console.log("Saving bot message to chat log");
              this.memory.chatLog!.push({
                sender: "bot",
                message: botMessage,
              });
              await this.saveMemoryIfNeeded();
            }
          }
        }
      } catch (error) {
        console.error("Stream processing error:", error);

        // Attempt to switch to error recovery mode
        try {
          if (DEBUG) console.log("Attempting to switch to error recovery mode");
          await this.handleModeSwitch(
            CommonModes.ErrorRecovery,
            error instanceof Error ? error.message : "Unknown error"
          );
        } catch (e) {
          console.error("Failed to switch to error recovery mode:", e);
        }

        this.sendToClient(
          "bot",
          "There has been an error, please retry",
          "error"
        );
        reject(error);
      } finally {
        if (DEBUG) console.log("Finalizing stream response");
        this.sendToClient("bot", "", "end");
        resolve();
      }
    });
  }
}