import { css, html, nothing } from "lit";
import { property, customElement, query, queryAll } from "lit/decorators.js";

import "@material/mwc-icon-button";
import "@material/web/iconbutton/outlined-icon-button.js";
import "./@yrpri/yp-point/yp-point-comment-list.js";
import "./@yrpri/yp-point/yp-point-actions.js";
import "./@yrpri/yp-magic-text/yp-magic-text.js";
import "./@yrpri/yp-user/yp-user-with-organization.js";
import { YpPointCommentList } from "./@yrpri/yp-point/yp-point-comment-list.js";
import { Dialog } from "@material/mwc-dialog";
import { YpBaseElementWithLogin } from "./@yrpri/common/yp-base-element-with-login.js";
import { Layouts } from "./flexbox-literals/classes.js";
import { MdDialog } from "@material/web/dialog/dialog.js";
import { LandUseEntity } from "./LandUseEntity.js";
import { TileManager } from "./TileManager.js";

@customElement("yp-comments-dialog")
export class YpCommentsDialog extends YpBaseElementWithLogin {
  @property({ type: Array })
  topLevelPoints!: YpPointData[];

  @property({ type: Object })
  tileManager!: TileManager;

  @property({ type: Object })
  group!: YpGroupData;

  @property({ type: Boolean })
  withComments = false;

  @property({ type: Boolean })
  hideUser = false;

  @property({ type: Number })
  commentsCount = 0;

  @property({ type: Number })
  currentPointId: number | undefined;

  @property({ type: Object })
  currentPoint: YpPointData | undefined;

  @property({ type: Number })
  currentIndex = 0;

  async connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  @query("#dialog")
  dialog!: MdDialog;

  static get styles() {
    return [
      Layouts,
      css`
        md-dialog[showing-fullscreen] {
          /* hack: private! */
          --_container-max-block-size: 100dvh;
          --md-dialog-container-inset-block-start: 0px;
        }

        .indexNumber {
          margin-top: 8px;
          font-size: 20px;
          margin-left: 16px;
          margin-right: 16px;
          color: var(--md-sys-color-on-surface);
          opacity: 0.8;
          letter-spacing: 2.7px;
        }

        .cancelButton {
        }

        .footer {
          width: 100%;
          align-items: flex-start;
        }

        .postHeader {
          text-align: center;
        }

        @media (max-width: 800px) {
          #dialog {
            --_fullscreen-header-block-size: 74px;
          }

          .cancelButton {
          }
        }

        :host {
        }
        md-dialog[open][is-safari] {
          height: 100%;
        }

        .userName {
          color: #777;
        }

        .userName {
          padding-bottom: 4px;
        }

        .story {
          padding-bottom: 16px;
          margin-bottom: 8px;
          padding-top: 16px;
          border-bottom: solid #ddd;
          border-bottom-width: 1px;
          font-size: 18px;
          line-height: 1.3;
        }

        @media (max-width: 600px) {
          md-dialog {
          }

          .story {
            max-width: 320px;
          }
        }

        yp-point-actions {
          padding-top: 8px;
        }

        #commentCount {
          font-size: 14px;
        }

        mwc-icon-button.openCloseButton {
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
          width: 500px;
        }

        [hidden] {
          display: none !important;
        }
      `,
    ];
  }

  // Function to scroll to top of dialog

  scrollUp() {
    //await this.updateComplete;
    setTimeout(() => {
      //@ts-ignore
      (this.$$("#dialog") as MdDialog).scrollTop = 0;
    }, 100);
  }

  async updatePoint() {
    const pointIds = this.topLevelPoints.map((point) => point.id);
    if (pointIds) {
      this.currentPointId = pointIds[this.currentIndex!];

      this.currentPoint = this.topLevelPoints[this.currentIndex!];

      this.scrollUp();

      this.tileManager.showComment(this.currentPointId);
    }
  }

  previousPoint() {
    if (this.currentIndex !== 0) {
      this.currentIndex = this.currentIndex - 1;
      this.updatePoint();
    }
  }

  nextPoint() {
    if (this.currentIndex !== this.topLevelPoints.length - 1) {
      this.currentIndex = this.currentIndex + 1;
      this.updatePoint();
    }
  }

  closeDialog() {
    if (this.dialog) {
      this.dialog.close();
      this.fire("closed");
    }
  }

  _setCommentsCount(event: CustomEvent) {
    this.commentsCount = event.detail.count;
  }

  open(event: CustomEvent | undefined = undefined) {
    if (event && event.detail.entity && event.detail.entity.pointIds) {
      const landUseEntity = event.detail.entity as LandUseEntity;
      for (let p = 0; p < this.topLevelPoints.length; p++) {
        if (this.topLevelPoints[p].id == landUseEntity.pointIds![0]) {
          this.currentIndex = p;
          break;
        }
      }
    } else {
      this.currentIndex = 0;
    }
    this.updatePoint();
    this.dialog.show();
  }

  renderCurrentPoint() {
    if (this.currentPoint) {
      return html`
        <div id="content" slot="content">
          <div class="layout vertical newsContainer">
            <yp-user-with-organization
              .user="${this.currentPoint!.User!}"
            ></yp-user-with-organization>
            <yp-magic-text
              id="content"
              class="story"
              textType="pointContent"
              simpleFormat
              truncate="10000"
              .contentLanguage="${this.currentPoint!.language}"
              .content="${this.currentPoint!.content}"
              .contentId="${this.currentPoint!.id}"
            >
            </yp-magic-text>

            <div class="layout horizontal center-center">
              <yp-point-actions
                .point="${this.currentPoint!}"
                hideSharing
              ></yp-point-actions>
            </div>
            <yp-point-comment-list
              id="commentsList"
              open
              disableOpenClose
              @yp-set-comments-count="${this._setCommentsCount}"
              .point="${this.currentPoint!}"
            ></yp-point-comment-list>
          </div>
        </div>
      `;
    } else {
      return nothing;
    }
  }

  renderFooter() {
    return html` <div class="layout horizontal footer">
      <md-outlined-icon-button
        label="Loka"
        class="cancelButton self-start"
        @click="${this.closeDialog}"
        ><md-icon>close</md-icon></md-outlined-icon-button
      >
      <div class="flex"></div>
      <md-outlined-icon-button
        label="Loka"
        ?disabled="${this.currentIndex === 0}"
        id="cancel"
        ?hidden="${this.topLevelPoints.length < 2}"
        @click="${this.previousPoint}"
        ><md-icon>navigate_before</md-icon></md-outlined-icon-button
      >
      <div class="indexNumber">
        ${this.currentIndex + 1}/${this.topLevelPoints.length}
      </div>
      <md-outlined-icon-button
        label="Loka"
        ?hidden="${this.topLevelPoints.length < 2}"
        ?disabled="${this.currentIndex === this.topLevelPoints?.length - 1}"
        id="cancel"
        @click="${this.nextPoint}"
        ><md-icon>navigate_next</md-icon></md-outlined-icon-button
      >
    </div>`;
  }

  render() {
    return html`<md-dialog
      ?fullscreen="${!this.wide}"
      @closed="${() => this.fire("closed")}"
      id="dialog"
      ?is-safari="${this.isSafari}"
      @cancel="${this.scrimDisableAction}"
    >
      <div id="content" slot="content">${this.renderCurrentPoint()}</div>
      <div slot="actions">${this.renderFooter()}</div>
    </md-dialog> `;
  }
}
