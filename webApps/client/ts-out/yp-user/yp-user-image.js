var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { YpMediaHelpers } from '../common/YpMediaHelpers.js';
import '../common/yp-image.js';
let YpUserImage = class YpUserImage extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.veryLarge = false;
        this.large = false;
        this.noDefault = false;
        this.noProfileImage = false;
    }
    static get styles() {
        return [
            super.styles,
            css `
        yp-image {
          display: block;
          vertical-align: text-top;
          height: 48px;
          width: 48px;
        }

        .small {
          height: 30px;
          width: 30px;
        }

        .large {
          height: 90px;
          width: 90px;
        }

        .veryLarge {
          height: 200px;
          width: 200px;
        }

        .medium {
          height: 48px;
          width: 48px;
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
    render() {
        return html `
      ${this.user
            ? html `
            ${this.profileImageUrl
                ? html `
                  <yp-image
                    sizing="cover"
                    .alt="${this.userTitle}"
                    .title="${this.userTitle}"
                    preload
                    src="${this.profileImageUrl}"
                    class="${this.computeClass}"></yp-image>
                `
                : nothing}
            ${!this.profileImageUrl
                ? html `
                  ${this.user.facebook_id
                    ? html `
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
                    ? html `
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
            }
            else {
                return this.user.name;
            }
        }
        else {
            return '';
        }
    }
    get profileImageUrl() {
        if (this.user &&
            this.user.UserProfileImages &&
            this.user.UserProfileImages.length > 0) {
            const formatUrl = YpMediaHelpers.getImageFormatUrl(this.user.UserProfileImages, 0);
            if (formatUrl && formatUrl !== '') {
                this.noProfileImage = false;
                return formatUrl;
            }
            else {
                this.noProfileImage = true;
                return null;
            }
        }
        else {
            this.noProfileImage = true;
            return null;
        }
    }
    get computeClass() {
        //TODO: Add back very-large if needed
        if (!this.large && !this.veryLarge)
            return 'small rounded';
        else if (this.large)
            return 'large rounded-more';
        else if (this.veryLarge)
            return 'veryLarge rounded-even-more';
        else
            return 'medium rounded';
    }
    get computeFacebookSrc() {
        if (this.user && this.user.facebook_id) {
            return 'https://graph.facebook.com/' + this.user.facebook_id + '/picture';
        }
        else {
            return undefined;
        }
    }
};
__decorate([
    property({ type: Boolean })
], YpUserImage.prototype, "veryLarge", void 0);
__decorate([
    property({ type: Boolean })
], YpUserImage.prototype, "large", void 0);
__decorate([
    property({ type: String })
], YpUserImage.prototype, "titleFromUser", void 0);
__decorate([
    property({ type: Object })
], YpUserImage.prototype, "user", void 0);
__decorate([
    property({ type: Boolean })
], YpUserImage.prototype, "noDefault", void 0);
__decorate([
    property({ type: Boolean })
], YpUserImage.prototype, "noProfileImage", void 0);
YpUserImage = __decorate([
    customElement('yp-user-image')
], YpUserImage);
export { YpUserImage };
//# sourceMappingURL=yp-user-image.js.map