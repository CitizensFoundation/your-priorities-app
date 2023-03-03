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
  defaultInfoMessage: string = 'Welcome to the YP AI Chat!';

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
    changeButtonLabelTo: string | undefined = undefined,
  ) {
    this.infoMessage = message;
    this.chatLog = [...this.chatLog, data];

    this.requestUpdate();

    if (changeButtonDisabledState!==undefined) {
      this.sendButton.disabled = changeButtonDisabledState;
    }

    if (changeButtonLabelTo!==undefined) {
      this.sendButton.label = changeButtonLabelTo;
    }
  }

  addChatBotElement(data: YpAiChatWsMessage) {
    switch (data.type) {
      case 'start':
        this.addToChatLogWithMessage(data, this.t('computingAnswer'));
        break;
      case 'info':
        this.addToChatLogWithMessage(data, data.message);
        break;
      case 'error':
        this.addToChatLogWithMessage(data, data.message, false, this.t('send'));
        break;
      case 'end':
        this.sendButton.disabled = false;
        this.sendButton.label = this.t('send');
        break;
      case 'stream':
        //@ts-ignore
        this.infoMessage = this.t('typing');
        this.chatLog[this.chatLog.length - 1].message = this.chatLog[this.chatLog.length - 1].message + data.message;
        //console.error(this.chatLog[this.chatLog.length - 1].message)
        this.requestUpdate();
        break;
    }
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
    this.sendButton.label = this.t('loading');
  }

  static get styles() {
    return [
      Layouts,
      css`
        mwc-textarea {
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

        mwc-textarea.rounded {
          --mdc-shape-small: 4px;
        }

        .outerInput {
          position: relative;
        }

        .innerInput {
          position: absolute;
          bottom: 0;
          left: 0;
        }

        ul {
          height: 100vh;
          list-style-type: none;
        }
      `,
    ];
  }

  renderChatInput() {
    return html`
      <div class="layout horizontal outerIsnput">
        <div class="layout vertical innerInput">
          <md-outlined-text-field
            class="formField"
            id="chatInput"
            label="${this.t('chatInput')}"
          ></md-outlined-text-field>
          <md-tonal-button
            class="button okButton"
            id="sendButton"
            .label="${this.t('send')}"
            @click="${this.sendChatMessage}"
          >
          </md-tonal-button>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="layout vertical center-center">
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
        ${this.renderChatInput()}
      </div>
    `;
  }
}
