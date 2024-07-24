var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import '@material/web/icon/icon';
import '@material/web/checkbox/checkbox';
import '@material/web/button/outlined-button';
import '@material/web/button/filled-button';
import '@material/web/textfield/filled-text-field';
import '@material/web/progress/circular-progress';
import { jsonrepair } from 'jsonrepair';
import '@yrpri/webapp/common/yp-image';
import { PsServerApi } from '../PsServerApi.js';
import { PsAiChatElement } from '../../chatBot/ps-ai-chat-element.js';
let LtpAiChatElement = class LtpAiChatElement extends PsAiChatElement {
    constructor() {
        super();
        this.handleJsonLoadingEnd = (event) => {
            const jsonContent = event.detail;
            console.log('JSON loading end event triggered with JSON content:', jsonContent);
            this.jsonLoading = false;
            let jsonContentParsed = undefined;
            try {
                jsonContentParsed = JSON.parse(jsonContent.jsonContent);
            }
            catch (e) {
                console.error('Error parsing JSON content:', e);
                try {
                    jsonContentParsed = JSON.parse(jsonrepair(jsonContent.jsonContent));
                }
                catch (e) {
                    console.error('Error parsing JSON content again:', e);
                }
            }
            if (jsonContentParsed) {
                if (this.lastChainCompletedAsValid &&
                    this.lastValidateCauses &&
                    this.lastValidateCauses.length > 0) {
                    this.refinedCausesSuggestions = this.lastValidateCauses;
                }
                else if (jsonContentParsed.suggestedCauses) {
                    this.refinedCausesSuggestions = jsonContentParsed.suggestedCauses;
                }
            }
        };
        this.api = new PsServerApi();
    }
    static get styles() {
        return [
            super.styles,
            css `
        .refinedCausesSuggestionshowMore {
          padding-left: 16px;
          padding-right: 16px;
        }

        .refinedSuggestions {
          padding: 0;
          border-radius: 8px;
          margin: 16px;
          margin-top: 0;
        }

        .refinedSuggestions label {
          display: flex;
          align-items: center;
          margin-bottom: 0; // Reduced margin for a tighter layout
          padding: 8px;
        }

        .refinedContainer {
          padding: 0;
        }

        .directCause {
          background-color: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
          margin-bottom: 16px !important;
          border-radius: 16px;
        }

        .assumption {
          background-color: var(--md-sys-color-secondary);
          color: var(--md-sys-color-on-secondary);
          margin-bottom: 16px !important;
          border-radius: 16px;
        }

        .assumptionCheckbox {
          --md-checkbox-outline-color: var(--md-sys-color-on-secondary);
          --md-checkbox-hover-outline-color: var(--md-sys-color-on-primary);
        }

        .directCauseCheckbox {
          --md-checkbox-outline-color: var(--md-sys-color-on-primary);
          --md-checkbox-hover-outline-color: var(--md-sys-color-on-secondary);
        }

        md-filled-button {
          max-width: 250px;
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .refinedCausesSuggestions {
          margin-top: 8px;
          margin-left: 36px;
          margin-right: 36px;
          margin-bottom: 22px;
          padding: 8px;
          border-radius: 12px;
          background-color: var(--md-sys-color-tertiary-container);
          color: var(--md-sys-color-on-tertiary-container);
        }

        .suggestionsHeader {
          font-size: 18px;
          color: var(--md-sys-color-primary);
          margin-bottom: 16px;
        }
      `,
        ];
    }
    async addSelected() {
        const checkboxes = this.shadowRoot.querySelectorAll('md-checkbox');
        // Arrays to hold selected causes and assumptions
        const selectedCauses = [];
        const selectedAssumptions = [];
        // Iterate over each checked checkbox
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const item = checkbox.getAttribute('aria-label');
                const type = checkbox.dataset.type;
                if (type === 'directCause') {
                    selectedCauses.push(item);
                }
                else if (type === 'assumption') {
                    selectedAssumptions.push(item);
                }
            }
        });
        this.isCreatingCauses = true;
        // Add causes and assumptions using separate API calls
        let nodes = [];
        if (this.lastChainCompletedAsValid) {
            if (selectedCauses.length) {
                const causesNodes = await this.api.addDirectCauses(this.crtId, this.parentNodeId, selectedCauses, 'directCause');
                nodes = nodes.concat(causesNodes);
            }
            if (selectedAssumptions.length) {
                const assumptionsNodes = await this.api.addDirectCauses(this.crtId, this.parentNodeId, selectedAssumptions, 'assumption');
                nodes = nodes.concat(assumptionsNodes);
            }
            this.fireGlobal('add-nodes', {
                parentNodeId: this.parentNodeId,
                nodes,
            });
            await new Promise(resolve => setTimeout(resolve, 10));
            this.fire('close-add-cause-dialog');
            this.isCreatingCauses = false;
        }
        else {
            this.fire('validate-selected-causes', selectedCauses);
        }
        this.fire('scroll-down-enabled');
    }
    get isError() {
        return this.type == 'error' || this.type == 'moderation_error';
    }
    renderJson() {
        if (!this.refinedCausesSuggestions) {
            return html ``;
        }
        const renderSection = (suggestions, headerText, typeClass) => {
            if (!suggestions || suggestions.length === 0)
                return html ``;
            return html `
        <div class="layout horizontal center-center">
          <div class="suggestionsHeader">${headerText}</div>
        </div>
        <div
          class="layout vertical refinedSuggestions ${typeClass} wrap"
          role="group"
        >
          ${suggestions.map(text => html `
              <label class="layout horizontal refinedContainer">
                <md-checkbox
                  aria-label="${text}"
                  .checked="${this.lastChainCompletedAsValid}"
                  .disabled="${this.lastChainCompletedAsValid}"
                  class="${typeClass}Checkbox"
                  data-type="${typeClass}"
                  touch-target="wrapper"
                ></md-checkbox>
                <div class="labelText">${text}</div>
              </label>
            `)}
        </div>
      `;
        };
        return html `
      ${renderSection(this.refinedCausesSuggestions ?? [], 'Suggested Direct Causes', 'directCause')}

      <div class="layout horizontal center-center">
        <md-filled-button @click="${() => this.addSelected()}">
          ${this.lastChainCompletedAsValid
            ? this.t('Add selected')
            : this.t('Validate selected')}
        </md-filled-button>
      </div>
    `;
    }
};
__decorate([
    property({ type: String })
], LtpAiChatElement.prototype, "parentNodeId", void 0);
__decorate([
    property({ type: String })
], LtpAiChatElement.prototype, "crtId", void 0);
__decorate([
    property({ type: Array })
], LtpAiChatElement.prototype, "refinedCausesSuggestions", void 0);
__decorate([
    property({ type: Boolean })
], LtpAiChatElement.prototype, "lastChainCompletedAsValid", void 0);
__decorate([
    property({ type: Array })
], LtpAiChatElement.prototype, "lastValidateCauses", void 0);
__decorate([
    property({ type: Boolean })
], LtpAiChatElement.prototype, "isCreatingCauses", void 0);
LtpAiChatElement = __decorate([
    customElement('ltp-ai-chat-element')
], LtpAiChatElement);
export { LtpAiChatElement };
//# sourceMappingURL=agent-ai-chat-element.js.map