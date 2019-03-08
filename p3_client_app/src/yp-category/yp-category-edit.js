import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-input/paper-input.js';
import '../../../../@polymer/paper-input/paper-textarea.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-file-upload/yp-file-upload.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <yp-edit-dialog name="categoryEdit" id="editDialog" title="[[editHeaderText]]" icon="add" action="[[action]]" method="[[method]]" params="[[params]]" save-text="[[saveText]]" toast-text="[[toastText]]">
      <paper-input id="name" name="name" type="text" label="[[t('Name')]]" value="{{category.name}}" maxlength="60" char-counter="">
      </paper-input>

      <paper-textarea id="description" name="description" value="{{category.description}}" always-float-label="[[category.description]]" label="[[t('Description')]]" char-counter="" rows="2" max-rows="5" maxlength="300">
      </paper-textarea>

      <div class="layout vertical additionalSettings">
        <yp-file-upload id="iconImageUpload" droppable="true" raised="true" multi="false" target="/api/images?itemType=category-icon" method="POST" on-success="_iconImageUploaded">
          <iron-icon class="icon" icon="photo-camera"></iron-icon>
          <span>[[t('image.icon.upload')]]</span>
        </yp-file-upload>
      </div>

      <div class="layout vertical additionalSettings" hidden="">
        <yp-file-upload id="headerImageUpload" droppable="true" raised="true" multi="false" target="/api/images?itemType=category-header" method="POST" on-success="_headerImageUploaded">
          <iron-icon class="icon" icon="photo-camera"></iron-icon>
          <span>[[t('image.header.upload')]]</span>
        </yp-file-upload>
      </div>

      <input type="hidden" name="uploadedIconImageId" value="[[uploadedIconImageId]]">
      <input type="hidden" name="uploadedHeaderImageId" value="[[uploadedHeaderImageId]]">

    </yp-edit-dialog>
`,

  is: 'yp-category-edit',

  behaviors: [
    ypLanguageBehavior,
    ypEditDialogBehavior
  ],

  properties: {

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
  },

  _iconImageUploaded: function (event, detail) {
    var image = JSON.parse(detail.xhr.response);
    this.set('uploadedIconImageId', image.id);
  },

  _headerImageUploaded: function (event, detail) {
    var image = JSON.parse(detail.xhr.response);
    this.set('uploadedHeaderImageId', image.id);
  },

  setup: function (group, newNotEdit, refreshFunction, category) {
    this.set('group', group);
    this.set('new', newNotEdit);
    this.set('refreshFunction', refreshFunction);
    if (category) {
      this.set('category', category);
    }
    this._setupTranslation();
    this._setupNewUpdateState();
  },

  _clear: function () {
    this.set('category', { name: '', description: '' });
    this.set('uploadedIconImageId', null);
    this.set('uploadedHeaderImageId', null);
    this.$.headerImageUpload.clear();
    this.$.iconImageUpload.clear();
  },

  _setupTranslation: function () {
    if (this.new) {
      this.editHeaderText = this.t('New category');
      this.toastText = this.t('category.toast.created');
    } else {
      this.editHeaderText = this.t('Update category info');
      this.toastText = this.t('category.toast.updated');
    }
  }
});
