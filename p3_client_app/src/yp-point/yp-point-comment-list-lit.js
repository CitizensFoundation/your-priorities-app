import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-image/iron-image.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import '../yp-app-globals/yp-app-icons.js';
import './yp-point-comment.js';
import './yp-point-comment-edit.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpPointCommentListLit extends YpBaseElement {
  static get properties() {
    return {
      comments: {
        type: Array
      },

      point: {
        type: Object,
        notify: true,
        observer: "_pointChanged"
      },

      image: {
        type: Object,
        notify: true,
        observer: "_imageChanged"
      },

      open: {
        type: Boolean,
        value: false,
        observer: "_openChanged"
      },

      loadingList: {
        type: Boolean
      },

      commentsCount: {
        type: Number,
        value: null
      },

      disableOpenClose: {
        type: Boolean,
        value: false
      },
    }
  }
  static get styles() {
    return [
      css`

      :host {
        width: 100%;
      }

      yp-point-comment-edit {

      }

      .iron-list {
       max-height: 500px;
       width:  550px;
        --iron-list-items-container: {
        };
      }

      .listContainer {
        padding-top: 24px;
        height: 100%;
        width: 100%;
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

      @media (max-width: 520px) {
        iron-list {
          width: 420px;
        }
      }

      @media (max-width: 450px) {
        iron-list {
          width: 318px;
        }
      }

      @media (max-width: 359px) {
        iron-list {
          width: 307px;
        }
      }

      [hidden] {
        display: none !important;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <div class="container layout vertical">
      <div class="layout horizontal start-justified" ?hidden="${this.disableOpenClose}">
        <div class="layout horizontal center-center" ?hidden="${!this.commentsCount}">
          <div class="commentText">${this.t('point.comments')}</div>
          <div id="commentCount">${this.commentsCount}</div>
        </div>
        <div class="layout horizontal center-center" ?hidden="${this._noComments(commentsCount)}">
          <div class="commentText">${this.t('noComments')}</div>
        </div>
        <div class="layout horizontal">
          <paper-icon-button title="${this.t('openComments')}" class="openCloseButton" .icon="keyboard-arrow-right" @tap="${this._setOpen}" ?hidden="${this.open}"></paper-icon-button>
          <paper-icon-button title="${this.t('closeComments')}" class="openCloseButton" .icon="keyboard-arrow-down" @tap="${this._setClosed}" ?hidden="${!this.open}"></paper-icon-button>
        </div>
      </div>

      ${ this.open ? html`
        <div class="layout vertical listContainer">
          <iron-list id="list" .items="${this.comments}" .as="point">
            <template>
              <yp-point-comment .point="${this.point}" .tabindex="${this.tabIndex}"></yp-point-comment>
            </template>
          </iron-list>
          <yp-point-comment-edit @refresh="${this._refresh}" .point="${this.point}" .image="${this.image}"></yp-point-comment-edit>
        </div>
      `: html``}

      <div class="layout horizontal center-center">
        <yp-ajax id="commentsListAjax" .method="GET" @response="${this._commentsResponse}"></yp-ajax>
        <yp-ajax id="commentsCountListAjax" .method="GET" @response="${this._countResponse}"></yp-ajax>
      </div>
    </div>
    `
  }
/*
  behaviors: [
    IronResizableBehavior
  ],

  listeners: {
    'yp-point-deleted': '_refresh'
  },
*/
  _openChanged(newOpenValue) {
    if (newOpenValue) {
      this.$$("#commentsListAjax").generateRequest();
    }
  }

  _noComments(commentCount) {
    return !(commentCount==0)
  }

  _setOpen() {
    this.open = true;
    this.async(function () {
      this.notifyResize();
      this.fire('iron-resize');
    },20);
  }

  _setClosed() {
    this.open = false;
    this.async(function () {
      this.fire('iron-resize');
      this.notifyResize();
    },20);
  }

  generateRequest() {
    this.$$("#commentsListAjax").generateRequest();
  }

  _pointChanged(newPoint) {
    this.comments = [];
    this.commentsCount = null;
    if (newPoint) {
      this.$$("#commentsListAjax").url = '/api/points/'+newPoint.id+'/comments';
      this.$$("#commentsCountListAjax").url = '/api/points/'+newPoint.id+'/commentsCount';
      this.$$("#commentsCountListAjax").generateRequest();
    }
  }

  _refresh() {
    this.$$("#commentsListAjax").generateRequest();
    this.$$("#commentsCountListAjax").generateRequest();
  }

  _imageChanged(newImage) {
    if (newImage) {
      this.$$("#commentsListAjax").url = '/api/images/'+newImage.id+'/comments';
      this.$$("#commentsCountListAjax").url = '/api/images/'+newImage.id+'/commentsCount';
      this.$$("#commentsCountListAjax").generateRequest();
    }
  }

  _countResponse(event, detail) {
    this.commentsCount = detail.response.count;
    this.fire('yp-set-comments-count', { count: this.commentsCount })
  }

  _commentsResponse(event, detail) {
    const comment = detail.response;
    this.comments = comment;
    if (comment && comment.length>0) {
      this.$$("#list").scrollToIndex(comment.length-1);
    }
    this.notifyResize();
    this.async(function () {
      this.$$("#list").fire('iron-resize');
    });
  }
}
window.customElements.define('yp-point-comment-list-lit', YpPointCommentListLit)