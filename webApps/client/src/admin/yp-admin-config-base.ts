import {
  LitElement,
  css,
  html,
  nothing,
  TemplateResult,
  PropertyValueMap,
} from "lit";
import { property, customElement, query } from "lit/decorators.js";
import "@material/web/button/filled-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/tabs/tabs.js";
import "@material/web/tabs/primary-tab.js";
import "@material/web/tabs/secondary-tab.js";
import "@material/web/checkbox/checkbox.js";
import "@material/web/textfield/outlined-text-field.js";

//import { YpBaseWithLogin } from './@yrpri/common/yp-base-element-with-login.js';
import { YpAdminPage } from "./yp-admin-page.js";

import "../yp-survey/yp-structured-question-edit.js";
import "../yp-file-upload/yp-file-upload.js";
import "../common/yp-generate-ai-image.js";

import { YpForm } from "../common/yp-form.js";
import "../common/yp-form.js";
//import { YpEmojiSelector } from './@yrpri/common/yp-emoji-selector.js';
import { YpFileUpload } from "../yp-file-upload/yp-file-upload.js";
import { MdCircularProgress } from "@material/web/progress/circular-progress.js";
import { MdTabs } from "@material/web/tabs/tabs.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { YpCollectionHelpers } from "../common/YpCollectionHelpers.js";
import { YpGenerateAiImage } from "../common/yp-generate-ai-image.js";
import { YpImage } from "../common/yp-image.js";
import { YpAdminConfigGroup } from "./yp-admin-config-group.js";
import { MdOutlinedSelect } from "@material/web/select/outlined-select.js";
import { YpEmojiSelector } from "../common/yp-emoji-selector.js";
import { MdCheckbox } from "@material/web/checkbox/checkbox.js";

export const defaultLtpPromptsConfiguration = () => {
  return Object.fromEntries(Array.from({ length: 10 }, (_, i) => [i + 1, ""]));
};

export const defaultLtpConfiguration = {
  crt: {
    prompts: defaultLtpPromptsConfiguration(),
    promptsTests: defaultLtpPromptsConfiguration(),
  },
};

export abstract class YpAdminConfigBase extends YpAdminPage {
  @property({ type: Array })
  configTabs: Array<YpConfigTabData> | undefined;

  @property({ type: Number })
  selectedTab = 0;

  @property({ type: Boolean })
  configChanged = false;

  @property({ type: String })
  method = "POST";

  @property({ type: Array })
  currentLogoImages: YpImageData[] | undefined;

  @property({ type: Number })
  collectionVideoId: number | undefined;

  @property({ type: Boolean })
  generatingAiImageInBackground = false;

  @property({ type: String })
  action: string | undefined;

  @property({ type: String })
  subRoute: string | undefined;

  @property({ type: Boolean })
  hasVideoUpload = false;

  @property({ type: String })
  status: string | undefined;

  @property({ type: Boolean })
  hasAudioUpload = false;

  @property({ type: Number })
  uploadedLogoImageId: number | undefined;

  @property({ type: Number })
  uploadedHeaderImageId: number | undefined;

  @property({ type: Number })
  uploadedVideoId: number | undefined;

  @property({ type: String })
  editHeaderText: string | undefined;

  @property({ type: String })
  toastText: string | undefined;

  @property({ type: String })
  saveText: string | undefined;

  @property({ type: String })
  imagePreviewUrl: string | undefined;

  @property({ type: String })
  videoPreviewUrl: string | undefined;

  @property({ type: Number })
  themeId: number | undefined;

  @property({ type: Array })
  translatedPages: Array<YpHelpPageData> | undefined;

  @property({ type: Number })
  descriptionMaxLength = 300;

  @property({ type: Boolean })
  tabsHidden = false;

  @property({ type: Number })
  parentCollectionId: number | undefined;

  @property({ type: Object })
  parentCollection: YpCollectionData | undefined;

  @query("#name")
  nameInput!: HTMLInputElement;

  @query("#description")
  descriptionInput!: HTMLInputElement;

  @property({ type: Boolean })
  gettingImageColor = false;

  @property({ type: String })
  detectedThemeColor: string | undefined;

  constructor() {
    super();
  }

  abstract setupConfigTabs(): Array<YpConfigTabData>;

  abstract renderHeader(): TemplateResult | {};

  abstract renderHiddenInputs(): TemplateResult | {};

  async _formResponse(event: CustomEvent) {
    this.configChanged = false;
  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = (event.target as MdTabs).activeTabIndex;
  }

  async getColorFromLogo() {
    try {
      this.gettingImageColor = true;

      let ypImageUrl =
        this.imagePreviewUrl ||
        YpMediaHelpers.getImageFormatUrl(this.currentLogoImages);

      const imgObj = new Image();
      imgObj.src = ypImageUrl + "?" + new Date().getTime();
      imgObj.setAttribute("crossOrigin", "");
      await imgObj.decode();

      let newThemeColor = await YpImage.getThemeColorsFromImage(imgObj);
      this.gettingImageColor = false;
      console.error("New theme color", newThemeColor);

      if (newThemeColor) {
        newThemeColor = newThemeColor.replace("#", "");
        this.fireGlobal("yp-theme-color-detected", newThemeColor);
        this.detectedThemeColor = newThemeColor;
        this._configChanged();
      }
    } catch (error) {
      console.log(error);
    }
  }

  _updateCollection(event: CustomEvent) {
    this.collection = event.detail;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.setupBootListener();
    this.addGlobalListener("yp-has-video-upload", () => {
      this.hasVideoUpload = true;
    });
    this.addGlobalListener("yp-has-audio-upload", () => {
      this.hasAudioUpload = true;
    });
    if (window.appGlobals.hasVideoUpload) this.hasVideoUpload = true;
    if (window.appGlobals.hasAudioUpload) this.hasAudioUpload = true;
    this.addListener("yp-form-response", this._formResponse);
    this.addListener("yp-updated-collection", this._updateCollection);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener("yp-has-video-upload", () => {
      this.hasVideoUpload = true;
    });
    this.removeGlobalListener("yp-has-audio-upload", () => {
      this.hasAudioUpload = true;
    });
    this.removeListener("yp-form-response", this._formResponse);
    this.removeListener("yp-updated-collection", this._updateCollection);
  }

  _logoImageUploaded(event: CustomEvent) {
    var image = JSON.parse(event.detail.xhr.response);
    this.uploadedLogoImageId = image.id;
    this.imagePreviewUrl = JSON.parse(image.formats)[0];
    const formats = JSON.parse(image.formats);
    this._configChanged();
  }

  _headerImageUploaded(event: CustomEvent) {
    var image = JSON.parse(event.detail.xhr.response);
    this.uploadedHeaderImageId = image.id;
    this.configChanged = true;
  }

  _statusSelected(event: CustomEvent) {
    const index = (event.target as MdOutlinedSelect).selectedIndex;
    this.status = this.collectionStatusOptions[index].name;
    this._configChanged();
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
        { name: "active", translatedName: this.t("status.active") },
        { name: "featured", translatedName: this.t("status.featured") },
        { name: "archived", translatedName: this.t("status.archived") },
        { name: "hidden", translatedName: this.t("status.hidden") },
      ];
    } else {
      return [];
    }
  }

  _ltpConfigChanged(event: CustomEvent) {
    setTimeout(() => {
      const jsonEditor = this.$$("#jsoneditor") as any;
      const currentJson = jsonEditor.json;
      (this.collection!.configuration as YpGroupConfiguration).ltp =
        currentJson;
      this._configChanged();
      this.requestUpdate();
    }, 25);
  }

  tabsPostSetup(tabs: Array<YpConfigTabData>) {
    // To overide in child class
  }

  get disableSaveButtonForCollection() {
    if (
      this.collectionType == "group" &&
      this.collection &&
      this.collection.configuration
    ) {
      // Check if All Our Ideas Group Tyep
      if ((this.collection as YpGroupData).configuration.groupType === 1) {
        const hasQuestionId = (this.collection as YpGroupData).configuration
          ?.allOurIdeas?.earl?.question_id;
        return hasQuestionId === undefined;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  _themeChanged(event: CustomEvent) {
    this.collection!.configuration.theme = {
      ...this.collection!.configuration.theme,
      ...(event.detail as YpThemeConfiguration),
    };
    this.requestUpdate();
  }

  renderSaveButton(): TemplateResult {
    return html`
      <div class="layout horizontal">
        <md-filled-button
          raised
          class="saveButton"
          ?disabled="${!this.configChanged ||
          this.disableSaveButtonForCollection}"
          @click="${this._save}"
          >${this.saveText || ""}</md-filled-button
        >
      </div>
      <div>
        <md-circular-progress
          id="spinner"
          hidden
          indeterminate
          closed="${!this.configChanged}"
        ></md-circular-progress>
      </div>
    `;
  }

  renderTabs(): TemplateResult | typeof nothing {
    return !this.tabsHidden && this.configTabs
      ? html`
          <div class="layout vertical center-center">
            <md-tabs @change="${this._selectTab}">
              ${this.configTabs.map(
                (item) => html`
                  <md-secondary-tab
                    >${this.t(item.name)}<md-icon
                      >${item.icon}</md-icon
                    ></md-secondary-tab
                  >
                `
              )}
            </md-tabs>
          </div>
        `
      : nothing;
  }

  renderTabPages() {
    if (this.tabsHidden) return nothing;

    let allPages: Array<TemplateResult> = [];

    this.configTabs?.forEach((tab, index) => {
      allPages.push(this.renderTabPage(tab.items, index));
    });

    return html`${allPages}`;
  }

  _generateLogo(event: CustomEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.requestUpdate();
    const generator = this.$$("#aiImageGenerator") as YpGenerateAiImage;
    generator.open();
  }

  renderTabPage(configItems: Array<YpStructuredConfigData>, itemIndex: number) {
    return html`<div
      ?hidden="${this.selectedTab != itemIndex}"
      class="layout vertical center-center"
    >
      <div class="innerTabContainer">
        ${configItems.map(
          (question, index) => html`
            ${question.type == "html"
              ? html`<div class="adminItem">${question.templateData}</div>`
              : html`
                  <div class="layout vertical center-center">
                    <yp-structured-question-edit
                      index="${index}"
                      id="configQuestion_${index}"
                      @yp-answer-content-changed="${question.onChange ||
                      this._configChanged}"
                      debounceTimeMs="10"
                      .name="${question.name || question.text || ""}"
                      ?disabled="${question.disabled ? true : false}"
                      .value="${question.value !== undefined
                        ? question.value
                        : this._getCurrentValue(question) !== undefined
                        ? this._getCurrentValue(question)
                        : question.defaultValue || ""}"
                      .question="${{
                        ...question,
                        text: question.translationToken
                          ? this.t(question.translationToken)
                          : this.t(question.text),
                        uniqueId: `u${index}`,
                      }}"
                    >
                    </yp-structured-question-edit>
                  </div>
                `}
          `
        )}
      </div>
    </div>`;
  }

  get collectionVideoURL(): string | undefined {
    if (this.collection && this.collection.configuration) {
      const collectionVideos = this.collectionVideos;
      if (collectionVideos) {
        const videoURL = YpMediaHelpers.getVideoURL(collectionVideos);
        if (videoURL) {
          this.collectionVideoId = collectionVideos[0].id;
          return videoURL;
        }
      }
      return undefined;
    } else {
      return undefined;
    }
  }

  get collectionVideoPosterURL(): string | undefined {
    if (
      this.collection &&
      this.collection.configuration &&
      this.collection.configuration.useVideoCover
    ) {
      const videoPosterURL = YpMediaHelpers.getVideoPosterURL(
        this.collectionVideos,
        YpCollectionHelpers.logoImages(this.collectionType, this.collection)
      );
      if (videoPosterURL) {
        return videoPosterURL;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  get collectionVideos(): Array<YpVideoData> | undefined {
    switch (this.collectionType) {
      case "domain":
        return (this.collection as YpDomainData).DomainLogoVideos;
      case "community":
        return (this.collection as YpCommunityData).CommunityLogoVideos;
      case "group":
        return (this.collection as YpGroupData).GroupLogoVideos;
      default:
        return undefined;
    }
  }

  renderCoverMediaContent() {
    if (this.collection?.configuration?.welcomeHTML) {
      return html`<div id="welcomeHTML">
        ${unsafeHTML(this.collection.configuration.welcomeHTML)}
      </div>`;
    } else if (
      this.collectionVideoURL &&
      this.collection?.configuration.useVideoCover
    ) {
      return html`
        <video
          id="videoPlayer"
          data-id="${ifDefined(this.collectionVideoId)}"
          controls
          preload="metadata"
          class="mainImage"
          src="${this.collectionVideoURL}"
          playsinline
          poster="${ifDefined(this.collectionVideoPosterURL)}"
        ></video>
      `;
    } else if (
      this.videoPreviewUrl &&
      this.collection?.configuration.useVideoCover
    ) {
      return html`
        <video
          id="videoPlayer"
          data-id="${ifDefined(this.collectionVideoId)}"
          controls
          preload="metadata"
          class="mainImage"
          src="${this.videoPreviewUrl}"
          playsinline
        ></video>
      `;
    } else if (this.imagePreviewUrl) {
      return html`
        <div style="position: relative;">
          <yp-image
            class="mainImage"
            @loaded="${this.getColorFromLogo}"
            sizing="contain"
            .skipCloudFlare="${true}"
            src="${this.imagePreviewUrl}"
          ></yp-image>
          ${this.gettingImageColor
            ? html`
                <md-linear-progress
                  class="imagePicker"
                  indeterminate
                ></md-linear-progress>
              `
            : nothing}
        </div>
      `;
    } else if (this.currentLogoImages) {
      return html`
        <div style="position: relative;">
          <yp-image
            class="image"
            sizing="contain"
            src="${YpMediaHelpers.getImageFormatUrl(this.currentLogoImages)}"
          ></yp-image>
          ${this.gettingImageColor
            ? html`
                <md-linear-progress
                  class="imagePicker"
                  indeterminate
                ></md-linear-progress>
              `
            : nothing}
        </div>
      `;
    } else {
      return html`
        <yp-image
          class="image"
          sizing="contain"
          src="https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/ypPlaceHolder2.jpg"
        ></yp-image>
      `;
    }
  }

  renderLogoMedia() {
    return html`
      <div class="layout vertical logoImagePlaceholder">
        ${this.renderCoverMediaContent()}
        <div class="layout horizontal center-center logoUploadButtons">
          <yp-file-upload
            id="logoImageUpload"
            raised
            hideStatus
            useIconButton
            target="/api/images?itemType=domain-logo"
            method="POST"
            buttonIcon="photo_camera"
            .buttonText="${this.t("image.logo.upload")}"
            @success="${this._logoImageUploaded}"
          >
          </yp-file-upload>
          <div
            class="aiGenerationIconContainer"
            ?background-not-active="${!this.generatingAiImageInBackground}"
          >
            <md-filled-icon-button
              ?hidden="${!this.hasLlm}"
              id="generateButton"
              @click="${this._generateLogo}"
              ><md-icon>smart_toy</md-icon></md-filled-icon-button
            >
            ${this.generatingAiImageInBackground
              ? html`<md-linear-progress
                  class="aiGenerationSpinnerInBackground"
                  indeterminate
                ></md-linear-progress>`
              : nothing}
          </div>

          <div
            class="layout vertical center-center"
            class="videoUploadContainer"
            ?has-video="${this.videoPreviewUrl || this.collectionVideoURL}"
          >
            <yp-file-upload
              ?hidden="${!this.hasVideoUpload}"
              id="videoFileUpload"
              raised
              style="position: static;"
              useIconButton
              videoUpload
              method="POST"
              buttonIcon="videocam"
              .buttonText="${this.t("uploadVideo")}"
              @success="${this._videoUploaded}"
            >
            </yp-file-upload>
            <label
              ?hidden="${!this.videoPreviewUrl && !this.collectionVideoURL}"
              class="layout vertical center-center videoCoverCheckbox"
            >
              <md-checkbox
                id="videoCoverCheckbox"
                name="useVideoCover"
                @click="${this._setVideoCover}"
                ?checked="${this.collection!.configuration.useVideoCover}"
              >
              </md-checkbox>
              ${this.t("useVideoCover")}
            </label>
          </div>
        </div>
      </div>
    `;
  }

  renderHeaderImageUploads() {
    return html`
      <div class="layout horizontal">
        <yp-file-upload
          ?hidden="${this.collectionId == "new"}"
          id="headerImageUpload"
          raised
          target="/api/images?itemType=domain-header"
          method="POST"
          buttonIcon="photo_camera"
          .buttonText="${this.t("image.header.upload")}"
          @success="${this._headerImageUploaded}"
        >
        </yp-file-upload>
      </div>
    `;
  }

  static override get styles() {
    return [
      super.styles,
      css`
        .saveButton {
          margin-left: 16px;
        }

        .videoCoverCheckbox {
          padding: 8px;
          border-radius: 20px;
          background-color: var(--md-sys-color-surface);
        }

        md-checkbox {
          padding: 4px;
        }

        md-outlined-text-field {
          width: 400px;
        }

        .videoUploadContainer {
          background-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
        }

        .imagePicker {
          width: 100%;
          position: absolute;
          bottom: 0;
        }

        md-tabs {
          margin-top: 16px;
          margin-bottom: 24px;
          width: 1024px;
          max-width: 100%;
        }

        .topInputContainer {
          margin-top: 16px;
          max-width: 1024px;
          padding: 24px;
          background-color: var(--md-sys-color-surface-container-high);
          color: var(--md-sys-color-on-surface);
          border-radius: 16px;
        }

        .adminItem {
          margin: 0px;
          width: 1024px;
          max-width: 100%;
          margin-bottom: 32px;
        }

        .innerTabContainer {
          background-color: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-on-surface);
          border-radius: 16px;
          width: 900px;
          max-width: 100%;
          padding: 32px;
          margin-bottom: 128px;
        }

        @media (max-width: 600px) {
          .innerTabContainer {
            width: 100%;
          }
        }

        yp-structured-question-edit {
          width: 600px;
          max-width:100%;
        }

        .additionalSettings {
          margin-top: 16px;
        }

        yp-image {
          width: 432px;
          height: 243px;
        }

        .logoImagePlaceholder {
          width: 432px;
          height: 243px;
          position: relative;
          display: flex;
          align-items: center; /* Centers children vertically */
          justify-content: center;
          margin-right: 16px;
        }

        .logoUploadButtons {
          position: absolute;
          height: 48px;
          display: flex;
          justify-content: center;
        }

        .aiGenerationIconContainer {
          margin-left: 16px;
          margin-right: 16px;
          max-width: 42px;
          margin-bottom: 4px;
        }

        .aiGenerationIconContainer[background-not-active] {
          margin-bottom: 16px;
        }

        #generateButton {

        }

        .aiGenerationSpinnerInBackground {
          margin-top: 8px;
          margin-left: -24px;
        }

        #logoImageUpload {
          margin-bottom: 16px;
      `,
    ];
  }

  _setVideoCover(event: CustomEvent) {
    this.collection!.configuration.useVideoCover = !(event.target as MdCheckbox)
      .checked;
    this._configChanged();
    this.configTabs = this.setupConfigTabs();
  }

  renderNameAndDescription(hideDescription = false): TemplateResult {
    return html`
      <div class="layout vertical">
        <md-outlined-text-field
          id="name"
          name="name"
          type="text"
          @change="${this._configChanged}"
          .label="${this.t("Name")}"
          .value="${this.collection!.name}"
          maxlength="50"
          charCounter
          class="mainInput"
        ></md-outlined-text-field>
        ${!hideDescription
          ? html`
              <md-outlined-text-field
                id="description"
                name="description"
                type="textarea"
                .value="${this.collection!.description! || ""}"
                .label="${this.t("Description")}"
                @change="${this._configChanged}"
                rows="3"
                @keyup="${this._descriptionChanged}"
                maxlength="${this.descriptionMaxLength}"
                class="mainInput"
              ></md-outlined-text-field>
            `
          : nothing}
        <div class="horizontal end-justified layout pointEmoji">
          <div class="flex"></div>
          <yp-emoji-selector id="emojiSelectorDescription"></yp-emoji-selector>
        </div>
      </div>
    `;
  }

  //TODO: Make sure this works
  _descriptionChanged(event: CustomEvent) {
    const description = (event.target as any).value;
    const urlRegex = new RegExp(/(?:https?|http?):\/\/[\n\S]+/g);
    const urlArray = description.match(urlRegex);

    if (urlArray && urlArray.length > 0) {
      let urlsLength = 0;
      for (var i = 0; i < Math.min(urlArray.length, 10); i++) {
        urlsLength += urlArray[i].length;
      }
      let maxLength = 300;
      maxLength += urlsLength;
      maxLength -= Math.min(urlsLength, urlArray.length * 30);
      this.descriptionMaxLength = maxLength;
    }
  }

  override render() {
    let collectionType, collectionId, name, description;

    if (this.collectionId === "new") {
      if (this.collectionType === "community") {
        collectionType = "domain";
      } else if (this.collectionType === "group") {
        collectionType = "community";
      }
      collectionId = this.parentCollectionId;
    } else if (this.collection) {
      collectionType = this.collectionType;
      collectionId = this.collectionId;
    }

    name = this.nameInput?.value;
    description = this.descriptionInput?.value;

    return this.configTabs
      ? html`
          <yp-form id="form" method="POST" customRedirect>
            <form
              name="ypForm"
              .method="${this.method}"
              .action="${this.action ? this.action : ""}"
            >
              <div class="layout horizontal center-center">
                ${this.renderHeader()}
              </div>
              ${this.renderTabs()} ${this.renderTabPages()}
              ${this.renderHiddenInputs()}

              <input
                type="hidden"
                name="themeId"
                .value="${this.themeId?.toString() || ""}"
              />
              <input
                type="hidden"
                name="uploadedLogoImageId"
                .value="${this.uploadedLogoImageId?.toString() || ""}"
              />
              <input
                type="hidden"
                name="uploadedHeaderImageId"
                .value="${this.uploadedHeaderImageId?.toString() || ""}"
              />
            </form>
          </yp-form>
          <yp-generate-ai-image
            id="aiImageGenerator"
            .collectionType="${collectionType}"
            .collectionId="${collectionId}"
            .name="${name}"
            .description="${description}"
            @yp-generate-ai-image-background="${this
              ._logoGeneratingInBackground}"
            @got-image="${this._gotAiImage}"
          >
          </yp-generate-ai-image>
        `
      : nothing;
  }

  _logoGeneratingInBackground(event: CustomEvent) {
    this.generatingAiImageInBackground = true;
  }

  _gotAiImage(event: CustomEvent) {
    this.generatingAiImageInBackground = false;
    this.imagePreviewUrl = event.detail.imageUrl;
    this.uploadedLogoImageId = event.detail.imageId;
    this.configChanged = true;
  }

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    super.updated(changedProperties);

    if (changedProperties.has("collection") && this.collection) {
      this.configTabs = this.setupConfigTabs();
      //console.error("Collection", this.collection);
    }

    if (changedProperties.has("collectionId") && this.collectionId) {
      if (this.collectionId == "new") {
        this.method = "POST";
      } else {
        this.method = "PUT";
      }
    }
  }

  async _getHelpPages(
    collectionTypeOverride: string | undefined = undefined,
    collectionIdOverride: number | undefined = undefined
  ) {
    if (this.collectionId && this.collectionId != "new") {
      this.translatedPages = (await window.serverApi.getHelpPages(
        collectionTypeOverride ? collectionTypeOverride : this.collectionType,
        collectionIdOverride
          ? collectionIdOverride
          : (this.collectionId as number)
      )) as Array<YpHelpPageData> | undefined;
    } else {
      console.error("Collection id setup for get help pages");
    }
  }

  protected override firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    this._updateEmojiBindings();
  }

  _getLocalizePageTitle(page: YpHelpPageData) {
    let pageLocale = "en";
    if (window.appGlobals.locale && page.title[window.appGlobals.locale]) {
      pageLocale = window.appGlobals.locale;
    }
    return page.title[pageLocale];
  }

  beforeSave() {}
  afterSave() {}

  sendUpdateCollectionEvents() {
    if (this.collectionType == "domain") {
      this.fireGlobal("yp-refresh-domain");
    } else if (this.collectionType == "community") {
      this.fireGlobal("yp-refresh-community");
    } else if (this.collectionType == "group") {
      this.fireGlobal("yp-refresh-group");
    }
  }

  async _save(event: CustomEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.beforeSave();
    console.error("Saving collection", this.collection);
    const form = this.$$("#form") as YpForm;

    if (form.validate()) {
      (this.$$("#spinner") as MdCircularProgress).hidden = false;
      await form.submit();
      (this.$$("#spinner") as MdCircularProgress).hidden = true;
      this.sendUpdateCollectionEvents();
      this.afterSave();
    } else {
      this.fire("yp-form-invalid");
      const error = this.t("form.invalid");
      this._showErrorDialog(error);
    }
  }

  _showErrorDialog(errorText: string) {
    this.fire("yp-error", errorText);
  }

  _configChanged() {
    this.configChanged = true;
  }

  _videoUploaded(event: CustomEvent) {
    this.uploadedVideoId = event.detail.videoId;
    this.collection!.configuration.useVideoCover = true;
    this.videoPreviewUrl = event.detail.url;
    this._configChanged();
    this.requestUpdate();
  }

  _getSaveCollectionPath(path: string) {
    try {
      return eval(`this.collection.${path}`);
    } catch (e) {
      return undefined;
    }
  }

  _clear() {
    this.collection = undefined;
    this.uploadedLogoImageId = undefined;
    this.uploadedHeaderImageId = undefined;
    this.imagePreviewUrl = undefined;
    this.collectionVideoId = undefined;
    this.uploadedVideoId = undefined;
    this.videoPreviewUrl = undefined;

    (this.$$("#headerImageUpload") as YpFileUpload).clear();
    (this.$$("#logoImageUpload") as YpFileUpload).clear();
    if (this.$$("#videoFileUpload"))
      (this.$$("#videoFileUpload") as YpFileUpload).clear();
  }

  _updateEmojiBindings() {
    setTimeout(() => {
      const description = this.$$("#description") as HTMLInputElement;
      const emojiSelector = this.$$(
        "#emojiSelectorDescription"
      ) as YpEmojiSelector;
      if (description && emojiSelector) {
        emojiSelector.inputTarget = description;
      } else {
        console.error("Could not find emoji selector or description input");
      }
    }, 500);
  }

  _getCurrentValue(question: YpStructuredQuestionData) {
    if (this.collection && this.collection.configuration) {
      if (["textheader", "textdescription"].indexOf(question.type!) == -1) {
        const looseConfig = this.collection.configuration as LooseObject;
        if (question.text.indexOf(".") > -1) {
          try {
            return eval(`this.collection.configuration.${question.text}`);
          } catch (e) {
            console.error(e);
          }
        } else {
          const config = looseConfig[question.text];
          if (config !== undefined) return config;
        }
      }
    }
  }
}
