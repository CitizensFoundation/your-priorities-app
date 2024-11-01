import { WebSocket } from "ws";
import { YpBaseAssistant } from "./baseAssistant.js";
import { YpBaseChatBotWithVoice } from "./voiceAssistant.js";
import ioredis from "ioredis";

export abstract class YpBaseAssistantWithVoice extends YpBaseAssistant {
  protected voiceEnabled: boolean;
  protected voiceBot: YpBaseChatBotWithVoice;

  constructor(
    wsClientId: string,
    wsClients: Map<string, WebSocket>,
    redis: ioredis.Redis,
    voiceEnabled: boolean = false
  ) {
    super(wsClientId, wsClients, redis);
    this.voiceEnabled = voiceEnabled;
    this.voiceBot = new YpBaseChatBotWithVoice(wsClientId, wsClients, undefined, voiceEnabled);

    // Add WebSocket event listener for voice mode switching
    const ws = wsClients.get(wsClientId);
    if (ws) {
      ws.on('message', async (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          if (message.type === 'voice_mode') {
            await this.setVoiceMode(message.enabled);
          }
        } catch (error) {
          console.error('Error processing voice mode message:', error);
        }
      });
    }
  }

  // Override conversation method to handle both modes
  async conversation(chatLog: PsSimpleChatLog[]) {
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
  async setVoiceMode(enabled: boolean): Promise<void> {
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
  async handleModeSwitch(newMode: string, reason?: string): Promise<void> {
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