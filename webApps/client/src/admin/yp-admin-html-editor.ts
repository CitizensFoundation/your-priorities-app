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
import { YpConfirmationDialog } from "../yp-dialog-container/yp-confirmation-dialog";

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

  @property({ type: Number })
  mediaIdToDelete: number | undefined;

  @property({ type: String })
  collectionId: number | string | undefined;

  @property({ type: Boolean })
  hasVideoUpload = false;

  @property({ type: Array })
  imageIdsUploadedByUser: number[] = [];

  @property({ type: Array })
  videoIdsUploadedByUser: number[] = [];

  private debounceTimer?: number;

  _selectTab(event: CustomEvent) {
    this.selectedTab = (event.currentTarget as MdTabs).activeTabIndex;
  }

  getConfiguration() {
    console.log(JSON.stringify({
      content: this.content,
      media: this.media,
    }));
    return {
      content: this.content,
      media: this.media,
    };
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

        .deleteMediaButton {
          top: 4px;
          left: 4px;
          position: absolute;
        }

        .insertMediaButton {
          bottom: 4px;
          right: 4px;
          position: absolute;
        }

        .mediaHeader {
          font-size: 20px;
          margin: 24px;
          margin-bottom: 8px;
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
          margin-top: 16px;
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

  override updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.has("media")) {
      console.error("media changed", this.media);
    }
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
    this.imageIdsUploadedByUser.push(uploadedLogoImageId);
    this.requestUpdate();
    this.contentChanged();
  }

  _gotAiImage(event: CustomEvent) {
    const url = event.detail.imageUrl;
    const uploadedLogoImageId = event.detail.imageId;
    this.media.push({
      id: uploadedLogoImageId,
      type: "image",
      url: url,
    } as YpSimpleGroupMediaData);
    this.imageIdsUploadedByUser.push(uploadedLogoImageId);
    this.requestUpdate();
    this.contentChanged();
  }

  _videoUploaded(event: CustomEvent) {
    const uploadedVideoId = event.detail.videoId;
    const url = event.detail.detail.videoUrl;
    this.media.push({
      id: uploadedVideoId,
      type: "video",
      url: url,
    } as YpSimpleGroupMediaData);
    this.videoIdsUploadedByUser.push(uploadedVideoId);
    this.requestUpdate();
    this.contentChanged();
  }

  async reallyDeleteCurrentLogoImage() {
    if (this.mediaIdToDelete) {
      await window.adminServerApi.deleteImage(
        this.mediaIdToDelete,
        "group",
        this.collectionId as number,
        this.imageIdsUploadedByUser.includes(this.mediaIdToDelete),
        true
      );
      this.media = this.media.filter((media) => media.id !== this.mediaIdToDelete);
      this.imageIdsUploadedByUser = this.imageIdsUploadedByUser.filter(
        (id) => id !== this.mediaIdToDelete
      );
      this.mediaIdToDelete = undefined;
      this.contentChanged();
    } else {
      console.warn("No image to delete");
    }
  }

  async reallyDeleteCurrentVideo() {
    if (this.mediaIdToDelete) {
      await window.adminServerApi.deleteVideo(
        this.mediaIdToDelete,
        "group",
        this.collectionId as number,
        this.videoIdsUploadedByUser.includes(this.mediaIdToDelete),
        true
      );
      this.media = this.media.filter((media) => media.id !== this.mediaIdToDelete);
      this.videoIdsUploadedByUser = this.videoIdsUploadedByUser.filter(
        (id) => id !== this.mediaIdToDelete
      );
      this.mediaIdToDelete = undefined;
      this.contentChanged()
    } else {
      console.warn("No video to delete");
    }
  }

  deleteCurrentLogoImage() {
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t("confirmDeleteLogoImage"),
          this.reallyDeleteCurrentLogoImage.bind(this)
        );
      }
    );
  }

  deleteCurrentVideo() {
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t("confirmDeleteVideo"),
          this.reallyDeleteCurrentVideo.bind(this)
        );
      }
    );
  }

  _removeMedia(media: YpSimpleGroupMediaData) {
    this.mediaIdToDelete = media.id;
    if (media.type === "image") {
      this.deleteCurrentLogoImage();
    } else if (media.type === "video") {
      this.deleteCurrentVideo();
    }
    this.debouncedSave();
  }

  renderMedia() {
    return html`
      ${this.renderImageUploadOptions()}

      <div class="layout horizontal wrap">
        ${this.media.map(
          (media) => html`
            <div class="mediaContainer">
              ${media.type === "image"
                ? html`
                    <img
                      class="mediaImage"
                      src="${media.url}"
                      @load="${() => this._setMediaLoaded(media.id, true)}"
                      @error="${() => this._setMediaLoaded(media.id, false)}"
                    />
                  `
                : media.type === "video"
                ? html`
                    <video
                      class="mediaVideo"
                      controls
                      @loadedmetadata="${() =>
                        this._setMediaLoaded(media.id, true)}"
                      @error="${() => this._setMediaLoaded(media.id, false)}"
                    >
                      <source src="${media.url}" type="video/mp4" />
                    </video>
                  `
                : nothing}
              <div
                style="display: ${this.mediaLoaded[media.id]
                  ? "flex"
                  : "none"};"
              >
                <md-filled-tonal-icon-button
                  class="deleteMediaButton"
                  @click="${() => this._removeMedia(media)}"
                  title="${this.t("deleteMedia")}"
                >
                  <md-icon>delete</md-icon>
                </md-filled-tonal-icon-button>
                <md-filled-icon-button
                  class="insertMediaButton"
                  @click="${() => this._insertMediaIntoHtml(media)}"
                  title="${this.t("insertMedia")}"
                >
                  <md-icon>arrow_upward</md-icon>
                </md-filled-icon-button>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  _insertMediaIntoHtml(media: YpSimpleGroupMediaData) {
    if (media.type === "image") {
      const img = `<img src="${media.url}" alt="" />\n`;
      this.content = img + this.content;
      this.contentChanged();
    } else if (media.type === "video") {
      const video = `<video controls><source src="${media.url}" type="video/mp4" /></video>\n`;
      this.content = video + this.content;
      this.contentChanged();
    }
    this.requestUpdate();
  }

  contentChanged() {
    this.fire("configuration-changed");
    this.debouncedSave();
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
        ? html`<div class="previewHtml">${unsafeHTML(this.content)}</div>`
        : nothing}

      <div class="layout horizontal center-center">
        <div class="mediaHeader">${this.t("addMedia")}</div>
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

    this.contentChanged();
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
