import { YpBaseAssistant } from "./baseAssistant.js";
import { YpBaseChatBotWithVoice } from "./voiceAssistant.js";
export class YpBaseAssistantWithVoice extends YpBaseAssistant {
    constructor(wsClientId, wsClients, redis, voiceEnabled = false) {
        super(wsClientId, wsClients, redis);
        this.voiceEnabled = voiceEnabled;
        this.voiceBot = new YpBaseChatBotWithVoice(wsClientId, wsClients, undefined, voiceEnabled);
        // Add WebSocket event listener for voice mode switching
        const ws = wsClients.get(wsClientId);
        if (ws) {
            ws.on('message', async (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    if (message.type === 'voice_mode') {
                        await this.setVoiceMode(message.enabled);
                    }
                }
                catch (error) {
                    console.error('Error processing voice mode message:', error);
                }
            });
        }
    }
    // Override conversation method to handle both modes
    async conversation(chatLog) {
        if (this.voiceEnabled) {
            // Update voice configuration with current mode's settings
            await this.voiceBot.updateVoiceConfig({
                instructions: this.getCurrentSystemPrompt(),
                tools: this.getCurrentModeFunctions()
            });
            return this.voiceBot.conversation(chatLog);
        }
        return super.conversation(chatLog);
    }
    // Add method to switch between voice and text modes
    async setVoiceMode(enabled) {
        this.voiceEnabled = enabled;
        await this.voiceBot.setVoiceMode(enabled);
        // Update voice configuration when enabling voice mode
        if (enabled) {
            await this.voiceBot.updateVoiceConfig({
                instructions: this.getCurrentSystemPrompt(),
                tools: this.getCurrentModeFunctions()
            });
        }
    }
    // Override mode switching to update voice configuration
    async handleModeSwitch(newMode, reason) {
        await super.handleModeSwitch(newMode, reason);
        if (this.voiceEnabled) {
            // Update voice configuration with new mode's settings
            await this.voiceBot.updateVoiceConfig({
                instructions: this.getCurrentSystemPrompt(),
                tools: this.getCurrentModeFunctions()
            });
        }
    }
}
