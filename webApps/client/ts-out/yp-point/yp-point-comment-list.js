var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import '../common/yp-image.js';
import '@material/web/iconbutton/icon-button.js';
import '@lit-labs/virtualizer';
import './yp-point-comment.js';
import './yp-point-comment-edit.js';
//import { RangeChangedEvent } from '@lit-labs/virtualizer/Virtualizer.js';
let YpPointCommentList = class YpPointCommentList extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.open = false;
        this.loadingList = false;
        this.disableOpenClose = false;
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('point')) {
            this._pointChanged();
        }
        if (changedProperties.has('image')) {
            this._imageChanged();
        }
        if (changedProperties.has('open')) {
            this._openChanged();
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          width: 100%;
        }

        yp-point-comment-edit {
          width: 100%;
        }

        lit-virtualizer {
          max-height: 500px;
          width: 550px;
          text-align: left !important;
          padding: 16px;
          --lit-virtualizer-items-container: {
          }
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

        md-icon-button.openCloseButton {
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

        yp-point-comment {
          text-align: left;

        }

        @media (max-width: 520px) {
          lit-virtualizer {
            width: 100%;
          }
        }

        @media (max-width: 450px) {
          lit-virtualizer {
            width: 100%;
          }
        }

        @media (max-width: 360px) {
          lit-virtualizer {
            width: 100%;
          }
        }

        [hidden] {
          display: none !important;
        }
      `,
        ];
    }
    renderComment(comment, index) {
        return html ` <yp-point-comment
      .point="${comment}"
      .tabindex="${index}"></yp-point-comment>`;
    }
    render() {
        return html `
      <div class="container layout vertical">
        <div
          class="layout vertical start-justified"
          ?hidden="${this.disableOpenClose}">
          <div
            class="layout horizontal center-center"
            ?hidden="${!this.commentsCount}">
            <div class="commentText">${this.t('point.comments')}</div>
            <div id="commentCount">${this.commentsCount}</div>
          </div>
          <div
            class="layout horizontal center-center"
            ?hidden="${this.noComments}">
            <div class="commentText">${this.t('noComments')}</div>
          </div>
          <div class="layout horizontal">
            <md-icon-button
              .label="${this.t('openComments')}"
              class="openCloseButton"
              @click="${this.setOpen}"
              ?hidden="${this.open}"><md-icon>keyboard_arrow_right</md-icon></md-icon-button>
            <md-icon-button
              .label="${this.t('closeComments')}"
              class="openCloseButton"
              icon="keyboard_arrow_down"
              @click="${this.setClosed}"
              ?hidden="${!this.open}"><md-icon>keyboard_arrow_down</md-icon></md-icon-button>
          </div>
        </div>

        ${this.open && this.comments
            ? html `
              <div class="layout vertical listContainer">
                <lit-virtualizer
                  .items=${this.comments}
                  .scrollTarget="${window}"
                  .renderItem=${this.renderComment}
                  @rangeChanged=${this.scrollEvent}></lit-virtualizer>

              </div>

              <yp-point-comment-edit
                  @refresh="${this.refresh}"
                  .point="${this.point}"
                  .image="${this.image}"></yp-point-comment-edit>
            `
            : html ``}
        </div>
      </div>
    `;
    }
    scrollEvent(event) {
        if (this.comments &&
            //      !this.moreFromScrollTriggerActive &&
            event.last != -1 &&
            event.last < this.comments.length &&
            event.last + 5 >= this.comments.length) {
            //      this.moreFromScrollTriggerActive = true;
            //      this._loadMoreData();
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.addListener('yp-point-deleted', this.refresh);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeListener('yp-point-deleted', this.refresh);
    }
    _openChanged() {
        if (this.open && (this.point || this.image)) {
            this.refresh();
        }
    }
    get noComments() {
        return !(this.commentsCount == 0);
    }
    setOpen() {
        this.open = true;
        setTimeout(() => {
            this.fire('iron-resize');
        }, 20);
    }
    setClosed() {
        this.open = false;
        setTimeout(() => {
            this.fire('iron-resize');
        }, 20);
    }
    _pointChanged() {
        this.comments = [];
        this.commentsCount = undefined;
        if (this.point) {
            this.commentType = 'points';
            this.refresh();
        }
    }
    refresh() {
        this._getComments();
        this._getCommentsCount();
    }
    _imageChanged() {
        if (this.image) {
            this.commentType = 'images';
            this.refresh();
        }
    }
    get hasContent() {
        return this.point || this.image;
    }
    async _getComments() {
        if (this.hasContent && this.commentType) {
            const comment = await window.serverApi.getComments(this.commentType, this.point ? this.point.id : this.image.id);
            this.comments = comment;
            if (comment && comment.length > 0) {
                //TODO: Fix this
                //this.$$('#list').scrollToIndex(comment.length - 1);
            }
            setTimeout(() => {
                //TODO: Do we need this
                //this.$$('#list').fire('iron-resize');
            });
        }
    }
    async _getCommentsCount() {
        if (this.hasContent && this.commentType) {
            const response = await window.serverApi.getCommentsCount(this.commentType, this.point ? this.point.id : this.image.id);
            this.commentsCount = response.count;
            this.fire('yp-set-comments-count', { count: this.commentsCount });
        }
        else {
            console.error('No point for comment count');
        }
    }
};
__decorate([
    property({ type: Array })
], YpPointCommentList.prototype, "comments", void 0);
__decorate([
    property({ type: Object })
], YpPointCommentList.prototype, "point", void 0);
__decorate([
    property({ type: Object })
], YpPointCommentList.prototype, "image", void 0);
__decorate([
    property({ type: Boolean })
], YpPointCommentList.prototype, "open", void 0);
__decorate([
    property({ type: Boolean })
], YpPointCommentList.prototype, "loadingList", void 0);
__decorate([
    property({ type: Boolean })
], YpPointCommentList.prototype, "disableOpenClose", void 0);
__decorate([
    property({ type: Number })
], YpPointCommentList.prototype, "commentsCount", void 0);
__decorate([
    property({ type: String })
], YpPointCommentList.prototype, "commentType", void 0);
YpPointCommentList = __decorate([
    customElement('yp-point-comment-list')
], YpPointCommentList);
export { YpPointCommentList };
//# sourceMappingURL=yp-point-comment-list.js.map