import { LitElement, css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/progress/linear-progress.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";

import "../yp-survey/yp-structured-question-edit.js";

import "@trystan2k/fleshy-jsoneditor/fleshy-jsoneditor.js";

import { Layouts } from "lit-flexbox-literals";
import { YpAdminPage } from "./yp-admin-page.js";
import {
  YpAdminConfigBase,
  defaultLtpConfiguration,
  defaultLtpPromptsConfiguration,
} from "./yp-admin-config-base.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpFileUpload } from "../yp-file-upload/yp-file-upload.js";
//import { YpEmojiSelector } from './@yrpri/common/yp-emoji-selector.js';
//import './@yrpri/common/yp-emoji-selector.js';

import "../yp-file-upload/yp-file-upload.js";
import "../yp-theme/yp-theme-selector.js";
import "../common/languages/yp-language-selector.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";
import { YpImage } from "../common/yp-image.js";
import { TextField } from "@material/web/textfield/internal/text-field.js";
import { Checkbox } from "@material/web/checkbox/internal/checkbox.js";
import { MdOutlinedSelect } from "@material/web/select/outlined-select.js";

import "./allOurIdeas/aoi-earl-ideas-editor.js";
import { MdFilledTextField } from "@material/web/textfield/filled-text-field.js";
import { AoiEarlIdeasEditor } from "./allOurIdeas/aoi-earl-ideas-editor.js";
import { AoiAdminServerApi } from "./allOurIdeas/AoiAdminServerApi.js";
import { YpAdminApp } from "./yp-admin-app.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

const defaultModerationPrompt = `Only allow ideas that are relevant to the question.`;

const defaultAiAnalysisJson = {
  analyses: [
    {
      ideasLabel: "Three most popular ideas",
      ideasIdsRange: 3,
      analysisTypes: [
        {
          label: "Main points for",
          contextPrompt:
            "You will analyze and report main points in favor of the three most popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points in favor of those ideas. Output in the format of a very short idea name then three sub bullets with the points in favor of. Never use bold markup code.",
        },
        {
          label: "Main points against",
          contextPrompt:
            "You will analyze and report main points against the three most popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points against those ideas. Output in the format of a very short idea name then three sub bullets with the points against. Never use bold markup code.",
        },
      ],
    },
    {
      ideasLabel: "Three least popular ideas",
      ideasIdsRange: -3,
      analysisTypes: [
        {
          label: "Main points for",
          contextPrompt:
            "You will analyze and report main points in favor of the three least popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points in favor of those ideas. Output in the format of a very short idea name then three sub bullets with the points in favor of. Never use bold markup code.",
        },
        {
          label: "Main points against",
          contextPrompt:
            "You will analyze and report main points against the three least popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points against those ideas. Output in the format of a very short idea name then three sub bullets with the points against. Never use bold markup code.",
        },
      ],
    },
  ],
};

@customElement("yp-admin-config-group")
export class YpAdminConfigGroup extends YpAdminConfigBase {
  @property({ type: Number })
  appHomeScreenIconImageId: number | undefined;

  @property({ type: String })
  hostnameExample: string | undefined;

  @property({ type: Number })
  signupTermsPageId: number | undefined;

  @property({ type: Number })
  welcomePageId: number | undefined;

  @property({ type: String })
  aoiQuestionName: string | undefined;

  @property({ type: String })
  groupAccess: YpGroupAccessTypes = "open_to_community";

  @property({ type: Number })
  groupTypeIndex = 1;

  @property({ type: Object })
  group: YpGroupData;

  isDataVisualizationGroup: any;
  dataForVisualizationJsonError: any;
  groupMoveToOptions: any;
  moveGroupToId: any;
  pages: any;
  endorsementButtons: string | undefined;
  endorsementButtonsDisabled = false;
  apiEndpoint: unknown;
  isGroupFolder: any;
  structuredQuestionsJsonError: any;
  hasSamlLoginProvider: any;
  questionNameHasChanged = false;

  groupTypeOptions = ["ideaGenerationGroupType", "allOurIdeasGroupType"];

  static GroupType = {
    ideaGeneration: 0,
    allOurIdeas: 1,
  };

  constructor() {
    super();
    this.action = "/groups";
    this.group = this.collection as YpGroupData;
  }

  static override get styles() {
    return [
      super.styles,
      css`
        .mainImage {
          width: 432px;
          height: 243px;
        }

        .socialMediaCreateInfo {
          font-size: 12px;
          font-style: italic;
          text-align: center;
          padding: 8px;
        }

        .saveButtonContainer {
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

  _setGroupType(event: CustomEvent) {
    const index = (event.target as MdOutlinedSelect).selectedIndex;
    this.groupTypeIndex = index;
    this.group.configuration.groupType = index;
    this._configChanged();
    this.configTabs = this.setupConfigTabs();
    this.requestUpdate();
    this.fire("yp-request-update-on-parent");
  }

  renderGroupTypeSelection() {
    return html`
      <md-outlined-select
        .label="${this.t("selectGroupType")}"
        @change="${this._setGroupType}"
      >
        ${this.groupTypeOptions.map(
          (typeOption: any, index: any) => html`
            <md-select-option ?selected="${this.groupTypeIndex == index}"
              >${this.t(typeOption)}</md-select-option
            >
          `
        )}
      </md-outlined-select>
    `;
  }

  renderHeader() {
    return this.collection
      ? html`
          <div class="layout horizontal wrap topInputContainer">
            <div class="layout vertical">
              ${this.renderLogoMedia()}
              <div class="socialMediaCreateInfo">${this.t("socialMediaCreateInfo")}</div>
            </div>
            <div class="layout vertical">
              ${this.renderNameAndDescription()}
              ${this.renderGroupTypeSelection()}
            </div>
            <div class="saveButtonContainer">${this.renderSaveButton()}</div>
          </div>
          <input
            type="hidden"
            name="appHomeScreenIconImageId"
            value="${this.appHomeScreenIconImageId?.toString() || ""}"
          />
        `
      : nothing;
  }

  getAccessTokenName() {
    if (this.groupAccess == "open_to_community") {
      return "open_to_community";
    } else if (this.groupAccess == "public") {
      return "open_to_community";
    } else {
      return "secret";
    }
  }

  renderHiddenInputs() {
    return html`
      ${this.collection?.configuration.theme
        ? html`
            <input
              type="hidden"
              name="theme"
              value="${JSON.stringify(this.collection?.configuration.theme)}"
            />
          `
        : nothing}
      <input
        type="hidden"
        name="objectives"
        value="${this.collection?.description}"
      />

      ${window.appGlobals.originalQueryParameters["createProjectForGroup"]
        ? html`
            <input type="hidden" name="createProjectForGroup" value="true" />
          `
        : nothing}
      ${(this.collection?.configuration as YpGroupConfiguration).ltp
        ? html`
            <input
              type="hidden"
              name="ltp"
              value="${JSON.stringify(
                (this.collection?.configuration as YpGroupConfiguration).ltp
              )}"
            />
          `
        : nothing}
      ${(this.collection?.configuration as YpGroupConfiguration).allOurIdeas
        ? html`
            <input
              type="hidden"
              name="allOurIdeas"
              value="${JSON.stringify(
                (this.collection?.configuration as YpGroupConfiguration)
                  .allOurIdeas
              )}"
            />
          `
        : nothing}

      <input type="hidden" name="${this.getAccessTokenName()}" value="1" />

      <input type="hidden" name="groupType" value="${this.groupTypeIndex}" />

      <input type="hidden" name="status" value="${this.status || ""}" />

      ${this.endorsementButtons
        ? html`
            <input
              type="hidden"
              name="endorsementButtons"
              value="${this.endorsementButtons}"
            />
          `
        : nothing}
      ${this.detectedThemeColor
        ? html`<input
            type="hidden"
            name="themeColor"
            value="${this.detectedThemeColor}"
          />`
        : nothing}
    `;
  }

  override _descriptionChanged(event: CustomEvent) {
    const description = (event.target as any).value;
    this.group.description = description;
    this.group.objectives = description;
    super._descriptionChanged(event);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.group = this.collection as YpGroupData;
  }

  override _clear() {
    super._clear();
    this.appHomeScreenIconImageId = undefined;
  }

  groupAccessOptions: Record<number, YpGroupAccessTypes> = {
    0: "public",
    1: "closed",
    2: "secret",
    3: "open_to_community",
  };

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    if (changedProperties.has("collection") && this.collection) {
      this.group = this.collection as YpGroupData;
      this.currentLogoImages = (this.collection as YpGroupData).GroupLogoImages;
      this.collection.description = this.group.objectives;
      this.group.description = this.group.objectives;
      this.groupAccess = this.groupAccessOptions[
        this.group.access
      ] as YpGroupAccessTypes;

      if (!(this.collection.configuration as YpGroupConfiguration).ltp) {
        (this.collection.configuration as YpGroupConfiguration).ltp =
          defaultLtpConfiguration;
      } else if (
        !(this.collection.configuration as YpGroupConfiguration).ltp!.crt!
          .prompts
      ) {
        (
          this.collection.configuration as YpGroupConfiguration
        ).ltp!.crt!.prompts = defaultLtpPromptsConfiguration();
      }

      if (
        (this.collection.configuration as YpGroupConfiguration).allOurIdeas &&
        (this.collection.configuration as YpGroupConfiguration).allOurIdeas!
          .earl &&
        (this.collection.configuration as YpGroupConfiguration).allOurIdeas!
          .earl!.question
      ) {
        this.aoiQuestionName = (
          this.collection.configuration as YpGroupConfiguration
        ).allOurIdeas!.earl!.question!.name;
      }

      this.groupTypeIndex = this.group.configuration.groupType || 0;

      this.endorsementButtons = this.group.configuration.endorsementButtons;

      if ((this.collection as YpGroupData).status) {
        this.status = (this.collection as YpGroupData).status;
      }

      this._setupTranslations();
      //this._updateEmojiBindings();

      if (
        (this.collection as YpCommunityData).CommunityLogoVideos &&
        (this.collection as YpCommunityData).CommunityLogoVideos!.length > 0
      ) {
        this.uploadedVideoId = (
          this.collection as YpCommunityData
        ).CommunityLogoVideos![0].id;
      } else if (
        (this.collection as YpGroupData).GroupLogoVideos &&
        (this.collection as YpGroupData).GroupLogoVideos!.length > 0
      ) {
        this.uploadedVideoId = (
          this.collection as YpGroupData
        ).GroupLogoVideos![0].id;
      }
    }

    if (changedProperties.has("collectionId") && this.collectionId) {
      this._collectionIdChanged();
    }

    super.updated(changedProperties);
  }

  _collectionIdChanged() {
    if (this.collectionId == "new" || this.collectionId == "newFolder") {
      if (window.appGlobals.originalQueryParameters["createProjectForGroup"]) {
        this.parentCollectionId = window.appGlobals.domain!.id;
        this.action = `/groups/${this.parentCollectionId}/create_community_for_group`;
      } else {
        this.action = `/groups/${this.parentCollectionId}`;
      }
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
      } as YpGroupData;
      this.group = this.collection as YpGroupData;
    } else {
      this.action = `/groups/${this.collectionId}`;
    }
  }

  _setupTranslations() {
    if (this.collectionId == "new") {
      this.editHeaderText = this.t("domain.new");
      this.toastText = this.t("domainToastCreated");
      this.saveText = this.t("create");
    } else {
      this.saveText = this.t("save");
      this.editHeaderText = this.t("domain.edit");
      this.toastText = this.t("domainToastUpdated");
    }
  }

  override async _formResponse(event: CustomEvent) {
    super._formResponse(event);
    const domain = event.detail;
    if (domain) {
      if (this.uploadedVideoId) {
        await window.adminServerApi.addVideoToCollection(
          domain.id,
          {
            videoId: this.uploadedVideoId,
          },
          "domain"
        );
        this._finishRedirect(domain);
      } else {
        this._finishRedirect(domain);
      }
    } else {
      console.warn("No domain found on custom redirect");
    }
  }

  _finishRedirect(group: YpGroupData) {
    YpNavHelpers.redirectTo("/group/" + group.id);
    window.appGlobals.activity("completed", "editGroup");
  }

  _getAccessTab() {
    const base = {
      name: "access",
      icon: "code",
      items: [
        {
          text: "groupAccess",
          type: "html",
          templateData: html`
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
          templateData: html`
            <md-outlined-select
              .label="${this.t("status.select")}"
              @change="${this._statusSelected}"
              .selectedIndex="${this.statusIndex}"
            >
              ${this.collectionStatusOptions?.map(
                (statusOption: any, index: any) => html`
                  <md-select-option ?selected="${this.statusIndex == index}"
                    >${statusOption.translatedName}</md-select-option
                  >
                `
              )}
            </md-outlined-select>
          `,
        },
      ] as Array<YpStructuredConfigData>,
    } as YpConfigTabData;

    if (this.groupTypeIndex !== YpAdminConfigGroup.GroupType.allOurIdeas) {
      base.items.concat([
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
      ]);
    }

    return base;
  }

  _groupAccessChanged(event: CustomEvent) {
    this.groupAccess = (event.target as any).value;
    this._configChanged();
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
          templateData: html`
            <yp-theme-selector
              @config-updated="${this._configChanged}"
              ?hasLogoImage="${this.imagePreviewUrl ||
              YpMediaHelpers.getImageFormatUrl(this.currentLogoImages)}"
              .disableSelection="${this.group.configuration
                .inheritThemeFromCommunity}"
              @get-color-from-logo="${this.getColorFromLogo}"
              @yp-theme-configuration-changed="${this._themeChanged}"
              .themeConfiguration="${this.group.configuration.theme!}"
            ></yp-theme-selector>
          `,
        },
      ] as Array<YpStructuredConfigData>,
    } as YpConfigTabData;
  }

  _inheritThemeChanged(event: CustomEvent) {
    this.group.configuration.inheritThemeFromCommunity = (
      event.target as Checkbox
    ).checked;
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
          templateData: html`
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
          templateData: html`
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
          templateData: html`
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
      ] as Array<YpStructuredConfigData>,
    } as YpConfigTabData;
  }

  _defaultDataImageUploaded(event: CustomEvent) {
    var image = JSON.parse(event.detail.xhr.response);
    this.group.configuration.defaultDataImageId = image.id;
    this.configChanged = true;
  }

  _defaultPostImageUploaded(event: CustomEvent) {
    var image = JSON.parse(event.detail.xhr.response);
    this.group.configuration.uploadedDefaultPostImageId = image.id;
    this.configChanged = true;
  }

  _haveUploadedDocxSurvey(event: CustomEvent) {
    const detail = event.detail;
    if (detail.xhr && detail.xhr.response) {
      let responseDetail = JSON.parse(detail.xhr.response);
      responseDetail.jsonContent = JSON.stringify(
        JSON.parse(responseDetail.jsonContent)
      );
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
          templateData: html`
            <md-outlined-select
              .label="${this.t("endorsementButtons")}"
              .disabled="${this.endorsementButtonsDisabled}"
              @change="${this._endorsementButtonsSelected}"
            >
              ${this.endorsementButtonsOptions?.map(
                (buttonsSelection: any, index: number) => html`
                  <md-select-option
                    ?selected="${this.endorsementButtonsIndex == index}"
                    >${buttonsSelection.translatedName}</md-select-option
                  >
                `
              )}
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
      ] as Array<YpStructuredConfigData>,
    } as YpConfigTabData;
  }

  get endorsementButtonsOptions() {
    if (this.t) {
      return [
        { name: "hearts", translatedName: this.t("endorsementButtonsHeart") },
        { name: "arrows", translatedName: this.t("endorsementArrows") },
        { name: "thumbs", translatedName: this.t("endorsementThumbs") },
        { name: "hats", translatedName: this.t("endorsementHats") },
      ];
    } else {
      return [];
    }
  }

  _endorsementButtonsSelected(event: CustomEvent) {
    const index = (event.target as MdOutlinedSelect).selectedIndex;
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
    } else {
      return -1;
    }
  }

  _customRatingsTextChanged(event: CustomEvent) {
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
      ] as Array<YpStructuredConfigData>,
    } as YpConfigTabData;
  }

  _getAdditionalConfigTab() {
    return {
      name: "additionalGroupConfig",
      icon: "settings",
      items: [
        {
          text: "defaultLocale",
          type: "html",
          templateData: html`
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
          text: "hideStatsAndMembership",
          type: "checkbox",
          value: this.group.configuration.hideStatsAndMembership,
          translationToken: "hideStatsAndMembership",
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
          text: "disableNameAutoTranslation",
          type: "checkbox",
          value: this.group.configuration.disableNameAutoTranslation,
          translationToken: "disableNameAutoTranslation",
        },
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
          text: "disableCollectionUpLink",
          type: "checkbox",
          value: this.group.configuration.disableCollectionUpLink,
          translationToken: "disableCollectionUpLink",
        },
        {
          text: "welcomeSelectPage",
          type: "html",
          hidden: !this.pages,
          templateData: html`
            <md-outlined-select
              .label="${this.t("welcomeSelectPage")}"
              @selected="${this._welcomePageSelected}"
            >
              ${this.translatedPages?.map(
                (page, index) => html`
                  <md-select-option ?selected="${this.welcomePageId == page.id}"
                    >${this._getLocalizePageTitle(page)}</md-select-option
                  >
                `
              )}
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
          templateData: html`
            <md-outlined-select
              name="moveGroupTo"
              .label="${this.t("moveGroupTo")}"
              @selected="${this._moveGroupToSelected}"
            >
              ${this.groupMoveToOptions?.map(
                (option: YpGroupData) => html`
                  <md-select-option
                    ?selected="${this.moveGroupToId == option.id}"
                    >${option.name}</md-select-option
                  >
                `
              )}
            </md-outlined-select>
          `,
        },
        {
          text: "categories.the_all",
          type: "html",
          templateData: html`
            <div class="subHeaders">${this.t("categories.the_all")}</div>
            <md-outlined-select
              .label="${this.t("selectCategory")}"
              @selected="${this._categorySelected}"
            >
              ${this.group.Categories?.map(
                (category) => html`
                  <md-select-option value="${category.id}">
                    <md-icon
                      slot="icon"
                      src="${this._categoryImageSrc(category)}"
                    ></md-icon>
                    ${category.name}
                  </md-select-option>
                `
              )}
            </md-outlined-select>
          `,
        },
      ] as Array<YpStructuredConfigData>,
    } as YpConfigTabData;
  }

  earlConfigChanged(event: CustomEvent) {
    this.group.configuration.allOurIdeas = (
      this.$$("aoi-earl-ideas-editor") as AoiEarlIdeasEditor
    ).configuration;
    this.requestUpdate();
  }

  themeConfigChanged(event: CustomEvent) {
    this.group.configuration.theme = {
      ...this.group.configuration.theme,
      ...event.detail,
    };
    this.requestUpdate();
  }

  renderCreateEarl(
    domainId: number | undefined,
    communityId: number | undefined
  ) {
    return html`<aoi-earl-ideas-editor
      id="createEarl"
      .domainId="${domainId}"
      .communityId="${communityId}"
      @configuration-changed="${this.earlConfigChanged}"
      @theme-config-changed="${this.themeConfigChanged}"
      .group="${this.group}"
      .configuration="${this.group.configuration.allOurIdeas!}"
    ></aoi-earl-ideas-editor>`;
  }

  setupEarlConfigIfNeeded() {
    const configuration = this.group.configuration.allOurIdeas!;
    if (!configuration.earl) {
      configuration.earl = {
        active: true,
        configuration: {
          accept_new_ideas: false,
          hide_results: false,
          hide_analysis: false,
          hide_skip: false,
          enableAiModeration: false,
          allowNewIdeasForVoting: true,
          hide_explain: false,
          minimum_ten_votes_to_show_results: true,
          target_votes: 30,
          analysis_config: defaultAiAnalysisJson,
          moderationPrompt: defaultModerationPrompt,
          welcome_html: "",
          welcome_message: "",
          external_goal_params_whitelist: "",
          external_goal_trigger_url: "",
        },
      };
      this.configTabs = this.setupConfigTabs();
      this.requestUpdate();
    }

    if (!configuration.earl.question) {
      configuration.earl.question = {} as any;
    }
  }

  questionNameChanged(event: CustomEvent) {
    this.setupEarlConfigIfNeeded();
    const target = (event as any).currentTarget! as MdFilledTextField;
    const questionText = target.value;
    const configuration = this.group.configuration.allOurIdeas!;

    const earlConfig = this.$$("#createEarl") as AoiEarlIdeasEditor;

    if (questionText && questionText.length >= 3) {
      earlConfig.openForAnswers = true;
    } else {
      earlConfig.openForAnswers = false;
    }

    configuration!.earl!.question!.name = questionText;

    this.aoiQuestionName = questionText;

    console.error("questionNameChanged", questionText);

    this.set(
      this.group.configuration.allOurIdeas!.earl,
      "question.name",
      questionText
    );

    this.questionNameHasChanged = true;

    this.configTabs = this.setupConfigTabs();
    this._configChanged();
    this.requestUpdate();
  }

  override afterSave() {
    super.afterSave();
    if (this.questionNameHasChanged) {
      let communityId;
      let domainId;

      if (
        this.collectionId === "new" &&
        window.appGlobals.originalQueryParameters["createProjectForGroup"]
      ) {
        domainId = this.parentCollectionId as number;
      } else if (this.collectionId === "new") {
        communityId = this.parentCollectionId as number;
      } else {
        communityId = this.group.community_id;
      }

      const serverApi = new AoiAdminServerApi();
      serverApi.updateName(
        domainId,
        communityId,
        this.group.configuration.allOurIdeas!.earl!.question!.id,
        this.group.configuration.allOurIdeas!.earl!.question!.name
      );
    }
  }

  _getAllOurIdeaTab() {
    let configuration = this.group.configuration.allOurIdeas!;

    if (!configuration) {
      configuration = this.group.configuration.allOurIdeas = {};
    }

    let communityId;
    let domainId;

    if (
      this.collectionId === "new" &&
      window.appGlobals.originalQueryParameters["createProjectForGroup"]
    ) {
      domainId = this.parentCollectionId as number;
      this.group.configuration.disableCollectionUpLink = true;
    } else if (this.collectionId === "new") {
      communityId = this.parentCollectionId as number;
    } else {
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
          templateData: this.renderCreateEarl(domainId, communityId),
        },
      ] as Array<YpStructuredConfigData>,
    } as YpConfigTabData;
  }

  set(obj: any, path: string, value: any): void {
    const keys = path.split(".");
    let current = obj;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = value;
      } else {
        if (!current[key]) current[key] = {};
        current = current[key];
      }
    });
  }

  _updateEarl(event: CustomEvent, earlUpdatePath: string, parseJson = false) {
    let value = event.detail.value;
    if (parseJson) {
      try {
        value = JSON.parse(value);
      } catch (e) {
        console.error("Error parsing JSON", e);
      }
    }
    this.set(this.group.configuration.allOurIdeas!.earl, earlUpdatePath, value);
    this._configChanged();
    this.requestUpdate();
  }

  _getAllOurIdeaOptionsTab() {
    let earl = this.group.configuration.allOurIdeas?.earl;

    if (earl) {
      //TODO: Move this somewhere else
      if (!earl!.configuration!.analysis_config) {
        earl!.configuration!.analysis_config = defaultAiAnalysisJson;
      }
    }

    return {
      name: "allOurIdeasOptions",
      icon: "settings",
      items: [
        {
          text: "active",
          type: "checkbox",
          onChange: (e: CustomEvent) => this._updateEarl(e, "active"),
          value: earl?.active,
          translationToken: "active",
        },
        {
          text: "accept_new_ideas",
          type: "checkbox",
          onChange: (e: CustomEvent) =>
            this._updateEarl(e, "configuration.accept_new_ideas"),
          value:
            earl?.configuration?.accept_new_ideas !== undefined
              ? earl?.configuration?.accept_new_ideas
              : true,
          translationToken: "acceptNewIdeas",
        },
        {
          text: "allowNewIdeasForVoting",
          type: "checkbox",
          onChange: (e: CustomEvent) =>
            this._updateEarl(e, "configuration.allowNewIdeasForVoting"),
          value: earl?.configuration?.allowNewIdeasForVoting,
          translationToken: "allowNewIdeasForVoting",
        },
        {
          text: "enableAiModeration",
          type: "checkbox",
          onChange: (e: CustomEvent) =>
            this._updateEarl(e, "configuration.enableAiModeration"),
          value: earl?.configuration?.enableAiModeration,
          translationToken: "enableAiModeration",
        },

        {
          text: "minimum_ten_votes_to_show_results",
          type: "checkbox",
          onChange: (e: CustomEvent) =>
            this._updateEarl(
              e,
              "configuration.minimum_ten_votes_to_show_results"
            ),
          value: earl?.configuration?.minimum_ten_votes_to_show_results,
          translationToken: "minimumTenVotesToShowResults",
        },
        {
          text: "disableCollectionUpLink",
          type: "checkbox",
          value: this.group.configuration.disableCollectionUpLink,
          translationToken: "disableCollectionUpLink",
        },
        {
          text: "hide_results",
          type: "checkbox",
          onChange: (e: CustomEvent) =>
            this._updateEarl(e, "configuration.hide_results"),
          value: earl?.configuration?.hide_results,
          translationToken: "hideAoiResults",
        },
        {
          text: "hide_analysis",
          type: "checkbox",
          onChange: (e: CustomEvent) =>
            this._updateEarl(e, "configuration.hide_analysis"),
          value: earl?.configuration?.hide_analysis,
          translationToken: "hideAoiAnalysis",
        },
        {
          text: "hide_skip",
          type: "checkbox",
          onChange: (e: CustomEvent) =>
            this._updateEarl(e, "configuration.hide_skip"),
          value: earl?.configuration?.hide_skip,
          translationToken: "hideSkipButton",
        },
        {
          text: "hide_explain",
          type: "checkbox",
          onChange: (e: CustomEvent) =>
            this._updateEarl(e, "configuration.hide_explain"),
          value: earl?.configuration?.hide_explain,
          translationToken: "hideAoiExplainButton",
        },
        {
          text: "welcome_message",
          type: "textarea",
          rows: 5,
          maxLength: 300,
          value: earl?.configuration?.welcome_message,
          onChange: (e: CustomEvent) =>
            this._updateEarl(e, "configuration.welcome_message"),
          translationToken: "welcomeMessage",
        },
        {
          text: "welcome_html",
          type: "textarea",
          rows: 5,
          value: earl?.configuration?.welcome_html,
          onChange: (e: CustomEvent) =>
            this._updateEarl(e, "configuration.welcome_html"),
          translationToken: "welcomeHtml",
        },
        {
          text: "moderationPrompt",
          type: "textarea",
          rows: 5,
          value: earl?.configuration?.moderationPrompt
            ? earl?.configuration?.moderationPrompt
            : defaultModerationPrompt,
          onChange: (e: CustomEvent) =>
            this._updateEarl(e, "configuration.moderationPrompt", true),
          translationToken: "aoiModerationPrompt",
        },
        {
          text: "targetVotes",
          type: "textfield",
          maxLength: 3,
          pattern: "[0-9]",
          value: earl?.configuration?.target_votes,
          translationToken: "targetVotes",
          onChange: (e: CustomEvent) =>
            this._updateEarl(e, "configuration.target_votes", true),
          charCounter: true,
        },
        {
          text: "externalGoalParamsWhitelist",
          type: "textfield",
          pattern: "[0-9]",
          value: earl?.configuration?.external_goal_params_whitelist,
          onChange: (e: CustomEvent) =>
            this._updateEarl(
              e,
              "configuration.external_goal_params_whitelist",
              true
            ),
          translationToken: "externalGoalParamsWhitelist",
        },
        {
          text: "externalGoalTriggerUrl",
          type: "textfield",
          value: earl?.configuration?.external_goal_trigger_url,
          onChange: (e: CustomEvent) =>
            this._updateEarl(
              e,
              "configuration.external_goal_trigger_url",
              true
            ),
          translationToken: "externalGoalTriggerUrl",
        },
        {
          text: "analysis_config",
          type: "textarea",
          rows: 7,
          value: earl?.configuration?.analysis_config
            ? JSON.stringify(earl?.configuration?.analysis_config, null, 2)
            : JSON.stringify(defaultAiAnalysisJson, null, 2),
          onChange: (e: CustomEvent) =>
            this._updateEarl(e, "configuration.analysis_config", true),
          translationToken: "aoiAiAnalysisConfig",
        },
        {
          type: "html",
          templateData: html`<div class="layout vertical center-center" style="margin-top: -8px">
            <div style="max-width: 700px">${unsafeHTML(this.t("aiAnalysisConfigInfo"))}</div>
          </div>`,
        },

      ] as Array<YpStructuredConfigData>,
    } as YpConfigTabData;
  }

  _categorySelected(event: CustomEvent) {
    const categoryId = event.detail.value;
    // Handle category selection here, such as opening an edit dialog
  }

  _categoryImageSrc(category: any) {
    // Return the image source URL for the category icon
    // This function needs to be implemented based on how you retrieve the image source
    return `path/to/category/icons/${category.id}.png`;
  }

  _welcomePageSelected(event: CustomEvent) {
    const index = event.detail.index as number;
    this.welcomePageId = this.translatedPages![index].id;
  }

  _isDataVisualizationGroupClick(event: CustomEvent) {
    // Handle click event for isDataVisualizationGroup checkbox
  }

  _dataForVisualizationChanged(event: CustomEvent) {
    // Handle change event for dataForVisualization textarea
  }

  _moveGroupToSelected(event: CustomEvent) {
    const index = event.detail.index as number;
    this.moveGroupToId = this.groupMoveToOptions![index].id;
  }

  setupConfigTabs() {
    const tabs: Array<YpConfigTabData> = [];

    if (this.groupTypeIndex == YpAdminConfigGroup.GroupType.ideaGeneration) {
      const postsTab = this._getPostSettingsTab();
      if (!this.isGroupFolder) {
        tabs.push(postsTab!);
      }
      tabs.push(this._getVoteSettingsTab());
      tabs.push(this._getPointSettingsTab());
      tabs.push(this._getAdditionalConfigTab());
    } else if (
      this.groupTypeIndex == YpAdminConfigGroup.GroupType.allOurIdeas
    ) {
      tabs.push(this._getAllOurIdeaTab());
      tabs.push(this._getAllOurIdeaOptionsTab());
    }
    tabs.push(this._getAccessTab());
    tabs.push(this._getThemeTab());

    this.tabsPostSetup(tabs);

    return tabs;
  }

  _appHomeScreenIconImageUploaded(event: CustomEvent) {
    var image = JSON.parse(event.detail.xhr.response);
    this.appHomeScreenIconImageId = image.id;
    this._configChanged();
  }
}
