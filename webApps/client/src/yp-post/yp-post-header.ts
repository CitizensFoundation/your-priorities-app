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

  @property({ type: Object })
  override post!: YpPostData;

  //TODO: Make corners on posts card different
  static override get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        :host {
          display: block;
        }

        .category-icon {
          width: 100px;
          height: 100px;
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
            width: 100% !important;
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
            height: 230px;
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
            height: 225px;
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
                  .showWhoPostedPosts}"
                disableTranslation
                .structuredQuestionsConfig="${this.post.Group.configuration
                  .structuredQuestions}"
                ?hasCustomRatings="${this.post.Group.configuration
                  .customRatings}"
                ?simpleFormat="${this.post.Group.configuration
                  .descriptionSimpleFormat}"
                .contentId="${this.post.id}"
                class="description"
                .truncate="${this.post.Group.configuration
                  .descriptionTruncateAmount}"
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
                  .showWhoPostedPosts}"
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
    return html`
      <div style="position: relative;" class="moreVert">
        <md-icon-button
          @click="${this._openPostMenu}"
          title="${this.t("openPostMenu")}"
          ><md-icon>more_vert</md-icon>
        </md-icon-button>
        <md-menu id="postMenu" menuCorner="END" corner="TOP_RIGHT">
          ${this.hasPostAccess
            ? html`
                <md-menu-item @click="${this._openEdit}">
                  ${this.t("post.edit")}
                </md-menu-item>
                <md-menu-item
                  @click="${this._openMovePost}"
                  ?hidden="${!YpAccessHelpers.checkPostAdminOnlyAccess(
                    this.post
                  )}"
                >
                  ${this.t("post.move")}
                </md-menu-item>
                <md-menu-item
                  @click="${this._openPostStatusChange}"
                  ?hidden="${!YpAccessHelpers.checkPostAdminOnlyAccess(
                    this.post
                  )}"
                >
                  ${this.t("post.statusChange")}
                </md-menu-item>
                <md-menu-item
                  @click="${this._openPostStatusChangeNoEmails}"
                  ?hidden="${!YpAccessHelpers.checkPostAdminOnlyAccess(
                    this.post
                  )}"
                >
                  ${this.t("post.statusChangeNoEmails")}
                </md-menu-item>
                <md-menu-item @click="${this._openDelete}">
                  ${this.t("post.delete")}
                </md-menu-item>
                <md-menu-item
                  @click="${this._openAnonymizeContent}"
                  ?hidden="${!YpAccessHelpers.checkPostAdminOnlyAccess(
                    this.post
                  )}"
                >
                  ${this.t("anonymizePostAndContent")}
                </md-menu-item>
                <md-menu-item
                  @click="${this._openDeleteContent}"
                  ?hidden="${!YpAccessHelpers.checkPostAdminOnlyAccess(
                    this.post
                  )}"
                >
                  ${this.t("deletePostContent")}
                </md-menu-item>
              `
            : nothing}
          <md-menu-item hidden @click="${this._openReport}">
            ${this.t("post.report")}
          </md-menu-item>
        </md-menu>
      </div>
    `;
  }

  renderActions() {
    return html`${this.post.Group.configuration.customRatings
      ? html`
          <yp-post-ratings-info
            class="customRatings"
            .post="${this.post}"
          ></yp-post-ratings-info>
        `
      : html`
          <yp-post-actions
            ?hidden="${this.hideActions}"
            hideDebate
            headerMode
            elevation="-1"
            ?forceShowDebate="${this.post.Group.configuration
              .forceShowDebateCountOnPost}"
            floating
            class="postActions"
            .post="${this.post}"
          ></yp-post-actions>
        `} `;
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
        hide-image
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
        header-mode
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
      @click="${() => YpNavHelpers.redirectTo("/group/" + this.post.group_id)}"
      title="${this.t("close")}"
      ><md-icon>close</md-icon>
    </md-filled-tonal-icon-button>`;
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
                ${this.renderMenu()}
              </div>
            `
          : nothing}
        ${!this.onlyRenderTopActionBar
          ? nothing
          : html`
              ${this.post.Group.configuration.showWhoPostedPosts
                ? this.renderUser()
                : nothing}
              <div class="layout horizontal">
                <div class="layout vertical center-center mediaContainer">
                  ${this.renderCoverMedia()} ${this.renderActions()}
                </div>
                <div class="layout vertical">
                  ${this.renderName()} ${this.renderPostInformation()}
                </div>
              </div>
            `}
      </div>
    `;
  }

  _openPostMenu() {
    (this.$$("#postMenu") as any) /*Menu*/.open = true;
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
        dialog.open(url, this.t("post.shareInfo"), this._sharedContent);
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
    (this.$$("#helpMenu") as any) /*Menu*/
      .select(-1);
    window.appGlobals.activity("open", "movePost");
    //TODO: movePost
    /*window.appDialogs.getDialogAsync('postMove', dialog => {
      dialog.setupAndOpen(this.post, this._refresh.bind(this));
    });*/
  }

  _openPostStatusChangeNoEmails() {
    (this.$$("#helpMenu") as any) /*Menu*/
      .select(-1);
    window.appGlobals.activity("open", "statusChangeNoEmails");
    //TODO: Finish
    /*window.appDialogs.getDialogAsync('postStatusChangeEdit', dialog => {
      dialog.setup(this.post, null, this._refresh.bind(this), true);
      dialog.open('new', { postId: this.post.id, statusChange: true });
    });*/
  }

  _openPostStatusChange() {
    (this.$$("#helpMenu") as any) /*Menu*/
      .select(-1);
    window.appGlobals.activity("open", "post.statusChangeEdit");
    //TODO: Finish
    /*window.appDialogs.getDialogAsync('postStatusChangeEdit', dialog => {
      dialog.setup(this.post, null, this._refresh.bind(this));
      dialog.open('new', { postId: this.post.id, statusChange: true });
    });*/
  }

  _openEdit() {
    (this.$$("#helpMenu") as any) /*Menu*/
      .select(-1);
    window.appGlobals.activity("open", "post.edit");
    window.appDialogs.getDialogAsync(
      "postEdit",
      (dialog: any /*YpApiActionDialog*/) => {
        dialog.setup(
          this.post,
          false,
          this._refresh.bind(this),
          this.post.Group
        );
        dialog.open(false, { postId: this.post.id });
      }
    );
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
    (this.$$("#helpMenu") as any) /*Menu*/
      .select(-1);
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
    (this.$$("#helpMenu") as any) /*Menu*/
      .select(-1);
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
    (this.$$("#helpMenu") as any) /*Menu*/
      .select(-1);
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
