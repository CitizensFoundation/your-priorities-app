import { css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '../yp-file-upload/yp-file-upload.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import '../common/yp-image.js';
import '@material/web/textfield/outlined-text-field.js';

import { ShadowStyles } from '../common/ShadowStyles.js';
import { YpMediaHelpers } from '../common/YpMediaHelpers.js';
import { YpEditBase } from '../common/yp-edit-base.js';
import { YpFileUpload } from '../yp-file-upload/yp-file-upload.js';
import { YpEditDialog } from '../yp-edit-dialog/yp-edit-dialog.js';
import { YpForm } from '../common/yp-form.js';

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

  @property({ type: Boolean })
  imageMissing = false;

  static override get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        .imagePreview {
          width: min(400px, 100%);
          height: 300px;
          margin: 8px 0 16px;
          background-color: var(--md-sys-color-surface-container);
        }

        .imageRequiredError {
          color: var(--md-sys-color-error);
          font-size: 14px;
          margin: 0 0 8px;
        }

        md-outlined-text-field {
          width: min(432px, calc(100% - 32px));
          margin: 8px 16px;
        }

        [hidden] {
          display: none !important;
        }
      `,
    ];
  }

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
        .heading="${this.editHeaderText || ''}"
        .method="${this.method}"
        .saveText="${this.saveText}"
        .nextActionText="${this.t('next')}"
        .snackbarText="${this.snackbarText}"
        .customValidationFunction="${this._validateForm}"
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
                  replaceFilesOnSelect
                  @success="${this._imageUploaded}">
                </yp-file-upload>
                <div
                  class="imageRequiredError"
                  role="alert"
                  ?hidden="${!this.imageMissing}">
                  ${this.t('post.formInvalid')}
                </div>
                ${this.imagePreviewUrl
                  ? html`
                      <yp-image
                        class="imagePreview"
                        sizing="contain"
                        .alt="${
                          this.image.description || this.t('post.newPhoto')
                        }"
                        .title="${
                          this.image.description || this.t('post.newPhoto')
                        }"
                        src="${this.imagePreviewUrl}">
                      </yp-image>
                    `
                  : nothing}
              </div>

              <md-outlined-text-field
                id="photographerName"
                name="photographerName"
                type="text"
                .label="${this.t('post.photographerName')}"
                .value="${this.image.photographer_name || ''}"
                maxlength="60">
              </md-outlined-text-field>

              <md-outlined-text-field
                type="textarea"
                id="description"
                required
                minlength="1"
                name="description"
                .value="${this.image.description || ''}"
                .label="${this.t('post.description')}"
                rows="2"
                maxlength="200">
              </md-outlined-text-field>

              <input
                type="hidden"
                name="uploadedPostUserImageId"
                .value="${this.uploadedPostUserImageId?.toString() || ''}" />

              <input
                type="hidden"
                name="oldUploadedPostUserImageId"
                .value="${this.oldUploadedPostUserImageId?.toString() || ''}" />
            `
          : nothing}
      </yp-edit-dialog>
    `;
  }

  _postChanged() {
    if (this.post) {
      const imageFileUpload = this.$$('#imageFileUpload') as YpFileUpload | null;
      if (imageFileUpload) {
        imageFileUpload.target =
          '/api/images?itemType=post-user-image&postId=' + this.post.id;
      }
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
      if (this.image.id) {
        this.imagePreviewUrl = YpMediaHelpers.getImageFormatUrl([this.image]);
      }
    } else {
      this.oldUploadedPostUserImageId = undefined;
      this.imagePreviewUrl = undefined;
    }
  }

  _formInvalid() {
    //(this.$$('#photographerName') as TextField).autoValidate = true;
    //(this.$$('#description') as TextField).autoValidate = true;
  }

  _imageUploaded(event: CustomEvent) {
    const image = JSON.parse(event.detail.xhr.response);
    this.uploadedPostUserImageId = image.id;
    this.imagePreviewUrl = YpMediaHelpers.getImageFormatUrl([image]);
    this.imageMissing = false;
  }

  private _validateForm = () => {
    const editDialog = this.$$('#editDialog') as YpEditDialog;
    const form = editDialog.getForm() as YpForm | null;
    const formIsValid = form?.validate() || false;
    const hasImage = Boolean(
      this.uploadedPostUserImageId ||
        (!this.new && this.oldUploadedPostUserImageId)
    );

    this.imageMissing = !hasImage;
    return formIsValid && hasImage;
  };

  clear() {
    this.uploadedPostUserImageId = undefined;
    this.oldUploadedPostUserImageId = undefined;
    this.imagePreviewUrl = undefined;
    this.imageMissing = false;
    (this.$$('#imageFileUpload') as YpFileUpload | null)?.clear();
  }

  setup(
    post: YpPostData,
    image: YpImageData | undefined,
    newNotEdit: boolean,
    refreshFunction: Function
  ) {
    this.uploadedPostUserImageId = undefined;
    this.oldUploadedPostUserImageId = undefined;
    this.imagePreviewUrl = undefined;
    this.imageMissing = false;
    (this.$$('#imageFileUpload') as YpFileUpload | null)?.clear(true);

    if (image) {
      this.image = image;
      this.oldUploadedPostUserImageId = image.id;
      this.imagePreviewUrl = YpMediaHelpers.getImageFormatUrl([image]);
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
