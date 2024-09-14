import { PsAiModelSize } from "@policysynth/agents/aiModelTypes.js";
import "@material/web/select/filled-select.js";
import "@material/web/select/select-option.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import { YpBaseElement } from "../common/yp-base-element.js";
export declare class PsAiModelSelector extends YpBaseElement {
    activeAiModels: PsAiModelAttributes[];
    requestedAiModelSizes: PsAiModelSize[];
    currentModels: {
        [key in PsAiModelSize]?: PsAiModelAttributes | null;
    };
    private currentReasoningModels;
    private selectedAiModelIds;
    private selectedReasoningModelIds;
    private filteredAiModels;
    private filteredReasoningModels;
    updated(changedProperties: Map<string, any>): void;
    filterAiModels(): void;
    filterReasoningModels(): void;
    private isReasoningModel;
    filterCurrentReasoningModels(): void;
    initializeSelectedModels(): void;
    initializeSelectedReasoningModels(): void;
    render(): import("lit-html").TemplateResult<1>;
    private renderAiModelSelect;
    private renderReasoningModelSelect;
    private getLocalizedModelLabel;
    private getLocalizedReasoningModelLabel;
    private _handleAiModelSelection;
    private _handleRemoveModel;
    private _emitChangeEvent;
    static get styles(): any[];
}
//# sourceMappingURL=ps-ai-model-selector.d.ts.map