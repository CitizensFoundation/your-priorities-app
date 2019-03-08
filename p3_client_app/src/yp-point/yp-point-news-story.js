import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import './yp-point-news-story.js';
import './yp-point-comment-list.js';
import '../yp-magic-text/yp-magic-text.js';
import './yp-point-news-story-embed.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">

      :host {
        width: 100%;
        margin-top: 8px;
      }

      .userName {
        color: #777;
      }

      .userName {
        padding-bottom: 4px;
      }

      .story {
        padding-bottom: 12px;
        margin-bottom: 8px;
        padding-top: 8px;
        border-bottom: solid #ddd;
        border-bottom-width: 1px;
        font-size: 19px;
      }

      yp-point-actions {
        padding-top: 8px;
      }

      .container {
      }

      #commentCount {
        font-size: 14px;
      }

      paper-icon-button.openCloseButton {
        width: 56px;
        height: 56px;
        padding-left: 0;
        margin-left: 0;
      }

      .commentText {
        font-size: 14px;
        text-transform: lowercase;
        padding-right: 6px;
      }

      .withPointer {
        cursor: pointer;
      }

      .newsContainer {
        width: auto;
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <div class="layout vertical newsContainer">
      <yp-magic-text id="content" class="story" text-type="pointContent" content-language="[[point.language]]" content="[[point.latestContent]]" content-id="[[point.id]]">
      </yp-magic-text>

      <yp-point-news-story-embed embed-data="[[point.embed_data]]"></yp-point-news-story-embed>
      <div class="layout horizontal">
        <yp-point-actions point="[[point]]" hide-sharing=""></yp-point-actions>
        <div class="layout horizontal start-justified">
          <div class="layout horizontal center-center withPointer" hidden\$="[[!commentsCount]]" on-tap="_setOpenToValue">
            <div class="commentText">[[t('point.comments')]]</div>
            <div id="commentCount">[[commentsCount]]</div>
          </div>
          <div class="layout horizontal center-center withPointer" on-tap="_setOpenToValue" hidden\$="[[_noComments(commentsCount)]]">
            <div class="commentText">[[t('noComments')]]</div>
          </div>
          <div class="layout horizontal">
            <paper-icon-button aria-label\$="[[t('toggleOpenClose')]]" class="openCloseButton" icon="keyboard-arrow-right" on-tap="_setOpen" hidden\$="[[open]]"></paper-icon-button>
            <paper-icon-button aria-label\$="[[t('toggleOpenClose')]]" class="openCloseButton" icon="keyboard-arrow-down" on-tap="_setClosed" hidden\$="[[!open]]"></paper-icon-button>
          </div>
        </div>
      </div>
      <yp-point-comment-list id="commentsList" on-yp-set-comments-count="_setCommentsCount" disable-open-close="" point="[[point]]" hidden\$="[[!withComments]]"></yp-point-comment-list>
    </div>
`,

  is: 'yp-point-news-story',

  properties: {

    point: {
      type: Object,
      notify: true,
      observer: "_pointChanged"
    },

    withComments: {
      type: Boolean,
      value: false
    },

    open: {
      type: Boolean,
      value: false,
      observer: "_openChanged"
    },

    user: {
      type: Object
    },

    hideUser: {
      type: Boolean,
      value: false
    },

    commentsCount: {
      type: Number,
      value: 0
    }
  },

  behaviors: [
    ypLanguageBehavior
  ],

  _setOpenToValue: function () {
    if (this.open) {
      this._setClosed()
    } else {
      this._setOpen()
    }
  },

  _openChanged: function (newOpenValue) {
    if (newOpenValue) {
      this.$.commentsList.generateRequest();
    }
  },

  _noComments: function (commentCount) {
    return !(commentCount==0)
  },

  _setOpen: function () {
    this.set('open', true);
    this.$.commentsList._setOpen();
  },

  _setClosed: function () {
    this.set('open', false);
    this.$.commentsList._setClosed();
  },

  _setCommentsCount: function (event, detail) {
    this.set('commentsCount', detail.count);
  },

  _pointChanged: function(point) {
    if (point) {
      this.user = point.PointRevisions[0].User;
    } else {
      this.user = null;
    }

    this.set('open', false);
  },

  loginName: function () {
    return this.point.PointRevisions[0].User.name;
  }
});
