var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element';
import '@tinymce/tinymce-webcomponent';
let YpAdminHtmlEditor = class YpAdminHtmlEditor extends YpBaseElement {
    constructor() {
        super(...arguments);
        // Use @property decorator to define properties with their types
        this.data = '<p>Hello from CKEditor 5 with tables!</p>';
        this.configuration = { content: "" };
    }
    firstUpdated(_changedProperties) {
    }
    render() {
        return html `
      <tinymce-editor
      api-key="urd3k008tynb5c494mlomuiacphcx207awaso2c8ggvownkm"
      height="500"
      menubar="false"
      plugins="advlist autolink lists link image charmap print preview anchor
      searchreplace visualblocks code fullscreen
      insertdatetime media table paste code help wordcount"
      toolbar="undo redo | formatselect | bold italic backcolor |
      alignleft aligncenter alignright alignjustify | image | table
      bullist numlist outdent indent | removeformat | help"
      content_style="body
      {
        font-family:Helvetica,Arial,sans-serif;
        font-size:14px
      }"
      >



    </tinymce-editor>
    `;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }
};
__decorate([
    property({ type: String })
], YpAdminHtmlEditor.prototype, "data", void 0);
__decorate([
    property({ type: Object })
], YpAdminHtmlEditor.prototype, "configuration", void 0);
YpAdminHtmlEditor = __decorate([
    customElement('yp-admin-html-editor')
], YpAdminHtmlEditor);
export { YpAdminHtmlEditor };
//# sourceMappingURL=yp-admin-html-editor.js.map