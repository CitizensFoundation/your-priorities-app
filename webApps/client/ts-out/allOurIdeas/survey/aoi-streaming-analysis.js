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
import { YpStreamingLlmBase } from "../../yp-llms/yp-streaming-llm-base.js";
import { resolveMarkdown } from "../../common/litMarkdown/litMarkdown.js";
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
        const { cachedAnalysis, selectedChoices } = await this.serverApi.getSurveyAnalysis(this.groupId, this.wsClientId, this.analysisIndex, this.analysisTypeIndex);
    }
    renderChoice(index, result) {
        return html `
      <div class="answers layout horizontal">
        <div class="column index ideaIndex">${index + 1}.</div>
        <div class="column layout vertical ideaDescription">
          <div class="">${result.data.content}</div>
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
        return [super.styles, css ``];
    }
    render() {
        return html `<div id="content layout vertical">
      ${this.selectedChoices.map((result, index) => this.renderChoice(index, result))}
      ${resolveMarkdown(this.analysis, {
            includeImages: true,
            includeCodeBlockClassNames: true,
        })}
      <div class="generatingInfo">${this.t("Written by GPT-4")}</div>
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