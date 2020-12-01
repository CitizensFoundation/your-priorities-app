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
import { YpConfirmationDialog } from './@yrpri/yp-dialog-container/yp-confirmation-dialog.js';

@customElement('yp-admin-config-community')
export class YpAdminConfigCommunity extends YpAdminConfigBase {
  @property({ type: Number })
  appHomeScreenIconImageId: number | undefined;

  @property({ type: String })
  hostnameExample: string | undefined;

  @property({ type: Boolean })
  hasSamlLoginProvider = false

  @property({ type: Array })
  availableCommunityFolders: Array<YpCommunityData> | undefined

  @property({ type: Number })
  ssnLoginListDataId: number | undefined

  @property({ type: Number })
  ssnLoginListDataCount: number | undefined

  @property({ type: Number })
  inCommunityFolderId: number | undefined

  @property({ type: String })
  status: string | undefined

  @property({ type: String })
  communityAccess: string | undefined

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
    this.ssnLoginListDataId = undefined;
    this.ssnLoginListDataCount = undefined;
    this.inCommunityFolderId = undefined;
    this.availableCommunityFolders = undefined;
    (this.$$("#appHomeScreenIconImageUpload") as YpFileUpload).clear();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('collection') && this.collection) {
      this._communityChanged()
    }

    if (changedProperties.has('collectionId') && this.collectionId) {
      this._collectionIdChanged()
    }
  }

  languageChanged() {
    this._setupTranslations()
  }

  _communityChanged() {
    this._setupTranslations();
    this._updateEmojiBindings();

    if (
      (this.collection as YpCommunityData).CommunityLogoVideos &&
      (this.collection as YpCommunityData).CommunityLogoVideos!.length > 0
    ) {
      this.uploadedVideoId = (this
        .collection as YpCommunityData).CommunityLogoVideos![0].id;
    }

    this._getHelpPages("communities");
    if (this.collection) {
      if ((this.collection as YpCommunityData).access === 0) {
        this.communityAccess = "public";
      } else if ((this.collection as YpCommunityData).access === 1) {
        this.communityAccess = "closed";
      } else if ((this.collection as YpCommunityData).access === 2) {
        this.communityAccess = "secret";
      }
      if ((this.collection as YpCommunityData).status) {
        this.status = (this.collection as YpCommunityData).status;
      }

      if ((this.collection as YpCommunityData).in_community_folder_id) {
        this.inCommunityFolderId = (this.collection as YpCommunityData).in_community_folder_id;
      }
    }

    if (window.appGlobals.hasVideoUpload) {
      this.hasVideoUpload = true;
    } else {
      this.hasVideoUpload = false;
    }

    if (
      window.appGlobals.domain &&
      window.appGlobals.domain.samlLoginProvided
    ) {
      this.hasSamlLoginProvider = true;
    } else {
      this.hasSamlLoginProvider = false;
    }

    if (
      this.collection &&
      this.collection.configuration &&
      (this.collection as YpCommunityData).configuration.ssnLoginListDataId
    ) {
      this.ssnLoginListDataId = (this.collection as YpCommunityData).configuration.ssnLoginListDataId;
      this._getSsnListCount();
    }

    this._checkCommunityFolders(this.collection as YpCommunityData);
  }

  _deleteSsnLoginList () {
    if (this.collection && this.ssnLoginListDataId) {
      window.adminServerApi.deleteSsnLoginList(this.collection.id, this.ssnLoginListDataId)
      this.ssnLoginListDataId = undefined;
      this.ssnLoginListDataCount = undefined;
    }
  }

  _ssnLoginListDataUploaded(event: CustomEvent) {
    this.ssnLoginListDataId = JSON.parse(event.detail.xhr.response).ssnLoginListDataId;
    this._getSsnListCount();
  }

  async _getSsnListCount() {
    if (this.collection && this.ssnLoginListDataId) {
      const response = await window.adminServerApi.getSsnListCount(this.collection.id, this.ssnLoginListDataId)
      this.ssnLoginListDataCount = response.count;
    }
  }

  _collectionIdChanged() {
    if (this.collectionId == 'new' || this.collectionId == 'newFolder') {
      this.action = '/communities';
      this.collection = {
        id: -1,
        name: "",
        description: "",
        access: 0,
        status: "active",
        only_admins_can_create_groups: true,
        counter_points: 0,
        counter_posts: 0,
        counter_users: 0,
        configuration: {

        },
        hostname: "",
        is_community_folder: this.collectionId == 'newFolder' ? true : false,
      } as YpCommunityData;
    } else {
      this.action = `/communities/${this.collectionId}`;
    }
  }

  async _checkCommunityFolders(community: YpCommunityData) {
    let domain;
    if (community.Domain) {
      domain = community.Domain;
    } else {
      domain = window.appGlobals.domain;
    }

    const communityFolders = await window.adminServerApi.getCommunityFolders(domain!.id) as Array<YpCommunityData>;

    if (communityFolders && this.collection?.id) {
      var deleteIndex;
      communityFolders.forEach( (community, index) => {
          if (community.id == this.collection?.id) deleteIndex = index;
        }
      );
      if (deleteIndex) communityFolders.splice(deleteIndex, 1);
    }
    if (communityFolders && communityFolders.length > 0) {
      communityFolders.unshift({ id: -1, name: this.t("none") } as unknown as YpCommunityData);
      this.availableCommunityFolders = communityFolders;
    } else {
      this.availableCommunityFolders = undefined;
    }
  }

  _setupTranslations() {
    if (this.collectionId == 'new') {
      if (this.collection && (this.collection as YpCommunityData).is_community_folder) {
        this.editHeaderText = this.t("newCommunityFolder");
      } else {
        this.editHeaderText = this.t("community.new");
      }
      this.saveText = this.t("create");
      this.toastText = this.t("communityToastCreated");
    } else {
      if (this.collection && (this.collection as YpCommunityData).is_community_folder) {
        this.editHeaderText = this.t("updateCommunityFolder");
      } else {
        this.editHeaderText = this.t("Update community info");
      }
      this.saveText = this.t("save");
      this.toastText = this.t("communityToastUpdated");
    }
  }

  async _formResponse(event: CustomEvent) {
    super._formResponse(event);
    const community = event.detail as YpCommunityData;
    if (community) {
      if (community.hostnameTaken) {
        window.appDialogs
        .getDialogAsync(
          "confirmationDialog",
          (dialog: YpConfirmationDialog) => {
            dialog.open(this.t("hostnameTaken"), undefined);
          }
        );

      } else {
        if (this.uploadedVideoId) {
          await window.adminServerApi.addVideoToCollection(community.id, {
            videoId: this.uploadedVideoId,
          }, "completeAndAddToCommunity");
          this._finishRedirect(community);
        } else {
          this._finishRedirect(community);
        }
      }
    } else {
      console.warn('No community found on custom redirect');
    }
  }

  _finishRedirect(community: YpCommunityData) {
    if (community.is_community_folder) {
      YpNavHelpers.redirectTo("/community_folder/" + community.id);
    } else {
      YpNavHelpers.redirectTo("/community/" + community.id);
    }
    window.appGlobals.activity("completed", "editCommunity");
  }

  _getBasicTab() {
    return {
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
    }
  }

  _getWebAppTab() {
    return {
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
    }
  }

  _getSamlTab() {
    return {
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
    }
  }

  setupConfigTabs() {
    const tabs: Array<YpConfigTabData> = [];

    tabs.push(this._getBasicTab());
    tabs.push(this._getWebAppTab());
    tabs.push(this._getSamlTab());

    return tabs;
  }

  _appHomeScreenIconImageUploaded(event: CustomEvent) {
    var image = JSON.parse(event.detail.xhr.response);
    this.appHomeScreenIconImageId = image.id;
    this._configChanged();
  }
}
