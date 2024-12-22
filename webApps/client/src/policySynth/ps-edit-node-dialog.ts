import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import '@material/web/dialog/dialog.js';
import '@material/web/button/text-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/select/filled-select.js';
import '@material/web/select/select-option.js';
import '../yp-survey/yp-structured-question-edit.js';
import './ps-ai-model-selector.js';

import { PsAiModelSize, PsAiModelType } from '@policysynth/agents/aiModelTypes.js';
import { PsServerApi } from './PsServerApi.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { t } from 'i18next';

@customElement('ps-edit-node-dialog')
export class PsEditNodeDialog extends YpBaseElement {
  @property({ type: Boolean }) open = false;
  @property({ type: Object }) nodeToEditInfo: any;

  @property({ type: Number }) groupId!: number;

  @state() private activeAiModels: PsAiModelAttributes[] = [];
  @state() private selectedAiModels: {
    [key in PsAiModelSize]?: number | null;
  } = {};
  @state() private selectedReasoningModels: { [key in PsAiModelSize]?: number | null } = {};

  @state() private currentModels: {
    [key in PsAiModelSize]?: PsAiModelAttributes;
  } = {};

  @state() private currentReasoningModels: {
    [key in PsAiModelSize]?: PsAiModelAttributes;
  } = {};

  private api = new PsServerApi();

  override async connectedCallback() {
    super.connectedCallback();
    await this.fetchActiveAiModels();
  }

  async fetchActiveAiModels() {
    try {
      this.activeAiModels = await this.api.getActiveAiModels(this.groupId);
    } catch (error) {
      console.error('Error fetching active AI models:', error);
    }
  }

  override updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);
    if (changedProperties.has('open')) {
      const wasOpen = changedProperties.get('open');
      if (!wasOpen && this.open) {
        this.initializeCurrentModels();
      }
    }
  }

  initializeCurrentModels() {
    if (this.nodeToEditInfo && this.nodeToEditInfo.AiModels) {
      this._getCurrentModels();
    }
  }

  isReasoningModel(modelType: PsAiModelType): boolean {
    return (
      modelType === PsAiModelType.TextReasoning ||
      modelType === PsAiModelType.MultiModalReasoning
    );
  }

  _getCurrentModels() {
    // We'll keep them separate to avoid overwriting
    const currentAiModels: { [key in PsAiModelSize]?: PsAiModelAttributes } = {};
    const currentReasoningModels: { [key in PsAiModelSize]?: PsAiModelAttributes } = {};

    // Loop the attached models
    this.nodeToEditInfo.AiModels?.forEach((model: PsAiModelAttributes) => {
      const config = model.configuration;
      if (!config?.type || !config?.modelSize) return;
      const size = config.modelSize as PsAiModelSize;

      // If it's reasoning
      if (this.isReasoningModel(config.type)) {
        currentReasoningModels[size] = model;
      }
      // else it's multiModal (or text, etc.)
      else {
        currentAiModels[size] = model;
      }
    });

    // Assign them directly
    this.currentModels = currentAiModels;
    this.currentReasoningModels = currentReasoningModels;
  }

  disableScrim(event: CustomEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  override render() {
    return html`
      <md-dialog
        ?open="${this.open}"
        @closed="${this._handleClose}"
        @cancel="${this.disableScrim}"
      >
        <div slot="headline">
          ${this.nodeToEditInfo ? this._renderNodeEditHeadline() : ''}
        </div>
        <div slot="content" class="dialog-content">
          ${this.nodeToEditInfo ? this._renderEditForm() : ''}
        </div>
        <div slot="actions">
          <md-text-button @click="${this._handleClose}"
            >${this.t('cancel')}</md-text-button
          >
          <md-filled-button @click="${this._handleSave}"
            >${this.t('save')}</md-filled-button
          >
        </div>
      </md-dialog>
    `;
  }

  _renderNodeEditHeadline() {
    return html`
      <div class="layout horizontal">
        <div>
          <img
            src="${this.nodeToEditInfo.Class.configuration.imageUrl}"
            class="nodeEditHeadlineImage"
          />
        </div>
        <div class="nodeEditHeadlineTitle">
          ${this.nodeToEditInfo.Class.name}
        </div>
      </div>
    `;
  }

  _renderEditForm() {
    return html`
      <div id="surveyContainer">
        ${this.nodeToEditInfo.Class.configuration.questions.map(
          (question: YpStructuredQuestionData, index: number) => html`
            <yp-structured-question-edit
              index="${index}"
              id="structuredQuestion_${question.uniqueId
                ? index
                : `noId_${index}`}"
              .structuredAnswers="${this._getInitialAnswers()}"
              .question="${question}"
            >
            </yp-structured-question-edit>
          `
        )}
        ${this._renderAiModelSelector()}
      </div>
    `;
  }

  _renderAiModelSelector() {
    if (!this.nodeToEditInfo.Class.configuration.requestedAiModelSizes) {
      return '';
    }

    return html`
      <ps-ai-model-selector
        .activeAiModels="${this.activeAiModels}"
        .requestedAiModelSizes="${this.nodeToEditInfo.Class.configuration
          .requestedAiModelSizes}"
        .currentModels="${this.currentModels}"
        .currentReasoningModels="${this.currentReasoningModels}"
        @ai-models-changed="${this._handleAiModelsChanged}"
      ></ps-ai-model-selector>
    `;
  }

  _getInitialAnswers() {
    return Object.entries(this.nodeToEditInfo.configuration).map(
      ([key, value]) => ({
        uniqueId: key,
        value: value,
      })
    );
  }

  _handleClose() {
    this.dispatchEvent(new CustomEvent('close'));
    this.nodeToEditInfo = undefined;
  }

  _handleAiModelsChanged(e: CustomEvent) {
    this.selectedAiModels = e.detail.selectedAiModelIds;
    this.selectedReasoningModels = e.detail.selectedReasoningModelIds;
  }

  _handleSave() {
    const updatedConfig = {} as Record<string, any>;
    this.nodeToEditInfo.Class.configuration.questions.forEach(
      (question: YpStructuredQuestionData, index: number) => {
        const questionElement = this.shadowRoot?.querySelector(
          `#structuredQuestion_${question.uniqueId ? index : `noId_${index}`}`
        ) as any;
        if (questionElement && question.uniqueId) {
          const answer = questionElement.getAnswer();
          if (answer) {
            updatedConfig[question.uniqueId] = answer.value;
          }
        }
      }
    );

    interface AiModelUpdate {
      size: PsAiModelSize;
      modelId: number | null;
      type: PsAiModelType | null;  // or just string if you prefer
    }

    let aiModelUpdates: AiModelUpdate[] = [];

    // 2) Grab the chosen model’s actual `type` from your activeAiModels list:
    if (this.nodeToEditInfo.Class.configuration.requestedAiModelSizes) {
      aiModelUpdates = [
        // For multiModal picks:
        ...Object.entries(this.selectedAiModels).map(([size, modelId]) => {
          const chosenModel = this.activeAiModels.find(m => m.id === modelId);
          debugger;
          return {
            size: size as PsAiModelSize,
            modelId: modelId ? Number(modelId) : null,
            type: chosenModel?.configuration?.type ?? null
          };
        }),
        // For reasoning picks:
        ...Object.entries(this.selectedReasoningModels).map(([size, modelId]) => {
          const chosenModel = this.activeAiModels.find(m => m.id === modelId);
          return {
            size: size as PsAiModelSize,
            modelId: modelId ? Number(modelId) : null,
            type: chosenModel?.configuration?.type ?? null
          };
        })
      ];
    }

    this.dispatchEvent(
      new CustomEvent('save', {
        detail: {
          updatedConfig,
          aiModelUpdates,
          connectorType:
            this.nodeToEditInfo.Class.configuration.type === 'input'
              ? 'input'
              : 'output',
        },
      })
    );

    this._handleClose();
  }

  static override get styles() {
    return [
      super.styles,
      css`
        .nodeEditHeadlineImage {
          max-width: 100px;
          margin-right: 16px;
        }

        .nodeEditHeadlineTitle {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 55px;
        }

        md-dialog {
          width: 90%;
          height: 90%;
        }

        #surveyContainer {
          margin-bottom: 48px;
        }
      `,
    ];
  }
}
