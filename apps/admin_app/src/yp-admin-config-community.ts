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
import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';

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
import { ifDefined } from 'lit-html/directives/if-defined';
import { Radio } from '@material/mwc-radio';

@customElement('yp-admin-config-community')
export class YpAdminConfigCommunity extends YpAdminConfigBase {
  @property({ type: Number })
  appHomeScreenIconImageId: number | undefined;

  @property({ type: String })
  hostnameExample: string | undefined;

  @property({ type: Boolean })
  hasSamlLoginProvider = false;

  @property({ type: Array })
  availableCommunityFolders: Array<YpCommunityData> | undefined;

  @property({ type: Number })
  ssnLoginListDataId: number | undefined;

  @property({ type: Number })
  ssnLoginListDataCount: number | undefined;

  @property({ type: Number })
  inCommunityFolderId: number | undefined;

  @property({ type: Number })
  signupTermsPageId: number | undefined;

  @property({ type: Number })
  welcomePageId: number | undefined;

  @property({ type: String })
  status: string | undefined;

  @property({ type: String })
  communityAccess = 'public';

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
                .value="${(this.collection as YpCommunityData).hostname || ''}"
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
        `
      : nothing;
  }

  renderHiddenInputs() {
    return html`
      <input
        type="hidden"
        name="appHomeScreenIconImageId"
        value="${this.appHomeScreenIconImageId?.toString() || ''}"
      />

      <input type="hidden" name="themeId" value="${ifDefined(this.themeId)}" />

      <input
        type="hidden"
        name="ssnLoginListDataId"
        value="${ifDefined(this.ssnLoginListDataId)}"
      />

      <input type="hidden" name="status" value="${this.status || ''}" />

      <input
        type="hidden"
        name="is_community_folder"
        value="${ifDefined(
          (this.collection as YpCommunityData).is_community_folder
        )}"
      />

      <input
        type="hidden"
        name="is_community_folder"
        value="${ifDefined(this.inCommunityFolderId)}"
      />

      <input
        type="hidden"
        name="welcomePageId"
        value="${ifDefined(this.welcomePageId)}"
      />

      <input
        type="hidden"
        name="signupTermsPageId"
        value="${ifDefined(this.signupTermsPageId)}"
      />
    `;
  }

  _hostnameChanged() {
    const hostname = (this.$$('#hostname') as TextField).value;
    if (hostname) {
      this.hostnameExample =
        hostname + '.' + window.appGlobals!.domain!.domain_name;
    } else {
      this.hostnameExample =
        'your-hostname.' + '.' + window.appGlobals!.domain!.domain_name;
    }
    this._configChanged();
  }

  _clear() {
    super._clear();
    this.appHomeScreenIconImageId = undefined;
    this.ssnLoginListDataId = undefined;
    this.ssnLoginListDataCount = undefined;
    this.inCommunityFolderId = undefined;
    this.signupTermsPageId = undefined;
    this.welcomePageId = undefined;
    this.availableCommunityFolders = undefined;
    (this.$$('#appHomeScreenIconImageUpload') as YpFileUpload).clear();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('collection') && this.collection) {
      this._communityChanged();
    }

    if (changedProperties.has('collectionId') && this.collectionId) {
      this._collectionIdChanged();
    }
  }

  languageChanged() {
    this._setupTranslations();
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

    this._getHelpPages('community');
    if (this.collection) {
      if ((this.collection as YpCommunityData).access === 0) {
        this.communityAccess = 'public';
      } else if ((this.collection as YpCommunityData).access === 1) {
        this.communityAccess = 'closed';
      } else if ((this.collection as YpCommunityData).access === 2) {
        this.communityAccess = 'secret';
      }
      if ((this.collection as YpCommunityData).status) {
        this.status = (this.collection as YpCommunityData).status;
      }

      if ((this.collection as YpCommunityData).in_community_folder_id) {
        this.inCommunityFolderId = (this
          .collection as YpCommunityData).in_community_folder_id;
      }

      if ((this.collection as YpCommunityData).configuration) {
        if (
          (this.collection as YpCommunityData).configuration.signupTermsPageId
        ) {
          this.signupTermsPageId = (this
            .collection as YpCommunityData).configuration.signupTermsPageId;
        }
        if ((this.collection as YpCommunityData).configuration.welcomePageId) {
          this.welcomePageId = (this
            .collection as YpCommunityData).configuration.welcomePageId;
        }
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
      this.ssnLoginListDataId = (this
        .collection as YpCommunityData).configuration.ssnLoginListDataId;
      this._getSsnListCount();
    }

    this._checkCommunityFolders(this.collection as YpCommunityData);

    this.requestUpdate();
  }

  _deleteSsnLoginList() {
    if (this.collection && this.ssnLoginListDataId) {
      window.adminServerApi.deleteSsnLoginList(
        this.collection.id,
        this.ssnLoginListDataId
      );
      this.ssnLoginListDataId = undefined;
      this.ssnLoginListDataCount = undefined;
    }
  }

  _ssnLoginListDataUploaded(event: CustomEvent) {
    this.ssnLoginListDataId = JSON.parse(
      event.detail.xhr.response
    ).ssnLoginListDataId;
    this._getSsnListCount();
  }

  async _getSsnListCount() {
    if (this.collection && this.ssnLoginListDataId) {
      const response = await window.adminServerApi.getSsnListCount(
        this.collection.id,
        this.ssnLoginListDataId
      );
      this.ssnLoginListDataCount = response.count;
    }
  }

  _collectionIdChanged() {
    if (this.collectionId == 'new' || this.collectionId == 'newFolder') {
      this.action = '/communities';
      this.collection = {
        id: -1,
        name: '',
        description: '',
        access: 0,
        status: 'active',
        only_admins_can_create_groups: true,
        counter_points: 0,
        counter_posts: 0,
        counter_users: 0,
        configuration: {},
        hostname: '',
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

    const communityFolders = (await window.adminServerApi.getCommunityFolders(
      domain!.id
    )) as Array<YpCommunityData>;

    if (communityFolders && this.collection?.id) {
      var deleteIndex;
      communityFolders.forEach((community, index) => {
        if (community.id == this.collection?.id) deleteIndex = index;
      });
      if (deleteIndex) communityFolders.splice(deleteIndex, 1);
    }
    if (communityFolders && communityFolders.length > 0) {
      communityFolders.unshift(({
        id: -1,
        name: this.t('none'),
      } as unknown) as YpCommunityData);
      this.availableCommunityFolders = communityFolders;
    } else {
      this.availableCommunityFolders = undefined;
    }
  }

  _setupTranslations() {
    if (this.collectionId == 'new') {
      if (
        this.collection &&
        (this.collection as YpCommunityData).is_community_folder
      ) {
        this.editHeaderText = this.t('newCommunityFolder');
      } else {
        this.editHeaderText = this.t('community.new');
      }
      this.saveText = this.t('create');
      this.toastText = this.t('communityToastCreated');
    } else {
      if (
        this.collection &&
        (this.collection as YpCommunityData).is_community_folder
      ) {
        this.editHeaderText = this.t('updateCommunityFolder');
      } else {
        this.editHeaderText = this.t('Update community info');
      }
      this.saveText = this.t('save');
      this.toastText = this.t('communityToastUpdated');
    }
  }

  async _formResponse(event: CustomEvent) {
    super._formResponse(event);
    const community = event.detail as YpCommunityData;
    if (community) {
      if (community.hostnameTaken) {
        window.appDialogs.getDialogAsync(
          'confirmationDialog',
          (dialog: YpConfirmationDialog) => {
            dialog.open(this.t('hostnameTaken'), undefined);
          }
        );
      } else {
        if (this.uploadedVideoId) {
          await window.adminServerApi.addVideoToCollection(
            community.id,
            {
              videoId: this.uploadedVideoId,
            },
            'completeAndAddToCommunity'
          );
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
      YpNavHelpers.redirectTo('/community_folder/' + community.id);
    } else {
      YpNavHelpers.redirectTo('/community/' + community.id);
    }
    window.appGlobals.activity('completed', 'editCommunity');
  }

  _statusSelected(event: CustomEvent) {
    const index = event.detail.index as number;
    this.status = this.collectionStatusOptions[index].name;
  }

  get statusIndex() {
    if (this.status) {
      for (let i = 0; i < this.collectionStatusOptions.length; i++) {
        if (this.collectionStatusOptions[i].name == this.status) return i;
      }
      return -1;
    } else {
      return -1;
    }
  }

  get collectionStatusOptions() {
    if (this.language) {
      return [
        { name: 'active', translatedName: this.t('status.active') },
        { name: 'featured', translatedName: this.t('status.featured') },
        { name: 'archived', translatedName: this.t('status.archived') },
        { name: 'hidden', translatedName: this.t('status.hidden') },
      ];
    } else {
      return [];
    }
  }

  _accessRadioChanged(event: CustomEvent) {
    this.communityAccess = (event.target as Radio).value;
  }

  _getAccessTab() {
    return {
      name: 'access',
      icon: 'code',
      items: [
        {
          text: this.t('access'),
          type: 'textheader',
        },
        {
          text: 'status',
          type: 'html',
          templateData: html`
            <mwc-formfield .label="${this.t('public')}">
              <mwc-radio
                @change="${this._accessRadioChanged}"
                value="public"
                ?checked="${this.communityAccess == 'public'}"
                name="accessRadioButtons"
              >
              </mwc-radio>
            </mwc-formfield>
            <mwc-formfield .label="${this.t('closed')}">
              <mwc-radio
                @change="${this._accessRadioChanged}"
                ?checked="${this.communityAccess == 'closed'}"
                value="closed"
                name="accessRadioButtons"
              >
              </mwc-radio>
            </mwc-formfield>
            <mwc-formfield .label="${this.t('secret')}">
              <mwc-radio
                @change="${this._accessRadioChanged}"
                ?checked="${this.communityAccess == 'secret'}"
                value="secret"
                name="accessRadioButtons"
              >
              </mwc-radio>
            </mwc-formfield>
          `,
        },
        {
          text: 'status',
          type: 'html',
          templateData: html`
            <mwc-select
              .label="${this.t('status.select')}"
              @selected="${this._statusSelected}"
            >
              ${this.collectionStatusOptions?.map(
                (statusOption, index) => html`
                  <mwc-list-item ?selected="${this.statusIndex == index}"
                    >${statusOption.translatedName}</mwc-list-item
                  >
                `
              )}
            </mwc-select>
          `,
        },
        {
          text: 'onlyAdminsCanCreateGroups',
          type: 'checkbox',
          value: (this.collection as YpCommunityData)
            .only_admins_can_create_groups,
          translationToken: 'domain.onlyAdminsCanCreateGroups',
        },
      ] as Array<YpStructuredConfigData>,
    } as YpConfigTabData;
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
          text: 'redirectToGroupId',
          type: 'textfield',
          maxLength: 40,
        },
        {
          text: 'defaultLocationLongLat',
          type: 'textfield',
          maxLength: 100,
          value: (this.collection as YpCommunityData).defaultLocationLongLat,
        },
        {
          text: 'inCommunityFolder',
          type: 'html',
          templateData: html`
            <mwc-select
              .label="${this.t('inCommunityFolder')}"
              @selected="${this._communityFolderSelected}"
            >
              ${this.availableCommunityFolders?.map(
                (communityFolder, index) => html`
                  <mwc-list-item
                    ?selected="${this.communityFolderIndex == index}"
                    >${communityFolder.name}</mwc-list-item
                  >
                `
              )}
            </mwc-select>
          `,
          hidden: !this.availableCommunityFolders,
        },
        {
          text: 'signupTermsSelectPage',
          type: 'html',
          templateData: html`
            <mwc-select
              .label="${this.t('welcomeSelectPage')}"
              @selected="${this._signupTermsPageSelected}"
            >
              ${this.translatedPages?.map(
                (page, index) => html`
                  <mwc-list-item
                    ?selected="${this.signupTermsPageIndex == index}"
                    >${this._getLocalizePageTitle(page)}</mwc-list-item
                  >
                `
              )}
            </mwc-select>
          `,
          hidden: !this.translatedPages,
        },
        {
          text: 'signupTermsSelectPage',
          type: 'html',
          templateData: html`
            <mwc-select
              .label="${this.t('welcomeSelectPage')}"
              @selected="${this._welcomePageSelected}"
            >
              ${this.translatedPages?.map(
                (page, index) => html`
                  <mwc-list-item ?selected="${this.welcomePageIndex == index}"
                    >${this._getLocalizePageTitle(page)}</mwc-list-item
                  >
                `
              )}
            </mwc-select>
          `,
          hidden: !this.translatedPages,
        },
      ],
    } as YpConfigTabData;
  }

  _welcomePageSelected(event: CustomEvent) {
    const index = event.detail.index as number;
    this.welcomePageId = this.translatedPages![index].id;
  }

  get welcomePageIndex() {
    if (this.translatedPages) {
      for (let i = 0; i < this.translatedPages.length; i++) {
        if (this.translatedPages[i].id == this.welcomePageId) return i;
      }
      return -1;
    } else {
      return -1;
    }
  }

  _signupTermsPageSelected(event: CustomEvent) {
    const index = event.detail.index as number;
    this.signupTermsPageId = this.translatedPages![index].id;
  }

  get signupTermsPageIndex() {
    if (this.translatedPages) {
      for (let i = 0; i < this.translatedPages.length; i++) {
        if (this.translatedPages[i].id == this.signupTermsPageId) return i;
      }
      return -1;
    } else {
      return -1;
    }
  }

  _communityFolderSelected(event: CustomEvent) {
    const index = event.detail.index as number;
    this.inCommunityFolderId = this.availableCommunityFolders![index].id;
  }

  get communityFolderIndex() {
    if (this.availableCommunityFolders) {
      for (let i = 0; i < this.availableCommunityFolders.length; i++) {
        if (this.availableCommunityFolders[i].id == this.inCommunityFolderId)
          return i;
      }
      return -1;
    } else {
      return -1;
    }
  }

  _getLookAndFeelTab() {
    return {
      name: 'lookAndFeel',
      icon: 'code',
      items: [
        {
          text: 'mediaUploads',
          type: 'html',
          templateData: html`
            <div class="layout horizontal wrap">
              ${this.renderHeaderAndLogoImageUploads()}
              ${this.hasVideoUpload ? this.renderVideoUpload() : nothing}
            </div>
          `,
        },
        {
          text: 'theme',
          type: 'html',
          templateData: html`<yp-theme-selector
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
          text: this.t('themeOverrideColorInfo'),
          type: 'textdescription',
        },
        {
          text: 'themeOverrideColorPrimary',
          type: 'textfield',
          maxlength: 7,
          charCounter: true,
          pattern: '[#-#0-9A-Fa-f]',
        },
        {
          text: 'themeOverrideColorAccent',
          type: 'textfield',
          maxlength: 7,
          charCounter: true,
          pattern: '[#-#0-9A-Fa-f]',
        },
        {
          text: 'themeOverrideBackgroundColor',
          type: 'textfield',
          maxlength: 7,
          charCounter: true,
          pattern: '[#-#0-9A-Fa-f]',
        },
        {
          text: 'hideRecommendationOnNewsFeed',
          type: 'checkbox',
        },
        {
          text: 'disableDomainUpLink',
          type: 'checkbox',
          translationToken: 'disableCommunityDomainUpLink',
        },
        {
          text: 'disableNameAutoTranslation',
          type: 'checkbox',
        },
        {
          text: 'hideAllTabs',
          type: 'checkbox',
        },
        {
          text: 'welcomeHTML',
          type: 'textarea',
          rows: 2,
          maxRows: 5,
        },
        {
          text: 'sortBySortOrder',
          type: 'checkbox',
          translationToken: 'sortGroupsBySortOrder',
        },
        {
          text: 'highlightedLanguages',
          type: 'textfield',
          maxLength: 200,
        },
        {
          text: 'customBackName',
          type: 'textfield',
          maxLength: 20,
        },
        {
          text: 'customBackURL',
          type: 'textfield',
          maxLength: 256,
        },
      ],
    } as YpConfigTabData;
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
    };
  }

  _getSamlTab() {
    return {
      name: 'samlAuth',
      icon: 'security',
      items: [
        {
          text: 'forceSecureSamlLogin',
          type: 'checkbox',
          disabled: !this.hasSamlLoginProvider,
        },
        {
          text: 'customSamlLoginMessage',
          type: 'textarea',
          rows: 2,
          maxRows: 5,
          maxLength: 175,
        },
        {
          text: 'customSamlDeniedMessage',
          type: 'textarea',
          rows: 2,
          maxRows: 5,
          maxLength: 150,
        },
        {
          text: 'ssnLoginListDataUpload',
          type: 'html',
          templateData: html`
            ${this.collection && this.ssnLoginListDataId
              ? html`
                <div>
                  <b>${this.t('ssnLoginListCount')}: ${
                  this.ssnLoginListDataCount
                }</b>
                </div>
                <div>
                  <mwc-button
                    style="padding: 8px;"
                    raised
                    .label="${this.t('deleteSsnLoginList')}"
                    @click="${this._deleteSsnLoginList}"
                    ></mwc-button
                  >
                </div>
              </div>
                `
              : nothing}
            ${this.collection && !this.ssnLoginListDataId
              ? html`
                  <yp-file-upload
                    id="ssnLoginListDataUpload"
                    raised
                    ?disable="${!this.hasSamlLoginProvider}"
                    accept=".txt"
                    .target="/api/communities/${this.collection
                      .id}/upload_ssn_login_list"
                    method="POST"
                    buttonIcon="link"
                    .buttonText="${this.t('appHomeScreenIconImageUpload')}"
                    @success="${this._ssnLoginListDataUploaded}"
                  >
                  </yp-file-upload>
                `
              : nothing}
          `,
        },
      ],
    };
  }

  setupConfigTabs() {
    const tabs: Array<YpConfigTabData> = [];

    tabs.push(this._getAccessTab());
    tabs.push(this._getBasicTab());
    tabs.push(this._getLookAndFeelTab());
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
