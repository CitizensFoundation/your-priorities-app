var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/iconbutton/icon-button.js";
import "./yp-point-comment-list.js";
import "./yp-point-news-story-embed.js";
import "./yp-point-actions.js";
let YpPointNewsStory = class YpPointNewsStory extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.withComments = false;
        this.open = false;
        this.hideUser = false;
        this.commentsCount = 0;
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("point")) {
            this._pointChanged();
        }
        if (changedProperties.has("open")) {
            this._openChanged();
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          width: 100%;
          margin-top: 8px;
        }

        .commentsInfoContainer {
          margin-left: 16px;
          margin-top: 6px;
        }

        .userName {
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

        .withPointer {
          cursor: pointer;
        }

        .newsContainer {
          width: auto;
        }

        @media (max-width: 520px) {
          .newsContainer {
            width: 90%;
          }
        }

        [hidden] {
          display: none !important;
        }
      `,
        ];
    }
    render() {
        return html `
      <div class="layout vertical newsContainer">
        <yp-magic-text
          id="content"
          class="story"
          textType="pointContent"
          simpleFormat
          truncate="10000"
          .contentLanguage="${this.point.language}"
          .content="${this.point.latestContent}"
          .contentId="${this.point.id}"
        >
        </yp-magic-text>

        <yp-point-news-story-embed
          .embedData="${this.point.embed_data}"
        ></yp-point-news-story-embed>
        <div class="layout horizontal">
          <yp-point-actions
            .point="${this.point}"
            hideSharing
          ></yp-point-actions>
          <div class="layout horizontal start-justified commentsInfoContainer">
            <div
              class="layout horizontal center-center withPointer"
              ?hidden="${!this.commentsCount}"
              @click="${this._setOpenToValue}"
            >
              <div class="commentText">${this.t("point.comments")}</div>
              <div id="commentCount">${this.commentsCount}</div>
            </div>
            <div
              class="layout horizontal center-center withPointer"
              @click="${this._setOpenToValue}"
              ?hidden="${this.noComments}"
            >
              <div class="commentText">${this.t("noComments")}</div>
            </div>
            <div class="layout horizontal">
              <md-icon-button
                .label="${this.t("toggleOpenClose")}"
                class="openCloseButton"
                @click="${this._setOpen}"
                ?hidden="${this.open}"
                ><md-icon>keyboard_arrow_right</md-icon>
              </md-icon-button>
              <md-icon-button
                .label="${this.t("toggleOpenClose")}"
                class="openCloseButton"
                @click="${this._setClosed}"
                ?hidden="${!this.open}"
              >
                <md-icon>keyboard_arrow_down</md-icon>
              </md-icon-button>
            </div>
          </div>
        </div>
        <yp-point-comment-list
          id="commentsList"
          @yp-set-comments-count="${this._setCommentsCount}"
          disableOpenClose
          .point="${this.point}"
          ?hidden="${!this.withComments}"
        ></yp-point-comment-list>
      </div>
    `;
    }
    _setOpenToValue() {
        if (this.open) {
            this._setClosed();
        }
        else {
            this._setOpen();
        }
    }
    _openChanged() {
        if (this.open) {
            this.$$("#commentsList").refresh();
        }
    }
    get noComments() {
        return !(this.commentsCount == 0);
    }
    _setOpen() {
        this.open = true;
        this.$$("#commentsList").setOpen();
    }
    _setClosed() {
        this.open = false;
        this.$$("#commentsList").setClosed();
    }
    _setCommentsCount(event) {
        this.commentsCount = event.detail.count;
    }
    _pointChanged() {
        if (this.point && this.point.PointRevisions) {
            this.user = this.point.PointRevisions[0].User;
        }
        else {
            this.user = undefined;
        }
        this.open = false;
    }
    loginName() {
        return this.point.PointRevisions[0].User.name;
    }
};
__decorate([
    property({ type: Object })
], YpPointNewsStory.prototype, "point", void 0);
__decorate([
    property({ type: Object })
], YpPointNewsStory.prototype, "user", void 0);
__decorate([
    property({ type: Boolean })
], YpPointNewsStory.prototype, "withComments", void 0);
__decorate([
    property({ type: Boolean })
], YpPointNewsStory.prototype, "open", void 0);
__decorate([
    property({ type: Boolean })
], YpPointNewsStory.prototype, "hideUser", void 0);
__decorate([
    property({ type: Number })
], YpPointNewsStory.prototype, "commentsCount", void 0);
YpPointNewsStory = __decorate([
    customElement("yp-point-news-story")
], YpPointNewsStory);
export { YpPointNewsStory };
//# sourceMappingURL=yp-point-news-story.js.map