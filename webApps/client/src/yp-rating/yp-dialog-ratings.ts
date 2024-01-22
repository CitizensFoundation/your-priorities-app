/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/button/text-button.js";
import "@material/web/dialog/dialog.js";

@customElement("yp-dialog-ratings")
export class YpDialogRatings extends YpBaseElement {
  @property({ type: String })
  itemName: string | undefined;

  @property({ type: Boolean })
  isOpen = false;

  @property({ type: Object })
  post: YpPostData | undefined;

  @property({ type: Object })
  refreshFunction: Function | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
        md-dialog {
          width: 400px;
        }

        .ratingName {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 8px;
          margin-top: 8px;
        }

        .itemHeader {
          font-size: 22px;
          color: var(--md-sys-color-on-primary-container);
          background-color: var(--md-sys-color-primary-container);
          margin-top: 0;
          margin-bottom: 0;
          padding: 0;
          text-align: center;
          padding-bottom: 10px;
          padding-top: 10px;
          width: 100%;
        }

        .itemName {
          font-size: 18px;
          font-weight: bold;
          margin-top: 0;
          margin-bottom: 0;
          text-align: center;
          padding: 16px;
          padding-top: 16px;
          text-decoration: underline;
          padding-bottom: 0;
        }

        .evalIcon {
          margin-right: 8px;
          padding-top: 8px;
          width: 40px;
          height: 40px;
        }

        .itemContainer {
          margin-bottom: 8px;
        }

        .ratingContainer {
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 600px) {
          #ratingsDialog {
            width: 100%;
            height: 100%;
            margin: 0;
          }

          yp-rating {
            width: 100%;
          }
        }

        md-text-button {
          margin-bottom: 24px;
          margin-top: 16px;
        }

        .scrollable {
          width: 100%;
        }
      `,
    ];
  }

  override render() {
    return html`
      <md-dialog
        ?open="${this.isOpen}"
        id="ratingsDialog"
        class="layout vertical">
        ${
          this.post && this.isOpen
            ? html`
                <div slot="headline">
                  <div class="itemHeader layout horizontal center-center">
                    <md-icon class="evalIcon">rate_review</md-icon
                    >[[t('evaluate')]]
                  </div>
                  <div class="itemName">${this.post.name}</div>
                </div>
                <div
                  class="ratingContainer layout vertical center-center"
                  slot="content"
                >
                  ${this.post?.Group.configuration.customRatings?.map(
                    (rating, index) => {
                      return html`
                        <div
                          class="layout vertical self-start center-center itemContainer"
                        >
                          <yp-magic-text
                            .contentId="${this.post!.id}"
                            .extraId="${index}"
                            textOnly
                            .content="${rating.name}"
                            .contentLanguage="${this.post!.Group.language}"
                            class="ratingName"
                            textType="customRatingName"
                          ></yp-magic-text>
                          <yp-rating
                            .postId="${this.post!.id}"
                            class="layout horizontal self-start"
                            .ratingIndex="${index}"
                            .emoji="${rating.emoji}"
                            .numberOf="${rating.numberOf}"
                            .rate="${this.getRating(index)}"
                            @yp-rating-add="${this._addRating}"
                            @yp-rating-delete="${this._deleteRating}"
                          >
                          </yp-rating>
                        </div>
                      `;
                    }
                  )}
                </div>
                <div class="buttons layout horizontal center-center" slot="actions">
                  <md-text-button
                    class="closeButton"
                    raised
                    click="${this._close}"
                    .label="${this.t("close")}"
                  ></md-text-button>
                </div>
              `
            : nothing
        }
      </md-dialog>
    `;
  }

  getRating(index: number) {
    if (
      this.post &&
      window.appUser.loggedIn() &&
      window.appUser.ratingPostsIndex[this.post.id] &&
      window.appUser.ratingPostsIndex[this.post.id][index]
    ) {
      return window.appUser.ratingPostsIndex[this.post.id][index].value;
    } else {
      return null;
    }
  }

  _close() {
    if (this.refreshFunction) this.refreshFunction();
  }

  _addRating(event: CustomEvent) {
    const detail = event.detail;
    window.appUser.updateRatingForPost(detail.postId, detail.ratingIndex, {
      post_id: detail.postId,
      type_index: detail.ratingIndex,
      value: detail.rate,
    } as YpRatingData);

    window.serverApi.postRating(detail.postId, detail.ratingIndex, {
      value: detail.rate,
    });
  }

  _deleteRating(event: CustomEvent) {
    const detail = event.detail;
    window.appUser.updateRatingForPost(
      detail.postId,
      detail.ratingIndex,
      undefined
    );
    window.serverApi.deleteRating(detail.postId, detail.ratingIndex);
  }

  async open(post: YpPostData, refreshFunction: Function) {
    this.refreshFunction = refreshFunction;
    this.post = post;
    this.isOpen = false;
    await this.requestUpdate();
    this.isOpen = true;
  }
}
