var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/progress/linear-progress.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import "../yp-survey/yp-structured-question-edit.js";
import "@trystan2k/fleshy-jsoneditor/fleshy-jsoneditor.js";
import { YpAdminConfigBase, defaultLtpConfiguration, defaultLtpPromptsConfiguration, } from "./yp-admin-config-base.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
//import { YpEmojiSelector } from './@yrpri/common/yp-emoji-selector.js';
//import './@yrpri/common/yp-emoji-selector.js';
import "../yp-file-upload/yp-file-upload.js";
//import './@yrpri/yp-theme/yp-theme-selector.js';
import "../yp-app/yp-language-selector.js";
import "./allOurIdeas/aoi-earl-ideas-editor.js";
var GroupType;
(function (GroupType) {
    GroupType[GroupType["ideaGeneration"] = 0] = "ideaGeneration";
    GroupType[GroupType["allOurIdeas"] = 1] = "allOurIdeas";
})(GroupType || (GroupType = {}));
const defaultAiAnalysisJson = {
    analyses: [
        {
            ideasLabel: "Three most popular ideas",
            ideasIdsRange: 3,
            analysisTypes: [
                {
                    label: "Main points for",
                    contextPrompt: "You will analyze and report main points in favor of the three most popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points in favor of those ideas. Output in the format of a very short idea name then three sub bullets with the points in favor of. Never use bold markup code.",
                },
                {
                    label: "Main points against",
                    contextPrompt: "You will analyze and report main points against the three most popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points against those ideas. Output in the format of a very short idea name then three sub bullets with the points against. Never use bold markup code.",
                },
            ],
        },
        {
            ideasLabel: "Three least popular ideas",
            ideasIdsRange: -3,
            analysisTypes: [
                {
                    label: "Main points for",
                    contextPrompt: "You will analyze and report main points in favor of the three least popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points in favor of those ideas. Output in the format of a very short idea name then three sub bullets with the points in favor of. Never use bold markup code.",
                },
                {
                    label: "Main points against",
                    contextPrompt: "You will analyze and report main points against the three least popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points against those ideas. Output in the format of a very short idea name then three sub bullets with the points against. Never use bold markup code.",
                },
            ],
        },
    ],
};
let YpAdminConfigGroup = class YpAdminConfigGroup extends YpAdminConfigBase {
    constructor() {
        super();
        this.groupAccess = "open_to_community";
        this.gettingImageColor = false;
        this.groupTypeIndex = 1;
        this.endorsementButtonsDisabled = false;
        this.groupTypeOptions = ["ideaGeneration", "allOurIdeas"];
        this.groupAccessOptions = {
            0: "public",
            1: "closed",
            2: "secret",
            3: "open_to_community",
        };
        this.action = "/groups";
        this.group = this.collection;
    }
    static get styles() {
        return [
            super.styles,
            css `
        .mainImage {
          width: 432px;
          height: 243px;
        }

        .accessHeader {
          font-weight: bold;
          margin: 8px;
        }

        label {
          padding: 8px;
        }

        md-radio {
          margin-right: 4px;
        }

        fleshy-jsoneditor {
          width: 960px;
        }
      `,
        ];
    }
    async imageLoaded(event) {
        try {
            this.gettingImageColor = true;
            let ypImageUrl = this.ypImageUrl;
            const imageYp = event.detail.imageYp;
            const imgObj = new Image();
            imgObj.src = ypImageUrl + "?" + new Date().getTime();
            imgObj.setAttribute("crossOrigin", "");
            await imgObj.decode();
            const newThemeColor = await imageYp.getThemeColorsFromImage(imgObj);
            this.gettingImageColor = false;
            if (newThemeColor) {
                this.fireGlobal("yp-theme-color", newThemeColor);
                this.detectedThemeColor = newThemeColor;
                this._configChanged();
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    _setGroupType(event) {
        const index = event.target.selectedIndex;
        this.groupTypeIndex = index;
        this.group.configuration.groupType = index;
        this._configChanged();
        this.configTabs = this.setupConfigTabs();
    }
    renderGroupTypeSelection() {
        return html `
      <md-outlined-select
        .label="${this.t("selectType")}"
        @change="${this._setGroupType}"
      >
        ${this.groupTypeOptions.map((typeOption, index) => html `
            <md-select-option ?selected="${this.groupTypeIndex == index}"
              >${this.t(typeOption)}</md-select-option
            >
          `)}
      </md-outlined-select>
    `;
    }
    renderHeader() {
        return this.collection
            ? html `
          <div class="layout horizontal wrap topInputContainer">
            ${this.renderLogoMedia()}
            <div class="layout vertical">
              ${this.renderNameAndDescription()}
              ${this.renderGroupTypeSelection()}
            </div>
            <div>${this.renderSaveButton()}</div>
          </div>
          ${this.uploadedLogoImageId ? this.renderImage() : nothing}

          <input
            type="hidden"
            name="appHomeScreenIconImageId"
            value="${this.appHomeScreenIconImageId?.toString() || ""}"
          />
        `
            : nothing;
    }
    renderImage() {
        const ypImage = this.ypImageUrl;
        return html `
      <div class="layout horizontal center center">
        <div class="layout vertical">
          <yp-image
            class="mainImage"
            @loaded="${this.imageLoaded}"
            sizing="contain"
            .skipCloudFlare="${true}"
            .src="${ypImage}"
          ></yp-image>
          ${this.gettingImageColor
            ? html ` <md-linear-progress indeterminate></md-linear-progress> `
            : nothing}
        </div>
      </div>
    `;
    }
    getAccessTokenName() {
        if (this.groupAccess == "open_to_community") {
            return "open_to_community";
        }
        else if (this.groupAccess == "public") {
            return "open_to_community";
        }
        else {
            return "secret";
        }
    }
    renderHiddenInputs() {
        return html `
      <input
        type="hidden"
        name="objectives"
        value="${this.collection?.description}"
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
      ${(this.collection?.configuration).allOurIdeas
            ? html `
            <input
              type="hidden"
              name="allOurIdeas"
              value="${JSON.stringify((this.collection?.configuration)
                .allOurIdeas)}"
            />
          `
            : nothing}

      <input type="hidden" name="${this.getAccessTokenName()}" value="1" />

      <input type="hidden" name="groupType" value="${this.groupTypeIndex}" />

      ${this.endorsementButtons
            ? html `
            <input
              type="hidden"
              name="endorsementButtons"
              value="${this.endorsementButtons}"
            />
          `
            : nothing}
      ${this.detectedThemeColor
            ? html `<input
            type="hidden"
            name="themeColor"
            value="${this.detectedThemeColor}"
          />`
            : nothing}
    `;
    }
    _descriptionChanged(event) {
        const description = event.target.value;
        this.group.description = description;
        this.group.objectives = description;
        super._descriptionChanged(event);
    }
    _logoImageUploaded(event) {
        var image = JSON.parse(event.detail.xhr.response);
        this.uploadedLogoImageId = image.id;
        const formats = JSON.parse(image.formats);
        this._configChanged();
        this.ypImageUrl = formats[1];
    }
    connectedCallback() {
        super.connectedCallback();
        this.group = this.collection;
    }
    _clear() {
        super._clear();
        this.appHomeScreenIconImageId = undefined;
    }
    updated(changedProperties) {
        if (changedProperties.has("collection") && this.collection) {
            this.group = this.collection;
            this.currentLogoImages = this.collection.GroupLogoImages;
            this.collection.description = this.group.objectives;
            this.group.description = this.group.objectives;
            this.groupAccess = this.groupAccessOptions[this.group.access];
            if (!this.collection.configuration.ltp) {
                this.collection.configuration.ltp =
                    defaultLtpConfiguration;
            }
            else if (!this.collection.configuration.ltp.crt
                .prompts) {
                this.collection.configuration.ltp.crt.prompts = defaultLtpPromptsConfiguration();
            }
            if (this.collection.configuration.allOurIdeas &&
                this.collection.configuration.allOurIdeas
                    .earl &&
                this.collection.configuration.allOurIdeas
                    .earl.question) {
                this.aoiQuestionName = this.collection.configuration.allOurIdeas.earl.question.name;
            }
            this.groupTypeIndex = this.group.configuration.groupType || 0;
            this.endorsementButtons = this.group.configuration.endorsementButtons;
            this._setupTranslations();
            //this._updateEmojiBindings();
            if (this.collection.CommunityLogoVideos &&
                this.collection.CommunityLogoVideos.length > 0) {
                this.uploadedVideoId = this.collection.CommunityLogoVideos[0].id;
            }
            else if (this.collection.GroupLogoVideos &&
                this.collection.GroupLogoVideos.length > 0) {
                this.uploadedVideoId = this.collection.GroupLogoVideos[0].id;
            }
        }
        if (changedProperties.has("collectionId") && this.collectionId) {
            this._collectionIdChanged();
        }
        super.updated(changedProperties);
    }
    _collectionIdChanged() {
        if (this.collectionId == "new" || this.collectionId == "newFolder") {
            this.action = `/groups/${this.parentCollectionId}`;
            this.collection = {
                id: -1,
                name: "",
                description: "",
                objectives: "",
                access: 0,
                status: "active",
                counter_points: 0,
                counter_posts: 0,
                counter_users: 0,
                configuration: {
                    ltp: defaultLtpConfiguration,
                },
                community_id: this.parentCollectionId,
                hostname: "",
                is_group_folder: this.collectionId == "newFolder" ? true : false,
            };
            this.group = this.collection;
        }
        else {
            this.action = `/groups/${this.collectionId}`;
        }
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
            if (this.uploadedVideoId) {
                await window.adminServerApi.addVideoToCollection(domain.id, {
                    videoId: this.uploadedVideoId,
                }, "domain");
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
    _finishRedirect(group) {
        YpNavHelpers.redirectTo("/group/" + group.id);
        window.appGlobals.activity("completed", "editGroup");
    }
    _getAccessTab() {
        return {
            name: "access",
            icon: "code",
            items: [
                {
                    text: "groupAccess",
                    type: "html",
                    templateData: html `
            <div id="access" name="access" class="layout vertical access">
              <div class="accessHeader">
                ${this.t("access")} ${this.groupAccess}
              </div>
              <label>
                <md-radio
                  value="open_to_community"
                  name="access"
                  @change="${this._groupAccessChanged}"
                  ?checked="${this.groupAccess == "open_to_community"}"
                ></md-radio
                >${this.t("group.openToCommunity")}</label
              >
              <label>
                <md-radio
                  value="secret"
                  name="access"
                  @change="${this._groupAccessChanged}"
                  ?checked="${this.groupAccess == "secret"}"
                ></md-radio
                >${this.t("private")}
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
              @selected="${this._statusSelected}"
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
                    text: "allowAnonymousUsers",
                    type: "checkbox",
                    value: this.group.configuration.allowAnonymousUsers,
                    translationToken: "allowAnonymousUsers",
                },
                {
                    text: "anonymousAskRegistrationQuestions",
                    type: "checkbox",
                    value: this.group.configuration.anonymousAskRegistrationQuestions,
                    translationToken: "anonymousAskRegistrationQuestions",
                },
                {
                    text: "allowAnonymousAutoLogin",
                    type: "checkbox",
                    value: this.group.configuration.allowAnonymousAutoLogin,
                    translationToken: "allowAnonymousAutoLogin",
                    disabled: !this.group.configuration.allowAnonymousUsers,
                },
                {
                    text: "allowOneTimeLoginWithName",
                    type: "checkbox",
                    value: this.group.configuration.allowOneTimeLoginWithName,
                    translationToken: "allowOneTimeLoginWithName",
                },
                {
                    text: "disableFacebookLoginForGroup",
                    type: "checkbox",
                    value: this.group.configuration.disableFacebookLoginForGroup,
                    translationToken: "disableFacebookLoginForGroup",
                },
                {
                    text: "forceSecureSamlLogin",
                    type: "checkbox",
                    value: this.group.configuration.forceSecureSamlLogin,
                    translationToken: "forceSecureSamlLogin",
                    disabled: !this.hasSamlLoginProvider,
                },
                {
                    text: "forceSecureSamlEmployeeLogin",
                    type: "checkbox",
                    value: this.group.configuration.forceSecureSamlEmployeeLogin,
                    translationToken: "forceSecureSamlEmployeeLogin",
                    disabled: !this.hasSamlLoginProvider,
                },
                {
                    text: "registrationQuestions",
                    type: "textarea",
                    rows: 4,
                    maxRows: 8,
                    value: this.group.configuration.registrationQuestions,
                    translationToken: "registrationQuestions",
                },
                {
                    text: "customBackURL",
                    type: "textfield",
                    maxLength: 256,
                    value: this.group.configuration.customBackURL,
                    translationToken: "customBackURL",
                },
                {
                    text: "customBackName",
                    type: "textfield",
                    maxLength: 20,
                    value: this.group.configuration.customBackName,
                    translationToken: "customBackName",
                },
                {
                    text: "optionalSortOrder",
                    type: "textfield",
                    maxLength: 4,
                    value: this.group.configuration.optionalSortOrder,
                    translationToken: "optionalSortOrder",
                },
                {
                    text: "defaultLocale",
                    type: "html",
                    templateData: html `
            <yp-language-selector
              name="defaultLocale"
              noUserEvents
              @changed="${this._configChanged}"
              .selectedLocale="${this.group.configuration.defaultLocale}"
            >
            </yp-language-selector>
          `,
                },
                {
                    text: "disableNameAutoTranslation",
                    type: "checkbox",
                    value: this.group.configuration.disableNameAutoTranslation,
                    translationToken: "disableNameAutoTranslation",
                },
            ],
        };
    }
    _groupAccessChanged(event) {
        this.groupAccess = event.target.value;
        this._configChanged();
    }
    _statusSelected(event) {
        const index = event.detail.index;
        this.status = this.collectionStatusOptions[index].name;
    }
    _getThemeTab() {
        return {
            name: "themeSettings",
            icon: "palette",
            items: [
                {
                    text: "inheritThemeFromCommunity",
                    type: "checkbox",
                    value: this.group.configuration.inheritThemeFromCommunity,
                    translationToken: "inheritThemeFromCommunity",
                    onChange: "_inheritThemeChanged",
                },
                {
                    text: "themeSelector",
                    type: "html",
                    templateData: html `
            <yp-theme-selector
              .object="${this.group}"
              .disableSelection="${this.group.configuration
                        .inheritThemeFromCommunity}"
              @yp-theme-changed="${this._themeChanged}"
              .selectedTheme="${this.themeId}"
            ></yp-theme-selector>
          `,
                },
                {
                    text: "themeOverrideColorPrimary",
                    type: "textfield",
                    maxLength: 7,
                    charCounter: true,
                    pattern: "[#-#0-9A-Fa-f]",
                    value: this.group.configuration.themeOverrideColorPrimary,
                    translationToken: "themeOverrideColorPrimary",
                },
                {
                    text: "themeOverrideColorAccent",
                    type: "textfield",
                    maxLength: 7,
                    charCounter: true,
                    pattern: "[#-#0-9A-Fa-f]",
                    value: this.group.configuration.themeOverrideColorAccent,
                    translationToken: "themeOverrideColorAccent",
                },
                {
                    text: "themeOverrideBackgroundColor",
                    type: "textfield",
                    maxLength: 7,
                    charCounter: true,
                    pattern: "[#-#0-9A-Fa-f]",
                    value: this.group.configuration.themeOverrideBackgroundColor,
                    translationToken: "themeOverrideBackgroundColor",
                },
                {
                    text: "themeOverrideColorInfo",
                    type: "textdescription",
                },
                {
                    text: "hideInfoBoxExceptForAdmins",
                    type: "checkbox",
                    value: this.group.configuration.hideInfoBoxExceptForAdmins,
                    translationToken: "hideInfoBoxExceptForAdmins",
                },
                {
                    text: "hideLogoBoxExceptOnMobile",
                    type: "checkbox",
                    value: this.group.configuration.hideLogoBoxExceptOnMobile,
                    translationToken: "hideLogoBoxExceptOnMobile",
                },
                {
                    text: "hideLogoBoxShadow",
                    type: "checkbox",
                    value: this.group.configuration.hideLogoBoxShadow,
                    translationToken: "hideLogoBoxShadow",
                },
                {
                    text: "galleryMode",
                    type: "checkbox",
                    value: this.group.configuration.galleryMode,
                    translationToken: "galleryMode",
                },
                {
                    text: "showNameUnderLogoImage",
                    type: "checkbox",
                    value: this.group.configuration.showNameUnderLogoImage,
                    translationToken: "showNameUnderLogoImage",
                },
                {
                    text: "alwaysHideLogoImage",
                    type: "checkbox",
                    value: this.group.configuration.alwaysHideLogoImage,
                    translationToken: "alwaysHideLogoImage",
                },
                {
                    text: "hideStatsAndMembership",
                    type: "checkbox",
                    value: this.group.configuration.hideStatsAndMembership,
                    translationToken: "hideStatsAndMembership",
                },
                {
                    text: "centerGroupName",
                    type: "checkbox",
                    value: this.group.configuration.centerGroupName,
                    translationToken: "centerGroupName",
                },
                {
                    text: "noGroupCardShadow",
                    type: "checkbox",
                    value: this.group.configuration.noGroupCardShadow,
                    translationToken: "noGroupCardShadow",
                },
            ],
        };
    }
    _inheritThemeChanged(event) {
        this.group.configuration.inheritThemeFromCommunity = event.target.checked;
    }
    _themeChanged(event) {
        this.themeId = event.detail;
        // Handle theme changes here
    }
    _getPostSettingsTab() {
        if (this.isGroupFolder) {
            return null;
        }
        return {
            name: "postSettings",
            icon: "create",
            items: [
                {
                    text: "canAddNewPosts",
                    type: "checkbox",
                    value: this.group.configuration.canAddNewPosts,
                    translationToken: "group.canAddNewPosts",
                },
                {
                    text: "locationHidden",
                    type: "checkbox",
                    value: this.group.configuration.locationHidden,
                    translationToken: "group.locationHidden",
                },
                {
                    text: "allowGenerativeImages",
                    type: "checkbox",
                    value: this.group.configuration.allowGenerativeImages,
                    translationToken: "allowGenerativeImages",
                },
                {
                    text: "showWhoPostedPosts",
                    type: "checkbox",
                    value: this.group.configuration.showWhoPostedPosts,
                    translationToken: "group.showWhoPostedPosts",
                },
                {
                    text: "askUserIfNameShouldBeDisplayed",
                    type: "checkbox",
                    value: this.group.configuration.askUserIfNameShouldBeDisplayed,
                    translationToken: "askUserIfNameShouldBeDisplayed",
                },
                {
                    text: "disableDebate",
                    type: "checkbox",
                    value: this.group.configuration.disableDebate,
                    translationToken: "disableDebate",
                },
                {
                    text: "allowAdminsToDebate",
                    type: "checkbox",
                    value: this.group.configuration.allowAdminsToDebate,
                    translationToken: "allowAdminsToDebate",
                },
                {
                    text: "postDescriptionLimit",
                    type: "textfield",
                    maxLength: 4,
                    pattern: "[0-9]",
                    value: this.group.configuration.postDescriptionLimit,
                    translationToken: "postDescriptionLimit",
                    charCounter: true,
                },
                {
                    text: "allowPostVideoUploads",
                    type: "checkbox",
                    value: this.hasVideoUpload,
                    translationToken: "allowPostVideoUploads",
                    disabled: !this.hasVideoUpload,
                },
                {
                    text: "videoPostUploadLimitSec",
                    type: "textfield",
                    maxLength: 3,
                    pattern: "[0-9]",
                    value: this.group.configuration.videoPostUploadLimitSec,
                    translationToken: "videoPostUploadLimitSec",
                    disabled: !this.hasVideoUpload,
                },
                {
                    text: "allowPostAudioUploads",
                    type: "checkbox",
                    value: this.hasAudioUpload,
                    translationToken: "allowPostAudioUploads",
                    disabled: !this.hasAudioUpload,
                },
                {
                    text: "audioPostUploadLimitSec",
                    type: "textfield",
                    maxLength: 3,
                    pattern: "[0-9]",
                    value: this.group.configuration.audioPostUploadLimitSec,
                    translationToken: "audioPostUploadLimitSec",
                    disabled: !this.hasAudioUpload,
                },
                {
                    text: "customTitleQuestionText",
                    type: "textfield",
                    maxLength: 60,
                    value: this.group.configuration.customTitleQuestionText,
                    translationToken: "customTitleQuestionText",
                },
                {
                    text: "hideNameInputAndReplaceWith",
                    type: "textfield",
                    maxLength: 60,
                    value: this.group.configuration.hideNameInputAndReplaceWith,
                    translationToken: "hideNameInputAndReplaceWith",
                },
                {
                    text: "customTabTitleNewLocation",
                    type: "textfield",
                    maxLength: 60,
                    value: this.group.configuration.customTabTitleNewLocation,
                    translationToken: "customTabTitleNewLocation",
                },
                {
                    text: "customCategoryQuestionText",
                    type: "textfield",
                    maxLength: 30,
                    value: this.group.configuration.customCategoryQuestionText,
                    translationToken: "customCategoryQuestionText",
                    charCounter: true,
                },
                {
                    text: "customFilterText",
                    type: "textfield",
                    maxLength: 17,
                    value: this.group.configuration.customFilterText,
                    translationToken: "customFilterText",
                    charCounter: true,
                },
                {
                    text: "makeCategoryRequiredOnNewPost",
                    type: "checkbox",
                    value: this.group.configuration.makeCategoryRequiredOnNewPost,
                    translationToken: "makeCategoryRequiredOnNewPost",
                },
                {
                    text: "showVideoUploadDisclaimer",
                    type: "checkbox",
                    value: this.group.configuration.showVideoUploadDisclaimer,
                    translationToken: "showVideoUploadDisclaimer",
                },
                {
                    text: "moreContactInformation",
                    type: "checkbox",
                    value: this.group.configuration.moreContactInformation,
                    translationToken: "moreContactInformation",
                },
                {
                    text: "moreContactInformationAddress",
                    type: "checkbox",
                    value: this.group.configuration.moreContactInformationAddress,
                    translationToken: "moreContactInformationAddress",
                },
                {
                    text: "attachmentsEnabled",
                    type: "checkbox",
                    value: this.group.configuration.attachmentsEnabled,
                    translationToken: "attachmentsEnabled",
                },
                {
                    text: "useContainImageMode",
                    type: "checkbox",
                    value: this.group.configuration.useContainImageMode,
                    translationToken: "useContainImageMode",
                },
                {
                    text: "hideNewestFromFilter",
                    type: "checkbox",
                    value: this.group.configuration.hideNewestFromFilter,
                    translationToken: "hideNewestFromFilter",
                },
                {
                    text: "hideNewPost",
                    type: "checkbox",
                    value: this.group.configuration.hideNewPost,
                    translationToken: "hideNewPost",
                },
                {
                    text: "hideRecommendationOnNewsFeed",
                    type: "checkbox",
                    value: this.group.configuration.hideRecommendationOnNewsFeed,
                    translationToken: "hideRecommendationOnNewsFeed",
                },
                {
                    text: "hideNewPostOnPostPage",
                    type: "checkbox",
                    value: this.group.configuration.hideNewPostOnPostPage,
                    translationToken: "hideNewPostOnPostPage",
                },
                {
                    text: "hidePostCover",
                    type: "checkbox",
                    value: this.group.configuration.hidePostCover,
                    translationToken: "hidePostCover",
                },
                {
                    text: "hidePostDescription",
                    type: "checkbox",
                    value: this.group.configuration.hidePostDescription,
                    translationToken: "hidePostDescription",
                },
                {
                    text: "hidePostActionsInGrid",
                    type: "checkbox",
                    value: this.group.configuration.hidePostActionsInGrid,
                    translationToken: "hidePostActionsInGrid",
                },
                {
                    text: "hideDebateIcon",
                    type: "checkbox",
                    value: this.group.configuration.hideDebateIcon,
                    translationToken: "hideDebateIcon",
                },
                {
                    text: "hideSharing",
                    type: "checkbox",
                    value: this.group.configuration.hideSharing,
                    translationToken: "hideSharing",
                },
                {
                    text: "hideEmoji",
                    type: "checkbox",
                    value: this.group.configuration.hideEmoji,
                    translationToken: "hideEmoji",
                },
                {
                    text: "hidePostFilterAndSearch",
                    type: "checkbox",
                    value: this.group.configuration.hidePostFilterAndSearch,
                    translationToken: "hidePostFilterAndSearch",
                },
                {
                    text: "hideMediaInput",
                    type: "checkbox",
                    value: this.group.configuration.hideMediaInput,
                    translationToken: "hideMediaInput",
                },
                {
                    text: "hidePostImageUploads",
                    type: "checkbox",
                    value: this.group.configuration.hidePostImageUploads,
                    translationToken: "hidePostImageUploads",
                    disabled: !this.hasVideoUpload,
                },
                {
                    text: "disablePostPageLink",
                    type: "checkbox",
                    value: this.group.configuration.disablePostPageLink,
                    translationToken: "disablePostPageLink",
                },
                {
                    text: "defaultLocationLongLat",
                    type: "textfield",
                    maxLength: 100,
                    value: this.group.configuration.defaultLocationLongLat,
                    translationToken: "defaultLocationLongLat",
                    style: "width: 300px;",
                },
                {
                    text: "forcePostSortMethodAs",
                    type: "textfield",
                    maxLength: 12,
                    value: this.group.configuration.forcePostSortMethodAs,
                    translationToken: "forcePostSortMethodAs",
                },
                {
                    text: "descriptionTruncateAmount",
                    type: "textfield",
                    maxLength: 4,
                    pattern: "[0-9]",
                    value: this.group.configuration.descriptionTruncateAmount,
                    translationToken: "descriptionTruncateAmount",
                },
                {
                    text: "descriptionSimpleFormat",
                    type: "checkbox",
                    value: this.group.configuration.descriptionSimpleFormat,
                    translationToken: "descriptionSimpleFormat",
                },
                {
                    text: "transcriptSimpleFormat",
                    type: "checkbox",
                    value: this.group.configuration.transcriptSimpleFormat,
                    translationToken: "transcriptSimpleFormat",
                },
                {
                    text: "allPostsBlockedByDefault",
                    type: "checkbox",
                    value: this.group.configuration.allPostsBlockedByDefault,
                    translationToken: "allPostsBlockedByDefault",
                },
                {
                    text: "exportSubCodesForRadiosAndCheckboxes",
                    type: "checkbox",
                    value: this.group.configuration.exportSubCodesForRadiosAndCheckboxes,
                    translationToken: "exportSubCodesForRadiosAndCheckboxes",
                },
                {
                    text: "structuredQuestions",
                    type: "textarea",
                    rows: 4,
                    maxRows: 8,
                    value: this.group.configuration.structuredQuestions,
                    translationToken: "structuredQuestions",
                    onChange: "_structuredQuestionsChanged",
                },
                {
                    text: "structuredQuestionsJsonErrorInfo",
                    type: "textdescription",
                    translationToken: "structuredQuestionsJsonFormatNotValid",
                    hidden: !this.structuredQuestionsJsonError,
                },
                {
                    text: "structuredQuestionsInfo",
                    type: "textdescription",
                    translationToken: "structuredQuestionsInfo",
                },
                {
                    text: "uploadDocxSurveyFormat",
                    type: "html",
                    templateData: html `
            <yp-file-upload
              id="docxSurveyUpload"
              raised
              multi="false"
              accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              .target="${this
                        .apiEndpoint}/groups/-1/convert_docx_survey_to_json"
              method="PUT"
              @success="${this._haveUploadedDocxSurvey}"
            >
              <iron-icon class="icon" icon="sort"></iron-icon>
              <span>${this.t("uploadDocxSurveyFormat")}</span>
            </yp-file-upload>
          `,
                },
                {
                    text: "alternativeTextForNewIdeaButton",
                    type: "textfield",
                    maxLength: 30,
                    value: this.group.configuration.alternativeTextForNewIdeaButton,
                    translationToken: "alternativeTextForNewIdeaButton",
                    charCounter: true,
                },
                {
                    text: "alternativeTextForNewIdeaButtonClosed",
                    type: "textfield",
                    maxLength: 30,
                    value: this.group.configuration.alternativeTextForNewIdeaButtonClosed,
                    translationToken: "alternativeTextForNewIdeaButtonClosed",
                    charCounter: true,
                },
                {
                    text: "alternativeTextForNewIdeaButtonHeader",
                    type: "textfield",
                    maxLength: 30,
                    value: this.group.configuration.alternativeTextForNewIdeaButtonHeader,
                    translationToken: "alternativeTextForNewIdeaButtonHeader",
                    charCounter: true,
                },
                {
                    text: "alternativeTextForNewIdeaSaveButton",
                    type: "textfield",
                    maxLength: 20,
                    value: this.group.configuration.alternativeTextForNewIdeaSaveButton,
                    translationToken: "alternativeTextForNewIdeaSaveButton",
                    charCounter: true,
                },
                {
                    text: "customThankYouTextNewPosts",
                    type: "textfield",
                    maxLength: 120,
                    value: this.group.configuration.customThankYouTextNewPosts,
                    translationToken: "customThankYouTextNewPosts",
                    charCounter: true,
                },
                {
                    text: "defaultPostImage",
                    type: "html",
                    templateData: html `
            <yp-file-upload
              id="defaultPostImageUpload"
              raised
              multi="false"
              .target="${this.apiEndpoint}/images?itemType=group-logo"
              method="POST"
              @success="${this._defaultPostImageUploaded}"
            >
              <iron-icon class="icon" icon="photo-camera"></iron-icon>
              <span>${this.t("defaultPostImage")}</span>
            </yp-file-upload>
          `,
                },
                {
                    text: "defaultDataImage",
                    type: "html",
                    templateData: html `
            <yp-file-upload
              id="defaultDataImageUpload"
              raised
              multi="false"
              .target="${this.apiEndpoint}/images?itemType=group-logo"
              method="POST"
              @success="${this._defaultDataImageUploaded}"
            >
              <iron-icon class="icon" icon="photo-camera"></iron-icon>
              <span>${this.t("defaultDataImage")}</span>
            </yp-file-upload>
          `,
                },
            ],
        };
    }
    _defaultDataImageUploaded(event) {
        var image = JSON.parse(event.detail.xhr.response);
        this.group.configuration.defaultDataImageId = image.id;
        this.configChanged = true;
    }
    _defaultPostImageUploaded(event) {
        var image = JSON.parse(event.detail.xhr.response);
        this.group.configuration.uploadedDefaultPostImageId = image.id;
        this.configChanged = true;
    }
    _haveUploadedDocxSurvey(event) {
        const detail = event.detail;
        if (detail.xhr && detail.xhr.response) {
            let responseDetail = JSON.parse(detail.xhr.response);
            responseDetail.jsonContent = JSON.stringify(JSON.parse(responseDetail.jsonContent));
            this.group.configuration.structuredQuestions = responseDetail.jsonContent;
        }
    }
    _getVoteSettingsTab() {
        return {
            name: "voteSettings",
            icon: "thumbs_up_down",
            items: [
                {
                    text: "endorsementButtons",
                    type: "html",
                    templateData: html `
            <md-outlined-select
              .label="${this.t("endorsementButtons")}"
              .disabled="${this.endorsementButtonsDisabled}"
              @change="${this._endorsementButtonsSelected}"
            >
              ${this.endorsementButtonsOptions?.map((buttonsSelection, index) => html `
                  <md-select-option
                    ?selected="${this.endorsementButtonsIndex == index}"
                    >${buttonsSelection.translatedName}</md-select-option
                  >
                `)}
            </md-outlined-select>
          `,
                },
                {
                    text: "canVote",
                    type: "checkbox",
                    value: this.group.configuration.canVote,
                    translationToken: "group.canVote",
                },
                {
                    text: "hideVoteCount",
                    type: "checkbox",
                    value: this.group.configuration.hideVoteCount,
                    translationToken: "hideVoteCount",
                },
                {
                    text: "hideVoteCountUntilVoteCompleted",
                    type: "checkbox",
                    value: this.group.configuration.hideVoteCountUntilVoteCompleted,
                    translationToken: "hideVoteCountUntilVoteCompleted",
                },
                {
                    text: "hideDownVoteForPost",
                    type: "checkbox",
                    value: this.group.configuration.hideDownVoteForPost,
                    translationToken: "hideDownVoteForPost",
                },
                {
                    text: "maxNumberOfGroupVotes",
                    type: "textfield",
                    maxLength: 4,
                    pattern: "[0-9]",
                    value: this.group.configuration.maxNumberOfGroupVotes,
                    translationToken: "maxNumberOfGroupVotes",
                },
                {
                    text: "customVoteUpHoverText",
                    type: "textfield",
                    maxLength: 100,
                    charCounter: true,
                    value: this.group.configuration.customVoteUpHoverText,
                    translationToken: "customVoteUpHoverText",
                },
                {
                    text: "customVoteDownHoverText",
                    type: "textfield",
                    maxLength: 100,
                    charCounter: true,
                    value: this.group.configuration.customVoteDownHoverText,
                    translationToken: "customVoteDownHoverText",
                },
                {
                    text: "customRatingsText",
                    type: "textarea",
                    rows: 2,
                    maxRows: 2,
                    value: this.group.configuration.customRatingsText,
                    translationToken: "customRatings",
                },
                {
                    text: "customRatingsInfo",
                    type: "textdescription",
                },
            ],
        };
    }
    get endorsementButtonsOptions() {
        if (this.t) {
            return [
                { name: "hearts", translatedName: this.t("endorsementButtonsHeart") },
                { name: "arrows", translatedName: this.t("endorsementArrows") },
                { name: "thumbs", translatedName: this.t("endorsementThumbs") },
                { name: "hats", translatedName: this.t("endorsementHats") },
            ];
        }
        else {
            return [];
        }
    }
    _endorsementButtonsSelected(event) {
        const index = event.target.selectedIndex;
        this.endorsementButtons = this.endorsementButtonsOptions[index].name;
        debugger;
        this._configChanged();
    }
    get endorsementButtonsIndex() {
        if (this.endorsementButtonsOptions) {
            for (let i = 0; i < this.endorsementButtonsOptions.length; i++) {
                if (this.endorsementButtonsOptions[i].name == this.endorsementButtons)
                    return i;
            }
            return -1;
        }
        else {
            return -1;
        }
    }
    _customRatingsTextChanged(event) {
        // Handle custom ratings text changes here
    }
    _getPointSettingsTab() {
        return {
            name: "pointSettings",
            icon: "stars",
            items: [
                {
                    text: "newPointOptional",
                    type: "checkbox",
                    value: this.group.configuration.newPointOptional,
                    translationToken: "newPointOptional",
                },
                {
                    text: "hideNewPointOnNewIdea",
                    type: "checkbox",
                    value: this.group.configuration.hideNewPointOnNewIdea,
                    translationToken: "hideNewPointOnNewIdea",
                },
                {
                    text: "hidePointAuthor",
                    type: "checkbox",
                    value: this.group.configuration.hidePointAuthor,
                    translationToken: "hidePointAuthor",
                },
                {
                    text: "hidePointAgainst",
                    type: "checkbox",
                    value: this.group.configuration.hidePointAgainst,
                    translationToken: "hidePointAgainst",
                },
                {
                    text: "pointCharLimit",
                    type: "textfield",
                    maxLength: 4,
                    pattern: "[0-9]",
                    value: this.group.configuration.pointCharLimit,
                    translationToken: "pointCharLimit",
                },
                {
                    text: "alternativePointForHeader",
                    type: "textfield",
                    maxLength: 100,
                    charCounter: true,
                    value: this.group.configuration.alternativePointForHeader,
                    translationToken: "alternativePointForHeader",
                },
                {
                    text: "alternativePointAgainstHeader",
                    type: "textfield",
                    maxLength: 100,
                    charCounter: true,
                    value: this.group.configuration.alternativePointAgainstHeader,
                    translationToken: "alternativePointAgainstHeader",
                },
                {
                    text: "alternativePointForLabel",
                    type: "textfield",
                    maxLength: 100,
                    charCounter: true,
                    value: this.group.configuration.alternativePointForLabel,
                    translationToken: "alternativePointForLabel",
                },
                {
                    text: "alternativePointAgainstLabel",
                    type: "textfield",
                    maxLength: 100,
                    charCounter: true,
                    value: this.group.configuration.alternativePointAgainstLabel,
                    translationToken: "alternativePointAgainstLabel",
                },
                {
                    text: "allowPointVideoUploads",
                    type: "checkbox",
                    value: this.group.configuration.allowPostVideoUploads,
                    translationToken: "allowPointVideoUploads",
                    disabled: !this.hasVideoUpload,
                },
                {
                    text: "videoPointUploadLimitSec",
                    type: "textfield",
                    maxLength: 3,
                    pattern: "[0-9]",
                    value: this.group.configuration.videoPointUploadLimitSec,
                    translationToken: "videoPointUploadLimitSec",
                    disabled: !this.hasVideoUpload,
                },
                {
                    text: "allowPointAudioUploads",
                    type: "checkbox",
                    value: this.group.configuration.allowPointAudioUploads,
                    translationToken: "allowPointAudioUploads",
                    disabled: !this.hasAudioUpload,
                },
                {
                    text: "audioPointUploadLimitSec",
                    type: "textfield",
                    maxLength: 3,
                    pattern: "[0-9]",
                    value: this.group.configuration.audioPointUploadLimitSec,
                    translationToken: "audioPointUploadLimitSec",
                    disabled: !this.hasAudioUpload,
                },
                {
                    text: "disableMachineTranscripts",
                    type: "checkbox",
                    value: this.group.configuration.disableMachineTranscripts,
                    translationToken: "disableMachineTranscripts",
                },
                {
                    text: "allowAdminAnswersToPoints",
                    type: "checkbox",
                    value: this.group.configuration.allowAdminAnswersToPoints,
                    translationToken: "allowAdminAnswersToPoints",
                },
                {
                    text: "customAdminCommentsTitle",
                    type: "textfield",
                    maxLength: 50,
                    charCounter: true,
                    value: this.group.configuration.customAdminCommentsTitle,
                    translationToken: "customAdminCommentsTitle",
                },
            ],
        };
    }
    _getAdditionalConfigTab() {
        return {
            name: "additionalGroupConfig",
            icon: "settings",
            items: [
                {
                    text: "hideAllTabs",
                    type: "checkbox",
                    value: this.group.configuration.hideAllTabs,
                    translationToken: "hideAllTabs",
                },
                {
                    text: "hideGroupLevelTabs",
                    type: "checkbox",
                    value: this.group.configuration.hideGroupLevelTabs,
                    translationToken: "hideGroupLevelTabs",
                },
                {
                    text: "hideHelpIcon",
                    type: "checkbox",
                    value: this.group.configuration.hideHelpIcon,
                    translationToken: "hideHelpIcon",
                },
                {
                    text: "useCommunityTopBanner",
                    type: "checkbox",
                    value: this.group.configuration.useCommunityTopBanner,
                    translationToken: "useCommunityTopBanner",
                },
                {
                    text: "makeMapViewDefault",
                    type: "checkbox",
                    value: this.group.configuration.makeMapViewDefault,
                    translationToken: "makeMapViewDefault",
                },
                {
                    text: "simpleFormatDescription",
                    type: "checkbox",
                    value: this.group.configuration.simpleFormatDescription,
                    translationToken: "simpleFormatDescription",
                },
                {
                    text: "resourceLibraryLinkMode",
                    type: "checkbox",
                    value: this.group.configuration.resourceLibraryLinkMode,
                    translationToken: "resourceLibraryLinkMode",
                },
                {
                    text: "collapsableTranscripts",
                    type: "checkbox",
                    value: this.group.configuration.collapsableTranscripts,
                    translationToken: "collapsableTranscripts",
                },
                {
                    text: "allowWhatsAppSharing",
                    type: "checkbox",
                    value: this.group.configuration.allowWhatsAppSharing,
                    translationToken: "allowWhatsAppSharing",
                },
                {
                    text: "actAsLinkToCommunityId",
                    type: "textfield",
                    maxLength: 8,
                    pattern: "[0-9]",
                    value: this.group.configuration.actAsLinkToCommunityId,
                    translationToken: "actAsLinkToCommunityId",
                },
                {
                    text: "maxDaysBackForRecommendations",
                    type: "textfield",
                    maxLength: 5,
                    pattern: "[0-9]",
                    value: this.group.configuration.maxDaysBackForRecommendations,
                    translationToken: "maxDaysBackForRecommendations",
                },
                {
                    text: "customUserNamePrompt",
                    type: "textfield",
                    maxLength: 45,
                    charCounter: true,
                    value: this.group.configuration.customUserNamePrompt,
                    translationToken: "customUserNamePrompt",
                },
                {
                    text: "customTermsIntroText",
                    type: "textfield",
                    maxLength: 100,
                    charCounter: true,
                    value: this.group.configuration.customTermsIntroText,
                    translationToken: "customTermsIntroText",
                },
                {
                    text: "externalGoalTriggerUrl",
                    type: "textfield",
                    value: this.group.configuration.externalGoalTriggerUrl,
                    translationToken: "externalGoalTriggerUrl",
                },
                {
                    text: "externalId",
                    type: "textfield",
                    value: this.group.configuration.externalId,
                    translationToken: "externalId",
                },
                {
                    text: "usePostListFormatOnDesktop",
                    type: "checkbox",
                    value: this.group.configuration.usePostListFormatOnDesktop,
                    translationToken: "usePostListFormatOnDesktop",
                },
                {
                    text: "usePostTags",
                    type: "checkbox",
                    value: this.group.configuration.usePostTags,
                    translationToken: "usePostTags",
                },
                {
                    text: "usePostTagsForPostListItems",
                    type: "checkbox",
                    value: this.group.configuration.usePostTagsForPostListItems,
                    translationToken: "usePostTagsForPostListItems",
                },
                {
                    text: "usePostTagsForPostCards",
                    type: "checkbox",
                    value: this.group.configuration.usePostTagsForPostCards,
                    translationToken: "usePostTagsForPostCards",
                },
                {
                    text: "forceShowDebateCountOnPost",
                    type: "checkbox",
                    value: this.group.configuration.forceShowDebateCountOnPost,
                    translationToken: "forceShowDebateCountOnPost",
                },
                {
                    text: "closeNewsfeedSubmissions",
                    type: "checkbox",
                    value: this.group.configuration.closeNewsfeedSubmissions,
                    translationToken: "closeNewsfeedSubmissions",
                },
                {
                    text: "hideNewsfeeds",
                    type: "checkbox",
                    value: this.group.configuration.hideNewsfeeds,
                    translationToken: "hideNewsfeeds",
                },
                {
                    text: "welcomeSelectPage",
                    type: "html",
                    hidden: !this.pages,
                    templateData: html `
            <md-outlined-select
              .label="${this.t("welcomeSelectPage")}"
              @selected="${this._welcomePageSelected}"
            >
              ${this.translatedPages?.map((page, index) => html `
                  <md-select-option ?selected="${this.welcomePageId == page.id}"
                    >${this._getLocalizePageTitle(page)}</md-select-option
                  >
                `)}
            </md-outlined-select>
          `,
                },
                {
                    text: "urlToReview",
                    type: "textfield",
                    value: this.group.configuration.urlToReview,
                    translationToken: "urlToReview",
                },
                {
                    text: "urlToReviewActionText",
                    type: "textfield",
                    maxLength: 30,
                    charCounter: true,
                    value: this.group.configuration.urlToReviewActionText,
                    translationToken: "urlToReviewActionText",
                },
                {
                    text: "isDataVisualizationGroup",
                    type: "checkbox",
                    value: this.group.configuration.isDataVisualizationGroup,
                    translationToken: "isDataVisualizationGroup",
                    onTap: "_isDataVisualizationGroupClick",
                },
                {
                    text: "dataForVisualization",
                    type: "textarea",
                    rows: 4,
                    maxRows: 8,
                    value: this.group.configuration.dataForVisualization,
                    translationToken: "dataForVisualization",
                    hidden: !this.isDataVisualizationGroup,
                    onChange: "_dataForVisualizationChanged",
                },
                {
                    text: "dataForVisualizationJsonError",
                    type: "textdescription",
                    hidden: !this.dataForVisualizationJsonError,
                    translationToken: "structuredQuestionsJsonFormatNotValid",
                },
                {
                    text: "moveGroupTo",
                    type: "html",
                    templateData: html `
            <md-outlined-select
              name="moveGroupTo"
              .label="${this.t("moveGroupTo")}"
              @selected="${this._moveGroupToSelected}"
            >
              ${this.groupMoveToOptions?.map((option) => html `
                  <md-select-option
                    ?selected="${this.moveGroupToId == option.id}"
                    >${option.name}</md-select-option
                  >
                `)}
            </md-outlined-select>
          `,
                },
                {
                    text: "categories.the_all",
                    type: "html",
                    templateData: html `
            <div class="subHeaders">${this.t("categories.the_all")}</div>
            <md-outlined-select
              .label="${this.t("selectCategory")}"
              @selected="${this._categorySelected}"
            >
              ${this.group.Categories?.map((category) => html `
                  <md-select-option value="${category.id}">
                    <md-icon
                      slot="icon"
                      src="${this._categoryImageSrc(category)}"
                    ></md-icon>
                    ${category.name}
                  </md-select-option>
                `)}
            </md-outlined-select>
          `,
                },
            ],
        };
    }
    earlConfigChanged(event) {
        this.group.configuration.allOurIdeas = this.$$("aoi-earl-ideas-editor").configuration;
        this.requestUpdate();
    }
    renderCreateEarl(communityId) {
        return html ` <aoi-earl-ideas-editor
      .communityId="${communityId}"
      @configuration-changed="${this.earlConfigChanged}"
      .questionName="${this.aoiQuestionName}""
      .configuration="${this.group.configuration.allOurIdeas}"
    ></aoi-earl-ideas-editor>`;
    }
    questionNameChanged(event) {
        const target = event.currentTarget;
        const value = target.value;
        const configuration = this.group.configuration.allOurIdeas;
        if (!configuration.earl) {
            configuration.earl = {
                active: true,
            };
        }
        if (!configuration.earl.question) {
            configuration.earl.question = {};
        }
        configuration.earl.question.name = value;
        this.aoiQuestionName = value;
        console.error("questionNameChanged", value);
        this.set(this.group.configuration.allOurIdeas.earl, "question.name", value);
        this.configTabs = this.setupConfigTabs();
        this._configChanged();
        this.requestUpdate();
    }
    _getAllOurIdeaTab() {
        let configuration = this.group.configuration.allOurIdeas;
        if (!configuration) {
            configuration = this.group.configuration.allOurIdeas = {};
        }
        let communityId;
        if (this.collectionId === "new") {
            communityId = this.parentCollectionId;
        }
        else {
            communityId = this.group.community_id;
        }
        return {
            name: "allOurIdeas",
            icon: "lightbulb",
            items: [
                {
                    text: "questionName",
                    type: "textarea",
                    maxLength: 140,
                    rows: 2,
                    charCounter: true,
                    value: this.aoiQuestionName,
                    translationToken: "questionName",
                    onChange: this.questionNameChanged,
                },
                {
                    text: "earlConfig",
                    type: "html",
                    templateData: this.renderCreateEarl(communityId),
                },
            ],
        };
    }
    set(obj, path, value) {
        const keys = path.split(".");
        let current = obj;
        keys.forEach((key, index) => {
            if (index === keys.length - 1) {
                current[key] = value;
            }
            else {
                if (!current[key])
                    current[key] = {};
                current = current[key];
            }
        });
    }
    _updateEarl(event, earlUpdatePath) {
        this.set(this.group.configuration.allOurIdeas.earl, earlUpdatePath, event.detail.value);
        this._configChanged();
        this.requestUpdate();
    }
    _getAllOurIdeaOptionsTab() {
        let earl = this.group.configuration.allOurIdeas?.earl;
        return {
            name: "allOurIdeasOptions",
            icon: "settings",
            items: [
                {
                    text: "show_cant_decide",
                    type: "checkbox",
                    onChange: (e) => this._updateEarl(e, "configuration.show_cant_decide"),
                    value: earl?.configuration.show_cant_decide,
                    translationToken: "showCantDecide",
                },
                {
                    text: "accept_new_ideas",
                    type: "checkbox",
                    onChange: (e) => this._updateEarl(e, "configuration.accept_new_ideas"),
                    value: earl?.configuration.accept_new_ideas,
                    translationToken: "acceptNewIdeas",
                },
                {
                    text: "hide_results",
                    type: "checkbox",
                    onChange: (e) => this._updateEarl(e, "configuration.hide_results"),
                    value: earl?.configuration.hide_results,
                    translationToken: "hideAoiResults",
                },
                {
                    text: "welcome_message",
                    type: "textarea",
                    rows: 5,
                    maxLength: 300,
                    value: earl?.configuration.welcome_message,
                    onChange: (e) => this._updateEarl(e, "configuration.welcome_message"),
                    translationToken: "welcomeMessage",
                },
                {
                    text: "welcome_html",
                    type: "textarea",
                    rows: 5,
                    value: earl?.configuration.welcome_html,
                    onChange: (e) => this._updateEarl(e, "configuration.welcome_html"),
                    translationToken: "welcomeHtml",
                },
                {
                    text: "analysis_config",
                    type: "textarea",
                    rows: 7,
                    value: earl?.configuration.analysis_config ||
                        JSON.stringify(defaultAiAnalysisJson, null, 2),
                    onChange: (e) => this._updateEarl(e, "configuration.analysis_config"),
                    translationToken: "aoiAiAnalysisConfig",
                },
            ],
        };
    }
    _categorySelected(event) {
        const categoryId = event.detail.value;
        // Handle category selection here, such as opening an edit dialog
    }
    _categoryImageSrc(category) {
        // Return the image source URL for the category icon
        // This function needs to be implemented based on how you retrieve the image source
        return `path/to/category/icons/${category.id}.png`;
    }
    _welcomePageSelected(event) {
        const index = event.detail.index;
        this.welcomePageId = this.translatedPages[index].id;
    }
    _isDataVisualizationGroupClick(event) {
        // Handle click event for isDataVisualizationGroup checkbox
    }
    _dataForVisualizationChanged(event) {
        // Handle change event for dataForVisualization textarea
    }
    _moveGroupToSelected(event) {
        const index = event.detail.index;
        this.moveGroupToId = this.groupMoveToOptions[index].id;
    }
    setupConfigTabs() {
        const tabs = [];
        if (this.groupTypeIndex == GroupType.ideaGeneration) {
            const postsTab = this._getPostSettingsTab();
            if (!this.isGroupFolder) {
                tabs.push(postsTab);
            }
            tabs.push(this._getVoteSettingsTab());
            tabs.push(this._getPointSettingsTab());
            tabs.push(this._getAdditionalConfigTab());
        }
        else if (this.groupTypeIndex == GroupType.allOurIdeas) {
            tabs.push(this._getAllOurIdeaTab());
            tabs.push(this._getAllOurIdeaOptionsTab());
        }
        tabs.push(this._getAccessTab());
        tabs.push(this._getThemeTab());
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
], YpAdminConfigGroup.prototype, "appHomeScreenIconImageId", void 0);
__decorate([
    property({ type: String })
], YpAdminConfigGroup.prototype, "hostnameExample", void 0);
__decorate([
    property({ type: Number })
], YpAdminConfigGroup.prototype, "signupTermsPageId", void 0);
__decorate([
    property({ type: Number })
], YpAdminConfigGroup.prototype, "welcomePageId", void 0);
__decorate([
    property({ type: String })
], YpAdminConfigGroup.prototype, "aoiQuestionName", void 0);
__decorate([
    property({ type: String })
], YpAdminConfigGroup.prototype, "status", void 0);
__decorate([
    property({ type: String })
], YpAdminConfigGroup.prototype, "groupAccess", void 0);
__decorate([
    property({ type: Boolean })
], YpAdminConfigGroup.prototype, "gettingImageColor", void 0);
__decorate([
    property({ type: String })
], YpAdminConfigGroup.prototype, "ypImageUrl", void 0);
__decorate([
    property({ type: Number })
], YpAdminConfigGroup.prototype, "groupTypeIndex", void 0);
__decorate([
    property({ type: Object })
], YpAdminConfigGroup.prototype, "group", void 0);
__decorate([
    property({ type: String })
], YpAdminConfigGroup.prototype, "detectedThemeColor", void 0);
YpAdminConfigGroup = __decorate([
    customElement("yp-admin-config-group")
], YpAdminConfigGroup);
export { YpAdminConfigGroup };
//# sourceMappingURL=yp-admin-config-group.js.map