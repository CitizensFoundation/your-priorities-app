var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html } from "lit";
import { property, customElement } from "lit/decorators.js";
import "@material/web/dialog/dialog.js";
import "@material/web/button/elevated-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/textfield/filled-text-field.js";
import { AoiServerApi } from "./AoiServerApi.js";
import { YpStreamingLlmBase } from "../../yp-chatbots/yp-streaming-llm-base.js";
import { resolveMarkdown } from "../../common/litMarkdown/litMarkdown.js";
import { YpLanguages } from "../../common/languages/ypLanguages.js";
let AoiStreamingAnalysis = class AoiStreamingAnalysis extends YpStreamingLlmBase {
    constructor() {
        super();
        this.analysis = "";
        this.selectedChoices = [];
        this.serverApi = new AoiServerApi();
    }
    async connectedCallback() {
        super.connectedCallback();
        this.addEventListener("yp-ws-opened", this.streamAnalysis);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.addEventListener("yp-ws-opened", this.streamAnalysis);
    }
    async streamAnalysis() {
        const { cachedAnalysis, selectedChoices } = await this.serverApi.getSurveyAnalysis(this.groupId, this.wsClientId, this.analysisIndex, this.analysisTypeIndex, YpLanguages.getEnglishName(this.language) || "");
        if (cachedAnalysis) {
            this.analysis = cachedAnalysis;
        }
        this.selectedChoices = selectedChoices;
    }
    renderChoice(index, result) {
        return html `
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
            src="${result.data.imageUrl}"
          />
        </div>
      </div>
    `;
    }
    async addChatBotElement(wsMessage) {
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
                }
                else {
                    console.warn("stream message is undefined");
                    break;
                }
        }
        this.scrollDown();
    }
    static get styles() {
        return [
            super.styles,
            css `
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
    render() {
        return html `<div class="content layout vertical">
      ${this.selectedChoices.map((result, index) => this.renderChoice(index, result))}
      ${resolveMarkdown(this.analysis, {
            includeImages: true,
            includeCodeBlockClassNames: true,
        })}
      <div ?hidden="${!this.analysis}" class="generatingInfo">${this.t("Written by GPT-4")}</div>
    </div>`;
    }
};
__decorate([
    property({ type: Object })
], AoiStreamingAnalysis.prototype, "earl", void 0);
__decorate([
    property({ type: Number })
], AoiStreamingAnalysis.prototype, "groupId", void 0);
__decorate([
    property({ type: Object })
], AoiStreamingAnalysis.prototype, "group", void 0);
__decorate([
    property({ type: Number })
], AoiStreamingAnalysis.prototype, "analysisIndex", void 0);
__decorate([
    property({ type: Number })
], AoiStreamingAnalysis.prototype, "analysisTypeIndex", void 0);
__decorate([
    property({ type: String })
], AoiStreamingAnalysis.prototype, "analysis", void 0);
__decorate([
    property({ type: Array })
], AoiStreamingAnalysis.prototype, "selectedChoices", void 0);
AoiStreamingAnalysis = __decorate([
    customElement("aoi-streaming-analysis")
], AoiStreamingAnalysis);
export { AoiStreamingAnalysis };
//# sourceMappingURL=aoi-streaming-analysis.js.map