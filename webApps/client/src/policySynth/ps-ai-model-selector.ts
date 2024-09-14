import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  PsAiModelSize,
  PsAiModelType,
} from "@policysynth/agents/aiModelTypes.js";

import "@material/web/select/filled-select.js";
import "@material/web/select/select-option.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import { YpBaseElement } from "../common/yp-base-element.js";

@customElement("ps-ai-model-selector")
export class PsAiModelSelector extends YpBaseElement {
  @property({ type: Array }) activeAiModels: PsAiModelAttributes[] = [];
  @property({ type: Array }) requestedAiModelSizes: PsAiModelSize[] = [];
  @property({ type: Object }) currentModels: {
    [key in PsAiModelSize]?: PsAiModelAttributes | null;
  } = {};

  @state() private currentReasoningModels: {
    [key in PsAiModelSize]?: PsAiModelAttributes | null;
  } = {};

  @state() private selectedAiModelIds: {
    [key in PsAiModelSize]?: number | null;
  } = {};

  @state() private selectedReasoningModelIds: {
    [key in PsAiModelSize]?: number | null;
  } = {};

  @state() private filteredAiModels: {
    [key in PsAiModelSize]: PsAiModelAttributes[];
  } = {
    small: [],
    medium: [],
    large: [],
  };

  @state() private filteredReasoningModels: {
    [key in PsAiModelSize]: PsAiModelAttributes[];
  } = {
    small: [],
    medium: [],
    large: [],
  };

  override updated(changedProperties: Map<string, any>) {
    if (
      changedProperties.has("activeAiModels") ||
      changedProperties.has("requestedAiModelSizes")
    ) {
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
      if (
        model.configuration &&
        "modelSize" in model.configuration &&
        "type" in model.configuration &&
        !this.isReasoningModel(model.configuration.type)
      ) {
        const size = model.configuration.modelSize as PsAiModelSize;
        if (
          size in this.filteredAiModels &&
          this.requestedAiModelSizes.includes(size)
        ) {
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
      if (
        model.configuration &&
        "type" in model.configuration &&
        this.isReasoningModel(model.configuration.type) &&
        "modelSize" in model.configuration
      ) {
        const size = model.configuration.modelSize as PsAiModelSize;
        if (
          size in this.filteredReasoningModels &&
          this.requestedAiModelSizes.includes(size)
        ) {
          this.filteredReasoningModels[size].push(model);
        }
      }
    });
  }

  private isReasoningModel(modelType: PsAiModelType): boolean {
    return (
      modelType === PsAiModelType.TextReasoning ||
      modelType === PsAiModelType.MultiModalReasoning
    );
  }

  filterCurrentReasoningModels() {
    this.currentReasoningModels = {};
    Object.entries(this.currentModels).forEach(([size, model]) => {
      if (
        model &&
        model.configuration &&
        "type" in model.configuration &&
        this.isReasoningModel(model.configuration.type)
      ) {
        this.currentReasoningModels[size as PsAiModelSize] = model;
      }
    });
  }

  initializeSelectedModels() {
    Object.entries(this.currentModels).forEach(([size, model]) => {
      if (this.selectedAiModelIds[size as PsAiModelSize] === undefined) {
        this.selectedAiModelIds[size as PsAiModelSize] = model
          ? model.id
          : null;
      }
    });
    this.requestUpdate();
  }

  initializeSelectedReasoningModels() {
    Object.entries(this.currentReasoningModels).forEach(([size, model]) => {
      if (this.selectedReasoningModelIds[size as PsAiModelSize] === undefined) {
        this.selectedReasoningModelIds[size as PsAiModelSize] = model
          ? model.id
          : null;
      }
    });
    this.requestUpdate();
  }

  override render() {
    return html`
      <div
        class="layout vertical"
        ?hidden="${!this.requestedAiModelSizes ||
        this.requestedAiModelSizes.length == 0}"
      >
        <div class="modelType">${this.t("multiModalModels")}</div>
        <div class="ai-model-selectors">
          ${this.requestedAiModelSizes.map(
            (size) => html`
              <div class="model-section">${this.renderAiModelSelect(size)}</div>
            `
          )}
        </div>
        <div class="modelType">${this.t("reasoningModels")}</div>
        <div class="ai-model-selectors">
          ${this.requestedAiModelSizes.map(
            (size) => html`
              <div class="model-section">
                ${this.renderReasoningModelSelect(size)}
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  private renderAiModelSelect(size: PsAiModelSize) {
    const models = this.filteredAiModels[size];
    const isDisabled = models.length === 0;
    const currentModel = this.currentModels[size];

    return html`
      <div class="ai-model-select-container">
        <md-filled-select
          .label="${this.getLocalizedModelLabel(size)}"
          @change="${(e: Event) => this._handleAiModelSelection(e, size)}"
          ?disabled="${isDisabled}"
        >
          ${isDisabled
            ? html`<md-select-option disabled>
                <div slot="headline">${this.t("noModelsAvailable")}</div>
              </md-select-option>`
            : models.map(
                (aiModel) => html`
                  <md-select-option
                    value="${aiModel.id}"
                    ?selected="${aiModel.id === currentModel?.id}"
                  >
                    <div slot="headline">${aiModel.name}</div>
                  </md-select-option>
                `
              )}
        </md-filled-select>
        ${currentModel
          ? html`
              <md-icon-button @click="${() => this._handleRemoveModel(size)}">
                <md-icon>delete</md-icon>
              </md-icon-button>
            `
          : ""}
      </div>
    `;
  }

  private renderReasoningModelSelect(size: PsAiModelSize) {
    const models = this.filteredReasoningModels[size];
    const isDisabled = models.length === 0;
    const currentModel = this.currentReasoningModels[size];

    return html`
      <div class="ai-model-select-container reasoning">
        <md-filled-select
          .label="${this.getLocalizedReasoningModelLabel(size)}"
           @change="${(e: Event) => this._handleAiModelSelection(e, size)}"
          ?disabled="${isDisabled}"
        >
          ${isDisabled
            ? html`<md-select-option disabled>
                <div slot="headline">
                  ${this.t("noReasoningModelsAvailable")}
                </div>
              </md-select-option>`
            : models.map(
                (aiModel) => html`
                  <md-select-option
                    value="${aiModel.id}"
                    ?selected="${aiModel.id === currentModel?.id}"
                  >
                    <div slot="headline">${aiModel.name}</div>
                  </md-select-option>
                `
              )}
        </md-filled-select>
        ${currentModel
          ? html`
              <md-icon-button
                @click="${() => this._handleRemoveModel(size)}"
              >
                <md-icon>delete</md-icon>
              </md-icon-button>
            `
          : ""}
      </div>
    `;
  }

  private getLocalizedModelLabel(size: PsAiModelSize) {
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

  private getLocalizedReasoningModelLabel(size: PsAiModelSize) {
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

  private _handleAiModelSelection(e: Event, size: PsAiModelSize) {
    const select = e.target as HTMLSelectElement;
    this.selectedAiModelIds[size] = Number(select.value);
    this._emitChangeEvent();
    this.requestUpdate();
  }

  private _handleRemoveModel(size: PsAiModelSize) {
    this.currentModels[size] = null;
    this.selectedAiModelIds[size] = null;
    this.currentModels = { ...this.currentModels };
    this.selectedAiModelIds = { ...this.selectedAiModelIds };
    this._emitChangeEvent();
    this.requestUpdate();
  }

  private _emitChangeEvent() {
    this.dispatchEvent(
      new CustomEvent("ai-models-changed", {
        detail: {
          selectedAiModelIds: this.selectedAiModelIds,
          selectedReasoningModelIds: this.selectedReasoningModelIds,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  static override get styles() {
    return [
      super.styles,
      css`
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
}
