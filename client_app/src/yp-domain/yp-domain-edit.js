import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-input/paper-input.js';
import '../../../../@polymer/paper-checkbox/paper-checkbox.js';
import '../../../../@polymer/paper-input/paper-textarea.js';
import '../../../../@polymer/paper-tabs/paper-tab.js';
import '../../../../@polymer/paper-tabs/paper-tabs.js';
import '../../../../@polymer/neon-animation/neon-animated-pages.js';
import '../yp-file-upload/yp-file-upload.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-behaviors/emoji-selector.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import '../yp-theme/yp-theme-selector.js';
import '../yp-app-globals/yp-language-selector.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';

Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      .additionalSettings {
        padding-top: 8px;
        margin-top: 8px;
      }

      yp-theme-selector {
        padding-top: 8px;
        margin-bottom: 8px;
      }

      .imageSizeInfo {
        font-size: 13px;
      }

      .sectionMargin {
        margin-top: 8px;
      }

      .container {
        width: 100%;
        height: 100%;
      }

      yp-language-selector {
        margin-top: 8px;
      }

      paper-checkbox {
        margin-top: 4px;
      }
    </style>

    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <yp-edit-dialog name="domainEdit" double-width="" id="editDialog" title="[[editHeaderText]]" icon="cloud-queue" action="[[action]]" method="[[method]]" params="[[params]]" save-text="[[saveText]]" toast-text="[[toastText]]">
      <div>
        <paper-input id="name" name="name" type="text" label="[[t('Name')]]" value="{{domain.name}}" maxlength="20" char-counter="" class="mainInput">
        </paper-input>

        <paper-textarea id="description" name="description" value="{{domain.description}}" always-float-label="[[domain.description]]" label="[[t('Description')]]" char-counter="" rows="2" max-rows="5" maxlength="300" class="mainInput">
        </paper-textarea>

        <div class="horizontal end-justified layout">
          <emoji-selector id="emojiSelectorDescription"></emoji-selector>
        </div>

        <div class="layout vertical">
          <yp-theme-selector object="[[domain]]" selected-theme="{{themeId}}"></yp-theme-selector>
        </div>

        <div class="layout vertical additionalSettings">
          <yp-file-upload id="logoImageUpload" raised="true" multi="false" target="/api/images?itemType=domain-logo" method="POST" on-success="_logoImageUploaded">
            <iron-icon class="icon" icon="photo-camera"></iron-icon>
            <span> [[t('image.logo.upload')]] - 864 x 486</span><br>
          </yp-file-upload>
        </div>

        <div class="layout vertical additionalSettings">
          <yp-file-upload id="headerImageUpload" raised="true" multi="false" target="/api/images?itemType=domain-header" method="POST" on-success="_headerImageUploaded">
            <iron-icon class="icon" icon="photo-camera"></iron-icon>
            <span> [[t('image.header.upload')]] - 1920 x 600</span><br>
          </yp-file-upload>
        </div>

        <paper-input id="customUserRegistrationText" name="customUserRegistrationText" type="text" label="[[t('customUserRegistrationText')]]" value="{{domain.configuration.customUserRegistrationText}}" maxlength="256" char-counter="">
        </paper-input>

        <paper-input id="appHomeScreenShortName" name="appHomeScreenShortName" type="text" label="[[t('appHomeScreenShortName')]]" value="{{domain.configuration.appHomeScreenShortName}}" maxlength="12" style="width: 200px;">
        </paper-input>

        <div class="layout vertical additionalSettings half">
          <yp-file-upload id="appHomeScreenIconImageUpload" raised="true" multi="false" target="/api/images?itemType=app-home-screen-icon" method="POST" on-success="_appHomeScreenIconImageUploaded">
            <iron-icon class="icon" icon="photo-camera"></iron-icon>
            <span>[[t('appHomeScreenIconImageUpload')]]</span>
          </yp-file-upload>
        </div>

        <input type="hidden" name="themeId" value="[[themeId]]">
        <input type="hidden" name="uploadedLogoImageId" value="[[uploadedLogoImageId]]">
        <input type="hidden" name="uploadedHeaderImageId" value="[[uploadedHeaderImageId]]">
        <input type="hidden" name="appHomeScreenIconImageId" value="[[appHomeScreenIconImageId]]">

        <br>

        <yp-language-selector name="defaultLocale" no-user-events="" selected-locale="{{domain.default_locale}}"></yp-language-selector>

        <paper-checkbox name="onlyAdminsCanCreateCommunities" checked\$="{{domain.only_admins_can_create_communities}}">[[t('domain.onlyAdminsCanCreateCommunities')]]</paper-checkbox>

        <paper-input id="facebookClientId" name="facebookClientId" type="text" label="Facebook Client Id" value="{{domain.secret_api_keys.facebook.client_id}}" maxlength="60" char-counter="" class="mainInput">
        </paper-input>

        <paper-input id="facebookClientSecret" name="facebookClientSecret" type="text" label="Facebook Client Secret" value="{{domain.secret_api_keys.facebook.client_secret}}" maxlength="60" char-counter="" class="mainInput">
        </paper-input>

        <paper-input id="googleClientId" name="googleClientId" type="text" label="Google Client Id" value="{{domain.secret_api_keys.google.client_id}}" maxlength="60" char-counter="" class="mainInput">
        </paper-input>

        <paper-input id="googleClientSecret" name="googleClientSecret" type="text" label="Google Client Secret" value="{{domain.secret_api_keys.google.client_secret}}" maxlength="60" char-counter="" class="mainInput">
        </paper-input>

        <paper-input id="samlEntryPoint" name="samlEntryPoint" type="text" label="SAML EntryPoint" value="{{domain.secret_api_keys.saml.entryPoint}}" maxlength="100" char-counter="" class="mainInput">
        </paper-input>

        <paper-input id="samlCallbackUrl" name="samlCallbackUrl" type="text" label="SAML CallbackUrl" value="{{domain.secret_api_keys.saml.callbackUrl}}" maxlength="100" char-counter="" class="mainInput">
        </paper-input>

        <paper-textarea id="samlCert" name="samlCert" value="{{domain.secret_api_keys.saml.cert}}" always-float-label="[[domain.secret_api_keys.saml.cert]]" label="SAML Verification Certificate Chain" char-counter="" rows="2" max-rows="5" maxlength="20000" class="mainInput">
        </paper-textarea>
        <div class="layout vertical">
          <paper-checkbox name="downloadFacebookImagesForUser" checked\$="{{domain.configuration.downloadFacebookImagesForUser}}">[[t('downloadFacebookImagesForUser')]]</paper-checkbox>
          <paper-checkbox name="disableNameAutoTranslation" checked\$="{{domain.configuration.disableNameAutoTranslation}}">[[t('disableNameAutoTranslation')]]</paper-checkbox>
        </div>
      </div>
    </yp-edit-dialog>
`,

  is: 'yp-domain-edit',

  behaviors: [
    ypLanguageBehavior,
    ypEditDialogBehavior,
    ypGotoBehavior
  ],

  properties: {
    action: {
      type: String,
      value: "/api/domains"
    },

    domain: {
      type: Object,
      observer: '_domainChanged',
      notify: true
    },

    params: {
      type: String
    },

    selected: {
      type: Number,
      value: 0
    },

    method: {
      type: String
    },

    uploadedLogoImageId: {
      type: String
    },

    uploadedHeaderImageId: {
      type: String
    },

    themeId: {
      type: String,
      value: null
    },

    status: {
      type: String
    },

    appHomeScreenIconImageId: String
  },

  observers: [
    '_setupTranslation(language,t)'
  ],

  _appHomeScreenIconImageUploaded: function (event, detail) {
    var image = JSON.parse(detail.xhr.response);
    this.set('appHomeScreenIconImageId', image.id);
  },

  _updateEmojiBindings: function () {
    this.async(function () {
      var description = this.$$("#description");
      var emojiSelector = this.$$("#emojiSelectorDescription");
      if (description && emojiSelector) {
        emojiSelector.inputTarget = description;
      } else {
        console.warn("Domain edit: Can't bind emojis :(");
      }
    }.bind(this), 500);
  },

  _domainChanged: function (domain) {
    this._updateEmojiBindings();
  },

  _customRedirect: function (domain) {
    if (this.new) {
      this.redirectTo("/domain/"+domain.id);
    }
  },

  _clear: function () {
    this.set('domain', { name: '', description: '' });
    this.set('uploadedLogoImageId', null);
    this.set('uploadedHeaderImageId', null);
    this.set('appHomeScreenIconImageId', null);
    this.$.headerImageUpload.clear();
    this.$.logoImageUpload.clear();
  },

  setup: function (domain, newNotEdit, refreshFunction) {
    this.set('domain', domain);
    this.set('new', newNotEdit);
    this.set('refreshFunction', refreshFunction);
    this._setupTranslation();
  },

  _setupTranslation: function () {
    if (this.new) {
      this.editHeaderText = this.t('domain.new');
      this.toastText = this.t('domainToastCreated');
      this.set('saveText', this.t('create'));
    } else {
      this.set('saveText', this.t('save'));
      this.editHeaderText = this.t('domain.edit');
      this.toastText = this.t('domainToastUpdated');
    }
  }
});
