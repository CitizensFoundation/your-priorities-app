import { YpBaseChatBot } from "../../active-citizen/llms/baseChatBot.js";
import WebSocket from "ws";
// Extend the base class with voice capabilities
export class YpBaseChatBotWithVoice extends YpBaseChatBot {
    constructor(wsClientId, wsClients, memoryId = undefined, voiceEnabled = false, parentAssistant) {
        super(wsClientId, wsClients, memoryId);
        this.voiceEnabled = false;
        this.audioBuffer = [];
        this.VAD_TIMEOUT = 1000; // 1 second of silence for VAD
        this.parentAssistant = parentAssistant;
        this.voiceEnabled = voiceEnabled;
        this.voiceState = {
            speaking: false,
            listening: false,
            processingAudio: false
        };
        // Default voice configuration
        this.voiceConfig = {
            model: "gpt-4o-realtime-preview-2024-10-01",
            voice: "ballad",
            modalities: ["text", "audio"]
        };
    }
    async initializeVoiceConnection() {
        if (!this.voiceEnabled)
            return;
        console.log("initializeVoiceConnection");
        const url = "wss://api.openai.com/v1/realtime";
        const wsConfig = {
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "OpenAI-Beta": "realtime=v1"
            }
        };
        try {
            const ws = new WebSocket(`${url}?model=${this.voiceConfig.model}`, wsConfig);
            ws.on("open", () => {
                console.log("Voice connection established");
                this.voiceConnection = {
                    ws,
                    connected: true,
                    model: this.voiceConfig.model,
                    voice: this.voiceConfig.voice
                };
                this.initializeVoiceSession();
            });
            ws.on("close", () => {
                console.log("Voice connection closed");
                this.voiceConnection = undefined;
            });
            ws.on("error", (error) => {
                console.error("Voice connection error:", error);
                this.voiceConnection = undefined;
            });
            this.setupVoiceMessageHandlers(ws);
        }
        catch (error) {
            console.error("Failed to initialize voice connection:", error);
            throw error;
        }
    }
    setupVoiceMessageHandlers(ws) {
        ws.on("message", async (data) => {
            try {
                const event = JSON.parse(data.toString());
                console.log("voiceMessage: ", event.type);
                switch (event.type) {
                    case "session.created":
                        await this.handleVoiceSessionCreated(event);
                        break;
                    case "session.error":
                        await this.handleVoiceSessionError(event);
                        break;
                    case "response.generating.started":
                        this.voiceState.speaking = true;
                        await this.handleVoiceResponseStatus(event);
                        break;
                    case "response.generating.completed":
                        this.voiceState.speaking = false;
                        await this.handleVoiceResponseStatus(event);
                        break;
                    case "input_audio_buffer.speech_started":
                        this.handleSpeechStarted();
                        break;
                    case "input_audio_buffer.speech_stopped":
                        await this.handleSpeechStopped();
                        break;
                    case "audio":
                        await this.handleAudioOutput(event);
                        break;
                    case "text":
                        await this.handleTextOutput(event);
                        break;
                    case "input_audio_buffer.committed":
                        await this.handleAudioBufferCommitted(event);
                        break;
                    case "response.audio.delta":
                        await this.handleAudioDelta(event);
                        break;
                    case "response.function_call_arguments.done":
                        await this.callFunctionHandler(event);
                        break;
                    default:
                        console.log("Unhandled voice event type:", event.type);
                        console.log(JSON.stringify(event, null, 2));
                        break;
                }
            }
            catch (error) {
                console.error("Error handling voice message:", error);
            }
        });
    }
    async callFunctionHandler(event) {
        const tools = this.parentAssistant?.getCurrentModeFunctions();
        if (!tools)
            return;
        const tool = tools.find((t) => t.name === event.name);
        if (!tool) {
            console.log("Tool not found: ", event.name);
            return;
        }
        const toolName = tool.name;
        console.log("Calling tool handler: ", toolName);
        const result = await tool.handler(event.arguments);
        // Store the result in memory for context
        if (result.success && result.data) {
            await this.parentAssistant?.setModeData(`${toolName}_result`, result.data);
        }
        // Generate a user-friendly message based on the tool result
        const resultMessage = `<contextFromRetrievedData>${JSON.stringify(result.data, null, 2)}</contextFromRetrievedData>`;
        if (result.data) {
            this.sendToClient("bot", resultMessage, "hiddenContextMessage", true);
            /*this.memory.chatLog!.push({
              sender: "bot",
              hiddenContextMessage: true,
              message: resultMessage,
            });
            await this.saveMemoryIfNeeded();*/
        }
        else {
            console.error(`No data returned from tool execution: ${event.name}`);
        }
        if (result.html) {
            this.sendToClient("bot", result.html, "html", true);
        }
        const responseEvent = {
            type: "conversation.item.create",
            item: {
                type: "function_call_output",
                call_id: event.call_id,
                output: JSON.stringify(result.data, null, 2)
            }
        };
        this.voiceConnection?.ws.send(JSON.stringify(responseEvent));
    }
    async proxyToClient(event) {
        console.log("proxyToClient: ", event.type);
        console.log(JSON.stringify(event, null, 2));
        const proxyMessage = {
            sender: "bot",
            type: event.type,
            data: event
        };
        this.wsClientSocket.send(JSON.stringify(proxyMessage));
    }
    // Handle incoming audio from client
    async handleIncomingAudio(audioData) {
        //console.log(`handleIncomingAudio: ${audioData.length} ${this.voiceEnabled} ${this.voiceConnection?.ws}`);
        if (!this.voiceConnection?.ws || !this.voiceEnabled)
            return;
        this.audioBuffer.push(audioData);
        this.voiceState.lastAudioTimestamp = Date.now();
        // Reset VAD timeout
        if (this.vadTimeout) {
            clearTimeout(this.vadTimeout);
        }
        // Set new VAD timeout
        this.vadTimeout = setTimeout(() => {
            this.handleVADSilence();
        }, this.VAD_TIMEOUT);
        // Send audio to server
        const audioMessage = {
            type: "input_audio_buffer.append",
            audio: Buffer.from(audioData).toString('base64')
        };
        console.log("Sending audio message to server:");
        this.voiceConnection.ws.send(JSON.stringify(audioMessage));
    }
    // Handle Voice Activity Detection silence
    async handleVADSilence() {
        if (!this.voiceConnection?.ws || !this.voiceState.listening)
            return;
        // Commit the audio buffer
        const commitMessage = {
            type: "input_audio_buffer.commit"
        };
        this.voiceConnection.ws.send(JSON.stringify(commitMessage));
        this.audioBuffer = []; // Clear the buffer
        this.voiceState.processingAudio = true;
    }
    // Handle speech started event
    handleSpeechStarted() {
        this.voiceState.listening = true;
        this.sendToClient("bot", "", "listening_start");
    }
    // Handle speech stopped event
    async handleSpeechStopped() {
        this.voiceState.listening = false;
        this.sendToClient("bot", "", "listening_stop");
        // If we're not already processing, commit the buffer
        if (!this.voiceState.processingAudio) {
            await this.handleVADSilence();
        }
    }
    // Handle audio output from server
    async handleAudioOutput(event) {
        if (!event.audio)
            return;
        // Forward audio to client
        const audioMessage = {
            sender: "bot",
            type: "audio",
            audio: event.audio // base64 encoded audio
        };
        this.wsClientSocket.send(JSON.stringify(audioMessage));
    }
    async handleAudioDelta(event) {
        if (!event.delta)
            return;
        const audioMessage = {
            sender: "bot",
            type: "audio",
            audio: event.delta // base64 encoded audio
        };
        this.wsClientSocket.send(JSON.stringify(audioMessage));
    }
    // Handle text output from server
    async handleTextOutput(event) {
        if (!event.content)
            return;
        // Add to chat log
        this.memory.chatLog.push({
            sender: "bot",
            message: event.content
        });
        // Send to client
        this.sendToClient("bot", event.content);
    }
    // Handle audio buffer committed event
    async handleAudioBufferCommitted(event) {
        this.voiceState.processingAudio = false;
        // Request a response if we're not already speaking
        if (!this.voiceState.speaking) {
            const responseEvent = {
                type: "response.create",
                response: {
                    modalities: this.voiceConfig.modalities
                }
            };
            this.voiceConnection?.ws.send(JSON.stringify(responseEvent));
        }
    }
    async initializeVoiceSession() {
        if (!this.voiceConnection?.ws)
            return;
        // Then update the session with full configuration
        const sessionConfig = {
            type: "session.update",
            session: {
                ...this.voiceConfig,
                instructions: this.parentAssistant?.getCurrentSystemPrompt(),
                //@ts-ignore
                tools: this.parentAssistant?.getCurrentModeFunctions(),
                tool_choice: "auto",
                temperature: 0.72,
                input_audio_transcription: {
                    model: "whisper-1"
                },
                turn_detection: {
                    type: "server_vad",
                    threshold: 0.5,
                    prefix_padding_ms: 300,
                    silence_duration_ms: 500
                }
            }
        };
        console.log("Sending session config to server:", JSON.stringify(sessionConfig, null, 2));
        this.voiceConnection.ws.send(JSON.stringify(sessionConfig));
        /*const createResponse = {
          type: "response.create",
          response: {
            modalities: this.voiceConfig.modalities,
            instructions: this.parentAssistant?.getCurrentSystemPrompt()
          }
        };
        this.voiceConnection.ws.send(JSON.stringify(createResponse));
        */
    }
    // Override the base conversation method to handle both text and voice
    async conversation(chatLog) {
        await this.setChatLog(chatLog);
        if (this.voiceEnabled && this.voiceConnection?.connected) {
            return this.handleVoiceConversation(chatLog);
        }
        else {
            return super.conversation(chatLog);
        }
    }
    async handleVoiceConversation(chatLog) {
        if (!this.voiceConnection?.ws)
            return;
        // Check if the last message contains audio or text
        const lastMessage = chatLog[chatLog.length - 1];
        if (lastMessage.base64Audio) {
            // Handle audio input
            await this.handleIncomingAudio(Buffer.from(lastMessage.base64Audio, 'base64'));
        }
        else {
            // Handle text input by creating a conversation item
            const conversationEvent = {
                type: "conversation.item.create",
                item: {
                    type: "message",
                    role: lastMessage.sender === "bot" ? "assistant" : "user",
                    content: [{
                            type: "input_text",
                            text: lastMessage.message
                        }]
                }
            };
            // Send the message
            this.voiceConnection.ws.send(JSON.stringify(conversationEvent));
            // Request response immediately for text input
            const responseEvent = {
                type: "response.create",
                response: {
                    modalities: this.voiceConfig.modalities
                }
            };
            this.voiceConnection.ws.send(JSON.stringify(responseEvent));
        }
    }
    // Handle voice-specific events
    async handleVoiceSessionCreated(event) {
        console.log("Voice session created:", event.session.id);
        // Additional session initialization if needed
    }
    async handleVoiceSessionError(event) {
        console.error("Voice session error:", event.error);
        this.sendToClient("bot", "Voice processing error occurred", "error");
    }
    async handleVoiceResponseStatus(event) {
        switch (event.type) {
            case "response.generating.started":
                this.sendToClient("bot", "", "start");
                break;
            case "response.generating.completed":
                this.sendToClient("bot", "", "end");
                break;
        }
    }
    // Override the streamWebSocketResponses method to handle both modes
    async streamWebSocketResponses(stream) {
        if (this.voiceEnabled) {
            // For voice mode, responses are handled through the WebSocket event handlers
            return;
        }
        // Otherwise, use the original implementation
        return super.streamWebSocketResponses(stream);
    }
    // Helper method to switch between voice and text modes
    async setVoiceMode(enabled) {
        this.voiceEnabled = enabled;
        if (enabled) {
            console.log("setVoiceMode: initializing voice connection");
            await this.initializeVoiceConnection();
        }
        else {
            console.log("setVoiceMode: closing voice connection");
            // Clean up voice connection if it exists
            if (this.voiceConnection?.ws) {
                this.voiceConnection.ws.close();
                this.voiceConnection = undefined;
            }
        }
    }
    // Method to update voice configuration
    async updateVoiceConfig(config) {
        this.voiceConfig = {
            ...this.voiceConfig,
            ...config
        };
        if (this.voiceEnabled && this.voiceConnection?.connected) {
            await this.initializeVoiceSession();
        }
    }
}
