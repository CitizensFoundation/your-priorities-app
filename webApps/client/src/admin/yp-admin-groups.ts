import { css, html } from "lit";
import { property, customElement, query } from "lit/decorators.js";

import "@material/web/fab/fab.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";

@customElement("yp-admin-groups")
export class YpAdminGroups extends YpBaseElementWithLogin {
  @property({ type: Object })
  community!: YpCommunityData;

  newGroup() {
    YpNavHelpers.redirectTo(`/group/new/${this.community.id}`);
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

        .groupItem {
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          width: 600px;
          margin: 16px;
          border-radius: 6px;
          cursor: pointer;
        }

        .groupText {
          margin-top: 18px;
          font-size: 1.1em;
        }
      `,
    ];
  }

  gotoGroup(group: YpGroupData) {
    YpNavHelpers.redirectTo(`/group/${group.id}`);
  }

  renderGroup(group: YpGroupData) {
    const groupImage = YpMediaHelpers.getImageFormatUrl(group.GroupLogoImages);
    return html`
      <div
        class="layout horizontal groupItem"
        @click="${() => this.gotoGroup(group)}"
      >
        <yp-image
          class="mainImage"
          sizing="contain"
          .alt="${group.name}"
          .src="${groupImage}"
        ></yp-image>
        <div class="layout vertical">
          <div class="groupText">${group.name}</div>
        </div>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="layout horizontal center-center fabContainer">
        <md-fab .label="${this.t("New Group")}" @click="${this.newGroup}"
          ><md-icon slot="icon">add</md-icon></md-fab
        >
      </div>
      <div class="layout vertical start mainContainer">
        <div class="layout vertical">
          ${this.community!.Groups!.map((group) => this.renderGroup(group))}
        </div>
      </div>
    `;
  }
}
