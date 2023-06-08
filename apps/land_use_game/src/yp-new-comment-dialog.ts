import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import { YpBaseElement } from "./@yrpri/common/yp-base-element.js";

import "@material/mwc-icon-button";
import "./@yrpri/yp-point/yp-point-comment-list.js";
import "./@yrpri/yp-point/yp-point-actions.js";
import { YpPointCommentList } from "./@yrpri/yp-point/yp-point-comment-list.js";
import { TextArea } from "@material/mwc-textarea";
import { Button } from "@material/mwc-button";
import { YpBaseElementWithLogin } from "./@yrpri/common/yp-base-element-with-login.js";
import { MdDialog } from "@material/web/dialog/dialog.js";

import "@material/web/dialog/dialog.js";
import "@material/web/circularprogress/circular-progress.js";

@customElement("yp-new-comment-dialog")
export class YpNewCommentDialog extends YpBaseElementWithLogin {
  @property({ type: Object })
  point!: YpPointData;

  @property({ type: Object })
  group!: YpGroupData;

  @property({ type: Object })
  user: YpUserData | undefined;

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          padding-top: 16px;
        }

        mwc-textarea {
          width: 460px;
          margin-top: -8px;
        }

        mwc-button {
          margin-top: 16px;
          background-color: var(--accent-color);
          color: #fff;
        }

        .embedData {
          padding-top: 24px;
        }

        .userImage {
          padding-bottom: 16px;
          padding-right: 16px;
        }

        .userImage[rtl] {
          padding-left: 16px;
          padding-right: 4px;
        }

        mwc-icon-button {
          margin-top: 16px;
          padding-bottom: 0;
        }

        mwc-icon-button::shadow #icon {
          width: 36px;
          height: 36px;
          color: #777;
        }

        .container {
          margin-bottom: 32px;
        }

        @media (max-width: 420px) {
          mwc-textarea {
            width: 270px;
          }

          .embedData {
            max-width: 270px;
            margin-left: 24px;
          }

          :host {
            margin-top: 16px;
          }
        }

        @media (max-width: 320px) {
          mwc-textarea {
            width: 220px;
          }

          .embedData {
            max-width: 220px;
          }
        }
      `,
    ];
  }

  openDialog() {
    this._reset();
    (this.$$("#commentDialog") as MdDialog).open = true;
  }

  closeDialog() {
    (this.$$("#commentDialog") as MdDialog).open = false;
  }

  renderFooter() {
    return html` <div class="layout horizontal">
      <md-outlined-button
        .label="${this.t("Close")}"
        class="cancelButton self-start"
        @click="${this.closeDialog}"
      ></md-outlined-button>
      <md-filled-button
        .label="${this.t("Submit")}"
        id="storySubmitButton"
        @click="${this._sendComment}"
      ></md-filled-button>
    </div>`;
  }

  render() {
    return html`
      <md-dialog id="commentDialog">
        ${this.point
          ? html`
              <div class="layout vertical container">
                <div class="layout horizontal">
                  <yp-user-image
                    class="userImage"
                    .user="${this.loggedInUser}"
                    ?rtl="${this.rtl}"
                  ></yp-user-image>
                  <div class="layout vertical">
                    <mwc-textarea
                      id="pointComment"
                      minlength="15"
                      name="pointNew"
                      .value="${this.point.content}"
                      .label="${this.t("point.addComment")}"
                      charCounter
                      rows="5"
                      maxrows="5"
                      maxlength="700"
                    >
                    </mwc-textarea>
                  </div>
                </div>
              </div>
              <div slot="footer">${this.renderFooter()}</div>
            `
          : nothing}
      </md-dialog>
    `;
  }

  async _sendComment() {
    (this.$$("#storySubmitButton") as Button).disabled = true;
    this.point!.content = this.newPointContent;
    let body = { point: this.point };
    let url;
    if (this.point && this.point.content && this.point.content.length > 2) {
      if (this.group) {
        body = { ...body, ...{ group_id: this.group.id } };
        url = "/api/groups/" + this.group.id + "/news_story";
      } else {
        console.error("Can't find send ids");
      }
      if (url) {
        const pointInfo = (await window.serverApi.postNewsStory(
          url,
          body
        )) as YpPostNewsStoryReturn;
        this.fire("save",pointInfo.point_id);
        this.fire("refresh");
        this._reset();
        this.closeDialog();
      }
    } else {
      this._clearButtonState();
      this.fire("yp-error", this.t("point.commentToShort"));
    }
  }

  get newPointContent() {
    return (this.$$("#pointComment") as TextArea).value;
  }

  _reset() {
    this.point = { content: "" } as YpPointData;
    this.point.embed_data = undefined;
    if (this.$$("#pointComment"))
      (this.$$("#pointComment") as TextArea).value = "";
    this._clearButtonState();
  }

  _clearButtonState() {
    if (this.$$("#storySubmitButton"))
      (this.$$("#storySubmitButton") as Button).disabled = false;
  }
}
