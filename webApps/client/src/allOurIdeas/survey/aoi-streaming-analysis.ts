import { css, html } from "lit";
import { property, customElement, query, queryAll } from "lit/decorators.js";
import { YpBaseElement } from "../../common/yp-base-element.js";

import "@material/web/dialog/dialog.js";
import { MdDialog } from "@material/web/dialog/dialog.js";

import "@material/web/button/elevated-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/textfield/filled-text-field.js";

import { AoiServerApi } from "./AoiServerApi.js";
import { YpStreamingLlmBase } from "../../yp-llms/yp-streaming-llm-base.js";
import { resolveMarkdown } from "../../common/litMarkdown/litMarkdown.js";

@customElement("aoi-streaming-analysis")
export class AoiStreamingAnalysis extends YpStreamingLlmBase {
  @property({ type: Object })
  earl!: AoiEarlData;

  @property({ type: Number })
  groupId!: number;

  @property({ type: Number })
  analysisIndex!: number;

  @property({ type: Number })
  analysisTypeIndex!: number;

  @property({ type: String })
  analysis = "";

  @property({ type: Array })
  selectedChoices: AoiChoiceData[] = [];

  serverApi!: AoiServerApi;

  constructor() {
    super();
    this.serverApi = new AoiServerApi();
  }

  override async connectedCallback() {
    super.connectedCallback();
    this.addEventListener("yp-ws-opened", this.streamAnalysis);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.addEventListener("yp-ws-opened", this.streamAnalysis);
  }

  async streamAnalysis() {
    const { cachedAnalysis, selectedChoices } =
      await this.serverApi.getSurveyAnalysis(
        this.groupId,
        this.wsClientId,
        this.analysisIndex,
        this.analysisTypeIndex
      );

    if (cachedAnalysis) {
      this.analysis = cachedAnalysis;
    }

    this.selectedChoices = selectedChoices;
  }

  renderChoice(index: number, result: AoiChoiceData) {
    return html`
      <div class="answers layout horizontal">
        <div class="column index ideaIndex">${index + 1}.</div>
        <div class="column layout vertical ideaDescription">
          <div class="">${result.data.content}</div>
        </div>
      </div>
    `;
  }

  async addChatBotElement(wsMessage: PsAiChatWsMessage): Promise<void> {
    switch (wsMessage.type) {
      case "start":
        break;
      case "moderation_error":
        //TODO
        break;
      case "error":
        //TODO
        break;
      case "end":
        break;
      case "stream":
        if (wsMessage.message && wsMessage.message != "undefined") {
          this.analysis += wsMessage.message;
          break;
        } else {
          console.warn("stream message is undefined");
          break;
        }
    }
    this.scrollDown();
  }

  static override get styles() {
    return [
      super.styles,
      css`
        .content {
          margin: 16px;
        }

        .generatingInfo {
          font-size: 16px;
          margin-top: 8px;
          margin-bottom: 16px;
          font-style: italic;
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

        .answers {
          text-align: left;
          align-items: left;
          width: 100%;
        }

        @media (max-width: 960px) {
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

  override render() {
    return html`<div class="content layout vertical">
      ${this.selectedChoices.map((result, index) =>
        this.renderChoice(index, result)
      )}
      ${resolveMarkdown(this.analysis, {
        includeImages: true,
        includeCodeBlockClassNames: true,
      })}
      <div class="generatingInfo">${this.t("Written by GPT-4")}</div>
    </div>`;
  }
}
