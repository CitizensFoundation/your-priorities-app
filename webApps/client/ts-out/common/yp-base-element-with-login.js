var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { property } from 'lit/decorators.js';
import { YpBaseElement } from './yp-base-element.js';
export class YpBaseElementWithLogin extends YpBaseElement {
    constructor() {
        super();
        if (window.appUser && window.appUser.user) {
            this.loggedInUser = window.appUser.user;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.addGlobalListener('yp-logged-in', this._loggedIn.bind(this));
        this.addGlobalListener('yp-got-admin-rights', this.requestUpdate.bind(this));
    }
    disconnectedCallback() {
        super.connectedCallback();
        this.removeGlobalListener('yp-logged-in', this._loggedIn.bind(this));
        this.removeGlobalListener('yp-got-admin-rights', this.requestUpdate.bind(this));
    }
    get isLoggedIn() {
        return this.loggedInUser != undefined;
    }
    _loggedIn(event) {
        this.loggedInUser = event.detail;
        this.requestUpdate();
    }
}
__decorate([
    property({ type: Object })
], YpBaseElementWithLogin.prototype, "loggedInUser", void 0);
//# sourceMappingURL=yp-base-element-with-login.js.map