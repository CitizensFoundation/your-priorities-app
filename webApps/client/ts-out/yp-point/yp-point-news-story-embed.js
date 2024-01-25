var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import '../common/yp-image.js';
let YpPointNewsStoryEmbed = class YpPointNewsStoryEmbed extends YpBaseElement {
    static get styles() {
        return [
            super.styles,
            css `
        yp-image {
          width: 550px;
          height: 309px;
        }

        @media (max-width: 600px) {
          yp-image {
            width: 90vw !important;
            height: 51vw !important;
          }
        }

        #embedHtml {
          width: 100%;
          height: 100%;
          border: 1px solid;
          padding: 16px;
        }

        a {
          text-decoration: none;
        }

        .title {
        }

        .description {
          padding-bottom: 20px;
        }

        .container {
          border-bottom: solid #ddd;
          border-bottom-width: 1px;
          margin-top: 8px;
        }

        [hidden] {
          display: none !important;
        }
      `,
        ];
    }
    render() {
        return this.embedData
            ? html `
          <div>
            <div class="layout vertical embedContainer">
              <a href="${this.embedData.url}" class="container" target="_blank">
                <div class="layout vertical center-center">
                  <yp-image
                    sizing="contain"
                    src="${this.embedData.thumbnail_url}"
                    ?hidden="${this.embedData.html != null}"></yp-image>
                  <div id="embedHtml" ?hidden="${!this.embedData.html}">
                    <div .inner-h-t-m-l="${this.embedData}"></div>
                  </div>
                </div>
                <div class="layout vertical">
                  <div class="title">
                    <h2>${this.embedData.title}</h2>
                  </div>
                  <div class="description">
                    ${this.embedData.description}
                  </div>
                </div>
              </a>
            </div>
          </div>
        `
            : nothing;
    }
};
__decorate([
    property({ type: Object })
], YpPointNewsStoryEmbed.prototype, "embedData", void 0);
YpPointNewsStoryEmbed = __decorate([
    customElement('yp-point-news-story-embed')
], YpPointNewsStoryEmbed);
export { YpPointNewsStoryEmbed };
//# sourceMappingURL=yp-point-news-story-embed.js.map