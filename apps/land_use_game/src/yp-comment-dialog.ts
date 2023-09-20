import { html, css, nothing, PropertyValueMap } from "lit";
import { customElement, property } from "lit/decorators.js";

import { YpBaseElement } from "./@yrpri/common/yp-base-element.js";

import "@material/mwc-icon-button";
import "./@yrpri/yp-point/yp-point-comment-list.js";
import "./@yrpri/yp-point/yp-point-actions.js";
import "./@yrpri/yp-magic-text/yp-magic-text.js";
import "./@yrpri/yp-user/yp-user-with-organization.js";
import { YpPointCommentList } from "./@yrpri/yp-point/yp-point-comment-list.js";
import { Dialog } from "@material/mwc-dialog";
import { YpBaseElementWithLogin } from "./@yrpri/common/yp-base-element-with-login.js";

@customElement("yp-comment-dialog")
export class YpCommentDialog extends YpBaseElementWithLogin {
  @property({ type: Object })
  point!: YpPointData;

  @property({ type: Object })
  group!: YpGroupData;

  @property({ type: Object })
  user: YpUserData | undefined;

  @property({ type: Boolean })
  withComments = false;

  @property({ type: Boolean })
  open = false;

  @property({ type: Boolean })
  hideUser = false;

  @property({ type: Number })
  commentsCount = 0;

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
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
      css`
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
            max-width:320px;
          }
        }

        @media (max-width: 340px) {
          md-dialog {
          }

          .story {
            max-width:100%;
          }
        }



        yp-point-actions {
          padding-top: 8px;
        }

        .container {
        }

        .pointContent {

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

  async openDialog(event: CustomEvent) {
    (this.$$("#commentDialog") as Dialog).show();
    this.point = await window.serverApi.getParentPoint(
      this.group.id,
      event.detail.entity.pointIds[0]
    );
  }

  closeDialog() {
    (this.$$("#commentDialog") as Dialog).close();
    this.fire("close");
  }

  renderFooter() {
    return html`
      <md-text-button
        dialogAction="close"
        @click="${this.closeDialog}"
        slot="footer"
        >${this.t("close")}</md-text-button
      >
    `;
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {}

  render() {
    return html`
      <md-dialog
        id="commentDialog"
        @cancel="${this.scrimDisableAction}"
        ?is-safari="${this.isSafari}"
        @closed="${this.closeDialog}"
        .fullscreen="${!this.wide}"
        escapeKeyAction=""
        scrimClickAction=""
      >
        ${this.point
          ? html`
              <div id="content" slot="content">
                <div class="layout vertical newsContainer">
                  <yp-user-with-organization
                    .user="${this.point.User!}"
                  ></yp-user-with-organization>
                  <yp-magic-text
                    id="content"
                    class="story"
                    textType="pointContent"
                    simpleFormat
                    truncate="10000"
                    .contentLanguage="${this.point.language}"
                    .content="${this.point.content}"
                    .contentId="${this.point.id}"
                  >
                  </yp-magic-text>

                  <div class="layout horizontal">
                    <yp-point-actions
                      .point="${this.point}"
                      hideSharing
                    ></yp-point-actions>
                  </div>
                  <yp-point-comment-list
                    id="commentsList"
                    open
                    disableOpenClose
                    @yp-set-comments-count="${this._setCommentsCount}"
                    .point="${this.point}"
                  ></yp-point-comment-list>
                </div>
              </div>
              <div slot="actions">${this.renderFooter()}</div>
            `
          : nothing}
      </md-dialog>
    `;
  }

  _setOpenToValue() {
    if (this.open) {
      this._setClosed();
    } else {
      this._setOpen();
    }
  }

  _openChanged() {
    if (this.open && this.point) {
      (this.$$("#commentsList") as YpPointCommentList).refresh();
    }
  }

  get noComments() {
    return !(this.commentsCount == 0);
  }

  _setOpen() {
    this.open = true;
    if (this.$$("#commentsList"))
      (this.$$("#commentsList") as YpPointCommentList).setOpen();
  }

  _setClosed() {
    this.open = false;
    (this.$$("#commentsList") as YpPointCommentList).setClosed();
  }

  _setCommentsCount(event: CustomEvent) {
    this.commentsCount = event.detail.count;
  }

  _pointChanged() {
    if (this.point && this.point.PointRevisions) {
      this.user = this.point.PointRevisions[0].User;
    } else {
      this.user = undefined;
    }

    this.open = false;
  }

  loginName() {
    return this.point.PointRevisions![0].User.name;
  }
}
