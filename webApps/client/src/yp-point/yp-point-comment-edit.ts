import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/filled-button.js";

import "../common/yp-image.js";
import "../yp-user/yp-user-info.js";

import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
import { Button } from "@material/web/button/internal/button.js";
import { TextField } from "@material/web/textfield/internal/text-field.js";

@customElement("yp-point-comment-edit")
export class YpPointCommentEdit extends YpBaseElementWithLogin {
  @property({ type: Object })
  comment: YpPointData | undefined;

  @property({ type: Object })
  point: YpPointData | undefined;

  @property({ type: Object })
  image: YpImageData | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          width: 100%;
          margin-top: 6px;
          margin-bottom: 64px;
        }

        md-outlined-text-field {
          width: 100%;
        }

        md-filled-button {
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .userImage {
          padding-left: 16px;
          padding-right: 16px;
          margin-bottom: 8px;
        }

        @media (max-width: 840px) {
          :host {
            width: 100%;
          }

          md-outlined-text-field {
            width: 90%;
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

  override render() {
    return this.comment
      ? html`
          <div
            class="layout vertical center-center"
            ?hidden="${!this.loggedInUser}"
          >
            <yp-user-image
              hidden
              class="userImage"
              .user="${this.loggedInUser}"
            ></yp-user-image>
            <md-outlined-text-field
                type="textarea"
                id="pointComment"
                minlength="15"
                name="pointComment"
                .value="${this.comment.content}"
                always-float-label="${this.comment.content}"
                .label="${this.t("point.addComment")}"
                charCounter
                rows="4"
                maxrows="7"
                @keydown="${this._keyDown}"
                maxlength="500"
                aria-label="${this.t("point.addComment")}"
              >
              </md-outlined-text-field>
              <div class="layout horizontal">
                <md-filled-button
                  id="submitButton"
                  raised
                  @click="${this._sendComment}"
                  .label="${this.t("point.postComment")}"
                  >${this.t("point.postComment")}</md-filled-button
                >
              </div>
          </div>
        `
      : nothing;
  }

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    super.updated(changedProperties);

    //TODO: See what this is about and fix the iron-resize if needed
    if (changedProperties.has("comment") && this.comment) {
      if (this.comment.value && this.comment.value % 7 === 2) {
        this.fire("iron-resize");
      }
    }
  }

  get newPointComment() {
    return (this.$$("#pointComment") as TextField).value;
  }

  override connectedCallback() {
    super.connectedCallback();
    this._reset();
  }

  _responseError() {
    (this.$$("#submitButton") as Button).disabled = false;
  }

  _reset() {
    this.comment = { content: "" } as YpPointData;
    if (this.$$("#submitButton"))
      (this.$$("#submitButton") as Button).disabled = false;
    if (this.$$("#pointComment"))
      (this.$$("#pointComment") as TextField).value = "";
  }

  async _sendComment() {
    this.comment!.content = this.newPointComment;
    if (
      this.comment &&
      this.comment.content &&
      this.comment.content.length > 0
    ) {
      if (this.point) {
        await window.serverApi.postComment("points", this.point.id, {
          point_id: this.point.id,
          comment: this.comment,
        });
        (this.$$("#submitButton") as Button).disabled = false;
      } else if (this.image) {
        await window.serverApi.postComment("images", this.image.id, {
          image_id: this.image.id,
          comment: this.comment,
        });
        (this.$$("#submitButton") as Button).disabled = false;
      } else {
        console.error("Can't find send ids");
      }
    } else {
      //TODO: Make sure this works
      this.fire("yp-error", this.t("point.commentToShort"));
    }
    this.fire("refresh");
    this._reset();
  }

  _keyDown(event: KeyboardEvent) {
    if (event.code == "enter") {
      this._sendComment();
    }
  }
}
