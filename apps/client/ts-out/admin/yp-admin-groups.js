var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html } from "lit";
import { property, customElement } from "lit/decorators.js";
import "@material/web/fab/fab.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";
let YpAdminGroups = class YpAdminGroups extends YpBaseElementWithLogin {
    newGroup() {
        YpNavHelpers.redirectTo(`/group/new/${this.community.id}`);
    }
    static get styles() {
        return [
            super.styles,
            css `
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
    gotoGroup(group) {
        YpNavHelpers.redirectTo(`/group/${group.id}`);
    }
    renderGroup(group) {
        const groupImage = YpMediaHelpers.getImageFormatUrl(group.GroupLogoImages);
        return html `
      <div
        class="layout horizontal groupItem"
        @click="${() => this.gotoGroup(group)}"
      >
        <yp-image
          class="mainImage"
          sizing="contain"
          .src="${groupImage}"
        ></yp-image>
        <div class="layout vertical">
          <div class="groupText">${group.name}</div>
        </div>
      </div>
    `;
    }
    render() {
        return html `
      <div class="layout horizontal center-center fabContainer">
        <md-fab .label="${this.t("New Group")}" @click="${this.newGroup}"
          ><md-icon slot="icon">add</md-icon></md-fab
        >
      </div>
      <div class="layout vertical start mainContainer">
        <div class="layout vertical">
          ${this.community.Groups.map((group) => this.renderGroup(group))}
        </div>
      </div>
    `;
    }
};
__decorate([
    property({ type: Object })
], YpAdminGroups.prototype, "community", void 0);
YpAdminGroups = __decorate([
    customElement("yp-admin-groups")
], YpAdminGroups);
export { YpAdminGroups };
//# sourceMappingURL=yp-admin-groups.js.map