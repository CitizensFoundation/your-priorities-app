import { YpBaseChatBot } from "active-citizen/llms/baseChatBot.js";
import { OpenAI } from "openai";
export class YpBaseAssistant extends YpBaseChatBot {
    constructor(wsClientId, wsClients) {
        super(wsClientId, wsClients);
        this.modes = new Map();
        this.availableFunctions = new Map();
        this.modelName = "gpt-4o";
        this.wsClientId = wsClientId;
        this.wsClientSocket = wsClients.get(this.wsClientId);
        this.openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.initializeModes();
        this.registerCoreFunctions();
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
    convertToOpenAIMessages(chatLog) {
        return chatLog.map(message => ({
            role: message.sender === "bot" ? "assistant" : "user",
            content: message.message,
        }));
    }
    /**
     * Register core functions available in all modes
     */
    registerCoreFunctions() {
        const switchModeFunction = {
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
    getCurrentModeFunctions() {
        const currentMode = this.modes.get(this.memory.currentMode);
        if (!currentMode)
            return [];
        // Combine mode-specific functions with core functions
        return [
            ...currentMode.functions,
            this.availableFunctions.get('switch_mode')
        ];
    }
    /**
     * Get current mode's system prompt
     */
    getCurrentSystemPrompt() {
        const currentMode = this.modes.get(this.memory.currentMode);
        if (!currentMode)
            return 'You are a helpful assistant.';
        return currentMode.systemPrompt;
    }
    /**
     * Handle mode switching
     */
    async handleModeSwitch(newMode, reason) {
        if (!this.modes.has(newMode)) {
            throw new Error(`Invalid mode: ${newMode}`);
        }
        const oldMode = this.memory.currentMode;
        this.memory.currentMode = newMode;
        // Clear mode-specific data when changing modes
        this.memory.modeData = {};
        await this.saveMemory();
        this.sendToClient("bot", `Switching from ${oldMode} to ${newMode}${reason ? ': ' + reason : ''}`);
    }
    /**
     * Handle streaming responses and function calls that may come in chunks
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
                    if ('tool_calls' in delta && delta.tool_calls) {
                        // Handle tool calls
                        for (const toolCall of delta.tool_calls) {
                            if (toolCall.id) {
                                if (!toolCalls.has(toolCall.id)) {
                                    toolCalls.set(toolCall.id, {
                                        id: toolCall.id,
                                        name: toolCall.function?.name ?? '', // Use nullish coalescing
                                        arguments: toolCall.function?.arguments ?? '' // Use nullish coalescing
                                    });
                                }
                                else {
                                    const existingCall = toolCalls.get(toolCall.id);
                                    if (toolCall.function?.name) {
                                        existingCall.name = existingCall.name + toolCall.function.name;
                                    }
                                    if (toolCall.function?.arguments) {
                                        existingCall.arguments = existingCall.arguments + toolCall.function.arguments;
                                    }
                                }
                            }
                            else {
                                console.error("Tool call ID is missing:", toolCall);
                            }
                        }
                    }
                    else if ('content' in delta && delta.content) {
                        // Handle regular message streaming
                        const content = delta.content ?? ''; // Use nullish coalescing
                        this.sendToClient("bot", content);
                        botMessage += content;
                    }
                    // Rest of the code remains the same...
                }
            }
            catch (error) {
                console.error("Stream processing error:", error);
                this.sendToClient("bot", "There has been an error, please retry", "error");
                reject(error);
            }
            finally {
                this.sendToClient("bot", "", "end");
                resolve();
            }
        });
    }
    /**
     * Main conversation handler with updated function handling
     */
    async conversation(chatLog) {
        await this.setChatLog(chatLog);
        const messages = [
            {
                role: "system",
                content: this.getCurrentSystemPrompt()
            },
            ...this.convertToOpenAIMessages(chatLog)
        ];
        try {
            // Convert functions to tools format
            const tools = this.getCurrentModeFunctions().map(f => ({
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
        }
        catch (error) {
            console.error("Error in conversation:", error);
            this.sendToClient("bot", "Error processing request", "error");
        }
    }
}
