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
import { TextField } from '@material/mwc-textfield';

@customElement('yp-admin-config-community')
export class YpAdminConfigCommunity extends YpAdminConfigBase {
  @property({ type: Number })
  appHomeScreenIconImageId: number | undefined;

  @property({ type: String })
  hostnameExample: string | undefined;

  @property({ type: Boolean })
  hasSamlLoginProvider = false

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
             <div class="layout vertical">
             ${this.renderNameAndDescription()}
              <mwc-textfield
                id="hostname"
                name="hostname"
                type="text"
                @keyup="${this._hostnameChanged}"
                .label="${this.t('community.hostname')}"
                .value="${(this.collection as YpCommunityData).hostname}"
                ?required="${!(this.collection as YpCommunityData)
                  .is_community_folder}"
                maxlength="80"
                charCounter
                class="mainInput"
              >
              </mwc-textfield>
              <div class="hostnameInfo">
                https://${this.hostnameExample}
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

  _hostnameChanged() {
    const hostname = (this.$$("#hostname") as TextField).value;
    if (hostname) {
      this.hostnameExample = hostname + '.' + window.appGlobals!.domain!.domain_name;
    } else {
      this.hostnameExample = 'your-hostname.' + '.' + window.appGlobals!.domain!.domain_name;
    }
    this._configChanged();
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
        (this.collection as YpCommunityData).CommunityLogoVideos &&
        (this.collection as YpCommunityData).CommunityLogoVideos!.length > 0
      ) {
        this.uploadedVideoId = (this
          .collection as YpCommunityData).CommunityLogoVideos![0].id;
      } else if (
        (this.collection as YpGroupData).GroupLogoVideos &&
        (this.collection as YpGroupData).GroupLogoVideos!.length > 0
      ) {
        this.uploadedVideoId = (this
          .collection as YpGroupData).GroupLogoVideos![0].id;
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
                ? this.renderVideoUpload()
                : nothing}
            </div>
          `,
        },
        {
          text: 'analyticsTrackerCode',
          name: 'google_analytics_code',
          type: 'textfield',
          maxLength: 40,
          value: (this.collection as YpCommunityData).google_analytics_code,
        },
        {
          text: 'facebookPixelId',
          type: 'textfield',
          maxLength: 40,
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
      name: 'samlAuth',
      icon: 'security',
      items: [
        {
          text: 'forceSecureSamlLogin',
          type: 'checkbox',
          disabled: !this.hasSamlLoginProvider
        },
        {
          text: 'customSamlLoginMessage',
          type: 'textarea',
          rows: 2,
          maxRows: 5,
          maxLength: 175
        },
        {
          text: 'customSamlDeniedMessage',
          type: 'textarea',
          rows: 2,
          maxRows: 5,
          maxLength: 150
        }
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
