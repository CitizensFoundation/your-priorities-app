var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { YpBaseElement } from './yp-base-element.js';
import { property } from 'lit/decorators.js';
export class YpEditBase extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.new = true;
        this.method = 'POST';
    }
    customRedirect(unknown) {
        // For subclassing
    }
    setupAfterOpen(params) {
        // For subclassing
    }
    customFormResponse(event) {
        // For subclassing
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('new')) {
            this._setupNewUpdateState();
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.addListener('yp-form-response', this._formResponse.bind(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeListener('yp-form-response', this._formResponse.bind(this));
    }
    _logoImageUploaded(event) {
        const image = JSON.parse(event.detail.xhr.response);
        this.uploadedLogoImageId = image.id;
        this.imagePreviewUrl = image.url;
    }
    _headerImageUploaded(event) {
        const image = JSON.parse(event.detail.xhr.response);
        this.uploadedHeaderImageId = image.id;
    }
    _defaultDataImageUploaded(event) {
        const image = JSON.parse(event.detail.xhr.response);
        this.uploadedDefaultDataImageId = image.id;
    }
    _defaultPostImageUploaded(event) {
        const image = JSON.parse(event.detail.xhr.response);
        this.uploadedDefaultPostImageId = image.id;
    }
    _formResponse(event) {
        if (typeof this.customRedirect == 'function') {
            this.customRedirect(event.detail);
        }
        if (typeof this.refreshFunction == 'function') {
            this.refreshFunction(event.detail);
        }
        if (event &&
            event.detail &&
            event.detail.isError) {
            console.log('Not clearing form because of user error');
        }
        else {
            this.clear();
        }
        this.customFormResponse(event);
    }
    _setupNewUpdateState() {
        if (this.new) {
            this.saveText = this.t('create');
            this.method = 'POST';
        }
        else {
            this.saveText = this.t('update');
            this.method = 'PUT';
        }
        this.setupTranslation();
    }
    async open(newItem, params) {
        if (window.appUser && window.appUser.loggedIn() === true) {
            if (newItem) {
                this.new = true;
            }
            else {
                this.new = false;
            }
            if (params)
                this.params = params;
            if (typeof this.setupAfterOpen === 'function') {
                this.setupAfterOpen(params);
            }
            await this.updateComplete;
            this.$$("#editDialog").open();
        }
        else {
            window.appUser.loginForEdit(this, newItem, params, this.refreshFunction);
        }
    }
    close() {
        this.$$("#editDialog").close();
    }
}
__decorate([
    property({ type: Boolean })
], YpEditBase.prototype, "new", void 0);
__decorate([
    property({ type: String })
], YpEditBase.prototype, "editHeaderText", void 0);
__decorate([
    property({ type: String })
], YpEditBase.prototype, "saveText", void 0);
__decorate([
    property({ type: String })
], YpEditBase.prototype, "snackbarText", void 0);
__decorate([
    property({ type: Object })
], YpEditBase.prototype, "params", void 0);
__decorate([
    property({ type: String })
], YpEditBase.prototype, "method", void 0);
__decorate([
    property({ type: Object })
], YpEditBase.prototype, "refreshFunction", void 0);
//# sourceMappingURL=yp-edit-base.js.map