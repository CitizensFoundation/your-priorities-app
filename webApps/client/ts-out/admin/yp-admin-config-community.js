var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import "@material/web/radio/radio.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import "../yp-survey/yp-structured-question-edit.js";
import { YpAdminConfigBase, defaultLtpConfiguration, defaultLtpPromptsConfiguration, } from "./yp-admin-config-base.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
//import { YpEmojiSelector } from './@yrpri/common/yp-emoji-selector.js';
//import './@yrpri/common/yp-emoji-selector.js';
import "../yp-theme/yp-theme-selector.js";
import "../yp-file-upload/yp-file-upload.js";
//import './@yrpri/yp-theme/yp-theme-selector.js';
import "../common/languages/yp-language-selector.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";
import { Corner } from "@material/web/menu/menu.js";
let YpAdminConfigCommunity = class YpAdminConfigCommunity extends YpAdminConfigBase {
    constructor() {
        super();
        this.hasSamlLoginProvider = false;
        this.communityAccess = "public";
        this.action = "/communities";
    }
    static get styles() {
        return [
            super.styles,
            css `
        .accessContainer {
        }

        .accessHeader {
          font-weight: bold;
          margin: 8px;
        }

        label {
          padding: 8px;
        }

        .actionButtonContainer {
          margin-left: 16px;
          margin-top: 16px;
        }

        md-radio {
          margin-right: 4px;
        }
      `,
        ];
    }
    renderHostname() {
        return html `
      <div class="layout vertical">
        ${this.renderNameAndDescription()}
        <md-outlined-text-field
          id="hostname"
          name="hostname"
          type="text"
          @keyup="${this._hostnameChanged}"
          label="${this.t("community.hostname")}"
          .value="${this.collection.hostname}"
          ?required="${!this.collection
            .is_community_folder}"
          maxlength="80"
          charCounter
          class="mainInput"
        ></md-outlined-text-field>
        <div class="hostnameInfo">https://${this.hostnameExample}</div>
      </div>
    `;
    }
    renderHeader() {
        return this.collection
            ? html `
          <div class="layout horizontal wrap topInputContainer">
            ${this.renderLogoMedia()} ${this.renderHostname()}
            <div class="layout vertical center-center">
              <div class="layout horizontal center-center">
                ${this.renderSaveButton()}
              </div>
              <div
                ?hidden="${this.collectionId == "new"}"
                class="actionButtonContainer layout horizontal center-center"
              >
                ${this.renderActionMenu()}
              </div>
              <div class="flex"></div>
            </div>
          </div>
        `
            : nothing;
    }
    renderActionMenu() {
        return html `
      <div style="position: relative;">
        <md-outlined-icon-button
          .ariaLabelSelected="${this.t("actions")}"
          id="menuAnchor"
          type="button"
          @click="${() => (this.$$("#actionMenu").open = true)}"
          ><md-icon>menu</md-icon></md-outlined-icon-button
        >
        <md-menu
          id="actionMenu"
          positioning="popover"
          .menuCorner="${Corner.START_END}"
          anchor="menuAnchor"
        >
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="newCategoryMenuItem"
          >
            <div slot="headline">New Category</div>
          </md-menu-item>
          <md-menu-item @click="${this._menuSelection}" id="deleteMenuItem">
            <div slot="headline">Delete</div>
          </md-menu-item>
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="cloneMenuItem"
          >
            <div slot="headline">Clone</div>
          </md-menu-item>
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="promotersMenuItem"
          >
            <div slot="headline">Promoters</div>
          </md-menu-item>
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="deleteContentMenuItem"
          >
            <div slot="headline">Delete Content</div>
          </md-menu-item>
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="anonymizeMenuItem"
          >
            <div slot="headline">Anonymize</div>
          </md-menu-item>
        </md-menu>
      </div>
    `;
    }
    _onDeleted() {
        this.dispatchEvent(new CustomEvent("yp-refresh-domain", { bubbles: true, composed: true }));
        YpNavHelpers.redirectTo("/domain/" + this.collection.domain_id);
    }
    _openDelete() {
        window.appGlobals.activity("open", "group.delete");
        window.appDialogs.getDialogAsync("apiActionDialog", (dialog) => {
            dialog.setup("/api/communities/" + this.collection.id, this.t("communityDeleteConfirmation"), this._onDeleted.bind(this));
            dialog.open({ finalDeleteWarning: true });
        });
    }
    _menuSelection(event) {
        const id = event.target?.id;
        this._openDelete();
        /*switch (id) {
          case "newCategoryMenuItem":
            this._openCategoryEdit();
            break;
          case "deleteMenuItem":
            this._openDelete();
            break;
          case "cloneMenuItem":
            this._openClone();
            break;
          case "promotersMenuItem":
            this._openPromotersDialog();
            break;
          case "deleteContentMenuItem":
            this._openDeleteContent();
            break;
          case "anonymizeMenuItem":
            this._openAnonymizeContent();
            break;
          case "newGroupItem":
            this._newGroup();
            break;
          case "newGroupFolderItem":
            this._newGroupFolder();
            break;
          default:
            break;
        }
        */
    }
    renderHiddenAccessSettings() {
        if (this.communityAccess) {
            return html `
        <input type="hidden" name="${this.communityAccess}" value="on" />
      `;
        }
        else {
            return nothing;
        }
    }
    renderHiddenInputsNotActive() {
        return html `
      <input type="hidden" name="themeId" value="${ifDefined(this.themeId)}" />
    `;
    }
    renderHiddenInputs() {
        return html `
      ${this.collection?.configuration.theme
            ? html `
            <input
              type="hidden"
              name="theme"
              value="${JSON.stringify(this.collection?.configuration.theme)}"
            />
          `
            : nothing}
      <input
        type="hidden"
        name="appHomeScreenIconImageId"
        value="${this.appHomeScreenIconImageId?.toString() || ""}"
      />

      ${(this.collection?.configuration).ltp
            ? html `
            <input
              type="hidden"
              name="ltp"
              value="${JSON.stringify((this.collection?.configuration).ltp)}"
            />
          `
            : nothing}

      <input
        type="hidden"
        name="ssnLoginListDataId"
        value="${ifDefined(this.ssnLoginListDataId)}"
      />

      <input type="hidden" name="status" value="${this.status || ""}" />

      <input
        type="hidden"
        name="is_community_folder"
        value="${ifDefined(this.collection.is_community_folder)}"
      />

      <input
        type="hidden"
        name="in_community_folder_id"
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

      ${this.renderHiddenAccessSettings()}
    `;
    }
    _hostnameChanged() {
        const hostname = this.$$("#hostname").value;
        if (hostname) {
            this.hostnameExample =
                hostname + "." + window.appGlobals.domain.domain_name;
        }
        else {
            this.hostnameExample =
                "your-hostname." + "." + window.appGlobals.domain.domain_name;
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
        this.$$("#appHomeScreenIconImageUpload").clear();
    }
    updated(changedProperties) {
        if (changedProperties.has("collection") && this.collection) {
            this.currentLogoImages = this.collection.CommunityLogoImages;
            this.currentHeaderImages = this.collection.CommunityHeaderImages;
            this._communityChanged();
            if (!this.collection.configuration.ltp) {
                this.collection.configuration.ltp =
                    defaultLtpConfiguration;
            }
            else if (!this.collection.configuration.ltp.crt
                .prompts) {
                this.collection.configuration.ltp.crt.prompts = defaultLtpPromptsConfiguration();
            }
        }
        if (changedProperties.has("collectionId") && this.collectionId) {
            this._collectionIdChanged();
        }
        super.updated(changedProperties);
    }
    languageChanged() {
        this._setupTranslations();
    }
    _communityChanged() {
        this._setupTranslations();
        //this._updateEmojiBindings();
        if (this.collection.CommunityLogoVideos &&
            this.collection.CommunityLogoVideos.length > 0) {
            this.uploadedVideoId = this.collection.CommunityLogoVideos[0].id;
        }
        this._getHelpPages("community");
        if (this.collection) {
            if (this.collection.access === 0) {
                this.communityAccess = "public";
            }
            else if (this.collection.access === 1) {
                this.communityAccess = "closed";
            }
            else if (this.collection.access === 2) {
                this.communityAccess = "secret";
            }
            if (this.collection.status) {
                this.status = this.collection.status;
            }
            if (this.collection.in_community_folder_id) {
                this.inCommunityFolderId = this.collection.in_community_folder_id;
            }
            if (this.collection.configuration) {
                if (this.collection.configuration.signupTermsPageId) {
                    this.signupTermsPageId = this.collection.configuration.signupTermsPageId;
                }
                if (this.collection.configuration.welcomePageId) {
                    this.welcomePageId = this.collection.configuration.welcomePageId;
                }
            }
        }
        if (window.appGlobals.hasVideoUpload) {
            this.hasVideoUpload = true;
        }
        else {
            this.hasVideoUpload = false;
        }
        if (window.appGlobals.domain &&
            window.appGlobals.domain.samlLoginProvided) {
            this.hasSamlLoginProvider = true;
        }
        else {
            this.hasSamlLoginProvider = false;
        }
        if (this.collection &&
            this.collection.configuration &&
            this.collection.configuration.ssnLoginListDataId) {
            this.ssnLoginListDataId = this.collection.configuration.ssnLoginListDataId;
            this._getSsnListCount();
        }
        //    this._checkCommunityFolders(this.collection as YpCommunityData);
        this.requestUpdate();
    }
    _deleteSsnLoginList() {
        if (this.collection && this.ssnLoginListDataId) {
            window.adminServerApi.deleteSsnLoginList(this.collection.id, this.ssnLoginListDataId);
            this.ssnLoginListDataId = undefined;
            this.ssnLoginListDataCount = undefined;
        }
    }
    _ssnLoginListDataUploaded(event) {
        this.ssnLoginListDataId = JSON.parse(event.detail.xhr.response).ssnLoginListDataId;
        this._getSsnListCount();
        this._configChanged();
    }
    async _getSsnListCount() {
        if (this.collection && this.ssnLoginListDataId) {
            const response = await window.adminServerApi.getSsnListCount(this.collection.id, this.ssnLoginListDataId);
            this.ssnLoginListDataCount = response.count;
        }
    }
    _collectionIdChanged() {
        if (this.collectionId == "new" || this.collectionId == "newFolder") {
            this.action = `/communities/${this.parentCollectionId}`;
            this.collection = {
                id: -1,
                name: "",
                description: "",
                access: 2,
                status: "active",
                only_admins_can_create_groups: true,
                counter_points: 0,
                counter_posts: 0,
                counter_users: 0,
                configuration: {
                    ltp: defaultLtpConfiguration,
                },
                hostname: "",
                is_community_folder: this.collectionId == "newFolder" ? true : false,
            };
        }
        else {
            this.action = `/communities/${this.collectionId}`;
        }
    }
    async _checkCommunityFolders(community) {
        let domain;
        if (community.Domain) {
            domain = community.Domain;
        }
        else {
            domain = window.appGlobals.domain;
        }
        const communityFolders = (await window.adminServerApi.getCommunityFolders(domain.id));
        if (communityFolders && this.collection?.id) {
            var deleteIndex;
            communityFolders.forEach((community, index) => {
                if (community.id == this.collection?.id)
                    deleteIndex = index;
            });
            if (deleteIndex)
                communityFolders.splice(deleteIndex, 1);
        }
        if (communityFolders && communityFolders.length > 0) {
            communityFolders.unshift({
                id: -1,
                name: this.t("none"),
            });
            this.availableCommunityFolders = communityFolders;
        }
        else {
            this.availableCommunityFolders = undefined;
        }
    }
    _setupTranslations() {
        if (this.collectionId == "new") {
            if (this.collection &&
                this.collection.is_community_folder) {
                this.editHeaderText = this.t("newCommunityFolder");
            }
            else {
                this.editHeaderText = this.t("community.new");
            }
            this.saveText = this.t("create");
            this.toastText = this.t("communityToastCreated");
        }
        else {
            if (this.collection &&
                this.collection.is_community_folder) {
                this.editHeaderText = this.t("updateCommunityFolder");
            }
            else {
                this.editHeaderText = this.t("Update community info");
            }
            this.saveText = this.t("save");
            this.toastText = this.t("communityToastUpdated");
        }
    }
    async _formResponse(event) {
        super._formResponse(event);
        const community = event.detail;
        if (community) {
            if (community.hostnameTaken) {
                window.appDialogs.getDialogAsync("confirmationDialog", (dialog) => {
                    dialog.open(this.t("hostnameTaken"), undefined);
                });
            }
            else {
                if (this.uploadedVideoId && this.connectedVideoToCollection) {
                    await window.adminServerApi.addVideoToCollection(community.id, {
                        videoId: this.uploadedVideoId,
                    }, "completeAndAddToCommunity");
                    this._finishRedirect(community);
                }
                else {
                    this._finishRedirect(community);
                }
            }
        }
        else {
            console.warn("No community found on custom redirect");
        }
    }
    _finishRedirect(community) {
        if (this.collectionId == "new") {
            window.appUser.recheckAdminRights();
        }
        if (community.is_community_folder) {
            YpNavHelpers.redirectTo("/community_folder/" + community.id);
        }
        else {
            YpNavHelpers.redirectTo("/community/" + community.id);
        }
        window.appGlobals.activity("completed", "editCommunity");
    }
    _accessRadioChanged(event) {
        this.communityAccess = event.target
            .value;
        this._configChanged();
    }
    _getAccessTab() {
        return {
            name: "access",
            icon: "code",
            items: [
                {
                    text: "status",
                    type: "html",
                    templateData: html `
            <div class="layout vertical accessContainer">
              <div class="accessHeader">${this.t("access")}</div>
              <label>
                <md-radio
                  @change="${this._accessRadioChanged}"
                  value="public"
                  ?checked="${this.communityAccess == "public"}"
                  name="access"
                ></md-radio>
                ${this.t("public")}
              </label>
              <label>
                <md-radio
                  @change="${this._accessRadioChanged}"
                  ?checked="${this.communityAccess == "secret"}"
                  value="secret"
                  name="access"
                ></md-radio>
                ${this.t("private")}
              </label>
            </div>
          `,
                },
                {
                    text: "status",
                    type: "html",
                    templateData: html `
            <md-outlined-select
              .label="${this.t("status.select")}"
              @change="${this._statusSelected}"
            >
              ${this.collectionStatusOptions?.map((statusOption, index) => html `
                  <md-select-option ?selected="${this.statusIndex == index}"
                    >${statusOption.translatedName}</md-select-option
                  >
                `)}
            </md-outlined-select>
          `,
                },
                {
                    text: "onlyAdminsCanCreateGroups",
                    type: "checkbox",
                    value: this.collection
                        .only_admins_can_create_groups,
                    translationToken: "community.onlyAdminsCanCreateGroups",
                },
                {
                    text: "alwaysShowOnDomainPage",
                    type: "checkbox",
                    value: this.collection.configuration
                        .alwaysShowOnDomainPage,
                    translationToken: "alwaysShowOnDomainPage",
                },
            ],
        };
    }
    _getBasicTab() {
        return {
            name: "basic",
            icon: "code",
            items: [
                {
                    text: "defaultLocale",
                    type: "html",
                    templateData: html `
            <yp-language-selector
              name="defaultLocale"
              noUserEvents
              @changed="${this._configChanged}"
              .selectedLocale="${this.collection.default_locale}"
            >
            </yp-language-selector>
          `,
                },
                {
                    text: "mediaUploads",
                    type: "html",
                    templateData: this.renderHeaderImageUploads(),
                },
                {
                    text: "alwaysHideLogoImage",
                    type: "checkbox",
                },
                {
                    text: "facebookPixelId",
                    type: "textfield",
                    maxLength: 40,
                },
                {
                    text: "redirectToGroupId",
                    type: "textfield",
                    maxLength: 40,
                },
                {
                    text: "defaultLocationLongLat",
                    type: "textfield",
                    maxLength: 100,
                    value: this.collection.defaultLocationLongLat,
                },
                {
                    text: "inCommunityFolder",
                    type: "html",
                    templateData: html `
            <md-select
              .label="${this.t("inCommunityFolder")}"
              @selected="${this._communityFolderSelected}"
            >
              ${this.availableCommunityFolders?.map((communityFolder, index) => html `
                  <md-select-option
                    ?selected="${this.inCommunityFolderId ==
                        communityFolder.id}"
                    >${communityFolder.name}</md-select-option
                  >
                `)}
            </md-select>
          `,
                    hidden: !this.availableCommunityFolders,
                },
                {
                    text: "signupTermsSelectPage",
                    type: "html",
                    templateData: html `
            <md-select
              .label="${this.t("welcomeSelectPage")}"
              @selected="${this._signupTermsPageSelected}"
            >
              ${this.translatedPages?.map((page, index) => html `
                  <md-select-option
                    ?selected="${this.signupTermsPageId == page.id}"
                    >${this._getLocalizePageTitle(page)}</md-select-option
                  >
                `)}
            </md-select>
          `,
                    hidden: !this.translatedPages,
                },
                {
                    text: "welcomePageSelect",
                    type: "html",
                    templateData: html `
            <md-select
              .label="${this.t("welcomeSelectPage")}"
              @selected="${this._welcomePageSelected}"
            >
              ${this.translatedPages?.map((page, index) => html `
                  <md-select-option ?selected="${this.welcomePageId == page.id}"
                    >${this._getLocalizePageTitle(page)}</md-select-option
                  >
                `)}
            </md-select>
          `,
                    hidden: !this.translatedPages,
                },
            ],
        };
    }
    _welcomePageSelected(event) {
        const index = event.detail.index;
        this.welcomePageId = this.translatedPages[index].id;
    }
    get welcomePageIndex() {
        if (this.translatedPages) {
            for (let i = 0; i < this.translatedPages.length; i++) {
                if (this.translatedPages[i].id == this.welcomePageId)
                    return i;
            }
            return -1;
        }
        else {
            return -1;
        }
    }
    _signupTermsPageSelected(event) {
        const index = event.detail.index;
        this.signupTermsPageId = this.translatedPages[index].id;
    }
    get signupTermsPageIndex() {
        if (this.translatedPages) {
            for (let i = 0; i < this.translatedPages.length; i++) {
                if (this.translatedPages[i].id == this.signupTermsPageId)
                    return i;
            }
            return -1;
        }
        else {
            return -1;
        }
    }
    _communityFolderSelected(event) {
        const index = event.detail.index;
        this.inCommunityFolderId = this.availableCommunityFolders[index].id;
    }
    get communityFolderIndex() {
        if (this.availableCommunityFolders) {
            for (let i = 0; i < this.availableCommunityFolders.length; i++) {
                if (this.availableCommunityFolders[i].id == this.inCommunityFolderId)
                    return i;
            }
            return -1;
        }
        else {
            return -1;
        }
    }
    _getLookAndFeelTab() {
        return {
            name: "lookAndFeel",
            icon: "code",
            items: [
                {
                    text: "themeSelector",
                    type: "html",
                    templateData: html `
            <yp-theme-selector
              @config-updated="${this._configChanged}"
              ?hasLogoImage="${this.imagePreviewUrl ||
                        YpMediaHelpers.getImageFormatUrl(this.currentLogoImages)}"
              @get-color-from-logo="${this.getColorFromLogo}"
              @yp-theme-configuration-changed="${this._themeChanged}"
              .themeConfiguration="${this.collection.configuration.theme}"
            ></yp-theme-selector>
          `,
                },
                {
                    text: "hideRecommendationOnNewsFeed",
                    type: "checkbox",
                },
                {
                    text: "disableCollectionUpLink",
                    type: "checkbox",
                    translationToken: "disableCommunityDomainUpLink",
                },
                {
                    text: "disableNameAutoTranslation",
                    type: "checkbox",
                },
                {
                    text: "hideAllTabs",
                    type: "checkbox",
                },
                {
                    text: "welcomeHTML",
                    type: "textarea",
                    rows: 2,
                    maxRows: 5,
                },
                {
                    text: "sortBySortOrder",
                    type: "checkbox",
                    translationToken: "sortGroupsBySortOrder",
                },
                {
                    text: "highlightedLanguages",
                    type: "textfield",
                    maxLength: 200,
                },
                {
                    text: "customBackName",
                    type: "textfield",
                    maxLength: 20,
                },
                {
                    text: "customBackURL",
                    type: "textfield",
                    maxLength: 256,
                },
            ],
        };
    }
    _getWebAppTab() {
        return {
            name: "webApp",
            icon: "get_app",
            items: [
                {
                    text: "appHomeScreenShortName",
                    type: "textfield",
                    maxLength: 12,
                },
                {
                    text: "appHomeScreenIconImageUpload",
                    type: "html",
                    templateData: html `
            <yp-file-upload
              id="appHomeScreenIconImageUpload"
              raised
              target="/api/images?itemType=app-home-screen-icon"
              method="POST"
              buttonIcon="photo_camera"
              .buttonText="${this.t("appHomeScreenIconImageUpload")}"
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
            name: "samlAuth",
            icon: "security",
            items: [
                {
                    text: "forceSecureSamlLogin",
                    type: "checkbox",
                    disabled: !this.hasSamlLoginProvider,
                },
                {
                    text: "customSamlLoginMessage",
                    type: "textarea",
                    rows: 2,
                    maxRows: 5,
                    maxLength: 175,
                },
                {
                    text: "customSamlDeniedMessage",
                    type: "textarea",
                    rows: 2,
                    maxRows: 5,
                    maxLength: 150,
                },
                {
                    text: "ssnLoginListDataUpload",
                    type: "html",
                    templateData: html `
            ${this.collection && this.ssnLoginListDataId
                        ? html `
                <div>
                  <b>${this.t("ssnLoginListCount")}: ${this.ssnLoginListDataCount}</b>
                </div>
                <div>
                  <md-filled-button
                    style="padding: 8px;"
                    raised
                    .label="${this.t("deleteSsnLoginList")}"
                    @click="${this._deleteSsnLoginList}"
                    ></md-filled-button
                  >
                </div>
              </div>
                `
                        : nothing}
            ${this.collection && !this.ssnLoginListDataId
                        ? html `
                  <yp-file-upload
                    id="ssnLoginListDataUpload"
                    raised
                    ?disable="${!this.hasSamlLoginProvider}"
                    accept=".txt,.csv"
                    .target="/api/communities/${this.collection
                            .id}/upload_ssn_login_list"
                    method="POST"
                    buttonIcon="link"
                    .buttonText="${this.t("appHomeScreenIconImageUpload")}"
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
        const tabs = [];
        tabs.push(this._getAccessTab());
        tabs.push(this._getBasicTab());
        tabs.push(this._getLookAndFeelTab());
        tabs.push(this._getWebAppTab());
        tabs.push(this._getSamlTab());
        this.tabsPostSetup(tabs);
        return tabs;
    }
    _appHomeScreenIconImageUploaded(event) {
        var image = JSON.parse(event.detail.xhr.response);
        this.appHomeScreenIconImageId = image.id;
        this._configChanged();
    }
};
__decorate([
    property({ type: Number })
], YpAdminConfigCommunity.prototype, "appHomeScreenIconImageId", void 0);
__decorate([
    property({ type: String })
], YpAdminConfigCommunity.prototype, "hostnameExample", void 0);
__decorate([
    property({ type: Boolean })
], YpAdminConfigCommunity.prototype, "hasSamlLoginProvider", void 0);
__decorate([
    property({ type: Array })
], YpAdminConfigCommunity.prototype, "availableCommunityFolders", void 0);
__decorate([
    property({ type: Number })
], YpAdminConfigCommunity.prototype, "ssnLoginListDataId", void 0);
__decorate([
    property({ type: Number })
], YpAdminConfigCommunity.prototype, "ssnLoginListDataCount", void 0);
__decorate([
    property({ type: Number })
], YpAdminConfigCommunity.prototype, "inCommunityFolderId", void 0);
__decorate([
    property({ type: Number })
], YpAdminConfigCommunity.prototype, "signupTermsPageId", void 0);
__decorate([
    property({ type: Number })
], YpAdminConfigCommunity.prototype, "welcomePageId", void 0);
__decorate([
    property({ type: String })
], YpAdminConfigCommunity.prototype, "communityAccess", void 0);
YpAdminConfigCommunity = __decorate([
    customElement("yp-admin-config-community")
], YpAdminConfigCommunity);
export { YpAdminConfigCommunity };
//# sourceMappingURL=yp-admin-config-community.js.map