import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-input/paper-input.js';
import '../../../../@polymer/paper-radio-button/paper-radio-button.js';
import '../../../../@polymer/paper-radio-group/paper-radio-group.js';
import '../../../../@polymer/paper-checkbox/paper-checkbox.js';
import '../yp-file-upload/yp-file-upload.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypCollectionStatusOptions } from '../yp-behaviors/yp-collection-status-options.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import '../yp-app-globals/yp-language-selector.js';
import '../yp-theme/yp-theme-selector.js';
import '../yp-behaviors/emoji-selector.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';

Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      .access {
        @apply --layout-horizontal;
        @apply --layout-center-justified;
      }

      .accessHeader {
        color: var(--primary-color,#777);
        font-weight: normal;
        margin-bottom: 0px;
      }

      paper-radio-button {
        display: block;
      }

      .additionalSettings {
        padding-top: 16px;
      }

      .half {
        width: 50%;
      }

      .hostnameInfo {
        color: #888;
      }

      .config {
        margin-top: 16px;
      }

      paper-checkbox {
        margin-bottom: 4px;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <yp-edit-dialog name="communityEdit" id="editDialog" title="[[editHeaderText]]" icon="group-work" action="[[action]]" method="[[method]]" params="[[params]]" save-text="[[saveText]]" toast-text="[[toastText]]">
      <div class="layout vertical">
        <paper-input id="name" name="name" type="text" label="[[t('name')]]" value="{{community.name}}" maxlength="60" minlength="1" required="" char-counter="" class="mainInput">
        </paper-input>

        <paper-input id="hostname" name="hostname" type="text" allowed-pattern="[a-z0-9-]" label="[[t('community.hostname')]]" value="{{community.hostname}}" maxlength="80" minlength="1" required="" char-counter="" class="mainInput">
        </paper-input>
        <div class="hostnameInfo">
          https://[[hostnameExample]]
        </div>

        <paper-textarea id="description" name="description" value="{{community.description}}" always-float-label="[[community.description]]" label="[[t('description')]]" char-counter="" rows="2" max-rows="5" minlength="1" required="" maxlength="300" class="mainInput">
        </paper-textarea>

        <div class="horizontal end-justified layout">
          <emoji-selector id="emojiSelectorDescription"></emoji-selector>
        </div>

      </div>

      <div class="layout horizontal">
        <div class="layout vertical additionalSettings half">
          <yp-file-upload id="logoImageUpload" raised="true" multi="false" target="/api/images?itemType=community-logo" method="POST" on-success="_logoImageUploaded">
            <iron-icon class="icon" icon="photo-camera"></iron-icon>
            <span>[[t('image.logo.upload')]]</span>
          </yp-file-upload>
        </div>

        <div class="layout vertical additionalSettings half">
          <yp-file-upload id="headerImageUpload" raised="true" multi="false" target="/api/images?itemType=community-header" method="POST" on-success="_headerImageUploaded">
            <iron-icon class="icon" icon="photo-camera"></iron-icon>
            <span>[[t('image.header.upload')]]</span>
          </yp-file-upload>
        </div>
      </div>

      <yp-theme-selector object="[[community]]" selected-theme="{{themeId}}"></yp-theme-selector>

      <div class="layout vertical config">
        <paper-checkbox name="onlyAdminsCanCreateGroups" checked\$="{{community.only_admins_can_create_groups}}">[[t('community.onlyAdminsCanCreateGroups')]]</paper-checkbox>
        <paper-checkbox name="alternativeHeader" checked\$="{{community.configuration.alternativeHeader}}">[[t('community.alternativeHeader')]]</paper-checkbox>
        <paper-checkbox name="disableDomainUpLink" checked\$="{{community.configuration.disableDomainUpLink}}">[[t('disableCommunityDomainUpLink')]]</paper-checkbox>
        <paper-checkbox name="disableNameAutoTranslation" checked\$="{{community.configuration.disableNameAutoTranslation}}">[[t('disableNameAutoTranslation')]]</paper-checkbox>
      </div>

      <input type="hidden" name="themeId" value="[[themeId]]">

      <input type="hidden" name="uploadedLogoImageId" value="[[uploadedLogoImageId]]">
      <input type="hidden" name="uploadedHeaderImageId" value="[[uploadedHeaderImageId]]">
      <input type="hidden" name="appHomeScreenIconImageId" value="[[appHomeScreenIconImageId]]">

      <div class="layout horizontal config">
        <paper-dropdown-menu label="[[t('status.select')]]">
          <paper-listbox slot="dropdown-content" attr-for-selected="name" selected="{{status}}">
            <template is="dom-repeat" items="[[collectionStatusOptions]]" as="statusOption">
              <paper-item name="[[statusOption.name]]">[[statusOption.translatedName]]</paper-item>
            </template>
          </paper-listbox>
        </paper-dropdown-menu>
        <input type="hidden" name="status" value="[[status]]">
      </div>

      <yp-language-selector name="defaultLocale" no-user-events="" selected-locale="{{community.default_locale}}"></yp-language-selector>

      <paper-input id="google_analytics_code" name="google_analytics_code" type="text" label="[[t('analyticsTrackerCode')]]" value="{{community.google_analytics_code}}" maxlength="40" style="width: 200px;">
      </paper-input>

      <paper-input id="facebookPixelId" name="facebookPixelId" type="text" label="[[t('facebookPixelId')]]" value="{{community.configuration.facebookPixelId}}" maxlength="40" style="width: 200px;">
      </paper-input>

      <paper-input id="defaultLocationLongLat" name="defaultLocationLongLat" type="text" label="[[t('defaultLocationLongLat')]]" value="{{community.defaultLocationLongLat}}" maxlength="100" style="width: 300px;">
      </paper-input>

      <h3 class="accessHeader">[[t('access')]]</h3>
      <paper-radio-group id="access" name="access" class="access" selected="{{communityAccess}}">
        <paper-radio-button name="public">[[t('public')]]</paper-radio-button>
        <paper-radio-button name="closed">[[t('closed')]]</paper-radio-button>
        <paper-radio-button name="secret">[[t('secret')]]</paper-radio-button>
      </paper-radio-group>

      <paper-textarea id="welcomeHTML" name="welcomeHTML" value="{{community.configuration.welcomeHTML}}" always-float-label="[[community.configuration.welcomeHTML]]" label="[[t('welcomeHTML')]]" rows="2" max-rows="5" minlength="1" class="mainInput">
      </paper-textarea>

      <paper-input id="appHomeScreenShortName" name="appHomeScreenShortName" type="text" label="[[t('appHomeScreenShortName')]]" value="{{community.configuration.appHomeScreenShortName}}" maxlength="12" style="width: 200px;">
      </paper-input>

      <div class="layout vertical additionalSettings half">
        <yp-file-upload id="appHomeScreenIconImageUpload" raised="true" multi="false" target="/api/images?itemType=app-home-screen-icon" method="POST" on-success="_appHomeScreenIconImageUploaded">
          <iron-icon class="icon" icon="photo-camera"></iron-icon>
          <span>[[t('appHomeScreenIconImageUpload')]] (512x512)</span>
        </yp-file-upload>
      </div>

    </yp-edit-dialog>
`,

  is: 'yp-community-edit',

  behaviors: [
    ypLanguageBehavior,
    ypEditDialogBehavior,
    ypCollectionStatusOptions,
    ypGotoBehavior
  ],

  properties: {

    action: {
      type: String,
      value: "/api/communities"
    },

    community: {
      type: Object,
      observer: "_communityChanged"
    },

    hostnameExample: {
      type: String,
      computed: '_getExampleHostname(community.hostname)'
    },

    communityAccess: {
      type: String,
      value: "public"
    },

    params: {
      type: String
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

    uploadedAppIconImageId: {
      type: String
    },

    status: String,

    themeId: {
      type: String,
      value: null
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
        console.warn("Community edit: Can't bind emojis :(");
      }
    }.bind(this), 500);
  },

  _getExampleHostname: function (hostname) {
    if (hostname) {
      return hostname + '.' + window.appGlobals.domain.domain_name;
      return hostname + '.' + window.appGlobals.domain.domain_name;
    } else {
      return 'your-hostname.' + window.appGlobals.domain.domain_name;
    }
  },

  _customRedirect: function (community) {
    if (community && community.hostnameTaken) {
      dom(document).querySelector('yp-app').getDialogAsync("errorDialog", function (dialog) {
        dialog.showErrorDialog(this.t('hostnameTaken'));
      }.bind(this));
    } else {
      if (community) {
        window.appUser.recheckAdminRights();
        this.redirectTo("/community/"+community.id);
      } else {
        console.warn('No community found on custom redirect');
      }
    }
  },

  _communityChanged: function (newValue, oldValue) {
    if (newValue) {
      if (this.community.access===0) {
        this.communityAccess = "public"
      } else if (this.community.access===1) {
        this.communityAccess = "closed"
      } else if (this.community.access===2) {
        this.communityAccess = "secret"
      }
      if (this.community.status) {
        this.set('status', this.community.status);
      }
    }

    this._updateEmojiBindings();
  },

  _clear: function () {
    this.set('community', { name: '', description: '', access: 0 });
    this.set('uploadedLogoImageId', null);
    this.set('uploadedHeaderImageId', null);
    this.set('appHomeScreenIconImageId', null);
    this.$.headerImageUpload.clear();
    this.$.logoImageUpload.clear();
    this.$.appHomeScreenIconImageUpload.clear();
  },

  setup: function (community, newNotEdit, refreshFunction) {
    if (!community) {
      this.set('community', { name: '', description: '', access: 0, status: 'active' });
    } else {
      this.set('community', community);
    }
    this.set('new', newNotEdit);
    this.set('refreshFunction', refreshFunction);
    this._setupTranslation();
  },

  _setupTranslation: function () {
    if (this.t) {
      if (this.new) {
        this.set('editHeaderText', this.t('community.new'));
        this.set('toastText', this.t('communityToastCreated'));
        this.set('saveText', this.t('create'));
      } else {
        this.set('saveText', this.t('save'));
        this.set('editHeaderText', this.t('Update community info'));
        this.set('toastText', this.t('communityToastUpdated'));
      }
    }
  }
});
