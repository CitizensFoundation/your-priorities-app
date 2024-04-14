import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import { YpBaseElement } from "../common/yp-base-element.js";

import "@material/web/textfield/outlined-text-field.js";

import "@material/web/button/text-button.js";

import "../yp-user/yp-user-image.js";

import "./yp-point-news-story-embed.js";

import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
import { TextField } from "@material/web/textfield/internal/text-field.js";
import { Button } from "@material/web/button/internal/button.js";

@customElement("yp-point-news-story-edit")
export class YpPointNewsStoryEdit extends YpBaseElementWithLogin {
  @property({ type: Boolean })
  loadingUrlPreview = true;

  @property({ type: Boolean })
  loadingPostStory = true;

  @property({ type: String })
  label: string | undefined;

  @property({ type: String })
  addLabel: string | undefined;

  @property({ type: Object })
  point: YpPointData | undefined;

  @property({ type: Number })
  postId: number | undefined;

  @property({ type: Number })
  postGroupId: number | undefined;

  @property({ type: Number })
  groupId: number | undefined;

  @property({ type: Number })
  communityId: number | undefined;

  @property({ type: Number })
  domainId: number | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          padding-top: 16px;
        }



        md-outlined-text-field {
          width: 460px;
          margin-top: -8px;
        }

        md-text-button {
          margin-top: 16px;
        }

        .embedData {
          padding-top: 24px;
        }

        #storySubmitButton {
          margin-top: 16px;
        }

        .userImage {
          padding-bottom: 16px;
          padding-right: 16px;
        }

        .userImage[rtl] {
          padding-left: 16px;
          padding-right: 4px;
        }

        md-icon-button {
          margin-top: 16px;
          padding-bottom: 0;
        }

        md-icon-button::shadow #icon {
          width: 36px;
          height: 36px;
        }

        .container {
          margin-bottom: 32px;
        }

        @media (max-width: 420px) {
          md-outlined-text-field {
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
          md-outlined-text-field {
            width: 220px;
          }

          .embedData {
            max-width: 220px;
          }
        }
      `,
    ];
  }

  override render() {
    return this.point
      ? html`
          <div class="layout vertical container">
            <div class="layout horizontal">
              <yp-user-image
                class="userImage"
                .user="${this.loggedInUser}"
                ?rtl="${this.rtl}"
              ></yp-user-image>
              <div class="layout vertical">
                <md-outlined-text-field
                  type="textarea"
                  id="pointNewsStory"
                  minlength="15"
                  name="pointNewsStory"
                  .value="${this.point.content}"
                  .label="${this.label || this.t("point.addNewsStory")}"
                  charCounter
                  rows="4"
                  maxrows="7"
                  @keydown="${this._keyDown}"
                  maxlength="500"
                >
                </md-outlined-text-field>
                <div class="layout horizontal center-center">
                  <md-filled-button
                    id="storySubmitButton"
                    @click="${this._sendStory}"
                    >${this.addLabel ||
                    this.t("point.postNewsStory")}</md-filled-button
                  >
                </div>
              </div>
            </div>

            <div class="layout horizontal center-center">
              ${this.point.embed_data
                ? html`
                    <div class="embedData layout vertical center-center">
                      <yp-point-news-story-embed
                        .embedData="${this.point.embed_data}"
                      ></yp-point-news-story-embed>
                      <md-icon-button
                        .label="${this.t("clearEmbededMedia")}"
                        icon="clear"
                        @click="${this._clearEmbed}"
                      ></md-icon-button>
                    </div>
                  `
                : html``}
            </div>
          </div>
        `
      : nothing;
  }

  _clearButtonStat() {
    (this.$$("#storySubmitButton") as Button).disabled = false;
  }

  override connectedCallback() {
    super.connectedCallback();
    this._reset();
  }

  override firstUpdated(props: Map<string | number | symbol, unknown>) {
    super.firstUpdated(props);
    (this.$$("#pointNewsStory") as TextField).addEventListener(
      "paste",
      this._checkForUrl.bind(this)
    );
  }

  get newPointContent() {
    return (this.$$("#pointNewsStory") as TextField).value;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    (this.$$("#pointNewsStory") as TextField).removeEventListener(
      "paste",
      this._checkForUrl.bind(this)
    );
  }

  _reset() {
    this.point = { content: "" } as YpPointData;
    this.point.embed_data = undefined;
    if (this.$$("#pointNewsStory"))
      (this.$$("#pointNewsStory") as TextField).value = "";
    this._clearButtonState();
  }

  async _sendStory() {
    (this.$$("#storySubmitButton") as Button).disabled = true;
    this.point!.content = this.newPointContent;
    let body = { point: this.point };
    let url;
    if (this.point && this.point.content && this.point.content.length > 2) {
      if (this.postId && this.postGroupId) {
        body = { ...body, ...{ post_id: this.postId } };
        url = "/api/groups/" + this.postGroupId + "/post/news_story";
      } else if (this.groupId) {
        body = { ...body, ...{ group_id: this.groupId } };
        url = "/api/groups/" + this.groupId + "/news_story";
      } else if (this.communityId) {
        body = { ...body, ...{ community_id: this.communityId } };
        url = "/api/communities/" + this.communityId + "/news_story";
      } else if (this.domainId) {
        url = "/api/domains/" + this.domainId + "/news_story";
        body = { ...body, ...{ domain_id: this.domainId } };
      } else {
        console.error("Can't find send ids");
      }
      if (url) {
        await window.serverApi.postNewsStory(url, body);
        this.fire("refresh");
        this._reset();
      }
    } else {
      this._clearButtonState();
      this.fire("yp-error", this.t("point.commentToShort"));
    }
  }

  _clearButtonState() {
    if (this.$$("#storySubmitButton"))
      (this.$$("#storySubmitButton") as Button).disabled = false;
  }

  _keyDown(event: KeyboardEvent) {
    if (event.code == "Space" || event.code == "enter") {
      this._checkForUrl();
    }
  }

  _clearEmbed() {
    this.point!.embed_data = undefined;
    this.requestUpdate();
  }

  async _checkForUrl() {
    if (this.point && !this.point.embed_data) {
      const urlRegex =
        /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
      const urlRegex2 =
        /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
      //      const urls1 = urlRegex.exec(this.point.content);
      const urls2 = urlRegex2.exec(this.newPointContent);
      if (urls2 && urls2.length > 0) {
        //TODO: Error should do this._clearButtonState
        const previewResponse = (await window.serverApi.pointUrlPreview(
          `url=${urls2[0]}`
        )) as Array<YpEmbedData>;
        if (previewResponse && previewResponse.length > 0 && previewResponse[0].url && previewResponse[0].title) {
          this.point.embed_data = previewResponse[0];
          this.requestUpdate();
        }
      }
    }
  }
}
