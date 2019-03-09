import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '../yp-file-upload/yp-file-upload.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <yp-edit-dialog double-width="" id="editDialog" icon="photo-camera" action="[[action]]" title="[[editHeaderText]]" method="[[method]]" save-text="[[saveText]]" next-action-text="[[t('next')]]" toast-text="[[toastText]]" params="[[params]]">
      <div class="layout vertical center-center">
        <yp-file-upload id="imageFileUpload" raised="true" multi="false" method="POST" on-success="_imageUploaded">
          <iron-icon class="icon" icon="photo-camera"></iron-icon>
          <span>[[t('image.upload')]]</span>
        </yp-file-upload>
      </div>

      <paper-input id="photographerName" name="photographerName" type="text" label="[[t('post.photographerName')]]" value="{{image.photographer_name}}" maxlength="60" char-counter="">
      </paper-input>

      <paper-textarea id="description" required="" minlength="1" name="description" value="{{image.description}}" always-float-label="[[image.description]]" label="[[t('post.description')]]" char-counter="" rows="2" max-rows="5" maxlength="200">
      </paper-textarea>

      <input type="hidden" name="uploadedPostUserImageId" value="[[uploadedPostUserImageId]]">
      <input type="hidden" name="oldUploadedPostUserImageId" value="[[oldUploadedPostUserImageId]]">

    </yp-edit-dialog>
`,

  is: 'yp-post-user-image-edit',

  behaviors: [
    ypLanguageBehavior,
    ypEditDialogBehavior
  ],

  properties: {
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
  },

  _postChange: function (newPost) {
    if (newPost) {
      this.$.imageFileUpload.target = '/api/images?itemType=post-user-image&postId='+newPost.id;
    }
  },

  listeners: {
    'iron-form-invalid': '_formInvalid'
  },

  _imageChanged: function (newValue) {
    if (newValue) {
      this.set('oldUploadedPostUserImageId', newValue.id)
    }
  },

  _formInvalid: function () {
    this.set('selected', 0);
    this.$$('#photographerName').autoValidate = true;
    this.$$('#description').autoValidate = true;
  },

  _imageUploaded: function (event, detail) {
    var image = JSON.parse(detail.xhr.response);
    this.set('uploadedPostUserImageId', image.id);
  },

  _clear: function () {
    this.set('uploadedPostUserImageId', null);
    this.$$("#imageFileUpload").clear();
  },

  setup: function (post, image, newNotEdit, refreshFunction) {
    if (image) {
      this.set('image', image);
    } else {
      this.set('image', { description: '' , photographerName: '' })
    }
    if (post) {
      this.set('post', post);
    } else {
      this.set('post', null);
    }
    this.set('new', newNotEdit);
    this.set('refreshFunction', refreshFunction);
    this._setupTranslation();
  },

  _setupTranslation: function () {
    if (this.new) {
      this.editHeaderText = this.t('post.newPhoto');
      this.toastText = this.t('post.photo.toast.added');
    } else {
      this.editHeaderText = this.t('post.photoUpdate');
      this.toastText = this.t('post.photo.toast.updated');
    }
  }
});
