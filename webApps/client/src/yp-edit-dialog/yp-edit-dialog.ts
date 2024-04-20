import { html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

import { YpBaseElement } from "../common/yp-base-element.js";

import "@material/web/progress/circular-progress.js";
import "@material/web/button/text-button.js";
import "@material/web/dialog/dialog.js";

import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";

import "../common/yp-form.js";

import { YpForm } from "../common/yp-form.js";
import { YpConfirmationDialog } from "../yp-dialog-container/yp-confirmation-dialog.js";
import { Dialog } from "@material/web/dialog/internal/dialog.js";
import { Progress } from "@material/web/progress/internal/progress.js";

@customElement("yp-edit-dialog")
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
  method = "POST";

  @property({ type: Object })
  customValidationFunction: Function | undefined;

  @property({ type: String })
  errorText: string | undefined;

  @property({ type: String })
  snackbarText: string | undefined;

  @property({ type: String })
  snackbarTextCombined: string | undefined;

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
  heading!: string;

  @property({ type: String })
  name: string | undefined;

  @property({ type: Boolean })
  customSubmit = false;

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          font-family: var(--app-header-font-family, Roboto);
        }

        md-dialog {
          // height: 100%;
          width: 1024px;
          height: 100%;
        }

        md-dialog.popUpDialogDouble {
          width: 1024px;
          max-width: 1024px;
          height: 100%;
          max-height: 750px;
        }

        md-dialog[open][is-safari] {
          // height: 100%;
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
        }

        #toolbar {
          max-height: 70px !important;
        }

        #dismissBtn {
          margin-left: 0;
        }

        md-text-button {
          font-family: var(--app-header-font-family, Roboto);
        }

        md-text-button[long-button-text] {
        }

        md-dialog[long-title-text] {
        }

        md-text-button[dialog-confirm] {
          min-width: 44px;
          margin: 6px 0 0 16px;
        }

        md-text-button[disabled] {
        }

        .title ::slotted(h2) {
          padding-top: 2px;
        }

        #form > * {
          padding: 8px 8px;
        }

        @media (max-width: 1024px) {
          .fullScreenDialog {
            min-width: 320px;
          }
        }

        @media (max-width: 359px) {
          .fullScreenDialog {
            min-width: 320px;
          }
        }

        app-toolbar {
          margin-top: 0;
          padding-top: 0;
        }

        #scroller {
          padding: 8px;
        }

        .scrollerContainer {
          height: 100%;
        }

        @media (max-width: 1024px) {
          :host {
            max-height: 100% !important;
            height: 100% !important;
          }
        }

        md-dialog[tablet] > * {
          padding: 0;
          margin: 0;
        }

        md-dialog[tablet] {
          max-width: 3200px !important;
        }

        .toolbar {
          padding-top: 8px;
        }

        .bigHeader {
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
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

        .titleHeaderMobile[long-title-text] {
          margin-top: 4px;
        }

        .titleHeaderMobile[long-button-text] {
          font-size: 16px;
          margin-top: 12px;
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

        .smallButtonText[long-button-text] {
          font-size: 14px;
        }

        .outerMobile {
          padding: 0;
          margin: 0;
        }

        .smallHeader {
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
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

        md-dialog[rtl] {
          direction: rtl;
        }
      `,
    ];
  }

  renderMobileView() {
    return html`
      <div class="outerMobile">
        <div class="layout horizontal smallHeader">
          <md-icon-button
            id="dismissBtn"
            .label="${this.t("close")}"
            icon="close"
            class="closeIconNarrow"
            dialog-dismiss
          ></md-icon-button>
          <md-icon class="smallIcon">${this.icon}</md-icon>
          <div class="flex"></div>

          ${!this.useNextTabAction
            ? html`
                ${!this.uploadingState
                  ? html`
                      <md-text-button
                        id="submit1"
                        ?hidden="${!this.saveText}"
                        @click="${this._submit}"
                        ?long-button-text="${this.hasLongSaveText}"
                        slot="footer"
                        class="smallButtonText"
                        >${this.saveText ? this.saveText : ""}</md-text-button
                      >
                    `
                  : html`
                      <md-text-button
                        disabled
                        ?long-button-text="${this.hasLongSaveText}"
                        slot="footer"
                        >${this.t("uploading.inProgress")}</md-text-button
                      >
                    `}
              `
            : html``}
          ${this.useNextTabAction
            ? html``
            : html`
                <md-text-button
                  @click="${this._nextTab}"
                  slot="footer"
                  ?long-button-text="${this.hasLongSaveText}"
                  class="smallButtonText"
                  >${this.nextActionText!}</md-text-button
                >
              `}
        </div>
        <div id="scroller">
          <yp-form id="form" method="POST" .params="${this.params}">
            <form
              name="ypForm"
              .method="${this.method}"
              .action="${this.action ? this.action : ""}"
            >
              <slot></slot>
            </form>
          </yp-form>
        </div>
        <md-circular-progress id="spinner"></md-circular-progress>
      </div>
    `;
  }

  renderDesktopView() {
    return html`
      <div
        id="scrollable"
        slot="content"
        .smallHeight="${!this.wide}"
        .mediumHeight="${!this.wide}"
        .largeHeight="${this.wide}"
      >
        <yp-form id="form" .params="${this.params}">
          <form
            name="ypForm"
            .method="${this.method}"
            .action="${this.action!}"
          >
            <slot></slot>
          </form>
        </yp-form>
        <md-circular-progress id="spinner"></md-circular-progress>
      </div>
      <div slot="actions">
        ${this.cancelText
          ? html`
              <md-text-button
                id="dismissBtn"
                class="actionButtons"
                @click="${this.close}"
                dialogAction="cancel"
                .label=""
                >${this.cancelText}</md-text-button
              >
            `
          : html`
              <md-text-button
                id="dismissBtn"
                @click="${this.close}"
                class="actionButtons"
                dialogAction="cancel"
                >${this.t("cancel")}</md-text-button
              >
            `}
        ${!this.uploadingState
          ? html`
              ${!this.useNextTabAction
                ? html`
                    <md-text-button
                      raised
                      class="actionButtons"
                      ?hidden="${!this.saveText}"
                      id="submit2"
                      @click="${this._submit}"
                      >${this.saveText ? this.saveText : ""}</md-text-button
                    >
                  `
                : html`
                    <md-text-button
                      raised
                      class="actionButtons"
                      @click="${this._nextTab}"
                      >${this.nextActionText!}</md-text-button
                    >
                  `}
            `
          : html`
            <md-text-button
              disabled
              @click="${this._nextTab}"

             >${this.t("uploading.inProgress")}</md-text-button>
          </div>
          `}
      </div>
    `;
  }

  override render() {
    return html`
      <md-dialog
        ?open="${this.opened}"
        ?rtl="${this.rtl}"
        @cancel="${this.scrimDisableAction}"
        ?is-safari="${this.isSafari}"
        @closed="${this.close}"
        .name="${this.name}"
        .heading="${this.heading}"
        ?long-title-text="${this.hasLongTitle}"
        id="editDialog"
        scrimClickAction=""
        escapeKeyAction=""
        .fullscreen="${this.narrow}"
        class="${this.computeClass}"
        with-backdrop="${!this.wide}"
      >
        <span slot="headline">
          <md-icon-button @click="${this.close}"><md-icon>close</md-icon></md-icon-button> <span>${this.heading}</span></span>
        ${
          this.narrow
            ? this.renderMobileView()
            : this.renderDesktopView()
        }
      </md-dialog>

      <md-dialog id="formErrorDialog" modal>
        <div slot="content" id="errorText">${this.errorText}</div>
        <div class="buttons" slot="actions">
          <md-text-button autofocus @click="${this._clearErrorText}"
            >${this.t("ok")}</md-text-button
          >
        </div>
      </md-dialog>
    `;
  }

  get narrow() {
    return !this.wide || this.tablet;
  }

  scrollResize() {
    /*if (this.$$('#scrollable')) {
      this.$$('#scrollable').fire('iron-resize');
    }*/
  }

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    super.updated(changedProperties);
    if (changedProperties.has("opened") === false) {
      //TODO: Look into if this is needed
      //this.fire('yp-dialog-closed');
    }
  }

  _fileUploadStarting() {
    this.uploadingState = true;
  }

  _fileUploadComplete() {
    this.uploadingState = false;
  }

  _nextTab() {
    this.fire("next-tab-action");
  }

  get computeClass() {
    if (this.narrow) return "fullScreenDialog";
    else if (this.doubleWidth) return "popUpDialogDouble";
    else return "popUpDialog";
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addListener("yp-form-submit", this._formSubmitted);
    this.addListener("yp-form-response", this._formResponse);
    this.addListener("yp-form-error", this._formError);
    this.addListener("yp-form-invalid", this._formInvalid);
    this.addListener("file-upload-starting", this._fileUploadStarting);
    this.addListener("file-upload-complete", this._fileUploadComplete);

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

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener("yp-form-submit", this._formSubmitted);
    this.removeListener("yp-form-response", this._formResponse);
    this.removeListener("yp-form-error", this._formError);
    this.removeListener("yp-form-invalid", this._formInvalid);
    this.removeListener("file-upload-starting", this._fileUploadStarting);
    this.removeListener("file-upload-complete", this._fileUploadComplete);
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
  }

  _formSubmitted() {
    //TODO: DO we need this
  }

  _formResponse(event: CustomEvent) {
    this._setSubmitDisabledStatus(false);
    (this.$$("#spinner") as Progress).hidden = true;
    const response = event.detail;
    if (response && response.isError) {
      console.log("There is an error in form handled by user");
    } else {
      this.response = response;
      this.close();
      if (response && response.name) {
        this.snackbarTextCombined = this.snackbarText + " " + response.name;
      } else {
        this.snackbarTextCombined = this.snackbarText;
      }
      this.fire("yp-open-toast", { text: this.snackbarTextCombined });
    }
  }

  _formError(event: CustomEvent) {
    if (
      !navigator.onLine &&
      this.method === "POST" &&
      window.fetch !== undefined
    ) {
      const serialized = (this.$$("#form") as YpForm).serializeForm();
      window.appGlobals.offline.sendWhenOnlineNext({
        body: serialized,
        method: this.method,
        params: this.params,
        url: this.action!,
      });
      this.response = { offlineSendLater: true };
      this.close();
    } else if (!navigator.onLine) {
      this._showErrorDialog(this.t("youAreOfflineCantSend"));
    } else {
      this._setSubmitDisabledStatus(false);
      console.log("Form error: ", event.detail.error);
      this._showErrorDialog(event.detail.error);
      (this.$$("#spinner") as Progress).hidden = false;
    }
  }

  _formInvalid() {
    this._setSubmitDisabledStatus(false);
    (this.$$("#spinner") as Progress).hidden = false;
  }

  _submit() {
    if (this.customSubmit) {
      this.fire("yp-custom-form-submit");
    } else {
      if (this.confirmationText) {
        window.appDialogs.getDialogAsync(
          "confirmationDialog",
          (dialog: YpConfirmationDialog) => {
            dialog.open(this.confirmationText!, this._reallySubmit.bind(this));
          }
        );
      } else {
        this._reallySubmit();
      }
    }
  }

  _setSubmitDisabledStatus(status: boolean) {
    const submit1 = this.$$("#submit1") as HTMLInputElement;
    const submit2 = this.$$("#submit2") as HTMLInputElement;
    if (submit1) submit1.disabled = status;

    if (submit2) submit2.disabled = status;
  }

  get hasLongSaveText() {
    return this.saveText && this.saveText.length > 12;
  }

  get hasLongTitle() {
    return this.title && this.title.length > 14;
  }

  async _reallySubmit(validate = true) {
    this._setSubmitDisabledStatus(true);
    if (this.params && this.params.communityId) {
      this.action = this.baseAction + "/" + this.params.communityId;
    } else if (this.params && this.params.groupId) {
      this.action = this.baseAction + "/" + this.params.groupId;
    } else if (this.params && this.params.organizationId) {
      this.action = this.baseAction + "/" + this.params.organizationId;
    } else if (this.params && this.params.userImages && this.params.postId) {
      this.action = this.baseAction + "/" + this.params.postId + "/user_images";
    } else if (this.params && this.params.statusChange && this.params.postId) {
      this.action =
        this.baseAction + "/" + this.params.postId + "/status_change";
    } else if (this.params && this.params.postId && this.params.imageId) {
      this.action =
        this.baseAction +
        "/" +
        this.params.postId +
        "/" +
        this.params.imageId +
        "/user_images";
      // eslint-disable-next-line no-dupe-else-if
    } else if (
      this.params &&
      this.params.statusChange &&
      this.params.disableStatusEmails === true &&
      this.params.postId
    ) {
      this.action =
        this.baseAction + "/" + this.params.postId + "/status_change_no_emails";
    } else if (this.params && this.params.postId) {
      this.action = this.baseAction + "/" + this.params.postId;
    } else if (this.params && this.params.userId) {
      this.action = this.baseAction + "/" + this.params.userId;
    } else if (this.params && this.params.domainId) {
      this.action = this.baseAction + "/" + this.params.domainId;
    } else if (this.params && this.params.categoryId) {
      this.action = this.baseAction + "/" + this.params.categoryId;
    }

    await this.requestUpdate();

    const form = this.$$("#form") as YpForm;

    let validated = false;

    if (validate) {
      if (this.customValidationFunction) {
        validated = this.customValidationFunction();
      } else {
        validated = form.validate();
      }
    } else {
      validated = true;
    }

    if (validated) {
      form.submit();
      (this.$$("#spinner") as Progress).hidden = false;
    } else {
      this.fire("yp-form-invalid");
      //const error = this.t("form.invalid");
      //this._showErrorDialog(error);
    }
  }

  submitForce() {
    const form = this.$$("#form") as YpForm;
    form.submit();
    (this.$$("#spinner") as Progress).hidden = false;
  }

  getForm() {
    return this.$$("#form");
  }

  stopSpinner() {
    (this.$$("#spinner") as Progress).hidden = true;
  }

  validate() {
    const form = this.$$("#form") as YpForm;
    form.validate();
  }

  _showErrorDialog(errorText: string) {
    this.errorText = errorText;
    (this.$$("#formErrorDialog") as Dialog).show();
  }

  _clearErrorText() {
    (this.$$("#formErrorDialog") as Dialog).close();
    this.errorText = undefined;
  }
}
