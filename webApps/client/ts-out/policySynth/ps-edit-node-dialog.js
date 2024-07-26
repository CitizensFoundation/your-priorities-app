var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@material/web/dialog/dialog.js';
import '@material/web/button/text-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/select/filled-select.js';
import '@material/web/select/select-option.js';
import '../yp-survey/yp-structured-question-edit.js';
import './ps-ai-model-selector.js';
import { PsServerApi } from './PsServerApi.js';
import { YpBaseElement } from '../common/yp-base-element.js';
let PsEditNodeDialog = class PsEditNodeDialog extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.open = false;
        this.activeAiModels = [];
        this.selectedAiModels = {};
        this.currentModels = {};
        this.api = new PsServerApi();
    }
    async connectedCallback() {
        super.connectedCallback();
        await this.fetchActiveAiModels();
    }
    async fetchActiveAiModels() {
        try {
            this.activeAiModels = await this.api.getActiveAiModels(this.groupId);
        }
        catch (error) {
            console.error('Error fetching active AI models:', error);
        }
    }
    updated(changedProperties) {
        if (changedProperties.has('nodeToEditInfo')) {
            this.initializeCurrentModels();
        }
    }
    initializeCurrentModels() {
        if (this.nodeToEditInfo && this.nodeToEditInfo.AiModels) {
            this.currentModels = this._getCurrentModels();
        }
    }
    _getCurrentModels() {
        const currentModels = {};
        this.nodeToEditInfo.AiModels?.forEach((model) => {
            if (model.configuration && 'modelSize' in model.configuration) {
                currentModels[model.configuration.modelSize] = model;
            }
        });
        return currentModels;
    }
    disableScrim(event) {
        event.stopPropagation();
        event.preventDefault();
    }
    render() {
        return html `
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
        return html `
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
        return html `
      <div id="surveyContainer">
        ${this.nodeToEditInfo.Class.configuration.questions.map((question, index) => html `
            <yp-structured-question-edit
              index="${index}"
              id="structuredQuestion_${question.uniqueId
            ? index
            : `noId_${index}`}"
              .structuredAnswers="${this._getInitialAnswers()}"
              .question="${question}"
            >
            </yp-structured-question-edit>
          `)}
        ${this._renderAiModelSelector()}
      </div>
    `;
    }
    _renderAiModelSelector() {
        if (!this.nodeToEditInfo.Class.configuration.requestedAiModelSizes) {
            return '';
        }
        return html `
      <ps-ai-model-selector
        .activeAiModels="${this.activeAiModels}"
        .requestedAiModelSizes="${this.nodeToEditInfo.Class.configuration
            .requestedAiModelSizes}"
        .currentModels="${this.currentModels}"
        @ai-models-changed="${this._handleAiModelsChanged}"
      ></ps-ai-model-selector>
    `;
    }
    _getInitialAnswers() {
        return Object.entries(this.nodeToEditInfo.configuration).map(([key, value]) => ({
            uniqueId: key,
            value: value,
        }));
    }
    _handleClose() {
        this.dispatchEvent(new CustomEvent('close'));
    }
    _handleAiModelsChanged(e) {
        this.selectedAiModels = e.detail.selectedAiModelIds;
    }
    _handleSave() {
        const updatedConfig = {};
        this.nodeToEditInfo.Class.configuration.questions.forEach((question, index) => {
            const questionElement = this.shadowRoot?.querySelector(`#structuredQuestion_${question.uniqueId ? index : `noId_${index}`}`);
            if (questionElement && question.uniqueId) {
                const answer = questionElement.getAnswer();
                if (answer) {
                    updatedConfig[question.uniqueId] = answer.value;
                }
            }
        });
        let aiModelUpdates;
        if (this.nodeToEditInfo.Class.configuration.requestedAiModelSizes) {
            aiModelUpdates = Object.entries(this.selectedAiModels).map(([size, modelId]) => {
                return {
                    size: size,
                    modelId: modelId,
                };
            });
        }
        this.dispatchEvent(new CustomEvent('save', {
            detail: {
                updatedConfig,
                aiModelUpdates,
                connectorType: this.nodeToEditInfo.Class.configuration.type === 'input'
                    ? 'input'
                    : 'output',
            },
        }));
        this._handleClose();
    }
    static get styles() {
        return [
            super.styles,
            css `
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
};
__decorate([
    property({ type: Boolean })
], PsEditNodeDialog.prototype, "open", void 0);
__decorate([
    property({ type: Object })
], PsEditNodeDialog.prototype, "nodeToEditInfo", void 0);
__decorate([
    property({ type: Number })
], PsEditNodeDialog.prototype, "groupId", void 0);
__decorate([
    state()
], PsEditNodeDialog.prototype, "activeAiModels", void 0);
__decorate([
    state()
], PsEditNodeDialog.prototype, "selectedAiModels", void 0);
__decorate([
    state()
], PsEditNodeDialog.prototype, "currentModels", void 0);
PsEditNodeDialog = __decorate([
    customElement('ps-edit-node-dialog')
], PsEditNodeDialog);
export { PsEditNodeDialog };
//# sourceMappingURL=ps-edit-node-dialog.js.map