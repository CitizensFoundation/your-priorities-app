import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import { ifDefined } from "lit/directives/if-defined.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import { YpAccessHelpers } from "../common/YpAccessHelpers.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";
import { ShadowStyles } from "../common/ShadowStyles.js";
import { MdMenu, Menu } from "@material/web/menu/menu.js";
import { YpCollectionHelpers } from "../common/YpCollectionHelpers.js";

import "../common/yp-image.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/iconbutton/filled-tonal-icon-button.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";

import "../yp-magic-text/yp-magic-text.js";
import "./yp-collection-stats.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";

@customElement("yp-collection-header")
export class YpCollectionHeader extends YpBaseElement {
  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: String })
  collectionType: string | undefined;

  @property({ type: Boolean })
  hideImage = false;

  @property({ type: Number })
  flaggedContentCount: number | undefined;

  @property({ type: Number })
  collectionVideoId: number | undefined;

  @property({ type: String })
  welcomeHTML: string | undefined;

  playStartedAt: Date | undefined;
  videoPlayListener: Function | undefined;
  videoPauseListener: Function | undefined;
  videoEndedListener: Function | undefined;
  audioPlayListener: Function | undefined;
  audioPauseListener: Function | undefined;
  audioEndedListener: Function | undefined;

  override connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener(
      "yp-got-admin-rights",
      this.requestUpdate.bind(this)
    );
    this.addGlobalListener(
      "yp-pause-media-playback",
      this._pauseMediaPlayback.bind(this)
    );
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener("yp-got-admin-rights", this.requestUpdate);
    this.removeGlobalListener(
      "yp-pause-media-playback",
      this._pauseMediaPlayback
    );
    YpMediaHelpers.detachMediaListeners(this as YpElementWithPlayback);
  }

  override firstUpdated(
    changedProperties: Map<string | number | symbol, unknown>
  ) {
    super.firstUpdated(changedProperties);
    YpMediaHelpers.attachMediaListeners(this as YpElementWithPlayback);
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    // TODO: Test this well is it working as expected
    if (changedProperties.has("collection")) {
      YpMediaHelpers.detachMediaListeners(this as YpElementWithPlayback);
    }

    if (this.collection) {
      YpMediaHelpers.attachMediaListeners(this as YpElementWithPlayback);
    }
  }

  _pauseMediaPlayback() {
    YpMediaHelpers.pauseMediaPlayback(this as YpElementWithPlayback);
  }

  _menuSelection(event: CustomEvent) {
    debugger;
    if (this.collection) {
      if (event.detail.item.id === "editMenuItem")
        window.location.href = `/admin/${this.collectionType}/${this.collection.id}`;
      else if (event.detail.item.id === "openAnalyticsApp")
        window.location.href = `/analytics/${this.collectionType}/${this.collection.id}`;
      (this.$$("#adminMenu") as MdMenu).close();
    }
  }

  get hasCollectionAccess(): boolean {
    switch (this.collectionType) {
      case "domain":
        return YpAccessHelpers.checkDomainAccess(
          this.collection as YpDomainData
        );
      case "community":
        return YpAccessHelpers.checkCommunityAccess(
          this.collection as YpCommunityData
        );
      case "group":
        return YpAccessHelpers.checkGroupAccess(this.collection as YpGroupData);
      default:
        return false;
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

  get openMenuLabel(): string {
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

  get collectionHeaderImages(): Array<YpImageData> | undefined {
    switch (this.collectionType) {
      case "domain":
        return (this.collection as YpDomainData).DomainHeaderImages;
      case "community":
        return (this.collection as YpCommunityData).CommunityHeaderImages;
      case "group":
        return (this.collection as YpGroupData).GroupHeaderImages;
      default:
        return undefined;
    }
  }

  get collectionVideoURL(): string | undefined {
    if (
      this.collection &&
      this.collection.configuration &&
      this.collection.configuration.useVideoCover
    ) {
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

  get collectionHeaderImagePath(): string | undefined {
    return YpMediaHelpers.getImageFormatUrl(this.collectionHeaderImages, 0);
  }

  _openAnalyticsAndPromotions() {
    YpNavHelpers.redirectTo(
      `/analytics/${this.collectionType}/${this.collection!.id}`
    );
  }

  _openAdmin() {
    YpNavHelpers.redirectTo(
      `/admin/${this.collectionType}/${this.collection!.id}`
    );
  }

  _openCreateGroupFolder() {}

  // UI

  static override get styles() {
    return [
      super.styles,
      css`
        .stats {
          width: 100%;
          text-align: right;
          justify-content: flex-end;
        }

        .bannerImage {
          width: 100%;
          height: 169px;
          object-fit: cover;
        }

        .nameAndActions {
          width: 100%;
          margin-top: 64px;
          margin-bottom: 24px;
        }

        .allContent {
          margin-left: 64px;
          margin-right: 64px;
        }

        .collection-name {
          font-family: var(
            --md-ref-typeface-brand
          ); /*var(--md-sys-typescale-title-medium-font);*/
          font-size: var(--md-sys-typescale-title-medium-size, 36px);
          font-weight: var(--md-sys-typescale-title-medium-weight, 700);
          line-height: var(--md-sys-typescale-title-medium-line-height);
          text-align: left;
        }

        .collection-name[widetext] {
          font-size: var(--mdc-typography-headline1-widetext-font-size, 20px);
        }

        .collection-name[largeFont] {
          font-size: var(--mdc-typography-headline1-widetext-font-size, 20px);
        }

        .nameText {
          border-radius: 16px;
        }

        .descriptionContainer {
          width: 100%;
        }

        .description {
          padding-left: 32px;
        }

        .description[hide-logo-image] {
          padding-left: 0;
        }

        .image,
        video {
          width: 420px;
          height: 236px;
        }

        .textBox {
          margin-left: 32px;
          position: relative;
        }

        .description {
          font-size: 18px;
          font-weight: 400;
          line-height: 1.5;
        }

        .description[widetext] {
          font-size: 14px;
        }

        #welcomeHTML {
          width: 420px;
          max-width: 420px;
          overflow: hidden;
        }

        :host {
          margin-top: 54px;
          margin-bottom: 32px;
        }

        .topContainer {
          margin: 0;
          margin-top: 0px;
          max-width: 1080px;
          width: 100%;
        }

        md-filled-tonal-icon-button {
          margin-left: 32px;
        }

        .collectionDescriptionimageCard {
          margin-top: 8px;
        }

        @media (max-width: 960px) {
          :host {
            max-width: 423px;
            padding: 0 !important;
            padding-top: 8px !important;
            width: 100%;
            margin-top: 8px;
          }

          #welcomeHTML {
            width: 306px;
            max-width: 306px;
          }

          .collectionDescription {
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

  renderMediaContent() {
    if (this.collection?.configuration?.welcomeHTML) {
      return html`<div id="welcomeHTML">
        ${unsafeHTML(this.collection.configuration.welcomeHTML)}
      </div>`;
    } else if (this.collectionVideoURL) {
      return html`
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
    } else if (this.collection && !this.hideLogoImage) {
      return html`
        <yp-image
          class="image"
          ?hidden="${this.hideImage}"
          .alt="${this.collection.name}"
          sizing="cover"
          .src="${YpCollectionHelpers.logoImagePath(
            this.collectionType,
            this.collection
          )}"
        ></yp-image>
      `;
    } else {
      return nothing;
    }
  }

  renderFooter() {
    return html``;
  }

  renderMenu() {
    return html`
      <div class="menuButton">
        <div class="layout horizontal">
          <md-filled-tonal-icon-button
            ?hidden="${this.collectionType === "domain"}"
            @click="${this._openCreateGroupFolder}"
            title="${this.openMenuLabel}"
            ><md-icon>create_new_folder</md-icon>
          </md-filled-tonal-icon-button>
          <md-filled-tonal-icon-button
            @click="${this._openAnalyticsAndPromotions}"
            title="${this.openMenuLabel}"
            ><md-icon>monitoring</md-icon>
          </md-filled-tonal-icon-button>
          <md-filled-tonal-icon-button
            @click="${this._openAdmin}"
            title="${this.openMenuLabel}"
            ><md-icon>settings</md-icon>
          </md-filled-tonal-icon-button>
        </div>
      </div>
    `;
  }

  renderStats() {
    return html`
      <div class="layout horizontal stats">
        <yp-collection-stats
          .collectionType="${this.collectionType}"
          .collection="${this.collection}"
        ></yp-collection-stats>
      </div>
    `;
  }

  get hideLogoImage(): boolean {
    if (
      this.collectionType == "group" &&
      (this.collection?.configuration as YpGroupConfiguration)
        .alwaysHideLogoImage
    ) {
      return true;
    } else if (
      this.collectionType == "community" &&
      (this.collection?.configuration as YpCommunityConfiguration)
        .alwaysHideLogoImage
    ) {
      return true;
    } else {
      return false;
    }
  }

  renderHeaderBanner() {
    if (this.collectionHeaderImagePath) {
      return html`
        <yp-image
          class="bannerImage"
          .alt="${this.t("bannerImage")}"
          sizing="cover"
          .src="${this.collectionHeaderImagePath}"
        ></yp-image>
      `;
    } else {
      return nothing;
    }
  }

  renderName() {
    return html`
      <div class="nameText">
        <yp-magic-text
          class="collection-name"
          role="heading"
          aria-level="1"
          aria-label="${this.collection!.name}"
          .textType="${YpCollectionHelpers.nameTextType(this.collectionType)}"
          .contentLanguage="${this.collection!.language}"
          ?disableTranslation="${this.collection!.configuration
            ?.disableNameAutoTranslation}"
          textOnly
          .content="${this.collection!.name}"
          .contentId="${this.collection!.id}"
        >
        </yp-magic-text>
      </div>
    `;
  }

  renderDescription() {
    return html`<yp-magic-text
      id="description"
      ?hide-logo-image="${this.hideLogoImage}"
      class="description collectionDescription"
      .textType="${YpCollectionHelpers.descriptionTextType(
        this.collectionType
      )}"
      ?largeFont="${this.largeFont}"
      .contentLanguage="${this.collection!.language}"
      truncate="300"
      .content="${this.collection!.description || this.collection!.objectives}"
      .contentId="${this.collection!.id}"
    >
    </yp-magic-text>`;
  }

  override render() {
    return html`
      ${this.collection
        ? html`
            <div class="layout vertical center-center">
              <div class="layout vertical topContainer">
                ${this.renderHeaderBanner()}
                <div class="allContent">
                  <div
                    class="layout horizontal nameAndActions wrap"
                  >
                    ${this.renderName()}
                    <div class="flex"></div>
                    ${this.hasCollectionAccess ? this.renderMenu() : nothing}
                  </div>
                  <div class="layout horizontal ${!this.wide ? "wrap" : ""}">
                    <div
                      is-video="${ifDefined(this.collectionVideoURL)}"
                      id="cardImage"
                      class="collectionDescriptionimageCard top-card"
                    >
                      ${this.renderMediaContent()}
                    </div>
                    <div id="card" class="layout vertical">
                      <div class="descriptionContainer">
                        ${this.renderDescription()} ${this.renderStats()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              ${this.renderFooter()}
            </div>
          `
        : html``}
    `;
  }
}
