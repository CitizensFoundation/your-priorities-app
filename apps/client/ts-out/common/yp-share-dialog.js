var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { YpBaseElement } from './yp-base-element.js';
//import 'share-menu';
//import { ShareMenu } from 'share-menu';
let YpShareDialog = class YpShareDialog extends YpBaseElement {
    render() {
        return html `
      <share-menu
        @share="${this.sharedContent}"
        class="shareIcon"
        id="shareButton"
        .title="${this.t('post.shareInfo')}"
        .url="${this.url || ''}"
      ></share-menu>
    `;
    }
    async open(url, label, sharedContent) {
        this.url = url;
        this.label = label;
        this.sharedContent = sharedContent;
        await this.requestUpdate();
        this.$$('#shareButton') /*ShareMenu*/.buttons = [
            'clipboard',
            'facebook',
            'twitter',
            'whatsapp',
            'email',
            'linkedin',
        ];
        this.$$('#shareButton') /*ShareMenu*/.share();
    }
};
__decorate([
    property({ type: Object })
], YpShareDialog.prototype, "sharedContent", void 0);
__decorate([
    property({ type: String })
], YpShareDialog.prototype, "url", void 0);
__decorate([
    property({ type: String })
], YpShareDialog.prototype, "label", void 0);
YpShareDialog = __decorate([
    customElement('yp-share-dialog')
], YpShareDialog);
export { YpShareDialog };
//# sourceMappingURL=yp-share-dialog.js.map