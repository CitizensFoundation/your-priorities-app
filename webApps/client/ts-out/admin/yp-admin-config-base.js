var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing, } from "lit";
import { property, query } from "lit/decorators.js";
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
import "../common/yp-form.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { YpCollectionHelpers } from "../common/YpCollectionHelpers.js";
import { YpImage } from "../common/yp-image.js";
export const defaultLtpPromptsConfiguration = () => {
    return Object.fromEntries(Array.from({ length: 10 }, (_, i) => [i + 1, ""]));
};
export const defaultLtpConfiguration = {
    crt: {
        prompts: defaultLtpPromptsConfiguration(),
        promptsTests: defaultLtpPromptsConfiguration(),
    },
};
export class YpAdminConfigBase extends YpAdminPage {
    constructor() {
        super();
        this.selectedTab = 0;
        this.configChanged = false;
        this.method = "POST";
        this.generatingAiImageInBackground = false;
        this.hasVideoUpload = false;
        this.hasAudioUpload = false;
        this.connectedVideoToCollection = false;
        this.descriptionMaxLength = 300;
        this.tabsHidden = false;
        this.gettingImageColor = false;
        this.imageIdsUploadedByUser = [];
        this.videoIdsUploadedByUser = [];
    }
    async _formResponse(event) {
        this.configChanged = false;
    }
    _selectTab(event) {
        this.selectedTab = event.target.activeTabIndex;
    }
    async getColorFromLogo() {
        try {
            this.gettingImageColor = true;
            let ypImageUrl = this.imagePreviewUrl ||
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
        }
        catch (error) {
            console.log(error);
        }
    }
    _updateCollection(event) {
        this.collection = event.detail;
    }
    connectedCallback() {
        super.connectedCallback();
        this.setupBootListener();
        this.addGlobalListener("yp-has-video-upload", () => {
            this.hasVideoUpload = true;
        });
        this.addGlobalListener("yp-has-audio-upload", () => {
            this.hasAudioUpload = true;
        });
        if (window.appGlobals.hasVideoUpload)
            this.hasVideoUpload = true;
        if (window.appGlobals.hasAudioUpload)
            this.hasAudioUpload = true;
        this.addListener("yp-form-response", this._formResponse);
        this.addListener("yp-updated-collection", this._updateCollection);
    }
    disconnectedCallback() {
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
    _logoImageUploaded(event) {
        var image = JSON.parse(event.detail.xhr.response);
        this.uploadedLogoImageId = image.id;
        this.imageIdsUploadedByUser.push(image.id);
        this.imagePreviewUrl = JSON.parse(image.formats)[0];
        const formats = JSON.parse(image.formats);
        this._configChanged();
    }
    _headerImageUploaded(event) {
        var image = JSON.parse(event.detail.xhr.response);
        this.uploadedHeaderImageId = image.id;
        this.configChanged = true;
    }
    _statusSelected(event) {
        const index = event.target.selectedIndex;
        this.status = this.collectionStatusOptions[index].name;
        this._configChanged();
    }
    get statusIndex() {
        if (this.status) {
            for (let i = 0; i < this.collectionStatusOptions.length; i++) {
                if (this.collectionStatusOptions[i].name == this.status)
                    return i;
            }
            return -1;
        }
        else {
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
        }
        else {
            return [];
        }
    }
    _ltpConfigChanged(event) {
        setTimeout(() => {
            const jsonEditor = this.$$("#jsoneditor");
            const currentJson = jsonEditor.json;
            this.collection.configuration.ltp =
                currentJson;
            this._configChanged();
            this.requestUpdate();
        }, 25);
    }
    tabsPostSetup(tabs) {
        // To overide in child class
    }
    get disableSaveButtonForCollection() {
        if (this.collectionType == "group" &&
            this.collection &&
            this.collection.configuration) {
            // Check if All Our Ideas Group Tyep
            if (this.collection.configuration.groupType === 1) {
                const hasQuestionId = this.collection.configuration
                    ?.allOurIdeas?.earl?.question_id;
                return hasQuestionId === undefined;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    _themeChanged(event) {
        this.collection.configuration.theme = {
            ...this.collection.configuration.theme,
            ...event.detail,
        };
        this.requestUpdate();
    }
    renderSaveButton() {
        return html `
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
    renderTabs() {
        return !this.tabsHidden && this.configTabs
            ? html `
          <div class="layout vertical center-center">
            <md-tabs @change="${this._selectTab}">
              ${this.configTabs.map((item) => html `
                  <md-secondary-tab
                    >${this.t(item.name)}<md-icon
                      >${item.icon}</md-icon
                    ></md-secondary-tab
                  >
                `)}
            </md-tabs>
          </div>
        `
            : nothing;
    }
    renderTabPages() {
        if (this.tabsHidden)
            return nothing;
        let allPages = [];
        this.configTabs?.forEach((tab, index) => {
            allPages.push(this.renderTabPage(tab.items, index));
        });
        return html `${allPages}`;
    }
    _generateLogo(event) {
        event.preventDefault();
        event.stopPropagation();
        this.requestUpdate();
        const generator = this.$$("#aiImageGenerator");
        generator.open();
    }
    renderTabPage(configItems, itemIndex) {
        return html `<div
      ?hidden="${this.selectedTab != itemIndex}"
      class="layout vertical center-center"
    >
      <div class="innerTabContainer">
        ${configItems.map((question, index) => html `
            ${question.type == "html"
            ? html `<div class="adminItem">${question.templateData}</div>`
            : html `
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
          `)}
      </div>
    </div>`;
    }
    get collectionVideoURL() {
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
        }
        else {
            return undefined;
        }
    }
    get collectionVideoPosterURL() {
        if (this.collection &&
            this.collection.configuration &&
            this.collection.configuration.useVideoCover) {
            const videoPosterURL = YpMediaHelpers.getVideoPosterURL(this.collectionVideos, YpCollectionHelpers.logoImages(this.collectionType, this.collection));
            if (videoPosterURL) {
                return videoPosterURL;
            }
            else {
                return undefined;
            }
        }
        else {
            return undefined;
        }
    }
    get collectionVideos() {
        switch (this.collectionType) {
            case "domain":
                return this.collection.DomainLogoVideos;
            case "community":
                return this.collection.CommunityLogoVideos;
            case "group":
                return this.collection.GroupLogoVideos;
            default:
                return undefined;
        }
    }
    clearVideos() {
        this.collectionVideoId = undefined;
        this.videoPreviewUrl = undefined;
        switch (this.collectionType) {
            case "domain":
                this.collection.DomainLogoVideos = [];
                break;
            case "community":
                this.collection.CommunityLogoVideos = [];
                break;
            case "group":
                this.collection.GroupLogoVideos = [];
                break;
        }
        this.requestUpdate();
    }
    clearHeaderImage() {
        this.uploadedHeaderImageId = undefined;
        switch (this.collectionType) {
            case "domain":
                this.collection.DomainHeaderImages = [];
                break;
            case "community":
                this.collection.CommunityHeaderImages = [];
                break;
            case "group":
                this.collection.GroupHeaderImages = [];
                break;
        }
        this.currentHeaderImages = undefined;
        this.requestUpdate();
    }
    clearImages() {
        this.uploadedLogoImageId = undefined;
        this.imagePreviewUrl = undefined;
        switch (this.collectionType) {
            case "domain":
                this.collection.DomainLogoImages = [];
                break;
            case "community":
                this.collection.CommunityLogoImages = [];
                break;
            case "group":
                this.collection.GroupLogoImages = [];
                break;
        }
        this.currentLogoImages = undefined;
        this.requestUpdate();
    }
    renderCoverMediaContent() {
        if (this.collection?.configuration?.welcomeHTML) {
            return html `<div id="welcomeHTML">
        ${unsafeHTML(this.collection.configuration.welcomeHTML)}
      </div>`;
        }
        else if (this.collectionVideoURL &&
            this.collection?.configuration.useVideoCover) {
            return html `
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
        }
        else if (this.videoPreviewUrl &&
            this.collection?.configuration.useVideoCover) {
            return html `
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
        }
        else if (this.imagePreviewUrl) {
            return html `
        <div style="position: relative;">
          <yp-image
            class="mainImage"
            @loaded="${this.getColorFromLogo}"
            sizing="cover"
            .skipCloudFlare="${true}"
            src="${this.imagePreviewUrl}"
          ></yp-image>
          ${this.gettingImageColor
                ? html `
                <md-linear-progress
                  class="imagePicker"
                  indeterminate
                ></md-linear-progress>
              `
                : nothing}
        </div>
      `;
        }
        else if (this.currentLogoImages && this.currentLogoImages.length > 0) {
            return html `
        <div style="position: relative;">
          <yp-image
            class="image"
            sizing="cover"
            src="${YpMediaHelpers.getImageFormatUrl(this.currentLogoImages)}"
          ></yp-image>
          ${this.gettingImageColor
                ? html `
                <md-linear-progress
                  class="imagePicker"
                  indeterminate
                ></md-linear-progress>
              `
                : nothing}
        </div>
      `;
        }
        else {
            return html `
        <yp-image
          class="image"
          sizing="contain"
          src="https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/ypPlaceHolder2.jpg"
        ></yp-image>
      `;
        }
    }
    async reallyDeleteCurrentLogoImage() {
        if (!this.imagePreviewUrl && this.currentLogoImages) {
            this.currentLogoImages.forEach(async (image) => {
                await window.adminServerApi.deleteImage(image.id, this.collectionType, this.collectionId, this.imageIdsUploadedByUser.includes(image.id));
            });
        }
        else if (this.imagePreviewUrl && this.uploadedLogoImageId) {
            await window.adminServerApi.deleteImage(this.uploadedLogoImageId, this.collectionType, this.collectionId, this.imageIdsUploadedByUser.includes(this.uploadedLogoImageId));
        }
        else {
            console.warn("No image to delete");
        }
        this.clearImages();
    }
    async reallyDeleteCurrentHeaderImage() {
        if (this.currentHeaderImages) {
            this.currentHeaderImages.forEach(async (image) => {
                await window.adminServerApi.deleteImage(image.id, this.collectionType, this.collectionId, this.imageIdsUploadedByUser.includes(image.id));
            });
        }
        else {
            console.warn("No image to delete");
        }
        this.clearHeaderImage();
    }
    async reallyDeleteCurrentVideo() {
        if (!this.videoPreviewUrl && this.collectionVideoId) {
            await window.adminServerApi.deleteVideo(this.collectionVideoId, this.collectionType, this.collectionId, this.videoIdsUploadedByUser.includes(this.collectionVideoId));
        }
        else if (this.videoPreviewUrl && this.uploadedVideoId) {
            await window.adminServerApi.deleteVideo(this.uploadedVideoId, this.collectionType, this.collectionId, this.videoIdsUploadedByUser.includes(this.uploadedVideoId));
        }
        else {
            console.warn("No video to delete");
        }
        this.clearVideos();
    }
    deleteCurrentLogoImage(event) {
        event.preventDefault();
        event.stopPropagation();
        window.appDialogs.getDialogAsync("confirmationDialog", (dialog) => {
            dialog.open(this.t("confirmDeleteLogoImage"), this.reallyDeleteCurrentLogoImage.bind(this));
        });
    }
    deleteCurrentHeaderImage(event) {
        event.preventDefault();
        event.stopPropagation();
        window.appDialogs.getDialogAsync("confirmationDialog", (dialog) => {
            dialog.open(this.t("confirmDeleteLogoImage"), this.reallyDeleteCurrentHeaderImage.bind(this));
        });
    }
    deleteCurrentVideo(event) {
        event.preventDefault();
        event.stopPropagation();
        window.appDialogs.getDialogAsync("confirmationDialog", (dialog) => {
            dialog.open(this.t("confirmDeleteVideo"), this.reallyDeleteCurrentVideo.bind(this));
        });
    }
    renderLogoMedia() {
        return html `
      <div class="layout vertical logoImagePlaceholder">
        ${this.renderCoverMediaContent()}
        ${(this.currentLogoImages && this.currentLogoImages.length > 0) ||
            this.imagePreviewUrl
            ? html `<md-filled-tonal-icon-button
              class="deleteImageButton"
              @click="${this.deleteCurrentLogoImage}"
              ><md-icon>delete</md-icon></md-filled-tonal-icon-button
            >`
            : nothing}
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
            ? html `<md-linear-progress
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
            ${this.collectionVideoURL || this.videoPreviewUrl
            ? html `<md-filled-icon-button
                  style="margin-bottom: 8px;"
                  @click="${this.deleteCurrentVideo}"
                  ><md-icon>delete</md-icon></md-filled-icon-button
                >`
            : nothing}
            <yp-file-upload
              ?hidden="${!this.hasVideoUpload}"
              id="videoFileUpload"
              raised
              style="position: static;"
              useIconButton
              videoUpload
              autoChooseFirstVideoFrameAsPost
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
                ?checked="${this.collection.configuration.useVideoCover}"
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
        return html `
      <div class="layout horizontal">
        <yp-file-upload
          id="headerImageUpload"
          raised
          target="/api/images?itemType=domain-header"
          method="POST"
          buttonIcon="photo_camera"
          .buttonText="${this.t("image.header.upload")}"
          @success="${this._headerImageUploaded}"
        >
        </yp-file-upload>
        ${this.currentHeaderImages && this.currentHeaderImages.length > 0
            ? html `
              <md-icon-button @click="${this.deleteCurrentHeaderImage}">
                <md-icon>delete</md-icon>
              </md-icon-button>
            `
            : nothing}
      </div>
    `;
    }
    static get styles() {
        return [
            super.styles,
            css `
        .saveButton {
          margin-left: 16px;
        }

        .deleteImageButton {
          position: absolute;
          top: 8px;
          left: 8px;
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

        #videoPlayer {
          width: 432px;
          height: 243px;
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
    _setVideoCover(event) {
        this.collection.configuration.useVideoCover = !event.target
            .checked;
        this._configChanged();
        this.configTabs = this.setupConfigTabs();
    }
    renderNameAndDescription(hideDescription = false) {
        return html `
      <div class="layout vertical">
        <md-outlined-text-field
          id="name"
          name="name"
          type="text"
          @change="${this._configChanged}"
          .label="${this.t("Name")}"
          .value="${this.collection.name}"
          maxlength="50"
          charCounter
          class="mainInput"
        ></md-outlined-text-field>
        ${!hideDescription
            ? html `
              <md-outlined-text-field
                id="description"
                name="description"
                type="textarea"
                .value="${this.collection.description || ""}"
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
    _descriptionChanged(event) {
        const description = event.target.value;
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
    render() {
        let collectionType, collectionId, name, description;
        if (this.collectionId === "new") {
            if (this.collectionType === "community") {
                collectionType = "domain";
            }
            else if (this.collectionType === "group") {
                collectionType = "community";
            }
            else if (this.collectionType === "domain") {
                collectionType = "domain";
            }
            collectionId = this.parentCollectionId;
        }
        else if (this.collection) {
            collectionType = this.collectionType;
            collectionId = this.collectionId;
        }
        name = this.nameInput?.value;
        description = this.descriptionInput?.value;
        return this.configTabs
            ? html `
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
    _logoGeneratingInBackground(event) {
        this.generatingAiImageInBackground = true;
    }
    _gotAiImage(event) {
        this.generatingAiImageInBackground = false;
        this.imagePreviewUrl = event.detail.imageUrl;
        this.uploadedLogoImageId = event.detail.imageId;
        this.imageIdsUploadedByUser.push(event.detail.imageId);
        this.configChanged = true;
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("collection") && this.collection) {
            this.configTabs = this.setupConfigTabs();
            //console.error("Collection", this.collection);
        }
        if (changedProperties.has("collectionId") && this.collectionId) {
            if (this.collectionId == "new") {
                this.method = "POST";
            }
            else {
                this.method = "PUT";
            }
        }
    }
    async _getHelpPages(collectionTypeOverride = undefined, collectionIdOverride = undefined) {
        if (this.collectionId && this.collectionId != "new") {
            this.translatedPages = (await window.serverApi.getHelpPages(collectionTypeOverride ? collectionTypeOverride : this.collectionType, collectionIdOverride
                ? collectionIdOverride
                : this.collectionId));
        }
        else {
            console.error("Collection id setup for get help pages");
        }
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this._updateEmojiBindings();
    }
    _getLocalizePageTitle(page) {
        let pageLocale = "en";
        if (window.appGlobals.locale && page.title[window.appGlobals.locale]) {
            pageLocale = window.appGlobals.locale;
        }
        return page.title[pageLocale];
    }
    beforeSave() { }
    afterSave() { }
    sendUpdateCollectionEvents() {
        if (this.collectionType == "domain") {
            this.fireGlobal("yp-refresh-domain");
        }
        else if (this.collectionType == "community") {
            this.fireGlobal("yp-refresh-community");
            window.appGlobals.domainNeedsRefresh = true;
        }
        else if (this.collectionType == "group") {
            this.fireGlobal("yp-refresh-group");
            window.appGlobals.communityNeedsRefresh = true;
        }
    }
    async _save(event) {
        event.preventDefault();
        event.stopPropagation();
        this.beforeSave();
        console.error("Saving collection", this.collection);
        const form = this.$$("#form");
        if (form.validate()) {
            this.$$("#spinner").hidden = false;
            await form.submit();
            this.$$("#spinner").hidden = true;
            this.sendUpdateCollectionEvents();
            this.afterSave();
        }
        else {
            this.fire("yp-form-invalid");
            const error = this.t("form.invalid");
            this._showErrorDialog(error);
        }
    }
    _showErrorDialog(errorText) {
        this.fire("yp-error", errorText);
    }
    _configChanged() {
        this.configChanged = true;
        this.requestUpdate();
    }
    _videoUploaded(event) {
        this.uploadedVideoId = event.detail.videoId;
        this.videoIdsUploadedByUser.push(event.detail.videoId);
        this.collection.configuration.useVideoCover = true;
        this.videoPreviewUrl = event.detail.detail.videoUrl;
        this.connectedVideoToCollection = true;
        this._configChanged();
        this.requestUpdate();
    }
    _getSaveCollectionPath(path) {
        try {
            return eval(`this.collection.${path}`);
        }
        catch (e) {
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
        this.connectedVideoToCollection = false;
        this.imageIdsUploadedByUser = [];
        this.videoIdsUploadedByUser = [];
        this.$$("#headerImageUpload").clear();
        this.$$("#logoImageUpload").clear();
        if (this.$$("#videoFileUpload"))
            this.$$("#videoFileUpload").clear();
    }
    _updateEmojiBindings() {
        setTimeout(() => {
            const description = this.$$("#description");
            const emojiSelector = this.$$("#emojiSelectorDescription");
            if (description && emojiSelector) {
                emojiSelector.inputTarget = description;
            }
            else {
                console.error("Could not find emoji selector or description input");
            }
        }, 500);
    }
    _getCurrentValue(question) {
        if (this.collection && this.collection.configuration) {
            if (["textheader", "textdescription"].indexOf(question.type) == -1) {
                const looseConfig = this.collection.configuration;
                if (question.text.indexOf(".") > -1) {
                    try {
                        return eval(`this.collection.configuration.${question.text}`);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                else {
                    const config = looseConfig[question.text];
                    if (config !== undefined)
                        return config;
                }
            }
        }
    }
}
__decorate([
    property({ type: Array })
], YpAdminConfigBase.prototype, "configTabs", void 0);
__decorate([
    property({ type: Number })
], YpAdminConfigBase.prototype, "selectedTab", void 0);
__decorate([
    property({ type: Boolean })
], YpAdminConfigBase.prototype, "configChanged", void 0);
__decorate([
    property({ type: String })
], YpAdminConfigBase.prototype, "method", void 0);
__decorate([
    property({ type: Array })
], YpAdminConfigBase.prototype, "currentLogoImages", void 0);
__decorate([
    property({ type: Array })
], YpAdminConfigBase.prototype, "currentHeaderImages", void 0);
__decorate([
    property({ type: Number })
], YpAdminConfigBase.prototype, "collectionVideoId", void 0);
__decorate([
    property({ type: Boolean })
], YpAdminConfigBase.prototype, "generatingAiImageInBackground", void 0);
__decorate([
    property({ type: String })
], YpAdminConfigBase.prototype, "action", void 0);
__decorate([
    property({ type: String })
], YpAdminConfigBase.prototype, "subRoute", void 0);
__decorate([
    property({ type: Boolean })
], YpAdminConfigBase.prototype, "hasVideoUpload", void 0);
__decorate([
    property({ type: String })
], YpAdminConfigBase.prototype, "status", void 0);
__decorate([
    property({ type: Boolean })
], YpAdminConfigBase.prototype, "hasAudioUpload", void 0);
__decorate([
    property({ type: Number })
], YpAdminConfigBase.prototype, "uploadedLogoImageId", void 0);
__decorate([
    property({ type: Number })
], YpAdminConfigBase.prototype, "uploadedHeaderImageId", void 0);
__decorate([
    property({ type: Number })
], YpAdminConfigBase.prototype, "uploadedVideoId", void 0);
__decorate([
    property({ type: Boolean })
], YpAdminConfigBase.prototype, "connectedVideoToCollection", void 0);
__decorate([
    property({ type: String })
], YpAdminConfigBase.prototype, "editHeaderText", void 0);
__decorate([
    property({ type: String })
], YpAdminConfigBase.prototype, "toastText", void 0);
__decorate([
    property({ type: String })
], YpAdminConfigBase.prototype, "saveText", void 0);
__decorate([
    property({ type: String })
], YpAdminConfigBase.prototype, "imagePreviewUrl", void 0);
__decorate([
    property({ type: String })
], YpAdminConfigBase.prototype, "videoPreviewUrl", void 0);
__decorate([
    property({ type: Number })
], YpAdminConfigBase.prototype, "themeId", void 0);
__decorate([
    property({ type: Array })
], YpAdminConfigBase.prototype, "translatedPages", void 0);
__decorate([
    property({ type: Number })
], YpAdminConfigBase.prototype, "descriptionMaxLength", void 0);
__decorate([
    property({ type: Boolean })
], YpAdminConfigBase.prototype, "tabsHidden", void 0);
__decorate([
    property({ type: Number })
], YpAdminConfigBase.prototype, "parentCollectionId", void 0);
__decorate([
    property({ type: Object })
], YpAdminConfigBase.prototype, "parentCollection", void 0);
__decorate([
    query("#name")
], YpAdminConfigBase.prototype, "nameInput", void 0);
__decorate([
    query("#description")
], YpAdminConfigBase.prototype, "descriptionInput", void 0);
__decorate([
    property({ type: Boolean })
], YpAdminConfigBase.prototype, "gettingImageColor", void 0);
__decorate([
    property({ type: Array })
], YpAdminConfigBase.prototype, "imageIdsUploadedByUser", void 0);
__decorate([
    property({ type: Array })
], YpAdminConfigBase.prototype, "videoIdsUploadedByUser", void 0);
__decorate([
    property({ type: String })
], YpAdminConfigBase.prototype, "detectedThemeColor", void 0);
//# sourceMappingURL=yp-admin-config-base.js.map