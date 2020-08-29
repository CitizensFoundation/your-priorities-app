import { property, html, css, customElement } from 'lit-element';
import { nothing } from 'lit-html';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';

@customElement('yp-edit-dialog')
export class YpEditDialog extends YpBaseElement {
  @property({ type: String })
  action: string | undefined;

  @property({ type: Boolean })
  tablet = false;

  @property({ type: String })
  baseAction: string | undefined;

  @property({ type: String })
  cancelText: string | undefined;

  @property({ type: String })
  buttonText: string | undefined;

  @property({ type: String })
  method = 'POST';

  @property({ type: String })
  errorText: string | undefined;

  @property({ type: String })
  toastText: string | undefined;

  @property({ type: String })
  toastTextCombined: string | undefined;

  @property({ type: String })
  saveText: string | undefined;

  @property({ type: Object })
  response: object | undefined;

  @property({ type: Object })
  params: YpEditFormParams | undefined;

  @property({ type: Boolean })
  doubleWidth = false;

  @property({ type: String })
  icon: string | undefined;

  @property({ type: Boolean })
  opened = false;

  @property({ type: Boolean })
  useNextTabAction = false;

  @property({ type: String })
  nextActionText: string | undefined;

  @property({ type: Boolean })
  uploadingState = false;

  @property({ type: String })
  confirmationText: string | undefined;

  @property({ type: String })
  title!: string;

  @property({ type: String })
  name: string | undefined;

  @property({ type: Boolean })
  customSubmit = false;

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          background-color: #fff;
        }

        .fullScreenDialog {
          position: absolute;
          display: block;
          top: 0;
          bottom: 0;
          margin: 0;
          min-width: 360px;
          max-width: 1024px;
          width: 100%;
        }

        [main] {
          background-color: #fff;
        }

        #toolbar {
          background-color: #f00;
          color: var(--text-primary_color);
          max-height: 70px !important;
        }

        #dismissBtn {
          margin-left: 0;
        }

        mwc-button[dialog-confirm] {
          background: none;
          min-width: 44px;
          margin: 6px 0 0 16px;
        }

        mwc-button[disabled] {
          background-color: #fff;
        }

        .title ::slotted(h2) {
          padding-top: 2px;
        }

        mwc-toast {
          z-index: 9999;
        }

        #form > * {
          padding: 24px 24px;
        }

        @media (max-width: 1024px) {
          mwc-dialog > * {
            padding: 0 0;
          }

          .fullScreenDialog {
            min-width: 320px;
          }
        }

        @media (max-width: 359px) {
          .fullScreenDialog {
            min-width: 320px;
          }
        }

        mwc-dialog {
          background-color: #fff;
        }

        mwc-header-panel {
          margin-top: 0;
          padding-top: 0 !important;
        }

        app-toolbar {
          margin-top: 0;
          padding-top: 0;
        }

        .popUpDialog {
          width: 550px;
        }

        .popUpDialogDouble {
          width: 840px;
        }

        #scroller {
          padding: 8px;
        }

        .scrollerContainer {
          height: 100%;
        }

        @media (max-width: 1024px) {
          mwc-dialog > * {
            padding: 0;
            margin: 0;
            background-color: #fff;
          }

          :host {
            max-height: 100% !important;
            height: 100% !important;
          }
        }

        mwc-dialog[tablet] > * {
          padding: 0;
          margin: 0;
          background-color: #fff;
        }

        mwc-dialog[tablet] {
          max-width: 3200px !important;
        }

        .toolbar {
          padding-top: 8px;
        }

        .bigHeader {
          background-color: var(--accent-color);
          color: #fff;
          margin: 0;
          padding: 16px;
          vertical-align: center;
        }

        .largeIcon {
          width: 48px;
          height: 48px;
          margin-left: 8px;
        }

        .smallIcon {
          width: 32px;
          height: 32px;
          padding-right: 8px;
          margin-top: 7px;
          margin-left: 8px;
        }

        .titleHeader {
          font-size: 32px;
          padding-left: 12px;
          padding-top: 14px;
          font-weight: bold;
        }

        .titleHeaderMobile {
          font-size: 20px;
          padding-left: 2px;
          margin-top: 12px;
          font-weight: bold;
        }

        #formErrorDialog {
          padding: 12px;
        }

        .closeIconNarrow {
          width: 48px;
          height: 48px;
          padding-right: 8px;
          margin-left: 0;
          padding-left: 0;
        }

        .smallButtonText {
          font-weight: bold;
          font-size: 17px;
        }

        .outerMobile {
          background-color: #fff;
          padding: 0;
          margin: 0;
        }

        .smallHeader {
          background-color: var(--accent-color);
          color: #fff;
          margin: 0;
          padding: 8px;
          vertical-align: center;
          max-height: 70px !important;
        }

        .actionButtons {
          margin: 8px;
          font-weight: bold;
        }

        @media all and (-ms-high-contrast: none) {
          #scrollable {
            min-height: 350px;
          }
        }

        mwc-dialog[rtl] {
          direction: rtl;
        }

        mwc-dialog,
        mwc-checkbox {
          --mwc-checkbox-label: {
            padding-right: 6px;
          }
        }

        mwc-dialog,
        mwc-radio-button {
          --mwc-radio-button-label: {
            padding-right: 6px;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <mwc-dialog
        ?opened="${this.opened}"
        ?rtl="${this.rtl}"
        .name="${this.name}"
        id="editDialog"
        class="${this.computeClass}"
        with-backdrop="${!this.wide}"
        modal>
        ${this.narrow
          ? html`
              <div class="outerMobile">
                <div class="layout horizontal smallHeader">
                  <mwc-icon-button
                    id="dismissBtn"
                    .ariaLabel="${this.t('close')}"
                    icon="close"
                    class="closeIconNarrow"
                    dialog-dismiss></mwc-icon-button>
                  <iron-icon class="smallIcon" .icon="${this.icon}"></iron-icon>
                  <div class="titleHeaderMobile">${this.title}</div>
                  <div class="flex"></div>

                  ${!this.useNextTabAction
                    ? html`
                        ${!this.uploadingState
                          ? html`
                              <mwc-button
                                id="submit1"
                                ?hidden="${!this.saveText}"
                                @click="${this._submit}"
                                .label="${this.saveText}"
                                class="smallButtonText"></mwc-button>
                            `
                          : html`
                              <mwc-button
                                disabled
                                .label="${this.t(
                                  'uploading.inProgress'
                                )}"></mwc-button>
                            `}
                      `
                    : html``}
                  ${this.useNextTabAction
                    ? html``
                    : html`
                        <mwc-button
                          @click="${this._nextTab}"
                          class="smallButtonText"
                          .label="${this.nextActionText!}"></mwc-button>
                      `}
                </div>
                <div id="scroller">
                  <yp-form id="form" method="POST" .params="${this.params}">
                    <form name="ypForm" method="POST" .action="${this.action ? this.action : ''}">
                      <slot></slot>
                    </form>
                  </yp-form>
                </div>
                <mwc-circular-progress-four-color id="spinner"></mwc-circular-progress-four-color>
              </div>
            `
          : html`
              <div class="layout horizontal bigHeader">
                <iron-icon class="largeIcon" .icon="${this.icon}"></iron-icon>
                <div class="titleHeader">${this.title}</div>
              </div>
              <div
                id="scrollable"
                .smallHeight="${!this.wide}"
                .mediumHeight="${!this.wide}"
                .largeHeight="${this.wide}">
                <yp-form id="form" .params="${this.params}">
                  <form name="ypForm" .method="${this.method}" .action="${this.action!}">
                    <slot></slot>
                  </form>
                </yp-form>
                <mwc-circular-progress-four-color id="spinner"></mwc-circular-progress-four-color>
              </div>
              <div class="buttons">
                ${this.cancelText
                  ? html`
                      <mwc-button
                        id="dismissBtn"
                        dialog-dismiss
                        .label="${this.cancelText}"></mwc-button>
                    `
                  : html`
                      <mwc-button
                        id="dismissBtn"
                        dialog-dismiss
                        .label="${this.t('cancel')}"></mwc-button>
                    `}
                ${!this.uploadingState
                  ? html`
                      ${!this.useNextTabAction
                        ? html`
                            <mwc-button
                              raised
                              class="actionButtons"
                              ?hidden="${!this.saveText}"
                              id="submit2"
                              @click="${this._submit}"
                              .label="${this.saveText}"></mwc-button>
                          `
                        : html`
                            <mwc-button
                              raised
                              class="actionButtons"
                              @click="${this._nextTab}"
                              .label="${this.nextActionText!}"></mwc-button>
                          `}
                    `
                  : html`
            <mwc-button disabled @click="${this._nextTab}" .label="${this.t(
                      'uploading.inProgress'
                    )}"></mwc-button>
        </div>
          `}
              </div>
            `}
      </mwc-dialog>

      <mwc-dialog id="formErrorDialog" modal>
        <div id="errorText">${this.errorText}</div>
        <div class="buttons">
          <mwc-button
            dialog-confirm
            autofocus
            @click="${this._clearErrorText}"
            .label="${this.t('ok')}"></mwc-button>
        </div>
      </mwc-dialog>
      <mwc-toast id="toast" .text="${this.toastTextCombined}"></mwc-toast>
    `;
  }

  get narrow() {
    return !this.wide || this.tablet;
  }

  scrollResize() {
    if (this.$$('#scrollable')) {
      this.$$('#scrollable').fire('iron-resize');
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('opened') === false) {
      this.fire('yp-dialog-closed');
    }
  }

  _fileUploadStarting() {
    this.uploadingState = true;
  }

  _fileUploadComplete() {
    this.uploadingState = false;
  }

  _nextTab() {
    this.fire('next-tab-action');
  }

  get computeClass() {
    if (this.narrow) return 'fullScreenDialog';
    else if (this.doubleWidth) return 'popUpDialogDouble';
    else return 'popUpDialog';
  }

  connectedCallback() {
    super.connectedCallback();
    this.addListener('yp-form-submit', this._formSubmitted);
    this.addListener('yp-form-response', this._formResponse);
    this.addListener('yp-form-error', this._formError);
    this.addListener('yp-form-invalid', this._formInvalid);
    this.addListener('file-upload-starting', this._fileUploadStarting);
    this.addListener('file-upload-complete', this._fileUploadComplete);

    this.baseAction = this.action;
    if (/iPad/.test(navigator.userAgent)) {
      this.tablet = true;
    } else if (
      /Android/.test(navigator.userAgent) &&
      !/Mobile/.test(navigator.userAgent)
    ) {
      this.tablet = true;
    } else {
      this.tablet = false;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener('yp-form-submit', this._formSubmitted);
    this.removeListener('yp-form-response', this._formResponse);
    this.removeListener('yp-form-error', this._formError);
    this.removeListener('yp-form-invalid', this._formInvalid);
    this.removeListener('file-upload-starting', this._fileUploadStarting);
    this.removeListener('file-upload-complete', this._fileUploadComplete);
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
    this.$$('#editDialog').close();
  }

  _formSubmitted(event) {}

  _formResponse(event: CustomEvent) {
    this._setSubmitDisabledStatus(false);
    this.$$('#spinner').active = false;
    const response = event.detail;
    if (response && response.isError) {
      console.log('There is an error in form handled by user');
    } else {
      this.response = response;
      this.close();
      if (response && response.name) {
        this.toastTextCombined = this.toastText + ' ' + response.name;
      } else {
        this.toastTextCombined = this.toastText;
      }
      this.$$('#toast').show();
    }
  }

  _formError(event: CustomEvent) {
    this._setSubmitDisabledStatus(false);
    console.log('Form error: ', event.detail.error);
    this._showErrorDialog(event.detail.error);
    this.$$('#spinner').active = false;
  }

  _formInvalid() {
    this._setSubmitDisabledStatus(false);
    this.$$('#spinner').active = false;
  }

  _submit() {
    if (this.customSubmit) {
      this.fire('yp-custom-form-submit');
    } else {
      if (this.confirmationText) {
        window.appDialogs.getDialogAsync('confirmationDialog', dialog => {
          dialog.open(this.confirmationText, this._reallySubmit.bind(this));
        });
      } else {
        this._reallySubmit();
      }
    }
  }

  _setSubmitDisabledStatus(status: boolean) {
    const submit1 = this.$$('#submit1');
    const submit2 = this.$$('#submit2');
    if (submit1) submit1.disabled = status;

    if (submit2) submit2.disabled = status;
  }

  _reallySubmit() {
    this._setSubmitDisabledStatus(true);
    if (this.params && this.params.communityId) {
      this.action = this.baseAction + '/' + this.params.communityId;
    } else if (this.params && this.params.groupId) {
      this.action = this.baseAction + '/' + this.params.groupId;
    } else if (this.params && this.params.organizationId) {
      this.action = this.baseAction + '/' + this.params.organizationId;
    } else if (this.params && this.params.userImages && this.params.postId) {
      this.action = this.baseAction + '/' + this.params.postId + '/user_images';
    } else if (this.params && this.params.statusChange && this.params.postId) {
      this.action =
        this.baseAction + '/' + this.params.postId + '/status_change';
    } else if (this.params && this.params.postId && this.params.imageId) {
      this.action =
        this.baseAction +
        '/' +
        this.params.postId +
        '/' +
        this.params.imageId +
        '/user_images';
    } else if (this.params && this.params.postId) {
      this.action = this.baseAction + '/' + this.params.postId;
    } else if (this.params && this.params.userId) {
      this.action = this.baseAction + '/' + this.params.userId;
    } else if (this.params && this.params.domainId) {
      this.action = this.baseAction + '/' + this.params.domainId;
    } else if (this.params && this.params.categoryId) {
      this.action = this.baseAction + '/' + this.params.categoryId;
    }

    if (this.$$('#form').validate()) {
      this.$$('#form').submit();
      this.$$('#spinner').active = true;
    } else {
      this.fire('yp-form-invalid');
      const error = this.t('form.invalid');
      this._showErrorDialog(error);
    }
  }

  submitForce() {
    this.$$('#spinner').active = true;
    this.$$('#form').submit();
  }

  getForm() {
    return this.$$('#form');
  }

  stopSpinner() {
    this.$$('#spinner').active = false;
  }

  validate() {
    return this.$$('#form').validate();
  }

  _showErrorDialog(errorText: string) {
    this.errorText = errorText;
    this.$$('#formErrorDialog').open();
  }

  _clearErrorText() {
    this.$$('#formErrorDialog').close();
    this.errorText = undefined;
  }
}
