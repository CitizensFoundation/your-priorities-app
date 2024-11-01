import { YpBaseChatBot } from "../../active-citizen/llms/baseChatBot.js";
import { ChatbotFunction } from "./baseAssistant.js";
import WebSocket from "ws";

interface VoiceMessage {
  type: string;
  content?: string;
  audio?: string; // base64 encoded audio
  metadata?: any;
}

interface VoiceState {
  speaking: boolean;
  listening: boolean;
  processingAudio: boolean;
  lastAudioTimestamp?: number;
}

interface VoiceConnectionConfig {
  model: string;
  voice: string;
  instructions?: string;
  tools?: ChatbotFunction[];
  modalities: ("text" | "audio")[];
}

interface RealtimeVoiceConnection {
  ws: WebSocket;
  connected: boolean;
  model: string;
  voice: string;
}

// Extend the base class with voice capabilities
export class YpBaseChatBotWithVoice extends YpBaseChatBot {
  protected voiceEnabled: boolean = false;
  voiceConnection?: RealtimeVoiceConnection;
  protected voiceConfig: VoiceConnectionConfig;
  protected voiceState: VoiceState;
  protected audioBuffer: Uint8Array[] = [];
  protected readonly VAD_TIMEOUT = 1000; // 1 second of silence for VAD
  protected vadTimeout?: NodeJS.Timeout;

  constructor(
    wsClientId: string,
    wsClients: Map<string, WebSocket>,
    memoryId: string | undefined = undefined,
    voiceEnabled: boolean = false
  ) {
    super(wsClientId, wsClients, memoryId);
    this.voiceEnabled = voiceEnabled;
    this.voiceState = {
      speaking: false,
      listening: false,
      processingAudio: false
    };

    // Default voice configuration
    this.voiceConfig = {
      model: "gpt-4o-realtime-preview-2024-10-01",
      voice: "alloy",
      modalities: ["text", "audio"]
    };
  }

  protected async initializeVoiceConnection(): Promise<void> {
    if (!this.voiceEnabled) return;

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

    } catch (error) {
      console.error("Failed to initialize voice connection:", error);
      throw error;
    }
  }

  protected setupVoiceMessageHandlers(ws: WebSocket): void {
    ws.on("message", async (data) => {
      try {
        const event = JSON.parse(data.toString());

        console.log("voiceMessage: ", JSON.stringify(event, null, 2));

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

          case "speech.started":
            this.handleSpeechStarted();
            break;

          case "speech.stopped":
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

          default:
            console.log("Unhandled voice event type:", event.type);
            break;
        }
      } catch (error) {
        console.error("Error handling voice message:", error);
      }
    });
  }

  // Handle incoming audio from client
  async handleIncomingAudio(audioData: Uint8Array): Promise<void> {
    console.log(`handleIncomingAudio: ${audioData.length} ${this.voiceEnabled} ${this.voiceConnection?.ws}`);
    if (!this.voiceConnection?.ws || !this.voiceEnabled) return;

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
  private async handleVADSilence(): Promise<void> {
    if (!this.voiceConnection?.ws || !this.voiceState.listening) return;

    // Commit the audio buffer
    const commitMessage = {
      type: "input_audio_buffer.commit"
    };

    this.voiceConnection.ws.send(JSON.stringify(commitMessage));
    this.audioBuffer = []; // Clear the buffer
    this.voiceState.processingAudio = true;
  }

  // Handle speech started event
  private handleSpeechStarted(): void {
    this.voiceState.listening = true;
    this.sendToClient("bot", "", "listening_start");
  }

  // Handle speech stopped event
  private async handleSpeechStopped(): Promise<void> {
    this.voiceState.listening = false;
    this.sendToClient("bot", "", "listening_stop");

    // If we're not already processing, commit the buffer
    if (!this.voiceState.processingAudio) {
      await this.handleVADSilence();
    }
  }

  // Handle audio output from server
  private async handleAudioOutput(event: VoiceMessage): Promise<void> {
    if (!event.audio) return;

    // Forward audio to client
    const audioMessage = {
      sender: "bot",
      type: "audio",
      audio: event.audio // base64 encoded audio
    };

    this.wsClientSocket.send(JSON.stringify(audioMessage));
  }

  // Handle text output from server
  private async handleTextOutput(event: VoiceMessage): Promise<void> {
    if (!event.content) return;

    // Add to chat log
    this.memory.chatLog!.push({
      sender: "bot",
      message: event.content
    } as PsSimpleChatLog);

    // Send to client
    this.sendToClient("bot", event.content);
  }

  // Handle audio buffer committed event
  private async handleAudioBufferCommitted(event: VoiceMessage): Promise<void> {
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

  protected async initializeVoiceSession(): Promise<void> {
    if (!this.voiceConnection?.ws) return;

    // First create the response with initial configuration
    const createResponse = {
      type: "response.create",
      response: {
        modalities: this.voiceConfig.modalities,
        instructions: this.renderSystemPrompt()
      }
    };
    this.voiceConnection.ws.send(JSON.stringify(createResponse));

    // Then update the session with full configuration
    const sessionConfig = {
      type: "session.update",
      session: {
        ...this.voiceConfig,
        instructions: this.renderSystemPrompt(),
        //@ts-ignore
        tools: this.getCurrentModeFunctions ? this.getCurrentModeFunctions() : undefined,
        input_audio_transcription: {
          enabled: true,
          model: "whisper-1"
        },
        turn_detection: {
          mode: "server_vad"  // Use server-side Voice Activity Detection
        }
      }
    };

    this.voiceConnection.ws.send(JSON.stringify(sessionConfig));
  }

  // Override the base conversation method to handle both text and voice
  async conversation(chatLog: PsSimpleChatLog[]) {
    await this.setChatLog(chatLog);

    if (this.voiceEnabled && this.voiceConnection?.connected) {
      return this.handleVoiceConversation(chatLog);
    } else {
      return super.conversation(chatLog);
    }
  }

  protected async handleVoiceConversation(chatLog: PsSimpleChatLog[]): Promise<void> {
    if (!this.voiceConnection?.ws) return;

    // Check if the last message contains audio or text
    const lastMessage = chatLog[chatLog.length - 1];

    if (lastMessage.base64Audio) {
      // Handle audio input
      await this.handleIncomingAudio(Buffer.from(lastMessage.base64Audio, 'base64'));
    } else {
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
  protected async handleVoiceSessionCreated(event: any): Promise<void> {
    console.log("Voice session created:", event.session.id);
    // Additional session initialization if needed
  }

  protected async handleVoiceSessionError(event: any): Promise<void> {
    console.error("Voice session error:", event.error);
    this.sendToClient("bot", "Voice processing error occurred", "error");
  }

  protected async handleVoiceResponseStatus(event: any): Promise<void> {
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
  async streamWebSocketResponses(stream: any) {
    if (this.voiceEnabled) {
      // For voice mode, responses are handled through the WebSocket event handlers
      return;
    }
    // Otherwise, use the original implementation
    return super.streamWebSocketResponses(stream);
  }

  // Helper method to switch between voice and text modes
  async setVoiceMode(enabled: boolean): Promise<void> {
    this.voiceEnabled = enabled;
    if (enabled) {
      console.log("setVoiceMode: initializing voice connection");
      await this.initializeVoiceConnection();
    } else {
      console.log("setVoiceMode: closing voice connection");
      // Clean up voice connection if it exists
      if (this.voiceConnection?.ws) {
        this.voiceConnection.ws.close();
        this.voiceConnection = undefined;
      }
    }
  }

  // Method to update voice configuration
  async updateVoiceConfig(config: Partial<VoiceConnectionConfig>): Promise<void> {
    this.voiceConfig = {
      ...this.voiceConfig,
      ...config
    };

    if (this.voiceEnabled && this.voiceConnection?.connected) {
      await this.initializeVoiceSession();
    }
  }
}