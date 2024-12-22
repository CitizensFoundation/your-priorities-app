import '@material/web/dialog/dialog.js';
import '@material/web/button/text-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/select/filled-select.js';
import '@material/web/select/select-option.js';
import '../yp-survey/yp-structured-question-edit.js';
import './ps-ai-model-selector.js';
import { PsAiModelType } from '@policysynth/agents/aiModelTypes.js';
import { YpBaseElement } from '../common/yp-base-element.js';
export declare class PsEditNodeDialog extends YpBaseElement {
    open: boolean;
    nodeToEditInfo: any;
    groupId: number;
    private activeAiModels;
    private selectedAiModels;
    private selectedReasoningModels;
    private currentModels;
    private currentReasoningModels;
    private api;
    connectedCallback(): Promise<void>;
    fetchActiveAiModels(): Promise<void>;
    updated(changedProperties: Map<string, any>): void;
    initializeCurrentModels(): void;
    isReasoningModel(modelType: PsAiModelType): boolean;
    _getCurrentModels(): void;
    disableScrim(event: CustomEvent): void;
    render(): import("lit-html").TemplateResult<1>;
    _renderNodeEditHeadline(): import("lit-html").TemplateResult<1>;
    _renderEditForm(): import("lit-html").TemplateResult<1>;
    _renderAiModelSelector(): "" | import("lit-html").TemplateResult<1>;
    _getInitialAnswers(): {
        uniqueId: string;
        value: unknown;
    }[];
    _handleClose(): void;
    _handleAiModelsChanged(e: CustomEvent): void;
    _handleSave(): void;
    static get styles(): any[];
}
//# sourceMappingURL=ps-edit-node-dialog.d.ts.map