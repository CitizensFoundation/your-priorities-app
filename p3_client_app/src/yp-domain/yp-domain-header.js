import { property, html, css, customElement } from 'lit-element';
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
  collectionTypeName: string | undefined;

  @property({ type: Boolean })
  hideImage = false;

  @property({ type: Number })
  flaggedContentCount: number | null = null;

  @property({ type: Number })
  collectionVideoId: number | null = null;

  get _hasCollectionAccess(): boolean {
    switch(this.collectionTypeName) {
      case 'domain':
        return YpAccessHelpers.checkDomainAccess(this.collection as YpDomainData);
        break;
      case 'community':
        return YpAccessHelpers.checkCommunityAccess(this.collection as YpCommunityData);
        break;
      case 'group':
        return YpAccessHelpers.checkGroupAccess(this.collection as YpGroupData);
        break;
      default:
        return false;
    }
  }

  static get prodperties() {
    return {
      collectionVideoURL: {
        type: String,
        computed: '_collectionVideoURL(collection)',
      },

      collectionVideoPosterURL: {
        type: String,
        computed: '_collectionVideoPosterURL(collection)',
      },

      exportLoginsUrl: {
        type: String,
        computed: '_exportLoginsUrl(hasDomainAccess, collection)',
      },
    };
  }

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
        }

        video {
          outline: none !important;
        }

        .collectionDescription {
          padding-left: 16px;
          padding-right: 16px;
          padding-top: 16px;
        }

        .collection-name {
          background-color: var(--primary-color-800, #000);
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

          .stats {
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

  render() {
    return html`
      ${this.collection
        ? html`
            <div class="layout horizontal wrap">
              <div
                is-video="${this.collectionVideoURL}"
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
                        .poster="${this.collectionVideoPosterURL}"></video>
                    `
                  : html`
                      <iron-image
                        class="image"
                        ?hidden="${this.hideImage}"
                        .alt="${this.collection.name}"
                        sizing="cover"
                        src="${this._collectionLogoImagePath(
                          this.collection
                        )}"></iron-image>
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
                        textType="collectionName"
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
                      textType="collectionContent"
                      .contentLanguage="${this.collection.language}"
                      .content="${this.collection.description || this.collection.objectives}"
                      .contentId="${this.collection.id}">
                    </yp-magic-text>
                  </div>
                  <paper-menu-button
                    .verticalAlign="top"
                    .horizontalAlign="${this.editMenuAlign}"
                    class="edit"
                    ?hidden="${!this._hasCollectionAccess}">
                    <paper-icon-button
                      ariaLabel="${this.t('openDomainMenu')}"
                      .icon="more-vert"
                      slot="dropdown-trigger"></paper-icon-button>
                    <paper-listbox
                      slot="dropdown-content"
                      @iron-select="${this._menuSelection}">
                      <paper-item
                        id="editMenuItem"
                        >${this.t('openAdministration')}</paper-item
                      >
                      <paper-item
                        id="openAnalyticsApp"
                        ?hidden="${!this._hasCollectionAccess}"
                        >[[t('openAnalyticsApp')]]</paper-item
                      >
                    </paper-listbox>
                  </paper-menu-button>
                </div>
                <yp-collection-stats-lit
                  class="stats"
                  .collection="${this.collection}"></yp-collection-stats-lit>
              </div>
            </div>

            <lite-signal
              @lite-signal-got-admin-rights="${this
                ._gotAdminRights}"></lite-signal>
            <lite-signal
              @lite-signal-yp-pause-media-playback="${this
                ._pauseMediaPlayback}"></lite-signal>
          `
        : html``}
    `;
  }

  /*
  behaviors: [
    LargeCardBehaviors,
    AccessHelpers,
    ypGotAdminRightsBehavior,
    ypMediaFormatsBehavior,
    ypTruncateBehavior
  ],
*/

  _exportLoginsUrl(access, collection) {
    if (access && collection) {
      return '/api/collections/' + collection.id + '/export_logins';
    } else {
      return null;
    }
  }

  _collectionChanged(collection, previousDomain) {
    this.setupMediaEventListeners(collection, previousDomain);
  }

  _collectionVideoURL(collection) {
    if (
      collection &&
      collection.configuration &&
      collection.configuration.useVideoCover &&
      collection.DomainLogoVideos
    ) {
      const videoURL = this._getVideoURL(collection.DomainLogoVideos);
      if (videoURL) {
        this.set('collectionVideoId', collection.DomainLogoVideos[0].id);
        return videoURL;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  _collectionVideoPosterURL(collection) {
    if (
      collection &&
      collection.configuration &&
      collection.configuration.useVideoCover &&
      collection.DomainLogoVideos
    ) {
      const videoPosterURL = this._getVideoPosterURL(
        collection.DomainLogoVideos,
        collection.DomainLogoImages
      );
      if (videoPosterURL) {
        return videoPosterURL;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }


  _menuSelection(event, detail) {
    if (detail.item.id === 'editMenuItem') this._openEdit();
    else if (detail.item.id === 'createOrganizationMenuItem')
      this._newOrganization();
    else if (detail.item.id === 'pagesMenuItem') this._openPagesDialog();
    else if (detail.item.id === 'organizationsGridMenuItem')
      this._openOrganizationsGrid();
    else if (detail.item.id === 'usersMenuItem') this._openUsersDialog();
    else if (detail.item.id === 'adminsMenuItem') this._openAdminsDialog();
    else if (detail.item.id === 'moderationMenuItem')
      this._openContentModeration();
    else if (detail.item.id === 'moderationAllMenuItem')
      this._openAllContentModeration();
    else if (detail.item.id === 'addCommunityMenuItem')
      this.fire('yp-new-community');
    else if (detail.item.id === 'addCommunityFolderMenuItem')
      this.fire('yp-new-community-folder');
    else if (detail.item.id === 'openAnalyticsApp')
      window.location = '/analytics/collection/' + this.collection.id;
    this.$$('paper-listbox').select(null);
  }

  _openUsersDialog() {
    window.appGlobals.activity('open', 'collectionUsers');
    dom(document)
      .querySelector('yp-app')
      .getUsersGridAsync(
        function (dialog) {
          dialog.setup(null, null, this.collection.id, false);
          dialog.open(this.collection.name);
        }.bind(this)
      );
  }

  _openAdminsDialog() {
    window.appGlobals.activity('open', 'collectionAdmins');
    dom(document)
      .querySelector('yp-app')
      .getUsersGridAsync(
        function (dialog) {
          dialog.setup(null, null, this.collection.id, true);
          dialog.open(this.collection.name);
        }.bind(this)
      );
  }

  _openOrganizationsGrid() {
    window.appGlobals.activity('open', 'collection.organizationsGrid');
    dom(document)
      .querySelector('yp-app')
      .getDialogAsync(
        'organizationsGrid',
        function (dialog) {
          dialog.open();
        }.bind(this)
      );
  }

  _openPagesDialog() {
    window.appGlobals.activity('open', 'collection.pagesAdmin');
    dom(document)
      .querySelector('yp-app')
      .getDialogAsync(
        'pagesGrid',
        function (dialog) {
          dialog.setup(null, null, this.collection.id, false);
          dialog.open();
        }.bind(this)
      );
  }

  _openEdit() {
    window.appGlobals.activity('open', 'collectionEdit');
    dom(document)
      .querySelector('yp-app')
      .getDialogAsync(
        'collectionEdit',
        function (dialog) {
          dialog.setup(this.collection, false, this._refresh.bind(this));
          dialog.open('edit', { collectionId: this.collection.id });
        }.bind(this)
      );
  }

  _openContentModeration() {
    window.appGlobals.activity('open', 'collectionContentModeration');
    dom(document)
      .querySelector('yp-app')
      .getContentModerationAsync(
        function (dialog) {
          dialog.setup(null, null, this.collection.id, false);
          dialog.open(this.collection.name);
        }.bind(this)
      );
  }

  _openAllContentModeration() {
    window.appGlobals.activity('open', 'collectionAllContentModeration');
    dom(document)
      .querySelector('yp-app')
      .getContentModerationAsync(
        function (dialog) {
          dialog.setup(null, null, this.collection.id, '/moderate_all_content');
          dialog.open(this.collection.name);
        }.bind(this)
      );
  }

  _newOrganization() {
    window.appGlobals.activity('open', 'organizationEdit');
    dom(document)
      .querySelector('yp-app')
      .getDialogAsync(
        'organizationEdit',
        function (dialog) {
          dialog.setup(null, true, this._refresh.bind(this));
          dialog.open('new', { collectionId: this.collection.id });
        }.bind(this)
      );
  }

  _refresh(collection) {
    if (collection) {
      this.set('collection', collection);
    }
    this.fire('update-collection');
  }

  _collectionName(collection) {
    if (collection && collection.name) {
      return this.truncate(this.trim(collection.name), 200);
    } else if (collection) {
      return collection.short_name;
    }
  }

  _collectionLogoImagePath(collection) {
    if (collection) {
      return this.getImageFormatUrl(collection.DomainLogoImages, 0);
    }
  }

  _collectionHeaderImagePath(collection) {
    if (collection) {
      return this.getImageFormatUrl(collection.DomainHeaderImages, 0);
    }
  }
}
