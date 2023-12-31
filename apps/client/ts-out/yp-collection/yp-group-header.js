var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { YpCollectionHeader } from './yp-collection-header';
let YpGroupHeader = class YpGroupHeader extends YpCollectionHeader {
    static get styles() {
        return [
            super.styles,
            css `
        .urlToReviewButton {
          padding: 8px;
          margin-top: 16px;
        }

        @media (max-width: 960px) {
          .urlToReviewButton {
              padding: 8px;
              margin-top: 0;
              margin-bottom: 16px;
          }
        }

      `,
        ];
    }
    renderFooter() {
        if (this.collection.configuration.urlToReview) {
            return html `
        <div class="layout horizontal center-center" style="width: 100%">
          <div
            class="urlToReviewButton shadow-elevation-3dp layout vertical center-center"
            role="button"
            ?hidden="${!this.collection.configuration.urlToReview}"
          >
            <a
              href="${this.collection.configuration.urlToReview}"
              target="_blank"
            >
              <yp-magic-text
                class="urlToReviewActionText"
                largefont$="${this.largeFont}"
                textType="urlToReviewActionText"
                .contentLanguage="${this.collection.language}"
                .content="${this.collection.configuration
                .urlToReviewActionText}"
                .contentId="${this.collection.id}"
              >
              </yp-magic-text>
            </a>
          </div>
        </div>
      `;
        }
        else {
            return super.renderFooter();
        }
    }
};
__decorate([
    property({ type: Object })
], YpGroupHeader.prototype, "collection", void 0);
YpGroupHeader = __decorate([
    customElement('yp-group-header')
], YpGroupHeader);
export { YpGroupHeader };
//# sourceMappingURL=yp-group-header.js.map