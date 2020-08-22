import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/neon-animatable.js';
import '@polymer/neon-animation/neon-animation.js';
import '../yp-file-upload/yp-file-upload.js';
import '../yp-ajax/yp-ajax.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import '../ac-notifications/ac-notification-settings.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpUserEditLit extends YpBaseElement {
  static get properties() {
    return {
      action: {
        type: String,
        value: "/api/users"
      },

      user: {
        type: Object,
        observer: '_userChanged'
      },

      params: {
        type: String
      },

      method: {
        type: String
      },

      selected: {
        type: Number,
        value: 0
      },

      encodedUserNotificationSettings: {
        type: String,
        observer: '_encodedUserNotificationSettingsChanged'
      },

      uploadedProfileImageId: {
        type: String
      },

      uploadedHeaderImageId: {
        type: String
      },

      notificationSettings: {
        type: Object,
        notify: true,
        observer: '_notificationSettingsChanged'
      }
    }
  }

  static get styles() {
    return[
      css`

      .container {
        height: 100%;
        min-height: 350px;
      }

      .additionalSettings {
        margin-top: 16px;
      }

      .icon {
        padding-right: 8px;
      }

      h2 {
        padding-top: 16px;
      }

      #deleteUser {
        max-width: 250px;
        margin-top: 16px;
        color: #F00;
      }

      .disconnectButtons {
        margin-top: 8px;
        max-width: 250px;
      }

      yp-language-selector {
        margin-bottom: 8px;
      }

      mwc-button {
        text-align: center;
      }

      .ssn {
        margin-top: 0;
        margin-bottom: 4px;
        font-weight: 400;
      }
    `, YpFlexLayout];
  }

  render() {
    return html`
    <yp-edit-dialog .name="userEdit" id="editDialog" .title="${this.editHeaderText}" double-width="" .icon="face" .action="${this.action}" @iron-form-response="${this._editResponse}" method="${this.method}" .params="${this.params}" .saveText="${this.saveText}" .toastText="${this.toastText}">
      <div class="container">
        <div class="layout vertical wrap container">
          <paper-input id="name" .name="name" .type="text" .label="${this.t('Name')}" .value="${this.user.name}" maxlength="50" char-counter>
          </paper-input>

          <div class="ssn" ?hidden="${!this.user.ssn}">${this.t('ssn')}: ${this.user.ssn}</div>

          <paper-input id="email" name="email" type="text" .label="${this.t('Email')}" .value="${this.user.email}">
          </paper-input>

          <div class="layout horizontal wrap">
            <div class="layout vertical additionalSettings">
              <yp-file-upload id="profileImageUpload" raised .target="/api/images?itemType=user-profile" method="POST" @success="${this._profileImageUploaded}">
                <iron-icon class="icon" .icon="photo-camera"></iron-icon>
                <span>${this.t('image.profile.upload')}</span>
              </yp-file-upload>
            </div>

            <div class="layout vertical additionalSettings" hidden="">
              <yp-file-upload id="headerImageUpload" raised .target="/api/images?itemType=user-header" method="POST" @success="${this._headerImageUploaded}">
                <iron-icon class="icon" .icon="photo-camera"></iron-icon>
                <span>${this.t('image.header.upload')}</span>
              </yp-file-upload>
            </div>
          </div>

          <yp-language-selector .name="defaultLocale" auto-translate-option-disabled="" .selectedLocale="${this.user.default_locale}"></yp-language-selector>

          <mwc-button ?hidden="${!this.user.facebook_id}" class="disconnectButtons" raised @click="${this._disconnectFromFacebookLogin}">${this.t('disconnectFromFacebookLogin')}</mwc-button>

          <mwc-button ?hidden="${!this.user.ssn}" raised class="disconnectButtons" @click="${this._disconnectFromSamlLogin}">${this.t('disconnectFromSamlLogin')}</mwc-button>

          <mwc-button id="deleteUser" raised @click="${this._deleteOrAnonymizeUser}">${this.t('deleteOrAnonymizeUser')}</mwc-button>

          <input .type="hidden" .name="uploadedProfileImageId" .value="${this.uploadedProfileImageId}">
          <input .type="hidden" .name="uploadedHeaderImageId" .value="${this.uploadedHeaderImageId}">

          <h2>${this.t('user.notifications')}</h2>

          <ac-notification-settings notifications-settings="${this.notificationSettings}"></ac-notification-settings>
          <input .type="hidden" .name="notifications_settings" .value="${this.encodedUserNotificationSettings}">

          <yp-ajax id="disconnectFacebookLoginAjax" method="DELETE" url="/api/users/disconnectFacebookLogin" @response="${this._disconnectFacebookLoginResponse}"></yp-ajax>
          <yp-ajax id="disconnectSamlLoginAjax" method="DELETE" url="/api/users/disconnectSamlLogin" @response="${this._disconnectSamlLoginResponse}"></yp-ajax>
        </div>
      </div>
    </yp-edit-dialog>
`
  }


/*
  behaviors: [
    ypEditDialogBehavior
  ],
*/
 
  connectedCallback() {
    super.connectedCallback();
    this.addListener(yp-notifications-changed, _setNotificationSettings);
   }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener('yp-notifications-changed', _setNotificationSettings);
  }


  _editResponse(event, detail) {
    if (detail.response.duplicateEmail) {
      dom(document).querySelector('yp-app').getDialogAsync("errorDialog", function (dialog) {
        dialog.showErrorDialog(this.t('emailAlreadyRegisterred'));
      }.bind(this))
    }
  }

  _checkIfValidEmail() {
    return this.user && this.user.email && !(this.user.email.indexOf("@citizens.is")>-1 && this.user.email.indexOf("anonymous")>-1)
  }

  _disconnectFromFacebookLogin() {
    if (this._checkIfValidEmail()) {
      dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
        dialog.open(this.t('areYouSureYouWantToDisconnectFacebookLogin'), this._reallyDisconnectFromFacebookLogin.bind(this), true);
      }.bind(this));
    } else {
      dom(document).querySelector('yp-app').getDialogAsync("errorDialog", function (dialog) {
        dialog.showErrorDialog(this.t('cantDisconnectFromFacebookWithoutValidEmail'));
      }.bind(this));
    }
  }

  _reallyDisconnectFromFacebookLogin() {
    this.$$("#disconnectFacebookLoginAjax").body = {};
    this.$$("#disconnectFacebookLoginAjax").generateRequest();
  }

  _disconnectFromSamlLogin() {
    if (this._checkIfValidEmail()) {
      dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
        dialog.open(this.t('areYouSureYouWantToDisconnectSamlLogin'), this._reallyDisconnectFromSamlLogin.bind(this), true);
      }.bind(this));
    } else {
      dom(document).querySelector('yp-app').getDialogAsync("errorDialog", function (dialog) {
        dialog.showErrorDialog(this.t('cantDisconnectFromSamlWithoutValidEmail'));
      }.bind(this));
    }
  }

  _reallyDisconnectFromSamlLogin() {
    this.$$("#disconnectSamlLoginAjax").body = {};
    this.$$("#disconnectSamlLoginAjax").generateRequest();
  }

  _disconnectFacebookLoginResponse() {
    this.user.facebook_id = null;
    window.appGlobals.notifyUserViaToast(this.t('disconnectedFacebookLoginFor')+' '+ this.user.email);
  }

  _disconnectSamlLoginResponse() {
    this.user.ssn = null;
    window.appGlobals.notifyUserViaToast(this.t('disconnectedSamlLoginFor')+' '+ this.user.email);
  }

  _setNotificationSettings(event, detail) {
    this.notificationSettings = detail;
    this.encodedUserNotificationSettings = this._encodeNotificationsSettings(this.notificationSettings);
  }

  _notificationSettingsChanged(value) {
    this.encodedUserNotificationSettings = this._encodeNotificationsSettings(this.notificationSettings);
  }

  _encodedUserNotificationSettingsChanged(value) {
  }

  _encodeNotificationsSettings(settings) {
    return JSON.stringify(settings);
  }

  _userChanged(newValue) {
    this.notificationSettings = newValue.notifications_settings;
  }

  _profileImageUploaded(event, detail) {
    const image = JSON.parse(detail.xhr.response);
    this.uploadedProfileImageId = image.id;
  }

  _headerImageUploaded(event, detail) {
    const image = JSON.parse(detail.xhr.response);
    this.uploadedHeaderImageId = image.id;
  }

  _customRedirect(userId) {
    window.appUser.checkLogin();
  }

  _clear() {
    this.user = { name: '', email: '', access: 2 } ;
    this.uploadedProfileImageId = null;
    this.uploadedHeaderImageId = null;
    this.$$("#headerImageUpload").clear();
    this.$$("#profileImageUpload").clear();
  }

  setup(user, newNotEdit, refreshFunction, openNotificationTab) {
    this.user = user;
    this.new = newNotEdit;
    this.refreshFunction = refreshFunction;
    if (openNotificationTab) {
      this.selected = 1;
    }
    this._setupTranslation();
  }

  _setupTranslation() {
    if (this.new) {
      this.editHeaderText = this.t('user.new');
      this.toastText = this.t('userToastCreated');
      this.saveText = this.t('create');
    } else {
      this.saveText = this.t('save');
      this.editHeaderText = this.t('user.edit');
      this.toastText = this.t('userToastUpdated');
    }
  }

  _deleteOrAnonymizeUser() {
    dom(document).querySelector('yp-app').getDialogAsync("userDeleteOrAnonymize", function (dialog) {
      dialog.open();
    }.bind(this));
  }
}

window.customElements.define('yp-user-edit-lit', YpUserEditLit)
