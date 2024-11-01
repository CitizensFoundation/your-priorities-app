var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from "lit";
import { property, customElement, state, query } from "lit/decorators.js";
import { YpChatbotBase } from "../yp-llms/yp-chatbot-base.js";
import "./yp-assistant-item-base.js";
import { literal } from "lit/static-html.js";
let YpAssistantBase = class YpAssistantBase extends YpChatbotBase {
    constructor() {
        super();
        this.voiceEnabled = false;
        this.mediaRecorder = null;
        this.isRecording = false;
        this.audioChunks = [];
        this.audioContext = null;
        this.audioQueue = [];
        this.isPlayingAudio = false;
        this.currentAudioSource = null;
        this.onlyUseTextField = true;
        this.chatbotItemComponentName = literal `yp-assistant-item-base`;
        this.initializeAudioContext();
        this.setupVoiceCapabilities();
    }
    initializeAudioContext() {
        this.audioContext = new AudioContext();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.stopRecording();
        this.cleanupAudio();
    }
    cleanupAudio() {
        if (this.currentAudioSource) {
            try {
                this.currentAudioSource.stop();
            }
            catch (e) {
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
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/wav'
            });
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            this.mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                const base64Audio = await this.blobToBase64(audioBlob);
                this.handleVoiceInput(base64Audio);
                this.audioChunks = [];
            };
        }
        catch (error) {
            console.error('Error setting up voice capabilities:', error);
            this.voiceEnabled = false;
        }
    }
    render() {
        return html `
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
            .map(chatElement => html `
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
              `)}
        </div>
        <div class="layout horizontal center-center chat-input">
          ${this.renderChatInput()}
        </div>
      </div>
    `;
    }
    async blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    const base64 = reader.result.split(',')[1];
                    resolve(base64);
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
    async appendAudioChunk(chunk) {
        this.audioQueue.push(chunk);
        if (!this.isPlayingAudio) {
            await this.playNextAudioChunk();
        }
    }
    async playNextAudioChunk() {
        if (!this.audioContext || this.audioQueue.length === 0) {
            this.isPlayingAudio = false;
            return;
        }
        this.isPlayingAudio = true;
        const chunk = this.audioQueue.shift();
        try {
            const audioBuffer = await this.audioContext.decodeAudioData(chunk);
            this.currentAudioSource = this.audioContext.createBufferSource();
            this.currentAudioSource.buffer = audioBuffer;
            this.currentAudioSource.connect(this.audioContext.destination);
            this.currentAudioSource.onended = () => {
                this.currentAudioSource = null;
                if (this.audioQueue.length > 0) {
                    this.playNextAudioChunk();
                }
                else {
                    this.isPlayingAudio = false;
                    this.fire('audio-complete');
                }
            };
            this.currentAudioSource.start();
        }
        catch (error) {
            console.error('Error playing audio chunk:', error);
            this.isPlayingAudio = false;
            this.currentAudioSource = null;
        }
    }
    toggleRecording() {
        if (!this.mediaRecorder)
            return;
        if (this.isRecording) {
            this.stopRecording();
        }
        else {
            this.startRecording();
        }
    }
    startRecording() {
        if (!this.mediaRecorder || this.isRecording)
            return;
        this.mediaRecorder.start(100); // Collect chunks every 100ms
        this.isRecording = true;
        this.addChatBotElement({
            sender: "you",
            type: "start",
            message: this.t("Recording..."),
        });
    }
    stopRecording() {
        if (!this.mediaRecorder || !this.isRecording)
            return;
        this.mediaRecorder.stop();
        this.isRecording = false;
    }
    async handleVoiceInput(base64Audio) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'voice_input',
                audio: base64Audio,
                clientId: this.wsClientId
            }));
        }
    }
    async onMessage(event) {
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
                    await this.appendAudioChunk(audioData);
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
    base64ToArrayBuffer(base64) {
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
        }
        // Initialize or resume AudioContext when enabling voice mode
        if (this.voiceEnabled && this.audioContext?.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
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
    renderChatInput() {
        return html `
      <div class="voice-controls">
        ${this.voiceEnabled ? html `
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
};
__decorate([
    property({ type: Boolean })
], YpAssistantBase.prototype, "voiceEnabled", void 0);
__decorate([
    state()
], YpAssistantBase.prototype, "mediaRecorder", void 0);
__decorate([
    state()
], YpAssistantBase.prototype, "isRecording", void 0);
__decorate([
    state()
], YpAssistantBase.prototype, "audioChunks", void 0);
__decorate([
    state()
], YpAssistantBase.prototype, "audioContext", void 0);
__decorate([
    state()
], YpAssistantBase.prototype, "audioQueue", void 0);
__decorate([
    state()
], YpAssistantBase.prototype, "isPlayingAudio", void 0);
__decorate([
    state()
], YpAssistantBase.prototype, "currentAudioSource", void 0);
__decorate([
    property({ type: Boolean })
], YpAssistantBase.prototype, "onlyUseTextField", void 0);
__decorate([
    query('#voiceButton')
], YpAssistantBase.prototype, "voiceButton", void 0);
YpAssistantBase = __decorate([
    customElement("yp-assistant-base")
], YpAssistantBase);
export { YpAssistantBase };
//# sourceMappingURL=yp-assistant-base.js.map