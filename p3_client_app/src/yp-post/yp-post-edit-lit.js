import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import 'neon-animation-polymer-3/web-animations.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/neon-animatable.js';
import '@polymer/neon-animation/neon-animation.js';
import '../yp-file-upload/yp-file-upload.js';
import '../yp-behaviors/emoji-selector.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import './yp-post-location.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class YpPostEditLit extends YpBaseElement {
  static get properties() {
    return {
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

      uploadedVideoId: {
        type: String,
        value: null
      },

      uploadedAudioId: {
        type: String,
        value: null
      },

      currentVideoId: {
        type: String,
        value: null
      },

      currentAudioId: {
        type: String,
        value: null
      },

      showVideoCover: {
        type: Boolean,
        computed: '_showVideoCover(uploadedVideoId, currentVideoId)'
      },

      showAudioCover: {
        type: Boolean,
        computed: '_showAudioCover(uploadedAudioId, currentAudioId)'
      },

      newPointShown: {
        type: Boolean,
        computed: '_newPointShown(newPost, group)'
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

      structuredQuestions: {
        type: Array,
        computed: '_structuredQuestions(post, group)'
      },

      sructuredAnswers: {
        type: String,
        value: null
      },

      uploadedDocumentUrl: String,
      uploadedDocumentFilename: String
      }
    }

  static get styles() {
    return [
      css`

      .access {

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
        --paper-input-container-input: {
          max-height: 125px;
        }
      }

      .postEmoji {
        margin-left: 16px;
      }

      .uploadSection {
        max-width: 220px;
        vertical-align: top;
        margin-left: 8px;
        margin-right: 8px;
      }

      @media (max-width: 600px) {
        .uploadSection {
          max-width: 100%;
        }
      }

      .postCoverVideoInfo {
        margin-top: 8px;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <yp-edit-dialog .name="postEdit" double-width id="editDialog" .icon="lightbulb-outline" .action="${this.action}" .use-next-tab-action="${this.newPost}" @next-tab-action="${this._nextTab}" .method="${this.method}" title="${this.editHeaderText}" .saveText="${this.saveText}" class="container" custom-submit .next-action-text="${this.t('next')}" .toastText="${this.toastText}" .params="${this.params}">
      <paper-tabs .selected="${this.selected}" id="paperTabs" .focused>
        <paper-tab><span>${this.t('post.yourPost')}</span></paper-tab>

        ${ this.newPointShown ? html`
          <paper-tab>
            <div class="layout vertical center-center">
              <div>
                ${this.t('post.yourPoint')}
              </div>
              <div class="optional" ?hidden="${!this.group.configuration.newPointOptional}">
                ${this.t('optional')}
              </div>
            </div>
          </paper-tab>
        `: html``}

        ${ !this.locationHidden ? html`
          <paper-tab>${this.t('post.location')}</paper-tab>
        `: html``}

        <paper-tab>${this.t('media')}</paper-tab>
      </paper-tabs>

      <div class="layout vertical wrap">
        <iron-pages id="pages" class="layout horizontal" .selected="${this.selected}">
          <section>
            <div class="layout vertical flex">

            <paper-input id="name" .required="" .minlength="3" .name="name" .type="text" .label="${this.t('title')}" .value="${this.post.name}" .maxlength="60" .char-counter="">
            </paper-input>

              ${ this._showCategories(group) ? html`
                <paper-dropdown-menu .label="${this.t('category.select')}">
                  <paper-listbox slot="dropdown-content" .selected="${this.selectedCategoryArrayId}">

                    ${ this.group.Categories.map(category => html`
                    <paper-item .data-category-id="${this.category.id}">${this.category.name}</paper-item>
                    `)}

                  </paper-listbox>
                </paper-dropdown-menu>
                <input .type="hidden" .name="categoryId" .value="${this.selectedCategoryId}">
              `: html``}

              ${ this.postDescriptionLimit ? html`
                <paper-textarea id="description" ?hidden="${this.structuredQuestions}" .required="${!this.structuredQuestions}" .minlength="3" .name="description" .value="${this.post.description}" .always-float-label="${this._floatIfValueOrIE(post.description)}" .label="${this.t('post.description')}" .on-value-changed="_resizeScrollerIfNeeded" .char-counter="" .rows="2" .max-rows="5" .maxrows="5" .maxlength="${this.postDescriptionLimit}">
                </paper-textarea>

                <div class="horizontal end-justified layout postEmoji" ?hidden="${this.group.configuration.hideEmoji}">
                  <emoji-selector id="emojiSelectorDescription" ?hidden="${this.structuredQuestions}"></emoji-selector>
                </div>
              `: html``}

              ${ this.structuredQuestions ? html`

                ${ this.structuredQuestions.map(item => html`
                  <paper-textarea id="structuredQuestion_${this.index}" .value="${this.item.value}" always-float-label="${this._floatIfValueOrIE(item.value)}" .label="${this.item.translatedQuestion}" char-counter .minlength="2" @value-changed="${this._resizeScrollerIfNeeded}" .rows="2" .max-rows="3" .maxrows="3" .required="" .maxlength="${this.item.maxLength}">
                  </paper-textarea>
                `)}

              `: html``}

              ${ this.group.configuration.attachmentsEnabled ? html`
                <yp-file-upload id="attachmentFileUpload" raised .accept="application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,text/plain,application/pdf,image/*" .target="/api/groups/${this.group.id}/upload_document" .method="POST" @success="${this._documentUploaded}">
                  <iron-icon class="icon" .icon="attach-file"></iron-icon>
                  <span>${this.t('uploadAttachment')}</span>
                </yp-file-upload>

                ${ this.post.data.attachment.url ? html`
                  <paper-checkbox .name="deleteAttachment">${this.t('deleteAttachment')}: ${this.post.data.attachment.filename}</paper-checkbox>
                `: html``}

              `: html``}

              ${ this.group.configuration.moreContactInformation ? html`
                <h2 class="contactInfo">${this.t('contactInformation')}</h2>
                <paper-input id="contactName" .name="contactName" .type="text" .label="${this.t('user.name')}" .value="${this.post.data.contact.name}" char-counter>
                </paper-input>
                <paper-input id="contactEmail" .name="contactEmail" .type="text" .label="${this.t('user.email')}" .value="${this.post.data.contact.email}" char-counter>
                </paper-input>
                <paper-input id="contactTelephone" .name="contacTelephone" .type="text" .label="${this.t('contactTelephone')}" .value="${this.post.data.contact.telephone}" .maxlength="20" char-counter>
                </paper-input>
              `: html``}
            </div>
          </section>

          ${ this.newPointShown ? html`
            <section class="subContainer">
              <paper-textarea id="pointFor" .required="${!this.group.configuration.newPointOptional}" .minlength="3" .name="pointFor" .value="${this.post.pointFor}" always-float-label="${this._floatIfValueOrIE(post.pointFor)}" .label="${this.t('point.for')}" char-counter .rows="2" .max-rows="5" .maxlength="500">
              </paper-textarea>
              <div class="horizontal end-justified layout" ?hidden="${this.group.configuration.hideEmoji}">
                <emoji-selector id="emojiSelectorPointFor"></emoji-selector>
              </div>
            </section>
          `: html``}

            ${ this.mapActive ? html`
            <yp-post-location .encodedLocation="${this.encodedLocation}" .location="${this.location}" .group="${this.group}" .post="${this.post}"></yp-post-location>
            `: html``}

          ${ !this.locationHidden ? html`
            <section>

              ${ this.mapActive ? html`
                <yp-post-location .encodedLocation="${this.encodedLocation}" .location="${this.location}" .group="${this.group}" .post="${this.post}"></yp-post-location>
              `: html``}

            </section>
          `: html``}

          <section>
            <div class="layout vertical center-center">
              <div class="layout horizontal center-center wrap">
                <div class="layout vertical center-center self-start uploadSection" ?hidden="${this.group.configuration.hidePostImageUploads}">
                  <yp-file-upload id="imageFileUpload" raised .target="/api/images?itemType=post-header" .method="POST" @success="${this._imageUploaded}">
                    <iron-icon class="icon" icon="photo-camera"></iron-icon>
                    <span>${this.t('image.upload')}</span>
                  </yp-file-upload>
                  <div class="imageSizeInfo layout horizontal">
                    <div>864 x 486 (16/9 widescreen)</div>
                  </div>
                  <div>${this.t('post.cover.imageInfo')}</div>
                </div>

                ${ this.group.configuration.allowPostVideoUploads ? html`
                  <div class="layout vertical center-center self-start uploadSection">
                    <yp-file-upload id="videoFileUpload" container-type="posts" .group="${this.group}" .raised="true" .uploadLimitSeconds="${this.group.configuration.videoPostUploadLimitSec}" .multi="false" .video-upload="" .method="POST" @success="${this._videoUploaded}">
                      <iron-icon class="icon" icon="videocam"></iron-icon>
                      <span>${this.t('uploadVideo')}</span>
                    </yp-file-upload>
                  </div>
                `: html``}

                ${ this.group.configuration.allowPostAudioUploads ? html`
                  <div class="layout vertical center-center self-start uploadSection">
                    <yp-file-upload id="audioFileUpload" container-type="posts" group="${this.group}" raised="true" upload-limit-seconds="${this.group.configuration.audioPostUploadLimitSec}" .multi="false" .audio-upload="" .method="POST" @success="${this._audioUploaded}">
                      <iron-icon class="icon" .icon="keyboard-voice"></iron-icon>
                      <span>${this.t('uploadAudio')}</span>
                    </yp-file-upload>
                  </div>
                `: html``}

              </div>
              <br>
              <h3 class="accessHeader">${this.t('post.cover.media')}</h3>
              <paper-radio-group id="coverMediaType" name="coverMediaType" class="coverMediaType layout horizontal wrap" .selected="${this.selectedCoverMediaType}">
                <paper-radio-button .name="none">${this.t('post.cover.none')}</paper-radio-button>
                <paper-radio-button .name="image" ?hidden="${!this.uploadedHeaderImageId}">${this.t('post.cover.image')}</paper-radio-button>
                <paper-radio-button .name="video" ?hidden="${!this.showVideoCover}">${this.t('postCoverVideo')}</paper-radio-button>
                <paper-radio-button .name="audio" ?hidden="${!this.showAudioCover}">${this.t('postCoverAudio')}</paper-radio-button>

                ${ this.location ? html`
                  <paper-radio-button .name="map">${this.t('post.cover.map')}</paper-radio-button>
                  <paper-radio-button .name="streetView">${this.t('post.cover.streetview')}</paper-radio-button>
                `: html``}

              </paper-radio-group>
            </div>
          </section>
        </iron-pages>
        <input type="hidden" .name="location" .value="${this.encodedLocation}">
        <input type="hidden" .name="coverMediaType" .value="${this.selectedCoverMediaType}">
        <input type="hidden" .name="uploadedHeaderImageId" .value="${this.uploadedHeaderImageId}">
        <input type="hidden" .name="uploadedDocumentUrl" .value="${this.uploadedDocumentUrl}">
        <input type="hidden" .name="uploadedDocumentFilename" .value="${this.uploadedDocumentFilename}">
        <input type="hidden" .name="structuredAnswers" .value="${this.structuredAnswers}">
      </div>
    </yp-edit-dialog>
    `
  }


/*
  behaviors: [
    ypEditDialogBehavior,
    ypGotoBehavior
  ],
  listeners: {
    'iron-form-invalid': '_formInvalid',
    'yp-custom-form-submit': '_customSubmit'
  },
  observers: [
    '_setupTranslation(language,t)'
  ],
*/

_floatIfValueOrIE(value) {
    var ie11 = /Trident.*rv[ :]*11\./.test(navigator.userAgent);
    return ie11 || value;
  }

  _newPointShown(newPost, group) {
    var hideNewPoint = false;
    if (group && group.configuration && group.configuration.hideNewPointOnNewIdea===true) {
      hideNewPoint = true;
    }

    return newPost && !hideNewPoint;
  }

  _customSubmit(value, valueB) {
    if (this.structuredQuestions && this.structuredQuestions.length>0) {
      var description="", answers="";
      for (i=0 ; i<this.structuredQuestions.length; i+=1) {
        description += this.structuredQuestions[i].question;
        if (this.structuredQuestions[i].question && this.structuredQuestions[i].question[this.structuredQuestions[i].question.length-1]!=='?')
          description += ':';
        description += '\n';
        description += this.structuredQuestions[i].value;
        answers+=this.structuredQuestions[i].value;
        if (i!==this.structuredQuestions.length-1) {
          answers+="%!#x";
          description += '\n\n';
        }
      }
      this.set('post.description', description);
      this.set('structuredAnswers', answers);
      this.$.editDialog._reallySubmit();
    } else {
      this.$.editDialog._reallySubmit();
    }
  }

  _resizeScrollerIfNeeded() {
    this.$.editDialog.scrollResize();
  }

  _structuredQuestions(post, group) {
    if (post && group && group.configuration.structuredQuestions && group.configuration.structuredQuestions!=="") {
      var structuredQuestions = [];

      var questionComponents = group.configuration.structuredQuestions.split(",");
      for (var i=0 ; i<questionComponents.length; i+=2) {
        var question = questionComponents[i];
        var maxLength = questionComponents[i+1];
        structuredQuestions.push({
          translatedQuestion: question,
          question: question,
          maxLength: maxLength, value: ""
        });
      }
      if (!this.newPost && post.public_data.structuredAnswers && post.public_data.structuredAnswers!=="") {
        var answers = post.public_data.structuredAnswers.split("%!#x");
        for (i=0 ; i<answers.length; i+=1) {
          if (structuredQuestions[i])
            structuredQuestions[i].value = answers[i];
        }
      }
      return structuredQuestions;
    } else {
      return null;
    }
  }

  _showVideoCover(uploaded, current) {
    return uploaded || current;
  }

  _showAudioCover(uploaded, current) {
    return uploaded || current;
  }

  _videoUploaded(event, detail) {
    this.set('uploadedVideoId', detail.videoId);
    this.set('selectedCoverMediaType','video');
    this.async(function () { this.fire('iron-resize'); });
  }

  _audioUploaded(event, detail) {
    this.set('uploadedAudioId', detail.audioId);
    this.set('selectedCoverMediaType','audio');
    this.async(function () { this.fire('iron-resize'); });
  }

  _documentUploaded(event, detail) {
    var document = JSON.parse(detail.xhr.response);
    this.set('uploadedDocumentUrl', document.url);
    this.set('uploadedDocumentFilename', document.filename);
  }

  customFormResponse() {
    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        compose: true,
        detail: { name: 'yp-refresh-group-posts', data: { id: 4 } }
      })
    )
  }

  _updateEmojiBindings() {
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
  }

  _locationHiddenChanged(newValue) {
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
  }

  _formInvalid() {
    if (this.newPointShown && !this.$$('#pointFor').validate()) {
      this.set('selected', 1);
    } else {
      this.set('selected', 0);
    }
    this.$$('#name').autoValidate = true;
    this.$$('#description').autoValidate = true;
    if (this.newPointShown) {
      this.$$('#pointFor').autoValidate = true;
    }
  }

  _encodedLocationChanged(newValue) {
  }

  _locationChanged(newValue) {
    if (newValue && (!this.selectedCoverMediaType || this.selectedCoverMediaType=='' || this.selectedCoverMediaType=='none')) {
      this.set('selectedCoverMediaType','map');
    }
  }

  _uploadedHeaderImageIdChanged(newValue) {
    if (newValue) {
      this.set('selectedCoverMediaType','image');
    }
  }

  _nextOnEnter(event) {
    if (event.keyCode === 13) {
      this._searchMap();
    }
  }

  _getTabLength() {
    var length = 4;

    if (!this.newPointShown) {
      length -= 1;
    }

    if (this.locationHidden) {
      length -= 1;
    }
    return length;
  }

  _nextTab() {
    var length = this._getTabLength();

    if (this.selected<length) {
      this.set('selected', this.selected+1)
    }
  }

  _selectedChanged(newValue) {
    if (!this.locationHidden && newValue==(this.newPointShown ? 2 : 1)) {
      this.set('mapActive', true);
    } else {
      this.set('mapActive', false);
    }

    var finalTabNumber = this._getTabLength()-1;

    if (newValue==finalTabNumber) {
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
    if (newValue==1 && this.newPointShown) {
      var pointFor = this.$$("#pointFor");
      if (pointFor) {
        pointFor.focus();
      }
    }
  }

  _selectedCategoryChanged(newCategoryArrayId, oldValue) {
    if (newCategoryArrayId!=null && newCategoryArrayId!=undefined)
      this.selectedCategoryId = this.group.Categories[newCategoryArrayId].id;
  }

  _showCategories(group) {
    if (group && group.Categories) {
      return group.Categories.length>0;
    } else {
      return false;
    }
  }

  getPositionInArrayFromId(collection, id) {
    for(var i = 0; i < collection.length; i++) {
      if (collection[i].id==id) {
        return i;
      }
    }
    return null;
  }

  _postChanged(newPost, oldPost) {
    if (newPost){
      if (newPost.location) {
        this.set('location', newPost.location);
        this.set('encodedLocation', JSON.stringify(this.location));
      }
      if (newPost.cover_media_type)
        this.selectedCoverMediaType = newPost.cover_media_type;
    }
    this._updateEmojiBindings();
  }

  _updateInitialCategory(group) {
    if (group && this.post && this.post.category_id) {
      this.selectedCategoryId = this.post.category_id;
      this.selectedCategoryArrayId = this.getPositionInArrayFromId(group.Categories, this.post.category_id);
    }
  }

  _imageUploaded(event, detail) {
    var image = JSON.parse(detail.xhr.response);
    this.set('uploadedHeaderImageId', image.id);
  }

  _coverMediaTypeValueChanged(newValue, oldValue) {
  }

  _coverMediaTypeChanged(event, detail) {
  }

  _customRedirect(post) {
    if (post) {
      if (post.newEndorsement && window.appUser && window.appUser.endorsementPostsIndex) {
        window.appUser.endorsementPostsIndex[post.id] = post.newEndorsement;
      }
      var ajax;
      if (this.uploadedVideoId) {
        this.post = post;
        ajax = document.createElement('iron-ajax');
        ajax.handleAs = 'json';
        ajax.contentType = 'application/json';
        ajax.url = '/api/videos/'+this.post.id+'/completeAndAddToPost';
        ajax.method = 'PUT';
        ajax.body = {
          videoId: this.uploadedVideoId,
          appLanguage: this.language
        };
        ajax.addEventListener('response', function (event) {
          this._finishRedirect(post);
          this.async(function () {
            window.appGlobals.showSpeechToTextInfoIfNeeded();
          }, 20);
        }.bind(this));
        ajax.generateRequest();
      } else if (this.uploadedAudioId && this.newPost) {
        this.post = post;
        ajax = document.createElement('iron-ajax');
        ajax.handleAs = 'json';
        ajax.contentType = 'application/json';
        ajax.url = '/api/audios/'+this.post.id+'/completeAndAddToPost';
        ajax.method = 'PUT';
        ajax.body = {
          audioId: this.uploadedAudioId,
          appLanguage: this.language
        };
        ajax.addEventListener('response', function (event) {
          this._finishRedirect(post);
        }.bind(this));
        this.async(function () {
          window.appGlobals.showSpeechToTextInfoIfNeeded();
        }, 20);
        ajax.generateRequest();
      } else {
        this._finishRedirect(post);
      }
    } else {
      console.warn('No post found on custom redirect');
    }
  }

  _finishRedirect(post) {
    this.fire('yp-reset-keep-open-for-page');
    this.redirectTo("/post/"+(post ? post.id : this.post.id));
    window.appGlobals.activity('completed', 'newPost');
  }

  _clear() {
    if (this.newPost) {
      this.set('post', { name: '', description: '', pointFor: '', categoryId: null });
      this.set('location', null);
      this.set('selectedCategoryArrayId',null);
      this.set('selectedCategoryId',null);
      this.set('selected', 0);
      this.set('uploadedHeaderImageId', null);
      this.set('uploadedVideoId', null);
      this.set('uploadedAudioId', null);
      this.set('currentVideoId', null);
      this.set('currentAudioId', null);
      this.$$("#imageFileUpload").clear();
      this.set('selectedCoverMediaType', 'none');
      this.async(function () { this.fire('iron-resize'); });
    }
  }

  setup(post, newNotEdit, refreshFunction, group) {
    this._setupGroup(group);
    if (post) {
      this.set('post', post);
      if (post.PostVideos && post.PostVideos.length>0) {
        this.set('currentVideoId', post.PostVideos[0].id)
      }

      if (post.PostAudios && post.PostAudios.length>0) {
        this.set('currentAudioId', post.PostAudios[0].id)
      }
    } else {
      this.set('post', null);
    }
    this._updateInitialCategory(group);
    this.set('newPost', newNotEdit);
    this.set('refreshFunction', refreshFunction);
    this._setupTranslation();
    this._clear();
  }

  _setupGroup(group) {
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
  }

  setupAfterOpen(params) {
    this._setupGroup(params.group);
    this.async(function () {
      var nameElement = this.$$("#name");
      if (nameElement) {
        nameElement.focus();
      }
    }.bind(this), 250);
  }

  _setupTranslation() {
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
}

window.customElements.define('yp-post-edit-lit', YpPostEditLit)