var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var YpAssistantBase_1;
import { css, html, nothing } from "lit";
import { property, customElement, state, query } from "lit/decorators.js";
import { YpChatbotBase } from "../yp-llms/yp-chatbot-base.js";
import "./yp-assistant-item-base.js";
import { literal } from "lit/static-html.js";
import { WavRecorder } from "../tools/wavTools/wav_recorder.js";
import { WavStreamPlayer } from "../tools/wavTools/wav_stream_player.js";
import { YpAssistantServerApi } from "./AssistantServerApi.js";
import { WavRenderer } from "./wave-renderer.js";
let YpAssistantBase = YpAssistantBase_1 = class YpAssistantBase extends YpChatbotBase {
    constructor() {
        super();
        this.voiceEnabled = false;
        this.mediaRecorder = null;
        this.wavStreamPlayer = null;
        this.isRecording = false;
        this.userIsSpeaking = false;
        this.aiIsSpeaking = false;
        this.onlyUseTextField = true;
        this.chatbotItemComponentName = literal `yp-assistant-item-base`;
        this.canvasCtx = null;
        this.renderLoopActive = false;
        this.renderLoop = () => {
            if (!this.renderLoopActive)
                return;
            if (this.waveformCanvas) {
                // Set up canvas if needed
                if (!this.waveformCanvas.width || !this.waveformCanvas.height) {
                    this.waveformCanvas.width = this.waveformCanvas.offsetWidth;
                    this.waveformCanvas.height = this.waveformCanvas.offsetHeight;
                }
                this.canvasCtx = this.canvasCtx || this.waveformCanvas.getContext("2d");
                if (this.canvasCtx) {
                    this.canvasCtx.clearRect(0, 0, this.waveformCanvas.width, this.waveformCanvas.height);
                    // Get frequencies based on who is speaking
                    let frequencies = new Float32Array([0]);
                    let color = "#ffdc2f"; // default color
                    try {
                        if (this.userIsSpeaking) {
                            frequencies = this.mediaRecorder?.getFrequencies("voice")?.values;
                            color = "#ffdc2f"; // blue for user
                        }
                        else if (this.aiIsSpeaking) {
                            frequencies = this.mediaRecorder?.getFrequencies("voice")?.values;
                            color = "#1e90ff"; // green for AI
                        }
                        WavRenderer.drawBars(this.waveformCanvas, this.canvasCtx, frequencies, color, 10, 0, 8);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }
            requestAnimationFrame(this.renderLoop);
        };
        this.setupVoiceCapabilities();
    }
    firstUpdated(changedProperties) {
        if (changedProperties) {
            super.firstUpdated(changedProperties);
        }
    }
    setupCanvasRendering() {
        if (this.renderLoopActive)
            return;
        this.renderLoopActive = true;
        this.renderLoop();
    }
    stopCanvasRendering() {
        this.renderLoopActive = false;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.stopCanvasRendering();
        this.stopRecording();
    }
    async setupVoiceCapabilities() { }
    get talkingHeadImage() {
        if (this.aiIsSpeaking) {
            return "https://assets.evoly.ai/direct/talkingHead.png";
        }
        else if (this.userIsSpeaking) {
            return "https://assets.evoly.ai/direct/listeningHead.png";
        }
        else
            return "https://assets.evoly.ai/direct/idleHead.png";
    }
    renderVoiceTalkingHead() {
        if (!this.voiceEnabled) {
            return nothing;
        }
        return html `
      <div class="voice-header">
        <img
          class="talking-head-image"
          src="${this.talkingHeadImage}"
          alt="Voice Assistant"
        />
        <canvas id="waveformCanvas" class="waveform-canvas"></canvas>
      </div>
    `;
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
            .filter((chatElement) => !chatElement.hidden &&
            chatElement.type !== "hiddenContextMessage")
            .map((chatElement) => html `
                <yp-assistant-item-base
                  ?thinking="${chatElement.type === "thinking" ||
            chatElement.type === "noStreaming"}"
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
          ${this.renderVoiceTalkingHead()}${this.renderChatInput()}
        </div>
      </div>
    `;
    }
    toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        }
        else {
            this.startRecording();
        }
    }
    async startRecording() {
        const serverApi = new YpAssistantServerApi();
        await serverApi.startVoiceSession(1790, this.wsClientId, this.chatLog);
        this.mediaRecorder = new WavRecorder({ sampleRate: 24000 });
        this.isRecording = true;
        await this.mediaRecorder.begin();
        await this.mediaRecorder.record((data) => this.handleVoiceInput(data));
        this.wavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 });
        await this.wavStreamPlayer?.connect();
    }
    stopRecording() {
        this.mediaRecorder?.end();
        this.mediaRecorder = null;
        this.wavStreamPlayer?.interrupt();
        this.wavStreamPlayer = null;
        this.isRecording = false;
    }
    static floatTo16BitPCM(float32Array) {
        const buffer = new ArrayBuffer(float32Array.length * 2);
        const view = new DataView(buffer);
        let offset = 0;
        for (let i = 0; i < float32Array.length; i++, offset += 2) {
            let s = Math.max(-1, Math.min(1, float32Array[i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }
        return buffer;
    }
    static arrayBufferToBase64(arrayBuffer) {
        if (arrayBuffer instanceof Float32Array) {
            arrayBuffer = this.floatTo16BitPCM(arrayBuffer);
        }
        else if (arrayBuffer instanceof Int16Array) {
            arrayBuffer = arrayBuffer.buffer;
        }
        let binary = "";
        let bytes = new Uint8Array(arrayBuffer);
        const chunkSize = 0x8000; // 32KB chunk size
        for (let i = 0; i < bytes.length; i += chunkSize) {
            let chunk = bytes.subarray(i, i + chunkSize);
            binary += String.fromCharCode.apply(null, chunk);
        }
        return btoa(binary);
    }
    async handleVoiceInput(data) {
        // Convert ArrayBuffer to base64 using browser APIs
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: "voice_input",
                audio: YpAssistantBase_1.arrayBufferToBase64(data.mono),
                clientId: this.wsClientId,
            }));
        }
    }
    async onMessage(event) {
        const data = JSON.parse(event.data);
        // Handle messages with HTML content
        if (data.type === "bot" && data.html) {
            // Add message to chat log with reference to component
            this.addChatBotElement({
                sender: "bot",
                type: "component",
                message: data.message || "",
                html: data.html,
            });
            return;
        }
        switch (data.type) {
            case "audio":
                if (data.audio) {
                    const audioData = this.base64ToArrayBuffer(data.audio);
                    this.wavStreamPlayer?.add16BitPCM(audioData);
                    this.aiIsSpeaking = true;
                    clearTimeout(this.aiSpeakingTimeout);
                    this.aiSpeakingTimeout = setTimeout(() => {
                        this.aiIsSpeaking = false;
                    }, 2500);
                }
                break;
            case "listening_start":
                if (this.lastChatUiElement) {
                    this.lastChatUiElement.isSpeaking = true;
                }
                this.userIsSpeaking = true;
                await this.wavStreamPlayer?.interrupt();
                this.wavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 });
                await this.wavStreamPlayer?.connect();
                break;
            case "listening_stop":
                if (this.lastChatUiElement) {
                    this.lastChatUiElement.isSpeaking = false;
                }
                this.userIsSpeaking = false;
                break;
            case "ai_speaking_start":
                this.aiIsSpeaking = true;
                break;
            case "ai_speaking_stop":
                this.aiIsSpeaking = false;
                break;
            case "speech.transcription":
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
    async toggleVoiceMode() {
        this.voiceEnabled = !this.voiceEnabled;
        if (!this.voiceEnabled && this.isRecording) {
            this.stopRecording();
        }
        else if (this.voiceEnabled && !this.isRecording) {
            await this.startRecording();
        }
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: "voice_mode",
                enabled: this.voiceEnabled,
                clientId: this.wsClientId,
            }));
        }
        if (this.voiceEnabled) {
            this.setupCanvasRendering();
        }
        else {
            this.stopCanvasRendering();
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
        .voice-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          margin-top: -134px;
          margin-left: -16px;
        }

        .talking-head-image {
          width: 128px;
          height: 128px;
        }

        .waveform-canvas {
          width: 100%;
          height: 60px;
          margin-top: 8px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 8px;
        }

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
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `,
        ];
    }
    renderChatInput() {
        return html `
      <div class="voice-controls">
        ${this.voiceEnabled
            ? html `
              <md-icon-button
                id="voiceButton"
                class="voice-button"
                ?recording="${this.isRecording}"
                @click="${this.toggleRecording}"
              >
                <md-icon>${this.isRecording ? "stop" : "mic"}</md-icon>
              </md-icon-button>
            `
            : nothing}

        <md-icon-button
          class="voice-mode-toggle"
          @click="${this.toggleVoiceMode}"
        >
          <md-icon>${this.voiceEnabled ? "keyboard" : "mic_none"}</md-icon>
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
], YpAssistantBase.prototype, "wavStreamPlayer", void 0);
__decorate([
    state()
], YpAssistantBase.prototype, "isRecording", void 0);
__decorate([
    state()
], YpAssistantBase.prototype, "userIsSpeaking", void 0);
__decorate([
    state()
], YpAssistantBase.prototype, "aiIsSpeaking", void 0);
__decorate([
    property({ type: Boolean })
], YpAssistantBase.prototype, "onlyUseTextField", void 0);
__decorate([
    query("#voiceButton")
], YpAssistantBase.prototype, "voiceButton", void 0);
__decorate([
    query("#waveformCanvas")
], YpAssistantBase.prototype, "waveformCanvas", void 0);
YpAssistantBase = YpAssistantBase_1 = __decorate([
    customElement("yp-assistant-base")
], YpAssistantBase);
export { YpAssistantBase };
//# sourceMappingURL=yp-assistant-base.js.map