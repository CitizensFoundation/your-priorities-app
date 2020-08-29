import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@material/mwc-button';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpEditDialogLit extends YpBaseElement {
  static get properties() {
    return {
      smallHeight: Boolean,
      mediumHeight: Boolean,
      largeHeight: Boolean,
      action: {
       type: String
      },

      tablet: {
        type: Boolean,
        value: false
      },

      baseAction: {
        type: String
      },

      cancelText: {
        type: String,
        value: null
      },

      method: {
        type: String,
        value: "POST"
      },

      buttonText: {
        type: String
      },

      errorText: {
        type: String
      },

      toastText: {
        type: String
      },

      toastTextCombined: {
        type: String
      },

      response: {
        type: Object,
        notify: true
      },

      dialogOpen: {
        type: Boolean,
        value: true
      },

      saveText: {
        type: String
      },

      narrowScreen: {
        type: Boolean,
        observer: '_narrowScreenChanged',
        notify: true
      },

      narrow: {
        type: Boolean,
        computed: '_narrow(narrowScreen,tablet)'
      },

      params: {
        type: String
      },

      doubleWidth: {
        type: Boolean,
        value: false
      },

      icon: {
        type: String
      },

      opened: {
        type: Boolean,
        value: false
      },

      useNextTabAction: {
        type: Boolean,
        value: false,
        notify: true
      },

      nextActionText: {
        type: String
      },

      uploadingState: {
        type: Boolean,
        value: false
      },

      bodyDialog: {
        type: Object
      },

      confirmationText: {
        type: String
      },

      title: String,

      name: String,

      customSubmit: {
        type: Boolean,
        value: false
      }
    }
  }

  static get styles() {
    return [
      css`

      :host {
        background-color: #FFF;
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
        background-color: #F00;
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

      mwc-button[disabled]{
        background-color: #FFF;
      }

      .title ::slotted(h2) {
        padding-top: 2px;
      }

      paper-toast {
        z-index: 9999;
      }

      #form > * {
        padding: 24px 24px;
      }

      @media (max-width: 1024px) {
        paper-dialog > * {
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

      paper-dialog {
        background-color: #fff;
      }

      paper-header-panel {
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
        paper-dialog > * {
          padding: 0;
          margin: 0;
          background-color: #FFF;
        }

        :host {
          max-height: 100% !important;
          height: 100% !important;
        }
      }

      paper-dialog[tablet] > * {
        padding: 0;
        margin: 0;
        background-color: #FFF;
      }

      paper-dialog[tablet] {
        max-width: 3200px !important;
      }

      .toolbar {
        padding-top: 8px;
      }

      .bigHeader {
        background-color: var(--accent-color);
        color: #FFF;
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
        background-color: #FFF;
        padding: 0;
        margin: 0;
      }

      .smallHeader {
        background-color: var(--accent-color);
        color: #FFF;
        margin: 0;
        padding: 8px;
        vertical-align: center;
        max-height: 70px !important;
      }

      .actionButtons {
        margin: 8px;
        font-weight: bold;
      }

      @media all and (-ms-high-contrast:none)
      {
        #scrollable {
          min-height: 350px;
        }
      }

      paper-dialog[rtl] {
        direction: rtl;
      }

      paper-dialog, paper-checkbox {
        --paper-checkbox-label: {
          padding-right: 6px;
        }
      }

      paper-dialog, paper-radio-button {
        --paper-radio-button-label: {
          padding-right: 6px;
        }
      }
  `, YpFlexLayout];
  }

  render() {
    return html`
    <paper-dialog ?rtl="${this.rtl}" .name="${this.name}" id="editDialog" class="${this._computeClass(narrow)}" @iron-overlay-closed="${this_dialogClosed}" with-backdrop="${!this.narrowPad}" modal>
      <iron-media-query query="(max-width: 1024px)" query-matches="${this.narrowScreen}"></iron-media-query>
      <iron-media-query query="(max-width: 1024px)" query-matches="${this.narrowPad}"></iron-media-query>
      <iron-media-query query="(min-height: 830px)" query-matches="${thislargeHeight}"></iron-media-query>
      <iron-media-query query="(min-height: 1024px)" query-matches="${this.mediumHeight}"></iron-media-query>
      <iron-media-query query="(max-height: 1024px)" query-matches="${this.smallHeight}"></iron-media-query>

      ${ this.narrow ? html`
        <div class="outerMobile">
          <div class="layout horizontal smallHeader">
            <paper-icon-button id="dismissBtn" .ariaLabel="${this.t('close')}" .icon="close" class="closeIconNarrow" dialog-dismiss></paper-icon-button>
            <iron-icon class="smallIcon" .icon="${this.icon}"></iron-icon>
            <div class="titleHeaderMobile">${this.title}</div>
            <div class="flex"></div>

            ${!this.useNextTabAction ? html`

              ${!this.uploadingState ? html`
                <mwc-button id="submit1" ?hidden="${!this.saveText}" @click="${this._submit}" .label="${this.saveText}" class="smallButtonText"></mwc-button>
              `: html`
                <mwc-button ?disabled="" @click="${this._nextTab}" .label="${this.t('uploading.inProgress')}"></mwc-button>
              `}

            `: html``}

            ${this.useNextTabAction ? html`
            `: html`
              <mwc-button @click="${this._nextTab}" class="smallButtonText" .label="${this.nextActionText}"></mwc-button>
            `}

          </div>
            <div id="scroller">
              <iron-form id="form" .contentType="application/json" .method="POST" .action="${this.action}" .ironMethod="${this.method}" .params="${this.params}">
                <form .name="ypForm" .method="POST" .action="${this.action}">
                  <slot></slot>action: {
                </form>
              </iron-form>
            </div>
            <paper-spinner id="spinner"></paper-spinner>
        </div>
      ` : html`
        <div class="layout horizontal bigHeader">
          <iron-icon class="largeIcon" .icon="${this.icon}"></iron-icon>
          <div class="titleHeader">${this.title}</div>
        </div>
        <paper-dialog-scrollable id="scrollable" .smallHeight="${this.smallHeight}" .mediumHeight="${this.mediumHeight}" .largeHeight="${this.largeHeight}">
          <iron-form id="form" .ironMethod="${this.method}" .action="${this.action}" params="${this.params}">
            <form .name="ypForm" .method="POST" .action="${this.action}">
              <slot></slot>
            </form>
          </iron-form>
          <paper-spinner id="spinner"></paper-spinner>
        </paper-dialog-scrollable>
        <div class="buttons">
          ${this.cancelText ? html`
            <mwc-button id="dismissBtn" dialog-dismiss .label="${this.cancelText}"></mwc-button>
          ` : html`
            <mwc-button id="dismissBtn" dialog-dismiss .label="${this.t('cancel')}"></mwc-button>
          `}

          ${!this.uploadingState ? html`

            ${!this.useNextTabAction ? html`
              <mwc-button raised class="actionButtons" ?hidden="${!this.saveText}" id="submit2" @click="${this._submit}" .label="${this.saveText}"></mwc-button>
            `: html`
              <mwc-button raised class="actionButtons" @click="${this._nextTab}" .label="${this.nextActionText}"></mwc-button>
            `}

          `: html`
            <mwc-button ?disabled @click="${this._nextTab}" .label="${this.t('uploading.inProgress')}"></mwc-button>
        </div>
          `}
      `}

      </paper-dialog>

      <paper-dialog id="formErrorDialog" modal>
        <div id="errorText"> ${this.errorText}</div>
        <div class="buttons">
          <mwc-button dialog-confirm autofocus @click="${this._clearErrorText}" .label="${this.t('ok')}"></mwc-button>
        </div>
      </paper-dialog>
      <paper-toast id="toast" .text="${this.toastTextCombined}"></paper-toast>
`
  }


  _narrow(narrowScreen, tablet) {
    return narrowScreen || tablet;
  }

  scrollResize() {
    if (this.$$("#scrollable")) {
      this.$$("#scrollable").fire('iron-resize');
    }
  }

  _dialogClosed(event) {
      if(event.target.nodeName === "PAPER-DIALOG" && event.target.attributes.name && event.target.attributes.name.nodeValue) {
        this.fire('yp-dialog-closed', { name: event.target.attributes.name.nodeValue });
      }
    }

  _fileUploadStarting(event) {
    this.uploadingState = true;
  }

  _fileUploadComplete(event) {
    this.uploadingState = false;
  }

  _nextTab() {
    this.fire('next-tab-action')
  }

  _narrowScreenChanged() {
    this.fire('paper-responsive-change', {narrow: this.narrow});
  }

  _computeClass(narrow) {
    if (narrow)
      return "fullScreenDialog";
    else if (this.doubleWidth)
      return "popUpDialogDouble";
    else
      return "popUpDialog";
  }


  connectedCallback() {
    super.connectedCallback();
      this.addListener('iron-form-submit', this._formSubmitted);
      this.addListener('iron-form-response', this._formResponse);
      this.addListener('iron-form-error', this._formError);
      this.addListener('iron-form-invalid', this._formInvalid);
      this.addListener('file-upload-starting', this._fileUploadStarting);
      this.addListener('file-upload-complete', this._fileUploadComplete);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
      this.removeListener('iron-form-submit', this._formSubmitted);
      this.removeListener('iron-form-response', this._formResponse);
      this.removeListener('iron-form-error', this._formError);
      this.removeListener('iron-form-invalid', this._formInvalid);
      this.removeListener('file-upload-starting', this._fileUploadStarting);
      this.removeListener('file-upload-complete', this._fileUploadComplete);
  }

  open() {
    this.opened = false;
    this.async(function () {
      this.opened = true;
      this.async(function () {
        this.$$("#editDialog").open();
      });
    });
  }

  close() {
    this.opened = false;
    this.$$("#editDialog").close();
  }

  _formSubmitted(event) {
  }

  connectedCallback() {
    super.connectedCallback()
    this.baseAction = this.action;
    if (/iPad/.test(navigator.userAgent)) {
      this.tablet = true;
    } else if (/Android/.test(navigator.userAgent) && !/Mobile/.test(navigator.userAgent)) {
      this.tablet = true;
    } else {
      this.tablet = false;
    }
  }

  _formResponse(response, detail) {
    this._setSubmitDisabledStatus(false);
    this.$$("#spinner").active = false;
    if (response && response.detail && response.detail.response && response.detail.response.isError) {
      console.log("There is an error in form handled by user");
    } else {
      this.response = response;
      this.close();
      if (detail.response && detail.response.name) {
        this.toastTextCombined = this.toastText + " " + detail.response.name;
      } else {
        this.toastTextCombined = this.toastText;
      }
      this.$$("#toast").show();
    }
  }

  _formError(event, detail) {
    this._setSubmitDisabledStatus(false);
    console.log("Form error: ", detail.error);
    this._showErrorDialog(detail.error);
    this.$$("#spinner").active = false;
  }

  _formInvalid(event) {
    this._setSubmitDisabledStatus(false);
    this.$$("#spinner").active = false;
  }

  _submit() {
    if (this.customSubmit) {
      this.fire('yp-custom-form-submit');
    } else {
      if (this.confirmationText) {
        dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
          dialog.open(this.confirmationText, this._reallySubmit.bind(this));
        }.bind(this));
      } else {
        this._reallySubmit();
      }
    }
  }

  _setSubmitDisabledStatus(status) {
    const submit1 = this.$$("#submit1");
    const submit2 = this.$$("#submit2");
    if (submit1)
      submit1.disabled = status;

    if (submit2)
      submit2.disabled = status;
  }

  _reallySubmit() {
    this._setSubmitDisabledStatus(true);
    if (this.params && this.params.communityId) {
      this.action = this.baseAction + '/'+this.params.communityId;
    } else if (this.params && this.params.groupId) {
      this.action = this.baseAction + '/'+this.params.groupId;
    } else if (this.params && this.params.organizationId) {
      this.action = this.baseAction + '/'+this.params.organizationId;
    } else if (this.params && this.params.userImages && this.params.postId) {
      this.action = this.baseAction + '/'+this.params.postId+'/user_images';
    } else if (this.params && this.params.statusChange && this.params.postId) {
      this.action = this.baseAction + '/'+this.params.postId+'/status_change';
    } else if (this.params && this.params.postId && this.params.imageId) {
      this.action = this.baseAction + '/'+this.params.postId+'/'+this.params.imageId+'/user_images';
    } else if (this.params && this.params.postId) {
      this.action = this.baseAction + '/'+this.params.postId;
    } else if (this.params && this.params.userId) {
      this.action = this.baseAction + '/'+this.params.userId;
    } else if (this.params && this.params.domainId) {
      this.action = this.baseAction + '/'+this.params.domainId;
    } else if (this.params && this.params.categoryId) {
      this.action = this.baseAction + '/' + this.params.categoryId;
    }

    if (this.$$("#form").validate()) {
      this.$$("#form").submit();
      this.$$("#spinner").active = true;
    } else {
      this.fire('iron-form-invalid');
      const error = this.t('form.invalid');
      this._showErrorDialog(error);
    }
  }

  submitForce() {
    this.$$("#spinner").active = true;
    this.$$("#form").submit();
  }

  getForm() {
    return this.$$("#form");
  }

  stopSpinner() {
    this.$$("#spinner").active = false;
  }

  validate() {
    return this.$$("#form").validate();
  }

  _showErrorDialog(errorText) {
    this.errorText = errorText;
    this.$$("#formErrorDialog").open();
  }

  _clearErrorText(event) {
    this.$$("#formErrorDialog").close();
    this.errorText = null;
  }
}

window.customElements.define('yp-edit-dialog-lit', YpEditDialogLit)
