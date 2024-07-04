var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import { YpAccessHelpers } from "../common/YpAccessHelpers.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";
import { YpCollectionHelpers } from "../common/YpCollectionHelpers.js";
import "../common/yp-image.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";
import "../yp-magic-text/yp-magic-text.js";
import "./yp-collection-stats.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
let YpCollectionHeader = class YpCollectionHeader extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.hideImage = false;
    }
    get hasCollectionAccess() {
        switch (this.collectionType) {
            case "domain":
                return YpAccessHelpers.checkDomainAccess(this.collection);
            case "community":
                return YpAccessHelpers.checkCommunityAccess(this.collection);
            case "group":
                return YpAccessHelpers.checkGroupAccess(this.collection);
            default:
                return false;
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
    get openMenuLabel() {
        switch (this.collectionType) {
            case "domain":
                return this.t("openDomainMenu");
            case "community":
                return this.t("openCommunityMenu");
            case "group":
                return this.t("openGroupMenu");
            default:
                return "Open menu";
        }
    }
    get collectionHeaderImages() {
        switch (this.collectionType) {
            case "domain":
                return this.collection.DomainHeaderImages;
            case "community":
                return this.collection.CommunityHeaderImages;
            case "group":
                return this.collection.GroupHeaderImages;
            default:
                return undefined;
        }
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
    get collectionHeaderImagePath() {
        return YpMediaHelpers.getImageFormatUrl(this.collectionHeaderImages, 0);
    }
    // UI
    static get styles() {
        return [
            super.styles,
            css `
        .stats {
          position: absolute;
          bottom: 0;
          right: 8px;
        }

        md-icon-button {
          margin-top: 10px;
          margin-right: 4px;
        }

        .collection-name {
          font-family: var(--md-ref-typeface-brand); /*var(--md-sys-typescale-title-medium-font);*/
          font-size: var(--md-sys-typescale-title-medium-size, 22px);
          font-weight: var(--md-sys-typescale-title-medium-weight, 400);
          line-height: var(--md-sys-typescale-title-medium-line-height);
          padding: 16px;
          max-width: 320px;
          text-align: left;
        }

        .collection-name[widetext] {
          font-size: var(--mdc-typography-headline1-widetext-font-size, 20px);
        }

        .collection-name[largeFont] {
          font-size: var(--mdc-typography-headline1-widetext-font-size, 20px);
        }

        .nameText {
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          border-radius: 16px;
        }

        .descriptionContainer {
          width: 100%;
        }

        .large-card {
          background-color: var(--md-sys-color-surface-container-low);
          color: var(--md-sys-color-on-surface);
          height: 243px;
          width: 432px;
          border-radius: 16px;
          padding: 0 !important;
          margin-top: 0 !important;
        }

        .image,
        video {
          width: 432px;
          height: 243px;
        }

        .menuButton {
          position: absolute;
          top: 0;
          right: 0;
        }

        .textBox {
          margin-left: 32px;
          position: relative;
        }

        .description {
          padding: 16px;
          vertical-align: middle;
          font-size: 16px;
          line-height: 1.35;
        }

        .description[widetext] {
          font-size: 14px;
        }

        #welcomeHTML {
          width: 432px;
          max-width: 432px;
          overflow: hidden;
        }

        :host {
          margin-top: 32px;
          margin-bottom: 32px;
        }

        @media (max-width: 960px) {
          :host {
            max-width: 423px;
            padding: 0 !important;
            padding-top: 8px !important;
            width: 100%;
            margin-top: 8px;
          }

          .cardImage {
          }

          #welcomeHTML {
            width: 306px;
            max-width: 306px;
          }

          .large-card {
            width: 100%;
            height: 100%;
            margin-left: 8px;
            margin-right: 8px;
            margin-top: 8px !important;
          }

          .top-card {
            margin-bottom: 16px;
          }

          yp-image,
          video,
          .image {
            width: 100%;
            height: 230px;
          }

          .imageCard {
            height: 230px;
          }

          .imageCard[is-video] {
            background-color: transparent;
          }

          .collection-name {
            font-size: 22px;
            padding-bottom: 9px;
            min-height: 28px;
          }

          .description {
            padding-bottom: 42px;
          }

          .textBox {
            margin-left: 8px;
          }
        }

        @media (max-width: 375px) {
          yp-image,
          video,
          .image {
            height: 225px;
          }

          .imageCard {
            height: 225px;
          }
        }

        @media (max-width: 375px) {
          yp-image,
          video,
          .image {
            height: 207px;
          }

          .imageCard {
            height: 205px;
          }
        }

        @media (max-width: 360px) {
          yp-image,
          video,
          .image {
            height: 200px;
          }

          .imageCard {
            height: 200px;
          }
        }

        @media (max-width: 320px) {
          yp-image,
          video,
          .image {
            height: 180px;
          }

          .imageCard {
            height: 180px;
          }
        }

        [hidden] {
          display: none !important;
        }

        a {
          text-decoration: none;
          color: inherit;
        }
      `,
        ];
    }
    renderStats() {
        switch (this.collectionType) {
            case "domain":
                return html ``;
            case "community":
                return html ``;
            case "group":
                return html ``;
            default:
                return nothing;
        }
    }
    renderFirstBoxContent() {
        if (this.collection?.configuration?.welcomeHTML) {
            return html `<div id="welcomeHTML">
        ${unsafeHTML(this.collection.configuration.welcomeHTML)}
      </div>`;
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
        else if (this.collection) {
            return html `
        <yp-image
          class="image"
          ?hidden="${this.hideImage}"
          .alt="${this.collection.name}"
          sizing="cover"
          .src="${YpCollectionHelpers.logoImagePath(this.collectionType, this.collection)}"
        ></yp-image>
      `;
        }
        else {
            return nothing;
        }
    }
    _openAnalyticsAndPromption() {
        YpNavHelpers.redirectTo(`/analytics/${this.collectionType}/${this.collection.id}`);
    }
    _openAdmin() {
        YpNavHelpers.redirectTo(`/admin/${this.collectionType}/${this.collection.id}`);
    }
    renderMenu() {
        return html `
      <div class="menuButton">
        <div class="layout horizontal">
          <md-icon-button
            id="menuButton"
            @click="${this._openAnalyticsAndPromption}"
            title="${this.openMenuLabel}"
            ><md-icon>analytics</md-icon>
          </md-icon-button>
          <md-icon-button
            id="menuButton"
            @click="${this._openAdmin}"
            title="${this.openMenuLabel}"
            ><md-icon>settings</md-icon>
          </md-icon-button>
        </div>
      </div>
    `;
    }
    renderFooter() {
        return html `
      <div class="stats layout horizontal">
        <yp-collection-stats
          .collectionType="${this.collectionType}"
          .collection="${this.collection}"
        ></yp-collection-stats>
      </div>
    `;
    }
    render() {
        return html `
      ${this.collection
            ? html `
            <div class="layout horizontal wrap">
              <div
                is-video="${ifDefined(this.collectionVideoURL)}"
                id="cardImage"
                class="large-card imageCard top-card"
              >
                ${this.renderFirstBoxContent()}
              </div>
              <div id="card" class="large-card textBox layout horizontal">
                <div class="descriptionContainer">
                  <div class="nameText">
                    <yp-magic-text
                      class="collection-name"
                      role="heading"
                      aria-level="1"
                      ?largeFont="${this.largeFont}"
                      aria-label="${this.collection.name}"
                      .textType="${YpCollectionHelpers.nameTextType(this.collectionType)}"
                      .contentLanguage="${this.collection.language}"
                      ?disableTranslation="${this.collection.configuration
                ?.disableNameAutoTranslation}"
                      textOnly
                      .content="${this.collection.name}"
                      .contentId="${this.collection.id}"
                    >
                    </yp-magic-text>
                  </div>
                  <yp-magic-text
                    id="description"
                    class="description collectionDescription"
                    .textType="${YpCollectionHelpers.descriptionTextType(this.collectionType)}"
                    ?largeFont="${this.largeFont}"
                    .contentLanguage="${this.collection.language}"
                    truncate="300"
                    .content="${this.collection.description ||
                this.collection.objectives}"
                    .contentId="${this.collection.id}"
                  >
                  </yp-magic-text>
                </div>

                ${this.hasCollectionAccess ? this.renderMenu() : nothing}
                ${this.renderFooter()}
              </div>
            </div>
          `
            : html ``}
    `;
    }
    // EVENTS
    connectedCallback() {
        super.connectedCallback();
        this.addGlobalListener("yp-got-admin-rights", this.requestUpdate.bind(this));
        this.addGlobalListener("yp-pause-media-playback", this._pauseMediaPlayback.bind(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeGlobalListener("yp-got-admin-rights", this.requestUpdate);
        this.removeGlobalListener("yp-pause-media-playback", this._pauseMediaPlayback);
        YpMediaHelpers.detachMediaListeners(this);
    }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        YpMediaHelpers.attachMediaListeners(this);
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        // TODO: Test this well is it working as expected
        if (changedProperties.has("collection")) {
            YpMediaHelpers.detachMediaListeners(this);
        }
        if (this.collection) {
            YpMediaHelpers.attachMediaListeners(this);
        }
    }
    _pauseMediaPlayback() {
        YpMediaHelpers.pauseMediaPlayback(this);
    }
    _menuSelection(event) {
        debugger;
        if (this.collection) {
            if (event.detail.item.id === "editMenuItem")
                window.location.href = `/admin/${this.collectionType}/${this.collection.id}`;
            else if (event.detail.item.id === "openAnalyticsApp")
                window.location.href = `/analytics/${this.collectionType}/${this.collection.id}`;
            this.$$("#adminMenu").close();
        }
    }
};
__decorate([
    property({ type: Object })
], YpCollectionHeader.prototype, "collection", void 0);
__decorate([
    property({ type: String })
], YpCollectionHeader.prototype, "collectionType", void 0);
__decorate([
    property({ type: Boolean })
], YpCollectionHeader.prototype, "hideImage", void 0);
__decorate([
    property({ type: Number })
], YpCollectionHeader.prototype, "flaggedContentCount", void 0);
__decorate([
    property({ type: Number })
], YpCollectionHeader.prototype, "collectionVideoId", void 0);
__decorate([
    property({ type: String })
], YpCollectionHeader.prototype, "welcomeHTML", void 0);
YpCollectionHeader = __decorate([
    customElement("yp-collection-header")
], YpCollectionHeader);
export { YpCollectionHeader };
//# sourceMappingURL=yp-collection-header.js.map