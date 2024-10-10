import { PropertyValueMap, css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import "@material/web/iconbutton/icon-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";

import { MdMenu } from "@material/web/menu/menu.js";
import { PsOperationsBaseNode } from "./ps-operations-base-node.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpFormattingHelpers } from "../common/YpFormattingHelpers.js";

@customElement("ps-connector-node")
export class PsAgentConnector extends PsOperationsBaseNode {
  @property({ type: Object })
  connector!: PsAgentConnectorAttributes;

  @property({ type: Number })
  connectorId!: number;

  @property({ type: Number })
  groupId!: number;

  @property({ type: String })
  agentName!: string;

  @property({ type: String })
  internalLink: string | undefined;

  @property({ type: String })
  externalLink: string | undefined;

  @property({ type: Boolean })
  openInternalLinkInNewTab = true;

  override connectedCallback(): void {
    super.connectedCallback();
    this.connector = window.psAppGlobals.getConnectorInstance(
      this.connectorId
    )!;

    //@ts-ignore
    if (this.connector.configuration["groupId"]) {
      //@ts-ignore
      this.internalLink = `/group/${this.connector.configuration["groupId"]}`;
      //@ts-ignore
    } else if (
      this.connector.Class?.class_base_id ==
      "4b8c3d2e-5f6a-1a8b-9c0d-1ecf3afb536d"
    ) {
      //@ts-ignore
      this.externalLink = `https://docs.google.com/spreadsheets/d/${this.connector.configuration["googleSheetsId"]}/`;
    } else if (
      this.connector.Class?.class_base_id ==
      "3a7b2c1d-4e5f-6a7b-8c9d-0e1f2a3b4c5d"
    ) {
      //@ts-ignore
      this.externalLink = `https://docs.google.com/document/d/${this.connector.configuration["googleDocsId"]}/`;
    } else {
      console.error(
        `No link for connector ${this.connectorId} ${this.connector.Class?.class_base_id}`
      );
    }
  }

  static override get styles() {
    return [
      super.styles,
      css`
        .image {
          width: 140px;
          height: 79px;
          border-radius: 16px 16px 0 0;
        }

        .linkIcon {
          margin: 4px;
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

        .connectorType {
          font-size: 10px;
          text-align: left;
          margin: 8px;
          margin-top: 8px;
          line-height: 15px;
          font-weight: 500;
          color: var(--md-sys-color-tertiary);
          text-transform: uppercase;
        }

        .instanceName {
          font-size: 14px;
          text-align: left;
          font-weight: 700;
          margin: 8px;
          margin-top: 0;
          margin-bottom: 16px;
          line-height: 22px;
          font-family: var(--md-ref-typeface-brand);
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

  override editNode() {
    this.fire("edit-node", {
      nodeId: this.nodeId,
      element: this.connector,
    });
  }

  toggleMenu() {
    const menu = this.shadowRoot?.getElementById("menu") as MdMenu;
    menu.open = !menu.open;
  }

  renderImage() {
    return html`
      <div class="layout horizontal center-center">
        <img
          class="image"
          src="${this.connector.Class?.configuration.imageUrl}"
        />
      </div>
    `;
  }

  openInternalLink() {
    let gotoLocation = this.internalLink!;

    if (this.openInternalLinkInNewTab) {
      gotoLocation = `${window.location.origin}${gotoLocation}`;
      window.open(gotoLocation, "_blank");
    } else {
      this.fire("yp-change-header", {
        headerTitle: " ",
        documentTitle: this.agentName,
        headerDescription: "",
        backPath: "/group/" + this.groupId,
        keepOpenForGroup: `/group/${this.groupId}`,
      });
      YpNavHelpers.redirectTo(gotoLocation);
    }
  }

  openExternalLink() {
    window.open(this.externalLink, "_blank");
  }

  override render() {
    //TODO: Add typedefs for the different configurations
    if (this.connector) {
      return html`
        <div class="layout vertical mainContainer">
          ${this.renderImage()}
          <div class="name connectorType">${this.connector.Class?.name}</div>
          ${this.connector.configuration["name"]
            ? html`<div class="instanceName">
                ${this.connector.configuration["name"]}
              </div>`
            : nothing}

          <div class="layout horizontal">
            <md-icon-button class="linkIcon" @click="${this.editNode}"
              ><md-icon>settings</md-icon></md-icon-button
            >
            <div class="flex"></div>
            ${this.internalLink
              ? html`
                  <md-icon-button
                    class="linkIcon"
                    @click="${this.openInternalLink}"
                  >
                    <md-icon>read_more</md-icon>
                  </md-icon-button>
                `
              : nothing}
            ${this.externalLink
              ? html`
                  <md-icon-button
                    class="linkIcon"
                    @click="${this.openExternalLink}"
                  >
                    <md-icon>read_more</md-icon>
                  </md-icon-button>
                `
              : nothing}
          </div>
        </div>
      `;
    } else {
      return nothing;
    }
  }
}
