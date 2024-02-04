var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { YpAccessHelpers } from '../common/YpAccessHelpers.js';
import { nothing, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/progress/circular-progress.js';
//import './yp-posts-list.js';
//import './yp-post-card-add.js';
import '../common/yp-emoji-selector.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { ShadowStyles } from '../common/ShadowStyles.js';
let YpPostTranscript = class YpPostTranscript extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.isEditing = false;
        this.checkingTranscript = false;
        this.checkTranscriptError = false;
    }
    static get styles() {
        return [
            super.styles,
            ShadowStyles,
            css `
        .transcriptContainer {
          width: 420px;
          max-width: 420px;
        }

        @media (max-width: 960px) {
          .transcriptContainer {
            width: 100%;
            max-width: 100%;
          }
        }

        #postTranscriptionEditor {
          padding-left: 8px;
          padding-right: 8px;
        }

        .transcriptError {
          margin-top: 8px;
          margin-bottom: 8px;
          color: var(--md-sys-color-error);
        }

        .checkTranscript {
          margin-top: 8px;
          padding: 8px;
        }

        .transcriptText {
          margin-top: 0;
          padding: 8px;
          padding-bottom: 0;
          font-style: italic;
          margin-bottom: 8px;
        }

        .transcriptHeader {
          margin-bottom: 2px;
          font-style: normal;
        }

        .editIcon {
        }
      `,
        ];
    }
    render() {
        return html `
      <div class="transcriptContainer">
        ${this.checkingTranscript
            ? html `
              <div class="layout vertical center-center checkTranscript">
                <div>${this.t('checkingForTranscript')}</div>
                <md-circular-progress indeterminate></md-circular-progress>
              </div>
            `
            : nothing}

        <div
          class="transcriptError layout horizontal center-center"
          ?hidden="${!this.checkTranscriptError}">
          ${this.t('checkTranscriptError')}
        </div>

        ${this.post.public_data.transcript.text
            ? html `
              <div class="transcriptText layout vertical center-center">
                <div
                  class="transcriptHeader"
                  ?hidden="${this.post.public_data.transcript
                .noMachineTranslation}">
                  ${this.t('automaticTranscript')}
                  <span
                    ?hidden="${!this.post.public_data.transcript.userEdited}">
                    (${this.t('edited')})
                  </span>
                </div>
                <div id="postContentTranscript" ?hidden="${this.isEditing}">
                  <yp-magic-text
                    textType="postTranscriptContent"
                    .contentLanguage="${this.post.public_data.transcript
                .language}"
                    .content="${this.post.public_data.transcript.text}"
                    .contentId="${this.post.id}">
                  </yp-magic-text>
                </div>

                ${this.hasPostAccess
                ? html `
                      <div
                        class="layout horizontal"
                        ?hidden="${this.isEditing}">
                        <div class="flex"></div>
                        <md-outlined-icon-button
                          class="editIcon"
                          .title="${this.t('edit')}"
                          icon="create"
                          @click="${this._editPostTranscript}"></md-outlined-icon-button>
                      </div>
                    `
                : nothing}
              </div>
            `
            : nothing}
        ${this.isEditing
            ? html `
              <div class="layout vertical" ?hidden="${!this.hasPostAccess}">
                <md-outlined-text-field
                  id="postTranscriptionEditor"
                  charCounter
                  maxlength="500"
                  .value="${this.editText ? this.editText : ''}"></md-outlined-text-field>
                <div class="horizontal end-justified layout">
                  <yp-emoji-selector
                    id="postTranscriptEmojiSelector"></yp-emoji-selector>
                </div>
                <div class="layout horizontal self-end">
                  <md-outlined-button
                    @click="${this._cancelEdit}"
                    .label="${this.t('cancel')}"></md-outlined-button>
                  <md-outlined-button
                    @click="${this._saveEdit}"
                    .label="${this.t('update')}"></md-outlined-button>
                </div>
              </div>
            `
            : nothing}
      </div>
    `;
    }
    _isEditingChanged() {
        this._updateEmojiBindings();
        setTimeout(() => {
            this.fire('iron-resize');
        });
    }
    _updateEmojiBindings() {
        if (this.isEditing) {
            setTimeout(() => {
                const post = this.$$('#postTranscriptionEditor');
                const emoji = this.$$('#postTranscriptEmojiSelector');
                if (post && emoji) {
                    emoji.inputTarget = post;
                }
                else {
                    console.error("Wide: Can't bind post edit emojis :(");
                }
            }, 500);
        }
    }
    _cancelEdit() {
        this.isEditing = false;
    }
    async _saveEdit() {
        await window.serverApi.savePostTranscript(this.post.id, {
            content: this.editText,
        });
        this.post.public_data.transcript.text = this.editText ? this.editText : '';
        this.post.public_data.transcript.userEdited = true;
        this.isEditing = false;
    }
    _editPostTranscript() {
        if (this.hasPostAccess) {
            this.editText = this.post.public_data.transcript.text;
            this.isEditing = true;
        }
    }
    async _checkTranscriptStatus() {
        let transcriptType;
        if (this.post.cover_media_type === 'audio') {
            transcriptType = '/audioTranscriptStatus';
        }
        else if (this.post.cover_media_type === 'video') {
            transcriptType = '/videoTranscriptStatus';
        }
        this.checkingTranscript = true;
        const response = (await window.serverApi.getPostTranscriptStatus(this.post.id, transcriptType));
        if (response && response.text && this.post) {
            this.post.public_data.transcript.text = response.text;
            if (this.hasPostAccess) {
                this.editText = response.text;
                this.isEditing = true;
            }
            this.checkingTranscript = false;
            setTimeout(() => {
                this.fire('iron-resize');
            });
        }
        else if (response && response.inProgress) {
            setTimeout(() => {
                this._checkTranscriptStatus();
            }, 2000);
        }
        else if (response && response.error) {
            this.checkingTranscript = false;
            this.checkTranscriptError = true;
        }
        else {
            this.checkingTranscript = false;
        }
    }
    get hasPostAccess() {
        if (this.post) {
            return YpAccessHelpers.checkPostAccess(this.post);
        }
        else {
            return false;
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('post')) {
            this._postChanged();
        }
        if (changedProperties.has('isEditing')) {
            this._isEditingChanged();
        }
    }
    _postChanged() {
        this.checkingTranscript = false;
        this.checkTranscriptError = false;
        if (this.post && this.post.description) {
            if (this.hasPostAccess &&
                window.appGlobals.hasTranscriptSupport === true) {
                if (this.post.public_data &&
                    this.post.public_data.transcript &&
                    this.post.public_data.transcript.inProgress) {
                    this._checkTranscriptStatus();
                }
            }
        }
    }
};
__decorate([
    property({ type: Boolean })
], YpPostTranscript.prototype, "isEditing", void 0);
__decorate([
    property({ type: String })
], YpPostTranscript.prototype, "editText", void 0);
__decorate([
    property({ type: Boolean })
], YpPostTranscript.prototype, "checkingTranscript", void 0);
__decorate([
    property({ type: Boolean })
], YpPostTranscript.prototype, "checkTranscriptError", void 0);
__decorate([
    property({ type: Object })
], YpPostTranscript.prototype, "post", void 0);
YpPostTranscript = __decorate([
    customElement('yp-post-transcript')
], YpPostTranscript);
export { YpPostTranscript };
//# sourceMappingURL=yp-post-transcript.js.map