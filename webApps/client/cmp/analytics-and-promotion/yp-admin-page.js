var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { property } from 'lit/decorators.js';
import { YpBaseElementWithLogin } from '../common/yp-base-element-with-login.js';
export class YpAdminPage extends YpBaseElementWithLogin {
}
__decorate([
    property({ type: String })
], YpAdminPage.prototype, "collectionType", void 0);
__decorate([
    property({ type: Number })
], YpAdminPage.prototype, "collectionId", void 0);
__decorate([
    property({ type: Object })
], YpAdminPage.prototype, "collection", void 0);
//# sourceMappingURL=yp-admin-page.js.map