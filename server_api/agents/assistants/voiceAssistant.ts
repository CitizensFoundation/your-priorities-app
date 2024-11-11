import { response } from "express";
import { YpBaseChatBot } from "../../active-citizen/llms/baseChatBot.js";
import { YpBaseAssistant } from "./baseAssistant.js";
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
  tools?: AssistantChatbotTool[];
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
  assistantVoiceConnection?: RealtimeVoiceConnection;
  directAgentVoiceConnection?: RealtimeVoiceConnection;

  protected voiceConfig: VoiceConnectionConfig;
  protected voiceState: VoiceState;

  protected readonly VAD_TIMEOUT = 1000; // 1 second of silence for VAD
  protected vadTimeout?: NodeJS.Timeout;

  protected parentAssistant: YpBaseAssistant;

  sendTranscriptsToClient = false;

  isWaitingOnCancelResponseCompleted = false;

  lastNumberOfChatHistoryForInstructions = 15;

  exitMessageFromDirectAgentConversation: string | undefined;

  constructor(
    wsClientId: string,
    wsClients: Map<string, WebSocket>,
    memoryId: string,
    voiceEnabled: boolean = false,
    parentAssistant: YpBaseAssistant
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

    this.parentAssistant.on("update-ai-model-session", this.updateAiModelSession.bind(this));
  }

  updateAiModelSession(message: string) {
    console.log(`updateAiModelSession: ${message}`);
    this.initializeVoiceSession(message);
  }

  async initializeMainAssistantVoiceConnection(): Promise<void> {
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
        this.assistantVoiceConnection = {
          ws,
          connected: true,
          model: this.voiceConfig.model,
          voice: this.voiceConfig.voice,
        };
        this.initializeVoiceSession();
      });

      ws.on("close", () => {
        console.log("Voice connection to OpenAI closed");
        this.assistantVoiceConnection = undefined;
      });

      ws.on("error", (error) => {
        console.error("Voice connection error:", error);
        this.assistantVoiceConnection = undefined;
      });

      this.setupVoiceMessageHandlers(ws, true);
    } catch (error) {
      console.error("Failed to initialize voice connection:", error);
      throw error;
    }
  }

  async initializeDirectAgentVoiceConnection(): Promise<void> {
    if (!this.voiceEnabled) return;

    await this.sendCancelResponse();

    if (this.parentAssistant.memory.currentAgentStatus?.agentProduct.name) {
      this.exitMessageFromDirectAgentConversation = `Welcome the user back from their conversation with the ${this.parentAssistant.memory.currentAgentStatus.agentProduct.name}. (it happened on a seperate channel). Now help the user with agent selection and subscription management.`;
    }

    this.sendToClient("assistant", "", "clear_audio_buffer");

    if (this.directAgentVoiceConnection) {
      console.log("Direct agent voice connection already initialized, closing");
      this.destroyDirectAgentVoiceConnection();
    }

    console.log("initializeDirectAgentVoiceConnection");

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
        console.log("Agent voice connection established");
        this.directAgentVoiceConnection = {
          ws,
          connected: true,
          model: this.voiceConfig.model,
          voice: this.voiceConfig.voice,
        };
        this.initializeVoiceSession();
      });

      ws.on("close", () => {
        console.log("Agent voice connection to OpenAI closed");
        this.directAgentVoiceConnection = undefined;
      });

      ws.on("error", (error) => {
        console.error("Agent voice connection error:", error);
        this.directAgentVoiceConnection = undefined;
      });

      this.setupVoiceMessageHandlers(ws, false);
    } catch (error) {
      console.error("Failed to initialize voice connection:", error);
      throw error;
    }
  }

  async destroyDirectAgentVoiceConnection() {
    if (this.directAgentVoiceConnection) {
      this.directAgentVoiceConnection.ws.close();
      this.directAgentVoiceConnection.connected = false;
      this.directAgentVoiceConnection = undefined;
      this.parentAssistant.memory.chatLog!.push({
        sender: "user",
        message:
          "Thank you for the information, I would not like to speak to the main assistant about selecting agents or managing subscriptions",
      } as PsSimpleChatLog);
      await this.saveMemory();
    }
  }

  destroyAssistantVoiceConnection() {
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

    // Close WebSocket connection
    if (this.assistantVoiceConnection?.ws) {
      this.assistantVoiceConnection.ws.close();
      this.assistantVoiceConnection.connected = false;
      this.assistantVoiceConnection = undefined;
    }
  }

  protected setupVoiceMessageHandlers(
    ws: WebSocket,
    disableWhenAgentIsSpeaking: boolean
  ): void {
    ws.on("message", async (data) => {
      try {
        const event = JSON.parse(data.toString());

        if (disableWhenAgentIsSpeaking && this.directAgentVoiceConnection) {
          console.log(
            "Voice message received but agent is speaking, ignoring",
            event.type
          );
          return;
        }

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

          case "response.cancelled":
            console.log(
              "-------------------MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMZZZZZZZZZZZZZZ>>>>>>>>>>>>>>>>>>> response.cancelled"
            );
            this.isWaitingOnCancelResponseCompleted = false;
            break;

          case "conversation.item.input_audio_transcription.completed":
            await this.handleAudioTranscriptDone(event);
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

          case "response.output_item.done":
            await this.handleResponseDone(event);
            break;

          case "response.function_call_arguments.done":
            await this.callFunctionHandler(event);
            break;

          default:
            console.log("Unhandled voice event type:", event.type);
            if (event.type === "error") {
              console.log(JSON.stringify(event, null, 2));
            }
            break;
        }
      } catch (error) {
        console.error("Error handling voice message:", error);
      }
    });
  }

  async handleResponseDone(event: any): Promise<void> {
    if (event.item?.content && event.item.content.length > 0) {
      if (this.sendTranscriptsToClient) {
        this.sendToClient(
          "assistant",
          event.item.content[0].transcript,
          "message"
        );
      }
      this.parentAssistant.addAssistantMessage(
        event.item.content[0].transcript
      );
    } else {
      console.error("No text in response.done event");
    }
  }

  async handleAudioTranscriptDone(event: any): Promise<void> {
    if (event.transcript) {
      if (this.sendTranscriptsToClient) {
        this.sendToClient("user", event.transcript, "message");
      }
      this.parentAssistant.addUserMessage(event.transcript);
    }
  }

  //TODO: Don't have this duplicated in the voice assistant and main assistant
  async callFunctionHandler(event: any): Promise<void> {
    const tools = this.parentAssistant.getCurrentModeFunctions();
    if (!tools) return;

    //console.log("callFunctionHandler event: ", JSON.stringify(event, null, 2));

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
      await this.parentAssistant.setModeData(
        `${toolName}_result`,
        result.data
      );
    }

    let resultData = result.data || result.error;

    // Generate a user-friendly message based on the tool result
    const resultMessage = `<contextFromRetrievedData>${JSON.stringify(
      resultData,
      null,
      2
    )}</contextFromRetrievedData>`;
    if (resultData) {
      this.sendToClient(
        "assistant",
        resultMessage,
        "hiddenContextMessage",
        true
      );
      if (toolName === "switch_mode") {
        const createResponse = {
          type: "response.create",
          event_id: `switchMode_${this.getRandomStringAscii(10)}`,
          response: {
            modalities: this.voiceConfig.modalities,
            instructions: "Inform the user about the mode change",
            tools: this.parentAssistant.getCurrentModeFunctions(),
          },
        };
        this.assistantVoiceConnection?.ws.send(JSON.stringify(createResponse));
      }
      /*this.parentAssistant.memory.chatLog!.push({
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
      this.parentAssistant.addAssistantHtmlMessage(result.html);
    }

    if (result.clientEvents) {
      console.log(`clientEvents: ${JSON.stringify(result.clientEvents, null, 2)}`);

      for (const clientEvent of result.clientEvents) {
        this.sendToClient(
          "assistant",
          clientEvent.details,
          clientEvent.name as YpAssistantMessageType
        );
      }
    }

    if (!result.success) {
      console.error(`Tool execution failed: ${event.name} ${result.error}`);
    }

    const responseEvent = {
      type: "conversation.item.create",
      event_id: `callFunctionHandler_${this.getRandomStringAscii(10)}`,
      item: {
        type: "function_call_output",
        call_id: event.call_id,
        output: JSON.stringify(resultData, null, 2),
      },
    };

    this.sendToVoiceConnection(responseEvent);

    if (result.error) {
      const createResponse = {
        type: "response.create",
        event_id: `callFunctionHandlerError_${this.getRandomStringAscii(10)}`,
        response: {
          modalities: this.voiceConfig.modalities,
          instructions: "Inform the user about the tool execution error",
          tools: this.parentAssistant.getCurrentModeFunctions(),
        },
      };
      this.sendToVoiceConnection(createResponse);
    }
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
    //console.log(`handleIncomingAudio: ${audioData.length} ${this.voiceEnabled} ${this.assistantVoiceConnection?.ws}`);
    if (!this.assistantVoiceConnection?.ws || !this.voiceEnabled) return;

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
      event_id: `bufferAppend_${this.getRandomStringAscii(10)}`,
      audio: Buffer.from(audioData).toString("base64"),
    };

    //console.log("Sending audio message to server:");

    this.sendToVoiceConnection(audioMessage);
  }

  // Handle Voice Activity Detection silence
  private async handleVADSilence(): Promise<void> {
    if (!this.assistantVoiceConnection?.ws || !this.voiceState.listening)
      return;

    // Commit the audio buffer
    const commitMessage = {
      type: "input_audio_buffer.commit",
      event_id: `handleVADSilence_${this.getRandomStringAscii(10)}`,
    };

    this.sendToVoiceConnection(commitMessage);
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
    this.parentAssistant.memory.chatLog!.push({
      sender: "assistant",
      message: event.content,
    } as PsSimpleChatLog);

    // Send to client
    this.sendToClient("assistant", event.content);
  }

  sendToVoiceConnection(message: any): void {
    if (
      this.directAgentVoiceConnection &&
      this.directAgentVoiceConnection.connected
    ) {
      this.directAgentVoiceConnection.ws.send(JSON.stringify(message));
    } else {
      this.assistantVoiceConnection?.ws.send(JSON.stringify(message));
    }
  }

  // Handle audio buffer committed event
  private async handleAudioBufferCommitted(event: VoiceMessage): Promise<void> {
    this.voiceState.processingAudio = false;
  }

  async waitForCancelResponseCompleted(): Promise<void> {
    this.isWaitingOnCancelResponseCompleted = true;

    await Promise.race([
      new Promise((resolve) => {
        const checkFlag = () => {
          if (!this.isWaitingOnCancelResponseCompleted) {
            console.log("Cancel response completed from event");
            resolve(true);
          } else {
            setTimeout(checkFlag, 10); // Check every 10ms
          }
        };
        checkFlag();
      }),
      new Promise((resolve) => setTimeout(resolve, 75)),
    ]);

    console.log("Cancel response completed from timeout");
  }

  async sendCancelResponse(): Promise<void> {
    const cancelResponse = {
      type: "response.cancel",
      event_id: `sendCancelResponse_${this.getRandomStringAscii(10)}`,
    };
    this.sendToVoiceConnection(cancelResponse);

    console.log("Have sent cancel response");

    await this.waitForCancelResponseCompleted();
  }

  async initializeVoiceSession(customResponseMessage?: string): Promise<void> {
    if (!this.assistantVoiceConnection?.ws) return;

    console.log(
      "======================> initializeVoiceSession current mode",
      this.parentAssistant.memory.currentMode
    );

    console.log(
      "======================> initializeVoiceSession system prompt",
      this.parentAssistant.getCurrentSystemPrompt()
    );
    console.log(
      "======================> initializeVoiceSession functions",
      this.parentAssistant.getCurrentModeFunctions()
    );

    let chatHistory;

    if (
      this.parentAssistant.memory &&
      this.parentAssistant.memory.chatLog &&
      this.parentAssistant.memory.chatLog.length > 0
    ) {
      chatHistory = JSON.stringify(
        this.parentAssistant.memory.chatLog
          .filter((message) => message.message != "")
          .slice(-this.lastNumberOfChatHistoryForInstructions)
          .map((message) => ({
            role: message.sender,
            content: message.message,
          }))
      );
    }

    let instructions = this.parentAssistant.getCurrentSystemPrompt() || "";

    //console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< initializeVoiceSession current mode", JSON.stringify(this.parentAssistant.memory, null, 2));

    let voiceName = this.voiceConfig.voice;

    if (
      this.parentAssistant.memory.currentMode ===
        "agent_direct_connection_mode" &&
      this.parentAssistant.memory.currentAgentStatus?.agentProduct
        .configuration.avatar?.voiceName
    ) {
      voiceName =
        this.parentAssistant.memory.currentAgentStatus?.agentProduct
          .configuration.avatar.voiceName;

      instructions = `${this.parentAssistant.memory.currentAgentStatus?.agentProduct.configuration.avatar.systemPrompt}\n${instructions}`;
      this.parentAssistant.sendAvatarUrlChange(
        this.parentAssistant.memory.currentAgentStatus?.agentProduct
          .configuration.avatar.imageUrl
      );
    } else {
      this.parentAssistant.sendAvatarUrlChange(null);
    }

    if (chatHistory) {
      instructions += `\n\n<ImportantPreviousChatHistory>\n${chatHistory}\n</ImportantPreviousChatHistory>`;
    }

    console.log(
      "======================> initializeVoiceSession final instructions",
      instructions
    );

    // Then update the session with full configuration
    const sessionConfig = {
      type: "session.update",
      event_id: `initializeVoiceSession_${this.getRandomStringAscii(10)}`,
      session: {
        ...this.voiceConfig,
        voice: voiceName,
        instructions: instructions,
        //@ts-ignore
        tools: this.parentAssistant.getCurrentModeFunctions(),
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

    this.sendToVoiceConnection(sessionConfig);

    setTimeout(() => {
      if (
        this.exitMessageFromDirectAgentConversation &&
        !this.directAgentVoiceConnection
      ) {
        this.sendCancelResponse();
        setTimeout(() => {
          if (this.exitMessageFromDirectAgentConversation) {
            this.triggerResponse(
              this.exitMessageFromDirectAgentConversation,
              true
            );
            this.exitMessageFromDirectAgentConversation = undefined;
          }
        }, 250);
      } else if (!customResponseMessage) {
        this.triggerResponse("Say hi to the user", false);
      } else {
        this.triggerResponse(customResponseMessage, false);
      }
    }, 20);
  }

  getRandomStringAscii(length: number = 10): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 128))
      .map((n) => String.fromCharCode(n))
      .join("");
  }

  async triggerResponse(message: string, cancelResponse = true): Promise<void> {
    console.log("triggerResponse: ", message);
    const createResponse = {
      type: "response.create",
      event_id: `triggerResponse_${this.getRandomStringAscii(10)}`,
      response: {
        modalities: this.voiceConfig.modalities,
        instructions: message,
      },
    };
    if (cancelResponse) {
      await this.sendCancelResponse();
    }
    this.sendToVoiceConnection(createResponse);
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
  }
}
