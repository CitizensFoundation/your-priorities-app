import { css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { resolveMarkdown } from "../../common/litMarkdown/litMarkdown.js";

import "../../common/yp-image.js";
import { YpFormattingHelpers } from "../../common/YpFormattingHelpers.js";
import { YpBaseElement } from "../../common/yp-base-element.js";
import { SharedStyles } from "./SharedStyles.js";

import "@material/web/progress/circular-progress.js";

import "./aoi-streaming-analysis.js";

@customElement("aoi-survey-analysis")
export class AoiSurveyAnalysis extends YpBaseElement {
  @property({ type: Number })
  groupId!: number;

  @property({ type: Object })
  group!: YpGroupData;

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

  renderStreamingAnalysis() {
    try {
      const analysis_config = JSON.parse(
        this.earl.configuration!.analysis_config as any
      ) as any;
      return html` ${analysis_config.analyses.map((analysis: any) => {
        return analysis.map((analysisTypeIndex: any) => {
          return html`<aoi-streaming-analysis
            groupId=${this.groupId}
            analysisIndex=${analysis.analysisIndex}
            analysisTypeIndex=${analysisTypeIndex}
          >
          </aoi-streaming-analysis>`;
        });
      })}`;
    } catch (error) {
      console.error(error);
      return nothing;
    }
  }

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    super.updated(changedProperties);
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
          color: var(--md-sys-color-on-primary-container);
          background-color: var(--md-sys-color-primary-container);
          padding: 16px;
          margin-top: 32px;
          border-radius: 16px;
          margin-bottom: 8px;
        }


        .analysisInfo {
          font-size: 20px;
          margin: 8px;
          margin-bottom: 16px;
          margin-top: 16px;
          text-align: center;
        }

        .analysisTitle {
          font-size: 16px;
          margin: 16px;
          padding: 8px;
          margin-top: 8px;
          border-radius: 16px;
          text-align: center;
        }

        .ideasLabel {
          font-size: 16px;
          margin: 16px;
          padding: 8px;
          margin-bottom: 8px;
          width: 80%;
          border-radius: 16px;
          text-align: center;
          color: var(--md-sys-color-on-primary-container);
          background-color: var(--md-sys-color-primary-container);
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
          padding-top: 0px;
          padding-bottom: 8px;
          margin: 16px;
          width: 100%;
          margin-top: 8px;
          border-radius: 24px;
          margin-bottom: 16px;
          color: var(--md-sys-color-on-surface);
          background-color: var(--md-sys-color-surface-container);
        }

        .analysisContainer {
          padding: 8px;
          margin: 8px;
          color: var(--md-sys-color-primary);

          min-width: 350px;
          width: 550px;

          font-size: 16px;
          vertical-align: center;
          margin-top: 0;
          padding-top: 0;

          padding-bottom: 16px;
        }

        aoi-streaming-analysis {
          margin-bottom: 16px;
          border-radius: 16px;
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

        aoi-streaming-analysis {
          padding: 16px;
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

  renderAnalysis() {
    let outHtml = html``;

    debugger;

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
        outHtml = html`${outHtml}`;
        let innerHtml = html``;
        for (let a = 0; a < analysis.analysisTypes.length; a++) {
          innerHtml = html`${innerHtml}
            <aoi-streaming-analysis
              .groupId=${this.group.id}
              .group=${this.group}
              .earl=${this.earl}
              .analysisIndex=${i}
              .analysisTypeIndex=${a}
            >
            </aoi-streaming-analysis>`;
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
        <div class="analysisInfo">${this.t('aiAnalysisInfo')}</div>
        <div class="layout vertical self-start">
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
        </div>
        <div class="layout vertical center-center analysisContainer">
          ${this.renderAnalysis()}
        </div>
      </div>
    `;
  }
}
