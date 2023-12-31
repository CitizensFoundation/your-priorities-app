var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import { YpFileUpload } from './yp-file-upload.js';
let YpFileUploadIcon = class YpFileUploadIcon extends YpFileUpload {
    constructor() {
        super(...arguments);
        this.buttonIcon = 'file_upload';
    }
    static get styles() {
        return [super.styles, css ``];
    }
    render() {
        return html `
      <md-outlined-icon-button
        id="button"
        .icon="${this.buttonIcon}"
        class="blue"
        ?raised="${this.raised}"
        .label="${this.buttonText}"
        @click="${this._fileClick}"
      >
      </md-outlined-icon-button>
      <input
        type="file"
        id="fileInput"
        ?capture="${this.capture}"
        @change="${this._fileChange}"
        .accept="${this.accept}"
        hidden
        ?multiple="${this.multi}"
      />
    `;
    }
};
__decorate([
    property({ type: String })
], YpFileUploadIcon.prototype, "buttonIcon", void 0);
YpFileUploadIcon = __decorate([
    customElement('yp-file-upload-icon')
], YpFileUploadIcon);
export { YpFileUploadIcon };
//# sourceMappingURL=yp-file-upload-icon.js.map