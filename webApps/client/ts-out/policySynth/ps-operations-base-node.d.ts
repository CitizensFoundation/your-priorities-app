import '@material/web/iconbutton/icon-button.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import { PsServerApi } from './PsServerApi.js';
import { PsBaseWithRunningAgentObserver } from './ps-base-with-running-agents.js';
export declare abstract class PsOperationsBaseNode extends PsBaseWithRunningAgentObserver {
    nodeId: string;
    posX: number;
    posY: number;
    api: PsServerApi;
    constructor();
    static get styles(): any[];
    editNode(): void;
}
//# sourceMappingURL=ps-operations-base-node.d.ts.map