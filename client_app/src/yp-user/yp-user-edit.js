import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-input/paper-input.js';
import '../../../../@polymer/paper-tabs/paper-tab.js';
import '../../../../@polymer/paper-tabs/paper-tabs.js';
import '../../../../@polymer/neon-animation/neon-animated-pages.js';
import '../../../../@polymer/neon-animation/neon-animatable.js';
import '../../../../@polymer/neon-animation/neon-animation.js';
import '../yp-file-upload/yp-file-upload.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import '../ac-notifications/ac-notification-settings.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';

Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
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

      #deleteUser {
        margin-top: 16px;
      }

      h2 {
        padding-top: 16px;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <yp-edit-dialog name="userEdit" id="editDialog" title="[[editHeaderText]]" double-width="" icon="face" action="[[action]]" method="[[method]]" params="[[params]]" save-text="[[saveText]]" toast-text="[[toastText]]">
      <div class="container">
        <div class="layout vertical wrap container">
          <paper-input id="name" name="name" type="text" label="[[t('Name')]]" value="{{user.name}}" maxlength="50" char-counter="">
          </paper-input>

          <paper-input id="email" name="email" type="text" label="[[t('Email')]]" value="{{user.email}}">
          </paper-input>

          <div class="layout horizontal wrap">
            <div class="layout vertical additionalSettings">
              <yp-file-upload id="profileImageUpload" raised="true" multi="false" target="/api/images?itemType=user-profile" method="POST" on-success="_profileImageUploaded">
                <iron-icon class="icon" icon="photo-camera"></iron-icon>
                <span>[[t('image.profile.upload')]]</span>
              </yp-file-upload>
            </div>

            <div class="layout vertical additionalSettings" hidden="">
              <yp-file-upload id="headerImageUpload" raised="true" multi="false" target="/api/images?itemType=user-header" method="POST" on-success="_headerImageUploaded">
                <iron-icon class="icon" icon="photo-camera"></iron-icon>
                <span>[[t('image.header.upload')]]</span>
              </yp-file-upload>
            </div>
          </div>

          <yp-language-selector name="defaultLocale" selected-locale="{{user.default_locale}}"></yp-language-selector>

          <paper-button id="deleteUser" raised="" on-tap="_deleteUser">[[t('deleteUser')]]</paper-button>

          <yp-ajax id="deleteUserAjax" on-response="_deleteCompleted" method="DELETE" url="/api/users/delete_current_user"></yp-ajax>

          <input type="hidden" name="uploadedProfileImageId" value="[[uploadedProfileImageId]]">
          <input type="hidden" name="uploadedHeaderImageId" value="[[uploadedHeaderImageId]]">

          <h2>[[t('user.notifications')]]</h2>

          <ac-notification-settings notifications-settings="{{notificationSettings}}"></ac-notification-settings>
          <input type="hidden" name="notifications_settings" value="[[encodedUserNotificationSettings]]">
        </div>
      </div>
    </yp-edit-dialog>
`,

  is: 'yp-user-edit',

  behaviors: [
    ypLanguageBehavior,
    ypEditDialogBehavior
  ],

  properties: {

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
  },

  listeners: {
    'yp-notifications-changed': '_setNotificationSettings'
  },

  _deleteUser: function () {
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('areYouSureYouWantToDeleteUser'), this._deleteUserFinalWarning.bind(this));
    }.bind(this));
  },

  _deleteUserFinalWarning: function () {
    this.async(function () {
      dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
        dialog.open(this.t('areYouReallySureYouWantToDeleteUser'), this._deleteUserForReals.bind(this));
      }.bind(this));
    });
  },

  _deleteUserForReals: function () {
    this.$.deleteUserAjax.body = {};
    this.$.deleteUserAjax.generateRequest();
  },

  _deleteCompleted: function () {
    this._clear();
    this.$$("#editDialog").close();
    this.async(function () {
      window.location.reload();
    }, 100);
  },

  _setNotificationSettings: function (event, detail) {
    this.set('notificationSettings', detail);
    this.set('encodedUserNotificationSettings', this._encodeNotificationsSettings(this.notificationSettings));
  },

  _notificationSettingsChanged: function (value) {
    this.set('encodedUserNotificationSettings', this._encodeNotificationsSettings(this.notificationSettings));
  },

  _encodedUserNotificationSettingsChanged: function (value) {
  },

  _encodeNotificationsSettings: function (settings) {
    return JSON.stringify(settings);
  },

  _userChanged: function (newValue) {
    this.set('notificationSettings', newValue.notifications_settings);
  },

  _profileImageUploaded: function (event, detail) {
    var image = JSON.parse(detail.xhr.response);
    this.set('uploadedProfileImageId', image.id);
  },

  _headerImageUploaded: function (event, detail) {
    var image = JSON.parse(detail.xhr.response);
    this.set('uploadedHeaderImageId', image.id);
  },

  _customRedirect: function (userId) {
    window.appUser.checkLogin();
  },

  _clear: function () {
    this.set('user', { name: '', email: '', access: 2 } );
    this.set('uploadedProfileImageId', null);
    this.set('uploadedHeaderImageId', null);
    this.$.headerImageUpload.clear();
    this.$.profileImageUpload.clear();
  },

  setup: function (user, newNotEdit, refreshFunction, openNotificationTab) {
    this.set('user', user);
    this.set('new', newNotEdit);
    this.set('refreshFunction', refreshFunction);
    if (openNotificationTab) {
      this.set('selected', 1);
    }
    this._setupTranslation();
  },

  _setupTranslation: function () {
    if (this.new) {
      this.editHeaderText = this.t('user.new');
      this.toastText = this.t('userToastCreated');
      this.set('saveText', this.t('create'));
    } else {
      this.set('saveText', this.t('save'));
      this.editHeaderText = this.t('user.edit');
      this.toastText = this.t('userToastUpdated');
    }
  }
});
