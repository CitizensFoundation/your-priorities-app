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

  @property({ type: Boolean })
  isStreaming = false;

  @property({ type: Array })
  selectedChoices: AoiChoiceData[] = [];

  @property({ type: Boolean })
  analysisError = false;

  serverApi!: AoiServerApi;
  haveStartedStreaming = false;
  private analysisRequestId: string | undefined;
  private analysisSocket: WebSocket | null = null;
  private readonly onAnalysisWebSocketOpened = () => {
    this.analysisSocket = this.ws;
    void this.streamAnalysis();
  };

  get analysisStreamToken() {
    return this.analysisRequestId
      ? `aoi-analysis-${this.analysisIndex}-${this.analysisTypeIndex}-${this.analysisRequestId}`
      : undefined;
  }

  get normalizedAnalysis() {
    return this.analysis.replace(/([^\n])\s*(#{1,6}\s+)/g, "$1\n\n$2");
  }

  constructor() {
    super();
    this.serverApi = new AoiServerApi();
  }

  override async connectedCallback() {
    super.connectedCallback();
    this.addEventListener("yp-ws-opened", this.onAnalysisWebSocketOpened);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("yp-ws-opened", this.onAnalysisWebSocketOpened);
    this.analysisSocket = null;
  }

  private createAnalysisRequestId(): string {
    const cryptoApi = globalThis.crypto;
    if (typeof cryptoApi?.randomUUID === "function") return cryptoApi.randomUUID();

    const bytes = new Uint8Array(16);
    cryptoApi.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  async streamAnalysis() {
    const socket = this.ws;
    // Wait for the client-ID handshake on this exact shared connection.
    if (
      this.haveStartedStreaming ||
      !socket ||
      socket !== this.analysisSocket ||
      socket.readyState !== WebSocket.OPEN ||
      !this.wsClientId
    ) {
      return;
    }

    this.haveStartedStreaming = true;
    let requestId: string | undefined;
    try {
      this.analysisRequestId = undefined;
      requestId = this.createAnalysisRequestId();
      this.analysisRequestId = requestId;
      if (this.analysisError) this.analysis = "";
      this.analysisError = false;

      const response = await this.serverApi.getSurveyAnalysis(
        this.groupId,
        this.wsClientId,
        this.analysisIndex,
        this.analysisTypeIndex,
        YpLanguages.getEnglishName(this.language) || "",
        requestId
      );

      if (requestId !== this.analysisRequestId) return;
      if (!response || !Array.isArray(response.selectedChoices)) {
        throw new Error("No analysis response received");
      }

      if (response.cachedAnalysis) {
        this.analysis = response.cachedAnalysis;
      }
      this.selectedChoices = response.selectedChoices;
    } catch (error) {
      if (requestId !== undefined && requestId !== this.analysisRequestId) return;
      this.haveStartedStreaming = false;
      this.isStreaming = false;
      this.analysisError = true;
      console.warn("Unable to load survey analysis", error);
    }
  }

  override async onMessage(event: MessageEvent) {
    const data = JSON.parse(event.data) as YpAssistantMessage;
    if (
      data.sender === "assistant" &&
      (!this.analysisStreamToken || data.uniqueToken !== this.analysisStreamToken)
    ) {
      return;
    }

    await super.onMessage(event);
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
        this.isStreaming = true;
        break;
      case "moderation_error":
      case "error":
        this.isStreaming = false;
        this.haveStartedStreaming = false;
        this.analysisError = true;
        break;
      case "end":
        this.isStreaming = false;
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

        .analysisText {
          white-space: pre-wrap;
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
      ${this.analysisError
        ? html`<div role="alert">${this.t("An error occurred")}</div>
            <md-text-button @click=${this.streamAnalysis}>
              ${this.t("Retry")}
            </md-text-button>`
        : ""}
      ${this.selectedChoices.map((result, index) =>
        this.renderChoice(index, result)
      )}
      ${this.isStreaming
        ? html`<div class="analysisText">${this.normalizedAnalysis}</div>`
        : resolveMarkdown(this.normalizedAnalysis, {
            includeImages: true,
            includeCodeBlockClassNames: true,
          })}
      <div ?hidden="${!this.analysis}" class="generatingInfo">${this.t("Written by AI")}</div>
    </div>`;
  }
}
