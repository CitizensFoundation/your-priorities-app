import { WebSocket } from "ws";
import { YpBaseAssistant } from "./baseAssistant.js";
import { YpBaseChatBotWithVoice } from "./voiceAssistant.js";
import ioredis from "ioredis";

import log from "../../utils/loggerTs.js";

interface VoiceToolResult extends ToolExecutionResult {
  data?: {
    message?: string;
    html?: string;
    [key: string]: any;
  };
}

export abstract class YpBaseAssistantWithVoice extends YpBaseAssistant {
  protected voiceBot: YpBaseChatBotWithVoice | undefined;
  private mainBotWsHandler?: (data: Buffer) => void; // from createVoiceBot()
  private forwardEventHandler?: (data: Buffer) => void; // from setupVoiceEventForwarder()


  constructor(
    wsClientId: string,
    wsClients: Map<string, WebSocket>,
    redis: ioredis.Redis,
    voiceEnabled: boolean,
    redisKey: string,
    domainId: number
  ) {
    super(wsClientId, wsClients, redis, redisKey, domainId);

    if (!domainId) {
      throw new Error("Domain ID is required");
    }

    this.voiceEnabled = voiceEnabled;
  }

  public override destroy(): void {

    // 2) Remove the WebSocket listener we set up in createVoiceBot()
    const ws = this.wsClients.get(this.wsClientId);
    if (ws && this.mainBotWsHandler) {
      ws.removeListener("message", this.mainBotWsHandler);
      this.mainBotWsHandler = undefined;
    }

    // 3) Remove the forward event handler on the voiceBot socket
    if (this.voiceBot?.wsClientSocket && this.forwardEventHandler) {
      this.voiceBot.wsClientSocket.removeListener("message", this.forwardEventHandler);
      this.forwardEventHandler = undefined;
    }

    if (this.voiceBot) {
      this.voiceBot.destroy();
      this.voiceBot = undefined;
    }

    // 4) Finally call super.destroy()
    super.destroy();
  }

  async initialize() {
    await this.initializeModes();

    if (this.voiceEnabled) {
      this.createVoiceBot();
    }
  }

  async createVoiceBot() {
    this.voiceBot = new YpBaseChatBotWithVoice(
      this.wsClientId,
      this.wsClients,
      this.redisKey,
      this.redis,
      true,
      this
    );
    await this.voiceBot.initializeMainAssistantVoiceConnection();
    this.setupVoiceEventForwarder();

    await this.voiceBot.updateVoiceConfig({
      instructions: this.getCurrentSystemPrompt(),
      tools: this.getCurrentModeFunctions(),
      modalities: ["text", "audio"],
    });

    const ws = this.wsClients.get(this.wsClientId);
    if (ws) {
      this.mainBotWsHandler = async (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          switch (message.type) {
            case "voice_mode":
              await this.setVoiceMode(message.enabled);
              break;
            case "voice_input":
              if (this.voiceEnabled && message.audio) {
                await this.voiceBot?.handleIncomingAudio(
                  Buffer.from(message.audio, "base64")
                );
              }
              break;
          }
        } catch (error) {
          log.error("Error processing message:", error);
        }
      }

      ws.on("message", this.mainBotWsHandler);
    } else {
      log.error("No WebSocket found for client: ", this.wsClientId);
    }
  }

  destroyVoiceBot() {
   if (this.voiceBot?.wsClientSocket && this.forwardEventHandler) {
      this.voiceBot.wsClientSocket.removeListener("message", this.forwardEventHandler);
      this.forwardEventHandler = undefined;
    }

    if (this.voiceBot) {
      this.voiceBot.destroy();
      this.voiceBot = undefined;
    }
  }

  private setupVoiceEventForwarder() {
    // Forward all voice bot events to client
    this.forwardEventHandler = (data: Buffer) => {
      try {
        const event = JSON.parse(data.toString());

        // Forward all voice-related events to client
        if (
          [
            "session.created",
            "session.error",
            "response.generating.started",
            "response.generating.completed",
            "speech.started",
            "speech.stopped",
            "audio",
            "text",
            "input_audio_buffer.committed",
          ].includes(event.type)
        ) {
          this.wsClientSocket.send(data);
          return;
        }

        // Handle message events through parent class
        this.sendToClient(
          event.sender || "bot",
          event.message || "",
          event.type
        );
      } catch (error) {
        log.error("Error forwarding voice event:", error);
      }
    }

    this.voiceBot?.wsClientSocket?.on("message", this.forwardEventHandler);
  }

  async setVoiceMode(enabled: boolean): Promise<void> {
    this.voiceEnabled = enabled;

    if (!this.voiceEnabled) {
      this.destroyVoiceBot();
    }

    this.wsClientSocket.send(
      JSON.stringify({
        type: "voice_mode_changed",
        enabled: this.voiceEnabled,
      })
    );
  }

  async handleModeSwitch(
    newMode: YpAssistantMode,
    reason: string,
    params: any
  ): Promise<void> {
    await super.handleModeSwitch(newMode, reason, params);

    if (this.voiceEnabled) {

      await this.voiceBot?.updateVoiceConfig({
        instructions: this.getCurrentSystemPrompt(),
        tools: this.getCurrentModeFunctions(),
        modalities: ["text", "audio"]
      });

      log.info("handleModeSwitch", newMode, params);

      if (newMode === "agent_direct_connection_mode") {
        this.voiceBot?.initializeDirectAgentVoiceConnection();
      } else {
        await this.voiceBot?.destroyDirectAgentVoiceConnection();
        this.voiceBot?.initializeVoiceSession();
      }
    }
  }

  async conversation(chatLog: YpSimpleChatLog[]) {
    if (this.voiceEnabled) {
      log.info("voiceEnabled: Updating voice config");
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
