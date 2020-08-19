import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import '../yp-app-globals/yp-app-icons.js';
import './yp-point-news-story.js';
import './yp-point-comment-list.js';
import '../yp-magic-text/yp-magic-text.js';
import './yp-point-news-story-embed.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class YpPointNewsStoryLit extends YpBaseElement {
  static get properties() {
    return {
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
    }
  }

  static get styles() {
    return [
      css`

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
    `, YpFlexLayout]
  }

  render() {
    return html`

    <div class="layout vertical newsContainer">
      <yp-magic-text id="content" class="story" .textType="pointContent" .contentLanguage="${this.point.language}" .content="${this.point.latestContent}" .contentId="${this.point.id}">
      </yp-magic-text>

      <yp-point-news-story-embed embed-data="${this.point.embed_data}"></yp-point-news-story-embed>
      <div class="layout horizontal">
        <yp-point-actions point="${this.point}" hide-sharing=></yp-point-actions>
        <div class="layout horizontal start-justified">
          <div class="layout horizontal center-center withPointer" ?hidden="${!this.commentsCount}" @tap="${this._setOpenToValue}">
            <div class="commentText">${this.t(point.comments)}</div>
            <div id="commentCount">${this.commentsCount}</div>
          </div>
          <div class="layout horizontal center-center withPointer" @tap="${this._setOpenToValue}" ?hidden="${this._noComments(commentsCount)}">
            <div class="commentText">${this.t(noComments)}</div>
          </div>
          <div class="layout horizontal">
            <paper-icon-button aria-label="${this.t(toggleOpenClose)}" class="openCloseButton" .icon="keyboard-arrow-right" @tap="${this._setOpen}" ?hidden="${this.open}"></paper-icon-button>
            <paper-icon-button aria-label="${this.t(toggleOpenClose)}" class="openCloseButton" .icon="keyboard-arrow-down" @tap="${this._setClosed}" ?hidden="${!this.open}"></paper-icon-button>
          </div>
        </div>
      </div>
      <yp-point-comment-list id="commentsList" @yp-set-comments-count="${this._setCommentsCount}" disable-open-close .point="${this.point}" ?hidden="${!this.withComments}"></yp-point-comment-list>
    </div>
    `
  }

  _setOpenToValue() {
    if (this.open) {
      this._setClosed()
    } else {
      this._setOpen()
    }
  }

  _openChanged(newOpenValue) {
    if (newOpenValue) {
      this.$$("#commentsList").generateRequest();
    }
  }

  _noComments(commentCount) {
    return !(commentCount==0)
  }

  _setOpen() {
    this.open = true;
    this.$$("#commentsList")._setOpen();
  }

  _setClosed() {
    this.open = false;
    this.$$("#commentsList")._setClosed();
  }

  _setCommentsCount(event, detail) {
    this.commentsCount = detail.count;
  }

  _pointChanged(point) {
    if (point) {
      this.user = point.PointRevisions[0].User;
    } else {
      this.user = null;
    }

    this.open = false;
  }

  loginName() {
    return this.point.PointRevisions[0].User.name;
  }
}

window.customElements.define('yp-point-news-story-lit', YpPointNewsStoryLit)