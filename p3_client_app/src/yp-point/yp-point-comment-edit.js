import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-input/paper-textarea.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import '../yp-user/yp-user-image.js';
import '../yp-ajax/yp-ajax.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      :host {
        display: block;
        width: 100%;
        margin-top: 6px;
        margin-bottom: 64px;
      }

      paper-textarea {
        width: 370px;
        max-height: 300px;
      }

      paper-button {
        margin-top: 16px;
        margin-bottom: 16px;
        background-color: var(--accent-color);
        color: #FFF;
      }

      .userImage {
        padding-left: 16px;
        padding-right: 16px;
      }

      @media (max-width: 840px) {
        :host {
          width: 100%;
        }

        paper-textarea {
          width: 250px;
        }

        .userImage {
          padding-top: 8px;
          padding-right: 16px;
          padding-left: 0;
        }
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <div class="layout vertical center-center" hidden\$="[[!loggedInUser]]">
      <div class="layout horizontal">
        <yp-user-image class="userImage" user="[[loggedInUser]]"></yp-user-image>
        <div class="layout vertical">
          <paper-textarea id="pointComment" required="" minlength="15" name="pointComment" value="{{comment.content}}" always-float-label="[[comment.content]]" label="[[t('point.addComment')]]" char-counter="" rows="2" max-rows="2" on-keydown="_keyDown" maxlength="200">
          </paper-textarea>
          <div class="layout horizontal">
            <paper-button id="submitButton" raised="" on-tap="_sendComment">[[t('point.postComment')]]</paper-button>
          </div>
        </div>
      </div>

      <div class="layout horizontal center-center">
        <yp-ajax id="postCommentAjax" method="POST" on-error="_responseError" on-response="_newsCommentResponse"></yp-ajax>
      </div>

    </div>
    <lite-signal on-lite-signal-logged-in="_userLoggedIn"></lite-signal>
`,

  is: 'yp-point-comment-edit',

  properties: {

    comment: {
      type: Object,
      notify: true
    },

    point: {
      type: Object,
      notify: true
    },

    image: {
      type: Object,
      notify: true
    }

  },

  behaviors: [
    ypLanguageBehavior,
    ypLoggedInUserBehavior
  ],

  observers: [
    '_commentContentChanged(comment.*)'
  ],

  ready: function () {
    this._reset();
  },

  _commentContentChanged: function (change) {
    if (change.value && change.value.length % 7 === 2) {
      this.fire('iron-resize');
    }
  },

  _responseError: function () {
    this.$$("#submitButton").disabled = false;
  },

  _reset: function () {
    this.set('comment', { content: '' });
    this.$$("#submitButton").disabled = false;
  },

  _sendComment: function () {
    var body;
    if (this.comment.content && this.comment.content.length>0) {
      if (this.point) {
        body = { point_id: this.point.id };
        this.$.postCommentAjax.url = '/api/points/'+this.point.id+'/comment';
        this.$$("#submitButton").disabled = true;
      } else if (this.image) {
        body = { image_id: this.image.id };
        this.$.postCommentAjax.url = '/api/images/'+this.image.id+'/comment';
        this.$$("#submitButton").disabled = true;
      } else {
        console.error("Can't find send ids");
      }
      this.$.postCommentAjax.body = __.merge(body, { comment: this.comment } );
      this.$.postCommentAjax.generateRequest();
    } else {
      this.$.postCommentAjax.showErrorDialog(this.t('point.commentToShort'));
    }
  },

  _newsCommentResponse: function () {
    this.fire('refresh');
    this._reset();
  },

  _keyDown: function (event) {
    if (event.code == 'enter') {
      this._sendComment();
    }
  }
})
