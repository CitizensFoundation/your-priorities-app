var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { YpAccessHelpers } from "../common/YpAccessHelpers.js";
import { nothing, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/labs/card/outlined-card.js";
//import '../yp-post/yp-posts-list.js';
//import '../yp-post/yp-post-card-add.js';
import "./yp-post-actions.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { ShadowStyles } from "../common/ShadowStyles.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
import "./yp-post-transcript.js";
//import { any /*YpApiActionDialog*/ } from '../yp-api-action-dialog/yp-api-action-dialog.js';
import { YpPostBaseWithAnswers } from "./yp-post-base-with-answers.js";
let YpPostHeader = class YpPostHeader extends YpPostBaseWithAnswers(YpBaseElementWithLogin) {
    constructor() {
        super(...arguments);
        this.isAudioCover = false;
        this.hideActions = false;
        this.transcriptActive = false;
    }
    //TODO: Make corners on posts card different
    static get styles() {
        return [
            super.styles,
            ShadowStyles,
            css `
        :host {
          display: block;
        }

        .infoContainer {
          line-height: var(--description-line-height, 1.3);
          padding: 0px;
          padding-bottom: 0;
          padding-top: 16px;
        }

        .category-icon {
          width: 100px;
          height: 100px;
        }

        yp-post-cover-media {
          position: relative;
          width: 600px;
          height: 338px;
          margin-right: auto;
          margin-left: auto;
        }

        yp-post-cover-media[audio-cover] {
          height: 90px;
        }

        .postCard {
          position: relative;
          border-radius: 4px;
          text-align: left;
        }

        .topCard {
          max-width: 600px;
        }

        .mediaAndInfoContainer {
          margin-bottom: 16px;
        }

        .description {
          padding-bottom: 2px;
          padding-left: 16px;
          padding-right: 16px;
          line-height: 1.75;
          max-width: 600px;
        }


        .postName {
          max-width: 600px;
          margin: 16px;
          font-weight: bold;
          text-align: left;
          font-size: 20px;
          opacity: 1.0;
        }

        .share {
          margin-bottom: 16px;
        }

        .mobileName {
          display: none;
        }

        .shareIcon {
          position: absolute;
          text-align: right;
          width: 44px;
          height: 44px;
          right: 42px;
          bottom: 3px;
        }

        .postActions {
          align-self: flex-end;
          align-items: flex-end;
          margin-top: 16px;
          width: 100%;
        }

        .moreVert {
        }

        .moreVertButton {
          width: 46px;
          height: 46px;
        }

        .customRatings {
          position: absolute;
          bottom: 12px;
          right: 85px;
        }

        @media (max-width: 960px) {
          .moreVert {
            position: absolute;
            top: 4px;
            bottom: initial;
            right: 2px;
          }

          .description[has-custom-ratings] {
            padding-bottom: 18px;
          }

          .customRatings {
            right: 46px;
          }

          .mobileName {
            margin-right: 38px;
          }

          .shareIcon {
            right: 8px;
            bottom: 2px;
          }

          .postActions {
            right: 55px;
            bottom: 2px;
          }

          .infoContainer {
            padding-bottom: 16px;
            padding-top: 16px;
          }

          .mobileName {
            display: block;
          }

          .desktopName {
            display: none;
          }

          :host {
            max-width: 600px;
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
            width: 100%;
            margin-bottom: 32px;
          }

          .description {
            margin-bottom: 8px;
            margin-top: 8px;
          }
        }

        @media (max-width: 800px) {
          :host {
            max-width: 423px;
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

          .postCard {
            width: 100% !important;
            margin: 8px;
            margin-top: 4px;
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
        return html `
      <div class="infoContainer">
        ${!this.post.public_data?.structuredAnswersJson
            ? html `
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
            : html `
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
                .truncate="${5000 ||
                this.post.Group.configuration.descriptionTruncateAmount}"
                .moreText="${this.t("readMore")}"
                .closeDialogText="${this.t("close")}"
              >
              </yp-magic-text>
            `}
      </div>
    `;
    }
    renderMenu() {
        return html `
      <div style="position: relative;" class="moreVert">
        <md-icon-button
          @click="${this._openPostMenu}"
          title="${this.t("openPostMenu")}"
          ><md-icon>more_vert</md-icon>
        </md-icon-button>
        <md-menu id="postMenu" menuCorner="END" corner="TOP_RIGHT">
          ${this.hasPostAccess
            ? html `
                <md-menu-item @click="${this._openEdit}">
                  ${this.t("post.edit")}
                </md-menu-item>
                <md-menu-item
                  @click="${this._openMovePost}"
                  ?hidden="${!YpAccessHelpers.checkPostAdminOnlyAccess(this.post)}"
                >
                  ${this.t("post.move")}
                </md-menu-item>
                <md-menu-item
                  @click="${this._openPostStatusChange}"
                  ?hidden="${!YpAccessHelpers.checkPostAdminOnlyAccess(this.post)}"
                >
                  ${this.t("post.statusChange")}
                </md-menu-item>
                <md-menu-item
                  @click="${this._openPostStatusChangeNoEmails}"
                  ?hidden="${!YpAccessHelpers.checkPostAdminOnlyAccess(this.post)}"
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
        return html `${this.post.Group.configuration.customRatings
            ? html `
          <yp-post-ratings-info
            class="customRatings"
            .post="${this.post}"
          ></yp-post-ratings-info>
        `
            : html `
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
    render() {
        return html `
      <div class="layout vertical center-center">
        <md-outlined-card
          class="topCard layout-wrap layout horizontal shsadow-elevation-4dp shasdow-transition"
        >
          <div
            class="layout vertical headerTopLevel center-center"
            role="heading"
            aria-level="1"
            aria-label="${this.post.name}"
          >
            ${this.post.Group.configuration.showWhoPostedPosts
            ? html `
                  <div class="layout horizontal userInfo">
                    <yp-user-with-organization
                      class="userWithOrg"
                      hide-image
                      .user="${this.post.User}"
                    ></yp-user-with-organization>
                  </div>
                `
            : nothing}

            <div class="layout vertical wrap mediaAndInfoContainer">
              <div class="layout vertical center-center coverContainer">
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
            ? html `
                      <yp-post-transcript
                        .post="${this.post}"
                      ></yp-post-transcript>
                    `
            : nothing}
              </div>
              <yp-magic-text
                  class="postName"
                  textType="postName"
                  .contentLanguage="${this.post.language}"
                  .content="${this.post.name}"
                  .contentId="${this.post.id}"
                >
                </yp-magic-text>
              <div class="layout vertical center-center postDescription">
                ${this.renderPostInformation()}
              </div>
              <div class="layout horizontal center-center">
                ${this.renderActions()} ${this.renderMenu()}
              </div>
            </div>
          </div> </md-outlined-card
        >
      </div>
    `;
    }
    _openPostMenu() {
        this.$$("#postMenu") /*Menu*/.open = true;
    }
    _sharedContent(event) {
        const shareData = event.detail;
        window.appGlobals.activity("postShared", shareData.social, this.post ? this.post.id : -1);
    }
    _shareTap(event) {
        const detail = event.detail;
        window.appGlobals.activity("postShareHeaderOpen", detail.brand, this.post ? this.post.id : -1);
        window.appDialogs.getDialogAsync("shareDialog", (dialog) => {
            const url = "https://" + window.location.host + "/post/" + this.post.id;
            dialog.open(url, this.t("post.shareInfo"), this._sharedContent);
        });
    }
    get hasPostAccess() {
        if (this.post) {
            return YpAccessHelpers.checkPostAccess(this.post);
        }
        else {
            return false;
        }
    }
    updated(changedProperties) {
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
                    if (this.post.public_data &&
                        this.post.public_data.law_issue &&
                        this.post.public_data.law_issue.issueStatus) {
                        description.innerHTML +=
                            " - " + this.post.public_data.law_issue.issueStatus;
                    }
                }
                else {
                    console.error("Can't find description element");
                }
            });
            if (this.hasPostAccess &&
                window.appGlobals.hasTranscriptSupport === true) {
                if (this.post.public_data && this.post.public_data.transcript) {
                    this.transcriptActive = true;
                }
            }
        }
        if (this.post) {
            if (this.post.cover_media_type === "audio") {
                this.isAudioCover = true;
            }
            else {
                this.isAudioCover = false;
            }
        }
    }
    updateDescriptionIfEmpty(description) {
        if (this.post && (!this.post.description || this.post.description == "")) {
            this.post.description = description;
        }
    }
    _refresh() {
        window.appDialogs.getDialogAsync("postEdit", (dialog /*YpPostEdit*/) => {
            dialog.selected = 0;
            this.fire("refresh");
        });
    }
    _openMovePost() {
        this.$$("#helpMenu") /*Menu*/
            .select(-1);
        window.appGlobals.activity("open", "movePost");
        //TODO: movePost
        /*window.appDialogs.getDialogAsync('postMove', dialog => {
          dialog.setupAndOpen(this.post, this._refresh.bind(this));
        });*/
    }
    _openPostStatusChangeNoEmails() {
        this.$$("#helpMenu") /*Menu*/
            .select(-1);
        window.appGlobals.activity("open", "statusChangeNoEmails");
        //TODO: Finish
        /*window.appDialogs.getDialogAsync('postStatusChangeEdit', dialog => {
          dialog.setup(this.post, null, this._refresh.bind(this), true);
          dialog.open('new', { postId: this.post.id, statusChange: true });
        });*/
    }
    _openPostStatusChange() {
        this.$$("#helpMenu") /*Menu*/
            .select(-1);
        window.appGlobals.activity("open", "post.statusChangeEdit");
        //TODO: Finish
        /*window.appDialogs.getDialogAsync('postStatusChangeEdit', dialog => {
          dialog.setup(this.post, null, this._refresh.bind(this));
          dialog.open('new', { postId: this.post.id, statusChange: true });
        });*/
    }
    _openEdit() {
        this.$$("#helpMenu") /*Menu*/
            .select(-1);
        window.appGlobals.activity("open", "post.edit");
        window.appDialogs.getDialogAsync("postEdit", (dialog /*YpApiActionDialog*/) => {
            dialog.setup(this.post, false, this._refresh.bind(this), this.post.Group);
            dialog.open(false, { postId: this.post.id });
        });
    }
    _openReport() {
        window.appGlobals.activity("open", "post.report");
        window.appDialogs.getDialogAsync("apiActionDialog", (dialog /*YpApiActionDialog*/) => {
            dialog.setup("/api/posts/" + this.post.id + "/report", this.t("reportConfirmation"), this._onReport.bind(this), this.t("post.report"), "PUT");
            dialog.open();
        });
    }
    _openDelete() {
        this.$$("#helpMenu") /*Menu*/
            .select(-1);
        window.appGlobals.activity("open", "post.delete");
        window.appDialogs.getDialogAsync("apiActionDialog", (dialog /*YpApiActionDialog*/) => {
            dialog.setup("/api/posts/" + this.post.id, this.t("post.deleteConfirmation"), this._onDeleted.bind(this));
            dialog.open();
        });
    }
    _openDeleteContent() {
        this.$$("#helpMenu") /*Menu*/
            .select(-1);
        window.appGlobals.activity("open", "postDeleteContent");
        window.appDialogs.getDialogAsync("apiActionDialog", (dialog /*YpApiActionDialog*/) => {
            dialog.setup("/api/posts/" + this.post.id + "/delete_content", this.t("postDeleteContentConfirmation"));
            dialog.open();
        });
    }
    _openAnonymizeContent() {
        this.$$("#helpMenu") /*Menu*/
            .select(-1);
        window.appGlobals.activity("open", "postAnonymizeContent");
        window.appDialogs.getDialogAsync("apiActionDialog", (dialog /*YpApiActionDialog*/) => {
            dialog.setup("/api/posts/" + this.post.id + "/anonymize_content", this.t("postAnonymizeContentConfirmation"));
            dialog.open();
        });
    }
    _onReport() {
        window.appGlobals.notifyUserViaToast(this.t("post.report") + ": " + this.post.name);
    }
    _onDeleted() {
        this.dispatchEvent(new CustomEvent("yp-refresh-group", { bubbles: true, composed: true }));
        YpNavHelpers.redirectTo("/group/" + this.post.group_id);
    }
};
__decorate([
    property({ type: Boolean })
], YpPostHeader.prototype, "isAudioCover", void 0);
__decorate([
    property({ type: Boolean })
], YpPostHeader.prototype, "hideActions", void 0);
__decorate([
    property({ type: Boolean })
], YpPostHeader.prototype, "transcriptActive", void 0);
__decorate([
    property({ type: Object })
], YpPostHeader.prototype, "post", void 0);
YpPostHeader = __decorate([
    customElement("yp-post-header")
], YpPostHeader);
export { YpPostHeader };
//# sourceMappingURL=yp-post-header.js.map