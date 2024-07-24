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
import '@material/web/textfield/filled-text-field.js';
import { PsServerApi } from './PsServerApi.js';
import { YpBaseElement } from '../common/yp-base-element.js';
let PsAddConnectorDialog = class PsAddConnectorDialog extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.open = false;
        this.selectedAgentId = null;
        this.selectedInputOutputType = null;
        this.activeConnectorClasses = [];
        this.selectedConnectorClassId = null;
        this.connectorName = '';
        this.api = new PsServerApi();
    }
    async connectedCallback() {
        super.connectedCallback();
        await this.fetchActiveConnectorClasses();
    }
    async fetchActiveConnectorClasses() {
        try {
            this.activeConnectorClasses = await this.api.getActiveConnectorClasses(this.groupId);
        }
        catch (error) {
            console.error('Error fetching active connector classes:', error);
        }
    }
    disableScrim(event) {
        event.stopPropagation();
        event.preventDefault();
    }
    render() {
        return html `
      <md-dialog ?open="${this.open}" @closed="${this._handleClose}" @cancel="${this.disableScrim}">
        <div slot="headline">${this.selectedInputOutputType == "input" ? "Add Input Connector" : "Add Output Connector"}</div>
        <div slot="content">
          <md-filled-text-field
            label="Connector Name"
            @input="${this._handleNameInput}"
            value="${this.connectorName}"
          ></md-filled-text-field>
          <md-filled-select
            label="Select Connector Class"
            @change="${this._handleConnectorClassSelection}"
          >
            ${this.activeConnectorClasses?.map(connectorClass => html `
                <md-select-option value="${connectorClass.id}">
                  <div slot="headline">${connectorClass.name}</div>
                </md-select-option>
              `)}
          </md-filled-select>
        </div>
        <div slot="actions">
          <md-text-button @click="${this._handleClose}">Cancel</md-text-button>
          <md-filled-button @click="${this._handleAddConnector}"
            >Add Connector</md-filled-button
          >
        </div>
      </md-dialog>
    `;
    }
    _handleNameInput(e) {
        const input = e.target;
        this.connectorName = input.value;
    }
    _handleConnectorClassSelection(e) {
        const select = e.target;
        this.selectedConnectorClassId = Number(select.value);
    }
    _handleClose() {
        this.dispatchEvent(new CustomEvent('close'));
    }
    async _handleAddConnector() {
        if (!this.connectorName ||
            !this.selectedAgentId ||
            !this.selectedConnectorClassId) {
            console.error('Connector name, agent, or connector class not selected');
            return;
        }
        try {
            const newConnector = await this.api.createConnector(this.groupId, this.selectedAgentId, this.selectedConnectorClassId, this.connectorName, this.selectedInputOutputType);
            this.dispatchEvent(new CustomEvent('connector-added', {
                detail: { connector: newConnector },
            }));
            this._handleClose();
        }
        catch (error) {
            console.error('Error creating new connector:', error);
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
    md-filled-text-field,
    md-filled-select {
      width: 100%;
      margin-bottom: 16px;
      margin-top: 16px;
    }
  `
        ];
    }
};
__decorate([
    property({ type: Boolean })
], PsAddConnectorDialog.prototype, "open", void 0);
__decorate([
    property({ type: Number })
], PsAddConnectorDialog.prototype, "selectedAgentId", void 0);
__decorate([
    property({ type: Number })
], PsAddConnectorDialog.prototype, "groupId", void 0);
__decorate([
    property({ type: String })
], PsAddConnectorDialog.prototype, "selectedInputOutputType", void 0);
__decorate([
    state()
], PsAddConnectorDialog.prototype, "activeConnectorClasses", void 0);
__decorate([
    state()
], PsAddConnectorDialog.prototype, "selectedConnectorClassId", void 0);
__decorate([
    state()
], PsAddConnectorDialog.prototype, "connectorName", void 0);
PsAddConnectorDialog = __decorate([
    customElement('ps-add-connector-dialog')
], PsAddConnectorDialog);
export { PsAddConnectorDialog };
//# sourceMappingURL=ps-add-connector-dialog.js.map