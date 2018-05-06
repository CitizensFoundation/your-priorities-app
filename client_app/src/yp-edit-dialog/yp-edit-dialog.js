import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-form/iron-form.js';
import '../../../../@polymer/iron-media-query/iron-media-query.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-dialog/paper-dialog.js';
import '../../../../@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../../../../@polymer/paper-spinner/paper-spinner.js';
import '../../../../@polymer/paper-toast/paper-toast.js';
import '../../../../@polymer/app-layout/app-header-layout/app-header-layout.js';
import '../../../../@polymer/app-layout/app-toolbar/app-toolbar.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
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
        @apply --paper-fullscreen-dialog;
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
        @apply --paper-fullscreen-dialog-dismissbtn;
      }

      paper-button[dialog-confirm] {
        background: none;
        min-width: 44px;
        margin: 6px 0 0 16px;
      }

      paper-button[disabled]{
        background-color: #FFF;
      }

      .title ::slotted(h2) {
        @apply --paper-font-title;
        padding-top: 2px;
      }

      paper-toast {
        z-index: 9999;
      }

      #form > * {
        padding: 24px 24px;
      }

      @media (max-width: 601px) {
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
        @apply --paper-fullscreen-dialog-content;
        padding: 8px;
      }

      .scrollerContainer {
        height: 100%;
      }

      @media (max-width: 600px) {
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
      }

      .smallIcon {
        width: 32px;
        height: 32px;
        padding-right: 8px;
        margin-top: 7px;
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
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <paper-dialog name\$="[[name]]" id="editDialog" class\$="[[_computeClass(narrow)]]" on-iron-overlay-closed="_dialogClosed" with-backdrop\$="[[!narrowPad]]" modal="">
      <iron-media-query query="(max-width: 1024px)" query-matches="{{narrow}}"></iron-media-query>
      <iron-media-query query="(max-width: 1024px)" query-matches="{{narrowPad}}"></iron-media-query>
      <iron-media-query query="(min-height: 830px)" query-matches="{{largeHeight}}"></iron-media-query>
      <iron-media-query query="(min-height: 640px)" query-matches="{{mediumHeight}}"></iron-media-query>
      <iron-media-query query="(max-height: 640px)" query-matches="{{smallHeight}}"></iron-media-query>
      <template is="dom-if" if="opened" restamp="">
        <template is="dom-if" if="[[narrow]]" restamp="">
          <div class="outerMobile">
            <div class="layout horizontal smallHeader">
              <paper-icon-button id="dismissBtn" icon="close" class="closeIconNarrow" dialog-dismiss=""></paper-icon-button>
              <iron-icon class="smallIcon" icon="[[icon]]"></iron-icon>
              <div class="titleHeaderMobile">[[title]]</div>
              <div class="flex"></div>
              <template is="dom-if" if="[[!useNextTabAction]]">
                <paper-button id="submit1" on-tap="_submit"><span class="smallButtonText">[[saveText]]</span></paper-button>
              </template>
              <template is="dom-if" if="[[useNextTabAction]]">
                <paper-button on-tap="_nextTab"><span class="smallButtonText">[[nextActionText]]</span></paper-button>
              </template>
            </div>
            <div id="scroller">
              <iron-form id="form" content-type="application/json" method="POST" action="[[action]]" iron-method="[[method]]" params="[[params]]">
                <form name="ypForm" method="POST" action="[[action]]">
                  <slot></slot>
                </form>
              </iron-form>
            </div>
            <paper-spinner id="spinner"></paper-spinner>
          </div>
        </template>


        <template is="dom-if" if="[[!narrow]]" restamp="">
          <div class="layout horizontal bigHeader">
            <iron-icon class="largeIcon" icon="[[icon]]"></iron-icon>
            <div class="titleHeader">[[title]]</div>
          </div>
          <paper-dialog-scrollable id="scrollable" small-height\$="[[smallHeight]]" medium-height\$="[[mediumHeight]]" large-height\$="[[largeHeight]]">
            <iron-form id="form" iron-method="[[method]]" action="[[action]]" params="[[params]]">
              <form name="ypForm" method="POST" action="[[action]]">
                <slot></slot>
              </form>
            </iron-form>
            <paper-spinner id="spinner"></paper-spinner>
          </paper-dialog-scrollable>
          <div class="buttons">
            <paper-button id="dismissBtn" dialog-dismiss="">[[t('cancel')]]</paper-button>
            <template is="dom-if" if="[[!uploadingState]]">
              <template is="dom-if" if="[[!useNextTabAction]]">
                <paper-button raised="" class="actionButtons" id="submit2" on-tap="_submit">[[saveText]]</paper-button>
              </template>
              <template is="dom-if" if="[[useNextTabAction]]">
                <paper-button raised="" class="actionButtons" on-tap="_nextTab">[[nextActionText]]</paper-button>
              </template>
            </template>
            <template is="dom-if" if="[[uploadingState]]">
              <paper-button disabled="" on-tap="_nextTab">[[t('uploading.inProgress')]]</paper-button>
            </template>
          </div>
        </template>
      </template>
    </paper-dialog>

    <paper-dialog id="formErrorDialog" modal="">
      <div id="errorText">[[errorText]]</div>
      <div class="buttons">
        <paper-button dialog-confirm="" autofocus="" on-tap="_clearErrorText">[[t('ok')]]</paper-button>
      </div>
    </paper-dialog>
    <paper-toast id="toast" text="[[toastTextCombined]]"></paper-toast>
`,

  is: 'yp-edit-dialog',

  behaviors: [
    ypLanguageBehavior
  ],

  properties: {

    smallHeight: Boolean,
    mediumHeight: Boolean,
    largeHeight: Boolean,
    action: {
      type: String
    },

    baseAction: {
      type: String
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

    narrow: {
      type: Boolean,
      observer: '_narrowChanged',
      notify: true
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

    name: String
  },

  _dialogClosed: function (event) {
    if(event.target.nodeName === "PAPER-DIALOG" && event.target.attributes.name && event.target.attributes.name.nodeValue) {
      this.fire('yp-dialog-closed', { name: event.target.attributes.name.nodeValue });
    }
  },

  _fileUploadStarting: function (event) {
    this.set('uploadingState', true);
  },

  _fileUploadComplete: function (event) {
    this.set('uploadingState', false);
  },

  _nextTab: function () {
    this.fire('next-tab-action')
  },

  _narrowChanged: function() {
    this.fire('paper-responsive-change', {narrow: this.narrow});
  },

  _computeClass: function (narrow) {
    if (narrow)
      return "fullScreenDialog";
    else if (this.doubleWidth)
      return "popUpDialogDouble";
    else
      return "popUpDialog";
  },

  listeners: {
    'iron-form-submit': '_formSubmitted',
    'iron-form-response': '_formResponse',
    'iron-form-error': '_formError',
    'iron-form-invalid': '_formInvalid',
    'file-upload-starting': '_fileUploadStarting',
    'file-upload-complete': '_fileUploadComplete'
  },

  open: function() {
    this.set("opened", false);
    this.async(function () {
      this.set("opened", true);
      this.async(function () {
        this.$$("#editDialog").open();
      });
    });
  },

  close: function() {
    this.set("opened", false);
    this.$$("#editDialog").close();
  },

  _formSubmitted: function(event) {
  },

  ready: function() {
    this.baseAction = this.action;
  },

  _formResponse: function(response, detail) {
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
  },

  _formError: function(event, detail) {
    this._setSubmitDisabledStatus(false);
    console.log("Form error: ", detail.error);
    this._showErrorDialog(detail.error);
    this.$$("#spinner").active = false;
  },

  _formInvalid: function(event) {
    this._setSubmitDisabledStatus(false);
    this.$$("#spinner").active = false;
  },

  _submit: function () {
    if (this.confirmationText) {
      dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
        dialog.open(this.confirmationText, this._reallySubmit.bind(this));
      }.bind(this));
    } else {
      this._reallySubmit();
    }
  },

  _setSubmitDisabledStatus: function(status) {
    var submit1 = this.$$("#submit1");
    var submit2 = this.$$("#submit2");
    if (submit1)
      submit1.disabled = status;

    if (submit2)
      submit2.disabled = status;
  },

  _reallySubmit: function() {
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
      var error = this.t('form.invalid');
      this._showErrorDialog(error);
    }
  },

  submitForce: function() {
    this.$$("#spinner").active = true;
    this.$$("#form").submit();
  },

  getForm: function() {
    return this.$$("#form");
  },

  stopSpinner: function() {
    this.$$("#spinner").active = false;
  },

  validate: function() {
    return this.$$("#form").validate();
  },

  _showErrorDialog: function(errorText) {
    this.set('errorText', errorText);
    this.$$("#formErrorDialog").open();
  },

  _clearErrorText: function(event) {
    this.$$("#formErrorDialog").close();
    this.set('errorText', null);
  }
})
