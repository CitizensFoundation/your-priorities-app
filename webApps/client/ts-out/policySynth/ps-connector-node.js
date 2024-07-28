var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";
import { PsOperationsBaseNode } from "./ps-operations-base-node.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpFormattingHelpers } from "../common/YpFormattingHelpers.js";
let PsAgentConnector = class PsAgentConnector extends PsOperationsBaseNode {
    connectedCallback() {
        super.connectedCallback();
        this.connector = window.psAppGlobals.getConnectorInstance(this.connectorId);
        //TODO: Fix this by adding .answsers to the configuration
        //@ts-ignore
        if (this.connector.configuration["groupId"]) {
            //@ts-ignore
            this.groupIdWithContent = this.connector.configuration["groupId"];
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
        .image {
          width: 140px;
          height: 79px;
          border-radius: 16px 16px 0 0;
        }

        .name {
          height: 16px;
          margin-top: 8px;
          font-size: 14px;
          text-align: center;
          align-items: center;
        }

        .mainContainer {
          border-radius: 16px;
          height: 100%;
        }

        .instanceName {
          font-size: 12px;
          height: 72px;
        }

        .connectorType {
          font-size: 15px;
          text-transform: uppercase;
          padding: 8px;
          padding-top: 8px;
          margin-left: 10px;
        }

        md-icon-button[root-cause] {
          --md-icon-button-icon-color: var(--md-sys-color-on-primary);
        }

        md-circular-progress {
          --md-circular-progress-size: 28px;
          margin-bottom: 6px;
        }

        md-menu {
          --md-menu-z-index: 1000;
          z-index: 1000;
        }
      `,
        ];
    }
    editNode() {
        this.fire("edit-node", {
            nodeId: this.nodeId,
            element: this.connector,
        });
    }
    toggleMenu() {
        const menu = this.shadowRoot?.getElementById("menu");
        menu.open = !menu.open;
    }
    renderImage() {
        return html `
      <div class="layout horizontal center-center">
        <img
          class="image"
          src="${this.connector.Class?.configuration.imageUrl}"
        />
      </div>
    `;
    }
    openGroup() {
        const gotoLocation = `/group/${this.groupIdWithContent}`;
        this.fire("yp-change-header", {
            headerTitle: YpFormattingHelpers.truncate(this.agentName, 80),
            documentTitle: this.connector.configuration.name,
            headerDescription: "",
            backPath: "/group/" + this.groupId,
            keepOpenForGroup: `/group/${this.groupId}`,
        });
        YpNavHelpers.redirectTo(gotoLocation);
    }
    render() {
        //TODO: Add typedefs for the different configurations
        if (this.connector) {
            return html `
        <div class="layout vertical mainContainer">
          ${this.renderImage()}
          ${this.connector.configuration["name"]
                ? html `<div class="name ">
                ${this.connector.configuration["name"]}
              </div>`
                : nothing}
          <div class="name instanceName">${this.connector.Class?.name}</div>
          <md-icon class="typeIconCore">checklist</md-icon>

          ${this.groupIdWithContent ? html `
            <md-icon-button  class="middleIcon" @click="${this.openGroup}">
              <md-icon>open_in_browser</md-icon>
            </md-icon-button>
              ` : nothing}

          <md-icon-button class="editButton" @click="${this.editNode}"
            ><md-icon>settings</md-icon></md-icon-button
          >
        </div>
      `;
        }
        else {
            return nothing;
        }
    }
};
__decorate([
    property({ type: Object })
], PsAgentConnector.prototype, "connector", void 0);
__decorate([
    property({ type: Number })
], PsAgentConnector.prototype, "connectorId", void 0);
__decorate([
    property({ type: Number })
], PsAgentConnector.prototype, "groupId", void 0);
__decorate([
    property({ type: String })
], PsAgentConnector.prototype, "agentName", void 0);
__decorate([
    property({ type: Number })
], PsAgentConnector.prototype, "groupIdWithContent", void 0);
PsAgentConnector = __decorate([
    customElement("ps-connector-node")
], PsAgentConnector);
export { PsAgentConnector };
//# sourceMappingURL=ps-connector-node.js.map