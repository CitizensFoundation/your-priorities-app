import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { YpFormattingHelpers } from "../common/YpFormattingHelpers.js";
import { YpBaseElement } from "../common/yp-base-element.js";

import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/iconbutton/filled-tonal-icon-button.js";
import "@material/web/labs/badge/badge.js";

import { ifDefined } from "lit/directives/if-defined.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { MdOutlinedIconButton } from "@material/web/iconbutton/outlined-icon-button.js";

@customElement("yp-post-actions")
export class YpPostActions extends YpBaseElement {
  @property({ type: Object })
  post!: YpPostData;

  @property({ type: String })
  endorsementButtons = "hearts";

  @property({ type: Boolean })
  headerMode = false;

  @property({ type: Boolean })
  forceSmall = false;

  @property({ type: Number })
  endorseValue = 0;

  @property({ type: Boolean })
  allDisabled = false;

  @property({ type: String })
  disabledTitle: string | undefined;

  @property({ type: Boolean })
  floating = false;

  @property({ type: Boolean })
  votingDisabled = false;

  @property({ type: Boolean })
  smallerIcons = false;

  @property({ type: Number })
  maxNumberOfGroupVotes: number | undefined;

  @property({ type: Number })
  numberOfGroupVotes: number | undefined;

  @property({ type: Boolean })
  forceShowDebate = false;

  @property({ type: Boolean })
  onlyShowDebate = false;

  @property({ type: Boolean })
  forceHideDebate = false;

  @property({ type: Boolean })
  hideVoteCount = false;

  override connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener(
      "yp-got-endorsements-and-qualities",
      this._updateEndorsementsFromSignal.bind(this)
    );
    this.setStaticThemeFromConfig();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener(
      "yp-got-endorsements-and-qualities",
      this._updateEndorsementsFromSignal.bind(this)
    );
  }

  override firstUpdated(
    changedProperties: Map<string | number | symbol, unknown>
  ) {
    super.firstUpdated(changedProperties);
    if (this.endorsementButtons) {
      if (this.$$("#actionDown") && this.$$("#actionUp")) {
        this.$$("#actionDown")!.className += " " + "default-buttons-color";
        this.$$("#actionUp")!.className += " " + "default-buttons-color";
      } else {
        console.warn("Could not find action buttons in post actions");
      }
    }
  }

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .action-bar {
          position: absolute;
        }

        .action-bar[floating] {
          position: relative;
        }

        .action-bar-small {
          margin-top: 8px;
          position: absolute;
          width: 100%;
          bottom: -32px;
          vertical-align: bottom !important;
        }

        .action-text {
          font-size: 23px;
          text-align: left;
          vertical-align: bottom;
          padding-top: 6px;
          margin-top: 6px;
          margin-left: 16px;
        }

        .action-icon[hide-vote-count] {
          margin-right: 16px;
        }

        .action-up {
        }

        .action-down {
        }

        .default-buttons-color {
        }

        .default-buttons-up-selected {
        }

        .default-buttons-down-selected {
        }

        .hearts-up-selected {
        }

        .hearts-down-selected {
        }

        .action-debate {
          margin-left: 8px;
          margin-right: 16px;
        }

        .top-debate[force-show-debate] {
          margin-left: 16px;
        }

        md-filled-icon-button[is-static-theme] {
          --md-sys-color-primary: var(--md-sys-color-primary-container);
          --md-sys-color-on-primary: var(--md-sys-color-on-primary-container);
          --md-filled-icon-button-toggle-icon-color: var(
            --md-sys-color-on-primary-container
          );
          --md-filled-icon-button-toggle-focus-icon-color: var(
            --md-sys-color-on-primary-container
          );
          --md-filled-icon-button-toggle-pressed-icon-color: var(
            --md-sys-color-on-primary-container
          );
          --md-filled-icon-button-toggle-hover-icon-color: var(
            --md-sys-color-on-primary-container
          );
        }

        md-badge {
          --md-badge-color: var(--md-sys-color-secondary);
          --md-badge-large-color: var(--md-sys-color-secondary);
          margin-bottom: -18px;
        }

        .debate-text {
          padding-top: 10px;
          padding-right: 6px;
        }

        .down-text {
          padding-right: 16px;
          padding-top: 0px;
          padding-left: 4px;
          padding-bottom: 8px;
        }

        .up-text {
          padding-top: 0px;
          margin-right: 32px;
          padding-left: 4px;
          padding-bottom: 8px;
        }

        .up-text[rtl] {
          margin-right: -8px;
        }

        .down-vote-icon {
          margin-right: 0px;
        }

        md-filled-tonal-icon-button.mainIcons {
        }

        md-filled-tonal-icon-button.debateIcon {
          margin-top: 2px;
        }

        md-filled-tonal-icon-button[smaller-icons] {
        }

        .debate-icon {
        }

        .up-vote-icon {
          margin-left: 8px;
        }

        @media (max-width: 320px) {
          :host {
            width: 250px;
          }
        }

        .shareButtonContainer {
          position: absolute;
          bottom: 55px;
          right: -32px;
          padding: 0;
          margin: 0;
          margin-bottom: 8px;
        }

        .shareButton {
          padding: 2px;
        }

        .shareShare {
          padding: 0;
          margin: 0;
        }

        @media screen and (-ms-high-contrast: active),
          (-ms-high-contrast: none) {
          .action-debate {
            display: none;
          }
        }

        [hidden] {
          display: none !important;
        }

        div[rtl] {
          direction: rtl;
        }

        action-up[only-up-vote-showing] {
          margin-right: -16px;
        }

        md-filled-icon-button.thumbs-with-color-up {
          --md-sys-color-primary: var(--yp-sys-color-up);
          --md-sys-color-on-primary: var(--yp-sys-color-up-on);
        }

        md-filled-icon-button.thumbs-with-color-down {
          --md-sys-color-primary: var(--yp-sys-color-down);
          --md-sys-color-on-primary: var(--yp-sys-color-down-on);
        }
      `,
    ];
  }

  renderDebate() {
    return html`<div
      style="position: relative"
      class="top-debate"
      ?force-show-debate="${this.forceShowDebate}"
    >
      <div
        class="action-debate layout horizontal"
        ?hidden="${this.hideDebate || this.forceHideDebate}"
      >
        <md-filled-tonal-icon-button>
          <md-icon>chat_bubble_outline</md-icon>
        </md-filled-tonal-icon-button>
        <md-badge
          ?hidden="${this.post.counter_points == 0 && !this.forceShowDebate}"
          .value="${YpFormattingHelpers.number(this.post.counter_points)}"
        ></md-badge>
      </div>
    </div>`;
  }

  override render() {
    if (this.onlyShowDebate) {
      return this.renderDebate();
    } else {
      return html`
        <div
          ?rtl="${this.rtl}"
          title="${ifDefined(this.disabledTitle)}"
          floating="${this.floating}"
          class="action-bar layout horizontal center-center"
        >
          <div
            id="actionUp"
            ?only-up-vote-showing="${this.onlyUpVoteShowing}"
            class="action-up layout horizontal layout start justified"
          >
            <md-filled-icon-button
              ?is-static-theme="${this.hasStaticTheme}"
              toggle
              ?hide-vote-count="${this.hideVoteCount}"
              ?selected="${this.isEndorsed}"
              .smaller-icons="${this.smallerIcons}"
              ?disabled="${this.votingStateDisabled}"
              .title="${this.customVoteUpHoverText}"
              class="action-icon up-vote-icon mainIcons ${this
                .endorsementButtons == "thumbsWithColor"
                ? "thumbs-with-color-up"
                : ""}"
              @click="${this.upVote}"
              ><md-icon slot="selected"
                >${this.endorseModeIcon(this.endorsementButtons, "up")}</md-icon
              ><md-icon id="actionUpIcon"
                >${this.endorseModeIcon(this.endorsementButtons, "up")}</md-icon
              ></md-filled-icon-button
            >
            <div
              ?rtl="${this.rtl}"
              class="action-text up-text"
              ?hidden="${this.hideVoteCount}"
            >
              ${YpFormattingHelpers.number(this.post.counter_endorsements_up)}
            </div>
          </div>

          <div
            id="actionDown"
            class="action-down layout horizontal layout start justified"
            ?hidden="${this.hideDownVote}"
          >
            <md-filled-icon-button
              toggle
              ?is-static-theme="${this.hasStaticTheme}"
              ?selected="${this.isOpposed}"
              smaller-icons="${this.smallerIcons}"
              ?disabled="${this.votingStateDisabled}"
              title="${this.customVoteDownHoverText}"
              class="action-icon down-vote-icon mainIcons ${this
                .endorsementButtons == "thumbsWithColor"
                ? "thumbs-with-color-down"
                : ""}"
              @click="${this.downVote}"
              ><md-icon slot="selected">${this.endorseModeIconDown}</md-icon
              ><md-icon
                >${this.endorseModeIconDown}</md-icon
              ></md-filled-icon-button
            >
            <div class="action-text down-text" ?hidden="${this.hideVoteCount}">
              ${YpFormattingHelpers.number(this.post.counter_endorsements_down)}
            </div>
          </div>
          ${this.forceShowDebate ? this.renderDebate() : ""}
        </div>
      `;
    }
  }

  get isEndorsed() {
    return this.endorseValue > 0;
  }

  get isOpposed() {
    return this.endorseValue < 0;
  }

  get votingStateDisabled() {
    if (this.allDisabled) {
      return true;
    } else if (
      !this.isEndorsed &&
      this.maxNumberOfGroupVotes &&
      this.numberOfGroupVotes
    ) {
      return this.maxNumberOfGroupVotes <= this.numberOfGroupVotes;
    } else {
      return false;
    }
  }

  get onlyUpVoteShowing() {
    if (this.post && this.post.Group && this.post.Group.configuration) {
      return this.post.Group.configuration.hideDownVoteForPost;
    } else {
      return false;
    }
  }

  get hideDownVote() {
    return (
      this.post &&
      this.post.Group &&
      this.post.Group.configuration &&
      this.post.Group.configuration.hideDownVoteForPost
    );
  }

  get endorseModeIconUp() {
    return this.endorseModeIcon(this.endorsementButtons, "up");
  }

  get endorseModeIconDown() {
    return this.endorseModeIcon(this.endorsementButtons, "down");
  }

  get customVoteUpHoverText() {
    if (
      this.post &&
      this.post.Group &&
      this.post.Group.configuration &&
      this.post.Group.configuration.customVoteUpHoverText
    ) {
      return this.post.Group.configuration.customVoteUpHoverText;
    } else {
      return this.t("post.up_vote");
    }
  }

  get customVoteDownHoverText() {
    if (
      this.post &&
      this.post.Group &&
      this.post.Group.configuration &&
      this.post.Group.configuration.customVoteDownHoverText
    ) {
      return this.post.Group.configuration.customVoteDownHoverText;
    } else {
      return this.t("post.down_vote");
    }
  }

  _goToPostIfNotHeader() {
    if (!this.headerMode) {
      YpNavHelpers.goToPost(this.post.id);
    }
  }

  get hideDebate() {
    return (
      !this.forceShowDebate &&
      (!this.wide ||
        this.forceSmall ||
        this.headerMode ||
        (this.post &&
          this.post.Group &&
          this.post.Group.configuration &&
          this.post.Group.configuration.hideDebate) ||
        (this.post &&
          this.post.Group &&
          this.post.Group.configuration &&
          this.post.Group.configuration.hideDebateIcon))
    );
  }

  override async updated(
    changedProperties: Map<string | number | symbol, unknown>
  ) {
    super.updated(changedProperties);

    // TODO: Test this well is it working as expected
    if (changedProperties.has("post") && this.post) {
      await this.updateComplete;
      YpFormattingHelpers.removeClass(
        this.$$("#actionUp"),
        "hearts-up-selected"
      );
      YpFormattingHelpers.removeClass(
        this.$$("#actionDown"),
        "hearts-down-selected"
      );
      YpFormattingHelpers.removeClass(
        this.$$("#actionUp"),
        "default-buttons-up-selected"
      );
      YpFormattingHelpers.removeClass(
        this.$$("#actionDown"),
        "default-buttons-down-selected"
      );
      this.endorseValue = 0;

      if (
        this.post.Group.configuration &&
        this.post.Group.configuration.canVote != undefined &&
        this.post.Group.configuration.canVote == false
      ) {
        this.votingDisabled = true;
        this.allDisabled = true;
        this.disabledTitle = this.t("votingDisabled");
      } else {
        this.votingDisabled = false;
        this.allDisabled = false;
      }
      if (
        this.post.Group.configuration &&
        this.post.Group.configuration.endorsementButtons != undefined
      ) {
        this.endorsementButtons =
          this.post.Group.configuration.endorsementButtons;
      } else {
        this.endorsementButtons = "hearts";
      }

      if (this.post.Group.configuration) {
        if (
          this.post.Group.configuration.hideVoteCount ||
          this.post.Group.configuration.hideVoteCountUntilVoteCompleted
        ) {
          this.hideVoteCount = true;
        }
      }

      if (this.post.Group.configuration?.maxNumberOfGroupVotes) {
        this.maxNumberOfGroupVotes =
          this.post.Group.configuration.maxNumberOfGroupVotes;
        this.numberOfGroupVotes =
          window.appUser.groupCurrentVoteCountIndex[this.post.Group.id];
      } else {
        this.maxNumberOfGroupVotes = undefined;
        this.numberOfGroupVotes = undefined;
      }

      this._updateEndorsements();
    }
  }

  _updateEndorsementsFromSignal(event: CustomEvent) {
    if (this.post) {
      this._updateEndorsements(event);
    }
  }

  _updateEndorsements(event: CustomEvent | undefined = undefined) {
    if (
      window.appUser &&
      window.appUser.loggedIn() &&
      window.appUser.user &&
      window.appUser.user.Endorsements
    ) {
      const thisPostsEndorsement =
        window.appUser.endorsementPostsIndex[this.post.id];
      if (thisPostsEndorsement)
        this._setEndorsement(thisPostsEndorsement.value);
      else this._setEndorsement(0);

      if (
        event &&
        event.detail &&
        event.detail.maxGroupId === this.post.Group.id
      ) {
        this.numberOfGroupVotes = event.detail.groupCurrentVoteCount;
      }
    }
  }

  endorseModeIcon(endorsementButtons: string, upDown: string) {
    if (endorsementButtons != "hearts" && endorsementButtons != "hats") {
      this.smallerIcons = true;
    } else {
      this.smallerIcons = false;
    }
    if (endorsementButtons == "thumbs" && upDown == "up") {
      return "thumb_up";
    } else if (endorsementButtons == "thumbs" && upDown == "down") {
      return "thumb_down";
    } else if (endorsementButtons == "thumbsWithColor" && upDown == "up") {
      return "thumb_up";
    } else if (endorsementButtons == "thumbsWithColor" && upDown == "down") {
      return "thumb_down";
    } else if (endorsementButtons == "hearts" && upDown == "up") {
      return "favorite";
    } else if (endorsementButtons == "hearts" && upDown == "down") {
      return "do_not_disturb";
    } else if (endorsementButtons == "hats" && upDown == "up") {
      return "keyboard_arrow_up";
    } else if (endorsementButtons == "hats" && upDown == "down") {
      return "keyboard_arrow_down";
    } else if (endorsementButtons == "arrows" && upDown == "up") {
      return "arrow_upward";
    } else if (endorsementButtons == "arrows" && upDown == "down") {
      return "arrow_downward";
    }
    return undefined;
  }

  async _setEndorsement(value: number) {
    this.endorseValue = value;

    await this.updateComplete;

    if (this.$$("#actionUp")) {
      if (
        value !== 0 &&
        this.post.Group.configuration &&
        !this.post.Group.configuration.hideVoteCount
      ) {
        this.hideVoteCount = false;
      }

      if (this.endorsementButtons == "hearts") {
        if (value > 0) {
          this.$$("#actionUp")!.className += " " + "hearts-up-selected";
          YpFormattingHelpers.removeClass(
            this.$$("#actionDown"),
            "hearts-down-selected"
          );
        } else if (value < 0) {
          this.$$("#actionDown")!.className += " " + "hearts-down-selected";
          YpFormattingHelpers.removeClass(
            this.$$("#actionUp"),
            "hearts-up-selected"
          );
        } else {
          YpFormattingHelpers.removeClass(
            this.$$("#actionUp"),
            "hearts-up-selected"
          );
          YpFormattingHelpers.removeClass(
            this.$$("#actionDown"),
            "hearts-down-selected"
          );
        }
      } else {
        if (value > 0) {
          this.$$("#actionUp")!.className +=
            " " + "default-buttons-up-selected";
          YpFormattingHelpers.removeClass(
            this.$$("#actionDown"),
            "default-buttons-down-selected"
          );
        } else if (value < 0) {
          this.$$("#actionDown")!.className +=
            " " + "default-buttons-down-selected";
          YpFormattingHelpers.removeClass(
            this.$$("#actionUp"),
            "default-buttons-up-selected"
          );
        } else {
          YpFormattingHelpers.removeClass(
            this.$$("#actionUp"),
            "default-buttons-up-selected"
          );
          YpFormattingHelpers.removeClass(
            this.$$("#actionDown"),
            "default-buttons-down-selected"
          );
        }
      }
    } else {
      console.warn("Could not find action buttons in post actions");
    }

    this.requestUpdate();
  }

  _enableVoting() {
    if (!this.votingDisabled) {
      this.allDisabled = false;
    }
  }

  generateEndorsementFromLogin(value: number) {
    if (!window.appUser.endorsementPostsIndex[this.post.id]) {
      this.generateEndorsement(value);
    }
  }

  async generateEndorsement(value: number) {
    if (window.appUser.loggedIn() === true) {
      let method: string;

      if (this.endorseValue === value) {
        method = "DELETE";
      } else {
        method = "POST";
      }

      const endorseResponse = (await window.serverApi.endorsePost(
        this.post.id,
        method,
        { post_id: this.post.id, value: value }
      )) as YpEndorseResponse | void;

      if (endorseResponse) {
        this._enableVoting();
        const endorsement = endorseResponse.endorsement;
        const oldEndorsementValue = endorseResponse.oldEndorsementValue;
        window.appUser.updateEndorsementForPost(
          this.post.id,
          endorsement,
          this.post.Group
        );
        this._setEndorsement(endorsement.value);
        if (oldEndorsementValue) {
          if (oldEndorsementValue > 0)
            this.post.counter_endorsements_up =
              this.post.counter_endorsements_up - 1;
          else if (oldEndorsementValue < 0)
            this.post.counter_endorsements_down =
              this.post.counter_endorsements_down - 1;
        }
        if (endorsement.value > 0)
          this.post.counter_endorsements_up =
            this.post.counter_endorsements_up + 1;
        else if (endorsement.value < 0)
          this.post.counter_endorsements_down =
            this.post.counter_endorsements_down + 1;
      }
    } else {
      this._enableVoting();
      window.appUser.loginForEndorse(this, { value: value });
    }
  }

  upVote() {
    this.allDisabled = true;
    this.generateEndorsement(1);
    window.appGlobals.activity(
      "clicked",
      "endorse_up",
      this.post ? this.post.id : -1
    );
    this._setVoteHidingStatus();
  }

  downVote() {
    this.allDisabled = true;
    this.generateEndorsement(-1);
    window.appGlobals.activity(
      "clicked",
      "endorse_down",
      this.post ? this.post.id : -1
    );
    this._setVoteHidingStatus();
  }

  _setVoteHidingStatus() {
    if (
      this.post.Group.configuration &&
      !this.post.Group.configuration.hideVoteCount
    ) {
      this.hideVoteCount = false;
    }
  }
}
