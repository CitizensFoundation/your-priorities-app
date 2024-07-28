import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '@material/web/iconbutton/icon-button.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/menu/menu.js';
import { Menu } from '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';

import { PsServerApi } from './PsServerApi.js';
import { PsBaseWithRunningAgentObserver } from './ps-base-with-running-agents.js';

@customElement('ps-operations-base-node')
export abstract class PsOperationsBaseNode extends PsBaseWithRunningAgentObserver {
  @property({ type: String })
  nodeId!: string;

  @property({ type: Number })
  posX = 0;

  @property({ type: Number })
  posY = 0;

  api: PsServerApi;

  constructor() {
    super();
    this.api = new PsServerApi();
  }


  static override get styles() {
    return [
      super.styles,
      css`


        .editButton {
          position: absolute;
          bottom: 0;
          right: 0;
          z-index: 1500;
        }

        .typeIconCore {
          position: absolute;
          bottom: 8px;
          left: 8px;
        }

        .middleIcon {
          position: absolute;
          bottom: 0;
          left: 51px;
        }

        .typeIcon {
          color: var(--md-sys-color-primary);
        }

        .typeIconUde {
          color: var(--md-sys-color-tertiary);
        }

        .typeIconRoot {
          color: var(--md-sys-color-on-primary);
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

        [hidden] {
          display: none !important;
        }
      `,
    ];
  }

  editNode() {
    this.fire('edit-node', {
      nodeId: this.nodeId,
      element: this,
    });
  }
}
