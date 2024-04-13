import { LitElement, html, css, PropertyValues, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element";

import "../yp-survey/yp-simple-html-editor.js";
import { MdFilledTextField } from "@material/web/textfield/filled-text-field";

import "@material/web/tabs/primary-tab.js";
import "@material/web/tabs/tabs.js";
import { MdTabs } from "@material/web/tabs/tabs.js";
import "@material/web/icon/icon.js";
import "@material/web/textfield/filled-text-field.js";
import { YpGenerateAiImage } from "../common/yp-generate-ai-image.js";

import "../common/yp-generate-ai-image.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

@customElement("yp-admin-html-editor")
export class YpAdminHtmlEditor extends YpBaseElement {
  @property({ type: String })
  content: string = "";

  @property({ type: Array })
  media: Array<YpSimpleGroupMediaData> = [];

  @property({ type: Number })
  selectedTab = 0;

  @state()
  mediaLoaded: { [key: number]: boolean } = {};

  @property({ type: Boolean })
  generatingAiImageInBackground = false;

  @property({ type: Object })
  group!: YpGroupData;

  @property({ type: Number })
  parentCollectionId: number | undefined;

  @property({ type: String })
  collectionId: number | string | undefined;

  @property({ type: Boolean })
  hasVideoUpload = false;

  private debounceTimer?: number;

  _selectTab(event: CustomEvent) {
    this.selectedTab = (event.currentTarget as MdTabs).activeTabIndex;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener("yp-has-video-upload", () => {
      this.hasVideoUpload = true;
    });
    if (window.appGlobals.hasVideoUpload) this.hasVideoUpload = true;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener("yp-has-video-upload", () => {
      this.hasVideoUpload = true;
    });
  }

  static override get styles() {
    return [
      super.styles,
      css`
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

        .videoUploadIcon {
          margin-top: 16px;
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

  _generateLogo(event: CustomEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.requestUpdate();
    const generator = this.$$("#aiImageGenerator") as YpGenerateAiImage;
    generator.open();
  }

  override firstUpdated(_changedProperties: PropertyValues) {}

  renderAiImageGenerator() {
    return html`<yp-generate-ai-image
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

  _setMediaLoaded(id: number, loaded: boolean) {
    this.mediaLoaded = { ...this.mediaLoaded, [id]: loaded };
    this.requestUpdate();
  }

  _logoImageUploaded(event: CustomEvent) {
    var image = JSON.parse(event.detail.xhr.response);
    const uploadedLogoImageId = image.id;
    const url = JSON.parse(image.formats)[0];
    this.media.push({
      id: uploadedLogoImageId,
      type: "image",
      url: url,
    } as YpSimpleGroupMediaData);
    this.requestUpdate();
  }

  _gotAiImage(event: CustomEvent) {
    const url = event.detail.imageUrl;
    const uploadedLogoImageId = event.detail.imageId;
    this.media.push({
      id: uploadedLogoImageId,
      type: "image",
      url: url,
    } as YpSimpleGroupMediaData);
    this.requestUpdate();
  }

  _videoUploaded(event: CustomEvent) {
    const uploadedVideoId = event.detail.videoId;
    const url = event.detail.videoUrl;
    debugger;
    this.media.push({
      id: uploadedVideoId,
      type: "video",
      url: url,
    } as YpSimpleGroupMediaData);
    this.requestUpdate();
  }

  _removeMedia(media: YpSimpleGroupMediaData) {
    this.media = this.media.filter((m) => m.id !== media.id);
    this.debouncedSave();
  }

  renderMedia() {
    return html`
      <div class="layout horizontal wrap">
        ${this.media.map(
          (media) => html`
            <div class="mediaContainer">
              ${media.type === "image"
                ? html`
                    <img class="mediaImage"
                         src="${media.url}"
                         @load="${() => this._setMediaLoaded(media.id, true)}"
                         @error="${() => this._setMediaLoaded(media.id, false)}" />
                  `
                : media.type === "video"
                ? html`
                    <video class="mediaVideo" controls
                           @loadedmetadata="${() => this._setMediaLoaded(media.id, true)}"
                           @error="${() => this._setMediaLoaded(media.id, false)}">
                      <source src="${media.url}" type="video/mp4" />
                    </video>
                  `
                : nothing}
              <div class="buttonGroup" style="display: ${this.mediaLoaded[media.id] ? 'flex' : 'none'};">
                <md-filled-icon-button
                  @click="${() => this._removeMedia(media)}"
                  title="${this.t("deleteMedia")}">
                  <md-icon>delete</md-icon>
                </md-filled-icon-button>
                <md-filled-icon-button
                  @click="${() => this._insertMediaIntoHtml(media)}"
                  title="${this.t("insertMedia")}">
                  <md-icon>insert_photo</md-icon>
                </md-filled-icon-button>
              </div>
            </div>
          `
        )}
      </div>
      ${this.renderImageUploadOptions()}
    `;
  }


  _insertMediaIntoHtml(media: YpSimpleGroupMediaData) {
    // Insert the selected media URL into the HTML editor or content.
    // This method needs to be implemented based on how you want to handle the insertion.
  }

  renderImageUploadOptions() {
    return html`
      <div class="layout vertical logoImagePlaceholder">
        <div class="layout horizontal center-center logoUploadButtons">
          <yp-file-upload
            id="logoImageUpload"
            raised
            hideStatus
            class="uploadIcon"
            useIconButton
            target="/api/images?itemType=group-html-media"
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
            videoUpload
            autoChooseFirstVideoFrameAsPost
            class="uploadIcon videoUploadIcon"
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

  override render() {
    return html`
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
        ? html`
            <yp-simple-html-editor
              .value="${this.content}"
              @change="${this.changed}"
            ></yp-simple-html-editor>
          `
        : nothing}
      ${this.selectedTab === 1
        ? html`
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
        ? html`<div class="flex previewHtml">${unsafeHTML(this.content)}</div>`
        : nothing}

      <div class="layout horizontal center-center">
        <div class="mediaHeader">${this.t("media")}</div>
      </div>
      ${this.renderMedia()} ${this.renderAiImageGenerator()}
    `;
  }

  changed(event: CustomEvent) {
    if (event.currentTarget) {
      this.content = (event.currentTarget as MdFilledTextField).value;
    } else {
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
}
