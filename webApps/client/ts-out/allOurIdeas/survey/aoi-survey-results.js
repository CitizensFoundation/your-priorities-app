var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html } from "lit";
import { property, customElement } from "lit/decorators.js";
import "../../common/yp-image.js";
import { YpFormattingHelpers } from "../../common/YpFormattingHelpers.js";
import { YpBaseElement } from "../../common/yp-base-element.js";
import { SharedStyles } from "./SharedStyles.js";
import "@material/web/checkbox/checkbox.js";
import "@material/web/button/outlined-button.js";
import "@material/web/progress/circular-progress.js";
let AoiSurveyResuls = class AoiSurveyResuls extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.showScores = false;
    }
    async connectedCallback() {
        super.connectedCallback();
        window.appGlobals.activity(`Results - open`);
    }
    async fetchResults() {
        this.results = await window.aoiServerApi.getResults(this.groupId, this.question.id);
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("earl") && this.earl) {
            this.fetchResults();
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.appGlobals.activity(`Results - close`);
    }
    toggleScores() {
        const checkbox = this.$$("#showScores");
        this.showScores = checkbox.checked;
        window.appGlobals.activity(`Results - toggle scores ${this.showScores ? "on" : "off"}`);
    }
    exportToCSV() {
        const replacer = (key, value) => (value === null ? "" : value); // specify types for key and value
        const header = Object.keys(this.results[0]);
        let csv = this.results.map((row) => header
            .map((fieldName) => JSON.stringify(row[fieldName], replacer))
            .join(",")); // specify type for row
        csv.unshift(header.join(","));
        const csvString = csv.join("\r\n");
        // Create a downloadable link
        const blob = new Blob([csvString], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "survey_results.csv";
        link.click();
        // Clean up
        URL.revokeObjectURL(url);
        setTimeout(() => link.remove(), 0);
        window.appGlobals.activity(`Results - export to csv`);
    }
    static get styles() {
        return [
            super.styles,
            SharedStyles,
            css `
        .title {
          font-size: 22px;
          letter-spacing: 0.22em;
          line-height: 1.7;
          color: var(--md-sys-color-on-surface);
          background-color: var(--md-sys-color-surface-container-high);
          padding: 16px;
          margin-top: 32px;
          border-radius: 16px;
          margin-bottom: 8px;
        }

        .answerImage {
          width: 75px;
          height: 75px;
          border-radius: 32px;
        }

        .subTitle {
        }

        .profileImage {
          width: 50px;
          height: 50px;
          min-height: 50px;
          min-width: 50px;
          margin-right: 8px;
        }

        .row {
          padding: 8px;
          margin: 8px;
          border-radius: 16px;
          background-color: var(--md-sys-color-surface-container-lowest);
          color: var(--md-sys-color-on-surface);

          min-width: 350px;
          width: 550px;

          font-size: 16px;
          vertical-align: center;

          padding-bottom: 16px;
          margin-bottom: 16px;
        }

        .row[current-user] {
          background-color: var(--md-sys-color-teriary);
          color: var(--md-sys-color-on-primary);
        }

        .column {
          padding: 8px;
        }

        .index {
          font-size: 20px;
        }

        .ideaName {
          padding-bottom: 0;
          font-size: 20px;
          width: 100%;
        }

        .nameAndScore {
          width: 100%;
        }

        .scores {
          margin-top: 16px;
          padding: 16px;
          padding-top: 12px;
          padding-bottom: 12px;
          margin-bottom: 0px;
          text-align: center;
          background-color: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-on-surface);
          border-radius: 24px;
          font-size: 14px;
          line-height: 1.3;
        }

        label {
          margin-top: 16px;
          margin-bottom: 8px;
        }

        .checkboxText {
          margin-left: 8px;
          margin-bottom: 2px;
        }

        md-checkbox {
          padding-bottom: 8px;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100vh;
        }

        .scores[hidden] {
          display: none;
        }

        .winLosses {
          margin-top: 4px;
        }

        .scoreAndNameContainer {
          width: 100%;
        }

        .exportButton {
          margin-bottom: 128px;
          margin-top: 32px;
        }

        @media (min-width: 960px) {
          .questionTitle {
            margin-bottom: 16px;
          }
        }

        @media (max-width: 960px) {
          .loading {
            width: 100vw;
            height: 100vh;
          }

          .title {
            font-size: 18px;
            letter-spacing: 0.15em;
            line-height: 1.5;
            margin-top: 16px;
          }

          .row {
            min-width: 300px;
            width: 300px;
          }
        }
      `,
        ];
    }
    renderRow(index, result) {
        return html `
      <div class="row layout horizontal">
        <div class="column index">${index + 1}.</div>
        <div class="layout horizontal nameAndScore">
          <div class="layout vertical scoreAndNameContainer">
            <div class="layout horizontal">
              <div class="column ideaName">${result.data.content}</div>
              <div class="flex"></div>
              <img class="answerImage" src="${result.data.imageUrl}" />
            </div>
            <div
              class="column layout vertical center-center scores"
              ?hidden="${!this.showScores}"
            >
              <div>
                <b
                  >${this.t("How likely to win")}:
                  ${Math.round(result.score)}%</b
                >
              </div>
              <div class="winLosses">
                ${this.t("Wins")}: ${YpFormattingHelpers.number(result.wins)}
                ${this.t("Losses")}:
                ${YpFormattingHelpers.number(result.losses)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    }
    render() {
        return this.results
            ? html `
          <div class="topContainer layout vertical wrap center-center">
            <div class="questionTitle">
              <yp-magic-text
                id="answerText"
                .contentId="${this.group.id}"
                .extraId="${this.question.id}"
                textOnly
                truncate="300"
                .content="${this.question.name}"
                .contentLanguage="${this.group.language}"
                textType="aoiQuestionName"
              ></yp-magic-text>
            </div>

            <div class="layout horizontal">
              <label>
                <md-checkbox
                  id="showScores"
                  @change="${this.toggleScores}"
                ></md-checkbox>
                <span class="checkboxText">${this.t("Show scores")}</span>
              </label>
            </div>
            ${this.results.map((result, index) => this.renderRow(index, result))}
            <div class="title subTitle">
              ${YpFormattingHelpers.number(this.question.votes_count)}
              ${this.t("total votes")}
            </div>
            <md-outlined-button @click=${this.exportToCSV} class="exportButton">
              ${this.t("Download Results as CSV")}
            </md-outlined-button>
          </div>
        `
            : html `<div class="loading">
          <md-circular-progress indeterminate></md-circular-progress>
        </div>`;
    }
};
__decorate([
    property({ type: Array })
], AoiSurveyResuls.prototype, "results", void 0);
__decorate([
    property({ type: Object })
], AoiSurveyResuls.prototype, "question", void 0);
__decorate([
    property({ type: Object })
], AoiSurveyResuls.prototype, "earl", void 0);
__decorate([
    property({ type: Object })
], AoiSurveyResuls.prototype, "group", void 0);
__decorate([
    property({ type: Number })
], AoiSurveyResuls.prototype, "groupId", void 0);
__decorate([
    property({ type: Boolean })
], AoiSurveyResuls.prototype, "showScores", void 0);
AoiSurveyResuls = __decorate([
    customElement("aoi-survey-results")
], AoiSurveyResuls);
export { AoiSurveyResuls };
//# sourceMappingURL=aoi-survey-results.js.map