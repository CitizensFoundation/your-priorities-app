import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskMode,
  TaskType,
  VoiceEmotion,
  StartAvatarResponse,
} from "@heygen/streaming-avatar";
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

interface Avatar {
  avatar_id: string;
  name: string;
}

interface Language {
  key: string;
  label: string;
}

interface VoiceConfig {
  rate: number;
  emotion: VoiceEmotion;
}

@customElement("hg-interactive-avatar")
export class InteractiveAvatar extends LitElement {
  @property({ type: String })
  getConfigPath = "/api/users/get_hey_gen_config";

  @property({ type: String })
  audioBackupPath = "/api/users/hey_gen_audio_backup";

  @property({ type: String })
  conversationBackupPath = "/api/users/hey_gen_conversation_backup";

  @state()
  private isLoadingSession = false;

  @state()
  private isLoadingRepeat = false;

  @state()
  private stream: MediaStream | null = null;

  @state()
  private debug = "";

  @property({ type: String })
  knowledgeId = "";

  @property({ type: String })
  knowledgeBase = "";

  @property({ type: String })
  avatarId = "";

  @property({ type: String })
  language = "en";

  @state()
  private data: StartAvatarResponse | null = null;

  @state()
  private text = "";

  @property({ type: Boolean, reflect: true })
  isUserTalking = false;

  // Private fields
  private avatar: StreamingAvatar | null = null;
  private mediaStreamEl: HTMLVideoElement | null = null;
  private audioBackup: AudioBackupManager | null = null;
  private conversationBackup: ConversationBackupManager | null = null;
  private sessionId: string = "";

  static override styles = css`
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

  private async getConfig(): Promise<string> {
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
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  }

  constructor() {
    super();
  }

  initBackups(token: string): void {
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

  private async startSession(): Promise<void> {
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
    } catch (error) {
      console.error("Error starting avatar session:", error);
    } finally {
      this.isLoadingSession = false;
    }
  }

  private getVoiceConfig(): VoiceConfig {
    return {
      rate: 1.5,
      emotion: VoiceEmotion.EXCITED,
    };
  }

  private setupAvatarEventListeners(): void {
    if (!this.avatar) return;

    this.avatar.on(StreamingEvents.AVATAR_START_TALKING, (e: CustomEvent) => {
      console.log("Avatar started talking", e);
      this.dispatchEvent(
        new CustomEvent("hg-interactive-avatar-start-talking", {
          detail: e.detail,
        })
      );
    });

    this.avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (e: CustomEvent) => {
      console.log("Avatar stopped talking", e);
      this.dispatchEvent(
        new CustomEvent("hg-interactive-avatar-stop-talking", {
          detail: e.detail,
        })
      );
    });

    this.avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (e: CustomEvent) => {
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

      this.dispatchEvent(
        new CustomEvent("hg-interactive-avatar-talking-message", {
          detail: e.detail,
        })
      );
    });

    this.avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      console.log("Stream disconnected");
      this.dispatchEvent(new CustomEvent("hg-interactive-avatar-disconnected"));
      this.endSession();
    });

    this.avatar.on(
      StreamingEvents.STREAM_READY,
      (event: { detail: MediaStream | null }) => {
        console.log(">>>>> Stream ready:", event.detail);
        this.stream = event.detail;
        if (this.stream && this.audioBackup) {
          //this.audioBackup.attachToStream(this.stream);
        } else {
          console.error("Stream or audio backup not initialized");
        }
        this.dispatchEvent(
          new CustomEvent("hg-interactive-avatar-ready", {
            detail: event.detail,
          })
        );
      }
    );

    this.avatar.on(StreamingEvents.USER_START, (event: any) => {
      console.log(">>>>> User started talking:", event);
      this.isUserTalking = true;
      this.dispatchEvent(
        new CustomEvent("hg-interactive-avatar-user-start", { detail: event })
      );
    });

    this.avatar.on(StreamingEvents.USER_STOP, (event: any) => {
      console.log(">>>>> User stopped talking:", event);
      this.isUserTalking = false;
      this.dispatchEvent(
        new CustomEvent("hg-interactive-avatar-user-stop", { detail: event })
      );
    });
  }

  private async handleSpeak(): Promise<void> {
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
    } catch (e) {
      if (e instanceof Error) {
        this.debug = e.message;
      }
    }
    this.isLoadingRepeat = false;
  }

  private async handleInterrupt(): Promise<void> {
    if (!this.avatar) {
      this.debug = "Avatar API not initialized";
      return;
    }
    try {
      await this.avatar.interrupt();
    } catch (e) {
      if (e instanceof Error) {
        this.debug = e.message;
      }
    }
  }

  private async endSession(): Promise<void> {
    if (this.audioBackup) {
      this.audioBackup.stop();
    }

    if (this.conversationBackup) {
      this.conversationBackup.stop();
    }

    await this.avatar?.stopAvatar();
    this.stream = null;
  }

  override updated(changedProperties: PropertyValues): void {
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
      const prevText = changedProperties.get("text") as string;
      if (!prevText && this.text) {
        this.avatar?.startListening();
      } else if (prevText && !this.text) {
        this.avatar?.stopListening();
      }
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.endSession();
  }

  override render() {
    return html`
      <div class="container">
        <div class="card">
          <div class="card-body">
            ${this.stream
              ? html`
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
              ? html`
                  <md-circular-progress indeterminate></md-circular-progress>
                `
              : html`
                  <div class="setup-form">
                    <div class="form-group">
                      <md-filled-select
                        label="Select language"
                        .value=${this.language}
                        @change=${(e: Event) =>
                          (this.language = (
                            e.target as HTMLSelectElement
                          ).value)}
                      >
                        ${STT_LANGUAGE_LIST.map(
                          (lang: Language) => html`
                            <md-select-option value=${lang.key}>
                              ${lang.label}
                            </md-select-option>
                          `
                        )}
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
}

declare global {
  interface HTMLElementTagNameMap {
    "interactive-avatar": InteractiveAvatar;
  }
}
