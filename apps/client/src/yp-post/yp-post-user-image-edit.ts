import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';

import '../yp-file-upload/yp-file-upload.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import '@material/web/textfield/outlined-text-field.js';

import { ShadowStyles } from '../common/ShadowStyles.js';
import { YpMediaHelpers } from '../common/YpMediaHelpers.js';
import { YpApiActionDialog } from '../yp-api-action-dialog/yp-api-action-dialog.js';
import { YpAccessHelpers } from '../common/YpAccessHelpers.js';
import { YpEditBase } from '../common/yp-edit-base.js';
import { YpFileUpload } from '../yp-file-upload/yp-file-upload.js';
import { TextField } from '@material/web/textfield/internal/text-field.js';

@customElement('yp-post-user-image-edit')
export class YpPostUserImageEdit extends YpEditBase {
  @property({ type: Object })
  image: YpImageData | undefined;

  @property({ type: Object })
  post: YpPostData | undefined;

  @property({ type: Boolean })
  override new = false;

  @property({ type: String })
  action = '/images';

  @property({ type: Number })
  uploadedPostUserImageId: number | undefined;

  @property({ type: Number })
  oldUploadedPostUserImageId: number | undefined;

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('image')) {
      this._imageChanged();
    }

    if (changedProperties.has('post')) {
      this._postChanged();
    }
  }

  override render() {
    return html`
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
          ? html`
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
      (this.$$('#imageFileUpload') as YpFileUpload).target =
        '/api/images?itemType=post-user-image&postId=' + this.post.id;
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addListener('yp-form-invalid', this._formInvalid);
  }

  override disconnectedCallback() {
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

  _imageUploaded(event: CustomEvent) {
    const image = JSON.parse(event.detail.xhr.response);
    this.uploadedPostUserImageId = image.id;
  }

  clear() {
    this.uploadedPostUserImageId = undefined;
    (this.$$('#imageFileUpload') as YpFileUpload).clear();
  }

  setup(
    post: YpPostData,
    image: YpImageData | undefined,
    newNotEdit: boolean,
    refreshFunction: Function
  ) {
    if (image) {
      this.image = image;
    } else {
      this.image = ({
        description: '',
        photographerName: '',
      } as unknown) as YpImageData;
    }
    if (post) {
      this.post = post;
    } else {
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
    } else {
      this.editHeaderText = this.t('post.photoUpdate');
      this.snackbarText = this.t('post.photo.toast.updated');
    }
  }
}
