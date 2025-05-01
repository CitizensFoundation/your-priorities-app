import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import { YpCollectionHeader } from "./yp-collection-header.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { YpGroupType } from "./ypGroupType.js";

@customElement("yp-domain-header")
export class YpDomainHeader extends YpCollectionHeader {
  @property({ type: Object })
  override collection: YpGroupData | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
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

  override render() {
    return html`
      ${this.collection
        ? html`
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
        : html``}
    `;
  }
}
