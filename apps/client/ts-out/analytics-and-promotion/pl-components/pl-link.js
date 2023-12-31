var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { PlausibleBaseElement } from './pl-base-element';
let PlausibleLink = class PlausibleLink extends PlausibleBaseElement {
    constructor() {
        super(...arguments);
        this.to = undefined;
    }
    static get styles() {
        return [
            ...super.styles,
            css `
        :host {
          padding-top: 0.4rem;
          padding-bottom: 0.4rem;
        }
      `,
        ];
    }
    get currentUri() {
        return `${location.pathname}?${this.to.search}`;
    }
    onClick(e) {
        e.preventDefault();
        window.history.pushState({}, '', this.currentUri);
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('popstate'));
        });
        //window.history.forward();
    }
    render() {
        return html `<a href="${this.currentUri}" @click="${this.onClick}"
      ><slot></slot
    ></a> `;
    }
};
__decorate([
    property({ type: String })
], PlausibleLink.prototype, "to", void 0);
PlausibleLink = __decorate([
    customElement('pl-link')
], PlausibleLink);
export { PlausibleLink };
//# sourceMappingURL=pl-link.js.map