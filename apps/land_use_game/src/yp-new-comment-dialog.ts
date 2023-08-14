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

import "@material/web/dialog/dialog.js";
import "@material/web/progress/circular-progress.js";
import { Dialog } from "@material/web/dialog/internal/dialog.js";

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
          --mdc-theme-primary: var(--md-sys-color-primary);
          --mdc-text-field-ink-color: var(--md-sys-color-on-surface);
          --mdc-text-field-label-ink-color: var(--md-sys-color-on-surface);
          --mdc-text-field-fill-color: var(--md-sys-color-surface);

          --mdc-text-area-outlined-hover-border-color: var(
            --md-sys-color-surface
          );
          --mdc-text-area-outlined-idle-border-color: var(
            --md-sys-color-surface
          );
          --mdc-notched-outline-border-color: var(
            --md-sys-color-surface-variant
          );
        }

        mwc-button {
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

  async openDialog() {
    this._reset();
    (this.$$("#commentDialog") as Dialog).show();
  }

  closeDialog() {
    (this.$$("#commentDialog") as Dialog).close();
  }

  renderFooter() {
    return html` <div class="layout horizontal">
      <md-outlined-button
        class="cancelButton self-start"
        @click="${this.closeDialog}"
      >${this.t("Close")}</md-outlined-button>
      <md-filled-button
        id="storySubmitButton"
        @click="${this._sendComment}"
      >${this.t("Submit")}</md-filled-button>
    </div>`;
  }

  render() {
    return html`
      <md-dialog id="commentDialog" escapeKeyAction="" scrimClickAction="">
        ${this.point
          ? html`
              <div class="layout vertical container" slot="content">
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
              <div slot="actions">${this.renderFooter()}</div>
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
