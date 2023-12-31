var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
let PlausibleFadeIn = class PlausibleFadeIn extends LitElement {
    constructor() {
        super(...arguments);
        this.show = false;
    }
    render() {
        return html `
      <div
        class="${`${this.myClassName || ''} ${this.show ? 'fade-enter-active' : 'fade-enter'}`}"
      >
        <slot></slot>
      </div>
    `;
    }
};
__decorate([
    property({ type: Boolean })
], PlausibleFadeIn.prototype, "show", void 0);
__decorate([
    property({ type: String })
], PlausibleFadeIn.prototype, "myClassName", void 0);
PlausibleFadeIn = __decorate([
    customElement('pl-fade-in')
], PlausibleFadeIn);
export { PlausibleFadeIn };
//# sourceMappingURL=pl-fade-in.js.map