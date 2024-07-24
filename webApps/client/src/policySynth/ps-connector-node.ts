import { PropertyValueMap, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '@material/web/iconbutton/icon-button.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';

import { MdMenu } from '@material/web/menu/menu.js';
import { PsOperationsBaseNode } from './ps-operations-base-node.js';

@customElement('ps-connector-node')
export class PsAgentConnector extends PsOperationsBaseNode {
  @property({ type: Object })
  connector!: PsAgentConnectorAttributes;

  @property({ type: Number })
  connectorId!: number;

  override connectedCallback(): void {
    super.connectedCallback();
    this.connector = window.psAppGlobals.getConnectorInstance(this.connectorId)!;
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

  override editNode() {
    this.fire('edit-node', {
      nodeId: this.nodeId,
      element: this.connector,
    });
  }

  toggleMenu() {
    const menu = this.shadowRoot?.getElementById('menu') as MdMenu;
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

  override render() {
    //TODO: Add typedefs for the different configurations
    if (this.connector) {
      return html`
        <div class="layout vertical mainContainer">
          ${this.renderImage()}
          ${this.connector.configuration['name']
            ? html`<div class="name ">
                ${this.connector.configuration['name']}
              </div>`
            : nothing}
          <div class="name instanceName">${this.connector.Class?.name}</div>
          <md-icon class="typeIconCore">checklist</md-icon>

          <md-icon-button class="editButton" @click="${this.editNode}"
            ><md-icon>settings</md-icon></md-icon-button
          >
        </div>
      `;
    } else {
      return nothing;
    }
  }
}
