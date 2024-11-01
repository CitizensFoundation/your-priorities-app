import { css, html, nothing } from "lit";
import { property, customElement, state, query } from "lit/decorators.js";
import { YpChatbotBase } from "../yp-llms/yp-chatbot-base.js";
import "./yp-assistant-item-base.js";
import { literal } from "lit/static-html.js";
import { WavRecorder } from "../tools/wavTools/wav_recorder.js";
import { WavStreamPlayer } from "../tools/wavTools/wav_stream_player.js";

@customElement("yp-assistant-base")
export abstract class YpAssistantBase extends YpChatbotBase {
  @property({ type: Boolean })
  voiceEnabled = false;

  @state()
  private mediaRecorder: WavRecorder | null = null;

  @state()
  private wavStreamPlayer: WavStreamPlayer | null = null;

  @state()
  private isRecording = false;

  @state()
  private audioChunks: Blob[] = [];

  @state()
  private audioContext: AudioContext | null = null;

  @state()
  private audioQueue: ArrayBuffer[] = [];

  @state()
  private isPlayingAudio = false;

  @state()
  private currentAudioSource: AudioBufferSourceNode | null = null;

  @property({ type: Boolean })
  override onlyUseTextField = true;

  @query('#voiceButton')
  voiceButton!: HTMLElement;

  override chatbotItemComponentName = literal`yp-assistant-item-base`;

  constructor() {
    super();
    this.initializeAudioContext();
    this.setupVoiceCapabilities();
  }

  private initializeAudioContext() {
    this.audioContext = new AudioContext();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.stopRecording();
    this.cleanupAudio();
  }

  private cleanupAudio() {
    if (this.currentAudioSource) {
      try {
        this.currentAudioSource.stop();
      } catch (e) {
        // Ignore if already stopped
      }
      this.currentAudioSource = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.audioQueue = [];
    this.isPlayingAudio = false;
  }

  async setupVoiceCapabilities() {

  }

  override render() {
    return html`
      <div class="chat-window" id="chat-window">
        <div class="chat-messages" id="chat-messages">
          <yp-assistant-item-base
            ?hidden="${!this.defaultInfoMessage}"
            class="chatElement bot-chat-element"
            .detectedLanguage="${this.language}"
            .message="${this.defaultInfoMessage}"
            type="info"
            sender="bot"
          ></yp-assistant-item-base>
          ${this.chatLog
            .filter(chatElement => !chatElement.hidden && chatElement.type !== 'hiddenContextMessage')
            .map(
              chatElement => html`
                <yp-assistant-item-base
                  ?thinking="${chatElement.type === 'thinking' ||
                  chatElement.type === 'noStreaming'}"
                  @followup-question="${this.followUpQuestion}"
                  .clusterId="${this.clusterId}"
                  class="chatElement ${chatElement.sender}-chat-element"
                  .detectedLanguage="${this.language}"
                  .message="${chatElement.message}"

                  .htmlToRender="${chatElement.html}"
                  @scroll-down-enabled="${() => (this.userScrolled = false)}"
                  .type="${chatElement.type}"
                  .sender="${chatElement.sender}"
                ></yp-assistant-item-base>
              `
            )}
        </div>
        <div class="layout horizontal center-center chat-input">
          ${this.renderChatInput()}
        </div>
      </div>
    `;
  }



  toggleRecording() {
    debugger;
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  async startRecording() {
    this.mediaRecorder = new WavRecorder({ sampleRate: 24000 }) as WavRecorder;
    this.isRecording = true;

    await this.mediaRecorder.begin();

    await this.mediaRecorder.record((data: any) => this.handleVoiceInput(data.mono));

    this.wavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 });

    await this.wavStreamPlayer?.connect();

    debugger;
  }

  stopRecording() {
    this.mediaRecorder?.end();
    this.mediaRecorder = null;

    this.wavStreamPlayer?.interrupt();
    this.wavStreamPlayer = null;
    this.isRecording = false;
  }

  async handleVoiceInput(base64Audio: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'voice_input',
        audio: base64Audio,
        clientId: this.wsClientId
      }));
    }
  }

  override async onMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);

    // Handle messages with HTML content
    if (data.type === 'bot' && data.html) {

      // Add message to chat log with reference to component
      this.addChatBotElement({
        sender: "bot",
        type: "component",
        message: data.message || "",
        html: data.html
      });
      return;
    }

    switch (data.type) {
      case 'audio':
        if (data.audio) {
          const audioData = this.base64ToArrayBuffer(data.audio);
          this.wavStreamPlayer?.add16BitPCM(audioData);
        }
        break;

      case 'speech.started':
        if (this.lastChatUiElement) {
          this.lastChatUiElement.isSpeaking = true;
        }
        break;

      case 'speech.stopped':
        if (this.lastChatUiElement) {
          this.lastChatUiElement.isSpeaking = false;
        }
        break;

      case 'speech.transcription':
        if (data.text && this.lastChatUiElement) {
          this.lastChatUiElement.message = data.text;
        }
        break;

      default:
        await super.onMessage(event);
    }
  }

  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  }

  toggleVoiceMode() {
    this.voiceEnabled = !this.voiceEnabled;

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'voice_mode',
        enabled: this.voiceEnabled,
        clientId: this.wsClientId
      }));
    }

    if (!this.voiceEnabled && this.isRecording) {
      this.stopRecording();
    } else if (this.voiceEnabled && !this.isRecording) {
      this.startRecording();
    }

    // Initialize or resume AudioContext when enabling voice mode
    if (this.voiceEnabled && this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  static override get styles() {
    return [
      super.styles,
      css`
        .voice-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .voice-button {
          --md-icon-button-icon-size: 24px;
          margin-right: 8px;
        }

        .voice-button[recording] {
          --md-icon-button-container-color: var(--md-sys-color-error);
          --md-icon-button-icon-color: var(--md-sys-color-on-error);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `
    ];
  }

  override renderChatInput() {
    return html`
      <div class="voice-controls">
        ${this.voiceEnabled ? html`
          <md-icon-button
            id="voiceButton"
            class="voice-button"
            ?recording="${this.isRecording}"
            @click="${this.toggleRecording}"
          >
            <md-icon>${this.isRecording ? 'stop' : 'mic'}</md-icon>
          </md-icon-button>
        ` : nothing}

        <md-icon-button
          class="voice-mode-toggle"
          @click="${this.toggleVoiceMode}"
        >
          <md-icon>${this.voiceEnabled ? 'keyboard' : 'mic_none'}</md-icon>
        </md-icon-button>

        ${super.renderChatInput()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "yp-assistant-base": YpAssistantBase;
  }
}