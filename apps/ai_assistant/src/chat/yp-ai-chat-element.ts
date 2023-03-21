import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { Layouts } from '../flexbox-literals/classes';
import { YpBaseElement } from '../@yrpri/common/yp-base-element';
import { resolveMarkdown } from './litMarkdown.js';
import '@material/web/button/outlined-link-button.js';
import '@material/web/button/elevated-link-button.js';
import '@material/web/icon/icon.js';

import '../@yrpri/common/yp-image.js';

@customElement('yp-ai-chat-element')
export class YpAiChatElement extends YpBaseElement {
  @property({ type: String })
  message!: string;

  @property({ type: String })
  sender: 'you' | 'bot';

  @property({ type: String })
  type:
    | 'start'
    | 'error'
    | 'moderation_error'
    | 'info'
    | 'thinking'
    | undefined;

  @property({ type: Boolean })
  active = true;

  @property({ type: Boolean })
  fullReferencesOpen = false;

  @property({ type: String })
  followUpQuestionsRaw: string = '';

  @property({ type: Array })
  followUpQuestions: string[] = [];

  @property({ type: Array })
  postIds: number[] = [];

  @property({ type: Array })
  posts: YpSimplePost[] = [];

  static get styles() {
    return [
      Layouts,
      css`
        :host {
          display: flex;
        }
        .chatImage {
          padding: 8px;
          vertical-align: text-top;
        }

        .robotIcon {
          font-size: 34px;
        }

        .chatText {
          padding: 8px;
          padding-left: 8px;
          margin-top: 0;
          padding-top: 2px;
        }

        .chatTextUser {
          padding-top: 12px;
        }

        .userChatDialog {
          color: var(--md-sys-color-on-primary);
          background-color: var(--md-sys-color-primary);
          padding: 8px;
          margin: 16px;
          line-height: 1.35;
          margin-bottom: 0px;
          border-radius: 12px;
        }

        .post {
          margin: 8px;
          padding: 12px;
          border-radius: 24px;
          margin-right: 0;
          background-color: var(--md-sys-color-secondary);
          color: var(--md-sys-color-on-secondary);
          cursor: pointer;
        }

        .postShowMore {
          padding-left: 16px;
          padding-right: 16px;
        }

        .postImage {
          height: 28px;
          width: 50px;
        }

        .postName {
          display: flex;
          justify-content: center;
          align-content: center;
          flex-direction: column;
          margin-right: 8px;
        }

        .chatGPTDialogContainer {
          max-width: 100%;
          width: 100%;
        }

        .chatGPTDialog {
          color: var(--md-sys-color-on-primary-container);
          background-color: var(--md-sys-color-primary-container);
          padding: 8px;
          margin: 16px;
          line-height: 1.35;
          margin-bottom: 0px;
          border-radius: 10px;
          max-width: 75%;
          margin-top: 12px;
        }

        @media (max-width: 800px) {
          .chatGPTDialog {
            margin: 8px;
            max-width: 100%;
          }
        }

        .chatGPTDialog[error] {
          background-color: var(--md-sys-color-error);
          color: var(--md-sys-color-on-error);
        }

        .followup-question-container {
          margin-top: 12px;
          width: 100%;
          align-self: flex-end;
          justify-content: flex-end;
          margin-right: 32px;
          width: 100%;
        }

        .posts {
          margin-top: 8px;
        }

        .followup-question {
          padding: 0;
          margin: 6px;
        }

        .chat-message {
          flex: 1;
        }

        .thinkingText {
          margin-top: 4px;
          color: var(--md-sys-color-secondary);
        }

        .thinkingText[active] {
          color: var(--md-sys-color-primary);
        }

        .doneIcon {
          margin-left: 16px;
          margin-right: 4px;
          color: var(--md-sys-color-secondary);
          font-size: 28px;
        }

        .postCitation {
          font-size: 9px;
          background-color: var(--md-sys-color-inverse-on-surface);
          color: var(--md-sys-color-primary);
          padding: 3px;
        }

        .followUpQuestionMark {
          color: var(--md-sys-color-primary);
          font-size: 36px;
          margin-top: 8px;
        }

        .citationLink {
          margin-left: 8px;
          margin-bottom: 8px;
        }

        .progress-ring {
          transform: rotate(-90deg);
          color: var(--md-sys-color-secondary);
          transform-origin: 50% 50%;
          margin-left: 16px;
          margin-right: 4px;

        }
        .progress-ring__circle {
          stroke: var(--md-sys-color-primary);
          stroke-dasharray: 75.4;
          stroke-dashoffset: 75.4;
          stroke-linecap: round;
          animation: progress-ring 2.5s infinite;
        }
        @keyframes progress-ring {
          0% {
            stroke-dashoffset: 75.4;
          }
          50% {
            stroke-dashoffset: 0;
            transform: rotate(0deg);
          }

        }
      `,
    ];
  }

  get isError() {
    return this.type == 'error' || this.type == 'moderation_error';
  }

  renderCGImage() {
    return html`
      <md-icon class="robotIcon">smart_toy</md-icon>
    `;
  }

  renderRoboImage() {
    return html`
       <md-icon class="robotIcon">person</md-icon>
    `;
  }

  getPosts() {
    return this.fullReferencesOpen ? this.posts : this.posts.slice(0, 5);
  }

  renderChatGPT() {
    return html`
      <div class="layout vertical chatGPTDialogContainer">
        <div
          class="chatGPTDialog layout vertical bot-message"
          ?error="${this.isError}"
        >
          <div class="layout horizontal">
            <div class="layout vertical chatImage">${this.renderCGImage()}</div>
            <div class="layout vertical chatText">
              ${resolveMarkdown(this.message, {
                includeImages: true,
                includeCodeBlockClassNames: true,
              })}
            </div>
          </div>
          ${this.posts && this.posts.length > 0
            ? html`
                <div class="layout horizontal posts wrap">
                  ${this.getPosts().map(
                    (post, index) => html`
                      <md-elevated-link-button
                        .label="${index + 1}. ${post.emojiSummary}"
                        @click="${()=>this.fire('open-posts', { posts: this.posts, index})}"
                        class="citationLink layout horizontal center-justified"
                      >
                        <img src="${post.imageUrl}" class="postImage" />
                      </md-elevated-link-button>
                    `
                  )}
                  ${this.posts.length > 5 && !this.fullReferencesOpen
                    ? html`
                        <md-elevated-link-button
                          class="citationLink"
                          .label="+${this.posts.length - 4}"
                          @click="${() => (this.fullReferencesOpen = true)}"
                          class=""
                        >
                          +${this.posts.length - 5}
                        </md-elevated-link-button>
                      `
                    : nothing}
                  ${this.fullReferencesOpen
                    ? html`
                        <md-elevated-link-button
                          label="<"
                          class="citationLink"
                          icon="unfold_less"
                          @click="${() => (this.fullReferencesOpen = false)}"
                          class=""
                        >
                          <md-icon>unfold_less</md-icon>
                        </md-elevated-link-button>
                      `
                    : nothing}
                </div>
              `
            : nothing}
        </div>
        ${this.followUpQuestions && this.followUpQuestions.length > 0
          ? html`
              <div class="layout horizontal followup-question-container wrap">
                <md-icon class="followUpQuestionMark">contact_support</md-icon
                >${this.followUpQuestions.map(
                  question => html`
                    <md-outlined-link-button
                      class="followup-question"
                      .label="${question}"
                      @click="${() => this.fire('followup-question', question)}"
                    ></md-outlined-link-button>
                  `
                )}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  parseFollowUpQuestions() {
    this.followUpQuestionsRaw = this.followUpQuestionsRaw.replace(
      /<<([^>>]+)>>/g,
      (match, content) => {
        this.followUpQuestions.push(content);
        return '';
      }
    );
  }

  checkPosts() {
    if (this.posts && this.postIds && this.posts.length < this.postIds.length) {
      const lastPostId = this.postIds[this.postIds.length - 1];
      fetch(`/api/v1/posts/${lastPostId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          this.posts.push(data);
        });
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (
      changedProperties.has('followUpQuestionsRaw') &&
      this.followUpQuestionsRaw
    ) {
      this.parseFollowUpQuestions();
    }

    if (changedProperties.has('postIds')) {
      this.checkPosts();
    }
  }

  renderUser() {
    return html`
      <div class="userChatDialog layout horizontal user-message">
        <div class="layout vertical chatImage">${this.renderRoboImage()}</div>
        <div class="layout vertical chatText chatTextUser">${this.message}</div>
      </div>
    `;
  }

  renderThinking() {
    return html`${this.active
        ? html`<svg class="progress-ring" width="28" height="28">
            <circle
              class="progress-ring__circle"
              ?active="${this.active}"
              stroke="blue"
              stroke-width="2"
              fill="transparent"
              r="10"
              cx="12"
              cy="12"
            />
          </svg>`
        : html`<md-icon class="doneIcon">done</md-icon>`}
      <div class="thinkingText" ?active="${this.active}">${this.t('Hugsa')}</div> `;
  }

  renderMessage() {
    if (this.sender === 'you') {
      return this.renderUser();
    } else if (this.sender === 'bot' && this.type === 'thinking') {
      return this.renderThinking();
    } else if (this.sender === 'bot') {
      return this.renderChatGPT();
    }
  }

  render() {
    return html` ${this.renderMessage()} `;
  }
}
