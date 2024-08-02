import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import { ifDefined } from "lit/directives/if-defined.js";

import "@material/web/labs/card/filled-card.js";
import "@material/web/labs/card/elevated-card.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import { ShadowStyles } from "../common/ShadowStyles.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";

import "../yp-magic-text/yp-magic-text.js";
import "./yp-post-cover-media.js";
import "./yp-post-actions.js";

import "./yp-post-tags.js";

import "@material/web/iconbutton/outlined-icon-button.js";

@customElement("yp-post-list-item")
export class YpPostListItem extends YpBaseElement {
  @property({ type: String })
  selectedMenuItem: string | undefined;

  @property({ type: Boolean })
  mini = false;

  @property({ type: Boolean })
  isAudioCover = false;

  @property({ type: Object })
  post!: YpPostData;

  //TODO: Make corners on posts card different
  static override get styles() {
    return [
      super.styles,
      css`
        .post-name {
          cursor: pointer;
          font-size: 22px;
          font-weight: 700;
          text-align: left;
          margin-bottom: 8px;
          line-height: 33px;
        }

        .share {
          margin-left: 16px;
        }

        .post-name[largefont] {
          font-size: 19px;
        }

        .actionsBar {
          margin-left: 372px;
          margin-top: -42px;
        }

        .postCardCursor {
          cursor: pointer;
        }

        .postCard {
        }

        :host {
          display: block;
        }

        .postCard {
          height: 100%;
        }

        .postCard[hide-post-cover] {
          height: 190px;
        }

        a {
          color: var(--md-sys-color-on-surface);
        }

        yp-post-cover-media {
          width: 360px;
          min-width: 360px;
          height: 203px;
          margin-right: 26px;
        }

        .post-name[mini] {
          padding: 16px;
        }

        .description {
          font-size: 17px;
          font-weight: 400;
          line-height: 26px;
          cursor: pointer;
        }

        .description[widetext] {
          font-size: 16px;
          line-height: 1.3;
        }

        .description[largefont] {
          font-size: 15px;
        }

        .postActions {
        }

        .shareIcon {
          position: absolute;
          left: 8px;
          bottom: 2px;
          text-align: right;
          width: 48px;
          height: 48px;
        }

        .customRatings {
          position: absolute;
          bottom: 10px;
          right: 6px;
        }

        :host {
        }

        @media (max-width: 960px) {
          .customRatings {
            bottom: 12px;
          }

          :host {
            width: 100%;
            max-width: 423px;
          }

          .description[has-custom-ratings] {
            padding-bottom: 28px;
          }

          .postCard {
            margin-left: 0;
            margin-right: 0;
            padding-left: 0;
            padding-right: 0;
            width: 100%;
            height: 100%;
          }

          .postCard[mini] {
            width: 210px;
            height: 100%;
          }

          .card {
            margin-left: 0;
            margin-right: 0;
            padding-left: 0;
            padding-right: 0;
            width: 100%;
            height: 100%;
          }

          .card[mini] {
            width: 210px;
            height: 100%;
          }

          yp-post-cover-media {
            width: 100%;
            height: 230px;
          }

          yp-post-cover-media[mini] {
            width: 210px;
            height: 118px;
            min-height: 118px;
          }
        }

        [hidden] {
          display: none !important;
        }

        a {
          text-decoration: none;
        }

        .share[mini] {
          display: none;
        }
      `,
    ];
  }

  renderDescription() {
    return html`
      ${!this.post.public_data?.structuredAnswersJson
        ? html`
            <yp-magic-text
              class="description layout horizontal"
              ?hasCustomRatings="${this.post.Group.configuration.customRatings}"
              ?hidden="${this.hideDescription}"
              textType="postContent"
              .contentLanguage="${this.post.language}"
              textOnly
              .content="${this.post.description}"
              .contentId="${this.post.id}"
              truncate="220"
            >
            </yp-magic-text>
          `
        : html`
            <yp-magic-text
              id="description"
              textType="postContent"
              .contentLanguage="${this.post.language}"
              ?hidden="${this.hideDescription}"
              .content="${this.structuredAnswersFormatted}"
              .contentId="${this.post.id}"
              class="description"
              truncate="120"
            >
            </yp-magic-text>
          `}
    `;
  }

  renderTags() {
    return html` <yp-post-tags .post="${this.post}"></yp-post-tags> `;
  }

  //TODO: Write a server side script to make sure Group.configuration is always there
  override render() {
    return this.post
      ? html`
            <div
              ?mini="${this.mini}"
              .hide-post-cover="${this.post.Group.configuration.hidePostCover}"
              .hide-description="${
                this.post.Group.configuration.hidePostDescription
              }"
              ?hide-actions="${
                this.post.Group.configuration.hidePostActionsInGrid
              }"
              audio-cover="${this.isAudioCover}"
            >
              <div class="layout vertical">
                <a
                  href="${ifDefined(this._getPostLink(this.post))}"
                  @click="${this.goToPostIfNotHeader}"
                  id="mainArea"
                >
                  <div class="layout horizontal">
                    <yp-post-cover-media
                      ?mini="${this.mini}"
                      top-radius
                      ?audioCover="${this.isAudioCover}"
                      .altTag="${this.post.name}"
                      .post="${this.post}"
                      ?hidden="${this.post.Group.configuration.hidePostCover}"
                    ></yp-post-cover-media>
                    <div class="postNameContainer">
                      <div
                        class="post-name  layout horizontal"
                        ?mini="${this.mini}"
                        id="postName"
                        ?largeFont="${this.largeFont}"
                      >
                        <yp-magic-text
                          id="postNameMagicText"
                          textType="postName"
                          ?largeFont="${this.largeFont}"
                          .contentLanguage="${this.post.language}"
                          textOnly
                          .content="${this.post.name}"
                          .contentId="${this.post.id}"
                        >
                        </yp-magic-text>
                        <div class="flex"></div>
                        ${this.renderDebate()}
                        ${this.renderShare()}
                      </div>
                      ${
                        this.post.Group.configuration?.usePostTagsForPostCards
                          ? this.renderTags()
                          : this.renderDescription()
                      }
                    </div>
                  </div>
                </a>
                <div
                  ?hidden="${
                    this.post.Group.configuration.hidePostActionsInGrid
                  }"
                  @click="${this._onBottomClick}"
                >
                  ${this.renderActions()}
                </div>
              </div>
            </div>
        </div>
        `
      : nothing;
  }

  renderShare() {
    return html`
      ${this.post.Group.configuration?.hideSharing
        ? nothing
        : html`
            <div class="share">
              <md-filled-tonal-icon-button
                .label="${this.t("post.shareInfo")}"
                @click="${this._shareTap}"
                ><md-icon>share</md-icon></md-filled-tonal-icon-button
              >
            </div>
          `}
    `;
  }

  renderDebate() {
    return html`
      <yp-post-actions
        class="postActions"
        .post="${this.post}"
        onlyShowDebate
        ?hidden="${this.mini}"
      >
      </yp-post-actions>
    `;
  }

  renderActions() {
    return html`<div class="layout horizontal actionsBar">
      ${this.post.Group.configuration.customRatings
        ? html`
            <yp-post-ratings-info
              class="customRatings"
              .post="${this.post}"
            ></yp-post-ratings-info>
          `
        : html`
            <yp-post-actions
              class="postActions"
              .post="${this.post}"
              forceHideDebate
              .forceShowDebate="${this.post.Group.configuration
                .forceShowDebateCountOnPost}"
              ?hidden="${this.mini}"
            >
            </yp-post-actions>
          `}
    </div>`;
  }

  _sharedContent(event: CustomEvent) {
    const shareData = event.detail;
    window.appGlobals.activity(
      "postShared",
      shareData.social,
      this.post ? this.post.id : -1
    );
  }

  get _fullPostUrl() {
    return encodeURIComponent(
      "https://" + window.location.host + "/post/" + this.post.id
    );
  }

  get structuredAnswersFormatted(): string {
    if (
      this.post &&
      this.post.public_data &&
      this.post.public_data.structuredAnswersJson &&
      this.post.Group.configuration &&
      this.post.Group.configuration.structuredQuestionsJson
    ) {
      const questionHash: Record<string, YpStructuredQuestionData> = {};
      let outText = "";
      this.post.Group.configuration.structuredQuestionsJson.forEach(
        (question) => {
          if (question.uniqueId) {
            questionHash[question.uniqueId] = question;
          }
        }
      );

      for (
        let i = 0;
        i < this.post.public_data.structuredAnswersJson.length;
        i++
      ) {
        const answer = this.post.public_data.structuredAnswersJson[i];
        if (answer && answer.value) {
          const question = questionHash[answer.uniqueId];
          if (question) {
            outText += question.text + ": ";
            outText += answer.value + " ";
          }
          if (outText.length > 120) {
            break;
          }
        }
      }

      return outText;
    } else {
      return "";
    }
  }

  _onBottomClick(event: CustomEvent) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  clickOnA() {
    this.$$("#mainArea")?.click();
  }

  _getPostLink(post: YpPostData) {
    if (post) {
      if (
        post.Group.configuration &&
        post.Group.configuration.disablePostPageLink
      ) {
        return "#";
      } else if (
        post.Group.configuration &&
        post.Group.configuration.resourceLibraryLinkMode
      ) {
        return post.description.trim();
      } else {
        return "/post/" + post.id;
      }
    } else {
      console.warn("Trying to get empty post link");
      return "#";
    }
  }

  _shareTap(event: CustomEvent) {
    window.appGlobals.activity(
      "postShareCardOpen",
      event.detail.brand,
      this.post ? this.post.id : -1
    );

    window.appDialogs.getDialogAsync(
      "shareDialog",
      (dialog: YpShareDialogData) => {
        dialog.open(
          this._fullPostUrl,
          this.t("post.shareInfo"),
          this._sharedContent
        );
      }
    );
  }

  get hideDescription(): boolean {
    return (this.mini ||
      (this.post &&
        this.post.Group.configuration &&
        this.post.Group.configuration.hidePostDescription)) as boolean;
  }

  goToPostIfNotHeader(event: CustomEvent) {
    event.preventDefault();

    if (
      this.post.Group.configuration &&
      this.post.Group.configuration.disablePostPageLink
    ) {
      console.log("goToPostDisabled");
    } else if (
      this.post.Group.configuration &&
      this.post.Group.configuration.resourceLibraryLinkMode
    ) {
      // Do nothing
    } else {
      YpNavHelpers.goToPost(this.post.id);
    }

    if (this.post && !this.mini) {
      window.appGlobals.cache.cachedPostItem = this.post;
    }
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has("post") && this.post) {
      if (this.post.cover_media_type === "audio") {
        this.isAudioCover = true;
      } else {
        this.isAudioCover = false;
      }
    }
  }

  updateDescriptionIfEmpty(description: string) {
    if (!this.post.description || this.post.description == "") {
      this.post.description = description;
    }
  }

  _refresh() {
    //TODO: Fix ts type
    window.appDialogs.getDialogAsync(
      "postEdit",
      (dialog: { selected: number }) => {
        dialog.selected = 0;
        this.fire("refresh");
      }
    );
  }

  _openReport() {
    window.appGlobals.activity("open", "post.report");
    //TODO: Fix ts type
    window.appDialogs.getDialogAsync(
      "apiActionDialog",
      (dialog: {
        setup: (
          arg0: string,
          arg1: string,
          arg2: () => void,
          arg3: string,
          arg4: string
        ) => void;
        open: () => void;
      }) => {
        dialog.setup(
          "/api/posts/" + this.post.id + "/report",
          this.t("reportConfirmation"),
          this._onReport.bind(this),
          this.t("post.report"),
          "PUT"
        );
        dialog.open();
      }
    );
  }

  _onReport() {
    window.appGlobals.notifyUserViaToast(
      this.t("post.report") + ": " + this.post.name
    );
  }
}
