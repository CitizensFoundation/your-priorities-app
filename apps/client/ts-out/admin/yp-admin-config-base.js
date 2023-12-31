var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from "lit";
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
export class YpAdminConfigBase extends YpAdminPage {
    constructor() {
        super();
        this.selectedTab = 0;
        this.configChanged = false;
        this.method = "POST";
        this.hasVideoUpload = false;
        this.hasAudioUpload = false;
        this.descriptionMaxLength = 300;
        this.tabsHidden = false;
    }
    async _formResponse(event) {
        this.configChanged = false;
    }
    _selectTab(event) {
        this.selectedTab = event.target.activeTabIndex;
    }
    _updateCollection(event) {
        this.collection = event.detail;
    }
    connectedCallback() {
        super.connectedCallback();
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
        this.imagePreviewUrl = JSON.parse(image.formats)[0];
        this.configChanged = true;
    }
    _headerImageUploaded(event) {
        var image = JSON.parse(event.detail.xhr.response);
        this.uploadedHeaderImageId = image.id;
        this.configChanged = true;
    }
    renderSaveButton() {
        return html `
      <div class="layout horizontal">
        <md-filled-button
          raised
          class="saveButton"
          ?disabled="${!this.configChanged}"
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
          <md-tabs @change="${this._selectTab}">
            ${this.configTabs.map((item) => html `
                <md-secondary-tab
                  >${this.t(item.name)}<md-icon
                    >${item.icon}</md-icon
                  ></md-secondary-tab
                >
              `)}
          </md-tabs>
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
                  <yp-structured-question-edit
                    index="${index}"
                    id="configQuestion_${index}"
                    @yp-answer-content-changed="${this._configChanged}"
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
                `}
          `)}
      </div>
    </div>`;
    }
    get collectionVideoURL() {
        if (this.collection &&
            this.collection.configuration &&
            this.collection.configuration.useVideoCover) {
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
    renderCoverMediaContent() {
        if (this.collection?.configuration?.welcomeHTML) {
            return html `<div id="welcomeHTML">
        ${unsafeHTML(this.collection.configuration.welcomeHTML)}
      </div>`;
        }
        else if (this.imagePreviewUrl) {
            return html `
        <yp-image
          class="image"
          sizing="contain"
          .src="${this.imagePreviewUrl}"
        ></yp-image>
      `;
        }
        else if (this.collectionVideoURL) {
            return html `
        <video
          id="videoPlayer"
          data-id="${ifDefined(this.collectionVideoId)}"
          controls
          preload="metadata"
          class="image"
          src="${this.collectionVideoURL}"
          playsinline
          poster="${ifDefined(this.collectionVideoPosterURL)}"
        ></video>
      `;
        }
        else if (this.currentLogoImages) {
            return html `
        <yp-image
          class="image"
          sizing="contain"
          .src="${YpMediaHelpers.getImageFormatUrl(this.currentLogoImages)}"
        ></yp-image>
      `;
        }
        else {
            return nothing;
        }
    }
    renderLogoMedia() {
        return html `
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
          <md-filled-icon-button
            id="generateButton"
            @click="${this._generateLogo}"
            ><md-icon>smart_toy</md-icon></md-filled-icon-button
          >
          <yp-file-upload
            ?hidden="${!this.hasVideoUpload}"
            id="videoFileUpload"
            raised
            useIconButton
            videoUpload
            method="POST"
            buttonIcon="videocam"
            .buttonText="${this.t("uploadVideo")}"
            @success="${this._videoUploaded}"
          >
          </yp-file-upload>
        </div>
      </div>
    `;
    }
    renderHeaderImageUploads() {
        return html `
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
    static get styles() {
        return [
            super.styles,
            css `
        .saveButton {
          margin-left: 16px;
        }

        md-outlined-text-field {
          width: 400px;
        }

        md-tabs {
          margin-top: 16px;
          margin-bottom: 24px;
          width: 100%;
        }

        .topInputContainer {
          margin-top: 16px;
          max-width: 1024px;
          padding: 24px;
          background-color: var(--md-sys-color-surface-variant);
          color: var(--md-sys-color-on-surface-variant);
          border-radius: 16px;
        }

        .adminItem {
          margin: 8px;
          max-width: 420px;
          margin-bottom: 32px;
        }

        .innerTabContainer {
          background-color: var(--md-sys-color-surface-variant);
          color: var(--md-sys-color-on-surface-variant);
          border-radius: 16px;
          width: 100%;
          max-width: 1024px;
          padding: 16px;
          margin-bottom: 128px;
        }

        @media (max-width: 600px) {
          .innerTabContainer {
            width: 100%;
          }
        }

        yp-structured-question-edit {
          max-width: 420px;
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

        #generateButton {
          margin-left: 16px;
          margin-right: 16px;
          margin-bottom: 16px;
        }

        #logoImageUpload {
          margin-bottom: 16px;
      `,
        ];
    }
    renderVideoUpload() {
        return html `
      <div class="layout vertical uploadSection">
        <yp-file-upload
          id="videoFileUpload"
          raised
          videoUpload
          method="POST"
          buttonIcon="videocam"
          .buttonText="${this.t("uploadVideo")}"
          @success="${this._videoUploaded}"
        >
        </yp-file-upload>
        <label>
          <md-checkbox
            name="useVideoCover"
            ?disabled="${!this.uploadedVideoId}"
            ?checked="${this.collection.configuration.useVideoCover}"
          >
          </md-checkbox>
          ${this.t("useVideoCover")}
        </label>
      </div>
    `;
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
                charCounter
                @change="${this._configChanged}"
                rows="3"
                @keyup="${this._descriptionChanged}"
                .maxlength="${this.descriptionMaxLength}"
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
            @got-image="${this._gotAiImage}"
          >
          </yp-generate-ai-image>
        `
            : nothing;
    }
    _gotAiImage(event) {
        this.imagePreviewUrl = event.detail.imageUrl;
        this.uploadedLogoImageId = event.detail.imageId;
        this.configChanged = true;
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("collection") && this.collection) {
            this.configTabs = this.setupConfigTabs();
            console.error("Collection", this.collection);
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
    _getLocalizePageTitle(page) {
        let pageLocale = "en";
        if (window.appGlobals.locale && page.title[window.appGlobals.locale]) {
            pageLocale = window.appGlobals.locale;
        }
        return page.title[pageLocale];
    }
    beforeSave() { }
    sendUpdateCollectionEvents() {
        if (this.collectionType == "domain") {
            this.fireGlobal("yp-refresh-domain");
        }
        else if (this.collectionType == "community") {
            this.fireGlobal("yp-refresh-community");
        }
        else if (this.collectionType == "group") {
            this.fireGlobal("yp-refresh-group");
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
    }
    _videoUploaded(event) {
        this.uploadedVideoId = event.detail.videoId;
        this.collection.configuration.useVideoCover = true;
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
        this.$$("#headerImageUpload").clear();
        this.$$("#logoImageUpload").clear();
        if (this.$$("#videoFileUpload"))
            this.$$("#videoFileUpload").clear();
    }
    /*_updateEmojiBindings() {
      setTimeout(() => {
        const description = this.$$('#description') as HTMLInputElement;
        //      description.dispatchEvent(new CustomEvent("changed"));
        const emojiSelector = this.$$(
          '#emojiSelectorDescription'
        ) as YpEmojiSelector;
        if (description && emojiSelector) {
          emojiSelector.inputTarget = description;
        } else {
          console.warn("Collection edit: Can't bind emojis :(");
        }
      }, 500);
    }*/
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
    property({ type: Number })
], YpAdminConfigBase.prototype, "collectionVideoId", void 0);
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
//# sourceMappingURL=yp-admin-config-base.js.map