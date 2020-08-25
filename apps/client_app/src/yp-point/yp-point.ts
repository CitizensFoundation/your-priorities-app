/* eslint-disable @typescript-eslint/camelcase */
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';

import { YpCollection } from '../yp-collection/yp-collection.js';
import { customElement, html, property, LitElement, css } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';

import '@material/mwc-textarea';
import '@material/mwc-linear-progress';
import '@material/mwc-radio';
import { Radio } from '@material/mwc-radio';
import { Menu } from '@material/mwc-menu';

import '../yp-post/yp-posts-list.js';
import '../yp-file-upload/yp-file-upload.js';
import '../@yrpri/yp-emoji-selector.js';
import '../yp-post/yp-post-card-add.js';
import { YpFormattingHelpers } from '../@yrpri/YpFormattingHelpers.js';
import { YpBaseElementWithLogin } from '../@yrpri/yp-base-element-with-login.js';
import { RangeChangeEvent } from 'lit-virtualizer';
import { YpMagicText } from '../yp-magic-text/yp-magic-text.js';
import { ifDefined } from 'lit-html/directives/if-defined';
import { YpEmojiSelector } from '../@yrpri/yp-emoji-selector.js';
import { Select } from '@material/mwc-select';
import { YpFileUpload } from '../yp-file-upload/yp-file-upload.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';

@customElement('yp-point')
export class YpPoint extends YpBaseElementWithLogin {
  @property({ type: Object })
  point!: YpPointData;

  @property({ type: Object })
  user: YpUserData | undefined;

  @property({ type: Boolean })
  linkPoint = false;

  @property({ type: Boolean })
  openTranscript = true;

  @property({ type: Boolean })
  hideUser = false;
  @property({ type: Boolean })
  hideActions = false;

  @property({ type: Boolean })
  isEditing = false;

  @property({ type: Boolean })
  isAdminCommentEditing = false;

  @property({ type: Boolean })
  hasAdminComments = false;

  @property({ type: Number })
  maxNumberOfPointsBeforeEditFrozen = 5;

  @property({ type: String })
  editText: string | undefined;

  @property({ type: String })
  editAdminCommentText: string | undefined;

  @property({ type: Boolean })
  videoActive = false;

  @property({ type: String })
  pointVideoPath: string | undefined;

  @property({ type: String })
  pointImageVideoPath: string | undefined;

  @property({ type: Number })
  pointVideoId: number | undefined;

  @property({ type: Boolean })
  audioActive = false;

  @property({ type: String })
  pointAudioPath: string | undefined;

  @property({ type: Number })
  pointAudioId: number | undefined;

  @property({ type: Boolean })
  checkingTranscript = false;

  @property({ type: Boolean })
  portraitVideo = false;

  @property({ type: Boolean })
  checkTranscriptError = false;

  static get propersties() {
    return {
      point: {
        type: Object,
        notify: true,
        observer: '_pointChanged',
      },

      isEditing: {
        type: Boolean,
        value: false,
        observer: '_isEditingChanged',
      },

      isAdminCommentEditing: {
        type: Boolean,
        value: false,
        observer: '_isAdminCommentEditingChanged',
      },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .point-content {
          padding-right: 16px;
          padding-left: 16px;
          margin-top: 16px;
        }

        #pointContentTranscript,
        #pointContent {
          cursor: default;
        }

        #pointContentTranscript,
        #pointContent[link-point] {
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
          border-bottom-color: var(--master-point-up-color);
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

        iron-image,
        video {
          width: 398px;
          height: 224px;
          margin: 0;
          padding: 0;
        }

        @media (max-width: 600px) {
          iron-image,
          video {
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

        #pointContentEditor,
        #pointAdminCommentEditor {
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
          color: #f00;
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
      `,
    ];
  }

  render() {
    return html`
      <lite-signal
        @lite-signal-got-admin-rights="${this._gotAdminRights}"></lite-signal>
      <lite-signal @lite-signal-logged-in="${this._userLoggedIn}"></lite-signal>
      <lite-signal
        @lite-signal-yp-pause-media-playback="${this
          ._pauseMediaPlayback}"></lite-signal>

      <div class="layout vertical">
        <div
          class="userInfoContainer layout horizontal"
          ?up-vote="${this.isUpVote()}"
          ?down-vote="${this.isDownVote()}"
          ?hidden="${this.hideUser}">
          <iron-icon
            .icon="thumb-up"
            class="thumbsIcon thumbsIconUp"
            ?hidden="${!this.isUpVote()}"></iron-icon>
          <iron-icon
            .icon="thumb-down"
            class="thumbsIcon thumbsIconDown"
            ?hidden="${this.isUpVote}"></iron-icon>
          <div
            class="layout horizontal"
            ?hidden="${this.point.Post!.Group.configuration.hidePointAuthor}">
            <yp-user-with-organization
              .titleDate="${this.point.created_at}"
              inverted
              .user="${this.user}"></yp-user-with-organization>
          </div>
        </div>

        <div class="layout vertical">
          <div class="topContainer" ?portrait="${this.portraitVideo}">
            ${this.videoActive && this.pointVideoPath
              ? html`
                  <div class="layout horizontal center-center">
                    <video
                      id="videoPlayer"
                      portrait="${this.portraitVideo}"
                      .data-id="${this.pointVideoId}"
                      controls
                      preload="none"
                      class="video"
                      .src="${this.pointVideoPath}"
                      playsinline
                      .poster="${this.pointImageVideoPath
                        ? this.pointImageVideoPath
                        : ''}"></video>
                  </div>
                `
              : nothing}
          </div>

          ${this.audioActive && this.pointAudioPath
            ? html`
                <div class="layout vertical center-center">
                  <audio
                    id="audioPlayer"
                    .data-id="${this.pointAudioId}"
                    controls
                    preload="metadata"
                    class="audio"
                    .src="${this.pointAudioPath}"
                    playsinline></audio>
                </div>
              `
            : nothing}
          ${this.videoOrAudioActive
            ? html`
                ${this.checkingTranscript
                  ? html`
                      <div
                        class="layout vertical center-center checkTranscript">
                        <div>${this.t('checkingForTranscript')}</div>
                        <paper-spinner active></paper-spinner>
                      </div>
                    `
                  : nothing}

                <div
                  class="transcriptError layout horizontal center-center"
                  ?hidden="${!this.checkTranscriptError}">
                  ${this.t('checkTranscriptError')}
                </div>

                ${this.point.latestContent
                  ? html`
                      <div class="transcriptText layout vertical center-center">
                        <div class="layout horizontal">
                          <div class="transcriptHeader">
                            ${this.t('automaticTranscript')}
                          </div>
                          <div
                            hidden$="[[!point.Post.Group.configuration.collapsableTranscripts]]">
                            <paper-icon-button
                              title="${this.t('openComments')}"
                              class="openCloseButton"
                              icon="keyboard-arrow-right"
                              @click="${this._setOpen}"
                              hidden$="[[openTranscript]]"></paper-icon-button>
                            <paper-icon-button
                              title="${this.t('closeComments')}"
                              class="openCloseButton"
                              icon="keyboard-arrow-down"
                              @click="${this._setClosed}"
                              hidden$="[[!openTranscript]]"></paper-icon-button>
                          </div>
                        </div>
                        <div
                          id="pointContentTranscript"
                          .linkPoint="${this.linkPoint}"
                          ?hidden="${this.isEditing}"
                          @tap="${this._linkIfNeeded}">
                          <yp-magic-text
                            ?hidden="${!this.openTranscript}"
                            simpleFormat
                            textType="pointContent"
                            .contentLanguage="${this.point.language}"
                            .content="${this.point.latestContent}"
                            .contentId="${this.point.id}">
                          </yp-magic-text>
                        </div>
                      </div>
                    `
                  : nothing}
              `
            : html`
                <div class="point-content layout vertical ">
                  <span ?hidden="${!this.point.name}">
                    <span>${this.point.name}</span>.
                  </span>
                  <div
                    id="pointContent"
                    .linkPoint="${this.linkPoint}"
                    ?hidden="${this.isEditingSomething}"
                    @tap="${this._linkIfNeeded}">
                    <yp-magic-text
                      simpleFormat
                      textType="pointContent"
                      .contentLanguage="${this.point.language}"
                      .content="${this.point.latestContent}"
                      .contentId="${this.point.id}">
                    </yp-magic-text>
                  </div>
                </div>
              `}
          ${this.showAdminComments
            ? html`
                <div
                  class="commentFromAdmin"
                  ?hidden="${this.isEditingSomething}">
                  ${this.point.Post.Group.configuration.customAdminCommentsTitle
                    ? html`
                        <yp-magic-text
                          .textType="customAdminCommentsTitle"
                          .contentLanguage="${this.point.Post!.Group.language}"
                          .content="${this.point.Post!.Group.configuration
                            .customAdminCommentsTitle}"
                          .contentId="${this.point.Post!.Group.id}">
                        </yp-magic-text>
                      `
                    : ``}
                  ${!this.point.Post!.Group.configuration
                    .customAdminCommentsTitle
                    ? html` ${this.t('commentFromAdmin')} `
                    : ``}
                </div>
                <div
                  id="pointAdminCommentContent"
                  ?link-point="${this.linkPoint}"
                  ?hidden="${this.isEditingSomething}"
                  @click="${this._linkIfNeeded}">
                  <yp-magic-text
                    simple-format
                    textType="pointAdminCommentContent"
                    .contentLanguage="${this.point.public_data?.admin_comment?.language}"
                    .content="${this.point.public_data?.admin_comment?.text}"
                    .contentId="${this.point.id}">
                  </yp-magic-text>
                </div>
              `
            : ''}
          ${this.isEditing
            ? html`
                <div class="layout vertical">
                  <paper-textarea
                    id="pointContentEditor"
                    char-counter
                    .maxlength="1500"
                    .value="${this.editText}"></paper-textarea>
                  <div class="horizontal end-justified layout">
                    <emoji-selector id="pointEmojiSelector"></emoji-selector>
                  </div>
                  <div class="layout horizontal self-end">
                    <mwc-button
                      @click="${this._cancelEdit}"
                      .label="${this.t('cancel')}"></mwc-button>
                    <mwc-button
                      @click="${this._saveEdit}"
                      .label="${this.t('update')}"></mwc-button>
                  </div>
                </div>
              `
            : nothing}

          <div
            class="layout horizontal actionContainer"
            ?hidden="${this.hideActions}">
            <yp-point-actions
              .point="${this.point}"
              .pointUrl="${this.pointUrl}"
              ?allowWhatsAppSharing="${this.point.Post.Group.configuration
                .allowWhatsAppSharing}"></yp-point-actions>
            <paper-icon-button
              .title="${this.t('point.report')}"
              id="reportPointIconButton"
              .icon="warning"
              @tap="${this._reportPoint}"></paper-icon-button>
            <div class="flex"></div>

            ${this.hasPointAccess
              ? html`
                  <div class="layout horizontal self-end" ?hidden="">
                    <yp-ajax
                      id="editPointAjax"
                      .method="PUT"
                      @response="${this._editResponse}"></yp-ajax>
                    <yp-ajax
                      id="editAdminCommentPointAjax"
                      method="PUT"
                      @response="${this._editAdminCommentResponse}"></yp-ajax>
                    <yp-ajax
                      id="deletePointAjax"
                      .method="DELETE"
                      @response="${this._deleteResponse}"></yp-ajax>
                    <paper-icon-button
                      title="${this.t('editAdminComment')}"
                      ?hidden="${!this.hasAdminCommentAccess}"
                      icon="comment"
                      @click="${this._editAdminComment}"></paper-icon-button>
                    <paper-icon-button
                      title="${this.t('edit')}"
                      ?hidden="${!this.canEditPoint}"
                      .icon="create"
                      @click="${this._editPoint}"></paper-icon-button>
                    <paper-icon-button
                      title="${this.t('delete')}"
                      .icon="clear"
                      @click="${this._deletePoint}"></paper-icon-button>
                  </div>
                `
              : nothing}

            <yp-ajax
              ?hidden=""
              id="checkTranscriptStatusAjax"
              @response="${this._transcriptStatusResponse}"></yp-ajax>
          </div>
        </div>
      </div>
    `;
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

  _setOpen() {
    this.openTranscript = true;
    setTimeout(() => {
      this.fire('yp-iron-resize');
      this.requestUpdate();
    }, 20);
  }

  _setClosed() {
    this.openTranscript = false;
    setTimeout(() => {
      this.fire('yp-iron-resize');
      this.requestUpdate();
    }, 20);
  }

  get isEditingSomething() {
    return this.isEditing || this.isAdminCommentEditing;
  }

  get showAdminComments() {
    if (
      this.point &&
      this.point.Post &&
      this.point.Post.Group &&
      this.point.public_data &&
      this.point.public_data.admin_comment &&
      this.point.public_data.admin_comment.text &&
      this.point.Post.Group.configuration &&
      this.point.Post.Group.configuration.allowAdminAnswersToPoints
    ) {
      return true;
    } else {
      return false;
    }
  }

  get hasAdminCommentAccess() {
    if (
      this.point &&
      this.point.Post &&
      this.point.Post.Group &&
      YpAccessHelpers.checkPostAdminOnlyAccess(this.point.Post) &&
      this.point.Post.Group.configuration &&
      this.point.Post.Group.configuration.allowAdminAnswersToPoints
    ) {
      return true;
    } else {
      return false;
    }
  }

  get videoOrAudioActive() {
    return this.videoActive || this.audioActive;
  }

  _isEditingChanged() {
    this._updateEmojiBindings();
  }

  _isAdminCommentEditingChanged() {
    this._updateEmojiBindings();
  }

  _shareTap(event: CustomEvent) {
    window.appGlobals.activity(
      'pointShareOpen',
      event.detail.brand,
      this.point.id
    );
  }

  get pointUrl() {
    if (this.point && this.point.Post) {
      return (
        window.location.protocol +
        '//' +
        window.location.hostname +
        '/post/' +
        this.point.Post.id +
        '/' +
        this.point.id
      );
    }
  }

  _linkIfNeeded() {
    if (this.linkPoint && this.point.Post) {
      YpNavHelpers.goToPost(this.point.Post.id, this.point.id);
    }
  }

  _updateEmojiBindings() {
    if (this.isEditing) {
      setTimeout(() => {
        const point = this.$$('#pointContentEditor') as HTMLInputElement;
        const emoji = this.$$('#pointEmojiSelector') as YpEmojiSelector;
        if (point && emoji) {
          emoji.inputTarget = point;
        } else {
          console.error("Wide: Can't bind point edit emojis :(");
        }
      }, 500);
    } else if (this.isAdminCommentEditing) {
      setTimeout(() => {
        const point = this.$$('#pointAdminCommentEditor') as HTMLInputElement;
        const emoji = this.$$(
          '#pointAdminCommentEmojiSelector'
        ) as YpEmojiSelector;
        if (point && emoji) {
          emoji.inputTarget = point;
        } else {
          console.error("Wide: Can't bind point edit emojis :(");
        }
      }, 500);
    }
  }

  _cancelEdit() {
    //this._setlatestContent(this.point);
    this.isEditing = false;
  }

  _saveEdit() {
    this.$$('#editPointAjax').url = '/api/points/' + this.point.id;
    this.$$('#editPointAjax').body = { content: this.editText };
    this.$$('#editPointAjax').generateRequest();
  }

  _cancelAdminCommentEdit() {
    //this._setlatestContent(this.point);
    this.isAdminCommentEditing = false;
  }

  _saveAdminCommentEdit() {
    this.$$('#editAdminCommentPointAjax').url =
      '/api/groups/' +
      this.point.Post.Group.id +
      '/' +
      this.point.id +
      '/adminComment';
    this.$$('#editAdminCommentPointAjax').body = {
      content: this.editAdminCommentText,
    };
    this.$$('#editAdminCommentPointAjax').generateRequest();
  }

  _deletePoint() {
    window.appDialogs.getDialogAsync('confirmationDialog', dialog => {
      dialog.open(
        this.t('point.confirmDelete'),
        this._reallyDeletePoint.bind(this)
      );
    });
  }

  _reallyDeletePoint() {
    this.$$('#deletePointAjax').url = '/api/points/' + this.point.id;
    this.$$('#deletePointAjax').body = {};
    this.$$('#deletePointAjax').generateRequest();
  }

  _editResponse(event: CustomEvent) {
    if (event.detail.response) {
      const point = event.detail.response;
      point.latestContent =
        point.PointRevisions[point.PointRevisions.length - 1].content;
      this.point = point;
    }
    this.isEditing = false;
  }

  _editAdminCommentResponse(event, detail) {
    if (detail.response) {
      if (!this.point.public_data) this.point.public_data = {};
      this.point.public_data.admin_comment = { text: detail.response.content };
      this.point = JSON.parse(JSON.stringify(this.point));
      this.isAdminCommentEditing = false;
      this.hasAdminComments = true;
    }
    this.isAdminCommentEditing = false;
  }

  _deleteResponse() {
    this.fire('yp-point-deleted', { pointId: this.point.id });
    //TODO: Check if we need this
    //this.point = undefined;
  }

  _reportPoint() {
    window.appGlobals.activity('open', 'point.report');
    /*window.appDialogs.getDialogAsync("apiActionDialog", (dialog)  => {
      dialog.setup('/api/points/' + this.point.id + '/report',
        this.t('reportConfirmation'),
        this._onReport.bind(this),
        this.t('point.report'),
        'PUT');
      dialog.open();
    });*/
  }

  _onReport() {
    window.appGlobals.notifyUserViaToast(
      this.t('point.report') + ': ' + this.point.content
    );
  }

  _editPoint() {
    if (this.hasPointAccess && this.point.PointRevisions) {
      this.editText = this.point.PointRevisions[
        this.point.PointRevisions.length - 1
      ].content;
      this.isEditing = true;
    }
  }

  _editAdminComment() {
    if (
      this.point.Post &&
      YpAccessHelpers.checkPostAdminOnlyAccess(this.point.Post)
    ) {
      this.editAdminCommentText =
        this.point.public_data && this.point.public_data.admin_comment
          ? this.point.public_data.admin_comment.text
          : '';
      this.isAdminCommentEditing = true;
    }
  }

  get hasPointAccess() {
    return YpAccessHelpers.checkPointAccess(this.point);
  }

  get canEditPoint() {
    const isEligible =
      this.point &&
      this.point.counter_quality_up + this.point.counter_quality_down <=
        this.maxNumberOfPointsBeforeEditFrozen;
    return (
      isEligible &&
      window.appUser &&
      window.appUser.user &&
      this.point &&
      window.appUser.user.id == this.point.user_id
    );
  }

  _pointChanged(point, previousPoint) {
    this.setupMediaEventListeners(point, previousPoint);
    this._resetMedia();
    if (point) {
      if (
        point.Post &&
        point.Post.Group &&
        point.Post.Group.configuration &&
        point.Post.Group.configuration.collapsableTranscripts
      ) {
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
        if (
          point.checkTranscriptFor === 'video' &&
          window.appGlobals.hasTranscriptSupport === true
        ) {
          this.$$('#checkTranscriptStatusAjax').url =
            '/api/points/' + point.id + '/videoTranscriptStatus';
          this.$$('#checkTranscriptStatusAjax').generateRequest();
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
          if (
            point.checkTranscriptFor === 'audio' &&
            window.appGlobals.hasTranscriptSupport === true
          ) {
            this.$$('#checkTranscriptStatusAjax').url =
              '/api/points/' + point.id + '/audioTranscriptStatus';
            this.$$('#checkTranscriptStatusAjax').generateRequest();
            this.checkingTranscript = true;
            point.checkTranscriptFor = null;
          }
        }
      }
    } else {
      this.user = undefined;
      this.checkTranscriptError = false;
    }
  }

  _transcriptStatusResponse(event: CustomEvent) {
    const detail = event.detail.response;
    if (detail && detail.point) {
      const point = detail.point;
      this.checkingTranscript = false;
      point.latestContent =
        point.PointRevisions[point.PointRevisions.length - 1].content;
      this.point = point;
      this.fire('yp-update-point-in-list', point);
      if (this.hasPointAccess) {
        this.editText = point.latestContent;
        this.isEditing = true;
      }
      this.requestUpdate();
    } else if (detail && detail.inProgress) {
      setTimeout(() => {
        this.$$('#checkTranscriptStatusAjax').generateRequest();
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
    this.pointVideoPath = undefined;
    this.pointImageVideoPath = undefined;
    this.pointVideoId = undefined;
    this.audioActive = false;
    this.pointAudioPath = undefined;
    this.pointAudioId = undefined;
  }

  loginName() {
    if (this.point.User) {
      return this.point.User.name;
    }
  }

  isUpVote() {
    if (this.point) {
      if (this.point.value == 0) {
        return true;
      } else {
        return this.point.value > 0;
      }
    } else {
      console.warn("Can't find point for isUpVote");
      return false;
    }
  }

  isDownVote() {
    if (this.point) {
      if (this.point.value == 0) {
        return true;
      } else {
        return this.point.value < 0;
      }
    } else {
      console.warn("Can't find point for isDownVote");
      return false;
    }
  }
}
