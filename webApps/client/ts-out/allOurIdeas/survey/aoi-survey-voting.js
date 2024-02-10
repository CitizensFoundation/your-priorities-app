var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { YpBaseElement } from "../../common/yp-base-element.js";
import "../../common/yp-image.js";
import "@material/web/button/elevated-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/progress/circular-progress.js";
import "./aoi-new-idea-dialog.js";
import "./aoi-llm-explain-dialog.js";
import { SharedStyles } from "./SharedStyles.js";
let AoiSurveyVoting = class AoiSurveyVoting extends YpBaseElement {
    constructor() {
        super();
        this.voteCount = 0;
        this.spinnersActive = false;
        this.breakForVertical = false;
        this.llmExplainOpen = false;
        this.level = 1;
        this.resetAnimation = this.resetAnimation.bind(this);
    }
    async connectedCallback() {
        super.connectedCallback();
        this.setupBootListener();
        this.spinnersActive = false;
        this.fire("needs-new-earl");
        window.appGlobals.activity("Voting - open");
        this.resetTimer();
        this.installMediaQueryWatcher(`(max-width: 1200px) and (min-width: 960px)`, (matches) => {
            this.breakForVertical = matches;
        });
    }
    disconnectedCallback() {
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
    animateButtons(direction) {
        return new Promise((resolve) => {
            const leftButton = this.shadowRoot?.querySelector("#leftAnswerButton");
            const rightButton = this.shadowRoot?.querySelector("#rightAnswerButton");
            leftButton?.addEventListener("animationend", this.resetAnimation);
            rightButton?.addEventListener("animationend", this.resetAnimation);
            if (direction === "left") {
                leftButton?.classList.add("animate-up", "fade-slow");
                rightButton?.classList.add("animate-down", "fade-fast");
            }
            else if (direction === "right") {
                rightButton?.classList.add("animate-up", "fade-slow");
                leftButton?.classList.add("animate-down", "fade-fast");
            }
            else {
                leftButton?.classList.add("fade-slow");
                rightButton?.classList.add("fade-slow");
            }
            resolve();
        });
    }
    resetAnimation(event) {
        event.target.classList.remove("animate-up", "animate-down", "animate-from-left", "animate-from-right", "fade-fast", "fade-slow");
    }
    async voteForAnswer(direction) {
        window.appGlobals.activity(`Voting - ${direction}`);
        const voteData = {
            time_viewed: new Date().getTime() - (this.timer || 0),
            prompt_id: this.promptId,
            direction,
            appearance_lookup: this.appearanceLookup,
        };
        const postVotePromise = window.aoiServerApi.postVote(this.groupId, this.question.id, this.promptId, this.language, voteData, direction);
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
        }
        else {
            try {
                this.leftAnswer = JSON.parse(postVoteResponse.newleft);
                this.rightAnswer = JSON.parse(postVoteResponse.newright);
            }
            catch (error) {
                console.error("Error parsing answers JSON", error, postVoteResponse.newleft, postVoteResponse.newright);
                this.leftAnswer = postVoteResponse.newleft;
                this.rightAnswer = postVoteResponse.newright;
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
    removeAndInsertFromLeft() {
        const leftButton = this.shadowRoot?.querySelector("#leftAnswerButton");
        const rightButton = this.shadowRoot?.querySelector("#rightAnswerButton");
        leftButton?.classList.remove("animate-up", "animate-down", "fade-fast", "fade-slow");
        rightButton?.classList.remove("animate-up", "animate-down", "fade-fast", "fade-slow");
        leftButton?.classList.add("animate-from-left");
        rightButton?.classList.add("animate-from-right");
    }
    openNewIdeaDialog() {
        this.$$("#newIdeaDialog").open();
    }
    async openLlmExplainDialog() {
        this.llmExplainOpen = true;
        await this.updateComplete;
        this.$$("#llmExplainDialog").open();
    }
    static get styles() {
        return [
            super.styles,
            SharedStyles,
            css `
        :host {
          --md-elevated-button-container-color: var(
            --md-sys-color-surface-container-high
          );
          --md-elevated-button-label-text-color: var(
            --md-sys-color-on-surface
          );
        }

        yp-magic-text {
          min-width: 265px;
        }

        .iconImage,
        .iconImageRight {
          width: 100px;
          height: 100px;
          margin-left: 0;
          margin-right: -8px;
          border-radius: 70px;
        }

        .iconImage[rtl] {
          margin-right: 0;
          margin-left: -8px;
        }

        .iconImageRight {
        }

        .buttonContainer md-elevated-button {
          margin: 8px;
          width: 400px;
          max-width: 400px;
          max-height: 120px;
          height: 120px;
          white-space: collapse balance;
          font-size: 16px;
          --md-elevated-button-container-height: 120px !important;
          --md-elevated-button-hover-label-text-color: var(
            --md-sys-color-on-surface
          );
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

        @media (max-width: 960px) {
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
            font-size: 22
            px;
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

        @media (max-width: 380px) {

          .buttonContainer md-elevated-button {
            width: 85vw;
            max-width: 85vw;
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
            if (!this.currentLevelTargetVotes || this.question.visitor_votes >= this.currentLevelTargetVotes) {
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
            const progressPercentage = Math.min((this.question.visitor_votes / targetVotes) * 100, 100);
            return html `
        <div class="progressBarContainer">
          <div class="progressBar" style="width: ${progressPercentage}%;"></div>
        </div>
        <div class="progressBarText">
          ${this.question.visitor_votes} ${this.t("votes of")} ${targetVotes} ${this.t("target")}
          (${this.t("Level")} ${this.level})
        </div>
      `;
        }
        else {
            return nothing;
        }
    }
    render() {
        if (this.question) {
            return html `
        <div
          class="topContainer layout vertical wrap center-center"
          tabindex="-1"
        >
          <div class="questionTitle">
            <yp-magic-text
              id="answerText"
              .contentId="${this.groupId}"
              .extraId="${this.question.id}"
              textOnly
              truncate="300"
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
                ? html `
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
              class="leftAnswer"
              ?trailing-icon="${!this.rtl}"
              ?hidden="${this.spinnersActive}"
              @click=${() => this.voteForAnswer("left")}
            >
              ${this.leftAnswer?.imageUrl
                ? html `
                    <yp-image
                      slot="icon"
                      .src="${this.leftAnswer?.imageUrl}"
                      alt="Left answer image"
                      ?rtl="${this.rtl}"
                      class="iconImage"
                    ></yp-image>
                  `
                : nothing}
              <yp-magic-text
                id="leftAnswerText"
                .contentId="${this.groupId}"
                .extraId="${this.leftAnswer.choiceId}"
                .additionalId="${this.question.id}"
                textOnly
                truncate="140"
                .content="${this.leftAnswer.content}"
                .contentLanguage="${this.group.language}"
                textType="aoiChoiceContent"
              ></yp-magic-text>
            </md-elevated-button>
            <div class="layout horizontal center-center">
             <span class="or"> ${this.t("or")} </span>
            </div>
            ${this.spinnersActive
                ? html `
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
              class="rightAnswer"
              ?trailing-icon="${!this.rtl}"
              ?hidden="${this.spinnersActive}"
              @click=${() => this.voteForAnswer("right")}
            >
              ${this.rightAnswer?.imageUrl
                ? html `
                    <yp-image
                      slot="icon"
                      ?rtl="${this.rtl}"
                      src="${this.rightAnswer?.imageUrl}"
                      alt="Right answer image"
                      class="iconImageRight"
                    ></yp-image>
                  `
                : nothing}
              <yp-magic-text
                id="rightAnswerText"
                .contentId="${this.groupId}"
                .extraId="${this.rightAnswer.choiceId}"
                .additionalId="${this.question.id}"
                textOnly
                truncate="140"
                .content="${this.rightAnswer.content}"
                .contentLanguage="${this.group.language}"
                textType="aoiChoiceContent"
              ></yp-magic-text>
            </md-elevated-button>
          </div>
          <div class="layout horizontal">
            <md-text-button ?hidden="${!this.hasLlm}"
              class="skipButton"
              @click=${this.openLlmExplainDialog}
            >
              ${this.t("Explain")}
            </md-text-button>
            <md-outlined-button
              class="newIdeaButton"
              @click="${this.openNewIdeaDialog}"
            >
              ${this.t("Add your own answer")}
            </md-outlined-button>
            <md-text-button
              class="skipButton"
              @click=${() => this.voteForAnswer("skip")}
            >
              ${this.t("Skip")}
            </md-text-button>
          </div>
          ${this.renderProgressBar()}
          <div class="layout horizontal wrap center-center"></div>
        </div>
        ${!this.wide
                ? html `
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
          .earl=${this.earl}
        ></aoi-new-idea-dialog>
        ${this.llmExplainOpen
                ? html `
              <aoi-llm-explain-dialog
                id="llmExplainDialog"
                .question=${this.question}
                @closed=${() => (this.llmExplainOpen = false)}
                .earl=${this.earl}
                .groupId=${this.groupId}
                .leftAnswer=${this.leftAnswer}
                .rightAnswer=${this.rightAnswer}
              ></aoi-llm-explain-dialog>
            `
                : nothing}
      `;
        }
        else {
            return nothing;
        }
    }
};
__decorate([
    property({ type: Number })
], AoiSurveyVoting.prototype, "groupId", void 0);
__decorate([
    property({ type: Object })
], AoiSurveyVoting.prototype, "earl", void 0);
__decorate([
    property({ type: Object })
], AoiSurveyVoting.prototype, "question", void 0);
__decorate([
    property({ type: Object })
], AoiSurveyVoting.prototype, "firstPrompt", void 0);
__decorate([
    property({ type: Number })
], AoiSurveyVoting.prototype, "promptId", void 0);
__decorate([
    property({ type: Object })
], AoiSurveyVoting.prototype, "group", void 0);
__decorate([
    property({ type: Number })
], AoiSurveyVoting.prototype, "voteCount", void 0);
__decorate([
    property({ type: Boolean })
], AoiSurveyVoting.prototype, "spinnersActive", void 0);
__decorate([
    property({ type: Object })
], AoiSurveyVoting.prototype, "leftAnswer", void 0);
__decorate([
    property({ type: Object })
], AoiSurveyVoting.prototype, "rightAnswer", void 0);
__decorate([
    property({ type: String })
], AoiSurveyVoting.prototype, "appearanceLookup", void 0);
__decorate([
    property({ type: Boolean })
], AoiSurveyVoting.prototype, "breakForVertical", void 0);
__decorate([
    property({ type: Boolean })
], AoiSurveyVoting.prototype, "llmExplainOpen", void 0);
__decorate([
    property({ type: Number })
], AoiSurveyVoting.prototype, "level", void 0);
__decorate([
    property({ type: Number })
], AoiSurveyVoting.prototype, "currentLevelTargetVotes", void 0);
AoiSurveyVoting = __decorate([
    customElement("aoi-survey-voting")
], AoiSurveyVoting);
export { AoiSurveyVoting };
//# sourceMappingURL=aoi-survey-voting.js.map