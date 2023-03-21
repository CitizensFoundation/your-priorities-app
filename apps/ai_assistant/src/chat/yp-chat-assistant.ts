import { css, html } from 'lit';
import { property, customElement, query, queryAll } from 'lit/decorators.js';
import {
  virtualize,
  virtualizerRef,
} from '@lit-labs/virtualizer/virtualize.js';

import { Layouts } from '../flexbox-literals/classes';
import { YpBaseElement } from '../@yrpri/common/yp-base-element';

import '@material/web/fab/fab-extended.js';

import '@material/web/fab/fab-extended.js';
//import '@material/web/formfield/formfield.js';
import '@material/web/radio/radio.js';
import '@material/web/button/elevated-button.js';
import '@material/web/button/text-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/tonal-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/icon/icon.js';

import '@material/web/iconbutton/outlined-link-icon-button.js';
import '@material/web/iconbutton/outlined-icon-button-toggle.js';

import '../@yrpri/common/yp-image.js';
import { YpAiChatElement } from './yp-ai-chat-element';
import { TonalButton } from '@material/web/button/lib/tonal-button';
import { OutlinedTextField } from '@material/web/textfield/lib/outlined-text-field';

import './yp-ai-chat-element.js';

// Minna rounded corners á followups, minnka aðeins
// Meira línubil á chat
// Laga liti
// Hafa Emoji summary á undan mynd, aðgrein
// Laga takka Send
//
// Hafa mest 7 svör

@customElement('yp-chat-assistant')
export class YpChatAssistant extends YpBaseElement {
  @property({ type: Array })
  chatLog: YpAiChatWsMessage[] = [];

  @property({ type: String })
  infoMessage!: string;

  @property({ type: String })
  defaultInfoMessage: string =
    'My Neighborhood Assistant is ready to help you.';

  @property({ type: String })
  wsEndpoint: string;

  @property({ type: Object })
  ws!: WebSocket;

  @property({ type: Boolean })
  inputIsFocused = false;

  @property({ type: String })
  currentFollowUpQuestions: string = '';

  @query('#sendButton')
  sendButton: TonalButton;

  @queryAll('yp-ai-chat-element')
  chatElements: YpAiChatElement[];

  @query('#chatInput')
  chatInputField: OutlinedTextField;

  @query('#chat-window')
  chatWindow: HTMLElement;

  calcVH() {
    const vH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    this.chatWindow.setAttribute("style", "height:" + vH + "px;");
    console.error("dijsaidjsiodjasiodjsoij")
  }

  connectedCallback() {
    if (!this.infoMessage) this.infoMessage = this.defaultInfoMessage;
    super.connectedCallback();
    if (window.location.href.indexOf('localhost') > -1) {
      this.wsEndpoint = 'ws://localhost:9000/chat';
    } else {
      this.wsEndpoint = 'wss://sp4.betrireykjavik.is:443/chat';
    }

    this.ws = new WebSocket(this.wsEndpoint);

    this.ws.onmessage = this.onMessage.bind(this);
    //window.addEventListener('onorientationchange', this.calcVH.bind(this), true);
    //window.addEventListener('resize', this.calcVH.bind(this), true);
}

  firstUpdated(): void {
    this.reset();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('themeDarkMode')) {
      debugger;
    }
  }

  disconnectedCallback(): void {
    this.ws.close();
    super.disconnectedCallback();
  }

  async onMessage(event: MessageEvent) {
    const data: YpAiChatWsMessage = JSON.parse(event.data);
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
    //await this.updateComplete;
    setTimeout(() => {
      this.$$('#chat-messages').scrollTop =
        this.$$('#chat-messages').scrollHeight;
    }, 100);
  }

  addToChatLogWithMessage(
    data: YpAiChatWsMessage,
    message: string | undefined = undefined,
    changeButtonDisabledState: boolean | undefined = undefined,
    changeButtonLabelTo: string | undefined = undefined
  ) {
    this.infoMessage = message;
    data.postIds = [];
    this.chatLog = [...this.chatLog, data];

    this.requestUpdate();

    if (changeButtonDisabledState !== undefined) {
      this.sendButton.disabled = changeButtonDisabledState;
    }

    if (changeButtonLabelTo !== undefined) {
      this.sendButton.label = changeButtonLabelTo;
    }
  }

  addChatBotElement(data: YpAiChatWsMessage) {
    const lastElement = this.chatElements[this.chatElements.length - 1];
    switch (data.type) {
      case 'hello_message':
        this.addToChatLogWithMessage(data);
        break;
      case 'thinking':
        lastElement.active = true;
        this.addToChatLogWithMessage(data, this.t('Thinking...'));
        break;
      case 'start':
        lastElement.active = false;
        this.addToChatLogWithMessage(data, this.t('Thinking...'));
        break;
      case 'start_followup':
        lastElement.followUpQuestionsRaw = '';
        break;
      case 'stream_followup':
        lastElement.followUpQuestionsRaw += data.message;
        this.requestUpdate();
        break;
      case 'info':
        this.infoMessage = data.message;
        break;
      case 'moderation_error':
        data.message =
          'OpenAI Moderation Flag Error. Please refine your question.';
        this.addToChatLogWithMessage(data, data.message, false, this.t('Send'));
        break;
      case 'error':
        this.addToChatLogWithMessage(data, data.message, false, this.t('Send'));
        break;
      case 'end':
        this.sendButton.disabled = false;
        this.sendButton.label = this.t('Send');
        this.infoMessage = this.defaultInfoMessage;
        break;
      case 'stream':
        //@ts-ignore
        this.infoMessage = this.t('typing');
        this.chatLog[this.chatLog.length - 1].message =
          this.chatLog[this.chatLog.length - 1].message + data.message;
        this.chatLog[this.chatLog.length - 1] = this.parsePosts(
          this.chatLog[this.chatLog.length - 1]
        );
        //console.error(this.chatLog[this.chatLog.length - 1].message)
        this.requestUpdate();
        break;
    }
  }

  addChatUserElement(data: YpAiChatWsMessage) {
    this.chatLog = [...this.chatLog, data];
  }

  async sendChatMessage() {
    const message = this.chatInputField.value;

    if (message.length === 0) return;

    this.ws.send(message);
    this.chatInputField.value = '';
    this.sendButton.disabled = false;
    this.sendButton.label = this.t('Thinking...');
    setTimeout(() => {
      this.chatInputField.blur();
    });
  }

  parsePosts(data: YpAiChatWsMessage) {
    data.message = data.message.replace(/\[([^\]]+)\]/g, (match, content) => {
      if (data.postIds.indexOf(content) == -1) data.postIds.push(content);
      data.postIds = JSON.parse(JSON.stringify(data.postIds));
      return `<span class="postCitation">${data.postIds.length}</span>`;
    });
    return data;
  }

  static get styles() {
    return [
      Layouts,
      css`
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
          height: 100vh;
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
          padding: 10px;
        }


        @media (max-width: 600px) {
          .chat-window {
            height: 100dvh;
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

        @media (max-width: 960px) {
          .restartButton {
            margin-left: 8px;
            display: none;
          }

          yp-ai-chat-element[thinking] {
            margin-top: 12px;
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

  followUpQuestion(event: CustomEvent) {
    this.chatInputField.value = event.detail;
    this.sendChatMessage();
  }

  reset() {
    this.chatLog = [];
    this.addChatBotElement({
      message:
        //"Hello, I'm the My Neighborhood AI Assistant. How can I help you?",
        'Halló, ég er gervigreindar snjallmenni fyrir Hverfið Mitt verkefnið. Hvernig get ég hjálpað?',
      sender: 'bot',
      type: 'hello_message',
    });
    this.ws.send('<|--reset-chat--|>');
  }

  toggleDarkMode() {
    this.themeDarkMode = !this.themeDarkMode;
    this.fire('theme-dark-mode', this.themeDarkMode);
    this.requestUpdate();
  }

  renderChatInput() {
    return html`
      <md-outlined-link-icon-button class="restartButton" @click="${this.reset}"
      ?input-is-focused="${this.inputIsFocused}"

      >restart_alt</md-outlined-link-icon-button
      >
      <md-outlined-text-field
        class="textInput"
        id="chatInput"

        @focus="${()=>this.inputIsFocused=true}"
        @blur="${()=>this.inputIsFocused=true}"

        @keyup="${(e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            this.sendChatMessage();
          }
        }}"
        label="${this.t('Spurðu mig um Hverfið mitt 2022')}"
      >
        <md-icon
          class="sendIcon"
          @click="${this.sendChatMessage}"
          slot="trailingicon"
          id="sendButton"
          ?input-is-focused="${this.inputIsFocused}"
          >send</md-icon
        >
      </md-outlined-text-field>
      <md-outlined-icon-button-toggle
        class="darkModeButton"
        ?selected="${!this.themeDarkMode}"
        @change="${this.toggleDarkMode}"
      >
        <md-icon slot="icon">light_mode</md-icon>
        <md-icon slot="selectedIcon">dark_mode</md-icon>
      </md-outlined-icon-button-toggle>
    `;
  }

  renderVirtualizer() {
    return html`
      <div class="chat-window" id="chat-window">
        <div class="chat-messages" id="chat-messages">
          <ul>
            ${virtualize({
              items: this.chatLog,
              renderItem: chatElement => html`<li>
                <yp-ai-chat-element
                  @followup-question="${this.followUpQuestion}"
                  .message="${chatElement.message}"
                  .type="${chatElement.type}"
                  .sender="${chatElement.sender}"
                  .postIds="${chatElement.postIds}"
                ></yp-ai-chat-element>
              </li>`,
            })}
          </ul>
        </div>
        <div class="layout vertical">
          <div class="infoMessage layout horizontal center-center"></div>
          <div class="chat-input layout vertical center-center">
            ${this.renderChatInput()}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="chat-window" id="chat-window">
        <div class="chat-messages" id="chat-messages">
          ${this.chatLog.map(
            chatElement => html`
              <yp-ai-chat-element
                ?thinking="${chatElement.type === 'thinking'}"
                @followup-question="${this.followUpQuestion}"
                class="${chatElement.sender}-chat-element"
                .message="${chatElement.message}"
                .type="${chatElement.type}"
                .postIds="${chatElement.postIds}"
                .sender="${chatElement.sender}"
              ></yp-ai-chat-element>
            `
          )}
        </div>
        <div class="layout horizontal center-center chat-input">
          ${this.renderChatInput()}
        </div>
      </div>
    `;
  }
}
