import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import { YpCollectionHeader } from "./yp-collection-header.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { YpGroupType } from "./ypGroupType.js";

@customElement("yp-group-header")
export class YpGroupHeader extends YpCollectionHeader {
  @property({ type: Object })
  override collection: YpGroupData | undefined;

  constructor() {
    super();
  }

  static override get styles() {
    return [
      super.styles,
      css`
        .groupType {
          font-size: 14px;
          font-weight: 500;
          color: var(--md-sys-color-primary);
          text-transform: uppercase;
        }

        .groupType[is-folder] {
          color: var(--md-sys-color-secondary);
        }

        .nameAndActions {
          width: 100%;
          min-width: 100%;
          margin-top: 0px;
          margin-bottom: 8px;
        }

        .description {
          max-width: 500px;
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
            width: 90%;
          }

          .collectionDescriptionimageCard {
            margin-top: 0;
          }

          .topContainer {
            margin-top: 0;
          }
      `,
    ];
  }
  get groupTypeName() {
    return this.t("ideas");
  }

  get isGroupFolder() {
    return (
      (this.collection &&
        (this.collection as YpGroupData).configuration.groupType ===
          YpGroupType.Folder) ||
      (this.collection as YpGroupData).is_group_folder
    );
  }

  override render() {
    return html`
      ${this.collection
        ? html`
            <div class="layout vertical center-center">
              <div class="layout vertical topContainer">
                <div class="allContent">
                  <div class="layout vertical">
                    <div class="layout vertical">
                      <div class="layout horizontal">
                        <div
                          class="groupType"
                          ?is-folder="${this.isGroupFolder}"
                        >
                          ${this.groupTypeName}
                        </div>
                      </div>
                      <div class="layout horizontal nameAndActions">
                        ${this.renderName()}
                        <div class="flex"></div>
                        ${this.hasCollectionAccess
                          ? this.renderMenu()
                          : nothing}
                      </div>
                    </div>
                    <div class="layout horizontal ${!this.wide ? 'wrap' : ''}">
                      <div class="descriptionContainer">
                        ${this.renderDescription()} ${this.renderStats()}
                      </div>
                      <div
                        is-video="${ifDefined(this.collectionVideoURL)}"
                        id="cardImage"
                        class="collectionDescriptionimageCard top-card"
                      >
                        ${this.renderMediaContent()}
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
