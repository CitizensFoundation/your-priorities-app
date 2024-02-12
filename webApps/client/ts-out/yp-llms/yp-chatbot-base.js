var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from 'lit';
import { property, customElement, query, queryAll } from 'lit/decorators.js';
import '@material/web/fab/fab.js';
import '@material/web/radio/radio.js';
import '@material/web/button/elevated-button.js';
import '@material/web/button/text-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import '../common/yp-image.js';
import { YpStreamingLlmBase } from './yp-streaming-llm-base.js';
import './yp-chatbot-item-base.js';
import { literal } from 'lit/static-html.js';
let YpChatbotBase = class YpChatbotBase extends YpStreamingLlmBase {
    constructor() {
        super();
        this.defaultInfoMessage = "I'm your friendly chat assistant";
        this.inputIsFocused = false;
        this.onlyUseTextField = false;
        this.showCleanupButton = false;
        this.showCloseButton = false;
        this.chatbotItemComponentName = literal `yp-chatbot-item-base`;
        this.setupServerApi();
    }
    calcVH() {
        const vH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        this.chatWindow.setAttribute('style', 'height:' + vH + 'px;');
    }
    connectedCallback() {
        super.connectedCallback();
    }
    firstUpdated(_changedProperties) {
        // focus the text input
        setTimeout(() => {
            this.chatInputField.focus();
        }, 420);
        setTimeout(() => {
            this.chatMessagesElement.addEventListener('scroll', this.handleScroll.bind(this));
        }, 500);
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('themeDarkMode')) {
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.chatMessagesElement) {
            this.chatMessagesElement.removeEventListener('scroll', this.handleScroll.bind(this));
        }
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
    }
    addToChatLogWithMessage(data, message = undefined, changeButtonDisabledState = undefined, changeButtonLabelTo = undefined, refinedCausesSuggestions = undefined, rawMessage = undefined) {
        this.infoMessage = message;
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
                this.sendButton.disabled = false;
                this.sendButton.innerHTML = this.t('Send');
                this.infoMessage = this.defaultInfoMessage;
                break;
            case 'message':
                if (this.lastChatUiElement) {
                    this.lastChatUiElement.spinnerActive = false;
                }
                this.addToChatLogWithMessage(wsMessage, wsMessage.message, undefined, undefined);
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
    static get styles() {
        return [
            super.styles,
            css `
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
          align-self: flex-start;
          max-width: 80%;
          justify-content: flex-start;
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

        @media (max-width: 960px) {
          .restartButton {
            margin-left: 8px;
            display: none;
          }

          .chat-window {
            max-height: 90vh;
            height: 90vh;
          }

          .closeButton  {
            margin-left: 8px;
          }

          .darkModeButton {
            margin-right: 8px;
            display: none;
          }

          md-outlined-text-field {
            transition: transform 0.5s;
            width: 300px;
          }

          .chat-messages {
            padding: 0px;
          }

          .you-chat-element {
            max-width: 100%;
            margin-right: 8px;
          }

          .chat-input {
            padding-left: 0px;
            padding-right: 0px;
          }

          .restartButton[input-is-focused] {
          }

          .darkModeButton[input-is-focused] {
          }

          md-outlined-text-field[focused] {
            width: 100%;
          }
        }

        @media (max-width: 600px) {
          .chat-window {

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

        .restartButton, .closeButton {
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
          margin-top: 16px;
          margin-bottom: 8px;
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
      ${this.showCloseButton
            ? html `
        <md-outlined-icon-button
          class="closeButton"
          @click="${() => this.fire('chatbot-close')}"
        ><md-icon>close</md-icon></md-icon></md-outlined-icon-button>
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
          <yp-chatbot-item-base
            ?hidden="${!this.defaultInfoMessage}"
            class="chatElement bot-chat-element"
            .detectedLanguage="${this.language}"
            .message="${this.defaultInfoMessage}"
            type="info"
            sender="bot"
          ></yp-chatbot-item-base>
          ${this.chatLog
            .filter(chatElement => !chatElement.hidden)
            .map(chatElement => html `
                <yp-chatbot-item-base
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
                ></yp-chatbot-item-base>
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
    property({ type: String })
], YpChatbotBase.prototype, "infoMessage", void 0);
__decorate([
    property({ type: String })
], YpChatbotBase.prototype, "defaultInfoMessage", void 0);
__decorate([
    property({ type: Boolean })
], YpChatbotBase.prototype, "inputIsFocused", void 0);
__decorate([
    property({ type: Boolean })
], YpChatbotBase.prototype, "onlyUseTextField", void 0);
__decorate([
    property({ type: Number })
], YpChatbotBase.prototype, "clusterId", void 0);
__decorate([
    property({ type: Number })
], YpChatbotBase.prototype, "communityId", void 0);
__decorate([
    property({ type: String })
], YpChatbotBase.prototype, "textInputLabel", void 0);
__decorate([
    property({ type: Boolean })
], YpChatbotBase.prototype, "showCleanupButton", void 0);
__decorate([
    property({ type: Boolean })
], YpChatbotBase.prototype, "showCloseButton", void 0);
__decorate([
    query('#sendButton')
], YpChatbotBase.prototype, "sendButton", void 0);
__decorate([
    queryAll('yp-chatbot-item-base')
], YpChatbotBase.prototype, "chatElements", void 0);
__decorate([
    query('#chatInput')
], YpChatbotBase.prototype, "chatInputField", void 0);
__decorate([
    query('#chat-window')
], YpChatbotBase.prototype, "chatWindow", void 0);
__decorate([
    query('#chat-messages')
], YpChatbotBase.prototype, "chatMessagesElement", void 0);
YpChatbotBase = __decorate([
    customElement('yp-chatbot-base')
], YpChatbotBase);
export { YpChatbotBase };
//# sourceMappingURL=yp-chatbot-base.js.map