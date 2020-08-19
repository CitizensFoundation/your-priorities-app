import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '../yp-file-upload/yp-file-upload.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class YpPostUserImageEditLit extends YpBaseElement {
  static get properties() {
    return {
      new: {
        type: Boolean,
        value: false
      },

      image: {
        type: Object,
        observer: '_imageChanged'
      },

      post: {
        type: Object,
        observer: '_postChange'
      },

      action: {
        type: String,
        value: "/api/images"
      },

      imageUploadTarget: {
        type: String,
        notify: true
      },

      uploadedPostUserImageId: {
        type: String
      },

      oldUploadedPostUserImageId: {
        type: String
      },

      editHeaderText: {
        type: String
      },

      saveText: {
        type: String
      },

      method: {
        type: String
      }
    }
  }

  static get styles() {
    return [YpFlexLayout]
  }


  render() {
    return html`
    <yp-edit-dialog ?doubleWidth id="editDialog" .icon="photo-camera" .action="${this.action}" .title="${this.editHeaderText}" method="${this.method}" .saveText="${this.saveText}" .nextActionText="${this.t('next')}" .toastText="${this.toastText}" .params="${this.params}">
      <div class="layout vertical center-center">
        <yp-file-upload id="imageFileUpload" raised method="POST" @success="${this._imageUploaded}">
          <iron-icon class="icon" .icon="photo-camera"></iron-icon>
          <span>${this.t('image.upload')}</span>
        </yp-file-upload>
      </div>

    <paper-input id="photographerName" .name="photographerName" .type="text" .label="${this.t('post.photographerName')}" value="${this.image.photographer_name}" maxlength="60" char-counter="">
    </paper-input>

    <paper-textarea id="description" required .minlength="1" .name="description" .value="${this.image.description}" always-float-label="${this.image.description}" label="${this.t('post.description')}" charCounter .rows="2" .max-rows="5" .maxlength="200">
    </paper-textarea>

    <input .type="hidden" .name="uploadedPostUserImageId" .value="${this.uploadedPostUserImageId}">
    <input .type="hidden" .name="oldUploadedPostUserImageId" .value="${this.oldUploadedPostUserImageId}">

    </yp-edit-dialog>
    `
  }


/*
  behaviors: [
    ypEditDialogBehavior
  ],
*/

  _postChange(newPost) {
    if (newPost) {
      this.$$("#imageFileUpload").target = '/api/images?itemType=post-user-image&postId='+newPost.id;
    }
  }
/*
  listeners: {
    'iron-form-invalid': '_formInvalid'
  },
*/
  _imageChanged(newValue) {
    if (newValue) {
      this.oldUploadedPostUserImageId = newValue.id
    }
  }

  _formInvalid() {
    this.selected = 0;
    this.$$('#photographerName').autoValidate = true;
    this.$$('#description').autoValidate = true;
  }

  _imageUploaded(event, detail) {
    const image = JSON.parse(detail.xhr.response);
    this.uploadedPostUserImageId = image.id;
  }

  _clear() {
    this.uploadedPostUserImageId = null;
    this.$$("#imageFileUpload").clear();
  }

  setup(post, image, newNotEdit, refreshFunction) {
    if (image) {
      this.image = image;
    } else {
      this.image = { description: '' , photographerName: '' }
    }
    if (post) {
      this.post = post;
    } else {
      this.post = null;
    }
    this.new = newNotEdit;
    this.refreshFunction = refreshFunction;
    this._setupTranslation();
  }

  _setupTranslation() {
    if (this.new) {
      this.editHeaderText = this.t('post.newPhoto');
      this.toastText = this.t('post.photo.toast.added');
    } else {
      this.editHeaderText = this.t('post.photoUpdate');
      this.toastText = this.t('post.photo.toast.updated');
    }
  }
}

window.customElements.define('yp-post-user-image-edit-lit', YpPostUserImageEditLit)
