import { YpAccessHelpers } from "../common/YpAccessHelpers.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";

import { YpCollection } from "../yp-collection/yp-collection.js";
import { html, LitElement, css, TemplateResult, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@material/web/textfield/outlined-text-field.js";
import "@material/web/progress/circular-progress.js";

import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/icon/icon.js";

import "../yp-file-upload/yp-file-upload.js";
import { YpEmojiSelector } from "../common/yp-emoji-selector.js";
import "../common/yp-emoji-selector.js";

import "../yp-magic-text/yp-magic-text.js";
import "./yp-point-actions.js";

import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpBaseElement } from "../common/yp-base-element.js";

//import { any /*YpApiActionDialog*/ } from '../yp-api-action-dialog/yp-api-action-dialog.js';
//import { YpConfirmationDialog } from '../yp-dialog-container/yp-confirmation-dialog.js';

@customElement("yp-point")
export class YpPoint extends YpBaseElement {
  @property({ type: Object })
  point!: YpPointData;

  @property({ type: Object })
  post!: YpPostData;

  @property({ type: Object })
  group!: YpGroupData;

  @property({ type: Object })
  user: YpUserData | undefined;

  @property({ type: Boolean })
  linkPoint = false;

  @property({ type: Boolean })
  openTranscript = true;

  @property({ type: Boolean })
  hideUser = false;

  @property({ type: Boolean })
  hideActions = false;

  @property({ type: Boolean })
  isEditing = false;

  @property({ type: Boolean })
  isUpVoted = false;

  @property({ type: Boolean })
  isDownVoted = false;

  @property({ type: Boolean })
  isAdminCommentEditing = false;

  @property({ type: Boolean })
  hasAdminComments = false;

  @property({ type: Number })
  maxNumberOfPointsBeforeEditFrozen = 5;

  @property({ type: String })
  editText: string | undefined;

  @property({ type: String })
  editAdminCommentText: string | undefined;

  @property({ type: Boolean })
  videoActive = false;

  @property({ type: String })
  pointVideoPath: string | undefined;

  @property({ type: String })
  pointImageVideoPath: string | undefined;

  @property({ type: Number })
  pointVideoId: number | undefined;

  @property({ type: Boolean })
  audioActive = false;

  @property({ type: String })
  pointAudioPath: string | undefined;

  @property({ type: Number })
  pointAudioId: number | undefined;

  @property({ type: Boolean })
  checkingTranscript = false;

  @property({ type: Boolean })
  portraitVideo = false;

  @property({ type: Boolean })
  checkTranscriptError = false;

  playStartedAt: Date | undefined;
  videoPlayListener: Function | undefined;
  videoPauseListener: Function | undefined;
  videoEndedListener: Function | undefined;
  audioPlayListener: Function | undefined;
  audioPauseListener: Function | undefined;
  audioEndedListener: Function | undefined;

  renderMobileMoodIcon() {
    if (!this.point || this.point.value === 0) return nothing; // No icon for neutral points
    // Use this.point.value directly to determine mood
    return this.point.value > 0
      ? html`<md-icon class="happyFace">sentiment_satisfied</md-icon>`
      : html`<md-icon class="sadFace">sentiment_dissatisfied</md-icon>`;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener(
      "yp-got-admin-rights",
      this.requestUpdate.bind(this)
    );
    this.addGlobalListener("yp-logged-in", this.requestUpdate.bind(this));
    this.addGlobalListener(
      "yp-pause-media-playback",
      this._pauseMediaPlayback.bind(this)
    );
    this.addGlobalListener(
      "yp-got-endorsements-and-qualities",
      this._updateQualitiesFromSignal.bind(this)
    );
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener(
      "yp-got-admin-rights",
      this.requestUpdate.bind(this)
    );
    this.removeGlobalListener("yp-logged-in", this.requestUpdate.bind(this));
    this.removeGlobalListener(
      "yp-pause-media-playback",
      this._pauseMediaPlayback
    );
    this.removeGlobalListener(
      "yp-got-endorsements-and-qualities",
      this._updateQualitiesFromSignal.bind(this)
    );
    //TODO: Remove unknown cast
    YpMediaHelpers.detachMediaListeners(
      this as unknown as YpElementWithPlayback
    );
  }

  _updateQualitiesFromSignal() {
    this._updateQualities();
  }

  _updateQualities() {
    this.isUpVoted = false;
    this.isDownVoted = false;

    if (
      this.point &&
      window.appUser &&
      window.appUser.loggedIn() &&
      window.appUser.user &&
      window.appUser.user.PointQualities
    ) {
      const thisPointQuality =
        window.appUser.pointQualitiesIndex[this.point.id];
      if (thisPointQuality) {
        if (thisPointQuality.value > 0) {
          this.isUpVoted = true;
        } else if (thisPointQuality.value < 0) {
          this.isDownVoted = true;
        }
      }
    }
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has("point")) {
      this._pointChanged();
    }

    if (changedProperties.has("isAdminCommentEditing")) {
      this._isAdminCommentEditingChanged();
    }

    if (changedProperties.has("isEditing")) {
      this._isEditingChanged();
    }
  }

  get masterHideSharing() {
    return (
      this.group &&
      this.group.configuration &&
      this.group.configuration.hideSharing
    );
  }

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .happyFace {
          color: var(--yp-sys-color-up);
          --md-icon-size: 48px; /* Or a smaller size like 36px if 48px is too large */
          margin-right: 16px;
          margin-top: 8px;
          margin-bottom: 8px;
        }

        .sadFace {
          color: var(--yp-sys-color-down);
          --md-icon-size: 48px; /* Or a smaller size like 36px */
          margin-right: 16px;
          margin-top: 8px;
          margin-bottom: 8px;
        }

        .shareIcon {
          margin-top: 8px;
        }

        #reportPointIconButton {
          margin-top: 8px;
          --md-icon-button-icon-color: var(--md-sys-color-outline-variant);
        }

        yp-user-with-organization {
          margin-top: 16px;
        }

        .pointTopContainer {
          min-width: 384px;
          max-width: 384px;
          margin-top: 16px;
          margin-bottom: 16px;
          padding: 16px;
          border-radius: 4px;
          line-height: 25px;
          border: 2px solid var(--md-sys-color-outline-variant);
        }

        .pointTopContainer[up-voted] {
          padding: 16px;
          border: 2px solid var(--yp-sys-color-up);
        }

        .pointTopContainer[down-voted] {
          padding: 16px;
          border: 2px solid var(--yp-sys-color-down);
        }

        .point-content {
          padding-right: 16px;
          padding-left: 16px;
          margin-top: 8px;
          width: 100%;
          box-sizing: border-box;
        }

        #pointContentTranscript,
        #pointContent {
          cursor: default;
        }

        #pointContentTranscript,
        #pointContent[link-point] {
          cursor: pointer;
        }

        @media (max-width: 320px) {
          .user-image {
            display: none;
          }
        }

        .userInfoContainer {
          width: 100%;
          padding-bottom: 16px;
        }

        md-outlined-icon-button {
        }

        #reportPointIconButton {
          width: 36px;
          height: 36px;
        }

        .thumbsIcon {
          padding-left: 0;
          padding-right: 0;
        }

        @media (min-width: 985px) {
          .thumbsIcon {
          }
        }

        md-icon.thumbsIconUp {
          color: var(--master-point-up-color);
        }

        md-icon.thumbsIconDown {
        }

        yp-user-with-organization {
          padding-left: 16px;
        }

        .actionContainer {
          margin-top: 8px;
          margin-bottom: 4px;
        }

        [hidden] {
          display: none !important;
        }

        .pointer {
          cursor: pointer;
        }

        yp-image,
        video {
          width: 398px;
          height: 224px;
          margin: 0;
          padding: 0;
        }

        a {
          color: var(--md-sys-color-on-surface);
        }

        @media (max-width: 600px) {
          yp-image,
          video {
            width: 100%;
            margin: 0 !important;
            padding: 0;
            height: initial;
            vertical-align: top;
          }

          .actionContainer {
            margin-left: 12px;
          }

          #videoPlayer[portrait] {
            width: 50% !important;
          }
        }

        .topContainer[portrait] {
        }

        #pointContentEditor,
        #pointAdminCommentEditor {
          padding-left: 8px;
          padding-right: 8px;
        }

        #pointAdminCommentContent {
          padding-left: 16px;
          padding-right: 16px;
        }

        .commentFromAdmin {
          padding-left: 16px;
          padding-right: 16px;
          padding-top: 16px;
          font-size: 16px;
          padding-bottom: 2px;
          font-weight: bold;
        }

        .commentFromAdminInput {
          padding: 0;
        }

        .transcriptError {
          margin-top: 8px;
          color: var(--md-sys-color-error);
        }

        md-circular-progress {
          margin-top: 4px;
        }

        .checkTranscript {
          margin-top: 8px;
          padding: 8px;
        }

        .transcriptText {
          margin-top: 0;
          padding: 8px;
          padding-bottom: 0;
          font-style: italic;
        }

        .transcriptHeader {
          margin-bottom: 2px;
          font-style: normal;
        }

        audio {
          margin-top: 16px;
          margin-bottom: 16px;
        }

        video {
        }

        #pointContent {
        }

        md-outlined-icon-button.openCloseButton {
          width: 54px;
          height: 54px;
          margin-top: -16px;
          padding-left: 0;
          margin-left: 0;
        }

        @media (max-width: 985px) {
          .pointTopContainer {
            width: 100%;
            min-width: initial;
            max-width: 100%;
            margin-left: 0;
            margin-right: 0;
            padding: 8px 4px; /* Reduced left/right padding */
            box-sizing: border-box;
          }

          .happyFace,
          .sadFace {
            --md-icon-size: 36px; /* Smaller icon size for mobile */
            margin-left: auto; /* Centering: auto margins on flex item */
            margin-right: auto; /* Centering: auto margins on flex item */
            margin-top: 4px; /* Adjust top/bottom margin as needed */
            margin-bottom: 4px;
          }

          #pointContent,
          #pointContentTranscript {
            width: 100%;
            box-sizing: border-box;
          }
        }
      `,
    ];
  }

  renderAdminComments() {
    html`
      <div class="commentFromAdmin" ?hidden="${this.isEditingSomething}">
        ${this.group.configuration?.customAdminCommentsTitle
          ? html`
              <yp-magic-text
                textType="customAdminCommentsTitle"
                .contentLanguage="${this.group.language}"
                .content="${this.group.configuration?.customAdminCommentsTitle}"
                .contentId="${this.group.id}"
              >
              </yp-magic-text>
            `
          : ``}
        ${!this.group.configuration?.customAdminCommentsTitle
          ? html` ${this.t("commentFromAdmin")} `
          : ``}
      </div>
      <div
        id="pointAdminCommentContent"
        ?link-point="${this.linkPoint}"
        ?hidden="${this.isEditingSomething}"
        @click="${this._linkIfNeeded}"
      >
        <yp-magic-text
          simple-format
          textType="pointAdminCommentContent"
          truncate="1500"
          .contentLanguage="${this.point.public_data?.admin_comment?.language}"
          .content="${this.point.public_data?.admin_comment?.text}"
          .contentId="${this.point.id}"
        >
        </yp-magic-text>
      </div>
    `;
  }

  renderUserHeader() {
    return this.user
      ? html`<div
          class="userInfoContainer layout horizontal"
          ?hidden="${this.hideUser}"
        >
          <div class="layout horizontal" style="width: 100%">
            <yp-user-with-organization
              .titleDate="${this.point.created_at}"
              inverted
              mediumImage
              ?hidden="${this.group.configuration?.hidePointAuthor}"
              .user="${this.user}"
              class="userWithOrganization"
            ></yp-user-with-organization>
            <div class="flex"></div>
            <md-icon-button
              ?hidden="${this.masterHideSharing}"
              class="shareIcon"
              .label="${this.t("sharePoint")}"
              @click="${this._shareTap}"
              ><md-icon>share</md-icon></md-icon-button
            >
          </div>
        </div>`
      : nothing;
  }

  renderTextPoint() {
    return html`
      <div class="point-content layout vertical ">
        <span ?hidden="${!this.point.name}">
          <span>${this.point.name}</span>.
        </span>
        <div
          id="pointContent"
          .linkPoint="${this.linkPoint}"
          ?hidden="${this.isEditingSomething}"
          @click="${this._linkIfNeeded}"
        >
          <yp-magic-text
            simpleFormat
            useFullWidth
            textType="pointContent"
            .contentLanguage="${this.point.language}"
            .content="${this.point.latestContent}"
            .contentId="${this.point.id}"
          >
          </yp-magic-text>
        </div>
      </div>
    `;
  }

  renderVideoOrAudio() {
    return html`
      ${this.videoActive && this.pointVideoPath
        ? html`
            <div class="topContainer" ?portrait="${this.portraitVideo}">
              <div class="layout horizontal center-center">
                <video
                  id="videoPlayer"
                  portrait="${this.portraitVideo}"
                  .data-id="${this.pointVideoId}"
                  controls
                  preload="none"
                  class="video"
                  .src="${this.pointVideoPath}"
                  playsinline
                  .poster="${this.pointImageVideoPath
                    ? this.pointImageVideoPath
                    : ""}"
                ></video>
              </div>
            </div>
          `
        : nothing}
      ${this.audioActive && this.pointAudioPath
        ? html`
            <div class="layout vertical center-center">
              <audio
                id="audioPlayer"
                .data-id="${this.pointAudioId}"
                controls
                preload="metadata"
                class="audio"
                .src="${this.pointAudioPath}"
                playsinline
              ></audio>
            </div>
          `
        : nothing}
      ${this.checkingTranscript
        ? html`
            <div class="layout vertical center-center checkTranscript">
              <div>${this.t("checkingForTranscript")}</div>
              <md-circular-progress indeterminate></md-circular-progress>
            </div>
          `
        : nothing}

      <div
        class="transcriptError layout horizontal center-center"
        ?hidden="${!this.checkTranscriptError}"
      >
        ${this.t("checkTranscriptError")}
      </div>

      ${this.point.latestContent
        ? html`
            <div class="transcriptText layout vertical center-center">
              <div class="layout horizontal">
                <div class="transcriptHeader">
                  ${this.t("automaticTranscript")}
                </div>
                <div
                  ?hidden="${!this.group.configuration.collapsableTranscripts}"
                >
                  <md-icon-button
                    .label="${this.t("openComments")}"
                    class="openCloseButton"
                    icon="keyboard_arrow_right"
                    @click="${this._setOpen}"
                    ?hidden="${this.openTranscript}"
                  ></md-icon-button>
                  <md-icon-button
                    .label="${this.t("closeComments")}"
                    class="openCloseButton"
                    icon="keyboard_arrow_down"
                    @click="${this._setClosed}"
                    ?hidden="${!this.openTranscript}"
                  ></md-icon-button>
                </div>
              </div>
              <div
                id="pointContentTranscript"
                .linkPoint="${this.linkPoint}"
                ?hidden="${this.isEditing}"
                @click="${this._linkIfNeeded}"
              >
                <yp-magic-text
                  ?hidden="${!this.openTranscript}"
                  simpleFormat
                  textType="pointContent"
                  .contentLanguage="${this.point.language}"
                  .content="${this.point.latestContent}"
                  .contentId="${this.point.id}"
                >
                </yp-magic-text>
              </div>
            </div>
          `
        : nothing}
    `;
  }

  renderEditPoint() {
    return html`
      <div class="layout vertical">
        <md-outlined-text-field
          id="pointContentEditor"
          charCounter
          maxlength="1500"
          .value="${this.editText ? this.editText : ""}"
        ></md-outlined-text-field>
        <div class="horizontal end-justified layout">
          <yp-emoji-selector id="pointEmojiSelector"></yp-emoji-selector>
        </div>
        <div class="layout horizontal self-end">
          <md-outlined-button
            @click="${this._cancelEdit}"
            .label="${this.t("cancel")}"
          ></md-outlined-button>
          <md-outlined-button
            @click="${this._saveEdit}"
            .label="${this.t("update")}"
          ></md-outlined-button>
        </div>
      </div>
    `;
  }

  renderEditMenu() {
    return html`
      <div class="layout horizontal self-end" hidden>
        <md-icon-button
          .label="${this.t("editAdminComment")}"
          ?hidden="${!this.hasAdminCommentAccess}"
          icon="comment"
          @click="${this._editAdminComment}"
        ></md-icon-button>
        <md-icon-button
          .label="${this.t("edit")}"
          ?hidden="${!this.canEditPoint}"
          icon="create"
          @click="${this._editPoint}"
        ></md-icon-button>
        <md-icon-button
          .label="${this.t("delete")}"
          icon="clear"
          @click="${this._deletePoint}"
        ></md-icon-button>
      </div>
    `;
  }

  override render() {
    return html`
      <div
        class="layout vertical pointTopContainer"
        ?up-voted="${this.isUpVoted}"
        ?down-voted="${this.isDownVoted}"
      >
        ${!this.wide ? this.renderMobileMoodIcon() : nothing}
        ${this.renderUserHeader()}

        <div class="layout vertical">
          ${this.videoOrAudioActive
            ? this.renderVideoOrAudio()
            : this.renderTextPoint()}
          ${this.showAdminComments ? this.renderAdminComments() : nothing}
          ${this.isEditing ? this.renderEditPoint() : nothing}

          <div
            class="layout horizontal actionContainer"
            ?hidden="${this.hideActions}"
          >
            <yp-point-actions
              .point="${this.point}"
              .pointUrl="${this.pointUrl}"
              @changed="${this._updateQualities}"
              .configuration="${this.post?.Group?.configuration}"
            ></yp-point-actions>
            <div class="flex"></div>
            <md-icon-button
              .label="${this.t("point.report")}"
              id="reportPointIconButton"
              @click="${this._reportPoint}"
            ><md-icon>warning</md-icon></md-icon-button>
            ${this.hasPointAccess ? this.renderEditMenu() : nothing}
          </div>
        </div>
      </div>
    `;
  }

  _setOpen() {
    this.openTranscript = true;
    setTimeout(() => {
      this.fire("yp-list-resize");
      this.requestUpdate();
    }, 20);
  }

  _setClosed() {
    this.openTranscript = false;
    setTimeout(() => {
      this.fire("yp-list-resize");
      this.requestUpdate();
    }, 20);
  }

  get isEditingSomething() {
    return this.isEditing || this.isAdminCommentEditing;
  }

  get showAdminComments() {
    if (
      this.post &&
      this.group &&
      this.point.public_data &&
      this.point.public_data.admin_comment &&
      this.point.public_data.admin_comment.text &&
      this.group.configuration &&
      this.group.configuration.allowAdminAnswersToPoints
    ) {
      return true;
    } else {
      return false;
    }
  }

  get hasAdminCommentAccess() {
    if (
      this.post &&
      this.group &&
      YpAccessHelpers.checkPostAdminOnlyAccess(this.post) &&
      this.group.configuration &&
      this.group.configuration.allowAdminAnswersToPoints
    ) {
      return true;
    } else {
      return false;
    }
  }

  get videoOrAudioActive() {
    return this.videoActive || this.audioActive;
  }

  _isEditingChanged() {
    this._updateEmojiBindings();
  }

  _isAdminCommentEditingChanged() {
    this._updateEmojiBindings();
  }

  _shareTap(event: CustomEvent) {
    window.appGlobals.activity(
      "pointShareOpen",
      event.detail.brand,
      this.point.id
    );
  }

  get pointUrl() {
    if (this.point && this.post) {
      return (
        window.location.protocol +
        "//" +
        window.location.hostname +
        "/post/" +
        this.post.id +
        "/" +
        this.point.id
      );
    } else {
      return "";
    }
  }

  _linkIfNeeded() {
    if (this.linkPoint && this.post) {
      YpNavHelpers.goToPost(this.post.id, this.point.id);
    }
  }

  _updateEmojiBindings() {
    if (this.isEditing) {
      setTimeout(() => {
        const point = this.$$("#pointContentEditor") as HTMLInputElement;
        const emoji = this.$$("#pointEmojiSelector") as YpEmojiSelector;
        if (point && emoji) {
          emoji.inputTarget = point;
        } else {
          console.error("Wide: Can't bind point edit emojis :(");
        }
      }, 500);
    } else if (this.isAdminCommentEditing) {
      setTimeout(() => {
        const point = this.$$("#pointAdminCommentEditor") as HTMLInputElement;
        const emoji = this.$$(
          "#pointAdminCommentEmojiSelector"
        ) as YpEmojiSelector;
        if (point && emoji) {
          emoji.inputTarget = point;
        } else {
          console.error("Wide: Can't bind point edit emojis :(");
        }
      }, 500);
    }
  }

  _cancelEdit() {
    //this._setlatestContent(this.point);
    this.isEditing = false;
  }

  async _saveEdit() {
    const point = (await window.serverApi.updatePoint(this.point.id, {
      content: this.editText,
    })) as YpPointData;
    if (point) {
      point.latestContent =
        point.PointRevisions![point.PointRevisions!.length - 1].content;
      this.point = point;
    }
    this.isEditing = false;
  }

  _cancelAdminCommentEdit() {
    //this._setlatestContent(this.point);
    this.isAdminCommentEditing = false;
  }

  async _saveAdminCommentEdit() {
    const response = await window.serverApi.updatePointAdminComment(
      this.group.id,
      this.point.id,
      {
        content: this.editAdminCommentText,
      }
    );

    if (response) {
      if (!this.point.public_data) this.point.public_data = {};
      this.point.public_data.admin_comment = {
        text: response.content,
      };
      this.point = JSON.parse(JSON.stringify(this.point));
      this.isAdminCommentEditing = false;
      this.hasAdminComments = true;
    }
    this.isAdminCommentEditing = false;
  }

  _deletePoint() {
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: any /*YpConfirmationDialog*/) => {
        dialog.open(
          this.t("point.confirmDelete"),
          this._reallyDeletePoint.bind(this)
        );
      }
    );
  }

  async _reallyDeletePoint() {
    await window.serverApi.deletePoint(this.point.id);

    this.fire("yp-point-deleted", { pointId: this.point.id });
    //TODO: Check if we need this
    //this.point = undefined;
  }

  _reportPoint() {
    window.appGlobals.activity("open", "point.report");
    window.appDialogs.getDialogAsync(
      "apiActionDialog",
      (dialog: any /*YpApiActionDialog*/) => {
        dialog.setup(
          "/api/points/" + this.point.id + "/report",
          this.t("reportConfirmation"),
          this._onReport.bind(this),
          this.t("point.report"),
          "PUT"
        );
        dialog.open();
      }
    );
  }

  _onReport() {
    window.appGlobals.notifyUserViaToast(
      this.t("point.report") + ": " + this.point.content
    );
  }

  _editPoint() {
    if (this.hasPointAccess && this.point.PointRevisions) {
      this.editText =
        this.point.PointRevisions[this.point.PointRevisions.length - 1].content;
      this.isEditing = true;
    }
  }

  _editAdminComment() {
    if (this.post && YpAccessHelpers.checkPostAdminOnlyAccess(this.post)) {
      this.editAdminCommentText =
        this.point.public_data && this.point.public_data.admin_comment
          ? this.point.public_data.admin_comment.text
          : "";
      this.isAdminCommentEditing = true;
    }
  }

  get hasPointAccess() {
    return YpAccessHelpers.checkPointAccess(this.point);
  }

  get canEditPoint() {
    if (
      this.point &&
      ((this.point.PointVideos && this.point.PointVideos.length > 0) ||
        (this.point.PointAudios && this.point.PointAudios.length > 0))
    ) {
      // Allow admin editing of transcripts
      return YpAccessHelpers.checkPointAccess(this.point);
    } else {
      const isEligible =
        this.point &&
        this.point.counter_quality_up + this.point.counter_quality_down <=
          this.maxNumberOfPointsBeforeEditFrozen;
      return (
        isEligible &&
        window.appUser &&
        window.appUser.user &&
        this.point &&
        window.appUser.user.id == this.point.user_id
      );
    }
  }

  override firstUpdated(
    changedProperties: Map<string | number | symbol, unknown>
  ) {
    super.firstUpdated(changedProperties);
    //TODO: Remove unknown cast
    YpMediaHelpers.attachMediaListeners(
      this as unknown as YpElementWithPlayback
    );
  }

  _pauseMediaPlayback() {
    //TODO: Remove unknown cast
    YpMediaHelpers.pauseMediaPlayback(this as unknown as YpElementWithPlayback);
  }

  _pointChanged() {
    this._resetMedia();
    this._updateQualities();

    if (this.point) {
      if (
        this.post &&
        this.group &&
        this.group.configuration &&
        this.group.configuration.collapsableTranscripts
      ) {
        this.openTranscript = false;
      }
      let disableMachineTranscripts = false;
      if (
        this.post &&
        this.group &&
        this.group.configuration &&
        this.group.configuration.disableMachineTranscripts
      ) {
        disableMachineTranscripts = true;
      }
      this.user = this.point.User;
      const videoURL = YpMediaHelpers.getVideoURL(this.point.PointVideos);
      const videoPosterURL = YpMediaHelpers.getVideoPosterURL(
        this.point.PointVideos,
        undefined
      );
      this.portraitVideo = YpMediaHelpers.isPortraitVideo(
        this.point.PointVideos
      );
      if (videoURL && videoPosterURL) {
        this.videoActive = true;
        this.pointVideoPath = videoURL;
        this.pointImageVideoPath = videoPosterURL;
        this.pointVideoId = this.point.PointVideos![0].id;
        this.checkTranscriptError = false;
        if (
          !disableMachineTranscripts &&
          this.point.checkTranscriptFor === "video" &&
          window.appGlobals.hasTranscriptSupport === true
        ) {
          this._checkTranscriptStatus();
          this.checkingTranscript = true;
          this.point.checkTranscriptFor = undefined;
        }
      } else {
        const audioURL = YpMediaHelpers.getAudioURL(this.point.PointAudios);
        if (audioURL) {
          this.audioActive = true;
          this.pointAudioPath = audioURL;
          this.pointAudioId = this.point.PointAudios![0].id;
          this.checkTranscriptError = false;
          if (
            !disableMachineTranscripts &&
            this.point.checkTranscriptFor === "audio" &&
            window.appGlobals.hasTranscriptSupport === true
          ) {
            this._checkTranscriptStatus();
            this.checkingTranscript = true;
            this.point.checkTranscriptFor = undefined;
          }
        }
      }
    } else {
      this.user = undefined;
      this.checkTranscriptError = false;
    }
  }

  async _checkTranscriptStatus() {
    let type;
    if (this.videoActive) type = "videoTranscriptStatus";
    else type = "audioTranscriptStatus";

    const pointInfo = (await window.serverApi.checkPointTranscriptStatus(
      type,
      this.point.id
    )) as YpGetPointTranscriptResponse;
    if (pointInfo.point) {
      const point = pointInfo.point;
      this.checkingTranscript = false;
      point.latestContent =
        point.PointRevisions![point.PointRevisions!.length - 1].content;
      this.point = point;
      this.fire("yp-update-point-in-list", point);
      if (this.hasPointAccess) {
        this.editText = point.latestContent;
        this.isEditing = true;
      }
      this.requestUpdate();
    } else if (pointInfo && pointInfo.inProgress) {
      setTimeout(() => {
        this._checkTranscriptStatus();
      }, 2000);
    } else if (pointInfo && pointInfo.error) {
      this.checkingTranscript = false;
      this.checkTranscriptError = true;
    } else {
      this.checkingTranscript = false;
    }
  }

  _resetMedia() {
    this.videoActive = false;
    this.pointVideoPath = undefined;
    this.pointImageVideoPath = undefined;
    this.pointVideoId = undefined;
    this.audioActive = false;
    this.pointAudioPath = undefined;
    this.pointAudioId = undefined;
  }

  loginName() {
    if (this.point.User) {
      return this.point.User.name;
    } else {
      return undefined;
    }
  }

  get isUpVote() {
    if (this.point) {
      if (this.point.value == 0) {
        return true;
      } else {
        return this.point.value > 0;
      }
    } else {
      console.warn("Can't find point for isUpVote");
      return false;
    }
  }

  get isDownVote() {
    if (this.point) {
      if (this.point.value == 0) {
        return true;
      } else {
        return this.point.value < 0;
      }
    } else {
      console.warn("Can't find point for isDownVote");
      return false;
    }
  }
}
