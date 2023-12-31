import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { YpCollectionHeader } from './yp-collection-header';

@customElement('yp-group-header')
export class YpGroupHeader extends YpCollectionHeader {
  @property({ type: Object })
  override collection: YpGroupData | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
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

  override renderFooter() {
    if (this.collection!.configuration.urlToReview) {
      return html`
        <div class="layout horizontal center-center" style="width: 100%">
          <div
            class="urlToReviewButton shadow-elevation-3dp layout vertical center-center"
            role="button"
            ?hidden="${!(this.collection as YpGroupData).configuration.urlToReview}"
          >
            <a
              href="${this.collection!.configuration.urlToReview}"
              target="_blank"
            >
              <yp-magic-text
                class="urlToReviewActionText"
                largefont$="${this.largeFont}"
                textType="urlToReviewActionText"
                .contentLanguage="${this.collection!.language}"
                .content="${this.collection!.configuration
                  .urlToReviewActionText}"
                .contentId="${this.collection!.id}"
              >
              </yp-magic-text>
            </a>
          </div>
        </div>
      `;
    } else {
      return super.renderFooter();
    }
  }
}
