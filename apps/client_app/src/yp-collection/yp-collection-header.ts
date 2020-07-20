import { property, html, css, customElement, supportsAdoptingStyleSheets } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';

@customElement('yp-collection-header')
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

  get hasCollectionAccess(): boolean {
    switch(this.collectionType) {
      case 'domain':
        return YpAccessHelpers.checkDomainAccess(this.collection as YpDomainData);
      case 'community':
        return YpAccessHelpers.checkCommunityAccess(this.collection as YpCommunityData);
      case 'group':
        return YpAccessHelpers.checkGroupAccess(this.collection as YpGroupData);
      default:
        return false;
    }
  }

  get collectionVideos(): Array<YpVideoData> | undefined {
    switch(this.collectionType) {
      case 'domain':
        return (this.collection as YpDomainData).DomainLogoVideos;
      case 'community':
        return (this.collection as YpCommunityData).CommunityLogoVideos;
      case 'group':
        return (this.collection as YpGroupData).GroupLogoVideos;
    }
  }

  get collectionNameTextType(): string | undefined {
    switch(this.collectionType) {
      case 'domain':
        return "domainName";
      case 'community':
        return "communityName";
      case 'group':
        return "groupName";
    }
  }

  get openMenuLabel(): string {
    switch(this.collectionType) {
      case 'domain':
        return this.t('openDomainMenu');
      case 'community':
        return this.t('openCommunityMenu');
      case 'group':
        return this.t('openGroupMenu');
      default:
        return "Open menu"
    }
  }

  get collectionDescriptionTextType(): string | undefined {
    switch(this.collectionType) {
      case 'domain':
        return "domainContent";
      case 'community':
        return "communityContent";
      case 'group':
        return "groupContent";
    }
  }

  get collectionLogoImages(): Array<YpImageData> | undefined {
    switch(this.collectionType) {
      case 'domain':
        return (this.collection as YpDomainData).DomainLogoImages;
      case 'community':
        return (this.collection as YpCommunityData).CommunityLogoImages;
      case 'group':
        return (this.collection as YpGroupData).GroupLogoImages;
    }
  }

  get collectionHeaderImages(): Array<YpImageData> | undefined {
    switch(this.collectionType) {
      case 'domain':
        return (this.collection as YpDomainData).DomainHeaderImages;
      case 'community':
        return (this.collection as YpCommunityData).CommunityHeaderImages;
      case 'group':
        return (this.collection as YpGroupData).GroupHeaderImages;
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
        } else {
          return undefined;
        }
      }
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
        this.collectionLogoImages
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

  get collectionLogoImagePath(): string | undefined {
    return YpMediaHelpers.getImageFormatUrl(this.collectionLogoImages, 0);
  }

  get collectionHeaderImagePath(): string | undefined {
    return YpMediaHelpers.getImageFormatUrl(this.collectionHeaderImages, 0);
  }

  // UI

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        .stats {
          position: absolute;
          bottom: 0;
          right: 8px;
        }

        yp-collection-stats {
          color: #fff;
        }

        .collection-name {
          padding: 0;
          padding-bottom: 4px;
          padding-right: 1px;
          margin: 0;
          min-height: 54px;
          font-size: 42px;
          font-weight: bold;
        }

        .large-card {
          background-color: #fefefe;
          color: #333;
          height: 243px;
          width: 432px;
          padding: 0 !important;
          margin-top: 0 !important;
        }

        .image,
        video {
          width: 432px;
          height: 243px;
        }

        .description-and-stats {
          width: 100%;
        }

        .edit {
          color: #fff;
          position: absolute;
          top: 0;
          right: 0px;
          padding-right: 0;
          margin-right: 0;
        }

        h1 {
          font-size: 42px;
        }

        .textBox {
          margin-left: 32px;
          position: relative;
        }

        .description {
          padding: 0;
          margin: 0;
        }welcomeHTML
          color: #fafafa;
          padding: 12px;
          padding-left: 16px;
          vertical-align: middle;
          margin: 0;
          padding-right: 32px;
          padding-bottom: 6px;
          padding-top: 14px;
        }

        @media (max-width: 960px) {
          :host {
            max-width: 423px;
            padding: 0 !important;
            padding-top: 8px !important;
            width: 100%;
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

          iron-image,
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
          iron-image,
          video,
          .image {
            height: 225px;
          }

          .imageCard {
            height: 225px;
          }
        }

        @media (max-width: 375px) {
          iron-image,
          video,
          .image {
            height: 207px;
          }

          .imageCard {
            height: 205px;
          }
        }

        @media (max-width: 360px) {
          iron-image,
          video,
          .image {
            height: 200px;
          }

          .imageCard {
            height: 200px;
          }
        }

        @media (max-width: 320px) {
          iron-image,
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
    switch(this.collectionType) {
      case 'domain':
        return html``;
      case 'community':
        return html``;
      case 'group':
        return html``;
      default:
        return nothing;
    }
  }

  renderFirstBox() {
    if (this.welcomeHTML) {
      return html``;
    } else if (this.collectionVideoURL) {
      return html``;
    } else {
      return html``;
    }

  }

  render() {
    return html`
      ${this.collection
        ? html`
            <div class="layout horizontal wrap">
              <div
                is-video="${ifDefined(this.collectionVideoURL === null ? undefined : true)}"
                id="cardImage"
                class="large-card imageCard top-card shadow-elevation-6dp shadow-transition">
                ${this.collectionVideoURL
                  ? html`
                      <video
                        id="videoPlayer"
                        data-id="${ifDefined(this.collectionVideoId)}"
                        controls
                        preload="metadata"
                        class="image"
                        src="${this.collectionVideoURL}"
                        playsinline
                        poster="${ifDefined(this.collectionVideoPosterURL)}"></video>
                    `
                  : html`
                      <iron-image
                        class="image"
                        ?hidden="${this.hideImage}"
                        .alt="${this.collection.name}"
                        sizing="cover"
                        src="${this.collectionLogoImagePath}"></iron-image>
                    `}
              </div>
              <div
                id="card"
                class="large-card textBox shadow-elevation-6dp shadow-transition layout horizontal">
                <div class="layout vertical description-and-stats">
                  <div class="descriptionContainer">
                    <div
                      class="collection-name"
                      role="heading"
                      aria-level="1"
                      aria-label="${this.collection.name}">
                      <yp-magic-text
                        .textType="${this.collectionNameTextType}"
                        .contentLanguage="${this.collection.language}"
                        .disableTranslation="${this.collection.configuration?.disableNameAutoTranslation}"
                        textOnly
                        .content="${this.collection.name}"
                        .contentId="${this.collection.id}">
                      </yp-magic-text>
                    </div>
                    <yp-magic-text
                      id="description"
                      class="description collectionDescription"
                      .textType="${this.collectionDescriptionTextType}"
                      .contentLanguage="${this.collection.language}"
                      .content="${this.collection.description || this.collection.objectives}"
                      .contentId="${this.collection.id}">
                    </yp-magic-text>
                  </div>

                  <div style="position: relative;">
                    <mwc-icon-button
                      id="helpIconButton"
                      icon="help_outline"
                      @click="${this._openMenu}"
                      title="${this.openMenuLabel}">
                    </mwc-icon-button>
                    <mwc-menu id="menu" @changed="${this._menuSelection}">
                      <mwc-list-item id="openAdminApp">${this.t('openAdministration')}</mwc-list-item>
                      <mwc-list-item id="openAnalyticsApp">${this.t('openAnalyticsApp')}</mwc-list-item>
                    </mwc-menu>
                  </div>
                </div>

                <div class="stats layout horizontal">
                  ${this.renderStats()}
                </div>
              </div>
            </div>
          `
        : html``}
    `;
  }


 // EVENTS

  connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener("yp-got-admin-rights", this.requestUpdate);
    this.addGlobalListener("yp-pause-media-playback", this._pauseMediaPlayback);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener("yp-got-admin-rights", this.requestUpdate);
    this.removeGlobalListener("yp-pause-media-playback", this._pauseMediaPlayback);
    YpMediaHelpers.detachMediaListeners(this as YpElementWithPlayback);
  }

  firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
    super.firstUpdated(changedProperties);
    YpMediaHelpers.attachMediaListeners(this as YpElementWithPlayback);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
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
    if (this.collection) {
      if (event.detail.item.id === 'editMenuItem')
        window.location.href = `/admin/${this.collectionType}/${this.collection.id}`;
      else if (event.detail.item.id === 'openAnalyticsApp')
        window.location.href = `/analytics/${this.collectionType}/${this.collection.id}`;
      this.$$('paper-listbox').select(null);
    }
  }

}
