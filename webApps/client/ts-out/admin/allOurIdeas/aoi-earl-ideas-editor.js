var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { YpStreamingLlmBase } from "../../yp-llms/yp-streaming-llm-base.js";
import { AoiAdminServerApi } from "./AoiAdminServerApi.js";
import "@material/web/list/list.js";
import "@material/web/list/list-item.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/filled-tonal-button.js";
import "@material/web/chips/filter-chip.js";
import "@material/web/chips/chip-set.js";
import "@material/web/textfield/filled-text-field.js";
import { AoiGenerateAiLogos } from "./aoiGenerateAiLogos.js";
import { ifDefined } from "lit/directives/if-defined.js";
let AoiEarlIdeasEditor = class AoiEarlIdeasEditor extends YpStreamingLlmBase {
    constructor() {
        super();
        this.isGeneratingWithAi = false;
        this.isSubmittingIdeas = false;
        this.isTogglingIdeaActive = false;
        this.isFetchingChoices = false;
        this.currentIdeasFilter = "latest";
        this.scrollElementSelector = "#answers";
        this.serverApi = new AoiAdminServerApi();
    }
    connectedCallback() {
        if (this.configuration.earl && this.configuration.earl.question_id) {
            this.disableWebsockets = true;
            this.isCreatingIdeas = false;
            this.getChoices();
        }
        else {
            this.isCreatingIdeas = true;
        }
        super.connectedCallback();
        this.addEventListener("yp-ws-closed", this.socketClosed);
        this.addEventListener("yp-ws-error", this.socketError);
    }
    socketClosed() {
        this.isGeneratingWithAi = false;
    }
    socketError() {
        this.isGeneratingWithAi = false;
    }
    async getChoices() {
        this.choices = await this.serverApi.getChoices(this.communityId, this.configuration.earl.question_id);
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
                this.isGeneratingWithAi = false;
                break;
            case "end":
                this.isGeneratingWithAi = false;
                this.answersElement.value += "\n";
                break;
            case "stream":
                if (wsMessage.message && wsMessage.message != "undefined") {
                    this.answersElement.value += wsMessage.message;
                    break;
                }
                else {
                    console.warn("stream message is undefined");
                    break;
                }
        }
        this.scrollDown();
    }
    get answers() {
        return this.$$("#answers")?.value
            .split("\n")
            .map((answer) => answer
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t'))
            .filter((answer) => answer.length > 0); // Keep filtering out empty answers
    }
    hasMoreThanOneIdea() {
        return;
    }
    openMenuFor(answer) {
        console.log("openMenuFor", answer);
    }
    generateIdeas() {
        this.isGeneratingWithAi = true;
        try {
            this.serverApi.startGenerateIdeas(this.configuration.earl.question.name, this.communityId, this.wsClientId, this.answers);
        }
        catch (e) {
            console.error(e);
        }
    }
    async submitIdeasForCreation() {
        this.isSubmittingIdeas = true;
        try {
            const { question_id } = await this.serverApi.submitIdeasForCreation(this.communityId, this.answers, this.configuration.earl.question.name);
            this.configuration.earl.question_id = question_id;
            this.configuration.earl.active = true;
            if (!this.configuration.earl.configuration) {
                this.configuration.earl.configuration = {};
            }
            if (!this.configuration.earl.question) {
                this.configuration.earl.question = {};
            }
            this.configuration.earl.question.id = question_id;
            this.fire("configuration-changed", this.configuration);
            this.requestUpdate();
            this.getChoices();
        }
        catch (e) {
            console.error(e);
        }
        finally {
            this.isSubmittingIdeas = false;
        }
    }
    toggleIdeaActivity(answer) {
        return async () => {
            this.isTogglingIdeaActive = true;
            try {
                await this.serverApi.toggleIdeaActive(this.groupId, answer.id);
                answer.active = !answer.active;
            }
            catch (e) {
                console.error(e);
            }
            finally {
                this.isTogglingIdeaActive = false;
            }
        };
    }
    applyFilter(filterType) {
        this.currentIdeasFilter = filterType;
    }
    get sortedChoices() {
        if (this.choices) {
            switch (this.currentIdeasFilter) {
                case "latest":
                    return this.choices.sort((a, b) => b.id - a.id);
                case "highestScore":
                    return this.choices.sort((a, b) => b.score - a.score);
                case "userSubmitted":
                    return this.choices.sort((a, b) => {
                        if (b.local_identifier < a.local_identifier) {
                            return -1;
                        }
                        if (b.local_identifier > a.local_identifier) {
                            return 1;
                        }
                        return 0;
                    });
            }
        }
        else {
            return undefined;
        }
    }
    async generateAiIcons() {
        const imageGenerator = new AoiGenerateAiLogos();
        imageGenerator.collectionType = "community";
        imageGenerator.collectionId = this.communityId;
        this.isGeneratingWithAi = true;
        for (let choice of this.choices) {
            try {
                const { imageUrl, error } = (await imageGenerator.generateIcon(choice.data.content, this.themeColor));
                if (error) {
                    console.error(error);
                    continue;
                }
                await this.serverApi.updateChoice(this.communityId, this.configuration.earl.question_id, choice.id, {
                    content: choice.data.content,
                    imageUrl
                });
                choice.data.imageUrl = imageUrl;
                console.error("imageUrl", imageUrl, "error", error);
                this.requestUpdate();
            }
            catch (e) {
                console.error(e);
            }
        }
        this.isGeneratingWithAi = false;
    }
    static get styles() {
        return [
            super.styles,
            css `
        .ideasList {
          padding: 16px;
          max-width: 900px;
          width: 900px;
          padding-left: 0;
        }

        .logo,
        .iconImage {
          width: 50px;
          max-width: 50px;
        }

        .logo {
          margin-right: 8px;
        }

        .iconImage {
          border-radius: 12px;
        }

        .ideaContainer {
          padding: 8px;
          margin: 5px 0;
          border-radius: 8px;
          background-color: var(--md-sys-color-surface-variant);
          color: var(--md-sys-color-on-surface-variant);
        }

        .answer {
          padding: 16px;
          padding-top: 16px;
          padding-bottom: 16px;
          border-radius: 16px;
          background-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          flex-grow: 1;
        }

        .wins,
        .losses,
        .score {
          padding: 5px;
          text-align: center;
          min-width: 50px;
        }

        .buttons {
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 120px;
        }

        .generateIconsProgress {
          margin-top: 8px;
        }

        md-filled-text-field {
          width: 100%;
          margin-bottom: 32px;
        }

        .button {
          margin-left: 16px;
          margin-right: 16px;
        }

        .generationProgress {
          width: 100%;
          margin-bottom: 24px;
          margin-top: -24px;
        }

        md-filled-text-field {
          --md-filled-field-container-color: var(
            --md-sys-color-surface
          ) !important;
        }
      `,
        ];
    }
    renderCreateIdeas() {
        return html `
      <div class="layout vertical center-center">
        <md-filled-text-field
          type="textarea"
          id="answers"
          rows="14"
          .label="${this.t("answersToVoteOn")}"
        >
        </md-filled-text-field>
        <md-linear-progress
          class="generationProgress"
          ?hidden="${!this.isGeneratingWithAi}"
          indeterminate
        ></md-linear-progress>
        <div class="layout horizontal">
          ${this.isGeneratingWithAi
            ? html `
                <div class="layout vertical center-center">
                  <md-outlined-button class="button" @click="${this.reset}"
                    >${this.t("stopGenerating")}
                    <md-icon slot="icon">stop_circle</md-icon>
                  </md-outlined-button>
                </div>
              `
            : html `
                <md-outlined-button
                  class="button"
                  @click="${this.generateIdeas}"
                  ?disabled="${this.isGeneratingWithAi}"
                  >${this.answers?.length > 1
                ? this.t("generateMoreIdeasWithAi")
                : this.t("generateIdeasWithAi")}
                  <md-icon slot="icon">smart_toy</md-icon>
                </md-outlined-button>
              `}
          <md-filled-button
            class="button"
            @click="${this.submitIdeasForCreation}"
            ?disabled="${this.isSubmittingIdeas ||
            this.answers?.length < 6 ||
            this.isGeneratingWithAi}"
            >${this.t("submitAnswersForCreation")}</md-filled-button
          >
        </div>
      </div>
    `;
    }
    renderIdeasSortingChips() {
        return html `
      <div class="layout horizontal center-center">
        <md-chip-set class="ideaFilters layout horizontal wrap" type="filter">
          <md-filter-chip
            class="layout horizontal center-center"
            label="Latest"
            .selected="${this.currentIdeasFilter == "latest"}"
            @click="${() => this.applyFilter("latest")}"
          ></md-filter-chip>
          <md-filter-chip
            class="layout horizontal center-center"
            label="User submitted"
            .selected="${this.currentIdeasFilter == "userSubmitted"}"
            @click="${() => this.applyFilter("userSubmitted")}"
          ></md-filter-chip>
          <md-filter-chip
            class="layout horizontal center-center"
            label="Highest Score"
            .selected="${this.currentIdeasFilter == "highestScore"}"
            @click="${() => this.applyFilter("highestScore")}"
          ></md-filter-chip>
        </md-chip-set>
      </div>
    `;
    }
    renderEditIdeas() {
        return html `
      <div class="layout vertical">
        ${this.renderIdeasSortingChips()}
        <div class="ideasList">
          <md-linear-progress
            indeterminate
            ?hidden="${!this.isFetchingChoices}"
          ></md-linear-progress>
          <div class="layout horizontal ideaContainer">
            <div class="logo"></div>
            <div class="flex"></div>
            <div class="wins">${this.t("wins")}</div>
            <div class="losses">${this.t("losses")}</div>
            <div class="score">${this.t("score")}</div>
            <div class="buttons">${this.t("actions")}</div>
          </div>

          ${this.sortedChoices?.map((answer, index) => {
            return html `<div class="layout horizontal ideaContainer">
              <div class="logo">
                ${answer.data.imageUrl
                ? html `<img
                      class="iconImage"
                      src="${ifDefined(answer.data.imageUrl)}"
                    />`
                : ""}
              </div>
              <div class="answer">${answer.data.content}</div>
              <div class="wins">${answer.wins}</div>
              <div class="losses">${answer.losses}</div>
              <div class="score">${Math.round(answer.score)}</div>
              <div class="buttons">
                <md-outlined-button @click="${this.toggleIdeaActivity(answer)}">
                  ${answer.active ? this.t("deactivate") : this.t("activate")}
                </md-outlined-button>
                <md-linear-progress
                  indeterminate
                  ?hidden="${!this.isTogglingIdeaActive}"
                ></md-linear-progress>
              </div>
            </div>`;
        })}
        </div>
        <div class="layout vertical center-center"></div>
          <md-outlined-button
                class="button"
                @click="${this.generateAiIcons}"
                ?disabled="${this.isGeneratingWithAi}"
                >${this.t("generateIconsWithAi")}</md-outlined-button
         >
         <md-linear-progress
          class="generateIconsProgress"
          ?hidden="${!this.isGeneratingWithAi}"
          indeterminate
        ></md-linear-progress>
        </div>
    </div>
    `;
    }
    render() {
        if (!this.choices) {
            return this.renderCreateIdeas();
        }
        else {
            return this.renderEditIdeas();
        }
    }
};
__decorate([
    property({ type: Number })
], AoiEarlIdeasEditor.prototype, "groupId", void 0);
__decorate([
    property({ type: Number })
], AoiEarlIdeasEditor.prototype, "communityId", void 0);
__decorate([
    property({ type: Object })
], AoiEarlIdeasEditor.prototype, "configuration", void 0);
__decorate([
    property({ type: Boolean })
], AoiEarlIdeasEditor.prototype, "isCreatingIdeas", void 0);
__decorate([
    property({ type: Array })
], AoiEarlIdeasEditor.prototype, "choices", void 0);
__decorate([
    property({ type: Boolean })
], AoiEarlIdeasEditor.prototype, "isGeneratingWithAi", void 0);
__decorate([
    property({ type: Boolean })
], AoiEarlIdeasEditor.prototype, "isSubmittingIdeas", void 0);
__decorate([
    property({ type: Boolean })
], AoiEarlIdeasEditor.prototype, "isTogglingIdeaActive", void 0);
__decorate([
    property({ type: Boolean })
], AoiEarlIdeasEditor.prototype, "isFetchingChoices", void 0);
__decorate([
    property({ type: String })
], AoiEarlIdeasEditor.prototype, "currentIdeasFilter", void 0);
__decorate([
    query("#answers")
], AoiEarlIdeasEditor.prototype, "answersElement", void 0);
AoiEarlIdeasEditor = __decorate([
    customElement("aoi-earl-ideas-editor")
], AoiEarlIdeasEditor);
export { AoiEarlIdeasEditor };
//# sourceMappingURL=aoi-earl-ideas-editor.js.map