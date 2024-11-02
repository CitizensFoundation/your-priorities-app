import { YpBaseChatBot } from "../../active-citizen/llms/baseChatBot.js";
import { ChatbotFunction, YpBaseAssistant } from "./baseAssistant.js";
import WebSocket from "ws";

interface VoiceMessage {
  delta: any;
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

  memory!: YpBaseAssistantMemoryData;

  protected parentAssistant?: YpBaseAssistant;

  constructor(
    wsClientId: string,
    wsClients: Map<string, WebSocket>,
    memoryId: string,
    voiceEnabled: boolean = false,
    parentAssistant?: YpBaseAssistant
  ) {
    super(wsClientId, wsClients, memoryId);
    this.parentAssistant = parentAssistant;
    this.voiceEnabled = voiceEnabled;
    this.voiceState = {
      speaking: false,
      listening: false,
      processingAudio: false,
    };

    // Default voice configuration
    this.voiceConfig = {
      model: "gpt-4o-realtime-preview-2024-10-01",
      voice: "verse",
      modalities: ["text", "audio"],
    };
  }

  async initializeVoiceConnection(): Promise<void> {
    if (!this.voiceEnabled) return;

    console.log("initializeVoiceConnection");

    const url = "wss://api.openai.com/v1/realtime";
    const wsConfig = {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Beta": "realtime=v1",
      },
    };

    try {
      const ws = new WebSocket(
        `${url}?model=${this.voiceConfig.model}`,
        wsConfig
      );

      ws.on("open", () => {
        console.log("Voice connection established");
        this.voiceConnection = {
          ws,
          connected: true,
          model: this.voiceConfig.model,
          voice: this.voiceConfig.voice,
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

  destroyVoiceConnection() {
    if (this.vadTimeout) {
      clearTimeout(this.vadTimeout);
      this.vadTimeout = undefined;
    }

    // Reset voice state
    this.voiceState = {
      speaking: false,
      listening: false,
      processingAudio: false,
    };

    // Clear audio buffer
    this.audioBuffer = [];

    // Close WebSocket connection
    if (this.voiceConnection?.ws) {
      this.voiceConnection.ws.close();
      this.voiceConnection.connected = false;
      this.voiceConnection = undefined;
    }
  }

  protected setupVoiceMessageHandlers(ws: WebSocket): void {
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
      } catch (error) {
        console.error("Error handling voice message:", error);
      }
    });
  }

  async callFunctionHandler(event: any): Promise<void> {
    const tools = this.parentAssistant?.getCurrentModeFunctions();
    if (!tools) return;

    console.log("callFunctionHandler event: ", JSON.stringify(event, null, 2));

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
      await this.parentAssistant?.setModeData(
        `${toolName}_result`,
        result.data
      );
    }

    // Generate a user-friendly message based on the tool result
    const resultMessage = `<contextFromRetrievedData>${JSON.stringify(
      result.data,
      null,
      2
    )}</contextFromRetrievedData>`;
    if (result.data) {
      this.sendToClient(
        "assistant",
        resultMessage,
        "hiddenContextMessage",
        true
      );
      if (toolName === "switch_mode") {
        const createResponse = {
          type: "response.create",
          response: {
            modalities: this.voiceConfig.modalities,
            instructions: "Inform the user about the mode change",
          },
        };
        this.voiceConnection?.ws.send(JSON.stringify(createResponse));
      }
      /*this.memory.chatLog!.push({
        sender: "assistant",
        hiddenContextMessage: true,
        message: resultMessage,
      });
      await this.saveMemoryIfNeeded();*/
    } else {
      console.error(`No data returned from tool execution: ${event.name}`);
    }

    if (result.html) {
      this.sendToClient("assistant", result.html, "html", true);
    }

    const responseEvent = {
      type: "conversation.item.create",
      item: {
        type: "function_call_output",
        call_id: event.call_id,
        output: JSON.stringify(result.data, null, 2),
      },
    };

    this.voiceConnection?.ws.send(JSON.stringify(responseEvent));
  }

  async proxyToClient(event: any): Promise<void> {
    console.log("proxyToClient: ", event.type);
    console.log(JSON.stringify(event, null, 2));

    const proxyMessage = {
      sender: "assistant",
      type: event.type,
      data: event,
    };

    this.wsClientSocket.send(JSON.stringify(proxyMessage));
  }

  // Handle incoming audio from client
  async handleIncomingAudio(audioData: Uint8Array): Promise<void> {
    //console.log(`handleIncomingAudio: ${audioData.length} ${this.voiceEnabled} ${this.voiceConnection?.ws}`);
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
      audio: Buffer.from(audioData).toString("base64"),
    };

    console.log("Sending audio message to server:");

    this.voiceConnection.ws.send(JSON.stringify(audioMessage));
  }

  // Handle Voice Activity Detection silence
  private async handleVADSilence(): Promise<void> {
    if (!this.voiceConnection?.ws || !this.voiceState.listening) return;

    // Commit the audio buffer
    const commitMessage = {
      type: "input_audio_buffer.commit",
    };

    this.voiceConnection.ws.send(JSON.stringify(commitMessage));
    this.audioBuffer = []; // Clear the buffer
    this.voiceState.processingAudio = true;
  }

  // Handle speech started event
  private handleSpeechStarted(): void {
    this.voiceState.listening = true;
    this.sendToClient("assistant", "", "listening_start");
  }

  // Handle speech stopped event
  private async handleSpeechStopped(): Promise<void> {
    this.voiceState.listening = false;
    this.sendToClient("assistant", "", "listening_stop");

    // If we're not already processing, commit the buffer
    if (!this.voiceState.processingAudio) {
      await this.handleVADSilence();
    }
  }

  async handleAudioDelta(event: VoiceMessage): Promise<void> {
    if (!event.delta) return;

    const audioMessage = {
      sender: "assistant",
      type: "audio",
      base64Audio: event.delta, // base64 encoded audio
    } as YpAssistantMessage;

    this.wsClientSocket.send(JSON.stringify(audioMessage));
  }

  // Handle text output from server
  private async handleTextOutput(event: VoiceMessage): Promise<void> {
    if (!event.content) return;

    // Add to chat log
    this.memory.chatLog!.push({
      sender: "assistant",
      message: event.content,
    } as PsSimpleChatLog);

    // Send to client
    this.sendToClient("assistant", event.content);
  }

  // Handle audio buffer committed event
  private async handleAudioBufferCommitted(event: VoiceMessage): Promise<void> {
    this.voiceState.processingAudio = false;

    // Request a response if we're not already speaking
    if (!this.voiceState.speaking) {
      const responseEvent = {
        type: "response.create",
        response: {
          modalities: this.voiceConfig.modalities,
        },
      };

      this.voiceConnection?.ws.send(JSON.stringify(responseEvent));
    }
  }

  protected async initializeVoiceSession(): Promise<void> {
    if (!this.voiceConnection?.ws) return;

    console.log(
      "======================> initializeVoiceSession current mode",
      this.memory?.currentMode
    );

    console.log(
      "======================> initializeVoiceSession system prompt",
      this.parentAssistant?.getCurrentSystemPrompt()
    );
    console.log(
      "======================> initializeVoiceSession functions",
      this.parentAssistant?.getCurrentModeFunctions()
    );
    console.log(
      "======================> initializeVoiceSession chat log",
      JSON.stringify(this.memory?.chatLog, null, 2)
    );

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
          model: "whisper-1",
        },
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
        },
      },
    };

    console.log(
      "Sending session config to server:",
      JSON.stringify(sessionConfig, null, 2)
    );

    this.voiceConnection.ws.send(JSON.stringify(sessionConfig));

    const createResponse = {
      type: "response.create",
      response: {
        modalities: this.voiceConfig.modalities,
        instructions: "Say hi to the user",
      },
    };
    this.voiceConnection.ws.send(JSON.stringify(createResponse));
  }

  // Handle voice-specific events
  protected async handleVoiceSessionCreated(event: any): Promise<void> {
    console.log("Voice session created:", event.session.id);
    // Additional session initialization if needed
  }

  protected async handleVoiceSessionError(event: any): Promise<void> {
    console.error("Voice session error:", event.error);
    this.sendToClient("system", "Voice processing error occurred", "error");
  }

  protected async handleVoiceResponseStatus(event: any): Promise<void> {
    switch (event.type) {
      case "response.generating.started":
        this.sendToClient("assistant", "", "start");
        break;
      case "response.generating.completed":
        this.sendToClient("assistant", "", "end");
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

  // Method to update voice configuration
  async updateVoiceConfig(
    config: Partial<VoiceConnectionConfig>
  ): Promise<void> {
    this.voiceConfig = {
      ...this.voiceConfig,
      ...config,
    };

    if (this.voiceEnabled && this.voiceConnection?.connected) {
      await this.initializeVoiceSession();
    }
  }
}
