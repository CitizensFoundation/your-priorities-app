import '@material/web/dialog/dialog.js';
import '@material/web/button/text-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/select/filled-select.js';
import '@material/web/select/select-option.js';
import '@material/web/textfield/filled-text-field.js';
import './ps-ai-model-selector.js';
import { YpBaseElement } from '../common/yp-base-element.js';
export declare class PsAddAgentDialog extends YpBaseElement {
    open: boolean;
    parentAgentId: number;
    groupId: number;
    private activeAgentClasses;
    private activeAiModels;
    private selectedAgentClassId;
    private selectedAiModelIds;
    private agentName;
    private requestedAiModelSizes;
    private api;
    connectedCallback(): Promise<void>;
    fetchActiveAgentClasses(): Promise<void>;
    fetchActiveAiModels(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
    private _handleNameInput;
    private _handleAgentClassSelection;
    private _handleAiModelsChanged;
    private _handleClose;
    disableScrim(event: CustomEvent): void;
    private _handleAddAgent;
    static get styles(): any[];
}
//# sourceMappingURL=ps-add-agent-dialog.d.ts.map