var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { YpCollectionHeader } from "./yp-collection-header.js";
import { ifDefined } from "lit/directives/if-defined.js";
let YpDomainHeader = class YpDomainHeader extends YpCollectionHeader {
    static get styles() {
        return [
            super.styles,
            css `
        .nameAndActions {
          width: 100%;
          min-width: 100%;
          margin-top: 16px;
          margin-bottom: 24px;
          /*width: 532px;*/
        }

        .description {
          margin-top: 8px;
          padding-left: 0;
        }

        .menuButton {
        }

        .collectionDescriptionimageCard {
          margin-top: 0;
        }

        .topContainer {
          margin-top: 24px;
        }

        .descriptionContainer {
          min-width: 100%;
        }

        .stats {
          width: 100%;
          text-align: left;
          justify-content: flex-start;
        }

        .image {
          width: 220px;
          height: 124px;
        }

        @media (max-width: 600px) {
          .nameAndActions {
            width: 100%;
          }

          .description {
            width: 100%;
          }

          .collectionDescriptionimageCard {
            margin-top: 0;
          }

          .topContainer {
            margin-top: 0;
          }
      `
        ];
    }
    render() {
        return html `
      ${this.collection
            ? html `
            <div class="layout vertical">
              <div class="layout vertical topContainer">
                <div class="allContent">
                  <div
                    is-video="${ifDefined(this.collectionVideoURL)}"
                    id="cardImage"
                    class="collectionDescriptionimageCard top-card"
                  >
                    ${this.renderMediaContent()}
                  </div>
                  <div class="layout horizontal nameAndActions">
                    ${this.renderName()}
                    <div class="flex"></div>
                    ${this.hasCollectionAccess ? this.renderMenu() : nothing}
                  </div>
                  <div class="layout horizontal ${!this.wide ? "wrap" : ""}">
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
            : html ``}
    `;
    }
};
__decorate([
    property({ type: Object })
], YpDomainHeader.prototype, "collection", void 0);
YpDomainHeader = __decorate([
    customElement("yp-domain-header")
], YpDomainHeader);
export { YpDomainHeader };
//# sourceMappingURL=yp-domain-header.js.map