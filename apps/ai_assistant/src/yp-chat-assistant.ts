import { css, html } from 'lit';
import { property, customElement, query } from 'lit/decorators.js';
import {
  virtualize,
  virtualizerRef,
} from '@lit-labs/virtualizer/virtualize.js';

import { Layouts } from './flexbox-literals/classes';
import { YpBaseElement } from './yp-base-element';

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

import './yp-image.js';
import { YpAiChatElement } from './yp-ai-chat-element';
import { TonalButton } from '@material/web/button/lib/tonal-button';
import { OutlinedTextField } from '@material/web/textfield/lib/outlined-text-field';

import './yp-ai-chat-element.js';

@customElement('yp-chat-assistant')
export class YpChatAssistant extends YpBaseElement {
  @property({ type: Array })
  chatLog: YpAiChatWsMessage[] = [];

  @property({ type: String })
  infoMessage!: string;

  @property({ type: String })
  defaultInfoMessage: string = 'My Neighborhood Assistant is ready to help you.';

  @property({ type: Object })
  wsEndpoint = 'ws://localhost:9000/chat';

  @property({ type: Object })
  ws!: WebSocket;

  @query('#sendButton')
  sendButton: TonalButton;

  @query('#chatInput')
  chatInputField: OutlinedTextField;

  connectedCallback() {
    if (!this.infoMessage) this.infoMessage = this.defaultInfoMessage;
    super.connectedCallback();
    this.ws = new WebSocket(this.wsEndpoint);

    this.ws.onmessage = this.onMessage.bind(this);
  }

  disconnectedCallback(): void {
    this.ws.close();
    super.disconnectedCallback();
  }

  onMessage(event: MessageEvent) {
    const data: YpAiChatWsMessage = JSON.parse(event.data);
    console.error(event.data);

    switch (data.sender) {
      case 'bot':
        this.addChatBotElement(data);
        break;
      case 'you':
        this.addChatUserElement(data);
        break;
    }
  }

  addToChatLogWithMessage(
    data: YpAiChatWsMessage,
    message: string,
    changeButtonDisabledState: boolean | undefined = undefined,
    changeButtonLabelTo: string | undefined = undefined
  ) {
    this.infoMessage = message;
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
    switch (data.type) {
      case 'start':
        this.addToChatLogWithMessage(data, this.t('Thinking...'));
        break;
      case 'info':
        this.infoMessage = data.message;
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
        //console.error(this.chatLog[this.chatLog.length - 1].message)
        this.requestUpdate();
        break;
    }

    this.$$('#chat-messages').scrollTop =
      this.$$('#chat-messages').scrollHeight;
  }

  addChatUserElement(data: YpAiChatWsMessage) {
    this.chatLog = [...this.chatLog, data];
  }

  sendChatMessage() {
    const message = this.chatInputField.value;

    if (message.length === 0) return;

    this.ws.send(message);
    this.chatInputField.value = '';
    this.sendButton.disabled = false;
    this.sendButton.label = this.t('Thinking...');
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

        chat-window {
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
          flex: 1 1;
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
          max-width: 80%;
          justify-content: flex-start;
          width: 80%;
        }

        .chat-input {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          background-color: white;
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        md-outlined-text-field {
          flex: 1;
          border-radius: 10px;
          border: none;
          padding: 10px;
          margin: 16px;
          margin-bottom: 16px;
        }

        md-tonal-button {
          padding: 16px;
          padding-left: 0;
          margin-top: 0;
        }

        .you-chat-element {
          align-self: flex-end;
          max-width: 80%;
        }

        .bot-chat-element {
          align-self: flex-start;
          max-width: 80%;
          width: 80%;
        }
      `,
    ];
  }

  renderChatInput() {
    return html`
      <div class="layout horizontal">
        <div class="layout horizontal center-center">
          <md-outlined-text-field
            class="formField"
            id="chatInput"
            @keyup="${(e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                this.sendChatMessage();
              }
            }}"
            label="${this.t('Ask about My Neighborhood 2022')}"
          ></md-outlined-text-field>
          <md-tonal-button
            class="button okButton"
            id="sendButton"
            .label="${this.t('Send')}"
            @click="${this.sendChatMessage}"
          >
          </md-tonal-button>
        </div>
      </div>
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
                  .message="${chatElement.message}"
                  .type="${chatElement.type}"
                  .sender="${chatElement.sender}"
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
                class="${chatElement.sender}-chat-element"
                .message="${chatElement.message}"
                .type="${chatElement.type}"
                .sender="${chatElement.sender}"
              ></yp-ai-chat-element>
            `
          )}
        </div>
        <div class="layout vertical chat-input ">
          <div class="infoMessage layout horizontal center-center">
            ${this.infoMessage}
          </div>
          <div class="layout vertical center-center">
            ${this.renderChatInput()}
          </div>
        </div>
      </div>
    `;
  }
}
