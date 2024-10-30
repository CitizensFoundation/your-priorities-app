var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import StreamingAvatar, { AvatarQuality, StreamingEvents, TaskMode, TaskType, VoiceEmotion, } from "@heygen/streaming-avatar";
import "@material/web/button/filled-button.js";
import "@material/web/select/filled-select.js";
import "@material/web/select/select-option.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/divider/divider.js";
import { AudioBackupManager } from "./AudioBackup.js";
import { ConversationBackupManager } from "./ConverationBackup.js";
const STT_LANGUAGE_LIST = [
    { label: "Bulgarian", value: "bg", key: "bg" },
    { label: "Chinese", value: "zh", key: "zh" },
    { label: "Czech", value: "cs", key: "cs" },
    { label: "Danish", value: "da", key: "da" },
    { label: "Dutch", value: "nl", key: "nl" },
    { label: "English", value: "en", key: "en" },
    { label: "Finnish", value: "fi", key: "fi" },
    { label: "French", value: "fr", key: "fr" },
    { label: "German", value: "de", key: "de" },
    { label: "Greek", value: "el", key: "el" },
    { label: "Hindi", value: "hi", key: "hi" },
    { label: "Hungarian", value: "hu", key: "hu" },
    { label: "Icelandic", value: "is", key: "is" },
    { label: "Indonesian", value: "id", key: "id" },
    { label: "Italian", value: "it", key: "it" },
    { label: "Japanese", value: "ja", key: "ja" },
    { label: "Korean", value: "ko", key: "ko" },
    { label: "Malay", value: "ms", key: "ms" },
    { label: "Norwegian", value: "no", key: "no" },
    { label: "Polish", value: "pl", key: "pl" },
    { label: "Portuguese", value: "pt", key: "pt" },
    { label: "Romanian", value: "ro", key: "ro" },
    { label: "Russian", value: "ru", key: "ru" },
    { label: "Slovak", value: "sk", key: "sk" },
    { label: "Spanish", value: "es", key: "es" },
    { label: "Swedish", value: "sv", key: "sv" },
    { label: "Turkish", value: "tr", key: "tr" },
    { label: "Ukrainian", value: "uk", key: "uk" },
    { label: "Vietnamese", value: "vi", key: "vi" },
];
let InteractiveAvatar = class InteractiveAvatar extends LitElement {
    async getConfig() {
        try {
            const response = await fetch(this.getConfigPath, {
                method: "POST",
                body: JSON.stringify({
                    language: this.language,
                    avatarId: this.avatarId,
                    knowledgeBase: this.knowledgeBase,
                    knowledgeId: this.knowledgeId,
                    sessionId: this.sessionId
                }),
            });
            const data = await response.json();
            console.log("Access Token Response:", data);
            if (!this.knowledgeId && data.knowledgeId) {
                this.knowledgeId = data.knowledgeId;
            }
            if (!this.knowledgeBase && data.knowledgeBase) {
                this.knowledgeBase = data.knowledgeBase;
            }
            return data.token;
        }
        catch (error) {
            console.error("Error fetching access token:", error);
            throw error;
        }
    }
    constructor() {
        super();
        this.getConfigPath = "/api/users/get_hey_gen_config";
        this.audioBackupPath = "/api/users/hey_gen_audio_backup";
        this.conversationBackupPath = "/api/users/hey_gen_conversation_backup";
        this.isLoadingSession = false;
        this.isLoadingRepeat = false;
        this.stream = null;
        this.debug = "";
        this.knowledgeId = "";
        this.knowledgeBase = "";
        this.avatarId = "";
        this.language = "en";
        this.data = null;
        this.text = "";
        this.isUserTalking = false;
        // Private fields
        this.avatar = null;
        this.mediaStreamEl = null;
        this.audioBackup = null;
        this.conversationBackup = null;
        this.sessionId = "";
    }
    initBackups(token) {
        const commonHeaders = {
            Authorization: `Bearer ${token}`,
        };
        this.audioBackup = new AudioBackupManager({
            sendInterval: 2500,
            backupEndpoint: this.audioBackupPath,
            headers: commonHeaders,
            sessionId: this.sessionId,
        });
        // Initialize conversation backup manager
        this.conversationBackup = new ConversationBackupManager({
            backupEndpoint: this.conversationBackupPath,
            batchInterval: 1234,
            headers: commonHeaders,
            sessionId: this.sessionId,
        });
    }
    async startSession() {
        this.isLoadingSession = true;
        this.sessionId = crypto.randomUUID();
        const newToken = await this.getConfig();
        if (!newToken) {
            this.debug = "No token received";
            throw new Error("No token received");
        }
        this.avatar = new StreamingAvatar({
            token: newToken,
        });
        this.initBackups(newToken);
        this.setupAvatarEventListeners();
        try {
            const res = await this.avatar.createStartAvatar({
                quality: AvatarQuality.Low,
                avatarName: this.avatarId,
                knowledgeBase: this.knowledgeBase,
                language: this.language
            });
            this.data = res;
            await this.avatar.startVoiceChat({ useSilencePrompt: false });
        }
        catch (error) {
            console.error("Error starting avatar session:", error);
        }
        finally {
            this.isLoadingSession = false;
        }
    }
    getVoiceConfig() {
        return {
            rate: 1.5,
            emotion: VoiceEmotion.EXCITED,
        };
    }
    setupAvatarEventListeners() {
        if (!this.avatar)
            return;
        this.avatar.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
            console.log("Avatar started talking", e);
            this.dispatchEvent(new CustomEvent("hg-interactive-avatar-start-talking", {
                detail: e.detail,
            }));
        });
        this.avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
            console.log("Avatar stopped talking", e);
            this.dispatchEvent(new CustomEvent("hg-interactive-avatar-stop-talking", {
                detail: e.detail,
            }));
        });
        this.avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (e) => {
            console.log("Avatar talking message", e);
            // Add message to backup
            if (this.conversationBackup) {
                this.conversationBackup.addMessage({
                    type: "avatar",
                    message: e.detail.message,
                    timestamp: Date.now(),
                    taskId: e.detail.task_id,
                });
            }
            this.dispatchEvent(new CustomEvent("hg-interactive-avatar-talking-message", {
                detail: e.detail,
            }));
        });
        this.avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
            console.log("Stream disconnected");
            this.dispatchEvent(new CustomEvent("hg-interactive-avatar-disconnected"));
            this.endSession();
        });
        this.avatar.on(StreamingEvents.STREAM_READY, (event) => {
            console.log(">>>>> Stream ready:", event.detail);
            this.stream = event.detail;
            if (this.stream && this.audioBackup) {
                //this.audioBackup.attachToStream(this.stream);
            }
            else {
                console.error("Stream or audio backup not initialized");
            }
            this.dispatchEvent(new CustomEvent("hg-interactive-avatar-ready", {
                detail: event.detail,
            }));
        });
        this.avatar.on(StreamingEvents.USER_START, (event) => {
            console.log(">>>>> User started talking:", event);
            this.isUserTalking = true;
            this.dispatchEvent(new CustomEvent("hg-interactive-avatar-user-start", { detail: event }));
        });
        this.avatar.on(StreamingEvents.USER_STOP, (event) => {
            console.log(">>>>> User stopped talking:", event);
            this.isUserTalking = false;
            this.dispatchEvent(new CustomEvent("hg-interactive-avatar-user-stop", { detail: event }));
        });
    }
    async handleSpeak() {
        this.isLoadingRepeat = true;
        if (!this.avatar) {
            this.debug = "Avatar API not initialized";
            return;
        }
        try {
            await this.avatar.speak({
                text: this.text,
                taskType: TaskType.REPEAT,
                taskMode: TaskMode.SYNC,
            });
        }
        catch (e) {
            if (e instanceof Error) {
                this.debug = e.message;
            }
        }
        this.isLoadingRepeat = false;
    }
    async handleInterrupt() {
        if (!this.avatar) {
            this.debug = "Avatar API not initialized";
            return;
        }
        try {
            await this.avatar.interrupt();
        }
        catch (e) {
            if (e instanceof Error) {
                this.debug = e.message;
            }
        }
    }
    async endSession() {
        if (this.audioBackup) {
            this.audioBackup.stop();
        }
        if (this.conversationBackup) {
            this.conversationBackup.stop();
        }
        await this.avatar?.stopAvatar();
        this.stream = null;
    }
    updated(changedProperties) {
        if (changedProperties.has("stream") && this.stream) {
            const videoEl = this.shadowRoot?.querySelector("video");
            if (videoEl) {
                videoEl.srcObject = this.stream;
                videoEl.onloadedmetadata = () => {
                    videoEl.play();
                    this.debug = "Playing";
                };
            }
        }
        if (changedProperties.has("text")) {
            const prevText = changedProperties.get("text");
            if (!prevText && this.text) {
                this.avatar?.startListening();
            }
            else if (prevText && !this.text) {
                this.avatar?.stopListening();
            }
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.endSession();
    }
    render() {
        return html `
      <div class="container">
        <div class="card">
          <div class="card-body">
            ${this.stream
            ? html `
                  <div class="video-container">
                    <video autoplay playsinline>
                      <track kind="captions" />
                    </video>
                    <div class="controls">
                      <md-filled-button @click=${this.handleInterrupt}>
                        Interrupt task
                      </md-filled-button>
                      <md-filled-button @click=${this.endSession}>
                        End session
                      </md-filled-button>
                    </div>
                  </div>
                `
            : this.isLoadingSession
                ? html `
                  <md-circular-progress indeterminate></md-circular-progress>
                `
                : html `
                  <div class="setup-form">
                    <div class="form-group">
                      <md-filled-select
                        label="Select language"
                        .value=${this.language}
                        @change=${(e) => (this.language = e.target.value)}
                      >
                        ${STT_LANGUAGE_LIST.map((lang) => html `
                            <md-select-option value=${lang.key}>
                              ${lang.label}
                            </md-select-option>
                          `)}
                      </md-filled-select>
                    </div>

                    <md-filled-button @click=${this.startSession}>
                      Start session
                    </md-filled-button>
                  </div>
                `}
          </div>

          <md-divider></md-divider>

          <div class="card-footer">
            <div style="text-align: center">
              <md-filled-button ?disabled=${!this.isUserTalking}>
                ${this.isUserTalking ? "Listening" : "Voice chat"}
              </md-filled-button>
            </div>
          </div>
        </div>

        <p class="debug">
          <strong>Console:</strong><br />
          ${this.debug}
        </p>
      </div>
    `;
    }
};
InteractiveAvatar.styles = css `
    :host {
      display: block;
      width: 100%;
    }
    .container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .card {
      background: var(--md-sys-color-surface);
      border-radius: 12px;
      box-shadow: var(--md-sys-elevation-1);
      overflow: hidden;
    }
    .card-body {
      height: 500px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1rem;
    }
    .video-container {
      height: 500px;
      width: 900px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      border-radius: 8px;
      overflow: hidden;
    }
    video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .controls {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .setup-form {
      height: 100%;
      width: 500px;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      align-self: center;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
    }
    .card-footer {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .input-container {
      width: 100%;
      display: flex;
      position: relative;
    }
    .debug {
      font-family: monospace;
      text-align: right;
    }
  `;
__decorate([
    property({ type: String })
], InteractiveAvatar.prototype, "getConfigPath", void 0);
__decorate([
    property({ type: String })
], InteractiveAvatar.prototype, "audioBackupPath", void 0);
__decorate([
    property({ type: String })
], InteractiveAvatar.prototype, "conversationBackupPath", void 0);
__decorate([
    state()
], InteractiveAvatar.prototype, "isLoadingSession", void 0);
__decorate([
    state()
], InteractiveAvatar.prototype, "isLoadingRepeat", void 0);
__decorate([
    state()
], InteractiveAvatar.prototype, "stream", void 0);
__decorate([
    state()
], InteractiveAvatar.prototype, "debug", void 0);
__decorate([
    property({ type: String })
], InteractiveAvatar.prototype, "knowledgeId", void 0);
__decorate([
    property({ type: String })
], InteractiveAvatar.prototype, "knowledgeBase", void 0);
__decorate([
    property({ type: String })
], InteractiveAvatar.prototype, "avatarId", void 0);
__decorate([
    property({ type: String })
], InteractiveAvatar.prototype, "language", void 0);
__decorate([
    state()
], InteractiveAvatar.prototype, "data", void 0);
__decorate([
    state()
], InteractiveAvatar.prototype, "text", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], InteractiveAvatar.prototype, "isUserTalking", void 0);
InteractiveAvatar = __decorate([
    customElement("hg-interactive-avatar")
], InteractiveAvatar);
export { InteractiveAvatar };
//# sourceMappingURL=hg-interactive-avatar.js.map