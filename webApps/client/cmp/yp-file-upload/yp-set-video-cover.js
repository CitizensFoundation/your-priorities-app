var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/progress/linear-progress.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import '@material/web/radio/radio.js';
//import '../yp-post/yp-posts-list.js';
import '../common/yp-emoji-selector.js';
//import '../yp-post/yp-post-card-add.js';
import { YpBaseElement } from '../common/yp-base-element.js';
let YpSetVideoCover = class YpSetVideoCover extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.selectedVideoCoverIndex = 0;
        this.useMainPhotoForVideoCover = false;
        this.noDefaultCoverImage = false;
    }
    static get styles() {
        return [
            super.styles,
            css `
        .previewFrame {
          max-height: 50px;
          max-width: 89px;
          height: 50px;
          width: 89px;
          cursor: pointer;
        }

        .videoImages {
          overflow-x: auto;
          width: 200px;
          max-height: 70px;
          height: 70px;
        }

        .selectedCover {
          border-top: 2px solid var(--accent-color);
          max-height: 50px;
          max-width: 89px;
          white-space: nowrap;
        }

        .coverImage {
          max-height: 50px;
          max-width: 89px;
          white-space: nowrap;
        }

        .limitInfo {
          margin-top: 0;
          text-align: center;
          font-size: 14px;
        }

        .mainPhotoCheckbox {
          margin-top: 4px;
          margin-bottom: 4px;
        }
      `,
        ];
    }
    render() {
        return this.videoImages
            ? html `
          <video
            hidden
            controls
            class="previewVideo"
            .url="${this.previewVideoUrl}"></video>
          <div class="layout horizontal videoImages videoPreviewContainer">
            <div style="white-space: nowrap">
              ${this.videoImages.map((image, index) => html `
                  <img
                    .class="${this._classFromImageIndex(index)}"
                    data-index="${index}"
                    @click="${this._selectVideoCover}"
                    sizing="cover"
                    class="previewFrame"
                    src="${image}" />
                `)}

              <div
                class="layout horizontal mainPhotoCheckbox"
                ?hidden="${this.noDefaultCoverImage}">
                <mwc-formfield .label="${this.t('useMainPhoto')}">
                  <md-radio
                    @click="${this._selectVideoCoverMainPhoto}"
                    name="useMainPhoto"></md-radio>
                </mwc-formfield>
              </div>
            </div>
          </div>

        `
            : nothing;
    }
    _classFromImageIndex(index) {
        if (index == this.selectedVideoCoverIndex) {
            return 'selectedCover';
        }
        else {
            return 'coverImage';
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('videoId')) {
            this._getVideoMeta();
        }
    }
    async _getVideoMeta() {
        if (this.videoId) {
            const response = await window.serverApi.getVideoFormatsAndImages(this.videoId);
            if (response.previewVideoUrl && response.videoImages) {
                this.previewVideoUrl = response.previewVideoUrl;
                this.videoImages = response.videoImages;
            }
        }
        else {
            console.error('_getVideoImages no video id');
        }
    }
    _selectVideoCover(event) {
        const frameIndex = event.target.getAttribute('data-index');
        this.fire('set-cover', frameIndex);
        this.fire('set-default-cover', false);
        window.serverApi.setVideoCover(this.videoId, { frameIndex: frameIndex });
    }
    _selectVideoCoverMainPhoto() {
        setTimeout(() => {
            if (this.$$('#useMainPhotoId').checked) {
                window.serverApi.setVideoCover(this.videoId, { frameIndex: -2 });
                this.fire('set-default-cover', true);
            }
            else {
                this.fire('set-default-cover', false);
            }
        });
    }
};
__decorate([
    property({ type: Number })
], YpSetVideoCover.prototype, "videoId", void 0);
__decorate([
    property({ type: String })
], YpSetVideoCover.prototype, "previewVideoUrl", void 0);
__decorate([
    property({ type: Array })
], YpSetVideoCover.prototype, "videoImages", void 0);
__decorate([
    property({ type: Number })
], YpSetVideoCover.prototype, "selectedVideoCoverIndex", void 0);
__decorate([
    property({ type: Boolean })
], YpSetVideoCover.prototype, "useMainPhotoForVideoCover", void 0);
__decorate([
    property({ type: Boolean })
], YpSetVideoCover.prototype, "noDefaultCoverImage", void 0);
YpSetVideoCover = __decorate([
    customElement('yp-set-video-cover')
], YpSetVideoCover);
export { YpSetVideoCover };
//# sourceMappingURL=yp-set-video-cover.js.map