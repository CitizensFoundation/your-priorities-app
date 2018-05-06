import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-input/paper-input.js';
import '../../../../@polymer/paper-radio-button/paper-radio-button.js';
import '../../../../@polymer/paper-radio-group/paper-radio-group.js';
import '../../../../@polymer/paper-input/paper-textarea.js';
import '../../../../@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../../../@polymer/paper-listbox/paper-listbox.js';
import '../../../../@polymer/paper-item/paper-item.js';
import '../../../../@polymer/paper-tabs/paper-tab.js';
import '../../../../@polymer/paper-checkbox/paper-checkbox.js';
import '../../../../@polymer/paper-tabs/paper-tabs.js';
import '../../../../@polymer/neon-animation/neon-animated-pages.js';
import '../../../../@polymer/neon-animation/neon-animatable.js';
import '../../../../@polymer/neon-animation/neon-animation.js';
import '../yp-file-upload/yp-file-upload.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-behaviors/emoji-selector.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import './yp-post-location.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';

Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      .access {
        @apply --layout-horizontal;
        @apply --layout-center-justified;
      }

      paper-button {
        background-color: var(--accent-color);
        color: #FFF;
      }

      yp-file-upload {
        margin-top: 16px;
      }

      .accessHeader {
        color: var(--primary-color,#777);
        font-weight: normal;
        margin-bottom: 0;
      }

      paper-radio-button {
        display: block;
      }

      .container {
        width: 100%;
        width: 100%;
      }

      yp-post-location {
        min-height: 320px;
      }

      @media (max-width: 600px) {
        .container {
          padding-right: 16px;
        }

        .subContainer {
        }

        paper-tab {
          font-size: 12px;
        }
      }

      yp-post-location {
      }

      section {
        margin-top: 32px;
      }

      .imageSizeInfo {
        font-size: 12px;
        padding-bottom: 16px;
        color: #444;
      }

      paper-dropdown-menu {
        max-width: 250px;
      }

      .optional {
        font-size: 12px;
      }

      .icon {
        padding-right: 8px;
      }

      [hidden] {
        display: none !important;
      }

      paper-checkbox {
        margin-left: 8px;
        margin-top: 4px;
      }

      section {
        width: 100%;
      }

      .contactInfo {
        margin-top: 16px;
      }

      #description {
        --paper-input-container-input:{
          max-height: 125px;
        }
      }

      .postEmoji {
        margin-left: 16px;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <yp-edit-dialog name="postEdit" double-width="" id="editDialog" icon="lightbulb-outline" action="[[action]]" use-next-tab-action="[[newPost]]" on-next-tab-action="_nextTab" method="[[method]]" title="[[editHeaderText]]" save-text="[[saveText]]" class="container" next-action-text="[[t('next')]]" toast-text="[[toastText]]" params="[[params]]">
      <paper-tabs selected="{{selected}}" id="paperTabs" focused="">
        <paper-tab><span>[[t('post.yourPost')]]</span></paper-tab>
        <template is="dom-if" restamp="" if="[[newPost]]">
          <paper-tab>
            <div class="layout vertical center-center">
              <div>
                [[t('post.yourPoint')]]
              </div>
              <div class="optional" hidden\$="[[!group.configuration.newPointOptional]]">
                [[t('optional')]]
              </div>
            </div>
          </paper-tab>
        </template>
        <template is="dom-if" if="[[!locationHidden]]" restamp="">
          <paper-tab>[[t('post.location')]]</paper-tab>
        </template>
        <paper-tab>[[t('post.photo')]]</paper-tab>
      </paper-tabs>

      <div class="layout vertical wrap">
        <iron-pages id="pages" class="layout horizontal" selected="[[selected]]">
          <section>
            <div class="layout vertical flex">

              <paper-input id="name" required="" minlength="3" name="name" type="text" label="[[t('title')]]" value="{{post.name}}" maxlength="60" char-counter="">
              </paper-input>

              <template is="dom-if" if="[[_showCategories(group)]]" restamp="">
                <paper-dropdown-menu label="[[t('category.select')]]">
                  <paper-listbox slot="dropdown-content" selected="{{selectedCategoryArrayId}}">
                    <template is="dom-repeat" items="[[group.Categories]]" as="category">
                      <paper-item data-category-id\$="[[category.id]]">[[category.name]]</paper-item>
                    </template>
                  </paper-listbox>
                </paper-dropdown-menu>
                <input type="hidden" name="categoryId" value="[[selectedCategoryId]]">
              </template>

              <template is="dom-if" if="[[postDescriptionLimit]]">
                <paper-textarea id="description" required="" minlength="3" name="description" value="{{post.description}}" always-float-label="[[post.description]]" label="[[t('post.description')]]" char-counter="" rows="2" max-rows="5" maxrows="5" maxlength="[[postDescriptionLimit]]">
                </paper-textarea>

                <div class="horizontal end-justified layout postEmoji" hidden\$="[[group.configuration.hideEmoji]]">
                  <emoji-selector id="emojiSelectorDescription"></emoji-selector>
                </div>
              </template>

              <template is="dom-if" if="[[group.configuration.attachmentsEnabled]]">
                <yp-file-upload id="attachmentFileUpload" raised="true" multi="false" target="/api/groups/[[group.id]]/upload_document" method="POST" on-success="_documentUploaded">
                  <iron-icon class="icon" icon="attach-file"></iron-icon>
                  <span>[[t('uploadAttachment')]]</span>
                </yp-file-upload>
                <template is="dom-if" if="[[post.data.attachment.url]]">
                  <paper-checkbox name="deleteAttachment">[[t('deleteAttachment')]]: [[post.data.attachment.filename]]</paper-checkbox>
                </template>
              </template>
              <template is="dom-if" if="[[group.configuration.moreContactInformation]]">
                <h2 class="contactInfo">[[t('contactInformation')]]</h2>
                <paper-input id="contactName" name="contactName" type="text" label="[[t('user.name')]]" value="{{post.data.contact.name}}" char-counter="">
                </paper-input>
                <paper-input id="contactEmail" name="contactEmail" type="text" label="[[t('user.email')]]" value="{{post.data.contact.email}}" char-counter="">
                </paper-input>
                <paper-input id="contactTelephone" name="contacTelephone" type="text" label="[[t('contactTelephone')]]" value="{{post.data.contact.telephone}}" maxlength="20" char-counter="">
                </paper-input>
              </template>
            </div>
          </section>

          <template is="dom-if" restamp="" if="[[newPost]]">
            <section class="subContainer">
              <paper-textarea id="pointFor" required\$="[[!group.configuration.newPointOptional]]" minlength="3" name="pointFor" value="{{post.pointFor}}" always-float-label="[[post.pointFor]]" label="[[t('point.for')]]" char-counter="" rows="2" max-rows="5" maxlength="500">
              </paper-textarea>
              <div class="horizontal end-justified layout" hidden\$="[[group.configuration.hideEmoji]]">
                <emoji-selector id="emojiSelectorPointFor"></emoji-selector>
              </div>
            </section>
          </template>

          <template is="dom-if" if="[[!locationHidden]]" restamp="">
            <section>
              <template is="dom-if" if="[[mapActive]]" restamp="">
                <yp-post-location encoded-location="{{encodedLocation}}" location="{{location}}" group="[[group]]" post="[[post]]"></yp-post-location>
              </template>
            </section>
          </template>

          <section>
            <div class="layout vertical center-center">
              <yp-file-upload id="imageFileUpload" raised="true" multi="false" target="/api/images?itemType=post-header" method="POST" on-success="_imageUploaded">
                <iron-icon class="icon" icon="photo-camera"></iron-icon>
                <span>[[t('image.upload')]]</span>
              </yp-file-upload>
              <div class="imageSizeInfo layout horizontal">
                <div>864 x 486 (16/9 widescreen)</div>
              </div>
              <div>[[t('post.cover.imageInfo')]]</div>
              <br>
              <h3 class="accessHeader">[[t('post.cover.media')]]</h3>
              <paper-radio-group id="coverMediaType" name="coverMediaType" class="coverMediaType layout horizontal wrap" selected="{{selectedCoverMediaType}}">
                <paper-radio-button name="none">[[t('post.cover.none')]]</paper-radio-button>
                <paper-radio-button name="image" hidden\$="[[!uploadedHeaderImageId]]">[[t('post.cover.image')]]</paper-radio-button>
                <template is="dom-if" if="[[location]]">
                  <paper-radio-button name="map">[[t('post.cover.map')]]</paper-radio-button>
                  <paper-radio-button name="streetView">[[t('post.cover.streetview')]]</paper-radio-button>
                </template>
              </paper-radio-group>
            </div>
          </section>
        </iron-pages>
        <input type="hidden" name="location" value="[[encodedLocation]]">
        <input type="hidden" name="coverMediaType" value="[[selectedCoverMediaType]]">
        <input type="hidden" name="uploadedHeaderImageId" value="[[uploadedHeaderImageId]]">
        <input type="hidden" name="uploadedDocumentUrl" value="[[uploadedDocumentUrl]]">
        <input type="hidden" name="uploadedDocumentFilename" value="[[uploadedDocumentFilename]]">
      </div>
    </yp-edit-dialog>
`,

  is: 'yp-post-edit',

  behaviors: [
    ypLanguageBehavior,
    ypEditDialogBehavior,
    ypGotoBehavior
  ],

  properties: {

    action: {
      type: String,
      value: "/api/posts"
    },

    newPost: {
      type: Boolean,
      value: false
    },

    post: {
      type: Object,
      observer: "_postChanged"
    },

    group: {
      type: Object
    },

    locationHidden: {
      type: Boolean,
      value: false,
      observer: '_locationHiddenChanged'
    },

    location: {
      type: Object,
      observer: '_locationChanged'
    },

    encodedLocation: {
      type: String,
      observer: "_encodedLocationChanged"
    },

    selectedCategoryArrayId: {
      type: Number,
      observer: "_selectedCategoryChanged"
    },

    selectedCategoryId: {
      type: Number
    },

    emailValidationPattern: {
      type: String,
      value: "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"
    },

    selectedCoverMediaType: {
      type: String,
      value: 'none',
      observer: "_coverMediaTypeValueChanged"
    },

    uploadedHeaderImageId: {
      type: String,
      observer: '_uploadedHeaderImageIdChanged'
    },

    selected: {
      type: Number,
      value: 0,
      observer: '_selectedChanged'
    },

    mapActive: {
      type: Boolean,
      value: false
    },

    postDescriptionLimit: {
      type: Number,
      value: null
    },

    uploadedDocumentUrl: String,
    uploadedDocumentFilename: String
  },

  listeners: {
    'iron-form-invalid': '_formInvalid'
  },

  observers: [
    '_setupTranslation(language,t)'
  ],

  _documentUploaded: function (event, detail) {
    var document = JSON.parse(detail.xhr.response);
    this.set('uploadedDocumentUrl', document.url);
    this.set('uploadedDocumentFilename', document.filename);
  },

  customFormResponse: function () {
    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        compose: true,
        detail: { name: 'yp-refresh-group-posts', data: { id: 4 } }
      })
    )
  },

  _updateEmojiBindings: function () {
    this.async(function () {
      var description = this.$$("#description");
      var emojiSelector = this.$$("#emojiSelectorDescription");
      if (description && emojiSelector) {
        emojiSelector.inputTarget = description;
      } else {
        console.warn("Post edit: Can't bind emojis :(");
      }
      var emojiSelectorPointFor = this.$$("#emojiSelectorPointFor");
      var pointFor = this.$$("#pointFor");
      if (emojiSelectorPointFor && pointFor) {
        emojiSelectorPointFor.inputTarget = pointFor;
      }
    }.bind(this), 500);
  },

  _locationHiddenChanged: function (newValue) {
    this.async(function () {
      var pages = this.$$("#pages");
      if (pages) {
        pages.forceSynchronousItemUpdate();
      }

      var paperTabs = this.$$("#paperTabs");
      if (paperTabs) {
        paperTabs.forceSynchronousItemUpdate();
      }
      console.log("Location hidden changed");
    }, 10);
  },

  _formInvalid: function () {
    if (this.newPost && this.$$('#name').validate() && this.$$('#description').validate()) {
      this.set('selected', 1);
    } else {
      this.set('selected', 0);
    }
    this.$$('#name').autoValidate = true;
    this.$$('#description').autoValidate = true;
    if (this.newPost) {
      this.$$('#pointFor').autoValidate = true;
    }
  },

  _encodedLocationChanged: function (newValue) {
  },

  _locationChanged: function (newValue) {
    if (newValue && (!this.selectedCoverMediaType || this.selectedCoverMediaType=='' || this.selectedCoverMediaType=='none')) {
      this.set('selectedCoverMediaType','map');
    }
  },

  _uploadedHeaderImageIdChanged: function (newValue) {
    if (newValue) {
      this.set('selectedCoverMediaType','image');
    }
  },

  _nextOnEnter: function (event) {
    if (event.keyCode === 13) {
      this._searchMap();
    }
  },

  _nextTab: function () {
    var length = 3;
    if (!this.newPost) {
      length = 2;
    }
    if (this.locationHidden) {
      length -= 1;
    }
    if (this.selected<length) {
      this.set('selected', this.selected+1)
    }
  },

  _selectedChanged: function (newValue) {
    if (!this.locationHidden && newValue==(this.newPost ? 2 : 1)) {
      this.set('mapActive', true);
    } else {
      this.set('mapActive', false);
    }

    var finalTabNumber = this.locationHidden ? 2 : 3;

    if (!this.newPost || (this.newPost && newValue==finalTabNumber)) {
      this.$$("#editDialog").useNextTabAction = false;
    } else {
      this.$$("#editDialog").useNextTabAction = true;
    }

    if (newValue==0) {
      var nameElement = this.$$("#name");
      if (nameElement) {
        nameElement.focus();
      }
    }
    if (newValue==1) {
      var pointFor = this.$$("#pointFor");
      if (pointFor) {
        pointFor.focus();
      }
    }
  },

  _selectedCategoryChanged: function (newCategoryArrayId, oldValue) {
    if (newCategoryArrayId!=null && newCategoryArrayId!=undefined)
      this.selectedCategoryId = this.group.Categories[newCategoryArrayId].id;
  },

  _showCategories: function (group) {
    if (group && group.Categories) {
      return group.Categories.length>0;
    } else {
      return false;
    }
  },

  getPositionInArrayFromId: function (collection, id) {
    for(var i = 0; i < collection.length; i++) {
      if (collection[i].id==id) {
        return i;
      }
    }
    return null;
  },

  _postChanged: function(newPost, oldPost) {
    if (newPost){
      if (newPost.location) {
        this.set('location', newPost.location);
        this.set('encodedLocation', JSON.stringify(this.location));
      }
      if (newPost.cover_media_type)
        this.selectedCoverMediaType = newPost.cover_media_type;
    }
    this._updateEmojiBindings();
  },

  _updateInitialCategory: function (group) {
    if (group && this.post && this.post.category_id) {
      this.selectedCategoryId = this.post.category_id;
      this.selectedCategoryArrayId = this.getPositionInArrayFromId(group.Categories, this.post.category_id);
    }
  },

  _imageUploaded: function (event, detail) {
    var image = JSON.parse(detail.xhr.response);
    this.set('uploadedHeaderImageId', image.id);
  },

  _coverMediaTypeValueChanged: function(newValue, oldValue) {
  },

  _coverMediaTypeChanged: function(event, detail) {
  },

  _customRedirect: function (post) {
    if (post) {
      if (post.newEndorsement && window.appUser && window.appUser.endorsementPostsIndex) {
        window.appUser.endorsementPostsIndex[post.id] = post.newEndorsement;
      }
      this.redirectTo("/post/"+post.id);
      window.appGlobals.activity('completed', 'newPost');
    } else {
      console.warn('No post found on custom redirect');
    }
  },

  _clear: function () {
    if (this.newPost) {
      this.set('post', { name: '', description: '', pointFor: '', categoryId: null });
      this.set('location', null);
      this.set('selectedCategoryArrayId',null);
      this.set('selectedCategoryId',null);
      this.set('selected', 0);
      this.set('uploadedHeaderImageId',null);
      this.$$("#imageFileUpload").clear();
      this.set('selectedCoverMediaType', 'none');
    }
  },

  setup: function (post, newNotEdit, refreshFunction, group) {
    this._setupGroup(group);
    if (post) {
      this.set('post', post);
    } else {
      this.set('post', null);
    }
    this._updateInitialCategory(group);
    this.set('newPost', newNotEdit);
    this.set('refreshFunction', refreshFunction);
    this._setupTranslation();
    this._clear();
  },

  _setupGroup: function (group) {
    if (group) {
      this.set('group', group);
      if (group.configuration) {
        if (group.configuration.locationHidden) {
          if (group.configuration.locationHidden == true) {
            this.set('locationHidden', true);
          } else {
            this.set('locationHidden', false);
          }
        } else {
          this.set('locationHidden', false);
        }
        if (group.configuration.postDescriptionLimit) {
          this.set('postDescriptionLimit', group.configuration.postDescriptionLimit);
        } else {
          this.set('postDescriptionLimit', 500);
        }
      } else {
        this.set('postDescriptionLimit', 500);
      }
    }
  },

  setupAfterOpen: function (params) {
    this._setupGroup(params.group);
    this.async(function () {
      var nameElement = this.$$("#name");
      if (nameElement) {
        nameElement.focus();
      }
    }.bind(this), 250);
  },

  _setupTranslation: function () {
    this.async(function () {
      if (this.t) {
        if (this.newPost) {
          this.editHeaderText = this.t('post.new');
          this.toastText = this.t('postCreated');
          this.set('saveText', this.t('create'));
        } else {
          this.set('saveText', this.t('save'));
          this.editHeaderText = this.t('post.edit');
          this.toastText = this.t('postUpdated');
        }
      }
    }.bind(this), 20);
  }
});
