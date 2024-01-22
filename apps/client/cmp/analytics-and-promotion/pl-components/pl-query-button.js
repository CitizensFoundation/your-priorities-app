var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { navigateToQuery, generateQueryString } from './query.js';
import { PlausibleBaseElement } from './pl-base-element.js';
let PlausibleQueryButton = class PlausibleQueryButton extends PlausibleBaseElement {
    constructor() {
        super(...arguments);
        this.disabled = false;
    }
    static get styles() {
        return [
            ...super.styles,
        ];
    }
    render() {
        return html `
      <button
        class="${this.className}"
        @click=${(event) => {
            event.preventDefault();
            navigateToQuery(this.history, this.query, this.to);
            if (this.onClick)
                this.onClick(event);
            this.history.push({
                pathname: window.location.pathname,
                search: generateQueryString(this.to),
            });
        }}
        type="button"
        ?disabled=${this.disabled}
      >
        <slot></slot>
      </button>
    `;
    }
};
__decorate([
    property({ type: Boolean })
], PlausibleQueryButton.prototype, "disabled", void 0);
__decorate([
    property({ type: Object })
], PlausibleQueryButton.prototype, "query", void 0);
__decorate([
    property({ type: Object })
], PlausibleQueryButton.prototype, "onClick", void 0);
__decorate([
    property({ type: Object })
], PlausibleQueryButton.prototype, "history", void 0);
__decorate([
    property({ type: Object })
], PlausibleQueryButton.prototype, "to", void 0);
PlausibleQueryButton = __decorate([
    customElement('pl-query-button')
], PlausibleQueryButton);
export { PlausibleQueryButton };
//# sourceMappingURL=pl-query-button.js.map