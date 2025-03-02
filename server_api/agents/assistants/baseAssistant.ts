import express from "express";
import { OpenAI } from "openai";
import { Stream } from "openai/streaming.js";
import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import ioredis from "ioredis";
import { EventEmitter } from "events";
import {
  type ChatCompletionMessageParam,
  type ChatCompletionCreateParams,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
import { FunctionDefinition } from "openai/resources/shared.mjs";
import { YpBaseChatBot } from "../../active-citizen/llms/baseChatBot.js";
import { YpAgentProduct } from "../models/agentProduct.js";
import { YpSubscription } from "../models/subscription.js";
import { YpSubscriptionPlan } from "../models/subscriptionPlan.js";
import { YpAgentProductRun } from "../models/agentProductRun.js";

/**
 * Common modes that implementations might use
 */
export enum CommonModes {
  ErrorRecovery = "error_recovery",
}

export abstract class YpBaseAssistant extends YpBaseChatBot {
  protected voiceEnabled: boolean;

  openaiClient: OpenAI;
  memory!: YpBaseAssistantMemoryData;
  private eventEmitter: EventEmitter;

  persistMemory = true;

  domainId: number;

  DEBUG = false;

  protected modes: Map<YpAssistantMode, AssistantChatbotMode> = new Map();
  protected availableTools: Map<string, AssistantChatbotTool> = new Map();
  protected toolCallTimeout = 30000; // 30 seconds
  protected maxModeTransitions = 10;

  private clientSystemMessageListener: (data: Buffer) => void;

  redis: ioredis.Redis;

  modelName = process.env.OPENAI_STREAMING_MODEL_NAME || "gpt-4o-2024-11-20";

  constructor(
    wsClientId: string,
    wsClients: Map<string, WebSocket>,
    redis: ioredis.Redis,
    redisKey: string,
    domainId: number
  ) {
    super(wsClientId, wsClients, redis, redisKey);
    this.voiceEnabled = false;
    this.domainId = domainId;
    if (!domainId) {
      throw new Error("Domain ID is required");
    }
    this.redis = redis;

    this.openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.eventEmitter = new EventEmitter();

    this.clientSystemMessageListener = this.handleClientSystemMessage.bind(this);

    this.setupClientSystemMessageListener();

    this.on("update-ai-model-session", this.updateAiModelSession.bind(this));
  }

  public destroy() {
    // remove the WebSocket “message” listener
    this.removeClientSystemMessageListener();

    // remove all other event listeners on the assistant’s own EventEmitter
    this.eventEmitter.removeAllListeners();

    // clear references
    this.wsClientSocket = undefined as unknown as WebSocket;
  }

  removeClientSystemMessageListener() {
    this.wsClientSocket.removeListener(
      "message",
      this.clientSystemMessageListener
    );
  }

  handleClientSystemMessage(data: Buffer) {
    try {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case "client_system_message":
          console.log("WebSockets: Processing client_system_message:", message);
          this.processClientSystemMessage(message);
          break;
        default:
        //console.log('Unhandled message type:', message.type);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }

  setupClientSystemMessageListener() {
    console.log(
      "WebSockets: setupClientSystemMessageListener called for wsClientId:",
      this.wsClientId,
      this.clientSystemMessageListener
    );

    this.wsClientSocket.on("message", this.clientSystemMessageListener);

    const listenerCountAfter = this.wsClientSocket.listenerCount("message");
    console.log(
      'Number of "message" listeners after adding:',
      listenerCountAfter
    );
  }

  async getCurrentAgentProduct(): Promise<
    YpAgentProductAttributes | undefined
  > {
    if (this.memory.currentAgentStatus?.subscriptionPlanId) {
      const subscriptionPlan = await YpSubscriptionPlan.findOne({
        where: {
          id: this.memory.currentAgentStatus.subscriptionPlanId,
        },
        include: [
          {
            model: YpAgentProduct,
            as: "AgentProduct",
          },
        ],
      });
      return subscriptionPlan?.AgentProduct;
    } else {
      console.error("--------------------> No subscription plan found");
    }
    return undefined;
  }

  async getCurrentSubscriptionPlan(): Promise<
    YpSubscriptionPlanAttributes | undefined
  > {
    if (this.memory.currentAgentStatus?.subscriptionPlanId) {
      return (await YpSubscriptionPlan.findOne({
        where: { id: this.memory.currentAgentStatus.subscriptionPlanId },
        include: [
          {
            model: YpAgentProduct,
            as: "AgentProduct",
          },
        ],
      })) as YpSubscriptionPlanAttributes | undefined;
    }
    return undefined;
  }

  async getCurrentSubscription(): Promise<
    YpSubscriptionAttributes | undefined
  > {
    if (this.memory.currentAgentStatus?.subscriptionId) {
      return (await YpSubscription.findOne({
        where: { id: this.memory.currentAgentStatus.subscriptionId },
      })) as YpSubscriptionAttributes | undefined;
    }
    return undefined;
  }

  async getCurrentAgentRun(): Promise<YpAgentProductRunAttributes | undefined> {
    if (this.memory.currentAgentStatus?.activeAgentRunId) {
      return (await YpAgentProductRun.findOne({
        where: { id: this.memory.currentAgentStatus.activeAgentRunId },
      })) as YpAgentProductRunAttributes | undefined;
    } else {
      console.error("No active agent run found");
    }
    return undefined;
  }

  async updateAiModelSession(message: string) {
    console.log(`updateAiModelSession: ${message}`);
  }

  async maybeSendTextResponse(message: string) {
    if (!this.voiceEnabled) {
      this.sendToClient("assistant", message, "message");
      await this.addAssistantMessage(message);
      console.debug(`Sent text message to client: ${message}`);
    }
  }

  async processClientSystemMessage(
    clientEvent: YpAssistantClientSystemMessage
  ) {
    console.log(
      `processClientSystemMessage: ${JSON.stringify(clientEvent, null, 2)}`
    );

    await this.loadMemoryAsync();

    if (clientEvent.message === "user_logged_in") {
      console.log(`user_logged_in emitting`);

      this.emit(
        "update-ai-model-session",
        "User is logged in, lets move to the next step"
      );

      await this.maybeSendTextResponse(
        "Logged in, ready to move on to the next step."
      );
    } else if (clientEvent.message === "agent_configuration_submitted") {
      console.log(`agent_configuration_submitted emitting`);

      try {
        if (!this.memory.currentAgentStatus!.subscriptionId) {
          throw new Error("No subscription found");
        }
        const subscription = await YpSubscription.findOne({
          where: {
            id: this.memory.currentAgentStatus!.subscriptionId,
            status: "active",
          },
        });

        if (!subscription) {
          throw new Error("No subscription found");
        }

        await this.updateCurrentAgentProductPlan(
          this.memory.currentAgentStatus!.subscriptionPlanId,
          subscription.id
        );

        const html = `<yp-configuration-submitted></yp-configuration-submitted>`;

        this.wsClientSocket.send(
          JSON.stringify({
            sender: "assistant",
            type: "html",
            html,
          })
        );

        this.emit(
          "update-ai-model-session",
          "The agent configuration was submitted successfully and the agent is ready to create its first agent run"
        );

        await this.maybeSendTextResponse(
          "The agent configuration was submitted successfully and the agent is ready to create its first agent run."
        );
      } catch (error) {
        console.error(`Error finding subscription: ${error}`);
        this.emit(
          "update-ai-model-session",
          `Failed to submit agent configuration: ${error}`
        );
      }
    } else if (clientEvent.message === "agent_run_changed") {
      try {
        console.log(`agent_run_changed`);
        if (!this.memory.currentAgentStatus?.activeAgentRunId) {
          throw new Error("No active agent run found");
        }

        const agentRun = await YpAgentProductRun.findOne({
          where: {
            id: this.memory.currentAgentStatus!.activeAgentRunId,
          },
        });

        if (!agentRun) {
          throw new Error("No agent run found");
        }

        console.log(`agent_run_changed emitting`);

        const currentWorkflowStep =
          agentRun.workflow?.steps[agentRun.workflow?.currentStepIndex];

        this.emit(
          "update-ai-model-session",
          `The agent run status has been updated to ${
            agentRun.status
          } ${JSON.stringify(
            { workflow: agentRun.workflow, currentWorkflowStep },
            null,
            2
          )} offer the user assistance with this next step in the workflow`
        );
      } catch (error) {
        console.error(`Error finding agent run: ${error}`);
        this.emit(
          "update-ai-model-session",
          `Failed to update agent run status: ${error}`
        );
      }
    }
  }

  emit(event: string, ...args: any[]) {
    return this.eventEmitter.emit(event, ...args);
  }

  on(event: string, listener: (...args: any[]) => void) {
    this.eventEmitter.on(event, listener);
  }

  async updateCurrentAgentProductPlan(
    subscriptionPlanId: number,
    subscriptionId: number | null
  ) {
    const subscriptionPlan = await YpSubscriptionPlan.findOne({
      where: {
        id: subscriptionPlanId,
      },
    });

    if (!subscriptionPlan) {
      throw new Error("No subscription plan found");
    }

    const subscription = subscriptionId
      ? await YpSubscription.findOne({
          where: {
            id: subscriptionId,
          },
        })
      : null;

    const requiredStructuredQuestions =
      subscriptionPlan.configuration.requiredStructuredQuestions;
    const requiredStructuredAnswers =
      subscription?.configuration?.requiredQuestionsAnswered;

    await this.loadMemoryAsync();

    this.memory.currentAgentStatus = {
      activeAgentRunId: this.memory.currentAgentStatus?.activeAgentRunId,
      subscriptionPlanId,
      subscriptionId,
      subscriptionState: subscription ? "subscribed" : "unsubscribed",
      configurationState:
        requiredStructuredAnswers &&
        requiredStructuredQuestions &&
        requiredStructuredAnswers.length == requiredStructuredQuestions.length
          ? "configured"
          : "not_configured",
    };

    console.log(
      `updateCurrentAgentProductPlan: ${JSON.stringify(
        this.memory.currentAgentStatus,
        null,
        2
      )}`
    );

    await this.saveMemory();
  }

  /**
   * Convert tool result to message format
   */
  protected convertToolResultToMessage(
    toolCall: ToolCall,
    result: ToolExecutionResult
  ): ToolResponseMessage {
    if (this.DEBUG) {
      console.log(
        `convertToolResultToMessage: ${JSON.stringify(toolCall, null, 2)}`
      );
    }
    return {
      role: "tool",
      content: JSON.stringify(result.data) || result.html || "",
      tool_call_id: toolCall.id,
      name: toolCall.name,
    };
  }

  /**
   * Handle executing tool calls with results
   */
  async handleToolCalls(toolCalls: Map<string, ToolCall>): Promise<void> {
    if (this.DEBUG) {
      console.log(
        `====================================> handleToolCalls: ${JSON.stringify(
          Array.from(toolCalls.values()),
          null,
          2
        )}`
      );
    }
    const toolResponses: ToolResponseMessage[] = [];

    for (const toolCall of toolCalls.values()) {
      try {
        const func = this.availableTools.get(toolCall.name);
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
        if (this.DEBUG) {
          console.log(
            `----------------------------------> Tool execution result:`,
            JSON.stringify(result, null, 2)
          );
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

        let resultData = result.data || result.error;

        // Generate a user-friendly message based on the tool result
        const resultMessage = `<contextFromRetrievedData>${JSON.stringify(
          resultData,
          null,
          2
        )}</contextFromRetrievedData>`;
        if (resultData) {
          this.sendToClient(
            "assistant",
            resultMessage,
            "hiddenContextMessage",
            result.uniqueToken,
            true
          );
          this.memory.chatLog!.push({
            sender: "system",
            hiddenContextMessage: true,
            message: resultMessage,
            type: "hiddenContextMessage",
            uniqueToken: result.uniqueToken,
          } as YpSimpleChatLog);
          await this.saveMemoryIfNeeded();
        } else {
          console.error(
            `No data returned from tool execution: ${toolCall.name}`
          );
        }

        if (result.html) {
          this.sendToClient(
            "assistant",
            result.html,
            "html",
            result.uniqueToken,
            true
          );
          this.addAssistantHtmlMessage(result.html, result.uniqueToken);
        }

        if (result.clientEvents) {
          if (this.DEBUG) {
            console.log(
              `clientEvents: ${JSON.stringify(result.clientEvents, null, 2)}`
            );
          }

          for (const clientEvent of result.clientEvents) {
            this.sendToClient(
              "assistant",
              clientEvent.details,
              clientEvent.name as YpAssistantMessageType
            );
          }
        }

        // If error, throw it after recording the result
        if (!result.success) {
          console.error(`Unknown error in tool execution: ${result.error}`);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error(`Error executing tool ${toolCall.name}: ${errorMessage}`);
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
    if (this.DEBUG) {
      console.log(
        `handleToolResponses: ${JSON.stringify(toolResponses, null, 2)}`
      );
    }
    // Get existing chat messages
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          this.getCurrentSystemPrompt() +
          `\n IMPORTANT: Do not output function content in text form at all, that is already provided by the function to the user, like the list of agents available for subscription, this information is already being displayed by the function to the user so no need to repeat it in text, just make a general comment`,
      },
      ...this.convertToOpenAIMessages(this.memory.chatLog || []),
      {
        role: "assistant",
        content: null,
        tool_calls: Array.from(toolResponses.values()).map((response) => ({
          id: response.tool_call_id,
          type: "function",
          function: {
            name: response.name,
            arguments: "{}", // The actual arguments don't matter here
          },
        })),
      },
      ...toolResponses,
    ];

    console.log(`handleToolResponses: ${JSON.stringify(messages, null, 2)}`);

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
  abstract defineAvailableModes(): Promise<AssistantChatbotMode[]>;

  async setupMemoryAsync() {
    if (!this.memory) {
      console.log("loadMemoryWithOwnership: loading memory");
      this.memory = (await this.loadMemory()) as YpBaseAssistantMemoryData;
    }

    if (!this.memory) {
      console.error("loadMemoryWithOwnership: No memory found!!!");
    }
  }

  async loadMemoryAsync() {
    this.memory = (await this.loadMemory()) as YpBaseAssistantMemoryData;
  }

  getCleanedParams<T extends object>(params: string | T): T {
    return typeof params === "string" ? JSON.parse(params) : params;
  }

  async setCurrentMode(mode: YpAssistantMode) {
    if (mode) {
      console.log(
        `Setting currentMode to ${mode} it was ${this.memory.currentMode}`
      );
    } else {
      console.log(
        `No currentMode provided, keeping ${this.memory.currentMode}`
      );
    }

    await this.loadMemoryAsync();

    this.memory.currentMode = mode;

    await this.saveMemory();
  }

  /**
   * Initialize modes from subclass definitions
   */
  async initializeModes(): Promise<void> {
    console.log("---------------------> initializeModes");
    await this.setupMemoryAsync();

    this.availableTools.clear();

    const modes = await this.defineAvailableModes();

    for (const mode of modes) {
      this.modes.set(mode.name, mode);
      console.log(`initializeModes: ${mode.name}`);

      // Register mode's functions
      for (const func of mode.tools) {
        this.availableTools.set(func.name, func);
      }
    }

    //    this.registerCoreFunctions();

    // Set initial mode if none exists
    if (!this.memory.currentMode && modes.length > 0) {
      this.memory.currentMode = modes[0].name;
    }
  }

  /**
   * Get current mode's functions
   */
  getCurrentModeFunctions(): AssistantChatbotTool[] {
    const currentMode = this.modes.get(this.memory.currentMode!);
    if (!currentMode) {
      console.error(`No current mode found: ${this.memory.currentMode}`);
      return [];
    }

    // Combine mode-specific functions with core functions
    return [
      ...currentMode.tools,
      //    this.availableTools.get("switch_mode")!,
    ];
  }

  get isLoggedIn(): boolean {
    return Boolean(this.memory?.currentUser);
  }

  renderLoginStatus(): string {
    return `
<loginStatus>
${this.isLoggedIn ? "The user is logged in." : "The user is not logged in."}
</loginStatus>
`;
  }

  defaultSystemPrompt = `<coreImportantSystemInstructions>
You are a helpful, witty, and friendly AI. Act like a human, but remember that you aren't a human and that you can't do human things in the real world.
Your voice and personality should be warm and engaging, with a lively and playful tone. Talk quickly.
If interacting in a non-English language, start by using the standard accent or dialect familiar to the user.
You should always call a function/tool if you can to help the user with their request.
Never try to start workflows without using functions/tools, using some tools will unlock other function/tools that might help the user with their request.
Functions/tools will become available to you as the user progresses through the workflow.
Make sure that the user logged in before connecting him to an agent.
Never list out the available agents using text or markdown, the user already sees the list of agents available for subscription in the UI.
You will not be able to start the workflow for the user except using tools/functions at each step.
Never engage in longish back and fourth conversations with the user if a workflow has not started, lead the user towards using the tools available as much as possible, politely.
Never engage in off topic conversations, always politely steer the conversation back to the workflow.
</coreImportantSystemInstructions>

<typicalWorkflowStepsForStartingAnAgentWorkflow>
1) The agent presents the user with a list of agents available for connection.
2) The user logs in or creates an account, if the user is not logged in already.
3) The user chooses an agent to connect to using the direct connect to the agent the user chooses.
4) The agent offers to show the user a workflow overview, with a tool.
5) The user fills out the configuration UI widget.
6) The user submits from the configuration UI widget.
7) The user starts the workflow run.
</typicalWorkflowStepsForStartingAnAgentWorkflow>
`;

  /**
   * Get current mode's system prompt
   */
  getCurrentSystemPrompt(): string {
    const currentMode = this.modes.get(this.memory.currentMode!);
    if (!currentMode) {
      console.error(`No current mode found: ${this.memory.currentMode}`);
      return `${this.defaultSystemPrompt}\n\n${this.renderLoginStatus()}`;
    }

    return `${
      this.defaultSystemPrompt
    }\n\n${this.renderLoginStatus()}\n\n<furtherAgentInstructions>\n${
      currentMode.systemPrompt
    }\n</furtherAgentInstructions>`;
  }

  sendAvatarUrlChange(url: string | null, avatarName: string | null) {
    this.wsClientSocket.send(
      JSON.stringify({
        sender: "system",
        type: "avatar_url_change",
        url,
        data: avatarName,
      } as YpAssistantMessage)
    );

    this.currentAssistantAvatarUrl = url || undefined;
  }

  /**
   * Validate mode transition
   */
  protected validateModeTransition(
    fromMode: YpAssistantMode,
    toMode: YpAssistantMode
  ): boolean {
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
  protected async cleanupMode(mode: YpAssistantMode): Promise<void> {
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
  async conversation(chatLog: YpSimpleChatLog[]) {
    await this.loadMemoryAsync();

    await this.initializeModes();

    await this.setChatLog(chatLog);

    await this.saveMemory();

    let systemPrompt = this.getCurrentSystemPrompt();

    const subscriptionPlan = await this.getCurrentSubscriptionPlan();

    if (
      subscriptionPlan &&
      subscriptionPlan.AgentProduct?.configuration.avatar?.imageUrl
    ) {
      this.currentAssistantAvatarUrl =
        subscriptionPlan.AgentProduct!.configuration.avatar.imageUrl;
    } else {
      this.currentAssistantAvatarUrl = undefined;
    }

    if (
      this.memory.currentMode === "agent_direct_connection_mode" &&
      subscriptionPlan?.AgentProduct?.configuration.avatar?.systemPrompt
    ) {
      systemPrompt = `${subscriptionPlan.AgentProduct.configuration.avatar.systemPrompt}\n\n${systemPrompt}`;
    }

    if (
      this.currentAssistantAvatarUrl &&
      subscriptionPlan?.AgentProduct?.name
    ) {
      this.sendAvatarUrlChange(
        this.currentAssistantAvatarUrl,
        subscriptionPlan.AgentProduct!.name
      );
    }

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemPrompt,
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

      console.log(
        "======================> conversation currentMode",
        this.memory?.currentMode
      );
      if (this.DEBUG) {
        console.log(
          "======================> conversation",
          JSON.stringify(messages, null, 2)
        );
      }
      console.log(
        "======================> conversation",
        JSON.stringify(tools, null, 2)
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
      this.sendToClient("assistant", "Error processing request", "error");
    }
  }

  async getAgentProduct(
    agentProductId: number
  ): Promise<YpAgentProduct | null> {
    try {
      const agentProduct = await YpAgentProduct.findByPk(agentProductId);
      return agentProduct;
    } catch (error) {
      console.error(
        `Error getting agent product for ${agentProductId}: ${error}`
      );
      return null;
    }
  }

  /**
   * Convert chat log to OpenAI message format
   */
  protected convertToOpenAIMessages(
    chatLog: YpSimpleChatLog[]
  ): ChatCompletionMessageParam[] {
    return chatLog
      .filter((message) => message.sender !== "system")
      .map((message) => {
        if (message.message != null) {
          return { role: message.sender, content: message.message };
        } else {
          console.debug(
            "Message content is null, message: " + JSON.stringify(message)
          );
          return null;
        }
      })
      .filter((message) => message !== null) as ChatCompletionMessageParam[];
  }

  /**
   * Handle mode switching
   */
  async handleModeSwitch(
    newMode: YpAssistantMode,
    reason: string,
    params: any
  ): Promise<void> {
    await this.loadMemoryAsync();

    console.log(`handleModeSwitch: ${newMode}${reason ? ": " + reason : ""}`);
    const oldMode = this.memory.currentMode;

    if (!this.modes.has(newMode)) {
      throw new Error(`Invalid mode: ${newMode}`);
    }

    if (oldMode === newMode) {
      console.error(
        `Trying to switch to the same mode: ${oldMode} to ${newMode}`
      );
      return;
    }
    if (oldMode && !this.validateModeTransition(oldMode, newMode)) {
      console.warn(`Invalid mode transition from ${oldMode} to ${newMode}`);
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

    this.wsClientSocket.send(
      JSON.stringify({
        sender: "system",
        type: "current_mode",
        mode: this.memory.currentMode,
      } as YpAssistantMessage)
    );

    await this.saveMemory();

    console.log(
      "handleModeSwitch: CurrentMode after save",
      this.memory.currentMode
    );

    this.sendToClient("system", newMode, "modeChange", undefined, true);
  }

  async addUserMessage(message: string): Promise<void> {
    await this.loadMemoryAsync();
    this.memory.chatLog!.push({
      sender: "user",
      message,
      type: "message",
    });
    await this.saveMemory();
  }

  async addAssistantMessage(message: string): Promise<void> {
    await this.loadMemoryAsync();
    this.memory.chatLog!.push({
      sender: "assistant",
      message: message,
      type: "message",
      avatarUrl: this.currentAssistantAvatarUrl,
    });
    await this.saveMemory();
  }

  async addAssistantHtmlMessage(
    html: string,
    uniqueToken?: string
  ): Promise<void> {
    await this.loadMemoryAsync();
    this.memory.chatLog!.push({
      sender: "assistant",
      html,
      message: "",
      type: "html",
      uniqueToken,
    });
    await this.saveMemory();
  }

  /**
   * Handle streaming responses and function calls with comprehensive debugging
   */
  async streamWebSocketResponses(
    stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>
  ) {
    return new Promise<void>(async (resolve, reject) => {
      if (this.DEBUG) console.log("Starting streamWebSocketResponses");
      this.sendToClient("assistant", "", "start");

      try {
        let botMessage = "";
        const toolCalls = new Map<string, ToolCall>();
        const toolCallArguments = new Map<string, string>();
        let currentToolCallId: string | null = null;

        for await (const part of stream) {
          if (this.DEBUG) {
            console.log("Received stream part:", JSON.stringify(part, null, 2));
          }

          if (!part.choices?.[0]?.delta) {
            if (this.DEBUG)
              console.log("Skipping invalid stream part - no choices or delta");
            continue;
          }

          const delta = part.choices[0].delta;
          if (this.DEBUG) {
            console.log("Processing delta:", JSON.stringify(delta, null, 2));
          }

          if ("tool_calls" in delta && delta.tool_calls) {
            if (this.DEBUG) console.log("Processing tool calls in delta");

            for (const toolCall of delta.tool_calls) {
              // If we have a new tool call ID, update the current ID
              if (toolCall.id) {
                if (this.DEBUG)
                  console.log(
                    `Setting current tool call ID to: ${toolCall.id}`
                  );
                currentToolCallId = toolCall.id;
              }

              // Always use the currentToolCallId for processing
              if (currentToolCallId) {
                const now = Date.now();

                if (this.DEBUG) {
                  console.log(`Processing tool call ${currentToolCallId}:`, {
                    name: toolCall.function?.name,
                    newArguments: toolCall.function?.arguments,
                    exists: toolCalls.has(currentToolCallId),
                  });
                }

                // Initialize tool call if it's new
                if (!toolCalls.has(currentToolCallId)) {
                  if (this.DEBUG)
                    console.log(
                      `Initializing new tool call ${currentToolCallId}`
                    );

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
                  if (this.DEBUG)
                    console.log(`Tool call timeout for ${existingCall.name}`);
                  throw new Error(`Tool call timeout for ${existingCall.name}`);
                }

                // Update name if provided
                if (toolCall.function?.name) {
                  if (this.DEBUG)
                    console.log(
                      `Updating tool call name to ${toolCall.function.name}`
                    );
                  existingCall.name = toolCall.function.name;
                }

                // Concatenate arguments if provided
                if (toolCall.function?.arguments) {
                  const currentArgs =
                    toolCallArguments.get(currentToolCallId) || "";
                  const newArgs = currentArgs + toolCall.function.arguments;
                  if (this.DEBUG) {
                    console.log(
                      `Updating arguments for ${currentToolCallId}:`,
                      {
                        previous: currentArgs,
                        new: toolCall.function.arguments,
                        combined: newArgs,
                      }
                    );
                  }
                  toolCallArguments.set(currentToolCallId, newArgs);
                  existingCall.arguments = newArgs;
                }

                toolCalls.set(currentToolCallId, existingCall);

                if (this.DEBUG) {
                  console.log(
                    `Current state of tool call ${currentToolCallId}:`,
                    {
                      name: existingCall.name,
                      arguments: existingCall.arguments,
                    }
                  );
                }
              } else {
                if (this.DEBUG)
                  console.log("No current tool call ID available");
              }
            }
          } else if ("content" in delta && delta.content) {
            if (this.DEBUG) console.log("Processing content:", delta.content);
            const content = delta.content;
            this.sendToClient("assistant", content);
            botMessage += content;
          }

          const finishReason = part.choices[0].finish_reason;
          if (this.DEBUG) {
            console.log("Finish reason:", finishReason);
            if (finishReason === "tool_calls") {
              console.log(
                "Final state of all tool calls:",
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
                if (this.DEBUG) {
                  console.log(
                    `Validating JSON for tool call ${id}:`,
                    call.arguments
                  );
                }
                // Handle empty arguments case
                if (!call.arguments.trim()) {
                  call.arguments = "{}"; // Set default empty object
                }
                JSON.parse(call.arguments); // Validate JSON
              } catch (e) {
                if (this.DEBUG) {
                  console.error(`JSON validation failed for ${id}:`, e);
                  console.log("Invalid arguments:", call.arguments);
                }
                throw new Error(
                  `Invalid JSON in function arguments for ${call.name}: ${call.arguments}`
                );
              }
            }

            if (this.DEBUG) console.log("Executing tool calls");
            await this.handleToolCalls(toolCalls);

            if (this.DEBUG) console.log("Clearing tool calls and arguments");
            toolCalls.clear();
            toolCallArguments.clear();
          } else if (finishReason === "stop") {
            if (botMessage) {
              if (this.DEBUG) console.log("Saving bot message to chat log");
              this.memory.chatLog!.push({
                sender: "assistant",
                message: botMessage,
                type: "message",
                avatarUrl: this.currentAssistantAvatarUrl,
              });
              await this.saveMemoryIfNeeded();
            }
          }
        }
      } catch (error) {
        console.error("Stream processing error:", error);

        // Attempt to switch to error recovery mode
        try {
          if (this.DEBUG)
            console.log("Attempting to switch to error recovery mode");
          await this.handleModeSwitch(
            "error_recovery" as YpAssistantMode,
            error instanceof Error ? error.message : "Unknown error",
            {}
          );
        } catch (e) {
          console.error("Failed to switch to error recovery mode:", e);
        }

        this.sendToClient(
          "assistant",
          "There has been an error, please retry",
          "error"
        );
        reject(error);
      } finally {
        if (this.DEBUG) console.log("Finalizing stream response");
        this.sendToClient("assistant", "", "end");
        resolve();
      }
    });
  }
}
