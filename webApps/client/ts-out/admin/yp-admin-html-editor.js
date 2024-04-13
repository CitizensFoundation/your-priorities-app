var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element";
import "../yp-survey/yp-simple-html-editor.js";
import "@material/web/tabs/primary-tab.js";
import "@material/web/tabs/tabs.js";
import "@material/web/icon/icon.js";
import "@material/web/textfield/filled-text-field.js";
import "../common/yp-generate-ai-image.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
let YpAdminHtmlEditor = class YpAdminHtmlEditor extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.content = "";
        this.media = [];
        this.selectedTab = 0;
        this.mediaLoaded = {};
        this.generatingAiImageInBackground = false;
        this.hasVideoUpload = false;
    }
    _selectTab(event) {
        this.selectedTab = event.currentTarget.activeTabIndex;
    }
    connectedCallback() {
        super.connectedCallback();
        this.addGlobalListener("yp-has-video-upload", () => {
            this.hasVideoUpload = true;
        });
        if (window.appGlobals.hasVideoUpload)
            this.hasVideoUpload = true;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeGlobalListener("yp-has-video-upload", () => {
            this.hasVideoUpload = true;
        });
    }
    static get styles() {
        return [
            super.styles,
            css `
        md-tabs {
          width: 100%;
          margin-bottom: 16px;
        }

        .mediaHeader {
          font-size: 20px;
          margin: 24px;
        }

        .uploadIcon {
          margin-left: 4px;
          margin-right: 4px;
        }

        .previewHtml {
          width: 100%;
          height: 100%;
          background-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
        }

        .mediaContainer {
          position: relative;
          height: 150px;
          max-height: 150px;
          margin: 16px;
        }
        .mediaImage,
        .mediaVideo {
          max-width: 100%;
          max-height: 150px;
        }
        .buttonGroup {
          position: absolute;
          bottom: 0;
          right: 0;
          display: flex;
        }
        md-filled-icon-button {
          margin: 4px;
        }
      `,
        ];
    }
    _generateLogo(event) {
        event.preventDefault();
        event.stopPropagation();
        this.requestUpdate();
        const generator = this.$$("#aiImageGenerator");
        generator.open();
    }
    firstUpdated(_changedProperties) { }
    renderAiImageGenerator() {
        return html `<yp-generate-ai-image
      id="aiImageGenerator"
      .collectionType="${this.collectionId === "new" ? "community" : "group"}"
      .collectionId="${this.collectionId === "new"
            ? this.parentCollectionId
            : this.group.id}"
      disableBackgroundGeneration
      @got-image="${this._gotAiImage}"
    >
    </yp-generate-ai-image>`;
    }
    _setMediaLoaded(id, loaded) {
        this.mediaLoaded = { ...this.mediaLoaded, [id]: loaded };
        this.requestUpdate();
    }
    _logoImageUploaded(event) {
        var image = JSON.parse(event.detail.xhr.response);
        const uploadedLogoImageId = image.id;
        const url = JSON.parse(image.formats)[0];
        this.media.push({
            id: uploadedLogoImageId,
            type: "image",
            url: url,
        });
        this.requestUpdate();
    }
    _gotAiImage(event) {
        debugger;
        const url = event.detail.imageUrl;
        const uploadedLogoImageId = event.detail.imageId;
        this.media.push({
            id: uploadedLogoImageId,
            type: "image",
            url: url,
        });
        this.requestUpdate();
    }
    _videoUploaded(event) {
        const uploadedVideoId = event.detail.videoId;
        const url = event.detail.videoUrl;
        this.media.push({
            id: uploadedVideoId,
            type: "video",
            url: url,
        });
        this.requestUpdate();
    }
    _removeMedia(media) {
        this.media = this.media.filter((m) => m.id !== media.id);
        this.debouncedSave();
    }
    renderMedia() {
        return html `
      <div class="layout horizontal wrap">
        ${this.media.map((media) => html `
            <div class="mediaContainer">
              ${media.type === "image"
            ? html ` <img class="mediaImage" src="${media.url}" /> `
            : media.type === "video"
                ? html `
                    <video class="mediaVideo" controls>
                      <source src="${media.url}" type="video/mp4" />
                    </video>
                  `
                : nothing}
              <div class="buttonGroup">
                <md-filled-icon-button
                  @click="${() => this._removeMedia(media)}"
                  title="${this.t("deleteMedia")}"
                  ><md-icon>delete</md-icon>
                </md-filled-icon-button>
                <md-filled-icon-button
                  @click="${() => this._insertMediaIntoHtml(media)}"
                  title="${this.t("insertMedia")}"
                  ><md-icon>insert_photo</md-icon>
                </md-filled-icon-button>
              </div>
            </div>
          `)}
      </div>
      ${this.renderImageUploadOptions()}
    `;
    }
    _insertMediaIntoHtml(media) {
        // Insert the selected media URL into the HTML editor or content.
        // This method needs to be implemented based on how you want to handle the insertion.
    }
    renderImageUploadOptions() {
        return html `
      <div class="layout vertical logoImagePlaceholder">
        <div class="layout horizontal center-center logoUploadButtons">
          <yp-file-upload
            id="logoImageUpload"
            raised
            hideStatus
            class="uploadIcon"
            useIconButton
            target="/api/images?itemType=domain-logo"
            method="POST"
            buttonIcon="photo_camera"
            .buttonText="${this.t("image.logo.upload")}"
            @success="${this._logoImageUploaded}"
          >
          </yp-file-upload>
          <div class="aiGenerationIconContainer uploadIcon">
            <md-filled-icon-button
              ?hidden="${!this.hasLlm}"
              id="generateButton"
              @click="${this._generateLogo}"
              ><md-icon>smart_toy</md-icon></md-filled-icon-button
            >
          </div>

          <yp-file-upload
            ?hidden="${!this.hasVideoUpload}"
            id="videoFileUpload"
            raised
            useIconButton
            hideStatus
            videoUpload
            class="uploadIcon"
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
    render() {
        return html `
      <div class="layout vertical center-center">
        <md-tabs
          @change="${this._selectTab}"
          .activeTabIndex="${this.selectedTab}"
        >
          <md-primary-tab
            >${this.t("simpleHtmlEditor")}
            <md-icon slot="icon">edit_note</md-icon></md-primary-tab
          >
          <md-primary-tab
            >${this.t("editHtmlDirectly")}
            <md-icon slot="icon">html</md-icon></md-primary-tab
          >
          <md-primary-tab
            >${this.t("previewHtml")}
            <md-icon slot="icon">preview</md-icon></md-primary-tab
          >
        </md-tabs>
      </div>

      ${this.selectedTab === 0
            ? html `
            <yp-simple-html-editor
              .value="${this.content}"
              @change="${this.changed}"
            ></yp-simple-html-editor>
          `
            : nothing}
      ${this.selectedTab === 1
            ? html `
            <md-filled-text-field
              data-type="text"
              type="textarea"
              .label="${this.t("editHtmlDirectly")}"
              .value="${this.content}"
              minlength="2"
              @change="${this.changed}"
              rows="14"
              style="width: 100%;--md-filled-field-container-color: var(--md-sys-color-surface);"
            >
            </md-filled-text-field>
          `
            : nothing}
      ${this.selectedTab === 2
            ? html `<div class="flex previewHtml">${unsafeHTML(this.content)}</div>`
            : nothing}

      <div class="layout horizontal center-center">
        <div class="mediaHeader">${this.t("media")}</div>
      </div>
      ${this.renderMedia()} ${this.renderAiImageGenerator()}
    `;
    }
    changed(event) {
        if (event.currentTarget) {
            this.content = event.currentTarget.value;
        }
        else {
            this.content = event.detail.value;
        }
        this.debouncedSave();
    }
    debouncedSave() {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = window.setTimeout(() => {
            // this.save();
        }, 10000); // Adjust the delay time as needed
    }
};
__decorate([
    property({ type: String })
], YpAdminHtmlEditor.prototype, "content", void 0);
__decorate([
    property({ type: Array })
], YpAdminHtmlEditor.prototype, "media", void 0);
__decorate([
    property({ type: Number })
], YpAdminHtmlEditor.prototype, "selectedTab", void 0);
__decorate([
    state()
], YpAdminHtmlEditor.prototype, "mediaLoaded", void 0);
__decorate([
    property({ type: Boolean })
], YpAdminHtmlEditor.prototype, "generatingAiImageInBackground", void 0);
__decorate([
    property({ type: Object })
], YpAdminHtmlEditor.prototype, "group", void 0);
__decorate([
    property({ type: Number })
], YpAdminHtmlEditor.prototype, "parentCollectionId", void 0);
__decorate([
    property({ type: String })
], YpAdminHtmlEditor.prototype, "collectionId", void 0);
__decorate([
    property({ type: Boolean })
], YpAdminHtmlEditor.prototype, "hasVideoUpload", void 0);
YpAdminHtmlEditor = __decorate([
    customElement("yp-admin-html-editor")
], YpAdminHtmlEditor);
export { YpAdminHtmlEditor };
//# sourceMappingURL=yp-admin-html-editor.js.map