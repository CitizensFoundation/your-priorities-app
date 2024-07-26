import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PsAiModelSize } from '@policysynth/agents/aiModelTypes.js';

import '@material/web/select/filled-select.js';
import '@material/web/select/select-option.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import { YpBaseElement } from '../common/yp-base-element.js';

@customElement('ps-ai-model-selector')
export class PsAiModelSelector extends YpBaseElement {
  @property({ type: Array }) activeAiModels: PsAiModelAttributes[] = [];
  @property({ type: Array }) requestedAiModelSizes: PsAiModelSize[] = [];
  @property({ type: Object }) currentModels: {
    [key in PsAiModelSize]?: PsAiModelAttributes | null;
  } = {};

  @state() private selectedAiModelIds: {
    [key in PsAiModelSize]?: number | null;
  } = {};
  @state() private filteredAiModels: {
    [key in PsAiModelSize]: PsAiModelAttributes[];
  } = {
    small: [],
    medium: [],
    large: [],
  };

  override updated(changedProperties: Map<string, any>) {
    if (
      changedProperties.has('activeAiModels') ||
      changedProperties.has('requestedAiModelSizes')
    ) {
      this.filterAiModels();
    }
    if (
      changedProperties.has('currentModels') &&
      Object.keys(this.selectedAiModelIds).length === 0
    ) {
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

  initializeSelectedModels() {
    Object.entries(this.currentModels).forEach(([size, model]) => {
      if (this.selectedAiModelIds[size as PsAiModelSize] === undefined) {
        this.selectedAiModelIds[size as PsAiModelSize] = model!.id;
      }
    });
    this.requestUpdate();
  }

  override render() {
    return html`
      <div class="ai-model-selectors">
        ${this.requestedAiModelSizes.map(size =>
          this.renderAiModelSelect(size)
        )}
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
                <div slot="headline">${this.t('noModelsAvailable')}</div>
              </md-select-option>`
            : models.map(
                aiModel => html`
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
          : ''}
      </div>
    `;
  }

  private getLocalizedModelLabel(size: PsAiModelSize) {
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
      new CustomEvent('ai-models-changed', {
        detail: { selectedAiModelIds: this.selectedAiModelIds },
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
          gap: 16px;
        }

        .ai-model-select-container {
          display: flex;
          align-items: center;
        }

        md-filled-select {
          flex-grow: 1;
          margin-right: 8px;
        }

        md-outlined-icon-button-not-used {
          --md-sys-color-on-surface-variant: var(--md-sys-color-error);
        }
      `,
    ];
  }
}
