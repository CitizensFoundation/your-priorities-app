import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import { YpMediaHelpers } from '../common/YpMediaHelpers.js';
import '../common/yp-image.js';

@customElement('yp-user-image')
export class YpUserImage extends YpBaseElement {
  @property({ type: Boolean })
  veryLarge = false;

  @property({ type: Boolean })
  large = false;

  @property({ type: Boolean })
  medium = false;

  @property({ type: String })
  titleFromUser: string | undefined;

  @property({ type: Object })
  user!: YpUserData;

  @property({ type: Boolean })
  noDefault = false;

  @property({ type: Boolean })
  noProfileImage = false;

  @property({ type: Boolean })
  useImageBorder = false;

  static override get styles() {
    return [
      super.styles,
      css`
        yp-image {
          display: block;
          vertical-align: text-top;
          height: 48px;
          width: 48px;
        }

        yp-image[use-image-border] {
          border: 1px solid var(--md-sys-color-primary-container, #F00);
        }

        .small {
          height: 30px;
          width: 30px;
        }

        .large {
          height: 90px;
          width: 90px;
        }

        .medium {
          height: 40px;
          width: 40px;
        }

        .veryLarge {
          height: 200px;
          width: 200px;
        }

        .rounded {
          -webkit-border-radius: 25px;
          -moz-border-radius: 25px;
          border-radius: 25px;
          display: block;
          -webkit-transform-style: preserve-3d;
        }

        .rounded-more {
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
          border-radius: 50px;
          display: block;
          vertical-align: top;
          align: top;
          -webkit-transform-style: preserve-3d;
        }

        .rounded-even-more {
          -webkit-border-radius: 115px;
          -moz-border-radius: 125px;
          border-radius: 125px;
          display: block;
          vertical-align: top;
          align: top;
          -webkit-transform-style: preserve-3d;
        }

        .rounded img {
          opacity: 0;
        }

        .rounded-more img {
          opacity: 0;
        }
      `,
    ];
  }

  override render() {
    return html`
      ${this.user
        ? html`
            ${this.profileImageUrl
              ? html`
                  <yp-image
                    sizing="cover"
                    ?use-image-border="${this.useImageBorder}"
                    .alt="${this.userTitle}"
                    .title="${this.userTitle}"
                    preload
                    src="${this.profileImageUrl}"
                    class="${this.computeClass}"></yp-image>
                `
              : nothing}
            ${!this.profileImageUrl
              ? html`
                  ${this.user.facebook_id
                    ? html`
                        <yp-image
                          sizing="cover"
                          ?hidden="${this.profileImageUrl}"
                          .alt="${this.userTitle}"
                          .title="${this.userTitle}"
                          preload
                          .src="${this.computeFacebookSrc}"
                          class="${this.computeClass}"></yp-image>
                      `
                    : nothing}
                  ${!this.user.facebook_id
                    ? html`
                        <yp-image
                          sizing="cover"
                          .title="${this.userTitle}"
                          .alt="${this.userTitle}"
                          preload
                          src="https://s3.amazonaws.com/better-reykjavik-paperclip-production/instances/buddy_icons/000/000/001/icon_50/default_profile.png"
                          class="${this.computeClass}"></yp-image>
                      `
                    : nothing}
                `
              : nothing}
          `
        : nothing}
    `;
  }

  get userTitle() {
    if (this.user) {
      if (this.titleFromUser) {
        return this.titleFromUser;
      } else {
        return this.user.name;
      }
    } else {
      return '';
    }
  }

  get profileImageUrl() {
    if (
      this.user &&
      this.user.UserProfileImages &&
      this.user.UserProfileImages.length > 0
    ) {
      const formatUrl = YpMediaHelpers.getImageFormatUrl(
        this.user.UserProfileImages,
        0
      );
      if (formatUrl && formatUrl !== '') {
        this.noProfileImage = false;
        return formatUrl;
      } else {
        this.noProfileImage = true;
        return null;
      }
    } else {
      this.noProfileImage = true;
      return null;
    }
  }

  get computeClass() {
    //TODO: Add back very-large if needed
    if (this.medium) return "medium rounded";
    else if (!this.large && !this.veryLarge) return 'small rounded';
    else if (this.large) return 'large rounded-more';
    else if (this.veryLarge) return 'veryLarge rounded-even-more';
    else return 'medium rounded';
  }

  get computeFacebookSrc() {
    if (this.user && this.user.facebook_id) {
      return 'https://graph.facebook.com/' + this.user.facebook_id + '/picture';
    } else {
      return undefined;
    }
  }
}
