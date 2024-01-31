var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
const PROMPT_DEBUG = true;
let YpStreamingLlm = class YpStreamingLlm extends YpBaseElement {
    constructor() {
        super();
        this.chatLog = [];
        this.webSocketsErrorCount = 0;
        this.userScrolled = false;
        this.currentFollowUpQuestions = '';
        this.programmaticScroll = false;
        this.scrollStart = 0;
        this.defaultDevWsPort = 8000;
    }
    connectedCallback() {
        super.connectedCallback();
        this.initWebSockets();
    }
    initWebSockets() {
        let wsEndpoint;
        if (window.location.hostname === 'localhost' ||
            window.location.hostname === '192.1.168') {
            wsEndpoint = `ws://${window.location.hostname}:${this.defaultDevWsPort}`;
        }
        else {
            wsEndpoint = `wss://${window.location.hostname}:443`;
        }
        try {
            this.ws = new WebSocket(wsEndpoint);
            console.error('WebSocket Opened');
            this.ws.onmessage = this.onMessage.bind(this);
            this.ws.onopen = this.onWsOpen.bind(this);
            this.ws.onerror = error => {
                //TODO: Try to resend the last message
                this.webSocketsErrorCount++;
                console.error('WebSocket Error ' + error);
                setTimeout(() => this.initWebSockets(), this.webSocketsErrorCount > 1
                    ? this.webSocketsErrorCount * 1000
                    : 2000);
            };
            this.ws.onclose = error => {
                console.error('WebSocket Close ' + error);
                this.webSocketsErrorCount++;
                setTimeout(() => this.initWebSockets(), this.webSocketsErrorCount > 1
                    ? this.webSocketsErrorCount * 1000
                    : 2000);
            };
        }
        catch (error) {
            console.error('WebSocket Error ' + error);
            this.webSocketsErrorCount++;
            setTimeout(() => this.initWebSockets(), this.webSocketsErrorCount > 1 ? this.webSocketsErrorCount * 1000 : 1500);
        }
    }
    sendHeartbeat() {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'heartbeat' }));
        }
        else {
            console.error('WebSocket not open');
        }
    }
    onWsOpen() {
        console.error('WebSocket onWsOpen');
        this.sendHeartbeat();
        //@ts-ignore
        this.heartbeatInterval = setInterval(() => this.sendHeartbeat(), 55000);
        this.ws.onmessage = messageEvent => {
            const data = JSON.parse(messageEvent.data);
            if (data.clientId) {
                this.wsClientId = data.clientId;
                this.ws.onmessage = this.onMessage.bind(this);
                console.error(`WebSocket clientId: ${this.wsClientId}`);
            }
            else {
                console.error('Error: No clientId received from server!');
            }
        };
    }
    handleScroll() {
        if (this.programmaticScroll) {
            return; // Skip handling if the scroll was initiated programmatically
        }
        const currentScrollTop = this.$$("#chat-messages").scrollTop;
        if (this.scrollStart === 0) {
            // Initial scroll
            this.scrollStart = currentScrollTop;
        }
        const threshold = 10;
        const atBottom = this.$$("#chat-messages").scrollHeight -
            currentScrollTop -
            this.$$("#chat-messages").clientHeight <=
            threshold;
        if (atBottom) {
            this.userScrolled = false;
            this.scrollStart = 0; // Reset scroll start
        }
        else if (Math.abs(this.scrollStart - currentScrollTop) > threshold) {
            this.userScrolled = true;
            // Optionally reset scrollStart here if you want to continuously check for threshold scroll
            // this.scrollStart = currentScrollTop;
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        if (this.ws) {
            this.ws.close();
        }
    }
    async onMessage(event) {
        const data = JSON.parse(event.data);
        //console.error(event.data);
        switch (data.sender) {
            case 'bot':
                this.addChatBotElement(data);
                break;
            case 'you':
                this.addChatUserElement(data);
                break;
        }
        if (data.type !== 'stream_followup') {
            this.scrollDown();
        }
    }
    scrollDown() {
        if (!this.userScrolled) {
            this.programmaticScroll = true; // Set the flag before scrolling
            this.$$('#chat-messages').scrollTop =
                this.$$('#chat-messages').scrollHeight;
            setTimeout(() => {
                this.programmaticScroll = false; // Reset the flag after scrolling
            }, 100);
        }
    }
    addUserChatBotMessage(userMessage) {
        this.addChatBotElement({
            sender: 'you',
            type: 'start',
            message: userMessage,
        });
    }
    addThinkingChatBotMessage() {
        this.addChatBotElement({
            sender: 'bot',
            type: 'thinking',
            message: '',
        });
    }
    addToChatLogWithMessage(data, message = undefined, changeButtonDisabledState = undefined, changeButtonLabelTo = undefined, refinedCausesSuggestions = undefined, rawMessage = undefined) {
        this.infoMessage = message;
        data.refinedCausesSuggestions = refinedCausesSuggestions || [];
        data.rawMessage = data.rawMessage || rawMessage;
        this.chatLog = [...this.chatLog, data];
        this.requestUpdate();
        if (changeButtonDisabledState !== undefined) {
            this.sendButton.disabled = changeButtonDisabledState;
        }
        if (changeButtonLabelTo !== undefined) {
            //this.sendButton!.innerHTML = changeButtonLabelTo;
        }
    }
    get lastChatUiElement() {
        return this.chatElements[this.chatElements.length - 1];
    }
    async addChatBotElement(wsMessage) {
        switch (wsMessage.type) {
            case 'hello_message':
                this.addToChatLogWithMessage(wsMessage);
                break;
            case 'thinking':
                if (this.lastChatUiElement) {
                    this.lastChatUiElement.spinnerActive = false;
                }
                this.addToChatLogWithMessage(wsMessage, this.t('Thinking...'));
                break;
            case 'noStreaming':
                this.addToChatLogWithMessage(wsMessage, wsMessage.message);
                await this.updateComplete;
                this.lastChatUiElement.spinnerActive = true;
                break;
            case 'agentStart':
            case 'validationAgentStart':
                console.log('agentStart');
                if (this.lastChatUiElement) {
                    this.lastChatUiElement.spinnerActive = false;
                }
                const startOptions = wsMessage.data;
                setTimeout(() => {
                    this.scrollDown();
                }, 50);
                if (startOptions.noStreaming) {
                    this.addChatBotElement({
                        sender: 'bot',
                        type: 'noStreaming',
                        message: startOptions.name,
                    });
                }
                else {
                    this.addToChatLogWithMessage(wsMessage, startOptions.name);
                    this.chatLog[this.chatLog.length - 1].message = `${startOptions.name}\n\n`;
                }
                this.requestUpdate();
                break;
            case 'liveLlmCosts':
                this.fire('llm-total-cost-update', wsMessage.data);
                break;
            case 'memoryIdCreated':
                this.serverMemoryId = wsMessage.data;
                this.fire('server-memory-id-created', wsMessage.data);
                break;
            case 'agentCompleted':
            case 'validationAgentCompleted':
                console.log('agentCompleted...');
                const completedOptions = wsMessage.data;
                if (this.lastChatUiElement) {
                    this.lastChatUiElement.spinnerActive = false;
                    this.lastChatUiElement.message = completedOptions.name;
                }
                else {
                    console.error('No last element on agentCompleted');
                }
                break;
            case 'agentUpdated':
                console.log('agentUpdated');
                if (this.lastChatUiElement) {
                    this.lastChatUiElement.updateMessage = wsMessage.message;
                }
                else {
                    console.error('No last element on agentUpdated');
                }
                break;
            case 'start':
                if (this.lastChatUiElement) {
                    this.lastChatUiElement.spinnerActive = false;
                }
                this.addToChatLogWithMessage(wsMessage, this.t('Thinking...'));
                if (!this.chatLog[this.chatLog.length - 1].message)
                    this.chatLog[this.chatLog.length - 1].message = '';
                break;
            case 'start_followup':
                this.lastChatUiElement.followUpQuestionsRaw = '';
                break;
            case 'stream_followup':
                this.lastChatUiElement.followUpQuestionsRaw += wsMessage.message;
                this.requestUpdate();
                break;
            case 'info':
                this.infoMessage = wsMessage.message;
                break;
            case 'moderation_error':
                wsMessage.message =
                    'OpenAI Moderation Flag Error. Please refine your question.';
                this.addToChatLogWithMessage(wsMessage, wsMessage.message, false, this.t('Send'));
                break;
            case 'error':
                this.addToChatLogWithMessage(wsMessage, wsMessage.message, false, this.t('Send'));
                break;
            case 'end':
                this.lastChatUiElement.stopJsonLoading();
                this.chatLog[this.chatLog.length - 1].debug = wsMessage.debug;
                this.sendButton.disabled = false;
                this.sendButton.innerHTML = this.t('Send');
                this.infoMessage = this.defaultInfoMessage;
                break;
            case 'message':
                if (this.lastChatUiElement) {
                    this.lastChatUiElement.spinnerActive = false;
                }
                this.addToChatLogWithMessage(wsMessage, wsMessage.message, undefined, undefined, wsMessage.refinedCausesSuggestions);
                this.chatLog[this.chatLog.length - 1].refinedCausesSuggestions =
                    wsMessage.refinedCausesSuggestions;
                this.sendButton.disabled = false;
                this.sendButton.innerHTML = this.t('Send');
                this.infoMessage = this.defaultInfoMessage;
                this.requestUpdate();
                break;
            case 'stream':
                if (wsMessage.message && wsMessage.message != 'undefined') {
                    //@ts-ignore
                    this.infoMessage = this.t('typing');
                    this.chatLog[this.chatLog.length - 1].message =
                        this.chatLog[this.chatLog.length - 1].message + wsMessage.message;
                    //console.error(this.chatLog[this.chatLog.length - 1].message)
                    this.requestUpdate();
                    break;
                }
        }
        this.scrollDown();
    }
    addChatUserElement(data) {
        this.chatLog = [...this.chatLog, data];
    }
    async sendChatMessage() {
        const message = this.chatInputField.value;
        if (message.length === 0)
            return;
        //this.ws.send(message);
        this.chatInputField.value = '';
        this.sendButton.disabled = false;
        //this.sendButton!.innerHTML = this.t('Thinking...');
        setTimeout(() => {
            this.chatInputField.blur();
        });
    }
    get simplifiedChatLog() {
        let chatLog = this.chatLog.filter(chatMessage => chatMessage.type != 'thinking' &&
            chatMessage.type != 'noStreaming' &&
            chatMessage.message);
        return chatLog.map(chatMessage => {
            return {
                sender: chatMessage.sender == 'bot' ? 'assistant' : 'user',
                message: chatMessage.rawMessage
                    ? chatMessage.rawMessage
                    : chatMessage.message,
            };
        });
    }
    static get styles() {
        return [
            super.styles,
            css `
        md-textfield {
          width: 600px;
          --mdc-theme-primary: var(--md-sys-color-primary);
          --mdc-text-field-ink-color: var(--md-sys-color-on-surface);
          --mdc-text-area-outlined-hover-border-color: var(
            --md-sys-color-on-surface
          );
          --mdc-text-area-outlined-idle-border-color: var(
            --md-sys-color-on-surface
          );
          --mdc-notched-outline-border-color: var(
            --md-sys-color-on-surface-variant
          );
        }

        md-outlined-text-field {
          width: 350px;
        }

        .infoMessage {
          margin-top: 8px;
        }

        .chat-window {
          display: flex;
          flex-direction: column;
          height: 75vh;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          border-radius: 10px;
          overflow: hidden;
        }
        .chat-messages {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 20px;
          overflow-y: scroll;
        }

        .you-chat-element {
          align-self: flex-end;
          max-width: 80%;
          justify-content: flex-end;
          margin-right: 32px;
        }

        .bot-chat-element {
          align-self: flex-start;
          justify-content: flex-start;
          width: 100%;
          max-width: 100%;
        }

        .chat-input {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px;
        }

        @media (max-width: 600px) {
          .chat-window {
            height: 100%;
          }

          .you-chat-element {
            margin-right: 0;
          }
        }

        md-tonal-button {
          padding: 16px;
          padding-left: 0;
          margin-top: 0;
        }

        .sendIcon {
          cursor: pointer;
        }

        .restartButton {
          margin-left: 16px;
        }

        .darkModeButton {
          margin-right: 16px;
        }

        md-outlined-text-field {
          flex: 1;
          border-radius: 10px;
          border: none;
          padding: 10px;
          margin: 16px;
          margin-bottom: 16px;
          margin-left: 8px;
          margin-right: 8px;
          width: 650px;
        }

        .chatElement[thinking] {
          margin-top: 8px;
          margin-bottom: 0px;
        }

        @media (max-width: 960px) {
          .restartButton {
            margin-left: 8px;
            display: none;
          }

          .darkModeButton {
            margin-right: 8px;
            display: none;
          }

          md-outlined-text-field {
            transition: transform 0.5s;
            width: 400px;
          }

          .restartButton[input-is-focused] {
          }

          .darkModeButton[input-is-focused] {
          }

          md-outlined-text-field[focused] {
            width: 100%;
          }
        }

        @media (max-width: 450px) {
          md-outlined-text-field {
            width: 350px;
          }

          md-outlined-text-field[focused] {
            width: 100%;
          }
        }

        @media (max-width: 400px) {
          md-outlined-text-field {
            width: 320px;
          }

          md-outlined-text-field[focused] {
            width: 100%;
          }
        }
      `,
        ];
    }
    followUpQuestion(event) {
        this.chatInputField.value = event.detail;
        this.sendChatMessage();
    }
    reset() {
        this.chatLog = [];
        if (this.ws) {
            this.ws.close();
            this.initWebSockets();
        }
        this.serverMemoryId = undefined;
        this.requestUpdate();
    }
    toggleDarkMode() {
        this.themeDarkMode = !this.themeDarkMode;
        this.fire('theme-dark-mode', this.themeDarkMode);
        this.requestUpdate();
    }
    renderChatInput() {
        return html `
      ${this.showCleanupButton
            ? html `
        <md-outlined-icon-button
          class="restartButton"
          @click="${() => this.fire('reset-chat')}"
        ><md-icon>refresh</md-icon></md-icon></md-outlined-icon-button>
      `
            : nothing}
      ${this.onlyUseTextField || this.chatLog.length > 1
            ? html `
            <md-outlined-text-field
              class="textInput"
              type="text"
              hasTrailingIcon
              id="chatInput"
              rows="${this.chatLog.length > 1 ? '1' : '3'}"
              @focus="${() => (this.inputIsFocused = true)}"
              @blur="${() => (this.inputIsFocused = true)}"
              @keyup="${(e) => {
                if (e.key === 'Enter') {
                    this.sendChatMessage();
                }
            }}"
              .label="${this.textInputLabel}"
            >
              <md-icon
                class="sendIcon"
                @click="${this.sendChatMessage}"
                slot="trailing-icon"
                id="sendButton"
                ?input-is-focused="${this.inputIsFocused}"
                >send</md-icon
              >
            </md-outlined-text-field>
          `
            : html `<md-outlined-text-field
            class="textInput"
            type="textarea"
            hasTrailingIcon
            id="chatInput"
            rows="3"
            @focus="${() => (this.inputIsFocused = true)}"
            @blur="${() => (this.inputIsFocused = true)}"
            .label="${this.textInputLabel}"
          >
            <md-icon
              class="sendIcon"
              @click="${this.sendChatMessage}"
              slot="trailing-icon"
              id="sendButton"
              ?input-is-focused="${this.inputIsFocused}"
              >send</md-icon
            ></md-outlined-text-field
          >`}
    `;
    }
    render() {
        return html `
      <div class="chat-window" id="chat-window">
        <div class="chat-messages" id="chat-messages">
          <ps-ai-chat-element
            class="chatElement bot-chat-element"
            .detectedLanguage="${this.language}"
            .message="${this.defaultInfoMessage}"
            type="info"
            sender="bot"
          ></ps-ai-chat-element>
          ${this.chatLog
            .filter(chatElement => !chatElement.hidden)
            .map(chatElement => html `
                <ps-ai-chat-element
                  ?thinking="${chatElement.type === 'thinking' ||
            chatElement.type === 'noStreaming'}"
                  @followup-question="${this.followUpQuestion}"
                  .clusterId="${this.clusterId}"
                  class="chatElement ${chatElement.sender}-chat-element"
                  .detectedLanguage="${this.language}"
                  .message="${chatElement.message}"
                  @scroll-down-enabled="${() => (this.userScrolled = false)}"
                  .type="${chatElement.type}"
                  .sender="${chatElement.sender}"
                ></ps-ai-chat-element>
              `)}
        </div>
        <div class="layout horizontal center-center chat-input">
          ${this.renderChatInput()}
        </div>
      </div>
    `;
    }
};
__decorate([
    property({ type: Array })
], YpStreamingLlm.prototype, "chatLog", void 0);
__decorate([
    property({ type: String })
], YpStreamingLlm.prototype, "wsClientId", void 0);
__decorate([
    property({ type: Number })
], YpStreamingLlm.prototype, "webSocketsErrorCount", void 0);
__decorate([
    property({ type: String })
], YpStreamingLlm.prototype, "wsEndpoint", void 0);
__decorate([
    property({ type: Object })
], YpStreamingLlm.prototype, "ws", void 0);
__decorate([
    property({ type: Boolean })
], YpStreamingLlm.prototype, "userScrolled", void 0);
__decorate([
    property({ type: String })
], YpStreamingLlm.prototype, "currentFollowUpQuestions", void 0);
__decorate([
    property({ type: Boolean })
], YpStreamingLlm.prototype, "programmaticScroll", void 0);
__decorate([
    property({ type: Number })
], YpStreamingLlm.prototype, "scrollStart", void 0);
__decorate([
    property({ type: String })
], YpStreamingLlm.prototype, "serverMemoryId", void 0);
__decorate([
    property({ type: Number })
], YpStreamingLlm.prototype, "defaultDevWsPort", void 0);
YpStreamingLlm = __decorate([
    customElement('yp-streaming-llm')
], YpStreamingLlm);
export { YpStreamingLlm };
//# sourceMappingURL=yp-streaming-llm.js.map