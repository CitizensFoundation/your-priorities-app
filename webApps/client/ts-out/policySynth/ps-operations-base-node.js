var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import { PsServerApi } from './PsServerApi.js';
import { PsBaseWithRunningAgentObserver } from './ps-base-with-running-agents.js';
let PsOperationsBaseNode = class PsOperationsBaseNode extends PsBaseWithRunningAgentObserver {
    constructor() {
        super();
        this.posX = 0;
        this.posY = 0;
        this.api = new PsServerApi();
    }
    static get styles() {
        return [
            super.styles,
            css `


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
};
__decorate([
    property({ type: String })
], PsOperationsBaseNode.prototype, "nodeId", void 0);
__decorate([
    property({ type: Number })
], PsOperationsBaseNode.prototype, "posX", void 0);
__decorate([
    property({ type: Number })
], PsOperationsBaseNode.prototype, "posY", void 0);
PsOperationsBaseNode = __decorate([
    customElement('ps-operations-base-node')
], PsOperationsBaseNode);
export { PsOperationsBaseNode };
//# sourceMappingURL=ps-operations-base-node.js.map