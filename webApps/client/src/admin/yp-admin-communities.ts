import { css, html } from "lit";
import { property, customElement, query } from "lit/decorators.js";

import "@material/web/fab/fab.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";

@customElement("yp-admin-communities")
export class YpAdminCommunities extends YpBaseElementWithLogin {
  @property({ type: Object })
  domain!: YpDomainData;

  newCommunity() {
    YpNavHelpers.redirectTo(`/community/new/${this.domain.id}`);
  }

  static override get styles() {
    return [
      super.styles,
      css`
        .mainContainer {
          width: 100%;
          margin-top: 32px;
        }

        @media (max-width: 1100px) {
          .mainContainer {
            width: 100%;
            max-width: calc(100vw - 80px);
          }
        }

        md-fab {
          margin-top: 32px;
          margin-bottom: 0;
        }

        .fabContainer {
          width: 1000px;
        }

        @media (max-width: 1100px) {
          .fabContainer {
            width: 100%;
          }
        }

        .communityItem {
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          width: 600px;
          margin: 16px;
          border-radius: 6px;
          cursor: pointer;
        }

        .communityText {
          margin-top: 18px;
          font-size: 1.1em;
        }
      `,
    ];
  }

  gotoCommunity(community: YpCommunityData) {
    YpNavHelpers.redirectTo(`/community/${community.id}`);
  }

  renderCommunity(community: YpCommunityData) {
    const communityImage = YpMediaHelpers.getImageFormatUrl(
      community.CommunityLogoImages
    );
    return html`
      <div
        class="layout horizontal communityItem"
        @click="${() => this.gotoCommunity(community)}"
      >
        <yp-image
          class="mainImage"
          sizing="contain"
          .src="${communityImage}"
        ></yp-image>
        <div class="layout vertical">
          <div class="communityText">${community.name}</div>
        </div>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="layout horizontal center-center fabContainer">
        <md-fab
          .label="${this.t("New Community")}"
          @click="${this.newCommunity}"
        ><md-icon slot="icon">add</md-icon></md-fab>
      </div>
      <div class="layout vertical start mainContainer">
        <div class="layout vertical">
          ${this.domain.Communities.map((community) => this.renderCommunity(community))}
        </div>
      </div>
    `;
  }
}
