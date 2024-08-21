var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@material/web/select/filled-select.js';
import '@material/web/select/select-option.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import { YpBaseElement } from '../common/yp-base-element.js';
let PsAiModelSelector = class PsAiModelSelector extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.activeAiModels = [];
        this.requestedAiModelSizes = [];
        this.currentModels = {};
        this.selectedAiModelIds = {};
        this.filteredAiModels = {
            small: [],
            medium: [],
            large: [],
        };
    }
    updated(changedProperties) {
        if (changedProperties.has('activeAiModels') ||
            changedProperties.has('requestedAiModelSizes')) {
            this.filterAiModels();
        }
        if (changedProperties.has('currentModels') &&
            Object.keys(this.selectedAiModelIds).length === 0) {
            this.initializeSelectedModels();
        }
        if (changedProperties.has('currentModels')) {
            //console.error('currentModels changed', JSON.stringify(this.currentModels, null, 2));
        }
    }
    filterAiModels() {
        this.filteredAiModels = {
            small: [],
            medium: [],
            large: [],
        };
        this.activeAiModels.forEach(model => {
            if (model.configuration && 'modelSize' in model.configuration) {
                const size = model.configuration.modelSize;
                if (size in this.filteredAiModels &&
                    this.requestedAiModelSizes.includes(size)) {
                    this.filteredAiModels[size].push(model);
                }
            }
        });
    }
    initializeSelectedModels() {
        Object.entries(this.currentModels).forEach(([size, model]) => {
            if (this.selectedAiModelIds[size] === undefined) {
                this.selectedAiModelIds[size] = model.id;
            }
        });
        this.requestUpdate();
    }
    render() {
        return html `
      <div class="ai-model-selectors">
        ${this.requestedAiModelSizes.map(size => this.renderAiModelSelect(size))}
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
                <div slot="headline">${this.t('noModelsAvailable')}</div>
              </md-select-option>`
            : models.map(aiModel => html `
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
            : ''}
      </div>
    `;
    }
    getLocalizedModelLabel(size) {
        switch (size) {
            case 'small':
                return this.t('selectSmallAiModel');
            case 'medium':
                return this.t('selectMediumAiModel');
            case 'large':
                return this.t('selectLargeAiModel');
            default:
                return this.t('selectAiModel');
        }
    }
    _handleAiModelSelection(e, size) {
        const select = e.target;
        this.selectedAiModelIds[size] = Number(select.value);
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
    _emitChangeEvent() {
        this.dispatchEvent(new CustomEvent('ai-models-changed', {
            detail: { selectedAiModelIds: this.selectedAiModelIds },
            bubbles: true,
            composed: true,
        }));
    }
    static get styles() {
        return [
            super.styles,
            css `
        .ai-model-selectors {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ai-model-select-container {
          display: flex;
          align-items: center;
        }

        md-filled-select {
          flex-grow: 1;
          margin-top: 8px;
          margin-bottom: 8px;
        }

        md-outlined-icon-button-not-used {
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
], PsAiModelSelector.prototype, "selectedAiModelIds", void 0);
__decorate([
    state()
], PsAiModelSelector.prototype, "filteredAiModels", void 0);
PsAiModelSelector = __decorate([
    customElement('ps-ai-model-selector')
], PsAiModelSelector);
export { PsAiModelSelector };
//# sourceMappingURL=ps-ai-model-selector.js.map