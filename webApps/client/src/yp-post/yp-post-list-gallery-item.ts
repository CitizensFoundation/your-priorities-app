import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import './yp-post-gallery-image.js';
import './yp-post-actions.js';
import '../yp-magic-text/yp-magic-text.js';
import '@material/web/iconbutton/icon-button.js';

import { YpPostGalleryImage } from './yp-post-gallery-image.js';

@customElement('yp-post-list-gallery-item')
export class YpPostListGalleryItem extends YpBaseElement {
  @property({ type: Object })
  post!: YpPostData;

  @property({ type: Boolean, attribute: 'description-open' })
  descriptionOpen = false;

  @property({ type: Boolean })
  mini = false;

  @property({ type: Boolean })
  isAudioCover = false;

  static override get styles() {
    return [
      super.styles,
      css`
        .mainContainer {
          margin: 32px;
          margin-top: 48px;
          margin-bottom: 16px;
        }

        .authorName,
        .artName {
          font-size: 26px;
          line-height: 1.4;
          min-width: 350px;
        }

        .authorName {
          font-weight: bold;
          padding-top: 8px;
          width: 100%;
        }

        .artName {
          padding-top: 0;
        }

        .description {
          font-size: 20px;
          line-height: 1.4;
          text-align: right;
          margin-bottom: 8px;
        }

        .descriptionText {
          text-align: justify;
          margin-bottom: 8px;
          margin-top: 8px;
        }

        .image {
          margin-bottom: 8px;
        }

        .postActions {
          height: 30px;
          margin-left: -16px;
        }

        .mainDataContainer {
          max-width: 600px;
          width: 600px;
          border-top: 2px solid #000;
        }

        md-icon-button.openCloseButton {
          --md-icon-button-icon-size: 48px;
          width: 64px;
          height: 64px;
          padding-left: 0;
          margin-left: 0;
          align-self: flex-end;
          justify-content: flex-end;
          margin-right: -24px;
          color: #000;
        }

        @media (max-width: 800px) {
          .authorName,
          .artName {
            font-size: 26px;
            min-width: 100%;
            color: #000;
          }

          .image {
            margin-bottom: 8px;
          }

          .mainDataContainer {
            max-width: 100%;
            width: 100%;
          }
        }

        .shareIcon {
          text-align: right;
          width: 48px;
          height: 48px;
        }

        .shareText {
          font-size: 16px;
          color: #656565;
          margin-right: 5px;
        }
      `,
    ];
  }

  renderShare() {
    return html`
      <div class="share" ?hidden="${this.post.Group.configuration?.hideSharing}">
        <md-icon-button
          class="shareIcon"
          aria-label="${this.t('share')}"
          title="${this.t('share')}"
          @click="${this._shareTap}"
        >
          <md-icon>share</md-icon>
        </md-icon-button>
        <div class="shareText">${this.t('share')}</div>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="layout vertical mainContainer">
        <div class="layout vertical center-center">
          <yp-post-gallery-image
            class="image"
            .post="${this.post}"
            .imageWidth="${this.post.public_data?.galleryImageData?.width}"
            .imageHeight="${this.post.public_data?.galleryImageData?.height}"
            alt-tag="${this.post.name}"
            sizing-mode="cover"
          ></yp-post-gallery-image>
          <div class="layout vertical mainDataContainer">
            <div class="layout horizontal">
              <div class="layout vertical">
                <div class="authorName">${this.post.description}</div>
                <div class="artName">${this.post.name}</div>
                <yp-post-actions
                  class="postActions"
                  .post="${this.post}"
                  larger-icons
                  forceHideDebate
                ></yp-post-actions>
              </div>
              <div class="flex"></div>
              <div class="layout vertical">
                ${!this.descriptionOpen
                  ? html`
                      <a
                        href="${ifDefined(this._getPostLink(this.post))}"
                        id="mainA"
                        @click="${this._savePostToBackCache}"
                      >
                        <md-icon-button
                          class="openCloseButton"
                          aria-label="${this.t('openPostDetails')}"
                          title="${this.t('openPostDetails')}"
                          ><md-icon>keyboard-arrow-right</md-icon></md-icon-button
                        >
                      </a>
                    `
                  : nothing}
              </div>
            </div>
            ${this.descriptionOpen
              ? html`
                  ${this.renderShare()}
                  <div class="description">
                    ${this.post.public_data?.galleryMetaData?.Upphafsar}
                  </div>
                  <div
                    class="description"
                    ?hidden="${!this.post.public_data?.galleryMetaData?.Haed}"
                  >
                    ${this.post.public_data?.galleryMetaData?.Haed} x
                    ${this.post.public_data?.galleryMetaData?.Breidd}cm
                  </div>
                  <div
                    class="description descriptionText"
                    ?hidden="${!this.post.public_data?.galleryMetaData?.texti_um_verk_fyrir_vef}"
                  >
                    ${this.post.public_data?.galleryMetaData?.texti_um_verk_fyrir_vef}
                  </div>
                `
              : nothing}
          </div>
        </div>
      </div>
    `;
  }

  _savePostToBackCache() {
    if (this.post) {
      window.appGlobals.cache.cachedPostItem = this.post;
    }
  }

  _getPostLink(post: YpPostData) {
    if (post) {
      if (
        post.Group.configuration &&
        post.Group.configuration.disablePostPageLink
      ) {
        return '#';
      } else if (
        post.Group.configuration &&
        post.Group.configuration.resourceLibraryLinkMode
      ) {
        return post.description.trim();
      } else {
        return '/post/' + post.id;
      }
    } else {
      console.warn('Trying to get empty post link');
      return '#';
    }
  }

  _sharedContent(event: CustomEvent) {
    const shareData = event.detail;
    window.appGlobals.activity(
      'postShared',
      shareData.social,
      this.post ? this.post.id : -1
    );
  }

  get _fullPostUrl() {
    return encodeURIComponent(
      'https://' + window.location.host + '/post/' + this.post.id
    );
  }

  _shareTap(event: CustomEvent) {
    window.appGlobals.activity(
      'postShareCardOpen',
      event.detail.brand,
      this.post ? this.post.id : -1
    );

    window.appDialogs.getDialogAsync(
      'shareDialog',
      (dialog: YpShareDialogData) => {
        dialog.open(
          this._fullPostUrl,
          this.post.name,
          (this.$$('yp-post-gallery-image') as YpPostGalleryImage).anyImagePath || '',
          this._sharedContent
        );
      }
    );
  }
}
