import { css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { resolveMarkdown } from "../../common/litMarkdown/litMarkdown.js";

import "../../common/yp-image.js";
import { YpFormattingHelpers } from "../../common/YpFormattingHelpers.js";
import { YpBaseElement } from "../../common/yp-base-element.js";
import { SharedStyles } from "./SharedStyles.js";

import "@material/web/progress/circular-progress.js";

@customElement("aoi-survey-analysis")
export class AoiSurveyAnalysis extends YpBaseElement {
  @property({ type: Number })
  groupId!: number;

  @property({ type: Array })
  results!: AoiResultData[];

  @property({ type: Object })
  question!: AoiQuestionData;

  @property({ type: Object })
  earl!: AoiEarlData;

  override async connectedCallback() {
    super.connectedCallback();
    window.appGlobals.activity(`Analysis - open`);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.appGlobals.activity(`Analysis - close`);
  }

  async fetchResults() {
    try {
      const analysis_config = JSON.parse(this.earl.configuration!.analysis_config as any) as any;

      for (
        let analysisIndex = 0;
        analysisIndex < analysis_config.analyses.length;
        analysisIndex++
      ) {
        const analysis = analysis_config.analyses[analysisIndex];
        for (
          let typeIndex = 0;
          typeIndex < analysis.analysisTypes.length;
          typeIndex++
        ) {
          const analysisData = await window.aoiServerApi.getSurveyAnalysis(
            this.groupId,
            analysisIndex,
            typeIndex
          );

          if (!analysisData) {
            analysis.analysisTypes[typeIndex].analysis = "error";
            analysis.ideaRows = [];
          } else {
            analysis.analysisTypes[typeIndex].analysis = analysisData.analysis;
            analysis.ideaRows = analysisData.ideaRowsFromServer;
          }
          this.requestUpdate();
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    super.updated(changedProperties);

    if (changedProperties.has("earl") && this.earl) {
      this.fetchResults();
    }
  }

  static override get styles() {
    return [
      ...super.styles,
      SharedStyles,
      css`
        .title {
          font-size: 22px;
          letter-spacing: 0.22em;
          line-height: 1.7;
          color: var(--md-sys-color-primary);
          background-color: var(--md-sys-color-on-primary);
          padding: 16px;
          margin-top: 32px;
          border-radius: 16px;
          margin-bottom: 8px;
        }

        .analysisTitle {
          font-size: 16px;
          margin: 16px;
          padding: 8px;
          margin-top: 8px;
          border-radius: 16px;
          text-align: center;
          color: var(--md-sys-color-on-secondary);
          background-color: var(--md-sys-color-secondary);
        }

        .ideasLabel {
          font-size: 16px;
          margin: 16px;
          padding: 8px;
          margin-bottom: 8px;
          width: 80%;
          border-radius: 16px;
          text-align: center;
          color: var(--md-sys-color-on-primary);
          background-color: var(--md-sys-color-primary);
        }

        .generatingInfo {
          font-size: 16px;
          margin-top: 8px;
          margin-bottom: 16px;
          font-style: italic;
        }

        .analysisResults {
          padding: 16px;
          padding-top: 0;
        }

        .rowsContainer {
          padding: 0;
          padding-top: 16px;
          padding-bottom: 16px;
          margin: 16px;
          width: 100%;
          margin-top: 8px;
          border-radius: 24px;
          margin-bottom: 16px;
          color: var(--md-sys-color-primary);
          background-color: var(--md-sys-color-on-primary);
        }

        .analysisContainer {
          padding: 8px;
          margin: 8px;
          color: var(--md-sys-color-primary);

          min-width: 350px;
          width: 550px;

          font-size: 16px;
          vertical-align: center;

          padding-bottom: 16px;
        }

        .analysisRow {
          margin-bottom: 16px;
          width: 100%;
        }

        .analysisRow {
          padding: 0px;
          margin: 0px;
          border-radius: 16px;
        }

        .column {
          padding: 8px;
        }

        .index {
          font-size: 16px;
        }

        .nickname {
          padding-bottom: 0;
        }

        .nameAndScore {
          width: 100%;
        }

        .analysisRow {
        }

        .answers {
          text-align: left;
          align-items: left;
          width: 100%;
        }

        .questionTitle {
        }

        @media (min-width: 960px) {
          .questionTitle {
            margin-bottom: 16px;
          }
        }

        @media (max-width: 960px) {
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

          .analysisContainer {
            min-width: 100%;
            width: 100%;
            padding-left: 0;
            padding-right: 0;
            margin: 0;
          }

          .analysisResults {
            border-radius: 16px;
          }

          .analysisRow {
            width: 100%;
          }

          .ideaDescription {
            padding-right: 24px;
          }

          .ideaIndex {
            padding-left: 24px;
          }
        }
      `,
    ];
  }

  renderIdeas(index: number, result: AoiResultData) {
    return html`
      <div class="answers layout horizontal">
        <div class="column index ideaIndex">${index + 1}.</div>
        <div class="column layout vertical ideaDescription">
          <div class="">${result.data}</div>
        </div>
      </div>
    `;
  }

  analysisRow(analysisItem: AnalysisTypeData) {
    let analysisHtml;

    if (analysisItem.analysis && analysisItem.analysis != "error") {
      analysisHtml = html`
        <div class="analysisResults">
          ${resolveMarkdown(analysisItem.analysis, {
            includeImages: true,
            includeCodeBlockClassNames: true,
          })}
          <div class="generatingInfo">
            ${this.t("Written by GPT-4")}
          </div>
        </div>
      </div>`;
    } else if (analysisItem.analysis && analysisItem.analysis == "error") {
      analysisHtml = html`<div class=" layout horizontal center-center">
        ${this.t("Error fetching analysis")}
      </div>`;
    } else {
      analysisHtml = html`<div class=" layout vertical center-center">
        <md-circular-progress indeterminate></md-circular-progress>
        <div class="generatingInfo">
          ${this.t("Generating analysis with GPT-4")}
        </div>
      </div>`;
    }

    return html`<div class="analysisRow">
      <div class="analysisTitle">${analysisItem.label}</div>
      ${analysisHtml}
    </div>`;
  }

  renderAnalysis() {
    let outHtml = html``;

    if (
      this.earl.configuration &&
      this.earl.configuration.analysis_config?.analyses?.length > 0
    ) {
      for (
        let i = 0;
        i < this.earl.configuration!.analysis_config.analyses.length;
        i++
      ) {
        const analysis = this.earl.configuration!.analysis_config.analyses[i];
        outHtml = html`${outHtml}
          <div class="ideasLabel">${analysis.ideasLabel}</div>

          ${analysis.ideaRows?.map((result, index) =>
            this.renderIdeas(index, result)
          )} `;
        let innerHtml = html``;
        for (let a = 0; a < analysis.analysisTypes.length; a++) {
          innerHtml = html`${innerHtml}
          ${this.analysisRow(analysis.analysisTypes[a])} `;
        }
        outHtml = html`${outHtml}
          <div class="rowsContainer">${innerHtml}</div>`;
      }
    }

    return outHtml;
  }

  override render() {
    return html`
      <div class="topContainer layout vertical wrap center-center">
        <div class="title">${this.t("Vote Analysis")}</div>
        <div class="layout vertical self-start">
          <div class="questionTitle">${this.question.name}</div>
        </div>
        <div class="layout vertical center-center analysisContainer">
          ${this.renderAnalysis()}
        </div>
      </div>
    `;
  }
}
