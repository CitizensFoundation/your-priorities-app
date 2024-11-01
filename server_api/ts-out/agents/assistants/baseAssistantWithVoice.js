import { YpBaseAssistant } from "./baseAssistant.js";
import { YpBaseChatBotWithVoice } from "./voiceAssistant.js";
export class YpBaseAssistantWithVoice extends YpBaseAssistant {
    constructor(wsClientId, wsClients, redis, voiceEnabled = false) {
        super(wsClientId, wsClients, redis);
        this.voiceEnabled = voiceEnabled;
        this.voiceBot = new YpBaseChatBotWithVoice(wsClientId, wsClients, undefined, voiceEnabled);
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
    async handleToolCalls(toolCalls) {
        for (const [id, toolCall] of toolCalls.entries()) {
            try {
                const func = this.availableFunctions.get(toolCall.name);
                if (!func) {
                    throw new Error(`Unknown function: ${toolCall.name}`);
                }
                let parsedArgs;
                try {
                    parsedArgs = JSON.parse(toolCall.arguments);
                }
                catch (error) {
                    throw new Error(`Invalid function arguments: ${toolCall.arguments}`);
                }
                const result = await func.handler(parsedArgs);
                if (result.success && result.data) {
                    // Send results to client if there's HTML content
                    if (result.data.html) {
                        this.wsClientSocket.send(JSON.stringify({
                            type: 'bot',
                            message: result.data.message || '',
                            html: result.data.html
                        }));
                    }
                }
                if (!result.success) {
                    throw new Error(result.error || "Unknown error in tool execution");
                }
            }
            catch (error) {
                console.error(`Error executing tool ${toolCall.name}:`, error);
                throw error;
            }
        }
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
