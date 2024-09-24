var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { PsAiModelType, } from "@policysynth/agents/aiModelTypes.js";
import "@material/web/select/filled-select.js";
import "@material/web/select/select-option.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import { YpBaseElement } from "../common/yp-base-element.js";
let PsAiModelSelector = class PsAiModelSelector extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.activeAiModels = [];
        this.requestedAiModelSizes = [];
        this.currentModels = {};
        this.currentReasoningModels = {};
        this.selectedAiModelIds = {};
        this.selectedReasoningModelIds = {};
        this.filteredAiModels = {
            small: [],
            medium: [],
            large: [],
        };
        this.filteredReasoningModels = {
            small: [],
            medium: [],
            large: [],
        };
    }
    updated(changedProperties) {
        if (changedProperties.has("activeAiModels") ||
            changedProperties.has("requestedAiModelSizes")) {
            this.filterAiModels();
            this.filterReasoningModels();
        }
        if (changedProperties.has("currentModels")) {
            this.filterCurrentReasoningModels();
            this.initializeSelectedModels();
            this.initializeSelectedReasoningModels();
        }
    }
    filterAiModels() {
        this.filteredAiModels = {
            small: [],
            medium: [],
            large: [],
        };
        this.activeAiModels.forEach((model) => {
            if (model.configuration &&
                "modelSize" in model.configuration &&
                "type" in model.configuration &&
                !this.isReasoningModel(model.configuration.type)) {
                const size = model.configuration.modelSize;
                if (size in this.filteredAiModels &&
                    this.requestedAiModelSizes.includes(size)) {
                    this.filteredAiModels[size].push(model);
                }
            }
        });
    }
    filterReasoningModels() {
        this.filteredReasoningModels = {
            small: [],
            medium: [],
            large: [],
        };
        this.activeAiModels.forEach((model) => {
            if (model.configuration &&
                "type" in model.configuration &&
                this.isReasoningModel(model.configuration.type) &&
                "modelSize" in model.configuration) {
                const size = model.configuration.modelSize;
                if (size in this.filteredReasoningModels &&
                    this.requestedAiModelSizes.includes(size)) {
                    this.filteredReasoningModels[size].push(model);
                }
            }
        });
    }
    isReasoningModel(modelType) {
        return (modelType === PsAiModelType.TextReasoning ||
            modelType === PsAiModelType.MultiModalReasoning);
    }
    filterCurrentReasoningModels() {
        this.currentReasoningModels = {};
        Object.entries(this.currentModels).forEach(([size, model]) => {
            if (model &&
                model.configuration &&
                "type" in model.configuration &&
                this.isReasoningModel(model.configuration.type)) {
                this.currentReasoningModels[size] = model;
            }
        });
    }
    initializeSelectedModels() {
        Object.entries(this.currentModels).forEach(([size, model]) => {
            if (this.selectedAiModelIds[size] === undefined) {
                this.selectedAiModelIds[size] = model
                    ? model.id
                    : null;
            }
        });
        this.requestUpdate();
    }
    initializeSelectedReasoningModels() {
        Object.entries(this.currentReasoningModels).forEach(([size, model]) => {
            if (this.selectedReasoningModelIds[size] === undefined) {
                this.selectedReasoningModelIds[size] = model
                    ? model.id
                    : null;
            }
        });
        this.requestUpdate();
    }
    render() {
        return html `
      <div
        class="layout vertical"
        ?hidden="${!this.requestedAiModelSizes ||
            this.requestedAiModelSizes.length == 0}"
      >
        <div class="modelType">${this.t("multiModalModels")}</div>
        <div class="ai-model-selectors">
          ${this.requestedAiModelSizes.map((size) => html `
              <div class="model-section">${this.renderAiModelSelect(size)}</div>
            `)}
        </div>
        <div class="modelType">${this.t("reasoningModels")}</div>
        <div class="ai-model-selectors">
          ${this.requestedAiModelSizes.map((size) => html `
              <div class="model-section">
                ${this.renderReasoningModelSelect(size)}
              </div>
            `)}
        </div>
      </div>
    `;
    }
    renderAiModelSelect(size) {
        const models = this.filteredAiModels[size];
        const isDisabled = models.length === 0;
        const currentModel = this.currentModels[size];
        return html `
      <div class="ai-model-select-container">
        <md-filled-select
          .label="${this.getLocalizedModelLabel(size)}"
          @change="${(e) => this._handleAiModelSelection(e, size)}"
          ?disabled="${isDisabled}"
        >
          ${isDisabled
            ? html `<md-select-option disabled>
                <div slot="headline">${this.t("noModelsAvailable")}</div>
              </md-select-option>`
            : models.map((aiModel) => html `
                  <md-select-option
                    value="${aiModel.id}"
                    ?selected="${aiModel.id === currentModel?.id}"
                  >
                    <div slot="headline">${aiModel.name}</div>
                  </md-select-option>
                `)}
        </md-filled-select>
        ${currentModel
            ? html `
              <md-icon-button @click="${() => this._handleRemoveModel(size)}">
                <md-icon>delete</md-icon>
              </md-icon-button>
            `
            : ""}
      </div>
    `;
    }
    renderReasoningModelSelect(size) {
        const models = this.filteredReasoningModels[size];
        const isDisabled = models.length === 0;
        const currentModel = this.currentReasoningModels[size];
        return html `
      <div class="ai-model-select-container reasoning">
        <md-filled-select
          .label="${this.getLocalizedReasoningModelLabel(size)}"
          @change="${(e) => this._handleAiReasoningModelSelection(e, size)}"
          ?disabled="${isDisabled}"
        >
          ${isDisabled
            ? html `<md-select-option disabled>
                <div slot="headline">
                  ${this.t("noReasoningModelsAvailable")}
                </div>
              </md-select-option>`
            : models.map((aiModel) => html `
                  <md-select-option
                    value="${aiModel.id}"
                    ?selected="${aiModel.id === currentModel?.id}"
                  >
                    <div slot="headline">${aiModel.name}</div>
                  </md-select-option>
                `)}
        </md-filled-select>
        ${currentModel
            ? html `
              <md-icon-button
                @click="${() => this._handleRemoveReasoningModel(size)}"
              >
                <md-icon>delete</md-icon>
              </md-icon-button>
            `
            : ""}
      </div>
    `;
    }
    getLocalizedModelLabel(size) {
        switch (size) {
            case "small":
                return this.t("selectSmallAiModel");
            case "medium":
                return this.t("selectMediumAiModel");
            case "large":
                return this.t("selectLargeAiModel");
            default:
                return this.t("selectAiModel");
        }
    }
    getLocalizedReasoningModelLabel(size) {
        switch (size) {
            case "small":
                return this.t("selectSmallReasoningModel");
            case "medium":
                return this.t("selectMediumReasoningModel");
            case "large":
                return this.t("selectLargeReasoningModel");
            default:
                return this.t("selectReasoningModel");
        }
    }
    _handleAiModelSelection(e, size) {
        const select = e.target;
        this.selectedAiModelIds[size] = Number(select.value);
        this._emitChangeEvent();
        this.requestUpdate();
    }
    _handleAiReasoningModelSelection(e, size) {
        const select = e.target;
        this.selectedReasoningModelIds[size] = Number(select.value);
        this._emitChangeEvent();
        this.requestUpdate();
    }
    _handleRemoveModel(size) {
        this.currentModels[size] = null;
        this.selectedAiModelIds[size] = null;
        this.currentModels = { ...this.currentModels };
        this.selectedAiModelIds = { ...this.selectedAiModelIds };
        this._emitChangeEvent();
        this.requestUpdate();
    }
    _handleRemoveReasoningModel(size) {
        this.currentReasoningModels[size] = null;
        this.selectedReasoningModelIds[size] = null;
        this.currentReasoningModels = { ...this.currentReasoningModels };
        this.selectedReasoningModelIds = { ...this.selectedReasoningModelIds };
        this._emitChangeEvent();
        this.requestUpdate();
    }
    _emitChangeEvent() {
        this.dispatchEvent(new CustomEvent("ai-models-changed", {
            detail: {
                selectedAiModelIds: this.selectedAiModelIds,
                selectedReasoningModelIds: this.selectedReasoningModelIds,
            },
            bubbles: true,
            composed: true,
        }));
        debugger;
    }
    static get styles() {
        return [
            super.styles,
            css `
        .ai-model-selectors {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .model-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ai-model-select-container {
          display: flex;
          align-items: center;
        }

        .ai-model-select-container.reasoning {
        }

        .modelType {
          margin-top: 24px;
          font-weight: bold;
          margin-bottom: 8px;
        }

        md-filled-select {
          flex-grow: 1;
          margin-top: 8px;
          margin-bottom: 8px;
        }

        md-icon-button {
          --md-sys-color-on-surface-variant: var(--md-sys-color-error);
        }
      `,
        ];
    }
};
__decorate([
    property({ type: Array })
], PsAiModelSelector.prototype, "activeAiModels", void 0);
__decorate([
    property({ type: Array })
], PsAiModelSelector.prototype, "requestedAiModelSizes", void 0);
__decorate([
    property({ type: Object })
], PsAiModelSelector.prototype, "currentModels", void 0);
__decorate([
    state()
], PsAiModelSelector.prototype, "currentReasoningModels", void 0);
__decorate([
    state()
], PsAiModelSelector.prototype, "selectedAiModelIds", void 0);
__decorate([
    state()
], PsAiModelSelector.prototype, "selectedReasoningModelIds", void 0);
__decorate([
    state()
], PsAiModelSelector.prototype, "filteredAiModels", void 0);
__decorate([
    state()
], PsAiModelSelector.prototype, "filteredReasoningModels", void 0);
PsAiModelSelector = __decorate([
    customElement("ps-ai-model-selector")
], PsAiModelSelector);
export { PsAiModelSelector };
//# sourceMappingURL=ps-ai-model-selector.js.map