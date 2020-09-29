import { LitElement, css, property, html, customElement } from 'lit-element';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { Layouts } from 'lit-flexbox-literals';
import { YpBaseElementWithLogin } from './@yrpri/common/yp-base-element-with-login.js';
import { YpAdminPage } from './yp-admin-page.js';

import './@yrpri/yp-survey/yp-structured-question-edit.js';
import '@material/mwc-tab';
import '@material/mwc-tab-bar';
import { YpAdminConfigBase } from './yp-admin-config-base.js';
import { nothing } from 'lit-html';
import { YpNavHelpers } from './@yrpri/common/YpNavHelpers.js';
import { YpFileUpload } from './@yrpri/yp-file-upload/yp-file-upload.js';
import { YpEmojiSelector } from './@yrpri/common/yp-emoji-selector.js';
import './@yrpri/common/yp-emoji-selector.js';

@customElement('yp-admin-config-domain')
export class YpAdminConfigDomain extends YpAdminConfigBase {
  @property({ type: Number })
  appHomeScreenIconImageId: number | undefined;

  @property({ type: Number })
  uploadedVideoId: number | undefined;

  constructor() {
    super();
  }

  static get styles() {
    return [super.styles, css``];
  }

  renderHeader() {
    return this.collection
      ? html`
          <div class="layout horizontal wrap">
            <div class="layout vertical">
              <mwc-textfield
                id="name"
                name="name"
                type="text"
                .label="${this.t('Name')}"
                .value="${this.collection.name}"
                maxlength="20"
                charCounter
                class="mainInput"
              >
              </mwc-textfield>

              <mwc-textarea
                id="description"
                name="description"
                .value="${this.collection.description!}"
                .label="${this.t('Description')}"
                charCounter
                rows="2"
                max-rows="5"
                maxlength="300"
                class="mainInput"
              >
              </mwc-textarea>
              <div
              class="horizontal end-justified layout pointEmoji"
              <emoji-selector id="emojiSelectorPointFor"></emoji-selector>
            </div>
            </div>
            <div>
              ${this.renderSaveButton()}
            </div>
          </div>

          <input
            type="hidden"
            name="appHomeScreenIconImageId"
            value="${this.appHomeScreenIconImageId?.toString() || ''}"
          />
        `
      : nothing;
  }

  _videoUploaded(event: CustomEvent) {
    this.uploadedVideoId = event.detail.videoId;
    this.collection!.configuration.useVideoCover = true;
    this.requestUpdate();
  }

  _clear() {
    this.collection = undefined;
    this.uploadedLogoImageId = undefined;
    this.uploadedHeaderImageId = undefined;
    this.appHomeScreenIconImageId = undefined;
    (this.$$('#headerImageUpload') as YpFileUpload).clear();
    (this.$$('#logoImageUpload') as YpFileUpload).clear();
    if (this.$$('#videoFileUpload'))
      (this.$$('#videoFileUpload') as YpFileUpload).clear();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('collection') && this.collection) {
      this._setupTranslations();
      this._updateEmojiBindings();

      if (
        (this.collection as YpDomainData).DomainLogoVideos &&
        (this.collection as YpDomainData).DomainLogoVideos!.length > 0
      ) {
        this.uploadedVideoId = (this
          .collection as YpDomainData).DomainLogoVideos![0].id;
      }
    }
  }

  _setupTranslations() {
    if (this.collectionId == 'new') {
      this.editHeaderText = this.t('domain.new');
      this.toastText = this.t('domainToastCreated');
      this.saveText = this.t('create');
    } else {
      this.saveText = this.t('save');
      this.editHeaderText = this.t('domain.edit');
      this.toastText = this.t('domainToastUpdated');
    }
  }

  async _customRedirect(domain: YpDomainData) {
    if (domain) {
      if (this.uploadedVideoId) {
        await window.adminServerApi.addVideoToDomain(domain.id, {
          videoId: this.uploadedVideoId,
        });
        this._finishRedirect(domain);
      } else {
        this._finishRedirect(domain);
      }
    } else {
      console.warn('No domain found on custom redirect');
    }
  }

  _finishRedirect(domain: YpDomainData) {
    YpNavHelpers.redirectTo('/domain/' + domain.id);
    window.appGlobals.activity('completed', 'editDomain');
  }

  setupConfigTabs() {
    const tabs: Array<YpConfigTabData> = [];

    tabs.push({
      name: 'basic',
      icon: 'close',
      items: [
        {
          text: 'defaultLocale',
          type: 'html',
          templateData: html`
            <yp-language-selector
              name="defaultLocale"
              noUserEvents
              .selectedLocale="${this.collection!.default_locale}"
            >
            </yp-language-selector>
          `,
        },
        {
          text: 'theme',
          type: 'html',
          templateData: html` <yp-theme-selector
            .object="${this.collection}"
            .selectedTheme="${this.themeId}"
            @yp-theme-changed="${(event: CustomEvent) => {
              this.themeId = event.detail;
            }}"
          ></yp-theme-selector>`,
        },
        {
          text: 'mediaUploads',
          type: 'html',
          templateData: html`
            <div class="layout horizontal wrap">
              ${this.renderHeaderAndLogoImageUploads()}
              ${this.hasVideoUpload
                ? html`
                    <div class="layout vertical uploadSection">
                      <yp-file-upload
                        id="videoFileUpload"
                        raised
                        videoUpload
                        method="POST"
                        buttonIcon="videocam"
                        .buttonText="${this.t('uploadVideo')}"
                        @success="${this._videoUploaded}"
                      >
                      </yp-file-upload>
                      <paper-checkbox
                        class="useVideoCover"
                        name="useVideoCover"
                        disabled$="[[!uploadedVideoId]]"
                        checked$="{{domain.configuration.useVideoCover}}"
                        >[[t('useVideoCover')]]</paper-checkbox
                      >
                    </div>
                  `
                : nothing}
            </div>
          `,
        },
        {
          text: 'analyticsTrackerCode',
          name: 'google_analytics_code',
          type: 'textfield',
          value: (this.collection as YpDomainData).google_analytics_code
        },
        {
          text: 'onlyAdminsCanCreateCommunities',
          type: 'checkbox',
        },
        {
          text: 'downloadFacebookImagesForUser',
          type: 'checkbox',
        },
        {
          text: 'disableNameAutoTranslation',
          type: 'checkbox',
        },
        {
          text: 'hideDomainNews',
          type: 'checkbox',
        },
      ],
    });

    tabs.push({
      name: 'webApp',
      icon: 'app',
      items: [
        {
          text: 'appHomeScreenShortName',
          type: 'textfield',
          maxLength: 12,
        },
        {
          text: 'appHomeScreenIconImageUpload',
          type: 'html',
          templateData: html`
            <yp-file-upload
              id="appHomeScreenIconImageUpload"
              raised
              target="/api/images?itemType=app-home-screen-icon"
              method="POST"
              buttonIcon="photo_camera"
              .buttonText="${this.t('appHomeScreenIconImageUpload')}"
              @success="${this._appHomeScreenIconImageUploaded}"
            >
            </yp-file-upload>
          `,
        },
      ],
    });

    tabs.push({
      name: 'authApis',
      icon: 'apis',
      items: [
        {
          text: 'Facebook Client Id',
          name: 'facebookClientId',
          type: 'textfield',
          value: this._getSaveCollectionPath('secret_api_keys.facebook.client_id'),
          maxLength: 60
        },
        {
          text: 'Facebook Client Id',
          name: 'facebookClientId',
          type: 'textfield',
          value: this._getSaveCollectionPath('secret_api_keys.facebook.client_secret'),
          maxLength: 60
        },
        {
          text: 'Google Client Id',
          name: 'googleClientId',
          type: 'textfield',
          value: this._getSaveCollectionPath('secret_api_keys.google.client_id'),
          maxLength: 60
        },
        {
          text: 'Google Client Secret',
          name: 'googleClientSecret',
          type: 'textfield',
          value: this._getSaveCollectionPath('secret_api_keys.google.client_secret'),
          maxLength: 60
        }
      ]
    });


    tabs.push({
      name: 'samlAuth',
      icon: 'apis',
      items: [
        {
          text: 'SAML EntryPoint',
          name: 'samlEntryPoint',
          type: 'textfield',
          value: this._getSaveCollectionPath('secret_api_keys.saml.entryPoint'),
          maxLength: 100
        },
        {
          text: 'SAML Issuer',
          name: 'samlIssuer',
          type: 'textfield',
          value: this._getSaveCollectionPath('secret_api_keys.saml.issuer')
        },
        {
          text: 'SAML Identifier Format',
          name: 'samlIdentifierFormat',
          type: 'textfield',
          value: this._getSaveCollectionPath('secret_api_keys.saml.identifierFormat')
        },
        {
          text: 'samlLoginButtonUrl',
          type: 'textfield'
        },
        {
          text: 'customSamlLoginText',
          type: 'textfield'
        },
        {
          text: 'SAML CallbackUrl',
          name: 'samlCallbackUrl',
          type: 'textfield',
          value: this._getSaveCollectionPath('secret_api_keys.saml.callbackUrl'),
          maxLength: 100
        },
        {
          text: 'SAML Verification Certificate Chain',
          name: 'samlCert',
          type: 'textarea',
          value: this._getSaveCollectionPath('secret_api_keys.saml.cert'),
          maxLength: 20000,
          rows: 2,
          maxRows: 5
        },
        {
          text: 'customSAMLErrorHTML',
          type: 'textarea',
          rows: 2,
          maxRows: 5
        },
        {
          text: 'forceSecureSamlEmployeeLogin',
          type: 'checkbox',
        }
      ]
    });


    return tabs;
  }

  _appHomeScreenIconImageUploaded(event: CustomEvent) {
    var image = JSON.parse(event.detail.xhr.response);
    this.appHomeScreenIconImageId = image.id;
  }
}
