import { LitElement, css, property, html, customElement } from 'lit-element';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { Layouts } from 'lit-flexbox-literals';
import { YpBaseElementWithLogin } from './@yrpri/common/yp-base-element-with-login.js';
import { YpAdminPage } from './yp-admin-page.js';

import './@yrpri/yp-survey/yp-structured-question-edit.js';
import '@material/mwc-tab';
import '@material/mwc-tab-bar';
import '@material/mwc-textfield';
import '@material/mwc-textarea';

import { YpAdminConfigBase } from './yp-admin-config-base.js';
import { nothing } from 'lit-html';
import { YpNavHelpers } from './@yrpri/common/YpNavHelpers.js';
import { YpFileUpload } from './@yrpri/yp-file-upload/yp-file-upload.js';
import { YpEmojiSelector } from './@yrpri/common/yp-emoji-selector.js';
import './@yrpri/common/yp-emoji-selector.js';

import './@yrpri/yp-file-upload/yp-file-upload.js';
import './@yrpri/yp-theme/yp-theme-selector.js';
import './@yrpri/yp-app/yp-language-selector.js';

@customElement('yp-admin-config-community')
export class YpAdminConfigCommunity extends YpAdminConfigBase {
  @property({ type: Number })
  appHomeScreenIconImageId: number | undefined;

  constructor() {
    super();
    this.action = '/communities';
  }

  static get styles() {
    return [super.styles, css``];
  }

  renderHeader() {
    return this.collection
      ? html`
          <div class="layout horizontal wrap">
            ${this.renderNameAndDescription()}
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

  _clear() {
    super._clear();
    this.appHomeScreenIconImageId = undefined;
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

    if (changedProperties.has('collectionId') && this.collectionId) {
      if (this.collectionId == 'new') {
        this.action = '/domains';
      } else {
        this.action = `/domains/${this.collectionId}`;
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

  async _formResponse(event: CustomEvent) {
    super._formResponse(event);
    const domain = event.detail;
    if (domain) {
      debugger;
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
      icon: 'code',
      items: [
        {
          text: 'defaultLocale',
          type: 'html',
          templateData: html`
            <yp-language-selector
              name="defaultLocale"
              noUserEvents
              @changed="${this._configChanged}"
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
            .themeObject="${this.collection as YpThemeContainerObject}"
            .selectedTheme="${this.collection?.theme_id}"
            @yp-theme-changed="${(event: CustomEvent) => {
              this.themeId = event.detail;
              if (this.themeId) {
                this._configChanged();
              }
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
                      <mwc-formfield .label="${this.t('useVideoCover')}">
                        <mwc-checkbox
                          name="useVideoCover"
                          ?disabled="${!this.uploadedVideoId}"
                          ?checked="${this.collection!.configuration
                            .useVideoCover}"
                        >
                        </mwc-checkbox>
                      </mwc-formfield>
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
          value: (this.collection as YpDomainData).google_analytics_code,
        },
        {
          text: 'onlyAdminsCanCreateCommunities',
          type: 'checkbox',
          value: (this.collection as YpDomainData)
            .only_admins_can_create_communities,
          translationToken: 'domain.onlyAdminsCanCreateCommunities',
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
      icon: 'get_app',
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
      icon: 'api',
      items: [
        {
          text: 'Facebook Client Id',
          name: 'facebookClientId',
          type: 'textfield',
          value: this._getSaveCollectionPath(
            'secret_api_keys.facebook.client_id'
          ),
          maxLength: 60,
        },
        {
          text: 'Facebook Client Secret',
          name: 'facebookClientSecret',
          type: 'textfield',
          value: this._getSaveCollectionPath(
            'secret_api_keys.facebook.client_secret'
          ),
          maxLength: 60,
        },
        {
          text: 'Google Client Id',
          name: 'googleClientId',
          type: 'textfield',
          value: this._getSaveCollectionPath(
            'secret_api_keys.google.client_id'
          ),
          maxLength: 60,
        },
        {
          text: 'Google Client Secret',
          name: 'googleClientSecret',
          type: 'textfield',
          value: this._getSaveCollectionPath(
            'secret_api_keys.google.client_secret'
          ),
          maxLength: 60,
        },
      ],
    });

    tabs.push({
      name: 'samlAuth',
      icon: 'security',
      items: [
        {
          text: 'SAML EntryPoint',
          name: 'samlEntryPoint',
          type: 'textfield',
          value: this._getSaveCollectionPath('secret_api_keys.saml.entryPoint'),
          maxLength: 100,
        },
        {
          text: 'SAML Issuer',
          name: 'samlIssuer',
          type: 'textfield',
          value: this._getSaveCollectionPath('secret_api_keys.saml.issuer'),
        },
        {
          text: 'SAML Identifier Format',
          name: 'samlIdentifierFormat',
          type: 'textfield',
          value: this._getSaveCollectionPath(
            'secret_api_keys.saml.identifierFormat'
          ),
        },
        {
          text: 'samlLoginButtonUrl',
          type: 'textfield',
        },
        {
          text: 'customSamlLoginText',
          type: 'textfield',
        },
        {
          text: 'SAML CallbackUrl',
          name: 'samlCallbackUrl',
          type: 'textfield',
          value: this._getSaveCollectionPath(
            'secret_api_keys.saml.callbackUrl'
          ),
          maxLength: 100,
        },
        {
          text: 'SAML Verification Certificate Chain',
          name: 'samlCert',
          type: 'textarea',
          value: this._getSaveCollectionPath('secret_api_keys.saml.cert'),
          maxLength: 20000,
          rows: 2,
          maxRows: 5,
        },
        {
          text: 'customSAMLErrorHTML',
          type: 'textarea',
          rows: 2,
          maxRows: 5,
        },
        {
          text: 'forceSecureSamlEmployeeLogin',
          type: 'checkbox',
        },
      ],
    });

    return tabs;
  }

  _appHomeScreenIconImageUploaded(event: CustomEvent) {
    var image = JSON.parse(event.detail.xhr.response);
    this.appHomeScreenIconImageId = image.id;
    this._configChanged();
  }
}
