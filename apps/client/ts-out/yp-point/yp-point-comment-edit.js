var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/button/filled-button.js';
import '../common/yp-image.js';
import '../yp-user/yp-user-info.js';
import { YpBaseElementWithLogin } from '../common/yp-base-element-with-login.js';
let YpPointCommentEdit = class YpPointCommentEdit extends YpBaseElementWithLogin {
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          display: block;
          width: 100%;
          margin-top: 6px;
          margin-bottom: 64px;
        }

        md-outlined-text-field {
          width: 370px;
          max-height: 400px;
        }

        md-filled-button {
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .userImage {
          padding-left: 16px;
          padding-right: 16px;
        }

        @media (max-width: 840px) {
          :host {
            width: 100%;
          }

          md-outlined-text-field {
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
      `,
        ];
    }
    render() {
        return this.comment
            ? html `
          <div
            class="layout vertical center-center"
            ?hidden="${!this.loggedInUser}">
            <div class="layout horizontal">
              <yp-user-image
                class="userImage"
                .user="${this.loggedInUser}"></yp-user-image>
              <div class="layout vertical">
                <md-outlined-text-field
                  type="textarea"
                  id="pointComment"
                  minlength="15"
                  name="pointComment"
                  .value="${this.comment.content}"
                  always-float-label="${this.comment.content}"
                  .label="${this.t('point.addComment')}"
                  charCounter
                  rows="2"
                  maxrows="2"
                  @keydown="${this._keyDown}"
                  maxlength="200"
                  aria-label="${this.t('point.addComment')}">
                </md-outlined-text-field>
                <div class="layout horizontal">
                  <md-filled-button
                    id="submitButton"
                    raised
                    @click="${this._sendComment}"
                    .label="${this.t('point.postComment')}">${this.t('point.postComment')}</md-filled-button>
                </div>
              </div>
            </div>
          </div>
        `
            : nothing;
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        //TODO: See what this is about and fix the iron-resize if needed
        if (changedProperties.has('comment') && this.comment) {
            if (this.comment.value && this.comment.value % 7 === 2) {
                this.fire('iron-resize');
            }
        }
    }
    get newPointComment() {
        return this.$$("#pointComment").value;
    }
    connectedCallback() {
        super.connectedCallback();
        this._reset();
    }
    _responseError() {
        this.$$('#submitButton').disabled = false;
    }
    _reset() {
        this.comment = { content: '' };
        if (this.$$('#submitButton'))
            this.$$('#submitButton').disabled = false;
        if (this.$$("#pointComment"))
            this.$$("#pointComment").value = '';
    }
    async _sendComment() {
        this.comment.content = this.newPointComment;
        if (this.comment &&
            this.comment.content &&
            this.comment.content.length > 0) {
            if (this.point) {
                await window.serverApi.postComment('points', this.point.id, {
                    point_id: this.point.id,
                    comment: this.comment,
                });
                this.$$('#submitButton').disabled = false;
            }
            else if (this.image) {
                await window.serverApi.postComment('images', this.image.id, {
                    image_id: this.image.id,
                    comment: this.comment,
                });
                this.$$('#submitButton').disabled = false;
            }
            else {
                console.error("Can't find send ids");
            }
        }
        else {
            //TODO: Make sure this works
            this.fire('yp-error', this.t('point.commentToShort'));
        }
        this.fire('refresh');
        this._reset();
    }
    _keyDown(event) {
        if (event.code == 'enter') {
            this._sendComment();
        }
    }
};
__decorate([
    property({ type: Object })
], YpPointCommentEdit.prototype, "comment", void 0);
__decorate([
    property({ type: Object })
], YpPointCommentEdit.prototype, "point", void 0);
__decorate([
    property({ type: Object })
], YpPointCommentEdit.prototype, "image", void 0);
YpPointCommentEdit = __decorate([
    customElement('yp-point-comment-edit')
], YpPointCommentEdit);
export { YpPointCommentEdit };
//# sourceMappingURL=yp-point-comment-edit.js.map