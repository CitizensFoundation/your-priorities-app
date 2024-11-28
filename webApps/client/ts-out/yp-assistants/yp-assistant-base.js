var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var YpAssistantBase_1;
import { css, html, nothing } from "lit";
import { property, customElement, state, query } from "lit/decorators.js";
import { YpChatbotBase } from "../yp-chatbots/yp-chatbot-base.js";
import "./yp-assistant-item-base.js";
import { literal } from "lit/static-html.js";
import { WavRecorder } from "../tools/wavTools/wav_recorder.js";
import { WavStreamPlayer } from "../tools/wavTools/wav_stream_player.js";
import { YpAssistantServerApi } from "./AssistantServerApi.js";
import { WavRenderer } from "./wave-renderer.js";
import "./yp-assistant-welcome.js";
import { cache } from "lit/directives/cache.js";
import { resolveMarkdown } from "../common/litMarkdown/litMarkdown.js";
let YpAssistantBase = YpAssistantBase_1 = class YpAssistantBase extends YpChatbotBase {
    constructor() {
        super();
        this.voiceEnabled = false;
        this.useMainWindowScroll = true;
        this.directAgentName = null;
        this.welcomeScreenOpen = true;
        //TODO: Read from agentbundle db object
        this.welcomeTextHtml = `I am your assistant for Amplifier and I can talk, just <span class="green">click the button</span>`;
        this.mediaRecorder = null;
        this.wavStreamPlayer = null;
        this.isRecording = false;
        this.userIsSpeaking = false;
        this.aiIsSpeaking = false;
        this.onlyUseTextField = true;
        this.currentMode = "";
        this.markdownReportOpen = false;
        this.isExpanded = false;
        this.textInputLabel = "Message the assistant";
        this.defaultInfoMessage = "I'm your friendly chat assistant";
        this.chatbotItemComponentName = literal `yp-assistant-item-base`;
        this.canvasCtx = null;
        this.renderLoopActive = false;
        this.haveLoggedIn = false;
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
                            // GO throught the frequencies and lower them all by 30%
                            for (let i = 0; i < frequencies.length; i++) {
                                frequencies[i] = frequencies[i] * 0.15;
                            }
                            color = "#ffdc2f";
                        }
                        else if (this.aiIsSpeaking) {
                            frequencies =
                                this.wavStreamPlayer?.getFrequencies("voice")?.values;
                            color = "#2ecc71";
                            for (let i = 0; i < frequencies.length; i++) {
                                frequencies[i] = frequencies[i] * 0.15;
                            }
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
        const storageKey = `yp-assistant-${this.domainId}-client-uuid`;
        const savedUuid = localStorage.getItem(storageKey);
        if (savedUuid) {
            this.clientMemoryUuid = savedUuid;
            window.appGlobals.currentClientMemoryUuid = savedUuid;
        }
        else {
            this.clientMemoryUuid = crypto.randomUUID();
            localStorage.setItem(storageKey, this.clientMemoryUuid);
            window.appGlobals.currentClientMemoryUuid = this.clientMemoryUuid;
        }
        this.setupServerApi();
    }
    async setupServerApi() {
        this.serverApi = new YpAssistantServerApi(this.clientMemoryUuid);
    }
    connectedCallback() {
        super.connectedCallback();
        this.getMemoryFromServer();
        this.addGlobalListener("yp-logged-in", this.userLoggedIn.bind(this));
        this.addGlobalListener("agent-configuration-submitted", this.agentConfigurationSubmitted.bind(this));
        this.addListener("yp-open-markdown-report", this.openMarkdownReport.bind(this));
    }
    async openMarkdownReport(event) {
        if (!event.detail) {
            return;
        }
        this.currentMarkdownReport = event.detail.markdownReport;
        if (this.currentMarkdownReport) {
            this.markdownReportOpen = true;
            window.scrollTo(0, 0);
        }
    }
    async agentConfigurationSubmitted() {
        const clientSystemMessage = {
            type: "client_system_message",
            sender: "system",
            message: "agent_configuration_submitted",
        };
        this.ws.send(JSON.stringify(clientSystemMessage));
    }
    async agentRunChanged() {
        const clientSystemMessage = {
            type: "client_system_message",
            sender: "system",
            message: "agent_run_changed",
        };
        this.ws.send(JSON.stringify(clientSystemMessage));
    }
    async userLoggedIn(event) {
        if (!event.detail) {
            return;
        }
        if (this.haveLoggedIn) {
            console.log("User already logged in for assistant");
            return;
        }
        this.haveLoggedIn = true;
        await this.serverApi.updateAssistantMemoryUserLoginStatus(this.domainId);
        const clientSystemMessage = {
            type: "client_system_message",
            sender: "system",
            message: "user_logged_in",
        };
        this.ws.send(JSON.stringify(clientSystemMessage));
    }
    firstUpdated(changedProperties) {
        if (changedProperties) {
            super.firstUpdated(changedProperties);
        }
        this.scrollDown();
    }
    async getMemoryFromServer() {
        if (!this.chatLog || this.chatLog.length === 0) {
            try {
                const { chatLog, modeData, currentMode } = (await this.serverApi.getMemoryFromServer(this.domainId));
                this.currentMode = currentMode;
                if (chatLog && chatLog.length > 0) {
                    this.loadLastDirectAvatarUrlAndName();
                    this.chatLogFromServer = chatLog.map((chatLogItem) => ({
                        ...chatLogItem,
                        date: new Date(chatLogItem.date),
                        sender: chatLogItem.sender,
                    }));
                    this.chatLog = this.chatLogFromServer;
                    this.requestUpdate();
                    await this.updateComplete;
                    //TODO: Figure this out better
                    await new Promise((resolve) => setTimeout(resolve, 15));
                    this.scrollDown();
                }
            }
            catch (error) {
                console.error("Error getting chat log from server:", error);
            }
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
        this.removeGlobalListener("yp-logged-in", this.userLoggedIn.bind(this));
        this.removeGlobalListener("agent-configuration-submitted", this.agentConfigurationSubmitted.bind(this));
        this.removeGlobalListener("yp-open-markdown-report", this.openMarkdownReport.bind(this));
    }
    async setupVoiceCapabilities() { }
    get talkingHeadImageUrl() {
        if (this.aiIsSpeaking) {
            return "https://assets.evoly.ai/dl/8ddaf573eea398f9042aec7134e5dc37--retina-1.png";
        }
        else if (this.userIsSpeaking) {
            return "https://assets.evoly.ai/dl/8ddaf573eea398f9042aec7134e5dc37--retina-1.png";
        }
        else
            return "https://assets.evoly.ai/dl/8ddaf573eea398f9042aec7134e5dc37--retina-1.png";
    }
    renderVoiceTalkingHead() {
        return html `
      <div class="layout horizontal" ?voice-not-enabled="${!this.voiceEnabled}">
        <img
          class="talking-head-image"
          src="${this.directAgentAvatarUrl
            ? this.directAgentAvatarUrl
            : this.talkingHeadImageUrl}"
          alt="Voice Assistant"
        />
      </div>
    `;
    }
    get chatLogWithDeduplicatedWidgets() {
        // Keep track of seen tokens and their last occurrence
        const tokenLastIndex = new Map();
        // First pass: find last occurrence of each token
        this.chatLog.forEach((element, index) => {
            if (element.uniqueToken) {
                tokenLastIndex.set(element.uniqueToken, index);
            }
        });
        // Second pass: filter out elements with tokens unless they're the last occurrence
        return this.chatLog.filter((element, index) => {
            if (!element.uniqueToken)
                return true;
            return tokenLastIndex.get(element.uniqueToken) === index;
        });
    }
    async startInVoiceMode() {
        this.welcomeScreenOpen = false;
        this.toggleVoiceMode();
        await this.updateComplete;
        // wait 10 ms
        await new Promise((resolve) => setTimeout(resolve, 10));
        this.scrollDown();
    }
    async startInTextMode() {
        this.welcomeScreenOpen = false;
        await this.updateComplete;
        // wait 10 ms
        await new Promise((resolve) => setTimeout(resolve, 10));
        this.scrollDown();
        // wait 300 ms
        setTimeout(() => {
            this.scrollDown();
            this.chatInputField.focus();
        }, 200);
    }
    async closeMarkdownReport() {
        this.markdownReportOpen = false;
        await this.updateComplete;
        this.scrollDown();
    }
    async downloadPdf() {
        console.log("downloadPdf");
    }
    renderMarkdownReport() {
        return html `<div class="markdownContainer layout vertical">
      <div class="markdownInnerContainer">
        <div class="layout horizontal">
          <md-filled-tonal-icon-button
            class="closeMarkdownReportButton"
            @click=${this.closeMarkdownReport}
            ><md-icon>close</md-icon></md-filled-tonal-icon-button
          >
          <div class="flex"></div>
          <md-filled-button
            ?has-static-theme="${this.hasStaticTheme}"
            class="downloadPdfButton"
            @click=${this.downloadPdf}
            >${this.t("downloadPdf")}</md-filled-button
          >
        </div>
        ${resolveMarkdown(this.currentMarkdownReport, {
            includeImages: true,
            includeCodeBlockClassNames: true,
            handleJsonBlocks: true,
            targetElement: this,
        })}
      </div>
    </div>`;
    }
    render() {
        if (this.welcomeScreenOpen && this.chatLog.length === 0) {
            return html `<yp-assistant-welcome
        @yp-start-voice-mode="${this.startInVoiceMode}"
        @yp-start-text-mode="${this.startInTextMode}"
        .welcomeTextHtml="${this.welcomeTextHtml}"
        .avatarUrl="${this.directAgentAvatarUrl
                ? this.directAgentAvatarUrl
                : this.talkingHeadImageUrl}"
      ></yp-assistant-welcome>`;
        }
        if (this.markdownReportOpen && this.currentMarkdownReport) {
            return this.renderMarkdownReport();
        }
        return html `${cache(html `
      <div class="chat-window" id="chat-window" ?expanded="${this.isExpanded}">
        <div class="voice-input-container">
          <div class="voice-input">${this.renderVoiceInput()}</div>
        </div>
        <div class="hybrid-chat-messages" id="chat-messages">
          <yp-assistant-item-base
            ?hidden="${true || !this.defaultInfoMessage}"
            class="chatElement assistant-chat-element"
            .detectedLanguage="${this.language}"
            .message="${this.defaultInfoMessage}"
            type="info"
            sender="assistant"
          ></yp-assistant-item-base>
          ${this.chatLogWithDeduplicatedWidgets
            .filter((chatElement) => !chatElement.hidden &&
            chatElement.type !== "hiddenContextMessage" &&
            chatElement.type !== "thinking" &&
            (chatElement.message != "" || chatElement.html != ""))
            .map((chatElement) => html `
                <yp-assistant-item-base
                  ?thinking="${chatElement.type === "thinking" ||
            chatElement.type === "noStreaming"}"
                  @followup-question="${this.followUpQuestion}"
                  .clusterId="${this.clusterId}"
                  class="chatElement ${chatElement.sender}-chat-element"
                  .detectedLanguage="${this.language}"
                  .avatarUrl="${chatElement.avatarUrl ||
            this.talkingHeadImageUrl}"
                  .message="${chatElement.message || ""}"
                  .htmlToRender="${chatElement.html || ""}"
                  @scroll-down-enabled="${() => (this.userScrolled = false)}"
                  .type="${chatElement.type || "message"}"
                  .sender="${chatElement.sender || "assistant"}"
                ></yp-assistant-item-base>
              `)}
        </div>
        <div class="chat-input-container">
          <div class="chat-input">${this.renderChatAssistantInput()}</div>
        </div>
      </div>
    `)}`;
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
        await this.serverApi.startVoiceSession(this.domainId, this.wsClientId, this.currentMode);
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
    saveLastDirectAvatarUrlAndName() {
        localStorage.setItem("lastDirectAvatarUrl", this.directAgentAvatarUrl || "");
        localStorage.setItem("lastDirectAvatarName", this.directAgentName || "");
    }
    loadLastDirectAvatarUrlAndName() {
        this.directAgentAvatarUrl = localStorage.getItem("lastDirectAvatarUrl") || undefined;
        this.directAgentName = localStorage.getItem("lastDirectAvatarName") || null;
    }
    resetLastDirectAvatarUrlAndName() {
        localStorage.removeItem("lastDirectAvatarUrl");
        localStorage.removeItem("lastDirectAvatarName");
    }
    async resetWaveformPlayer() {
        await this.wavStreamPlayer?.interrupt();
        this.wavStreamPlayer = new WavStreamPlayer({ sampleRate: 24000 });
        await this.wavStreamPlayer?.connect();
    }
    async onMessage(event) {
        const data = JSON.parse(event.data);
        // Handle messages with HTML content
        if (data.sender === "assistant" && data.html) {
            // Add message to chat log with reference to component
            this.addChatBotElement({
                sender: "assistant",
                type: "html",
                message: data.message || "",
                html: data.html,
                avatarUrl: data.avatarUrl,
                uniqueToken: data.uniqueToken,
            });
            await this.updateComplete;
            await new Promise((resolve) => setTimeout(resolve, 50));
            this.scrollDown();
            return;
        }
        switch (data.type) {
            case "ui_click":
                const type = data.message;
                if (type === "login-button-main") {
                    this.fireGlobal("assistant-requested-login-main-button-click");
                }
                else if (type === "login-button-google") {
                    this.fireGlobal("assistant-requested-login-google-button-click");
                }
                else if (type === "logout") {
                    this.fireGlobal("assistant-requested-logout-button-click");
                }
                else if (type === "submit-agent-configuration") {
                    this.fireGlobal("assistant-requested-submit-agent-configuration");
                }
                else {
                    console.error("No mode received in current_mode message");
                }
                break;
            case "current_mode":
                if (data.mode) {
                    this.currentMode = data.mode;
                }
                else {
                    console.error("No mode received in current_mode message");
                }
                break;
            case "audio":
                if (data.base64Audio) {
                    const audioData = this.base64ToArrayBuffer(data.base64Audio);
                    this.wavStreamPlayer?.add16BitPCM(audioData);
                    this.aiIsSpeaking = true;
                    clearTimeout(this.aiSpeakingTimeout);
                    this.aiSpeakingTimeout = setTimeout(() => {
                        //this.aiIsSpeaking = false;
                    }, 2500);
                }
                break;
            case "updated_workflow":
                if (data.updatedWorkflow) {
                    try {
                        this.agentRunChanged();
                        this.fireGlobal("yp-updated-agent-workflow", data.updatedWorkflow);
                    }
                    catch (e) {
                        console.error("Error parsing updated workflow", e);
                    }
                }
                break;
            case "current_mode":
                if (data.mode) {
                    this.currentMode = data.mode;
                }
                else {
                    console.error("No mode received in current_mode message");
                }
                break;
            case "avatar_url_change":
                if (data.url == null || data.data == null) {
                    this.directAgentAvatarUrl = undefined;
                    this.directAgentName = null;
                }
                else {
                    this.directAgentAvatarUrl = data.url;
                    this.directAgentName = data.data;
                    this.saveLastDirectAvatarUrlAndName();
                }
                break;
            case "clear_audio_buffer":
                await this.resetWaveformPlayer();
                this.aiIsSpeaking = false;
                break;
            case "listening_start":
                if (this.lastChatUiElement) {
                    this.lastChatUiElement.isSpeaking = true;
                }
                this.userIsSpeaking = true;
                this.aiIsSpeaking = false;
                await this.resetWaveformPlayer();
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
        this.isExpanded = this.voiceEnabled;
        this.fireGlobal("yp-hide-collection-header-status", this.isExpanded);
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
    async reallyClearHistory() {
        await this.serverApi.clearChatLogFromServer(this.domainId);
        this.chatLog = [];
        this.welcomeScreenOpen = true;
        this.directAgentAvatarUrl = undefined;
        this.resetLastDirectAvatarUrlAndName();
        this.stopCanvasRendering();
        this.requestUpdate();
        location.reload();
    }
    async clearHistory() {
        window.appDialogs.getDialogAsync("confirmationDialog", (dialog) => {
            dialog.open(this.t("confirmClearHistory"), this.reallyClearHistory.bind(this));
        });
    }
    static get styles() {
        return [
            super.styles,
            css `
        .markdownContainer {
          padding-top: 48px;
        }

        md-filled-button[has-static-theme] {
          --md-filled-button-container-color: var(
            --md-sys-color-primary-container
          );
          --md-sys-color-on-primary: var(--md-sys-color-on-primary-container);
        }

        .sendChatIcon {
          margin-right: 24px;
        }
        .closeMarkdownReportButton,
        .downloadPdfButton {
          margin-bottom: 8px;
        }

        .markdownInnerContainer {
          max-width: 900px;
          border: 1px solid var(--md-sys-color-outline-variant, #f00);
          padding: 32px;
          padding-left: 48px;
          padding-right: 48px;
          padding-top: 20px;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .pulsing {
          animation: pulse 2.75s infinite;
        }

        .voice-mode-toggle {
          margin-top: 16px;
        }

        .chat-window {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 45vh;
          width: 100%;
          max-width: 768px;
          margin: 0 auto;
          border-radius: 10px;
          overflow: hidden;
        }

        .hybrid-chat-messages {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow-y: visible;
          max-width: 768px;
        }

        .talkToTheAssistantButton {
          --md-elevated-button-label-text-color: #fff;
          --md-elevated-button-focus-label-text-color: #fff;
          --md-elevated-button-hover-label-text-color: #fff;
          --md-elevated-button-container-shadow-color: var(
            --yp-sys-color-agent-green
          );
          --md-elevated-button-container-height: 39px;
          --md-elevated-button-container-color: var(--yp-sys-color-agent-green);
          --md-elevated-button-label-text-weight: 600;
          --md-elevated-button-label-text-size: 14px;
          height: 39px;
          margin-top: 32px;
        }

        .resetChatButton {
          margin-top: 32px;
          margin-left: 24px;
          height: 39px;
          --md-text-button-label-text-weight: 600;
          --md-text-button-label-text-size: 14px;
          --md-text-button-label-text-color: var(--yp-sys-color-agent-black);
          --md-text-button-focus-label-text-color: var(
            --yp-sys-color-agent-black
          );
          --md-text-button-hover-label-text-color: var(
            --yp-sys-color-agent-black
          );
          --md-text-button-container-color: var(--yp-sys-color-agent-black);
        }

        .stopVoiceButton {
          height: 39px;
          margin-top: 32px;
          --md-outlined-button-label-text-color: var(
            --yp-sys-color-agent-black
          );
          --md-outlined-button-focus-label-text-color: var(
            --yp-sys-color-agent-black
          );
          --md-outlined-button-hover-label-text-color: var(
            --yp-sys-color-agent-black
          );
          --md-outlined-button-label-text-weight: 600;
          --md-outlined-button-label-text-size: 14px;
        }

        .you-chat-element {
          align-self: flex-start;
          justify-content: flex-start;
        }

        .assistant-chat-element {
          align-self: flex-start;
          justify-content: flex-start;
          width: 100%;
          max-width: 100%;
        }

        .chat-input {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0;
        }

        .chat-window {
          width: 100%;
          max-width: 768px;
          margin: 0 auto;
          border-radius: 10px;
        }

        .voice-input-container {
          position: fixed;
          padding-top: 12px;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          width: 768px;
          height: 124px;
          background: var(--md-sys-color-surface-container-lowest);
        }

        .voice-input {
          position: fixed;
          top: 0;
          padding-top: 28px;
          padding-bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 768px;
          background: var(--md-sys-color-surface-container-lowest);
        }

        @media (max-width: 820px) {
          .voice-input {
            width: 100%;
          }
        }

        .chat-input-container {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100vw;
          z-index: 10;
          height: 56px;
          background: var(--md-sys-color-surface-container-lowest);
        }

        .chat-input {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 11;
          left: 50%;
          height: 56px;
          transform: translateX(-50%);
          z-index: 10;
          width: 768px;
          padding: 0;
          margin-bottom: 24px;
          background: var(--md-sys-color-surface-container-lowest);
        }

        .hybrid-chat-messages {
          padding-top: 140px;
          padding-bottom: 130px;
        }

        /* Remove flex properties and height constraints */
        .chat-window,
        .hybrid-chat-messages {
          display: block;
          height: auto;
          overflow: visible;
        }

        .assistantName {
          font-size: 22px;
          font-weight: 700;
          color: var(--md-sys-color-on-surface);
          line-height: 33px;
          font-family: var(--md-ref-typeface-brand);
          margin-top: -6px;
          margin-left: 8px;
        }

        .nameAndStartStop {
          margin-left: 24px;
        }

        .voiceClose {
          margin-left: 20px;
          margin-right: 6px;
        }

        .voiceAvatar {
          align-items: left;
          align-self: flex-start;
        }

        md-icon.voiceModeToggleIcon {
          --md-icon-size: 40px;
          width: 40px;
          height: 40px;
        }

        md-fab {
          --md-fab-container-shape: 4px;
          --md-fab-label-text-size: 15px !important;
          --md-fab-label-text-weight: 500 !important;
          --md-fab-container-elevation: 0;
          --md-fab-container-shadow-color: transparent;
        }

        md-fab:not([has-static-theme]) {
          --md-sys-color-primary-container: var(--md-sys-color-primary);
          --md-sys-color-on-primary-container: var(--md-sys-color-on-primary);
        }

        .currentMode {
          font-size: 17px;
          font-weight: 700;
          color: var(--md-sys-color-on-surface);
          margin-bottom: 16px;
          font-family: var(--md-ref-typeface-brand);
        }

        .voice-header {
          align-items: left;
        }

        .voice-header[voice-not-enabled] {
          filter: grayscale(100%);
        }

        .talking-head-image {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
        }

        .waveform-canvas {
          width: 100%;
          height: 60px;
          margin-top: 8px;
          margin-left: 24px;
          background: transparent;
          border-radius: 0;
          max-width: 100px;
        }

        .voice-controls {
        }

        md-filled-tonal-button {
          border-radius: 4px;
        }

        .voice-button {
          --md-icon-button-icon-size: 24px;
          margin-right: 24px;
        }

        .voice-button[recording] {
          --md-icon-button-container-color: var(--md-sys-color-error);
          --md-icon-button-icon-color: var(--md-sys-color-on-error);
          /* animation: pulse 2s infinite; */
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

        .infoMessage {
          margin-top: 8px;
        }

        .chat-window {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 60px);
          width: 768px;
          max-width: 768px;
          margin: 0 auto;
          border-radius: 10px;
        }

        /* .chat-window[expanded] {
          height: calc(100vh - 148px);
        } */

        .chat-messages {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 20px;
          overflow-y: scroll;
        }

        .you-chat-element {
          align-self: flex-start;
          max-width: 100%;
          justify-content: flex-start;
          margin-right: 32px;
        }

        .assistant-chat-element {
          align-self: flex-start;
          justify-content: flex-start;
          width: 100%;
          max-width: 100%;
        }

        .chat-input {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        md-filled-text-field {
          flex: 1;
          --md-filled-text-field-container-shape: 32px;
          --md-filled-text-field-focus-active-indicator-color: transparent;
          --md-filled-field-active-indicator-height: 0;
          --md-filled-field-focus-active-indicator-height: 0;
          --md-filled-field-hover-active-indicator-color: transparent;
          --md-filled-field-leading-space: 24px;

          border: none;
          margin: 16px;
          margin-bottom: 16px;
          margin-left: 0;
          margin-right: 0;
          padding: 0px;
          width: 768px !important;
          --md-filled-text-field-container-color: #f4f4f4;
          --md-filled-text-field-hover-container-color: #f4f4f4;
          --md-icon-size: 32px;
        }

        md-filled-text-field[dark-mode] {
          --md-filled-text-field-container-color: var(
            --md-sys-color-surface-container-highest
          );
        }

        .chatElement[thinking] {
          margin-top: 16px;
          margin-bottom: 8px;
        }

        @media (max-width: 450px) {
          md-filled-text-field {
            width: 350px;
          }

          md-filled-text-field[focused] {
            width: 100%;
          }
        }

        @media (max-width: 400px) {
          md-filled-text-field {
            width: 320px;
          }

          md-filled-text-field[focused] {
            width: 100%;
          }
        }

        .agentBundleLogo {
          width: 125px;
          height: 39px;
          margin-right: 64px;
          z-index: 25;
        }

        .logoContainer {
          padding: 16px;
          z-index: 15;
          position: fixed;
          top: -15px;
          left: -230px;
        }

        @media (max-width: 600px) {
          .chat-window {
          }

          .you-chat-element {
            margin-right: 0;
          }
        }
      `,
        ];
    }
    renderVoiceStartButton() {
        return html `<svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="20" fill="#2ECC71" />
      <rect width="24" height="24" transform="translate(8 8)" fill="#2ECC71" />
      <path
        d="M15 29.5H17V31.5H15V29.5ZM20 20.5C21.66 20.5 23 19.16 23 17.5V11.5C23 9.84 21.66 8.5 20 8.5C18.34 8.5 17 9.84 17 11.5V17.5C17 19.16 18.34 20.5 20 20.5ZM19 11.5C19 10.95 19.45 10.5 20 10.5C20.55 10.5 21 10.95 21 11.5V17.5C21 18.06 20.56 18.5 20 18.5C19.45 18.5 19 18.05 19 17.5V11.5ZM19 29.5H21V31.5H19V29.5ZM23 29.5H25V31.5H23V29.5ZM27 17.5H25.3C25.3 20.5 22.76 22.6 20 22.6C17.24 22.6 14.7 20.5 14.7 17.5H13C13 20.91 15.72 23.73 19 24.22V27.5H21V24.22C24.28 23.73 27 20.91 27 17.5Z"
        fill="white"
      />
    </svg> `;
    }
    renderBottomDisclaimer() {
        return html `<div class="bottomDisclaimer">
      ${this.t("bottomAmplifierDisclaimer")}
    </div>`;
    }
    renderChatAssistantInput() {
        return html `
      ${this.showCleanupButton
            ? html `
            <md-outlined-icon-button
              class="restartButton"
              @click="${() => this.fire("reset-chat")}"
              ><md-icon>refresh</md-icon></md-outlined-icon-button
            >
          `
            : nothing}
      ${this.showCloseButton
            ? html `
            <md-outlined-icon-button
              class="closeButton"
              @click="${() => this.fire("chatbot-close")}"
              ><md-icon>close</md-icon></md-outlined-icon-button
            >
          `
            : nothing}

      <md-filled-text-field
        class="textInput"
        type="text"
        ?dark-mode="${this.themeDarkMode}"
        hasTrailingIcon
        id="chatInput"
        @focus="${() => (this.inputIsFocused = true)}"
        @blur="${() => (this.inputIsFocused = true)}"
        @keyup="${(e) => {
            if (e.key === "Enter") {
                this.sendChatMessage();
            }
        }}"
        .label="${this.textInputLabel}"
      >
        <div
          class="sendChatIcon"
          @click="${this.sendChatMessage}"
          slot="trailing-icon"
          id="sendButton"
          ?input-is-focused="${this.inputIsFocused}"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="16" fill="#D7D7D7" />
            <path
              d="M8.5332 16L9.8492 17.316L15.0665 12.108V23.4667H16.9332V12.108L22.1412 17.3253L23.4665 16L15.9999 8.53333L8.5332 16Z"
              fill="#F4F4F4"
            />
          </svg>
        </div>
      </md-filled-text-field>
    `;
    }
    renderStartStopVoiceIconButton() {
        return html `
      <md-icon-button
        class="voice-mode-toggle ${this.voiceEnabled ? "pulsing" : ""}"
        @click="${this.toggleVoiceMode}"
        .label="${this.voiceEnabled
            ? this.t("closeAssistant")
            : this.t("voiceAssistant")}"
        aria-pressed="${this.voiceEnabled}"
        aria-label="${this.voiceEnabled
            ? this.t("closeAssistant")
            : this.t("voiceAssistant")}"
      >
        <md-icon class="voiceModeToggleIcon">
          ${this.renderVoiceStartButton()}
        </md-icon>
      </md-icon-button>

      ${this.voiceEnabled
            ? html `
            <md-icon-button
              hidden
              class="voice-mode-toggle"
              @click="${this.toggleVoiceMode}"
              .label="${!this.voiceEnabled
                ? this.t("voiceAssistant")
                : this.t("closeAssistant")}"
            >
              <md-icon class="voiceModeToggleIcon"> cancel</md-icon>
            </md-icon-button>
          `
            : nothing}
    `;
    }
    renderStartStopVoiceButton() {
        return html `
      ${this.voiceEnabled
            ? html `
            <md-outlined-button
              class="stopVoiceButton"
              @click="${this.toggleVoiceMode}"
            >
              ${this.t("stopTalking")}
            </md-outlined-button>
          `
            : html `<md-elevated-button
            class="talkToTheAssistantButton"
            @click="${this.toggleVoiceMode}"
          >
            ${this.t("startTalking")}
          </md-elevated-button>`}
    `;
    }
    renderResetChatButton() {
        return html `<md-text-button
      class="resetChatButton"
      @click="${this.clearHistory}"
      >${this.t("resetChat")}</md-text-button
    >`;
    }
    renderAssistantName() {
        return html `<div class="assistantName">
      ${this.directAgentName ? this.directAgentName : this.t("mainAssistant")}
    </div>`;
    }
    renderVoiceInput() {
        return html `
      <div class="layout horizontal voiceAvatar">
        ${this.renderVoiceTalkingHead()}
        <div class="nameAndStartStop layout vertical">
          ${this.renderAssistantName()}
          <div class="layout horizontal">
            ${this.renderStartStopVoiceButton()}
            <canvas
              ?hidden="${!this.voiceEnabled}"
              id="waveformCanvas"
              class="waveform-canvas"
            ></canvas>
            ${this.voiceEnabled ? html `` : this.renderResetChatButton()}
          </div>
        </div>
        <div hidden class="currentMode">${this.t(this.currentMode)}</div>
      </div>
    `;
    }
};
__decorate([
    property({ type: Boolean })
], YpAssistantBase.prototype, "voiceEnabled", void 0);
__decorate([
    property({ type: Number })
], YpAssistantBase.prototype, "domainId", void 0);
__decorate([
    property({ type: String })
], YpAssistantBase.prototype, "mainAssistantAvatarUrl", void 0);
__decorate([
    property({ type: String })
], YpAssistantBase.prototype, "directAgentAvatarUrl", void 0);
__decorate([
    property({ type: Boolean })
], YpAssistantBase.prototype, "useMainWindowScroll", void 0);
__decorate([
    property({ type: String })
], YpAssistantBase.prototype, "directAgentName", void 0);
__decorate([
    property({ type: Boolean })
], YpAssistantBase.prototype, "welcomeScreenOpen", void 0);
__decorate([
    property({ type: String })
], YpAssistantBase.prototype, "welcomeTextHtml", void 0);
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
    property({ type: Array })
], YpAssistantBase.prototype, "chatLogFromServer", void 0);
__decorate([
    state()
], YpAssistantBase.prototype, "currentMode", void 0);
__decorate([
    state()
], YpAssistantBase.prototype, "markdownReportOpen", void 0);
__decorate([
    state()
], YpAssistantBase.prototype, "currentMarkdownReport", void 0);
__decorate([
    state()
], YpAssistantBase.prototype, "isExpanded", void 0);
__decorate([
    query("#voiceButton")
], YpAssistantBase.prototype, "voiceButton", void 0);
__decorate([
    property({ type: String })
], YpAssistantBase.prototype, "textInputLabel", void 0);
__decorate([
    property({ type: String })
], YpAssistantBase.prototype, "defaultInfoMessage", void 0);
__decorate([
    query("#waveformCanvas")
], YpAssistantBase.prototype, "waveformCanvas", void 0);
YpAssistantBase = YpAssistantBase_1 = __decorate([
    customElement("yp-assistant-base")
], YpAssistantBase);
export { YpAssistantBase };
//# sourceMappingURL=yp-assistant-base.js.map