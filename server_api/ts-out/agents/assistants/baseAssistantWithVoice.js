import { YpBaseAssistant } from "./baseAssistant.js";
import { YpBaseChatBotWithVoice } from "./voiceAssistant.js";
export class YpBaseAssistantWithVoice extends YpBaseAssistant {
    constructor(wsClientId, wsClients, redis, voiceEnabled, currentMode, domainId, memoryId) {
        super(wsClientId, wsClients, redis, domainId, memoryId, currentMode);
        if (!domainId) {
            throw new Error("Domain ID is required");
        }
        this.voiceEnabled = voiceEnabled;
    }
    async initialize() {
        await this.initializeModes();
        this.registerCoreFunctions();
        if (this.voiceEnabled) {
            this.createVoiceBot();
        }
    }
    async createVoiceBot() {
        this.voiceBot = new YpBaseChatBotWithVoice(this.wsClientId, this.wsClients, this.memoryId, true, this);
        await this.voiceBot.initializeVoiceConnection();
        this.setupVoiceEventForwarder();
        await this.voiceBot.updateVoiceConfig({
            instructions: this.getCurrentSystemPrompt(),
            tools: this.getCurrentModeFunctions(),
            modalities: ["text", "audio"],
        });
        const ws = this.wsClients.get(this.wsClientId);
        if (ws) {
            ws.on("message", async (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    switch (message.type) {
                        case "voice_mode":
                            await this.setVoiceMode(message.enabled);
                            break;
                        case "voice_input":
                            if (this.voiceEnabled && message.audio) {
                                await this.voiceBot?.handleIncomingAudio(Buffer.from(message.audio, "base64"));
                            }
                            break;
                    }
                }
                catch (error) {
                    console.error("Error processing message:", error);
                }
            });
        }
        else {
            console.error("No WebSocket found for client: ", this.wsClientId);
        }
    }
    destroyVoiceBot() {
        this.voiceBot?.destroyVoiceConnection();
        this.voiceBot = undefined;
    }
    setupVoiceEventForwarder() {
        // Forward all voice bot events to client
        this.voiceBot?.wsClientSocket?.on("message", (data) => {
            try {
                const event = JSON.parse(data.toString());
                // Forward all voice-related events to client
                if ([
                    "session.created",
                    "session.error",
                    "response.generating.started",
                    "response.generating.completed",
                    "speech.started",
                    "speech.stopped",
                    "audio",
                    "text",
                    "input_audio_buffer.committed",
                ].includes(event.type)) {
                    this.wsClientSocket.send(data);
                    return;
                }
                // Handle message events through parent class
                this.sendToClient(event.sender || "bot", event.message || "", event.type);
            }
            catch (error) {
                console.error("Error forwarding voice event:", error);
            }
        });
    }
    async setVoiceMode(enabled) {
        this.voiceEnabled = enabled;
        if (!this.voiceEnabled) {
            this.destroyVoiceBot();
        }
        this.wsClientSocket.send(JSON.stringify({
            type: "voice_mode_changed",
            enabled: this.voiceEnabled,
        }));
    }
    async handleModeSwitch(newMode, reason) {
        await super.handleModeSwitch(newMode, reason);
        if (this.voiceEnabled) {
            await this.voiceBot?.updateVoiceConfig({
                instructions: this.getCurrentSystemPrompt(),
                tools: this.getCurrentModeFunctions(),
                modalities: ["text", "audio"],
            });
        }
    }
    async conversation(chatLog) {
        if (this.voiceEnabled) {
            console.log("voiceEnabled: Updating voice config");
            await this.voiceBot?.updateVoiceConfig({
                instructions: this.getCurrentSystemPrompt(),
                tools: this.getCurrentModeFunctions(),
                modalities: ["text", "audio"],
            });
            return this.voiceBot?.conversation(chatLog);
        }
        return super.conversation(chatLog);
    }
}
