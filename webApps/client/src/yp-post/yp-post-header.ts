import { YpAccessHelpers } from "../common/YpAccessHelpers.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";

import { YpCollection } from "../yp-collection/yp-collection.js";
import { nothing, html, TemplateResult, LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/iconbutton/filled-tonal-icon-button.js";
import "@material/web/labs/card/outlined-card.js";

//import '../yp-post/yp-posts-list.js';
//import '../yp-post/yp-post-card-add.js';
import "./yp-post-actions.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import { YpFormattingHelpers } from "../common/YpFormattingHelpers.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpPostCard } from "./yp-post-card.js";
import { ShadowStyles } from "../common/ShadowStyles.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";

import "./yp-post-transcript.js";
//import { any /*YpApiActionDialog*/ } from '../yp-api-action-dialog/yp-api-action-dialog.js';
import { YpPostBaseWithAnswers } from "./yp-post-base-with-answers.js";
import { Corner, MdMenu } from "@material/web/menu/menu.js";
import { YpPostCoverMedia } from "./yp-post-cover-media.js";

@customElement("yp-post-header")
export class YpPostHeader extends YpPostBaseWithAnswers(
  YpBaseElementWithLogin
) {
  @property({ type: Boolean })
  isAudioCover = false;

  @property({ type: Boolean })
  hideActions = false;

  @property({ type: Boolean })
  transcriptActive = false;

  //TODO: Maybe refactor this if post header is never used with both
  @property({ type: Boolean })
  onlyRenderTopActionBar = false;

  @property({ type: Boolean })
  hideTopActionBar = false;

  @property({ type: Boolean })
  hasNoLeftRightButtons = false;

  @property({ type: Object })
  override post!: YpPostData;

  @property({ type: String })
  postPositionCounter = "";

  //TODO: Make corners on posts card different
  static override get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        .innerMediaContainer {
          width: 100%;
        }

        :host {
          display: block;
        }

        .postPositionCounter {
          font-size: 22px;
          font-weight: 400;
          line-height: 33px;
          margin-top: 2px;
          opacity: 0.5;
        }

        .category-icon {
          width: 100px;
          height: 100px;
        }

        .topActionButton {
          margin-left: 32px;
        }

        yp-post-cover-media {
          width: 420px;
          height: 236px;
        }

        .description {
          font-size: 18px;
          font-weight: 400;
          line-height: 25px;
        }

        .postName {
          font-family: var(
            --md-ref-typeface-brand
          ); /*var(--md-sys-typescale-title-medium-font);*/
          font-size: var(--md-sys-typescale-title-medium-size, 36px);
          font-weight: var(--md-sys-typescale-title-medium-weight, 700);
          line-height: var(--md-sys-typescale-title-medium-line-height, 48px);
          text-align: left;
          margin-bottom: 16px;
        }

        @media (max-width: 600px) {
          .postName {
            font-size: var(--md-sys-typescale-title-medium-size, 26px);
            font-weight: var(--md-sys-typescale-title-medium-weight, 700);
            line-height: var(--md-sys-typescale-title-medium-line-height, 32px);
            margin-top: 16px;
            margin-bottom: 16px;
            padding-left: 8px;
            padding-right: 8px;
          }

          .container {
            padding-left: 16px;
            padding-right: 16px;
          }
        }

        .actionBar {
          margin-bottom: 48px;
        }

        .moreVert {
        }

        .userInfo {
          margin-bottom: 16px;
        }

        .mediaContainer {
          align-self: flex-start;
          width: 100%;
        }

        .customRatings {
          position: absolute;
          bottom: 12px;
          right: 85px;
        }

        .coverContainer {
          margin-right: 24px;
          margin-bottom: 40px;
        }

        @media (max-width: 960px) {
          .description[has-custom-ratings] {
            padding-bottom: 18px;
          }

          .customRatings {
            right: 46px;
          }

          .postCard {
            width: 100%;
          }

          yp-post-cover-media {
            width: 409px;
            height: 225px;
          }

          .coverContainer {
            width: 100%;
          }

          .infoContainer {
          }

          .description {
          }
        }

        @media (max-width: 800px) {
          :host {
            width: 100%;
          }

          yp-post-cover-media {
            width: 409px;
            height: 225px;
          }
        }

        @media (max-width: 430px) {
          :host {
            width: 100%;
          }

          .coverContainer {
            margin-right: 0;
          }

          .postCard {
            width: 100% !important;
          }

          yp-post-cover-media {
            height: calc(92vw * 9 / 16);
            width: 92vw;
          }

          .headerTopLevel {
            width: 100%;
          }

          .description {
            padding-bottom: 8px;
          }
        }

        @media (max-width: 375px) {
          yp-post-cover-media[header-mode] {
            height: 207px;
          }
          yp-post-cover-media[audio-cover] {
            height: 80px;
          }
        }

        @media (max-width: 360px) {
          yp-post-cover-media[header-mode] {
            height: 200px;
          }
          yp-post-cover-media[audio-cover] {
            height: 90px;
          }
        }

        @media (max-width: 320px) {
          yp-post-cover-media[header-mode] {
            height: 180px;
          }
          yp-post-cover-media[audio-cover] {
            height: 90px;
          }
        }

        @media (min-width: 960px) {
          yp-post-cover-media[has-transcript][audio-cover] {
            margin-bottom: 16px;
          }
        }

        [hidden] {
          display: none !important;
        }
      `,
    ];
  }

  renderPostInformation() {
    return html`
      <div class="infoContainer">
        ${!this.post.public_data?.structuredAnswersJson
          ? html`
              <yp-magic-text
                id="description"
                textType="postContent"
                .contentLanguage="${this.post.language}"
                content="${this.post.description}"
                ?noUserInfo="${!this.post.Group.configuration
                  ?.showWhoPostedPosts}"
                disableTranslation
                .structuredQuestionsConfig="${this.post.Group.configuration
                  ?.structuredQuestions}"
                ?hasCustomRatings="${this.post.Group.configuration
                  ?.customRatings}"
                ?simpleFormat="${this.post.Group.configuration
                  ?.descriptionSimpleFormat}"
                .contentId="${this.post.id}"
                class="description"
                .truncate="${this.post.Group.configuration
                  ?.descriptionTruncateAmount}"
                .moreText="${this.t("readMore")}"
                .closeDialogText="${this.t("close")}"
              >
              </yp-magic-text>
            `
          : html`
              <yp-magic-text
                id="description"
                textType="postContent"
                .contentLanguage="${this.post.language}"
                .content="${this.structuredAnswersFormatted}"
                ?noUserInfo="${!this.post.Group.configuration
                  ?.showWhoPostedPosts}"
                simpleFormat
                skipSanitize
                .contentId="${this.post.id}"
                class="description"
                .truncate="${this.post.Group.configuration
                  .descriptionTruncateAmount || 500}"
                .moreText="${this.t("readMore")}"
                .closeDialogText="${this.t("close")}"
              >
              </yp-magic-text>
            `}
      </div>
    `;
  }

  renderMenu() {
    if (this.hasPostAccess) {
      return html`
        <div style="position: relative;" class="moreVert">
          <md-filled-tonal-icon-button
            id="menuAnchor"
            type="button"
            class="topActionButton"
            @click="${this._openPostMenu}"
            title="${this.t("openPostMenu")}"
            ><md-icon>more_vert</md-icon>
          </md-filled-tonal-icon-button>
          <md-menu
            id="actionMenu"
            positioning="popover"
            .menuCorner="${Corner.START_START}"
            anchor="menuAnchor"
          >
            <md-menu-item @click="${this._openEdit}" hidden>
              ${this.t("post.edit")}
            </md-menu-item>
            <md-menu-item
              @click="${this._openMovePost}"
              ?hidden="${true ||
              !YpAccessHelpers.checkPostAdminOnlyAccess(this.post)}"
            >
              ${this.t("post.move")}
            </md-menu-item>
            <md-menu-item
              @click="${this._openPostStatusChange}"
              ?hidden="${true ||
              !YpAccessHelpers.checkPostAdminOnlyAccess(this.post)}"
            >
              ${this.t("post.statusChange")}
            </md-menu-item>
            <md-menu-item
              @click="${this._openPostStatusChangeNoEmails}"
              ?hidden="${true ||
              !YpAccessHelpers.checkPostAdminOnlyAccess(this.post)}"
            >
              ${this.t("post.statusChangeNoEmails")}
            </md-menu-item>
            <md-menu-item @click="${this._openDelete}">
              ${this.t("post.delete")}
            </md-menu-item>
            <md-menu-item
              @click="${this._openAnonymizeContent}"
              ?hidden="${!YpAccessHelpers.checkPostAdminOnlyAccess(this.post)}"
            >
              ${this.t("anonymizePostAndContent")}
            </md-menu-item>
            <md-menu-item
              @click="${this._openDeleteContent}"
              ?hidden="${!YpAccessHelpers.checkPostAdminOnlyAccess(this.post)}"
            >
              ${this.t("deletePostContent")}
            </md-menu-item>

            <md-menu-item hidden @click="${this._openReport}">
              ${this.t("post.report")}
            </md-menu-item>
          </md-menu>
        </div>
      `;
    } else {
      return nothing;
    }
  }

  renderActions() {
    return html`${this.post.Group.configuration?.customRatings
      ? html`
          <yp-post-ratings-info
            class="customRatings"
            .post="${this.post}"
          ></yp-post-ratings-info>
        `
      : !this.hideActions ? html`
          <yp-post-actions
            ?hidden="${this.hideActions}"
            hideDebate
            headerMode
            elevation="-1"
            forceShowDebate
            floating
            class="postActions"
            .post="${this.post}"
          ></yp-post-actions>
        ` : nothing} `;
  }

  renderName() {
    return html`<yp-magic-text
      class="postName"
      textType="postName"
      .contentLanguage="${this.post.language}"
      .content="${this.post.name}"
      .contentId="${this.post.id}"
    >
    </yp-magic-text>`;
  }

  renderUser() {
    return html`<div class="layout horizontal userInfo">
      <yp-user-with-organization
        class="userWithOrg"
        mediumImage
        .user="${this.post.User}"
      ></yp-user-with-organization>
    </div>`;
  }

  renderCoverMedia() {
    return html` <div class="layout vertical center-center coverContainer">
      <yp-post-cover-media
        top-left-radius
        show-video
        show-audio
        ?hasTranscript="${this.post.public_data?.transcript?.text}"
        .altTag="${this.post.name}"
        ?audio-cover="${this.isAudioCover}"
        headerMode
        .post="${this.post}"
      >
      </yp-post-cover-media>
      ${this.transcriptActive
        ? html` <yp-post-transcript .post="${this.post}"></yp-post-transcript> `
        : nothing}
    </div>`;
  }

  renderClose() {
    return html`<md-filled-tonal-icon-button
      ?hidden="${!this.wide}"
      @click="${() => YpNavHelpers.redirectTo("/group/" + this.post.group_id)}"
      title="${this.t("close")}"
      ><md-icon
        >${this.hasNoLeftRightButtons ? "arrow_upward" : "close"}</md-icon
      >
    </md-filled-tonal-icon-button>`;
  }

  renderTopActionButtons() {
    return html`
      ${this.hasPostAccess
        ? html`
            <md-filled-tonal-icon-button
              type="button"
              class="topActionButton"
              @click="${this._openEdit}"
              title="${this.t("openEdit")}"
              ><md-icon>edit</md-icon>
            </md-filled-tonal-icon-button>
          `
        : nothing}
      <md-filled-tonal-icon-button
        type="button"
        class="topActionButton"
        @click="${this._openReport}"
        title="${this.t("openReportPost")}"
        ><md-icon>report</md-icon>
      </md-filled-tonal-icon-button>
      <md-filled-tonal-icon-button
        type="button"
        ?hidden="${this.post.Group.configuration?.hideSharing}"
        class="topActionButton"
        @click="${this._shareTap}"
        title="${this.t("openShare")}"
        ><md-icon>share</md-icon>
      </md-filled-tonal-icon-button>
    `;
  }

  override render() {
    return html`
      <div
        class="layout vertical"
        role="heading"
        aria-level="1"
        aria-label="${this.post.name}"
      >
        ${!this.hideTopActionBar
          ? html`
              <div class="layout horizontal actionBar">
                ${this.renderClose()}
                <div class="flex"></div>
                ${this.postPositionCounter
                  ? html`<div class="postPositionCounter">
                      ${this.postPositionCounter}
                    </div>`
                  : nothing}
                <div class="flex"></div>
                ${this.renderTopActionButtons()} ${this.renderMenu()}
              </div>
            `
          : nothing}
        ${!this.onlyRenderTopActionBar
          ? nothing
          : html`
              ${this.post.Group.configuration?.showWhoPostedPosts
                ? this.renderUser()
                : nothing}
              <div class="layout horizontal ${!this.wide ? "wrap" : ""}">
                <div class="layout vertical center-center mediaContainer">
                  ${this.renderCoverMedia()} ${this.renderActions()}
                </div>
                <div class="layout vertical innerMediaContainer">
                  ${this.renderName()} ${this.renderPostInformation()}
                </div>
              </div>
            `}
      </div>
    `;
  }

  _openPostMenu() {
    (this.$$("#actionMenu") as MdMenu).open = true;
  }

  _sharedContent(event: CustomEvent) {
    const shareData = event.detail;
    window.appGlobals.activity(
      "postShared",
      shareData.social,
      this.post ? this.post.id : -1
    );
  }

  _shareTap(event: CustomEvent) {
    const detail = event.detail;
    window.appGlobals.activity(
      "postShareHeaderOpen",
      detail.brand,
      this.post ? this.post.id : -1
    );

    window.appDialogs.getDialogAsync(
      "shareDialog",
      (dialog: YpShareDialogData) => {
        const url = "https://" + window.location.host + "/post/" + this.post.id;
        dialog.open(
          url,
          this.post.name,
          (this.$$("yp-post-cover-media") as YpPostCoverMedia).anyImagePath ||
            "",
          this._sharedContent
        );
      }
    );
  }

  get hasPostAccess() {
    if (this.post) {
      return YpAccessHelpers.checkPostAccess(this.post);
    } else {
      return false;
    }
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has("post")) {
      this._postChanged();
    }
  }

  _postChanged() {
    if (this.post && this.post.description) {
      setTimeout(() => {
        const description = this.$$("#description");
        if (description) {
          // Special case for law Issue from a parliement
          if (
            this.post.public_data &&
            this.post.public_data.law_issue &&
            this.post.public_data.law_issue.issueStatus
          ) {
            description.innerHTML +=
              " - " + this.post.public_data.law_issue.issueStatus;
          }
        } else {
          console.error("Can't find description element");
        }
      });

      if (
        this.hasPostAccess &&
        window.appGlobals.hasTranscriptSupport === true
      ) {
        if (this.post.public_data && this.post.public_data.transcript) {
          this.transcriptActive = true;
        }
      }
    }

    if (this.post) {
      if (this.post.cover_media_type === "audio") {
        this.isAudioCover = true;
      } else {
        this.isAudioCover = false;
      }
    }
  }

  updateDescriptionIfEmpty(description: string) {
    if (this.post && (!this.post.description || this.post.description == "")) {
      this.post.description = description;
    }
  }

  _refresh() {
    window.appDialogs.getDialogAsync(
      "postEdit",
      (dialog: any /*YpPostEdit*/) => {
        dialog.selected = 0;
        this.fire("refresh");
      }
    );
  }

  _openMovePost() {
    window.appGlobals.activity("open", "movePost");
    //TODO: movePost
    /*window.appDialogs.getDialogAsync('postMove', dialog => {
      dialog.setupAndOpen(this.post, this._refresh.bind(this));
    });*/
  }

  _openPostStatusChangeNoEmails() {
    window.appGlobals.activity("open", "statusChangeNoEmails");
    //TODO: Finish
    /*window.appDialogs.getDialogAsync('postStatusChangeEdit', dialog => {
      dialog.setup(this.post, null, this._refresh.bind(this), true);
      dialog.open('new', { postId: this.post.id, statusChange: true });
    });*/
  }

  _openPostStatusChange() {
    window.appGlobals.activity("open", "post.statusChangeEdit");
    //TODO: Finish
    /*window.appDialogs.getDialogAsync('postStatusChangeEdit', dialog => {
      dialog.setup(this.post, null, this._refresh.bind(this));
      dialog.open('new', { postId: this.post.id, statusChange: true });
    });*/
  }

  _openEdit() {
    window.appGlobals.activity("open", "post.edit");
    YpNavHelpers.redirectTo("/post/" + this.post.id + "/edit");
  }

  _openReport() {
    window.appGlobals.activity("open", "post.report");
    window.appDialogs.getDialogAsync(
      "apiActionDialog",
      (dialog: any /*YpApiActionDialog*/) => {
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

  _openDelete() {
    window.appGlobals.activity("open", "post.delete");
    window.appDialogs.getDialogAsync(
      "apiActionDialog",
      (dialog: any /*YpApiActionDialog*/) => {
        dialog.setup(
          "/api/posts/" + this.post.id,
          this.t("post.deleteConfirmation"),
          this._onDeleted.bind(this)
        );
        dialog.open();
      }
    );
  }

  _openDeleteContent() {
    window.appGlobals.activity("open", "postDeleteContent");
    window.appDialogs.getDialogAsync(
      "apiActionDialog",
      (dialog: any /*YpApiActionDialog*/) => {
        dialog.setup(
          "/api/posts/" + this.post.id + "/delete_content",
          this.t("postDeleteContentConfirmation")
        );
        dialog.open();
      }
    );
  }

  _openAnonymizeContent() {
    window.appGlobals.activity("open", "postAnonymizeContent");
    window.appDialogs.getDialogAsync(
      "apiActionDialog",
      (dialog: any /*YpApiActionDialog*/) => {
        dialog.setup(
          "/api/posts/" + this.post.id + "/anonymize_content",
          this.t("postAnonymizeContentConfirmation")
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

  _onDeleted() {
    this.dispatchEvent(
      new CustomEvent("yp-refresh-group", { bubbles: true, composed: true })
    );

    YpNavHelpers.redirectTo("/group/" + this.post.group_id);
  }
}
