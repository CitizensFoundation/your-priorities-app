var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { property } from 'lit/decorators.js';
import { PlausibleBaseElement } from './pl-base-element';
export class PlausibleBaseElementWithState extends PlausibleBaseElement {
}
__decorate([
    property({ type: Object })
], PlausibleBaseElementWithState.prototype, "query", void 0);
__decorate([
    property({ type: Object })
], PlausibleBaseElementWithState.prototype, "site", void 0);
__decorate([
    property({ type: String })
], PlausibleBaseElementWithState.prototype, "proxyUrl", void 0);
__decorate([
    property({ type: String })
], PlausibleBaseElementWithState.prototype, "proxyFaviconBaseUrl", void 0);
__decorate([
    property({ type: Object })
], PlausibleBaseElementWithState.prototype, "timer", void 0);
__decorate([
    property({ type: String })
], PlausibleBaseElementWithState.prototype, "currentUserRole", void 0);
//# sourceMappingURL=pl-base-element-with-state.js.map