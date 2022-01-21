import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import '../yp-file-upload/yp-file-upload.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpCategoryEditLit extends YpBaseElement {
  static get properties() {
    return {
      action: {
        type: String,
        value: "/api/categories"
      },

      category: {
        type: Object
      },

      group: {
        type: Object
      },

      categoryAccess: {
        type: String
      },

      params: {
        type: String
      },

      method: {
        type: String
      },

      uploadedIconImageId: {
        type: String
      },

      uploadedHeaderImageId: {
        type: String
      }
    }
  }

  render() {
    return html`
    <yp-edit-dialog .name="categoryEdit" id="editDialog" .title="${this.editHeaderText}" .icon="add" .action="${this.action}" .method="${this.method}" .params="${this.params}" .saveText="${this.saveText}" .toastText="${this.toastText}">
      <paper-input id="name" .name="name" .type="text" .label="${this.t('Name')}" .value="${this.category.name}" .maxlength="60" char-counter>
      </paper-input>

      <paper-textarea id="description" .name="description" .value="${this.category.description}" .alwaysFloatLabel="${this.category.description}" .label="${this.t('Description')}" char-counter .rows="2" .max-rows="5" .maxlength="300">
      </paper-textarea>

      <div class="layout vertical additionalSettings">
        <yp-file-upload id="iconImageUpload" droppable raised .target="/api/images?itemType=category-icon" .method="POST" @success="${this._iconImageUploaded}">
          <iron-icon class="icon" icon="photo-camera"></iron-icon>
          <span>${this.t('image.icon.upload')}</span>
        </yp-file-upload>
      </div>

      <div class="layout vertical additionalSettings" hidden="">
        <yp-file-upload id="headerImageUpload" droppable raised .target="/api/images?itemType=category-header" .method="POST" @success="${this._headerImageUploaded}">
          <iron-icon class="icon" .icon="photo-camera"></iron-icon>
          <span>${this.t('image.header.upload')}</span>
        </yp-file-upload>
      </div>

      <input .type="hidden" .name="uploadedIconImageId" .value="${this.uploadedIconImageId}">
      <input .type="hidden" .name="uploadedHeaderImageId" .value="${this.uploadedHeaderImageId}">

    </yp-edit-dialog>
`
  }

/*
  behaviors: [
    ypEditDialogBehavior
  ],
*/

  _iconImageUploaded(event, detail) {
    const image = JSON.parse(detail.xhr.response);
    this.uploadedIconImageId = image.id;
  }

  _headerImageUploaded(event, detail) {
    const image = JSON.parse(detail.xhr.response);
    this.uploadedHeaderImageId = image.id;
  }

  setup(group, newNotEdit, refreshFunction, category) {
    this.group = group;
    this.new = newNotEdit;
    this.refreshFunction = refreshFunction;
    if (category) {
      this.category = category;
    }
    this._setupTranslation();
    this._setupNewUpdateState();
  }

  _clear() {
    this.category = { name: '', description: '' };
    this.uploadedIconImageId = null;
    this.uploadedHeaderImageId = null;
    this.$$("#headerImageUpload").clear();
    this.$$("#iconImageUpload").clear();
  }

  _setupTranslation() {
    if (this.new) {
      this.editHeaderText = this.t('New category');
      this.toastText = this.t('category.toast.created');
    } else {
      this.editHeaderText = this.t('Update category info');
      this.toastText = this.t('category.toast.updated');
    }
  }
}

window.customElements.define('yp-category-edit-lit', YpCategoryEditLit)