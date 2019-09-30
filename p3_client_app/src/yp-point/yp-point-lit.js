import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-input/paper-textarea.js';
import 'lite-signal/lite-signal.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
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
      },
    }
  }

  static get styles() {
    return [
      css`

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

      #pointContentEditor {
        padding-left: 8px;
        padding-right: 8px;
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
        color: #444;
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
    `, YpFlexLayout]
  }
  
  render() {
    return html`
    ${this.point ? html`
      <div class="layout vertical">
        <div class="userInfoContainer layout horizontal" up-vote="${this.upVote(point)}" down-vote="${this.downVote(point)}" hidden="${this.hideUser}">
          <iron-icon icon="thumb-up" class="thumbsIcon thumbsIconUp" hidden="${!this.pointValueUp}"></iron-icon>
          <iron-icon icon="thumb-down" class="thumbsIcon thumbsIconDown" hidden="${this.pointValueUp}"></iron-icon>
          <div class="layout horizontal" hidden="${this.point.Post.Group.configuration.hidePointAuthor}">
            <yp-user-with-organization title-date="${this.point.created_at}" inverted="" user="${this.user}"></yp-user-with-organization>
          </div>
        </div>

        <div class="layout vertical">
          <div class="topContainer" portrait="${this.portraitVideo}">
            <template is="dom-if" if="${this.videoActive}" restamp="">
              <div class="layout horizontal center-center">
                <video id="videoPlayer" portrait="${this.portraitVideo}" data-id="${this.pointVideoId}" controls="" preload="none" class="video" src="${this.pointVideoPath}" playsinline="" poster="${this.pointImageVideoPath}"></video>
              </div>
            </template>
          </div>

          <template is="dom-if" if="${this.audioActive}" restamp="">
            <div class="layout vertical center-center">
              <audio id="audioPlayer" data-id="${this.pointAudioId}" controls="" preload="meta" class="audio" src="${this.pointAudioPath}" playsinline=""></audio>
            </div>
          </template>

          <template is="dom-if" if="${this.videoOrAudioActive}">
            <template is="dom-if" if="${checkingTranscript}">
              <div class="layout vertical center-center checkTranscript">
                <div>${this.t('checkingForTranscript')}</div>
                <paper-spinner active=""></paper-spinner>
              </div>
            </template>
            <div class="transcriptError layout horizontal center-center" hidden="${!this.checkTranscriptError}">
              ${this.t('checkTranscriptError')}
            </div>
            <template is="dom-if" if="${this.point.latestContent}">
              <div class="transcriptText layout vertical center-center">
                <div class="transcriptHeader">${this.t('automaticTranscript')}</div>
                <div id="pointContentTranscript" link-point="${this.linkPoint}" hidden="${this.isEditing}" on-tap="_linkIfNeeded">
                  <yp-magic-text simple-format="" text-type="pointContent" content-language="${this.point.language}" content="${this.point.latestContent}" content-id="${this.point.id}">
                  </yp-magic-text>
                </div>
              </div>
            </template>
          </template>

          <template is="dom-if" if="${!this.videoOrAudioActive}">
            <div class="point-content layout vertical ">
              <span hidden="${!this.point.name}">
                <span>${this.point.name}</span>.
              </span>
              <div id="pointContent" link-point="${this.linkPoint}" hidden="${this.isEditing}" on-tap="_linkIfNeeded">
                <yp-magic-text simple-format="" text-type="pointContent" content-language="${this.point.language}" content="${this.point.latestContent}" content-id="${this.point.id}">
                </yp-magic-text>
              </div>
            </div>
          </template>
          <template is="dom-if" if="${this.isEditing}" restamp="">
            <div class="layout vertical">
              <paper-textarea id="pointContentEditor" char-counter="" maxlength="500" value="${this.editText}"></paper-textarea>
              <div class="horizontal end-justified layout">
                <emoji-selector id="pointEmojiSelector"></emoji-selector>
              </div>
              <div class="layout horizontal self-end">
                <paper-button on-tap="_cancelEdit">${this.t('cancel')}</paper-button>
                <paper-button on-tap="_saveEdit">${this.t('update')}</paper-button>
              </div>
            </div>
          </template>
          <div class="layout horizontal actionContainer" hidden="${this.hideActions}">
            <yp-point-actions point="${this.point}" point-url="${this.pointUrl}"></yp-point-actions>
            <paper-icon-button title="${this.t('point.report')}" id="reportPointIconButton" icon="warning" on-tap="_reportPoint"></paper-icon-button>
            <div class="flex"></div>
            <template is="dom-if" if="${this.hasPointAccess}">
              <div class="layout horizontal self-end" hidden="">
                <yp-ajax id="editPointAjax" method="PUT" on-response="_editResponse"></yp-ajax>
                <yp-ajax id="deletePointAjax" method="DELETE" on-response="_deleteResponse"></yp-ajax>
                <paper-icon-button title="${this.t('edit')}" hidden="${!this.canEditPoint}" icon="create" on-tap="_editPoint"></paper-icon-button>
                <paper-icon-button title="${this.t('delete')}" icon="clear" on-tap="_deletePoint"></paper-icon-button>
              </div>
            </template>
            <yp-ajax hidden="" id="checkTranscriptStatusAjax" on-response="_transcriptStatusResponse"></yp-ajax>
          </div>
        </div>
      </div>
  ` : html``}
  `
  }

/*
  behaviors: [
    ypLanguageBehavior,
    AccessHelpers,
    ypLoggedInUserBehavior,
    ypGotAdminRightsBehavior,
    ypGotoBehavior,
    ypMediaFormatsBehavior
  ],
*/
  _videoOrAudioActive(videoActive, audioActive) {
    return videoActive || audioActive;
  }

  _isEditingChanged(value) {
    this._updateEmojiBindings(value);
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

  _updateEmojiBindings(isEditing) {
    if (isEditing) {
      this.async(function () {
        var point = this.$$("#pointContentEditor");
        var emoji = this.$$("#pointEmojiSelector");
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
    this.set('isEditing', false);
  }

  _saveEdit() {
    this.$$("#editPointAjax").url = "/api/points/"+this.point.id;
    this.$$("#editPointAjax").body = { content: this.editText };
    this.$$("#editPointAjax").generateRequest();
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
      var point = detail.response;
      point.latestContent = point.PointRevisions[point.PointRevisions.length-1].content;
      this.set('point', point);
    }
    this.set('isEditing', false);
  }

  _deleteResponse() {
    this.fire("yp-point-deleted", { pointId: this.point.id });
    this.set('point', null);

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
      this.set('editText', this.point.PointRevisions[this.point.PointRevisions.length-1].content);
      this.set('isEditing', true);
    }
  }

  _hasPointAccess(point) {
    return this.checkPointAccess(point);
  }

  _canEditPoint(point) {
    var isEligible = (point && (point.counter_quality_up + point.counter_quality_down) <= this.maxNumberOfPointsBeforeEditFrozen);
    return isEligible && window.appUser && window.appUser.user && window.appUser.user.id==point.user_id;
  }

  _pointChanged(point, previousPoint) {
    this.setupMediaEventListeners(point, previousPoint);
    this._resetMedia();
    if (point) {
      this.set('user', this.point.User);
      var videoURL = this._getVideoURL(point.PointVideos);
      var videoPosterURL = this._getVideoPosterURL(point.PointVideos);
      this.set('portraitVideo', this._isPortraitVideo(point.PointVideos));
      if (videoURL && videoPosterURL) {
        this.set('videoActive', true);
        this.set('pointVideoPath', videoURL);
        this.set('pointImageVideoPath', videoPosterURL);
        this.set('pointVideoId', point.PointVideos[0].id);
        this.set('checkTranscriptError', false);
        if (point.checkTranscriptFor==="video" && window.appGlobals.hasTranscriptSupport===true) {
          this.$.checkTranscriptStatusAjax.url = "/api/points/"+point.id+'/videoTranscriptStatus';
          this.$.checkTranscriptStatusAjax.generateRequest();
          this.set('checkingTranscript', true);
          point.checkTranscriptFor = null;
        }
      } else {
        var audioURL = this._getAudioURL(point.PointAudios);
        if (audioURL) {
          this.set('audioActive', true);
          this.set('pointAudioPath', audioURL);
          this.set('pointAudioId', point.PointAudios[0].id);
          this.set('checkTranscriptError', false);
          if (point.checkTranscriptFor==="audio" && window.appGlobals.hasTranscriptSupport===true) {
            this.$.checkTranscriptStatusAjax.url = "/api/points/"+point.id+'/audioTranscriptStatus';
            this.$.checkTranscriptStatusAjax.generateRequest();
            this.set('checkingTranscript', true);
            point.checkTranscriptFor = null;
          }
        }
      }
    } else {
      this.set('user', null);
      this.set('checkTranscriptError', false);
    }
  }

  _transcriptStatusResponse(event, detail) {
    detail = detail.response;
    if (detail && detail.point) {
      var point = detail.point;
      this.set('checkingTranscript', false);
      point.latestContent = point.PointRevisions[point.PointRevisions.length-1].content;
      this.set('point', point);
      this.fire('yp-update-point-in-list', point);
      if (this._hasPointAccess(point)) {
        this.set('editText',  point.latestContent);
        this.set('isEditing', true);
      }
      this.async(function () {
        this.fire('iron-resize');
      });
    } else if (detail && detail.inProgress) {
      this.async(function () {
        this.$.checkTranscriptStatusAjax.generateRequest();
      }, 2000);
    } else if (detail && detail.error) {
      this.set('checkingTranscript', false);
      this.set('checkTranscriptError', true);
    } else {
      this.set('checkingTranscript', false);
    }
  }

  _resetMedia() {
    this.set('videoActive', false);
    this.set('pointVideoPath', null);
    this.set('pointImageVideoPath', null);
    this.set('pointVideoId', null);
    this.set('audioActive', false);
    this.set('pointAudioPath', null);
    this.set('pointAudioId', null);
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
    var ret = 'description ';
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