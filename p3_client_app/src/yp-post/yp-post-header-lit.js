import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import 'neon-animation-polymer-3/web-animations.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '../yp-app-globals/yp-app-icons.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { ypGotAdminRightsBehavior } from '../yp-behaviors/yp-got-admin-rights-behavior.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import '../yp-user/yp-user-with-organization.js';
import '../yp-magic-text/yp-magic-text.js';
import './yp-post-actions.js';
import './yp-post-cover-media.js';
import { YpPostBehavior } from './yp-post-behaviors.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

class YpPostHeaderLit extends YpBaseElement {
  static get properties() {
    return {
      selectedMenuItem: {
        type: String
      },

      headerMode: {
        type: Boolean,
        value: false
      },

      elevation: {
        type: Number,
        value: 1
      },

      post: {
        type: Object,
        observer: '_postChanged'
      },

      hasPostAccess: {
        type: Boolean,
        value: false,
        notify: true,
        computed: '_hasPostAccess(post, gotAdminRights)'
      },

      structuredAnswersFormatted: {
        type: String,
        computed: '_structuredAnswersFormatted(post)'
      },

      isEditing: {
        type: Boolean,
        value: false,
        observer: '_isEditingChanged'
      },

      editText: String,

      checkingTranscript: {
        type: Boolean,
        value: false
      },

      checkTranscriptError: {
        type: Boolean,
        value: false
      },

      isAudioCover: {
        type: Boolean,
        value: false
      },

      hideActions: {
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

        .infoContainer {
          color: var(--primary-color-more-darker, #111);
          line-height: var(--description-line-height, 1.3);
          width: 540px;
          padding: 0px;
          padding-bottom: 0;
          padding-top: 16px;
        }

        .voting {
          text-align: center;
          padding-left: 16px;
          padding-right: 24px;
        }

        .card-actions {
        }

        .edit {
          color: #eee;
          position: absolute;
          top: 0;
          right: 0;
          padding-right: 0;
          margin-right: 0;
        }


        .category-icon {
          width: 100px;
          height: 100px;
        }

        .category-image-container {
          text-align: right;
          margin-top: -52px;
        }

        .postCardCursor {
          cursor: pointer;
        }

        yp-post-cover-media {
          position: relative;
          width: 420px;
          height: 236px;
        }

        yp-post-cover-media[audio-cover] {
          height: 90px;
        }

        .transcriptContainer {
          width: 420px;
          max-width: 420px;
        }

        .postCard {
          width: 960px;
          background-color: #fff;
          position: relative;
          border-radius: 4px;
        }

        .description {
          padding-bottom: 2px;
          padding-left: 16px;
          padding-right: 16px;
        }


        .mobileName {
          display: none;
        }

        .shareIcon {
          position: absolute;
          --paper-share-button-icon-color: #656565;
          --paper-share-button-icon-height: 42px;
          --paper-share-button-icon-width: 42px;
          text-align: right;
          width: 44px;
          height: 44px;
          right: 42px;
          bottom: 3px;
        }

        .postActions {
          position: absolute;
          right: 92px;
          bottom: 2px;
        }

        .moreVert {
          position: absolute;
          bottom: 4px;
          right: 2px;
          margin: 0;
          padding: 0;
        }

        .moreVertButton {
          color: #656565;
          width: 46px;
          height: 46px;
        }

        .customRatings {
          position: absolute;
          bottom: 12px;
          right: 85px;
        }

        @media (max-width: 960px) {
          .moreVert {
            position: absolute;
            top: 4px;
            bottom: initial;
            right: 2px;
          }

          .description[has-custom-ratings] {
            padding-bottom: 18px;
          }

          .customRatings {
            right: 46px;
          }

          .mobileName {
            margin-right: 38px;
          }

          .shareIcon {
            right: 8px;
            bottom: 2px;
          }

          .postActions {
            right: 55px;
            bottom: 2px;
          }


          .infoContainer {
            padding-bottom: 16px;
            padding-top: 16px;
          }

          .mobileName {
            display: block;
          }

          .desktopName {
            display: none;
          }

          :host {
            max-width: 600px;
          }

          .postCard {
            width: 100%;
          }

          yp-post-cover-media {
            width: 100% !important;
          }

          .coverContainer {
            width: 100%;
          }

          .transcriptContainer {
            width: 100%;
            max-width: 100%;
          }

          .voting {
            padding-left: 0;
            padding-right: 0;
          }

          .card-content {
            width: 100% !important;
            padding-bottom: 16px;
          }

          .infoContainer {
            width: 100%;
            margin-bottom: 32px;
          }

          .description {
            margin-bottom: 8px;
            margin-top: 8px;
          }

          .mediaAndInfoContainer {
          }
        }

        @media (max-width: 800px) {
          .post-name {
          }

          :host {
            max-width: 423px;
            width: 100%;
          }

          yp-post-cover-media {
            height: 230px;
          }

        }

        @media (max-width: 430px) {
          :host {
            width: 100%;
          }

          .postCard {
            width: 100% !important;
            margin: 8px;
            margin-top: 4px;
          }

          yp-post-cover-media {
            height: 225px;
          }

          .post-name {
          }

          .headerTopLevel {
            width: 100%;
          }

          .description {
            padding-bottom: 8px;
          }
        }

        @media (max-width: 375px) {
          yp-post-cover-media[header-mode] {
            height: 207px;
          }
          yp-post-cover-media[audio-cover] {
            height: 80px;
          }
        }

        @media (max-width: 360px) {
          yp-post-cover-media[header-mode] {
            height: 200px;
          }
          yp-post-cover-media[audio-cover] {
            height: 90px;
          }
        }

        @media (max-width: 320px) {
          yp-post-cover-media[header-mode] {
            height: 180px;
          }
          yp-post-cover-media[audio-cover] {
            height: 90px;
          }
        }

        [hidden] {
          display: none !important;
        }


        #postTranscriptionEditor {
          padding-left: 8px;
          padding-right: 8px;
        }

        .transcriptError {
          margin-top: 8px;
          margin-bottom: 8px;
          color: #F00;post-name
        }

        paper-spinner {
          margin-top: 8px;
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
          margin-bottom: 8px;
        }

        .transcriptHeader {
          color: #222;
          margin-bottom: 2px;
          font-style: normal;
        }

        .editIcon {
          color: #656565;
        }

        @media (min-width: 960px) {
          yp-post-cover-media[has-transcript][audio-cover] {
            margin-bottom: 16px;
          }
        }`, YpFlexLayout];
  }

  render() {
    return html`
    <lite-signal @lite-signal-logged-in="${this._userLoggedIn}"></lite-signal>

    <div class="layout horizontal center-center">
      <paper-material class="postCard layout-wrap layout-horizontal" elevation="${this.elevation}" .animated="">
        <div class="layout vertical headerTopLevel" role="heading" aria-level="1" aria-label="[[post.name]]">
          <yp-post-name-with-author top-left-radius class="mobileName" .post="${this.post}" ?isloggedin="${this.isLoggedIn}"></yp-post-name-with-author>

          <div class="layout horizontal wrap mediaAndInfoContainer layout-center-center">
            <div class="layout vertical center-center self-start coverContainer">
              <yp-post-cover-media top-left-radius show-video show-audio
                ?hasTranscript="${this.post.public_data.transcript.text}" .altTag="${this.post.name}"
                ?audio-cover="${this.isAudioCover}" ?header-mode="${this.headerMode}" .post="${this.post}">
              </yp-post-cover-media>
              <div class="transcriptContainer">

                ${ this.checkingTranscript ? html`
                  <div class="layout vertical center-center checkTranscript">
                    <div>${this.t('checkingForTranscript')}</div>
                    <paper-spinner .active ></paper-spinner>
                  </div>
                `: html``}

                <div class="transcriptError layout horizontal center-center" ?hidden="${!this.checkTranscriptError}">
                  ${this.t('checkTranscriptError')}
                </div>

                ${ this.post.public_data.transcript.text ? html`
                  <div class="transcriptText layout vertical center-center">
                    <div class="transcriptHeader" ?hidden="${this.post.public_data.transcript.noMachineTranslation}">${this.t('automaticTranscript')}
                      <span ?hidden="${!this.post.public_data.transcript.userEdited}">
                        (${this.t('edited')})
                      </span>
                    </div>
                    <div id="postContentTranscript" ?hidden="${this.isEditing}">
                      <yp-magic-text text-type="postTranscriptContent" .contentLanguage="${this.post.public_data.transcript.language}" .content="${this.post.public_data.transcript.text}" .contentId="${this.post.id}">
                      </yp-magic-text>
                    </div>

                    ${ this.hasPostAccess ? html`
                      <div class="layout horizontal" ?hidden="${this.isEditing}">
                        <div class="flex"></div>
                        <yp-ajax id="editPostTranscriptAjax" .method="PUT" @response="${this._editPostTranscriptResponse}"></yp-ajax>
                        <paper-icon-button class="editIcon" .title="${this.t('edit')}" .icon="create" @tap="${this._editPostTranscript}"></paper-icon-button>
                      </div>
                    `: html``}
                  </div>
                `: html``}

                ${ this.isEditing ? html`
                  <div class="layout vertical" ?hidden="${!this.hasPostAccess}">
                    <paper-textarea id="postTranscriptionEditor" .charCounter maxlength="500" .value="${this.editText}"></paper-textarea>
                    <div class="horizontal end-justified layout">
                      <emoji-selector id="postTranscriptEmojiSelector"></emoji-selector>
                    </div>
                    <div class="layout horizontal self-end">
                      <mwc-button @click="${this._cancelEdit}" .label="${this.t('cancel')}"></mwc-button>
                      <mwc-button @click="${this._saveEdit}" .label="${this.t('update')}"></mwc-button>
                    </div>
                  </div>
                `: html``}

                <yp-ajax hidden id="checkTranscriptStatusAjax" @response="${this._transcriptStatusResponse}"></yp-ajax>
              </div>
            </div>
            <div class="layout vertical">
              <div class="infoContainer">
                ${!this.post.public_data.structuredAnswersJson ? html`
                  <yp-magic-text id="description" textType="postContent" .contentLanguage="${this.post.language}"
                    content="${this.post.description}" ?noUserInfo="${!this.post.Group.configuration.showWhoPostedPosts}"
                    .structuredQuestionsConfig="${this.post.Group.configuration.structuredQuestions}"
                    ?hasCustomRatings="${this.post.Group.configuration.customRatings}"
                    ?simpleFormat="${this.post.Group.configuration.descriptionSimpleFormat}"
                    .contentId="${this.post.id}" class="description"
                    .truncate="${this.post.Group.configuration.descriptionTruncateAmount}"
                    .moreText="${this.t('readMore')}" .closeDialogText="${this.t('close')}">
                  </yp-magic-text>
                ` : html`
                  <yp-magic-text id="description" text-type="postContent"
                  .contentLanguage="${this.post.language}" .content="${this.structuredAnswersFormatted}"
                    ?noUserInfo="${!this.post.Group.configuration.showWhoPostedPosts}"
                    simpleFormat skipSanitize
                    .contentId="${this.post.id}" class="description"
                    .truncate="${this.post.Group.configuration.descriptionTruncateAmount}"
                    .moreText="${this.t('readMore')}" .closeDialogText="${this.t('close')}">
                  </yp-magic-text>
                ` }

              </div>

              ${!this.post.public_data.structuredAnswersJson ? html`
                <yp-post-ratings-info class="customRatings" .post="${this.post}"></yp-post-ratings-info>
              ` : html`
                <yp-post-actions ?hidden="${this.ideActions}" hideDebate elevation="-1" floating ?headerMode="${this.headerMode}"
                class="postActions" .endorseMode="${this.endorseMode}" .post="${this.post}"></yp-post-actions>
              `}

              <div class="share">
                <paper-share-button on-share-tap="_shareTap" class="shareIcon"
                ?less-margin="${this.post.Group.configuration.hideDownVoteForPost}"
                ?endorsed="${this.isEndorsed}" horizontal-align="right" id="shareButton"
                ?whatsapp="${post.Group.configuration.allowWhatsAppSharing}" title="${this.t('post.shareInfo')}"
                facebook email twitter popup .url="${this.fullPostUrl}"></paper-share-button>
              </div>
              <paper-menu-button vertical-align="top" horizontal-align="right" class="moreVert" ?hidden="${this.hideActions}">
                <paper-icon-button aria-label="${this.t('openPostMenu')}" class="moreVertButton" icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
                <paper-listbox slot="dropdown-content" @iron-select="${this._menuSelection}s">
                  ${ this.hasPostAccess ? html`
                    <paper-item id="editMenuItem">${this.t('post.edit')}</paper-item>
                    <paper-item id="moveMenuItem">${this.t('post.move')}</paper-item>
                    <paper-item ?hidden="${!this.checkPostAdminOnlyAccess(this.post)}" id="statusChangeMenuItem">
                      ${this.t('post.statusChange')}
                    </paper-item>
                    <paper-item id="deleteMenuItem">${this.t('post.delete')}</paper-item>
                    <paper-item ?hidden="${!this.checkPostAdminOnlyAccess(this.post)}" id="anonymizeMenuItem">
                      ${this.t('anonymizePostAndContent')}</paper-item>
                    <paper-item ?hidden="${!this.checkPostAdminOnlyAccess(thios.post)}" id="deleteContentMenuItem">
                      ${this.t('deletePostContent')}</paper-item>
                  ` : nothing }
                  <paper-item id="reportMenuItem">${this.t('post.report')}</paper-item>
                </paper-listbox>
              </paper-menu-button>
            </div>
          </div>
          <yp-post-name-with-author bottom-left-radius="" desktop="" class="desktopName"
            .post="${this.post}" ?isloggedin="${this.isLoggedIn}"></yp-post-name-with-author>
        </div>
      </paper-material>
    </div>
    <lite-signal @lite-signal-got-admin-rights="${this._gotAdminRights}"></lite-signal>
    `;
  }

/*
  behaviors: [
    YpPostBehavior,
    AccessHelpers,
    ypGotAdminRightsBehavior,
    ypLoggedInUserBehavior,
    ypGotoBehavior,
    ypTruncateBehavior,
    ypMediaFormatsBehavior
  ],
*/

  _structuredAnswersFormatted(post) {
    if (post && post.public_data && post.public_data.structuredAnswersJson &&
      post.Group.configuration && post.Group.configuration.structuredQuestionsJson) {
      var questionHash = {};
      var outText = "";
      post.Group.configuration.structuredQuestionsJson.forEach(function (question) {
        if (question.uniqueId) {
          questionHash[question.uniqueId] = question;
        }
      }.bind(this));

      post.public_data.structuredAnswersJson.forEach(function (answer) {
        if (answer && answer.value) {
          var question = questionHash[answer.uniqueId];
          if (question) {
            outText+="<b>"+question.text+"</b>\n";
            outText+=answer.value+"\n\n";
          }
        }
      }.bind(this));

      return outText;
    } else {
      return "";
    }
  }

  _shareTap(event, detail) {
    window.appGlobals.activity('postShareHeaderOpen', detail.brand, this.post ? this.post.id : -1);
  }

  _isEditingChanged(value) {
    this._updateEmojiBindings(value);
    this.async(function () {
      this.fire('iron-resize');
    });
  }

  _updateEmojiBindings(isEditing) {
    if (isEditing) {
      this.async(function () {
        const point = this.$$("#postTranscriptionEditor");
        const emoji = this.$$("#postTranscriptEmojiSelector");
        if (point && emoji) {
          emoji.inputTarget = point;
        } else {
          console.error("Wide: Can't bind post edit emojis :(");
        }
      }.bind(this), 500);
    }
  }

  _cancelEdit() {
    //this._setlatestContent(this.point);
    this.isEditing = false;
  }

  _saveEdit() {
    this.$$("#editPostTranscriptAjax").url = "/api/posts/"+this.post.id+'/editTranscript';
    this.$$("#editPostTranscriptAjax").body = { content: this.editText };
    this.$$("#editPostTranscriptAjax").generateRequest();
  }

  _editPostTranscriptResponse(event, detail) {
    this.post.public_data.transcript.text = this.editText;
    this.post.public_data.transcript.userEdited = true;
    this.isEditing = false;
  }

  _editPostTranscript() {
    if (this.hasPostAccess) {
      this.editText = this.post.public_data.transcript.text;
      this.isEditing = true;
    }
  }

  _transcriptStatusResponse(event, detail) {
    if (detail.response && detail.response.text) {
      this.post.public_data.transcript.text = detail.response.text;
      if (this.hasPostAccess) {
        this.editText =  detail.response.text;
        this.isEditing = true;
      }
      this.checkingTranscript = false;
      this.async(function () {
        this.fire('iron-resize');
      });
    } else if (detail.response && detail.response.inProgress) {
      this.async(function () {
        this.$$("#checkTranscriptStatusAjax").generateRequest();
      }, 2000);
    } else if (detail.response && detail.response.error) {
      this.checkingTranscript = false;
      this.checkTranscriptError = true;
    } else {
      this.checkingTranscript = false;
    }
  }

  _hasPostAccess(post, gotAdminRights) {
    if (post) {
      return this.checkPostAccess(post);
    } else {
      return false;
    }
  }

  goToPostIfNotHeader() {
    if (!this.headerMode) {
      this.goToPost();
    }
  }

  _postChanged(post) {
    this.checkingTranscript = false;
    this.checkTranscriptError = false;
    if (post && post.description) {
      this.async(function () {
        const description = this.$$("#description");
        if (description) {
          // Special case for law Issue from a parliement
          if (post.data && post.data.dataType==='lawIssue' && post.data.issueStatus) {
            description.content += " - "+post.data.issueStatus;
          }
        } else {
          console.error("Can't find description element");
        }
      });

      if (this.hasPostAccess && window.appGlobals.hasTranscriptSupport===true) {
        if (post.public_data && post.public_data.transcript && post.public_data.transcript.inProgress) {
          if (post.cover_media_type==="audio") {
            this.$$("#checkTranscriptStatusAjax").url = "/api/posts/"+post.id+'/audioTranscriptStatus';
            this.$$("#checkTranscriptStatusAjax").generateRequest();
            this.checkingTranscript = true;
          } else if (post.cover_media_type==="video") {
            this.$$("#checkTranscriptStatusAjax").url = "/api/posts/"+post.id+'/videoTranscriptStatus';
            this.$$("#checkTranscriptStatusAjax").generateRequest();
            this.checkingTranscript = true;
          }
        }
      }
    }
    if (post) {
      if (post.cover_media_type==='audio') {
        this.isAudioCover = true;
      } else {
        this.isAudioCover = false;
      }
    }
  }

  updateDescriptionIfEmpty(description) {
    if (this.post && (!this.post.description || this.post.description=='')) {
      this.post.description = description;
    }
  }

  _refresh() {
    dom(document).querySelector('yp-app').getDialogAsync("postEdit", function (dialog) {
      dialog.selected = 0;
      this.fire('refresh');
    }.bind(this));
  }

  _menuSelection(event, detail) {
    if (detail.item.id=="editMenuItem")
      this._openEdit();
    else if (detail.item.id=="deleteMenuItem")
      this._openDelete();
    else if (detail.item.id=="statusChangeMenuItem")
      this._openPostStatusChange();
    else if (detail.item.id=="moveMenuItem")
      this._openMovePost();
    else if (detail.item.id=="anonymizeMenuItem")
      this._openAnonymizeContent();
    else if (detail.item.id=="deleteContentMenuItem")
      this._openDeleteContent();
    else if (detail.item.id=="reportMenuItem")
      this._openReport();
    this.$$("paper-listbox").select(null);
  }

  _openMovePost() {
    dom(document).querySelector('yp-app').getDialogAsync("postMove", function (dialog) {
      dialog.setupAndOpen(this.post, this._refresh.bind(this));
    }.bind(this));
  }

  _openPostStatusChange() {
    dom(document).querySelector('yp-app').getDialogAsync("postStatusChangeEdit", function (dialog) {
      dialog.setup(this.post, null, this._refresh.bind(this));
      dialog.open('new', {postId: this.post.id, statusChange: true});
    }.bind(this));
  }

  _openEdit() {
    window.appGlobals.activity('open', 'post.edit');
    dom(document).querySelector('yp-app').getDialogAsync("postEdit", function (dialog) {
      dialog.setup(this.post, false, this._refresh.bind(this), this.post.Group);
      dialog.open('edit', {postId: this.post.id });
    }.bind(this));
  }

  _openReport() {
    window.appGlobals.activity('open', 'post.report');
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/posts/' + this.post.id + '/report',
        this.t('reportConfirmation'),
        this._onReport.bind(this),
        this.t('post.report'),
        'PUT');
      dialog.open();
    }.bind(this));
  }

  _openDelete() {
    window.appGlobals.activity('open', 'post.delete');
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/posts/' + this.post.id,
        this.t('post.deleteConfirmation'),
        this._onDeleted.bind(this));
      dialog.open();
    }.bind(this));
  }

  _openDeleteContent() {
    window.appGlobals.activity('open', 'postDeleteContent');
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/posts/' + this.post.id + '/delete_content',
        this.t('postDeleteContentConfirmation'));
      dialog.open();
    }.bind(this));
  }

  _openAnonymizeContent() {
    window.appGlobals.activity('open', 'postAnonymizeContent');
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/posts/' + this.post.id + '/anonymize_content',
        this.t('postAnonymizeContentConfirmation'));
      dialog.open();
    }.bind(this));
  }

  _onReport() {
    window.appGlobals.notifyUserViaToast(this.t('post.report')+': '+this.post.name);
  }

  _onDeleted() {
    this.dispatchEvent(new CustomEvent('yp-refresh-group', {bubbles: true, composed: true}));
    this.redirectTo("/group/"+this.post.group_id);
  }
}

window.customElements.define('yp-post-header-lit', YpPostHeaderLit)