var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../yp-file-upload/yp-file-upload.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import '@material/web/textfield/outlined-text-field.js';
import { YpEditBase } from '../common/yp-edit-base.js';
let YpPostUserImageEdit = class YpPostUserImageEdit extends YpEditBase {
    constructor() {
        super(...arguments);
        this.new = false;
        this.action = '/images';
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('image')) {
            this._imageChanged();
        }
        if (changedProperties.has('post')) {
            this._postChanged();
        }
    }
    render() {
        return html `
      <yp-edit-dialog
        doubleWidth
        id="editDialog"
        icon="photo_camera"
        .action="${this.action}"
        .title="${this.editHeaderText}"
        .method="${this.method}"
        .saveText="${this.saveText}"
        .nextActionText="${this.t('next')}"
        .toastText="${this.snackbarText}"
        .params="${this.params}">
        ${this.image
            ? html `
              <div class="layout vertical center-center">
                <yp-file-upload
                  id="imageFileUpload"
                  raised
                  .buttonText="${this.t('image.upload')}"
                  buttonIcon="photo_camera"
                  method="POST"
                  @success="${this._imageUploaded}">
                </yp-file-upload>
              </div>

              <md-outlined-text-field
                id="photographerName"
                name="photographerName"
                type="text"
                .label="${this.t('post.photographerName')}"
                .value="${this.image.photographer_name || ''}"
                maxlength="60"
                char-counter="">
              </-outlined-text-field>

              <md-outlined-text-field
              type="textarea"
                id="description"
                required
                minlength="1"
                name="description"
                .value="${this.image.description || ''}"
                .label="${this.t('post.description')}"
                charCounter
                rows="2"
                maxrows="5"
                maxlength="200">
              </md-outlined-text-field>

              <input
                type="hidden"
                name="uploadedPostUserImageId"
                .value="${this.uploadedPostUserImageId}" />

              <input
                type="hidden"
                name="oldUploadedPostUserImageId"
                .value="${this.oldUploadedPostUserImageId}" />
            `
            : nothing}
      </yp-edit-dialog>
    `;
    }
    _postChanged() {
        if (this.post) {
            this.$$('#imageFileUpload').target =
                '/api/images?itemType=post-user-image&postId=' + this.post.id;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.addListener('yp-form-invalid', this._formInvalid);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeListener('yp-form-invalid', this._formInvalid);
    }
    _imageChanged() {
        if (this.image) {
            this.oldUploadedPostUserImageId = this.image.id;
        }
    }
    _formInvalid() {
        //(this.$$('#photographerName') as TextField).autoValidate = true;
        //(this.$$('#description') as TextField).autoValidate = true;
    }
    _imageUploaded(event) {
        const image = JSON.parse(event.detail.xhr.response);
        this.uploadedPostUserImageId = image.id;
    }
    clear() {
        this.uploadedPostUserImageId = undefined;
        this.$$('#imageFileUpload').clear();
    }
    setup(post, image, newNotEdit, refreshFunction) {
        if (image) {
            this.image = image;
        }
        else {
            this.image = {
                description: '',
                photographerName: '',
            };
        }
        if (post) {
            this.post = post;
        }
        else {
            this.post = undefined;
        }
        this.new = newNotEdit;
        this.refreshFunction = refreshFunction;
        this.setupTranslation();
    }
    setupTranslation() {
        if (this.new) {
            this.editHeaderText = this.t('post.newPhoto');
            this.snackbarText = this.t('post.photo.toast.added');
        }
        else {
            this.editHeaderText = this.t('post.photoUpdate');
            this.snackbarText = this.t('post.photo.toast.updated');
        }
    }
};
__decorate([
    property({ type: Object })
], YpPostUserImageEdit.prototype, "image", void 0);
__decorate([
    property({ type: Object })
], YpPostUserImageEdit.prototype, "post", void 0);
__decorate([
    property({ type: Boolean })
], YpPostUserImageEdit.prototype, "new", void 0);
__decorate([
    property({ type: String })
], YpPostUserImageEdit.prototype, "action", void 0);
__decorate([
    property({ type: Number })
], YpPostUserImageEdit.prototype, "uploadedPostUserImageId", void 0);
__decorate([
    property({ type: Number })
], YpPostUserImageEdit.prototype, "oldUploadedPostUserImageId", void 0);
YpPostUserImageEdit = __decorate([
    customElement('yp-post-user-image-edit')
], YpPostUserImageEdit);
export { YpPostUserImageEdit };
//# sourceMappingURL=yp-post-user-image-edit.js.map