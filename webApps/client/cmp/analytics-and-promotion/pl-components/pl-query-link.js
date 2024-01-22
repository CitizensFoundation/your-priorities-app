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
import './pl-link.js';
let PlausibleQueryLink = class PlausibleQueryLink extends PlausibleBaseElement {
    constructor() {
        super();
        this.onClickFunction = this.onClick.bind(this);
    }
    onClick(e) {
        e.preventDefault();
        navigateToQuery(this.history, this.query, this.to);
        //TODO Look into this
        if (this.onClickFunction)
            this.onClickFunction(e);
    }
    static get styles() {
        return [...super.styles];
    }
    render() {
        return html `
      <pl-link
        .history=${this.history}
        .query=${this.query}
        .to=${{
            pathname: window.location.pathname,
            search: generateQueryString(this.to),
        }}
        ><slot></slot></pl-link>
    `;
    }
};
__decorate([
    property({ type: Object })
], PlausibleQueryLink.prototype, "onClickFunction", void 0);
__decorate([
    property({ type: Object })
], PlausibleQueryLink.prototype, "query", void 0);
__decorate([
    property({ type: Object })
], PlausibleQueryLink.prototype, "to", void 0);
__decorate([
    property({ type: Object })
], PlausibleQueryLink.prototype, "history", void 0);
PlausibleQueryLink = __decorate([
    customElement('pl-query-link')
], PlausibleQueryLink);
export { PlausibleQueryLink };
//# sourceMappingURL=pl-query-link.js.map