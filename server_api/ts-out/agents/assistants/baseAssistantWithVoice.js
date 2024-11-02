import { YpBaseAssistant } from "./baseAssistant.js";
import { YpBaseChatBotWithVoice } from "./voiceAssistant.js";
export class YpBaseAssistantWithVoice extends YpBaseAssistant {
    constructor(wsClientId, wsClients, redis, voiceEnabled = false, currentMode = undefined) {
        super(wsClientId, wsClients, redis);
        if (currentMode) {
            console.log(`Setting currentMode to ${currentMode} it was ${this.memory.currentMode}`);
            this.memory.currentMode = currentMode;
        }
        else {
            console.log(`No currentMode provided, keeping ${this.memory.currentMode}`);
        }
        this.voiceEnabled = voiceEnabled;
        this.voiceBot = new YpBaseChatBotWithVoice(wsClientId, wsClients, undefined, voiceEnabled, this);
        this.setupVoiceEventForwarder();
        const ws = wsClients.get(wsClientId);
        if (ws) {
            ws.on('message', async (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    switch (message.type) {
                        case 'voice_mode':
                            await this.setVoiceMode(message.enabled);
                            break;
                        case 'voice_input':
                            if (this.voiceEnabled && message.audio) {
                                await this.voiceBot.handleIncomingAudio(Buffer.from(message.audio, 'base64'));
                            }
                            break;
                    }
                }
                catch (error) {
                    console.error('Error processing message:', error);
                }
            });
        }
        else {
            console.error("No WebSocket found for client: ", wsClientId);
        }
    }
    setupVoiceEventForwarder() {
        // Forward all voice bot events to client
        this.voiceBot.wsClientSocket.on('message', (data) => {
            try {
                const event = JSON.parse(data.toString());
                // Forward all voice-related events to client
                if ([
                    'session.created',
                    'session.error',
                    'response.generating.started',
                    'response.generating.completed',
                    'speech.started',
                    'speech.stopped',
                    'audio',
                    'text',
                    'input_audio_buffer.committed'
                ].includes(event.type)) {
                    this.wsClientSocket.send(data);
                    return;
                }
                // Handle message events through parent class
                this.sendToClient(event.sender || 'bot', event.message || '', event.type);
            }
            catch (error) {
                console.error('Error forwarding voice event:', error);
            }
        });
    }
    async setVoiceMode(enabled) {
        this.voiceEnabled = enabled;
        await this.voiceBot.setVoiceMode(enabled);
        if (enabled) {
            await this.voiceBot.updateVoiceConfig({
                instructions: this.getCurrentSystemPrompt(),
                tools: this.getCurrentModeFunctions(),
                modalities: ['text', 'audio']
            });
        }
        this.wsClientSocket.send(JSON.stringify({
            type: 'voice_mode_changed',
            enabled: this.voiceEnabled
        }));
    }
    async handleModeSwitch(newMode, reason) {
        await super.handleModeSwitch(newMode, reason);
        if (this.voiceEnabled) {
            await this.voiceBot.updateVoiceConfig({
                instructions: this.getCurrentSystemPrompt(),
                tools: this.getCurrentModeFunctions(),
                modalities: ['text', 'audio']
            });
        }
    }
    async conversation(chatLog) {
        if (this.voiceEnabled) {
            console.log("voiceEnabled: Updating voice config");
            await this.voiceBot.updateVoiceConfig({
                instructions: this.getCurrentSystemPrompt(),
                tools: this.getCurrentModeFunctions(),
                modalities: ['text', 'audio']
            });
            return this.voiceBot.conversation(chatLog);
        }
        return super.conversation(chatLog);
    }
}
