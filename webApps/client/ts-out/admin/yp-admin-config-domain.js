var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import "../yp-survey/yp-structured-question-edit.js";
import "../yp-file-upload/yp-file-upload.js";
import { YpAdminConfigBase, defaultLtpConfiguration, defaultLtpPromptsConfiguration, } from "./yp-admin-config-base.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
//import { YpEmojiSelector } from './@yrpri/common/yp-emoji-selector.js';
//import './@yrpri/common/yp-emoji-selector.js';
import "../yp-file-upload/yp-file-upload.js";
import "../yp-theme/yp-theme-selector.js";
import "../common/languages/yp-language-selector.js";
import "./yp-admin-communities.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";
let YpAdminConfigDomain = class YpAdminConfigDomain extends YpAdminConfigBase {
    constructor() {
        super();
        this.action = "/domains";
    }
    static get styles() {
        return [super.styles, css ``];
    }
    renderHeader() {
        return this.collection
            ? html `
          <div class="layout horizontal topInputContainer">
            ${this.renderLogoMedia()}
            <div class="layout horizontal wrap">
              ${this.renderNameAndDescription()}
              <div>${this.renderSaveButton()}</div>
            </div>
          </div>

          <input
            type="hidden"
            name="appHomeScreenIconImageId"
            value="${this.appHomeScreenIconImageId?.toString() || ""}"
          />
        `
            : nothing;
    }
    renderHiddenInputs() {
        return html `
      ${(this.collection?.configuration).ltp
            ? html `
            <input
              type="hidden"
              name="ltp"
              value="${JSON.stringify((this.collection?.configuration).ltp)}"
            />
          `
            : nothing}
      ${this.collection?.configuration.theme
            ? html `
            <input
              type="hidden"
              name="theme"
              value="${JSON.stringify(this.collection?.configuration.theme)}"
            />
          `
            : nothing}
    `;
    }
    _clear() {
        super._clear();
        this.appHomeScreenIconImageId = undefined;
    }
    updated(changedProperties) {
        if (changedProperties.has("collection") && this.collection) {
            this.currentLogoImages = this.collection.DomainLogoImages;
            this._setupTranslations();
            //this._updateEmojiBindings();
            if (!this.collection.configuration.ltp) {
                this.collection.configuration.ltp =
                    defaultLtpConfiguration;
            }
            else if (!this.collection.configuration.ltp.crt
                .prompts) {
                this.collection.configuration.ltp.crt.prompts = defaultLtpPromptsConfiguration();
            }
            if (this.collection.DomainLogoVideos &&
                this.collection.DomainLogoVideos.length > 0) {
                this.uploadedVideoId = this.collection.DomainLogoVideos[0].id;
            }
        }
        if (changedProperties.has("collectionId") && this.collectionId) {
            if (this.collectionId == "new") {
                this.action = "/domains";
            }
            else {
                this.action = `/domains/${this.collectionId}`;
            }
        }
        super.updated(changedProperties);
    }
    _setupTranslations() {
        if (this.collectionId == "new") {
            this.editHeaderText = this.t("domain.new");
            this.toastText = this.t("domainToastCreated");
            this.saveText = this.t("create");
        }
        else {
            this.saveText = this.t("save");
            this.editHeaderText = this.t("domain.edit");
            this.toastText = this.t("domainToastUpdated");
        }
    }
    async _formResponse(event) {
        super._formResponse(event);
        const domain = event.detail;
        if (domain) {
            if (this.uploadedVideoId && this.connectedVideoToCollection) {
                await window.adminServerApi.addVideoToCollection(domain.id, {
                    videoId: this.uploadedVideoId,
                }, "completeAndAddToDomain");
                this._finishRedirect(domain);
            }
            else {
                this._finishRedirect(domain);
            }
        }
        else {
            console.warn("No domain found on custom redirect");
        }
    }
    _finishRedirect(domain) {
        YpNavHelpers.redirectTo("/domain/" + domain.id);
        window.appGlobals.activity("completed", "editDomain");
    }
    setupConfigTabs() {
        const tabs = [];
        tabs.push({
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
                    text: "mediaUploads",
                    type: "html",
                    templateData: html `
            <div class="layout horizontal wrap">
              ${this.renderHeaderImageUploads()}
            </div>
          `,
                },
                {
                    text: "onlyAdminsCanCreateCommunities",
                    type: "checkbox",
                    value: this.collection
                        .only_admins_can_create_communities,
                    translationToken: "domain.onlyAdminsCanCreateCommunities",
                },
                {
                    text: "hideAllTabs",
                    type: "checkbox",
                },
                {
                    text: "hideDomainNews",
                    type: "checkbox",
                },
                {
                    text: "welcomeHtmlInsteadOfCommunitiesList",
                    type: "textarea",
                    rows: 5,
                },
            ],
        });
        tabs.push({
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
        });
        tabs.push({
            name: "authApis",
            icon: "api",
            items: [
                {
                    text: "Facebook Client Id",
                    name: "facebookClientId",
                    type: "textfield",
                    value: this._getSaveCollectionPath("secret_api_keys.facebook.client_id"),
                    maxLength: 60,
                },
                {
                    text: "Facebook Client Secret",
                    name: "facebookClientSecret",
                    type: "textfield",
                    value: this._getSaveCollectionPath("secret_api_keys.facebook.client_secret"),
                    maxLength: 60,
                },
                {
                    text: "Google Client Id",
                    name: "googleClientId",
                    type: "textfield",
                    value: this._getSaveCollectionPath("secret_api_keys.google.client_id"),
                    maxLength: 60,
                },
                {
                    text: "Google Client Secret",
                    name: "googleClientSecret",
                    type: "textfield",
                    value: this._getSaveCollectionPath("secret_api_keys.google.client_secret"),
                    maxLength: 60,
                },
                {
                    text: "Discord Client Id",
                    name: "discordClientId",
                    type: "textfield",
                    value: this._getSaveCollectionPath("secret_api_keys.discord.client_id"),
                    maxLength: 60,
                },
                {
                    text: "Discord Client Secret",
                    name: "discordClientSecret",
                    type: "textfield",
                    value: this._getSaveCollectionPath("secret_api_keys.discord.client_secret"),
                    maxLength: 60,
                },
                {
                    text: "Twitter Client Id",
                    name: "twitterClientId",
                    type: "textfield",
                    value: this._getSaveCollectionPath("secret_api_keys.twitter.client_id"),
                    maxLength: 60,
                },
                {
                    text: "Twitter Client Secret",
                    name: "twitterClientSecret",
                    type: "textfield",
                    value: this._getSaveCollectionPath("secret_api_keys.twitter.client_secret"),
                    maxLength: 60,
                },
            ],
        });
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
], YpAdminConfigDomain.prototype, "appHomeScreenIconImageId", void 0);
YpAdminConfigDomain = __decorate([
    customElement("yp-admin-config-domain")
], YpAdminConfigDomain);
export { YpAdminConfigDomain };
//# sourceMappingURL=yp-admin-config-domain.js.map