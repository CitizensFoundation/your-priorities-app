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
import { YpStreamingLlmBase } from "../../yp-chatbots/yp-streaming-llm-base.js";
import { resolveMarkdown } from "../../common/litMarkdown/litMarkdown.js";
import { YpLanguages } from "../../common/languages/ypLanguages.js";
import { YpStreamingLlmScrolling } from "../../yp-chatbots/yp-streaming-llm-scrolling.js";

@customElement("aoi-streaming-analysis")
export class AoiStreamingAnalysis extends YpStreamingLlmScrolling  {
  @property({ type: Object })
  earl!: AoiEarlData;

  @property({ type: Number })
  groupId!: number;

  @property({ type: Object })
  group!: YpGroupData;

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
        this.analysisTypeIndex,
        YpLanguages.getEnglishName(this.language) || ""
      );

    if (cachedAnalysis) {
      this.analysis = cachedAnalysis;
    }

    this.selectedChoices = selectedChoices;
  }


  renderChoice(index: number, result: AoiChoiceData) {
    return html`
      <div class="answers layout horizontal" style="width: 100%">
        <div class="column index ideaIndex">${index + 1}.</div>
        <div class="layout horizontal" style="width: 100%">
          <div class="column ideaName">
            <yp-magic-text
              id="answerText"
              .contentId="${this.groupId}"
              .extraId="${result.data.choiceId}"
              .additionalId="${this.earl.question_id}"
              textOnly
              truncate="140"
              .content="${result.data.content}"
              .contentLanguage="${this.group.language}"
              textType="aoiChoiceContent"
            ></yp-magic-text>
          </div>
          <div class="flex"></div>
          <img
            class="answerImage"
            ?hidden="${result.data.imageUrl == undefined}"
            src="${result.data.imageUrl!}"
            alt="${result.data.content}"
          />
        </div>
      </div>
    `;
  }

  async addChatBotElement(wsMessage: YpAssistantMessage): Promise<void> {
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
          margin-bottom: 0;
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
          margin-bottom: 8px;
        }

        .answerImage {
          width: 60px;
          height: 60px;
          border-radius: 45px;
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
      <div ?hidden="${!this.analysis}" class="generatingInfo">${this.t("Written by GPT-4")}</div>
    </div>`;
  }
}
