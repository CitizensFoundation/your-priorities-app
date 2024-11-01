import { OpenAI } from "openai";
import { YpBaseChatBot } from "../../active-citizen/llms/baseChatBot.js";
/**
 * Common modes that implementations might use
 */
export var CommonModes;
(function (CommonModes) {
    CommonModes["ErrorRecovery"] = "error_recovery";
})(CommonModes || (CommonModes = {}));
export class YpBaseAssistant extends YpBaseChatBot {
    constructor(wsClientId, wsClients, redis) {
        super(wsClientId, wsClients);
        this.modes = new Map();
        this.availableFunctions = new Map();
        this.toolCallTimeout = 30000; // 30 seconds
        this.maxModeTransitions = 10; // Prevent infinite mode transitions
        this.modelName = "gpt-4o";
        this.redis = redis;
        this.wsClientId = wsClientId;
        this.wsClientSocket = wsClients.get(this.wsClientId);
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
    convertToolResultToMessage(toolCall, result) {
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
    async handleToolCalls(toolCalls) {
        const toolResponses = [];
        for (const toolCall of toolCalls.values()) {
            try {
                const func = this.availableFunctions.get(toolCall.name);
                if (!func) {
                    throw new Error(`Unknown function: ${toolCall.name}`);
                }
                let parsedArgs;
                try {
                    parsedArgs = JSON.parse(toolCall.arguments);
                }
                catch (e) {
                    throw new Error(`Invalid function arguments: ${toolCall.arguments}`);
                }
                // Execute the function and get result
                const result = await func.handler(parsedArgs);
                // Store the result in memory for context
                if (result.success && result.data) {
                    await this.setModeData(`${toolCall.name}_result`, result.data);
                }
                // Convert result to message
                const responseMessage = this.convertToolResultToMessage(toolCall, result);
                toolResponses.push(responseMessage);
                // If error, throw it after recording the result
                if (!result.success) {
                    throw new Error(result.error || "Unknown error in tool execution");
                }
            }
            catch (error) {
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
    async handleToolResponses(toolResponses) {
        // Get existing chat messages
        const messages = [
            {
                role: "system",
                content: this.getCurrentSystemPrompt(),
            },
            ...this.convertToOpenAIMessages(this.memory.chatLog || []),
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
        }
        catch (error) {
            console.error("Error handling tool responses:", error);
            throw error;
        }
    }
    /**
     * Initialize modes from subclass definitions
     */
    initializeModes() {
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
    registerCoreFunctions() {
        const switchModeFunction = {
            name: "switch_mode",
            description: "Switch to a different conversation mode",
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
            resultSchema: {
                type: "object",
                properties: {
                    previousMode: { type: "string" },
                    newMode: { type: "string" },
                    timestamp: { type: "string" },
                    transitionReason: { type: "string" },
                },
            },
            handler: async (params) => {
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
                }
                catch (error) {
                    return {
                        success: false,
                        error: error instanceof Error ? error.message : "Failed to switch mode",
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
    getCurrentModeFunctions() {
        const currentMode = this.modes.get(this.memory.currentMode);
        if (!currentMode)
            return [];
        // Combine mode-specific functions with core functions
        return [
            ...currentMode.functions,
            this.availableFunctions.get("switch_mode"),
        ];
    }
    /**
     * Get current mode's system prompt
     */
    getCurrentSystemPrompt() {
        const currentMode = this.modes.get(this.memory.currentMode);
        if (!currentMode)
            return "You are a helpful assistant.";
        return currentMode.systemPrompt;
    }
    /**
     * Validate mode transition
     */
    validateModeTransition(fromMode, toMode) {
        const currentMode = this.modes.get(fromMode);
        if (!currentMode)
            return false;
        // Check if transition is allowed
        if (currentMode.allowedTransitions &&
            !currentMode.allowedTransitions.includes(toMode)) {
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
    async cleanupMode(mode) {
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
    async setModeData(type, data) {
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
    getModeData() {
        return this.memory.modeData?.data;
    }
    /**
     * Main conversation handler with updated function handling
     */
    async conversation(chatLog) {
        await this.setChatLog(chatLog);
        const messages = [
            {
                role: "system",
                content: this.getCurrentSystemPrompt(),
            },
            ...this.convertToOpenAIMessages(chatLog),
        ];
        try {
            // Convert functions to tools format
            const tools = this.getCurrentModeFunctions().map((f) => ({
                type: "function",
                function: {
                    name: f.name,
                    description: f.description,
                    parameters: f.parameters,
                },
            }));
            const stream = await this.openaiClient.chat.completions.create({
                model: this.modelName,
                messages,
                tools,
                tool_choice: "auto",
                stream: true,
            });
            await this.streamWebSocketResponses(stream);
        }
        catch (error) {
            console.error("Error in conversation:", error);
            this.sendToClient("bot", "Error processing request", "error");
        }
    }
    /**
     * Convert chat log to OpenAI message format
     */
    convertToOpenAIMessages(chatLog) {
        return chatLog.map((message) => ({
            role: message.sender === "bot" ? "assistant" : "user",
            content: message.message,
        }));
    }
    /**
     * Handle mode switching
     */
    async handleModeSwitch(newMode, reason) {
        const oldMode = this.memory.currentMode;
        if (!this.modes.has(newMode)) {
            throw new Error(`Invalid mode: ${newMode}`);
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
        this.sendToClient("bot", `Switching from ${oldMode} to ${newMode}${reason ? ": " + reason : ""}`);
    }
    /**
     * Handle streaming responses and function calls
     */
    async streamWebSocketResponses(stream) {
        return new Promise(async (resolve, reject) => {
            this.sendToClient("bot", "", "start");
            try {
                let botMessage = "";
                const toolCalls = new Map();
                for await (const part of stream) {
                    if (!part.choices?.[0]?.delta) {
                        console.error("Unexpected response format:", JSON.stringify(part));
                        continue;
                    }
                    const delta = part.choices[0].delta;
                    if ("tool_calls" in delta && delta.tool_calls) {
                        for (const toolCall of delta.tool_calls) {
                            if (toolCall.id) {
                                const now = Date.now();
                                if (!toolCalls.has(toolCall.id)) {
                                    toolCalls.set(toolCall.id, {
                                        id: toolCall.id,
                                        name: toolCall.function?.name ?? "",
                                        arguments: toolCall.function?.arguments ?? "",
                                        startTime: now,
                                    });
                                }
                                else {
                                    const existingCall = toolCalls.get(toolCall.id);
                                    // Check for timeout
                                    if (now - existingCall.startTime > this.toolCallTimeout) {
                                        throw new Error(`Tool call timeout for ${existingCall.name}`);
                                    }
                                    if (toolCall.function?.name) {
                                        existingCall.name =
                                            existingCall.name + toolCall.function.name;
                                    }
                                    if (toolCall.function?.arguments) {
                                        existingCall.arguments =
                                            existingCall.arguments + toolCall.function.arguments;
                                    }
                                }
                            }
                        }
                    }
                    else if ("content" in delta && delta.content) {
                        const content = delta.content ?? "";
                        this.sendToClient("bot", content);
                        botMessage += content;
                    }
                    const finishReason = part.choices[0].finish_reason;
                    if (finishReason === "tool_calls") {
                        await this.handleToolCalls(toolCalls);
                        toolCalls.clear();
                    }
                    else if (finishReason === "stop") {
                        if (botMessage) {
                            this.memory.chatLog.push({
                                sender: "bot",
                                message: botMessage,
                            });
                            await this.saveMemoryIfNeeded();
                        }
                    }
                }
            }
            catch (error) {
                console.error("Stream processing error:", error);
                // Attempt to switch to error recovery mode
                try {
                    await this.handleModeSwitch(CommonModes.ErrorRecovery, error instanceof Error ? error.message : "Unknown error");
                }
                catch (e) {
                    console.error("Failed to switch to error recovery mode:", e);
                }
                this.sendToClient("bot", "There has been an error, please retry", "error");
                reject(error);
            }
            finally {
                this.sendToClient("bot", "", "end");
                resolve();
            }
        });
    }
}
