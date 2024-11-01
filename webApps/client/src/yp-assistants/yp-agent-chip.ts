import { customElement, property } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import { css, html } from "lit";

import '@material/web/iconbutton/filled-icon-button.js';

@customElement("yp-agent-chip")
export class YpAgentChip extends YpBaseElement {
  @property({ type: Number })
  agentId!: number;

  @property({ type: String })
  agentName!: string;

  @property({ type: String })
  agentDescription!: string;

  @property({ type: String })
  agentImageUrl!: string;

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          width: 100%;
        }

        .agent-chip {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 16px;
          background-color: var(--surface-container-low);
          border-radius: 8px;
          gap: 16px;
        }

        img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .content {
          flex: 1;
          min-width: 0;
        }

        .agent-name {
          font-weight: 500;
          font-size: 1.1em;
          margin-bottom: 4px;
        }

        .agent-description {
          color: var(--secondary-text-color);
          font-size: 0.9em;
          line-height: 1.4;
        }

        md-filled-icon-button {
          margin-left: 32px;
          margin-top: 8px;
        }
      `,
    ];
  }

  override render() {
    return html`
      <div class="agent-chip">
        <img src="${this.agentImageUrl}" alt="${this.agentName}" />
        <div class="content">
          <div class="layout horizontal">
            <div class="layout vertical">
              <div class="agent-name">${this.agentName}</div>
              <div class="agent-description">${this.agentDescription}</div>
            </div>
            <md-filled-icon-button><md-icon>play_arrow</md-icon></md-filled-icon-button>
          </div>
        </div>
      </div>
    `;
  }
}
