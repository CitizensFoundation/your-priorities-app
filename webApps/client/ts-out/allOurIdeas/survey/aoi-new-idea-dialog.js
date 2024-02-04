var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html } from 'lit';
import { property, customElement, query } from 'lit/decorators.js';
import { YpBaseElement } from '../../common/yp-base-element.js';
import '@material/web/dialog/dialog.js';
import '@material/web/button/elevated-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/textfield/filled-text-field.js';
import { SharedStyles } from './SharedStyles';
let AoiNewIdeaDialog = class AoiNewIdeaDialog extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.submitting = false;
    }
    async connectedCallback() {
        super.connectedCallback();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }
    async submit() {
        window.appGlobals.activity(`New Idea - submit`);
        this.currentError = undefined;
        this.submitting = true;
        let addIdeaResponse;
        try {
            addIdeaResponse = await window.aoiServerApi.submitIdea(this.groupId, this.question.id, this.ideaText.value);
        }
        catch (error) {
            console.error(error);
        }
        this.submitting = false;
        if (!addIdeaResponse || addIdeaResponse.error) {
            this.currentError = this.t('An error occurred. Please try again.');
            window.appGlobals.activity(`New Idea - general error`);
        }
        else if (addIdeaResponse.flagged) {
            this.currentError = this.t('Your idea has been flagged as inappropriate. Please try again.');
            window.appGlobals.activity(`New Idea - moderation flag`);
        }
        else {
            this.ideaText.value = '';
            if (addIdeaResponse.active) {
                this.fire('display-snackbar', this.t('Your idea has been added, you can continue voting.'));
            }
            else {
                this.fire('display-snackbar', this.t('Your idea is in a moderation queue.'));
            }
            window.appGlobals.activity(`New Idea - added`);
            this.dialog.close();
        }
    }
    scrollUp() {
        //await this.updateComplete;
        setTimeout(() => {
            //@ts-ignore
            this.$$('#dialog').contentElement.scrollTop = 0;
        }, 100);
    }
    open() {
        this.dialog.show();
        this.currentError = undefined;
        window.appGlobals.activity(`New Idea - open`);
    }
    cancel() {
        this.dialog.close();
        window.appGlobals.activity(`New Idea - cancel`);
    }
    textAreaKeyDown(e) {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            return false;
        }
        else {
            return true;
        }
    }
    static get styles() {
        return [
            ...super.styles,
            SharedStyles,
            css `
        :host {
          --md-dialog-container-color: var(--md-sys-color-surface);
        }
        md-dialog[showing-fullscreen] {
          /* hack: private! */
          --_container-max-block-size: 100dvh;
          --md-dialog-container-inset-block-start: 0px;
        }

        md-circular-progress {
          margin-right: 16px;
          --md-circular-progress-size: 40px;
        }

        .indexNumber {
          margin-top: 12px;
          font-size: 20px;
          margin-left: 8px;
          margin-right: 8px;
          color: var(--md-sys-color-on-surface);
        }

        .cancelButton {
        }

        .header {
          text-align: center;
        }

        #dialog {
          width: 100%;
        }

        #ideaText {
          margin-top: 8px;
          width: 500px;
        }

        .questionTitle {
          margin-top: 0;
          margin-bottom: 16px;
          padding: 20px;
          line-height: 1.5;
        }

        md-filled-field {
          padding: 8px;
          margin-bottom: 8px;
          border-radius: 12px;
        }

        .submitButton {
          margin-left: 8px;
        }

        .error {
          color: var(--md-sys-color-error);
          font-size: 16px;
          margin: 8px;
        }

        @media (max-width: 960px) {
          #dialog {
            --_fullscreen-header-block-size: 74px;
          }

          .footer {
            margin-bottom: 8px;
          }

          .questionTitle {
            margin-top: 16px;
            margin-bottom: 12px;
          }

          .cancelButton {
            margin-right: 32px;
          }

          .header {
            padding: 8px;
            font-size: 22px;
          }

          #ideaText {
            width: 95%;
          }
        }
      `,
        ];
    }
    renderContent() {
        return html `
      <div class="questionTitle">${this.question.name}</div>
      <div class="layout vertical center-center">
        <md-filled-text-field
          id="ideaText"
          type="textarea"
          @keydown="${this.textAreaKeyDown}"
          maxLength="140"
          .rows="${this.wide ? 3 : 5}"
          label="${this.t('Your own answer')}"
        >
        </md-filled-text-field>
        <div class="error" ?hidden="${!this.currentError}">
          ${this.currentError}
        </div>
      </div>
    `;
    }
    renderFooter() {
        return html ` <div class="layout horizontal footer">
      <md-circular-progress
        ?hidden="${!this.submitting}"
        indeterminate
      ></md-circular-progress>
      <md-text-button
        class="cancelButton"
        @click="${this.cancel}"
        ?disabled="${this.submitting}"
      >
        ${this.t('Cancel')}
      </md-text-button>
      <md-outlined-button
        class="submitButton"
        @click="${this.submit}"
        ?disabled="${this.submitting}"
      >
        ${this.t('Submit Idea')}
      </md-outlined-button>
    </div>`;
    }
    render() {
        return html `<md-dialog
      ?fullscreen="${!this.wide}"
      id="dialog"
    >
      <div slot="content">${this.renderContent()}</div>
      <div slot="actions">${this.renderFooter()}</div>
    </md-dialog> `;
    }
};
__decorate([
    property({ type: Object })
], AoiNewIdeaDialog.prototype, "earl", void 0);
__decorate([
    property({ type: Number })
], AoiNewIdeaDialog.prototype, "groupId", void 0);
__decorate([
    property({ type: Object })
], AoiNewIdeaDialog.prototype, "question", void 0);
__decorate([
    property({ type: Boolean })
], AoiNewIdeaDialog.prototype, "submitting", void 0);
__decorate([
    property({ type: String })
], AoiNewIdeaDialog.prototype, "currentError", void 0);
__decorate([
    query('#ideaText')
], AoiNewIdeaDialog.prototype, "ideaText", void 0);
__decorate([
    query('#dialog')
], AoiNewIdeaDialog.prototype, "dialog", void 0);
AoiNewIdeaDialog = __decorate([
    customElement('aoi-new-idea-dialog')
], AoiNewIdeaDialog);
export { AoiNewIdeaDialog };
//# sourceMappingURL=aoi-new-idea-dialog.js.map