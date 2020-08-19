import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-input/paper-textarea.js';
import 'lite-signal/lite-signal.js';
import '../yp-app-globals/yp-app-icons.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import '../yp-behaviors/emoji-selector.js';
import { ypGotAdminRightsBehavior } from '../yp-behaviors/yp-got-admin-rights-behavior.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../yp-magic-text/yp-magic-text.js';
import './yp-point-actions.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpPointLit extends YpBaseElement {
  static get properties() {
    return {
      point: {
        type: Object,
        notify: true,
        observer: "_pointChanged"
      },

      linkPoint: {
        type: Boolean,
        value: false
      },

      hasPointAccess: {
        type: Boolean,
        computed: '_hasPointAccess(point, gotAdminRights, loggedInUser)'
      },

      canEditPoint: {
        type: Boolean,
        computed: '_canEditPoint(point, gotAdminRights, loggedInUser)'
      },

      user: {
        type: Object,
        value: null
      },

      openTranscript: {
        type: Boolean,
        value: true
      },

      hideUser: {
        type: Boolean,
        value: false
      },

      hideActions: {
        type: Boolean,
        value: false
      },

      isEditing: {
        type: Boolean,
        value: false,
        observer: '_isEditingChanged'
      },

      isEditingSomething: {
        type: Boolean,
        computed: '_isEditingSomething(isEditing, isAdminCommentEditing)'
      },

      isAdminCommentEditing: {
        type: Boolean,
        value: false,
        observer: '_isAdminCommentEditingChanged'
      },

      hasAdminCommentAccess: {
        type: Boolean,
        computed: '_hasAdminCommentAccess(point)'
      },

      hasAdminComments: {
        type: Boolean,
        value: false
      },

      showAdminComments: {
        type: Boolean,
        computed: '_showAdminComments(point, hasAdminComments)'
      },

      maxNumberOfPointsBeforeEditFrozen: {
        type: Number,
        value: 5
      },

      pointValueUp: {
        type: Boolean,
        computed: 'upVote(point)'
      },

      pointUrl: {
        type: String,
        computed: '_pointUrl(point)'
      },

      editText: String,

      editAdminCommentText: String,

      videoActive: {
        type: Boolean,
        value: false
      },

      pointVideoPath: String,

      pointImageVideoPath: String,

      pointVideoId: Number,

      audioActive: {
        type: Boolean,
        value: false
      },

      pointAudioPath: String,

      pointAudioId: Number,

      videoOrAudioActive: {
        type: Boolean,
        computed: '_videoOrAudioActive(videoActive, audioActive)'
      },

      checkingTranscript: {
        type: Boolean,
        value: false
      },

      portraitVideo: {
        type: Boolean,
        value: false
      }
    }
  }

  static get styles() {
    return [
      css`

      :host {
        display: block;
      }

      .point-content {
        padding-right: 16px;
        padding-left: 16px;
        margin-top: 16px;
      }

      #pointContentTranscript, #pointContent {
        cursor: default;
      }

      #pointContentTranscript, #pointContent[link-point] {
        cursor: pointer;
      }

      @media (max-width: 320px) {
        .user-image {
          display: none;
        }
      }

      .userInfoContainer {
        border-bottom: solid 4px;
        width: 100%;
        padding-bottom: 16px;
      }

      .userInfoContainer[up-vote] {
        border-bottom-color:  var(--master-point-up-color);
      }

      .userInfoContainer[down-vote] {
        border-bottom-color: var(--master-point-down-color);
      }

      paper-icon-button {
        color: #ccc;
      }

      #reportPointIconButton {
        color: #ddd;
        width: 36px;
        height: 36px;
      }

      .thumbsIcon {
        padding-left: 16px;
        padding-right: 16px;
      }

      @media (min-width: 985px) {
        .thumbsIcon {
          display: none;
        }
      }

      iron-icon.thumbsIconUp {
        color: var(--master-point-up-color);
      }

      iron-icon.thumbsIconDown {
        color: var(--master-point-down-color);
      }

      yp-user-with-organization {
        padding-left: 16px;
      }

      .actionContainer {
        margin-top: 8px;
      }

      [hidden] {
        display: none !important;
      }

      .pointer {
        cursor: pointer;
      }

      iron-image, video {
        width: 398px;
        height: 224px;
        margin: 0;
        padding: 0;
      }

      @media (max-width: 600px) {
        iron-image, video {
          width: 100%;
          margin: 0 !important;
          padding: 0;
          height: initial;
          vertical-align: top;
        }

        .actionContainer {
          margin-left: 12px;
        }

        #videoPlayer[portrait] {
          width: 50% !important;
        }
      }


      .topContainer[portrait] {
        background-color: #777;
      }

      #pointContentEditor, #pointAdminCommentEditor {
        padding-left: 8px;
        padding-right: 8px;
      }

      #pointAdminCommentContent {
        padding-left: 16px;
        padding-right: 16px;
      }

      .commentFromAdmin {
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 16px;
        font-size: 16px;
        padding-bottom: 2px;
        font-weight: bold;
        color: var(--accent-color, #111);
      }

      .commentFromAdminInput {
        padding: 0;
      }

      .transcriptError {
        margin-top: 8px;
        color: #F00;
      }

      paper-spinner {
        margin-top: 4px;
      }

      .checkTranscript {
        margin-top: 8px;
        padding: 8px;
      }

      .transcriptText {
        margin-top: 0;
        padding: 8px;
        color: #222;
        padding-bottom: 0;
        font-style: italic;
      }

      .transcriptHeader {
        color: #222;
        margin-bottom: 2px;
        font-style: normal;
      }

      audio {
        margin-top: 16px;
        margin-bottom: 16px;
      }

      video {
        background-color: #777;
      }

      #pointContent {
        color: #111;
      }

      paper-icon-button.openCloseButton {
        width: 54px;
        height: 54px;
        margin-top: -16px;
        padding-left: 0;
        margin-left: 0;
        color: #777;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <lite-signal @lite-signal-got-admin-rights="${this._gotAdminRights}"></lite-signal>
    <lite-signal @lite-signal-logged-in="${this._userLoggedIn}"></lite-signal>
    <lite-signal @lite-signal-yp-pause-media-playback="${this._pauseMediaPlayback}"></lite-signal>

    <div class="layout vertical">

        <div class="userInfoContainer layout horizontal" .upVote="${this.upVote(point)}" .downVote="${this.downVote(point)}" ?hidden="${this.hideUser}">
          <iron-icon .icon="thumb-up" class="thumbsIcon thumbsIconUp" ?hidden="${!this.pointValueUp}"></iron-icon>
          <iron-icon .icon="thumb-down" class="thumbsIcon thumbsIconDown" ?hidden="${this.pointValueUp}"></iron-icon>
          <div class="layout horizontal" ?hidden="${this.point.Post.Group.configuration.hidePointAuthor}">
            <yp-user-with-organization .titleDate="${this.point.created_at}" inverted .user="${this.user}"></yp-user-with-organization>
          </div>
        </div>

        <div class="layout vertical">
          <div class="topContainer" .portrait="${this.portraitVideo}">

            ${ this.videoActive ? html`
              <div class="layout horizontal center-center">
                <video id="videoPlayer" portrait="${this.portraitVideo}" data-id="${this.pointVideoId}" .controls="" .preload="none" class="video" src="${this.pointVideoPath}" .playsinline="" .poster="${this.pointImageVideoPath}"></video>
              </div>
            `: html``}
          </div>

          ${ this.audioActive ? html`
            <div class="layout vertical center-center">
              <audio id="audioPlayer" data-id="${this.pointAudioId}" .controls="" .preload="meta" class="audio" src="${this.pointAudioPath}" playsinline=""></audio>
            </div>
          `: html``}

          ${ this.videoOrAudioActive ? html`
            ${ checkingTranscript ? html`
              <div class="layout vertical center-center checkTranscript">
                <div>${this.t('checkingForTranscript')}</div>
                <paper-spinner .active=""></paper-spinner>
              </div>
            `: html``}

            <div class="transcriptError layout horizontal center-center" ?hidden="${!this.checkTranscriptError}">
              ${this.t('checkTranscriptError')}
            </div>

            ${ this.point.latestContent ? html`
              <div class="transcriptText layout vertical center-center">
                <div class="layout horizontal">
                  <div class="transcriptHeader">${this.t('automaticTranscript')}</div>
                  <div hidden\$="[[!point.Post.Group.configuration.collapsableTranscripts]]">
                    <paper-icon-button title="${this.t('openComments')}" class="openCloseButton" icon="keyboard-arrow-right" @click="${this._setOpen}" hidden\$="[[openTranscript]]"></paper-icon-button>
                    <paper-icon-button title="${this.t('closeComments')}" class="openCloseButton" icon="keyboard-arrow-down" @click="${this._setClosed}" hidden\$="[[!openTranscript]]"></paper-icon-button>
                  </div>
                </div>
                <div id="pointContentTranscript" .linkPoint="${this.linkPoint}" ?hidden="${this.isEditing}" @tap="${this._linkIfNeeded}">
                  <yp-magic-text ?hidden="${!this.openTranscript}" simple-format .textType="pointContent" .contentLanguage="${this.point.language}" .content="${this.point.latestContent}" content-id="${this.point.id}">
                  </yp-magic-text>
                </div>
              </div>
            `: html``}
          `: html`
            <div class="point-content layout vertical ">
              <span ?hidden="${!this.point.name}">
                <span>${this.point.name}</span>.
              </span>
              <div id="pointContent" .linkPoint="${this.linkPoint}" ?hidden="${this.isEditingSomething}" @tap="${this._linkIfNeeded}">
                <yp-magic-text simple-format .textType="pointContent" .contentLanguage="${this.point.language}" .content="${this.point.latestContent}" content-id="${this.point.id}">
                </yp-magic-text>
              </div>
            </div>
          `}

          ${this.showAdminComments ? html`
            <div class="commentFromAdmin" ?hidden="${this.isEditingSomething}">

              ${this.point.Post.Group.configuration.customAdminCommentsTitle ? html`
                <yp-magic-text .textType="customAdminCommentsTitle" .contentLanguage="${this.point.Post.Group.language}"
                   .content="${this.point.Post.Group.configuration.customAdminCommentsTitle}" .contentId="${this.point.Post.Group.id}">
                </yp-magic-text>
              ` : ``}


              ${!this.point.Post.Group.configuration.customAdminCommentsTitle ? html`
                ${this.t('commentFromAdmin')}
              ` : ``}

            </div>
            <div id="pointAdminCommentContent" ?link-point="${this.linkPoint}" ?hidden="${this.isEditingSomething}"
               @click="${this._linkIfNeeded}">
              <yp-magic-text simple-format .textType="pointAdminCommentContent"
                .contentLanguage="${this.point.public_data.admin_comment.language}" .content="${this.point.public_data.admin_comment.text}"
                .contentId="${this.point.id}">
              </yp-magic-text>
            </div>
          ` : ''}

          ${this.isEditing ? html`
            <div class="layout vertical">
              <paper-textarea id="pointContentEditor" char-counter .maxlength="1500" .value="${this.editText}"></paper-textarea>
              <div class="horizontal end-justified layout">
                <emoji-selector id="pointEmojiSelector"></emoji-selector>
              </div>
              <div class="layout horizontal self-end">
                <mwc-button @click="${this._cancelEdit}" .label="${this.t('cancel')}"></mwc-button>
                <mwc-button @click="${this._saveEdit}" .label="${this.t('update')}"></mwc-button>
              </div>
            </div>
          `: html``}

          <div class="layout horizontal actionContainer" ?hidden="${this.hideActions}">
            <yp-point-actions .point="${this.point}" .pointUrl="${this.pointUrl}"
              ?allowWhatsAppSharing="${this.point.Post.Group.configuration.allowWhatsAppSharing}"
            ></yp-point-actions>
            <paper-icon-button .title="${this.t('point.report')}" id="reportPointIconButton" .icon="warning" @tap="${this._reportPoint}"></paper-icon-button>
            <div class="flex"></div>

            ${ this.hasPointAccess ? html`
              <div class="layout horizontal self-end" ?hidden="">
                <yp-ajax id="editPointAjax" .method="PUT" @response="${this._editResponse}"></yp-ajax>
                <yp-ajax id="editAdminCommentPointAjax" method="PUT" @response="${this._editAdminCommentResponse}"></yp-ajax>
                <yp-ajax id="deletePointAjax" .method="DELETE" @response="${this._deleteResponse}"></yp-ajax>
                <paper-icon-button title="${this.t('editAdminComment')}" ?hidden="${!this.hasAdminCommentAccess}" icon="comment" @click="${this._editAdminComment}"></paper-icon-button>
                <paper-icon-button title="${this.t('edit')}" ?hidden="${!this.canEditPoint}" .icon="create" @click="${this._editPoint}"></paper-icon-button>
                <paper-icon-button title="${this.t('delete')}" .icon="clear" @click="${this._deletePoint}"></paper-icon-button>
              </div>
            `: html``}

            <yp-ajax ?hidden="" id="checkTranscriptStatusAjax" @response="${this._transcriptStatusResponse}"></yp-ajax>
          </div>
        </div>
      </div>
      `
  }

/*
  behaviors: [
    AccessHelpers,
    ypLoggedInUserBehavior,
    ypGotAdminRightsBehavior,
    ypGotoBehavior,
    ypMediaFormatsBehavior
  ],
*/

  _setOpen () {
    this.openTranscript = true;
    this.async(function () {
      this.fire('yp-iron-resize');
      this.fire('iron-resize');
      this.notifyResize();
    }, 20);
  }

  _setClosed () {
    this.openTranscript = false;
    this.async(function () {
      this.fire('yp-iron-resize');
      this.fire('iron-resize');
      this.notifyResize();
    },20);
  }

  _isEditingSomething (isEditing, isAdminCommentEditing) {
    return isEditing || isAdminCommentEditing;
  }

  _showAdminComments (point, hasAdminComments) {
    if (point && point.Post && point.Post.Group && point.public_data &&
        point.public_data.admin_comment &&
        point.public_data.admin_comment.text &&
        point.Post.Group.configuration &&
        point.Post.Group.configuration.allowAdminAnswersToPoints) {
      return true;
    } else {
      return false;
    }
  }

  _hasAdminCommentAccess (point) {
    if (point && point.Post && point.Post.Group &&
      this.checkPostAdminOnlyAccess(point.Post) &&
      point.Post.Group.configuration &&
      point.Post.Group.configuration.allowAdminAnswersToPoints) {
      return true;
    } else {
      return false;
    }
  }


  _videoOrAudioActive(videoActive, audioActive) {
    return videoActive || audioActive;
  }

  _isEditingChanged(value) {
    this._updateEmojiBindings(value);
    this.async(function () {
      this.fire('iron-resize');
    });
  }

  _isAdminCommentEditingChanged(value) {
    this._updateEmojiBindings(null, value);
    this.async(function () {
      this.fire('iron-resize');
    });
  }

  _shareTap(event, detail) {
    window.appGlobals.activity('pointShareOpen', detail.brand, this.point.id);
  }

  _pointUrl(point) {
    if (point && point.Post) {
      return window.location.protocol+"//"+window.location.hostname+"/post/"+point.Post.id+"/"+point.id;
    }
  }

  _linkIfNeeded() {
    if (this.linkPoint) {
      this.goToPost(this.point.Post.id, this.point.id);
    }
  }

  _updateEmojiBindings(isEditing, isAdminCommentEditing){
    if (isEditing) {
      this.async(function () {
        const point = this.$$("#pointContentEditor");
        const emoji = this.$$("#pointEmojiSelector");
        if (point && emoji) {
          emoji.inputTarget = point;
        } else {
          console.error("Wide: Can't bind point edit emojis :(");
        }
      }.bind(this), 500);
    } else if (isAdminCommentEditing) {
      this.async(function () {
        var point = this.$$("#pointAdminCommentEditor");
        var emoji = this.$$("#pointAdminCommentEmojiSelector");
        if (point && emoji) {
          emoji.inputTarget = point;
        } else {
          console.error("Wide: Can't bind point edit emojis :(");
        }
      }.bind(this), 500);
    }
  }

  _cancelEdit() {
    //this._setlatestContent(this.point);
    this.isEditing = false;
  }

  _saveEdit() {
    this.$$("#editPointAjax").url = "/api/points/"+this.point.id;
    this.$$("#editPointAjax").body = { content: this.editText };
    this.$$("#editPointAjax").generateRequest();
  }

  _cancelAdminCommentEdit () {
    //this._setlatestContent(this.point);
    this.isAdminCommentEditing = false;
  }

  _saveAdminCommentEdit () {
    this.$$("#editAdminCommentPointAjax").url = "/api/groups/"+this.point.Post.Group.id+"/"+this.point.id+"/adminComment";
    this.$$("#editAdminCommentPointAjax").body = { content: this.editAdminCommentText };
    this.$$("#editAdminCommentPointAjax").generateRequest();
  }

  _deletePoint() {
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('point.confirmDelete'), this._reallyDeletePoint.bind(this));
    }.bind(this));
  }

  _reallyDeletePoint() {
    this.$$("#deletePointAjax").url = "/api/points/"+this.point.id;
    this.$$("#deletePointAjax").body = {};
    this.$$("#deletePointAjax").generateRequest();
  }

  _editResponse(event, detail) {
    if (detail.response) {
      const point = detail.response;
      point.latestContent = point.PointRevisions[point.PointRevisions.length-1].content;
      this.point = point;
    }
    this.isEditing = false;
  }

  _editAdminCommentResponse(event, detail) {
    if (detail.response) {
      if (!this.point.public_data)
        this.point.public_data = {};
      this.point.public_data.admin_comment = { text: detail.response.content };
      this.point = JSON.parse(JSON.stringify(this.point));
      this.isAdminCommentEditing = false;
      this.hasAdminComments = true;
    }
    this.isAdminCommentEditing = false;
  }

  _deleteResponse() {
    this.fire("yp-point-deleted", { pointId: this.point.id });
    this.point = null;

  }

  _reportPoint() {
    window.appGlobals.activity('open', 'point.report');
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/points/' + this.point.id + '/report',
        this.t('reportConfirmation'),
        this._onReport.bind(this),
        this.t('point.report'),
        'PUT');
      dialog.open();
    }.bind(this));
  }

  _onReport() {
    window.appGlobals.notifyUserViaToast(this.t('point.report')+': '+this.point.content);
  }

  _editPoint() {
    if (this._hasPointAccess(this.point)) {
      this.editText = this.point.PointRevisions[this.point.PointRevisions.length-1].content;
      this.isEditing = true;
    }
  }


  _editAdminComment() {
    if (this.checkPostAdminOnlyAccess(this.point.Post)) {
      this.editAdminCommentText = (this.point.public_data && this.point.public_data.admin_comment ? this.point.public_data.admin_comment.text : '');
      this.isAdminCommentEditing = true;
    }
  }

  _hasPointAccess(point) {
    return this.checkPointAccess(point);
  }

  _canEditPoint(point) {
    const isEligible = (point && (point.counter_quality_up + point.counter_quality_down) <= this.maxNumberOfPointsBeforeEditFrozen);
    return isEligible && window.appUser && window.appUser.user && window.appUser.user.id==point.user_id;
  }

  _pointChanged(point, previousPoint) {
    this.setupMediaEventListeners(point, previousPoint);
    this._resetMedia();
    if (point) {
      if (point.Post && point.Post.Group && point.Post.Group.configuration && point.Post.Group.configuration.collapsableTranscripts) {
        this.openTranscript = false;
      }
      this.user = this.point.User;
      const videoURL = this._getVideoURL(point.PointVideos);
      const videoPosterURL = this._getVideoPosterURL(point.PointVideos);
      this.portraitVideo = this._isPortraitVideo(point.PointVideos);
      if (videoURL && videoPosterURL) {
        this.videoActive = true;
        this.pointVideoPath = videoURL;
        this.pointImageVideoPath = videoPosterURL;
        this.pointVideoId = point.PointVideos[0].id;
        this.checkTranscriptError = false;
        if (point.checkTranscriptFor==="video" && window.appGlobals.hasTranscriptSupport===true) {
          this.$$("#checkTranscriptStatusAjax").url = "/api/points/"+point.id+'/videoTranscriptStatus';
          this.$$("#checkTranscriptStatusAjax").generateRequest();
          this.checkingTranscript = true;
          point.checkTranscriptFor = null;
        }
      } else {
        const audioURL = this._getAudioURL(point.PointAudios);
        if (audioURL) {
          this.audioActive = true;
          this.pointAudioPath = audioURL;
          this.pointAudioId = point.PointAudios[0].id;
          this.checkTranscriptError = false;
          if (point.checkTranscriptFor==="audio" && window.appGlobals.hasTranscriptSupport===true) {
            this.$$("#checkTranscriptStatusAjax").url = "/api/points/"+point.id+'/audioTranscriptStatus';
            this.$$("#checkTranscriptStatusAjax").generateRequest();
            this.checkingTranscript = true;
            point.checkTranscriptFor = null;
          }
        }
      }
    } else {
      this.user = null;
      this.checkTranscriptError = false;
    }
  }

  _transcriptStatusResponse(event, detail) {
    detail = detail.response;
    if (detail && detail.point) {
      const point = detail.point;
      this.checkingTranscript = false;
      point.latestContent = point.PointRevisions[point.PointRevisions.length-1].content;
      this.point = point;
      this.fire('yp-update-point-in-list', point);
      if (this._hasPointAccess(point)) {
        this.editText = point.latestContent;
        this.isEditing = true;
      }
      this.async(function () {
        this.fire('iron-resize');
      });
    } else if (detail && detail.inProgress) {
      this.async(function () {
        this.$$("#checkTranscriptStatusAjax").generateRequest();
      }, 2000);
    } else if (detail && detail.error) {
      this.checkingTranscript = false;
      this.checkTranscriptError = true;
    } else {
      this.checkingTranscript = false;
    }
  }

  _resetMedia() {
    this.videoActive = false;
    this.pointVideoPath = null;
    this.pointImageVideoPath = null;
    this.pointVideoId = null;
    this.audioActive = false;
    this.pointAudioPath = null;
    this.pointAudioId = null;
  }

  loginName() {
    return this.point.User.name;
  }

  upVote(point) {
    if (point) {
      if (point.value == 0) {
        return true;
      } else {
        return point.value>0;
      }
    } else {
      console.warn("Can't find point for upVote");
      return false;
    }
  }

  downVote(point) {
    if (point) {
      if (point.value == 0) {
        return true;
      } else {
        return point.value<0;
      }
    } else {
      console.warn("Can't find point for upVote");
      return false;
    }
  }

  computeClass(point) {
    let ret = 'description ';
    if (point) {
      if (point.value>0)
        ret += 'for';
      else
        ret += 'against';
      return ret;
    } else {
      console.warn("Can't find point for upVote");
      return ret;
    }
  }
}

window.customElements.define('yp-point-lit', YpPointLit)