import { css, html, nothing, PropertyValueMap } from "lit";
import { property, customElement } from "lit/decorators.js";

import { YpBaseElement } from "../../common/yp-base-element.js";
import { YpMediaHelpers } from "../../common/YpMediaHelpers.js";

import "../../common/yp-image.js";

import "@material/web/button/elevated-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/progress/circular-progress.js";

import "./aoi-new-idea-dialog.js";
import "./aoi-llm-explain-dialog.js";

import { SharedStyles } from "./SharedStyles.js";
import { Dialog } from "@material/web/dialog/internal/dialog.js";
import { AoiNewIdeaDialog } from "./aoi-new-idea-dialog.js";
import { YpFormattingHelpers } from "../../common/YpFormattingHelpers.js";
import { AoiLlmExplainDialog } from "./aoi-llm-explain-dialog.js";
import { YpGroup } from "../../yp-collection/yp-group.js";
import { YpMagicText } from "../../yp-magic-text/yp-magic-text.js";
import { MdOutlinedButton } from "@material/web/button/outlined-button.js";

@customElement("aoi-survey-voting")
export class AoiSurveyVoting extends YpBaseElement {
  @property({ type: Number })
  groupId!: number;

  @property({ type: Object })
  earl!: AoiEarlData;

  @property({ type: Object })
  question!: AoiQuestionData;

  @property({ type: Object })
  firstPrompt!: AoiPromptData;

  @property({ type: Number })
  promptId!: number;

  @property({ type: Object })
  group!: YpGroupData;

  @property({ type: Number })
  voteCount = 0;

  @property({ type: Boolean })
  spinnersActive = false;

  @property({ type: Object })
  leftAnswer: AoiAnswerToVoteOnData | undefined;

  @property({ type: Object })
  rightAnswer: AoiAnswerToVoteOnData | undefined;

  @property({ type: String })
  appearanceLookup!: string;

  @property({ type: Boolean })
  breakForVertical = false;

  @property({ type: Boolean })
  breakButtonsForVertical = false;

  @property({ type: Boolean })
  llmExplainOpen = false;

  @property({ type: Number })
  level = 1;

  @property({ type: Number })
  currentLevelTargetVotes: number | undefined;

  timer: number | undefined;

  constructor() {
    super();
    this.resetAnimation = this.resetAnimation.bind(this);
  }

  override async connectedCallback() {
    super.connectedCallback();
    this.setupBootListener();
    this.spinnersActive = false;
    this.fire("needs-new-earl");
    window.appGlobals.activity("Voting - open");
    this.resetTimer();
    this.installMediaQueryWatcher(`(max-width: 800px)`, (matches) => {
      this.breakForVertical = matches;
    });

    this.installMediaQueryWatcher(`(max-width: 450px)`, (matches) => {
      this.breakButtonsForVertical = matches;
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.appGlobals.activity("Voting - close");
    this.fireGlobal("set-ids", {
      questionId: this.question.id,
      promptId: undefined,
    });
  }

  resetTimer() {
    this.timer = new Date().getTime();
  }

  animateButtons(direction: "left" | "right" | "skip"): Promise<void> {
    return new Promise((resolve) => {
      const leftButton = this.shadowRoot?.querySelector("#leftAnswerButton");
      const rightButton = this.shadowRoot?.querySelector("#rightAnswerButton");

      leftButton?.addEventListener("animationend", this.resetAnimation);
      rightButton?.addEventListener("animationend", this.resetAnimation);

      if (direction === "left") {
        leftButton?.classList.add("animate-up", "fade-slow");
        rightButton?.classList.add("animate-down", "fade-fast");
      } else if (direction === "right") {
        rightButton?.classList.add("animate-up", "fade-slow");
        leftButton?.classList.add("animate-down", "fade-fast");
      } else {
        leftButton?.classList.add("fade-slow");
        rightButton?.classList.add("fade-slow");
      }

      resolve();
    });
  }

  resetAnimation(event: any) {
    event.target.classList.remove(
      "animate-up",
      "animate-down",
      "animate-from-left",
      "animate-from-right",
      "fade-fast",
      "fade-slow"
    );
  }

  async voteForAnswer(direction: "left" | "right" | "skip") {
    window.appGlobals.activity(`Voting - ${direction}`);

    //this.resetAnimation({target: this.$$("#leftAnswerButton")});
    //this.resetAnimation({target: this.$$("#rightAnswerButton")});

    const voteData: AoiVoteData = {
      time_viewed: new Date().getTime() - (this.timer || 0),
      prompt_id: this.promptId,
      direction,
      appearance_lookup: this.appearanceLookup,
    };

    const postVotePromise = window.aoiServerApi.postVote(
      this.groupId,
      this.question.id,
      this.promptId,
      this.language,
      voteData,
      direction
    );

    let animationPromise = this.animateButtons(direction);

    const spinnerTimeout = setTimeout(() => {
      this.spinnersActive = true;
    }, 1000);

    const [postVoteResponse] = await Promise.all([
      postVotePromise,
      animationPromise,
    ]);

    clearTimeout(spinnerTimeout);

    this.spinnersActive = false;

    if (!postVoteResponse) {
      this.fire("display-snackbar", this.t("Network error, please try again."));
      this.removeAndInsertFromLeft();
      return;
    } else {
      try {
        this.leftAnswer = JSON.parse(
          postVoteResponse.newleft
        ) as AoiAnswerToVoteOnData;
      } catch (error) {
        console.warn(
          "Error parsing answers JSON",
          error,
          postVoteResponse.newleft,
        );
        this.leftAnswer = postVoteResponse.newleft as any;
      }

      try {
        this.rightAnswer = JSON.parse(
          postVoteResponse.newright
        ) as AoiAnswerToVoteOnData;
      } catch (error) {
        console.warn(
          "Error parsing answers JSON",
          error,
          postVoteResponse.newright
        );
        this.rightAnswer = postVoteResponse.newright as any;
      }

      this.promptId = postVoteResponse.prompt_id;
      this.appearanceLookup = postVoteResponse.appearance_lookup;

      this.fire("update-appearance-lookup", {
        appearanceLookup: this.appearanceLookup,
        promptId: this.promptId,
        leftAnswer: this.leftAnswer,
        rightAnswer: this.rightAnswer,
      });

      this.fireGlobal("set-ids", {
        questionId: this.question.id,
        promptId: this.promptId,
      });

      this.removeAndInsertFromLeft();

      const buttons = this.shadowRoot?.querySelectorAll("md-elevated-button");
      buttons?.forEach((button) => {
        button.blur();
      });

      if (direction !== "skip") {
        this.question.visitor_votes += 1;
      }
      this.requestUpdate();

      this.resetTimer();
    }
  }

  async setLabelOnMdButton() {
    // Query all custom buttons
    const customButtons =
      this.shadowRoot?.querySelectorAll("md-elevated-button");

    // Check if buttons are found
    if (!customButtons) {
      console.error("No custom buttons found");
      return;
    }

    await this.updateComplete;

    // Iterate over each button
    customButtons.forEach((customButton) => {
      // Access the shadow DOM of each button
      const shadow = customButton.shadowRoot;

      if (shadow) {
        const labelSpan = shadow.querySelector("button .label") as HTMLElement;

        if (labelSpan) {
          // Change the overflow property
          labelSpan.style.overflow = "visible";
        } else {
          console.error(
            "Label span not found within the shadow DOM of the button"
          );
        }
      } else {
        console.error("Shadow DOM not found for the button");
      }
    });
  }

  protected override firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    this.setLabelOnMdButton();
  }

  removeAndInsertFromLeft() {
    const leftButton = this.shadowRoot?.querySelector("#leftAnswerButton");
    const rightButton = this.shadowRoot?.querySelector("#rightAnswerButton");

    leftButton?.classList.remove(
      "animate-up",
      "animate-down",
      "fade-fast",
      "fade-slow"
    );
    rightButton?.classList.remove(
      "animate-up",
      "animate-down",
      "fade-fast",
      "fade-slow"
    );

    leftButton?.classList.add("animate-from-left");
    rightButton?.classList.add("animate-from-right");
  }

  openNewIdeaDialog() {
    (this.$$("#newIdeaDialog") as AoiNewIdeaDialog).open();
  }

  async openLlmExplainDialog() {
    this.llmExplainOpen = true;
    await this.updateComplete;
    (this.$$("#llmExplainDialog") as AoiLlmExplainDialog).open();
  }

  static override get styles() {
    return [
      super.styles,
      SharedStyles,
      css`
        :host {
          --md-elevated-button-container-color: var(
            --md-sys-color-surface-container-high
          );
          --md-elevated-button-label-text-color: var(--md-sys-color-on-surface);
        }

        yp-magic-text {
          min-width: 265px;
        }

        .iconImage,
        .iconImageRight {
          width: 100px;
          height: 100px;
          margin-left: 0;
          margin-right: 0;
          border-radius: 70px;
          background-color: transparent;
        }

        .iconImage[rtl] {
          margin-right: 0;
          margin-left: 0px;
        }

        .iconImageRight {
        }

        .buttonContainer md-elevated-button {
          margin: 8px;
          width: 400px;
          max-width: 400px;
          max-height: 120px;
          height: 120px;
          white-space: normal;
          font-size: 16px;
          --md-elevated-button-container-height: 120px !important;
          --md-elevated-button-hover-label-text-color: var(
            --md-sys-color-on-surface
          );
        }

        @supports (white-space: collapse balance) {
          .buttonContainer md-elevated-button {
            white-space: collapse balance;
          }
        }

        .spinnerContainer {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 120px;
          margin: 8px;
          width: 400px;
        }

        .progressBarContainer {
          width: 450px;
          height: 10px;
          background-color: var(--md-sys-color-on-secondary);
          border-radius: 5px;
          overflow: hidden;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
          margin-top: 40px;
        }

        .progressBar {
          height: 100%;
          background-color: var(--md-sys-color-secondary);
          transition: width 0.4s ease-in-out;
        }

        .progressBarText {
          font-size: 12px;
          text-align: right;
          padding-top: 4px;
          color: var(--md-sys-color-secondary);
          width: 450px;
        }

        .or {
          font-size: 22px;
          padding: 8px;
          color: var(--md-sys-color-secondary);
        }

        .questionTitle {
          margin-top: 32px;
        }

        .newIdeaButton,
        .skipButton {
          margin-top: 24px;
          margin-left: 12px;
          margin-right: 12px;
        }

        .skipButton {
          margin-left: 8px;
        }

        .buttonContainer {
          margin-top: 32px;
        }

        .md-elevated-button {
          transition: transform 0.3s ease-out;
        }

        .fade-fast {
          transition: opacity 0.5s ease-out;
          opacity: 0.2;
        }

        .fade-slow {
          transition: opacity 1s ease-out;
          opacity: 0.9;
        }

        .animate-up,
        .animate-down {
          transition: transform 1s ease-out;
        }

        .animate-up {
          transform: translateY(-450px);
        }

        .animate-down {
          transform: translateY(450px);
        }

        .animate-from-left,
        .animate-from-right {
          opacity: 1;
        }

        .animate-from-left {
          animation: slideInFromLeft 0.7s forwards;
        }

        .animate-from-right {
          animation: slideInFromRight 0.7s forwards;
        }

        @keyframes slideInFromLeft {
          0% {
            transform: translateX(-120%);
            opacity: 0.25;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInFromRight {
          0% {
            transform: translateX(120%);
            opacity: 0.25;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 450px) {
          .animate-up {
            transform: translateY(-550px);
          }

          .animate-down {
            transform: translateY(550px);
          }

          .buttonContainer md-elevated-button {
            width: 92vw;
            max-width: 92vw;
            font-size: 15px;
            margin-top: 8px;
            margin-bottom: 16px;
          }

          .questionTitle {
            margin-top: 16px;
            margin-bottom: 0px;
            font-size: 22 px;
          }

          yp-magic-text {
            min-width: 100%;
          }

          .spinnerContainer {
            width: 100%;
            height: 100px;
          }

          .topContainer {
            overflow-x: clip;
          }

          .progressBarContainer {
            width: 80%;
          }

          .progressBarText {
            width: 80%;
          }

          .or {
            font-size: 18px;
            padding: 4px;
            color: var(--md-sys-color-secondary);
          }
        }

        @media (max-width: 360px) {
          .buttonContainer md-elevated-button {
            width: 92vw;
            max-width: 92vw;
            font-size: 14px;
            margin-top: 8px;
            margin-bottom: 16px;
          }
        }
      `,
    ];
  }

  renderProgressBar() {
    if (this.earl.configuration) {
      let initialTargetVotes = this.earl.configuration.target_votes || 30;

      if (
        !this.currentLevelTargetVotes ||
        this.question.visitor_votes >= this.currentLevelTargetVotes
      ) {
        this.currentLevelTargetVotes = initialTargetVotes;
        let levelMultiplier = 1;

        while (this.question.visitor_votes >= this.currentLevelTargetVotes) {
          this.currentLevelTargetVotes *= 2;
          levelMultiplier *= 2;
        }

        let level = Math.log(levelMultiplier) / Math.log(2) + 1; // +1 because level starts at 1
        this.level = level;
      }

      let targetVotes = this.currentLevelTargetVotes;

      const progressPercentage = Math.min(
        (this.question.visitor_votes / targetVotes) * 100,
        100
      );

      return html`
        <div class="progressBarContainer">
          <div class="progressBar" style="width: ${progressPercentage}%;"></div>
        </div>
        <div class="progressBarText">
          ${this.question.visitor_votes} ${this.t("votes of")} ${targetVotes}
          ${this.t("target")} (${this.t("Level")} ${this.level})
        </div>
      `;
    } else {
      return nothing;
    }
  }

  override render() {
    if (this.question) {
      return html`
        <div
          class="topContainer layout vertical wrap center-center"
          tabindex="-1"
        >
          <div class="questionTitle">
            <yp-magic-text
              id="questionText"
              .contentId="${this.groupId}"
              .extraId="${this.question.id}"
              textOnly
              truncate="400"
              .content="${this.question.name}"
              .contentLanguage="${this.group.language}"
              textType="aoiQuestionName"
            ></yp-magic-text>
          </div>
          <div
            class="buttonContainer layout ${this.breakForVertical
              ? "vertical"
              : "horizontal"} wrap center-center"
          >
            ${this.spinnersActive
              ? html`
                  <div class="spinnerContainer">
                    <md-circular-progress
                      class="leftSpinner"
                      indeterminate
                    ></md-circular-progress>
                  </div>
                `
              : nothing}
            <md-elevated-button
              id="leftAnswerButton"
              class="leftAnswer answerButton"
              ?trailing-icon="${!this.rtl}"
              ?hidden="${this.spinnersActive}"
              @click=${() => this.voteForAnswer("left")}
            >
              ${this.leftAnswer?.imageUrl
                ? html`
                    <yp-image
                      slot="icon"
                      .src="${this.leftAnswer?.imageUrl}"
                      .alt="${this.leftAnswer?.content || this.leftAnswer}"
                      .title="${this.leftAnswer?.content || this.leftAnswer}"
                      ?rtl="${this.rtl}"
                      class="iconImage"
                    ></yp-image>
                  `
                : nothing}
              <yp-magic-text
                id="leftAnswerText"
                class="magicAnswerText"
                .contentId="${this.groupId}"
                .extraId="${this.leftAnswer!.choiceId}"
                .additionalId="${this.question.id}"
                textOnly
                truncate="140"
                .content="${this.leftAnswer?.content || this.leftAnswer}"
                .contentLanguage="${this.group.language}"
                textType="aoiChoiceContent"
              ></yp-magic-text>
            </md-elevated-button>
            <div class="layout horizontal center-center">
              <span class="or"> ${this.t("or")} </span>
            </div>
            ${this.spinnersActive
              ? html`
                  <div class="spinnerContainer">
                    <md-circular-progress
                      class="leftSpinner"
                      indeterminate
                    ></md-circular-progress>
                  </div>
                `
              : nothing}
            <md-elevated-button
              id="rightAnswerButton"
              class="rightAnswer answerButton"
              ?trailing-icon="${!this.rtl}"
              ?hidden="${this.spinnersActive}"
              @click=${() => this.voteForAnswer("right")}
            >
              ${this.rightAnswer?.imageUrl
                ? html`
                    <yp-image
                      slot="icon"
                      ?rtl="${this.rtl}"
                      src="${this.rightAnswer?.imageUrl}"
                      .alt="${this.rightAnswer?.content || this.rightAnswer}"
                      .title="${this.rightAnswer?.content || this.rightAnswer}"
                      class="iconImageRight"
                    ></yp-image>
                  `
                : nothing}
              <yp-magic-text
                id="rightAnswerText"
                class="magicAnswerText"
                .contentId="${this.groupId}"
                .extraId="${this.rightAnswer!.choiceId}"
                .additionalId="${this.question.id}"
                textOnly
                truncate="140"
                .content="${this.rightAnswer?.content || this.rightAnswer}"
                .contentLanguage="${this.group.language}"
                textType="aoiChoiceContent"
              ></yp-magic-text>
            </md-elevated-button>
          </div>
          <div
            class="layout ${this.breakButtonsForVertical
              ? "vertical"
              : "horizontal"} center-center wrap"
          >
            <md-text-button
              ?hidden="${!this.hasLlm || this.earl.configuration?.hide_explain}"
              class="skipButton"
              @click=${this.openLlmExplainDialog}
            >
              ${this.t("Explain")}
            </md-text-button>

            <md-text-button
              ?hidden="${this.earl.configuration?.hide_skip}"
              class="skipButton"
              @click=${() => this.voteForAnswer("skip")}
            >
              ${this.t("Skip")}
            </md-text-button>
            <md-text-button
              ?hidden="${!this.earl.configuration?.accept_new_ideas}"
              class="newIdeaButton"
              @click="${this.openNewIdeaDialog}"
            >
              ${this.t("Add your own answer")}
            </md-text-button>
          </div>
          ${this.renderProgressBar()}
          <div class="layout horizontal wrap center-center"></div>
        </div>
        ${!this.wide
          ? html`
              <input
                type="text"
                id="dummyInput"
                style="position:absolute;opacity:0;"
              />
            `
          : nothing}
        <aoi-new-idea-dialog
          id="newIdeaDialog"
          .question=${this.question}
          .groupId=${this.groupId}
          .group=${this.group}
          @new-idea-added="${() => this.voteForAnswer("skip")}"
          .earl=${this.earl}
        ></aoi-new-idea-dialog>
        ${this.llmExplainOpen
          ? html`
              <aoi-llm-explain-dialog
                id="llmExplainDialog"
                .question=${this.question}
                .questionText=${(this.$$("#questionText") as YpMagicText)
                  .translatedContent}
                .leftAnswerText=${(this.$$("#leftAnswerText") as YpMagicText)
                  .translatedContent!}
                .rightAnswerText=${(this.$$("#rightAnswerText") as YpMagicText)
                  .translatedContent!}
                @closed=${() => (this.llmExplainOpen = false)}
                .earl=${this.earl}
                .groupId=${this.groupId}
                .leftAnswer=${this.leftAnswer!}
                .rightAnswer=${this.rightAnswer!}
              ></aoi-llm-explain-dialog>
            `
          : nothing}
      `;
    } else {
      return nothing;
    }
  }
}
