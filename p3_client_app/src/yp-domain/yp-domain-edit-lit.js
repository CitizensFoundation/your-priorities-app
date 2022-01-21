import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '../yp-file-upload/yp-file-upload.js';
import '../yp-behaviors/emoji-selector.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import '../yp-theme/yp-theme-selector.js';
import '../yp-app-globals/yp-language-selector.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpDomainEditLit extends YpBaseElement {
  static get properties() {
    return {
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

      appHomeScreenIconImageId: String,

      hasVideoUpload: {
        type: Boolean,
        value: false
      },

      uploadedVideoId: {
        type: Number,
        value: null
      }
    }
  }

  static get styles() {
    return[
      css`

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

      .uploadSection {
        max-width: 300px;
        margin: 8px;
      }

      .useVideoCover {
        margin-left: 4px;
        margin-top: 4px;
      }

      #google_analytics_code {
        margin-top: 4px;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    ${this.domain ? html`
    <yp-edit-dialog .name="domainEdit" ?doubleWidthId="editDialog" .title="${this.editHeaderText}" .icon="cloud-queue" .action="${this.action}" .method="${this.method}" .params="${this.params}" .saveText="${this.saveText}" .toastText="${this.toastText}">
      <div>
        <paper-input id="name" .name="name" .type="text" .label="${this.t('Name')}" .value="${this.domain.name}" .maxlength="20" char-counter class="mainInput">
        </paper-input>

        <paper-textarea id="description" .name="description" .value="${this.domain.description}" ?alwaysFloatLabel="${this.domain.description}" .label="${this.t('Description')}" char-counter .rows="2" .max-rows="5" .maxlength="300" class="mainInput">
        </paper-textarea>

        <div class="horizontal end-justified layout">
          <emoji-selector id="emojiSelectorDescription"></emoji-selector>
        </div>

        <div class="layout vertical">
          <yp-theme-selector .object="${this.domain}" .selectedTheme="${this.themeId}"></yp-theme-selector>
        </div>

        <div class="layout horizontal wrap">
          <div class="layout vertical additionalSettings">
            <yp-file-upload id="logoImageUpload" raised .target="/api/images?itemType=domain-logo" .method="POST" @success="${this._logoImageUploaded}">
              <iron-icon class="icon" .icon="photo-camera"></iron-icon>
              <span> ${this.t('image.logo.upload')} - 864 x 486</span><br>
            </yp-file-upload>
          </div>

          <div class="layout vertical additionalSettings">
            <yp-file-upload id="headerImageUpload" raised target="/api/images?itemType=domain-header" .method="POST" @success="${this._headerImageUploaded}">
              <iron-icon class="icon" .icon="photo-camera"></iron-icon>
              <span> ${this.t('image.header.upload')} - 1920 x 600</span><br>
            </yp-file-upload>
          </div>
        </div>

      ${ this.hasVideoUpload ? html`
        <div class="layout vertical uploadSection">
          <yp-file-upload id="videoFileUpload" raised video-upload="" .method="POST" @success="${this._videoUploaded}">
            <iron-icon class="icon" .icon="videocam"></iron-icon>
              <span>${this.t('uploadVideo')}</span>
            </yp-file-upload>
            <paper-checkbox class="useVideoCover" .name="useVideoCover" ?disabled="${!this.uploadedVideoId}" checked="${this.domain.configuration.useVideoCover}">${this.t('useVideoCover')}</paper-checkbox>
        </div>
      ` : html``}

        <paper-input id="customUserRegistrationText" .name="customUserRegistrationText" .type="text" .label="${this.t('customUserRegistrationText')}" .value="${this.domain.configuration.customUserRegistrationText}" .maxlength="256" char-counter>
        </paper-input>

        <paper-input id="appHomeScreenShortName" .name="appHomeScreenShortName" .type="text" .label="${this.t('appHomeScreenShortName')}" .value="${this.domain.configuration.appHomeScreenShortName}" .maxlength="12" style="width: 200px;">
        </paper-input>

        <div class="layout vertical additionalSettings half">
          <yp-file-upload id="appHomeScreenIconImageUpload" raised target="/api/images?itemType=app-home-screen-icon" .method="POST" @success="${this._appHomeScreenIconImageUploaded}">
            <iron-icon class="icon" .icon="photo-camera"></iron-icon>
            <span>${this.t('appHomeScreenIconImageUpload')}</span>
          </yp-file-upload>
        </div>

        <input .type="hidden" .name="themeId" .value="${this.themeId}">
        <input .type="hidden" .name="uploadedLogoImageId" .value="${this.uploadedLogoImageId}">
        <input .type="hidden" .name="uploadedHeaderImageId" .value="${this.uploadedHeaderImageId}">
        <input .type="hidden" .name="appHomeScreenIconImageId" .value="${this.appHomeScreenIconImageId}">

        <br>

        <yp-language-selector .name="defaultLocale" no-user-events .selectedLocale="${this.domain.default_locale}"></yp-language-selector>

        <paper-checkbox .name="onlyAdminsCanCreateCommunities" checked="${this.domain.only_admins_can_create_communities}">${this.t('domain.onlyAdminsCanCreateCommunities')}</paper-checkbox>

        <paper-input id="google_analytics_code" .name="google_analytics_code" .type="text" .label="${this.t('analyticsTrackerCode')}" .value="${this.domain.google_analytics_code}" .maxlength="40" style="width: 200px;">
        </paper-input>

        <paper-input id="facebookClientId" .name="facebookClientId" .type="text" .label="Facebook Client Id" .value="${this.domain.secret_api_keys.facebook.client_id}" .maxlength="60" char-counter class="mainInput">
        </paper-input>

        <paper-input id="facebookClientSecret" .name="facebookClientSecret" .type="text" .label="Facebook Client Secret" .value="${this.domain.secret_api_keys.facebook.client_secret}" .maxlength="60" char-counter class="mainInput">
        </paper-input>

        <paper-input id="googleClientId" .name="googleClientId" type="text" .label="Google Client Id" .value="${this.domain.secret_api_keys.google.client_id}" .maxlength="60" char-counter="" class="mainInput">
        </paper-input>

        <paper-input id="googleClientSecret" .name="googleClientSecret" .type="text" .label="Google Client Secret" .value="${this.domain.secret_api_keys.google.client_secret}" .maxlength="60" char-counter class="mainInput">
        </paper-input>

        <paper-input id="samlEntryPoint" .name="samlEntryPoint" type="text" .label="SAML EntryPoint" .value="${this.domain.secret_api_keys.saml.entryPoint}" .maxlength="100" char-counter class="mainInput">
        </paper-input>

        <paper-input id="samlIssuer" .name="samlIssuer" type="text" .label="SAML Issuer" .value="${this,domain.secret_api_keys.saml.issuer}" class="mainInput">
        </paper-input>

        <paper-input id="samlIdentifierFormat" .name="samlIdentifierFormat" .type="text" .label="SAML Identifier Format" .value="${this.domain.secret_api_keys.saml.identifierFormat}" class="mainInput">
        </paper-input>

        <paper-input id="samlLoginButtonUrl" .name="samlLoginButtonUrl" .label="${this.t('samlLoginButtonUrl')}" .value="${domain.configuration.samlLoginButtonUrl}">
        </paper-input>

        <paper-input id="customSamlLoginText" .name="customSamlLoginText" .label="${this.t('customSamlLoginText')}" .value="${this.domain.configuration.customSamlLoginText}">
        </paper-input>


        <paper-input id="samlCallbackUrl" .name="samlCallbackUrl" .type="text" .label="SAML CallbackUrl" .value="${this.domain.secret_api_keys.saml.callbackUrl}" .maxlength="100" char-counter class="mainInput">
        </paper-input>

        <paper-textarea id="samlCert" .name="samlCert" value="{{domain.secret_api_keys.saml.cert}}" ?alwaysFloatlabel="${this.domain.secret_api_keys.saml.cert}" .label="SAML Verification Certificate Chain" char-counter .rows="2" .max-rows="5" .maxlength="20000" class="mainInput">
        </paper-textarea>

        <paper-textarea id="customSAMLErrorHTML" .name="customSAMLErrorHTML" .value="${this.domain.configuration.customSAMLErrorHTML}" always-float-label="${this.domain.configuration.customSAMLErrorHTML}" .label="${this.t('customSAMLErrorHTML')}" .rows="2" .max-rows="5" class="mainInput">
        </paper-textarea>

        <paper-checkbox .name="forceSecureSamlEmployeeLogin" checked="${this.domain.configuration.forceSecureSamlEmployeeLogin}">${this.t('forceSecureSamlEmployeeLogin')}
        </paper-checkbox>

        <div class="layout vertical">
          <paper-checkbox .name="downloadFacebookImagesForUser" checked="${this.domain.configuration.downloadFacebookImagesForUser}">${this.t('downloadFacebookImagesForUser')}</paper-checkbox>
          <paper-checkbox .name="disableNameAutoTranslation" checked="${this.domain.configuration.disableNameAutoTranslation}}">${this.t('disableNameAutoTranslation')}</paper-checkbox>
          <paper-checkbox .name="hideDomainNews" checked="${this.domain.configuration.hideDomainNews}">${this.t('hideDomainNews')}</paper-checkbox>
        </div>
      </div>
    </yp-edit-dialog>
` : html``}
`
  }

/*
  behaviors: [
    ypEditDialogBehavior,
    ypGotoBehavior
  ],

  observers: [
    '_setupTranslation(language,t)'
  ],
*/

  _videoUploaded(event, detail) {
    this.uploadedVideoId = detail.videoId;
    this.domain.configuration.useVideoCover = true;
  }

  _appHomeScreenIconImageUploaded(event, detail) {
    const image = JSON.parse(detail.xhr.response);
    this.appHomeScreenIconImageId = image.id;
  }

  _updateEmojiBindings() {
    this.async(function () {
      const description = this.$$("#description");
      const emojiSelector = this.$$("#emojiSelectorDescription");
      if (description && emojiSelector) {
        emojiSelector.inputTarget = description;
      } else {
        console.warn("Domain edit: Can't bind emojis :(");
      }
    }.bind(this), 500);
  }

  _domainChanged(domain) {
    this._updateEmojiBindings();
    if (window.appGlobals.hasVideoUpload) {
      this.hasVideoUpload = true;
    } else {
      this.hasVideoUpload = false;
    }
  }

  _customRedirect(domain) {
    if (domain) {
      if (this.uploadedVideoId) {
        const ajax = document.createElement('iron-ajax');
        ajax.handleAs = 'json';
        ajax.contentType = 'application/json';
        ajax.url = '/api/videos/'+domain.id+'/completeAndAddToDomain';
        ajax.method = 'PUT';
        ajax.body = {
          videoId: this.uploadedVideoId
        };
        ajax.addEventListener('response', function (event) {
          this._finishRedirect(domain);
        }.bind(this));
        ajax.generateRequest();
      } else {
        this._finishRedirect(domain);
      }
    } else {
      console.warn('No group found on custom redirect');
    }
  }

  _finishRedirect(domain) {
    this.redirectTo("/domain/"+domain.id);
    window.appGlobals.activity('completed', 'editDomain');
  }

  _clear() {
    this.domain = null;
    this.uploadedLogoImageId = null;
    this.uploadedHeaderImageId = null;
    this.appHomeScreenIconImageId = null;
    this.$$("#headerImageUpload").clear();
    this.$$("#logoImageUpload").clear();
    if (this.$$("#videoFileUpload"))
      this.$$("#videoFileUpload").clear();

  }

  setup(domain, newNotEdit, refreshFunction) {
    this.domain = domain;
    this.new = newNotEdit;
    this.refreshFunction = refreshFunction;
    this._setupTranslation();
    if (domain && domain.DomainLogoVideos && domain.DomainLogoVideos.length>0) {
      this.uploadedVideoId = domain.DomainLogoVideos[0].id
    }
  }

  _setupTranslation() {
    if (this.new) {
      this.editHeaderText = this.t('domain.new');
      this.toastText = this.t('domainToastCreated');
      this.saveText = this.t('create');
    } else {
      this.saveText = this.t('save');
      this.editHeaderText = this.t('domain.edit');
      this.toastText = this.t('domainToastUpdated');
    }
  }
}

window.customElements.define('yp-domain-edit-lit', YpDomainEditLit)
