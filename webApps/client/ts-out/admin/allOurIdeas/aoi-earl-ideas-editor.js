var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from "lit";
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
import { unsafeHTML } from "lit/directives/unsafe-html.js";
let AoiEarlIdeasEditor = class AoiEarlIdeasEditor extends YpStreamingLlmBase {
    constructor() {
        super();
        this.openForAnswers = false;
        this.isGeneratingWithAi = false;
        this.isSubmittingIdeas = false;
        this.isFetchingChoices = false;
        this.currentIdeasFilter = "latest";
        this.scrollElementSelector = "#answers";
        this.serverApi = new AoiAdminServerApi();
        this.shouldContinueGenerating = true;
        this.currentGeneratingIndex = undefined;
    }
    connectedCallback() {
        this.createGroupObserver();
        this.setupBootListener();
        this.imageGenerator = new AoiGenerateAiLogos(this.themeColor);
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
        this.addGlobalListener("yp-theme-configuration-updated", this.themeUpdated.bind(this));
    }
    disconnectedCallback() {
        this.removeEventListener("yp-ws-closed", this.socketClosed);
        this.removeEventListener("yp-ws-error", this.socketError);
        this.removeGlobalListener("yp-theme-configuration-updated", this.themeUpdated.bind(this));
        super.disconnectedCallback();
    }
    themeUpdated(event) {
        this.imageGenerator = new AoiGenerateAiLogos(event.detail.oneDynamicColor ||
            event.detail.primaryColor ||
            this.themeColor);
        this.requestUpdate();
    }
    socketClosed() {
        this.isGeneratingWithAi = false;
    }
    socketError() {
        this.isGeneratingWithAi = false;
    }
    async getChoices() {
        this.choices = await this.serverApi.getChoices(this.domainId, this.communityId, this.configuration.earl.question_id);
    }
    createGroupObserver() {
        const handler = {
            set: (target, property, value, receiver) => {
                // Perform your logic here whenever a property is set
                console.error(`Property ${String(property)} set to`, value);
                // Trigger a custom event or call a method to handle the change
                this.handleGroupChange();
                return Reflect.set(target, property, value, receiver);
            },
        };
        this.group = new Proxy(this.group, handler);
    }
    handleGroupChange() {
        // Handle the change here
        console.error("Group changed", this.group);
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
                    this.answersElement.value = this.answersElement.value.replace(/\n\n/g, "\n");
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
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"')
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t"))
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
            this.serverApi.startGenerateIdeas(this.configuration.earl.question.name, this.domainId, this.communityId, this.wsClientId, this.answers);
        }
        catch (e) {
            console.error(e);
        }
    }
    async submitIdeasForCreation() {
        this.isSubmittingIdeas = true;
        try {
            const { question_id } = await this.serverApi.submitIdeasForCreation(this.domainId, this.communityId, this.answers, this.configuration.earl.question.name);
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
            this.isTogglingIdeaActive = answer.id;
            try {
                answer.active = !answer.active;
                await this.serverApi.updateActive(this.domainId, this.communityId, this.configuration.earl.question_id, answer.id, answer.active);
            }
            catch (e) {
                console.error(e);
            }
            finally {
                this.isTogglingIdeaActive = undefined;
            }
            this.requestUpdate();
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
                case "activeDeactive":
                    return this.choices.sort((a, b) => {
                        if (b.active < a.active) {
                            return -1;
                        }
                        if (b.active > a.active) {
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
    updated(changedProperties) {
        super.updated(changedProperties);
    }
    async generateAiIcons() {
        const numberOfIconsToGenerateInParallel = 5;
        this.isGeneratingWithAi = true;
        this.shouldContinueGenerating = true;
        for (let i = 0; i < this.choices.length; i += numberOfIconsToGenerateInParallel) {
            if (!this.shouldContinueGenerating) {
                break;
            }
            const generationPromises = [];
            for (let j = i; j < i + numberOfIconsToGenerateInParallel && j < this.choices.length; j++) {
                const choice = this.choices[j];
                if (choice.data?.imageUrl) {
                    continue;
                }
                const imageGenerator = new AoiGenerateAiLogos(this.themeColor);
                if (this.communityId) {
                    imageGenerator.collectionType = "community";
                    imageGenerator.collectionId = this.communityId;
                }
                else if (this.domainId) {
                    imageGenerator.collectionType = "domain";
                    imageGenerator.collectionId = this.domainId;
                }
                choice.data.isGeneratingImage = true;
                this.requestUpdate();
                const generationPromise = imageGenerator
                    .generateIcon(choice.data.content, this.$$("#aiStyleInput").value)
                    .then((result) => {
                    // Use the interface here
                    choice.data.isGeneratingImage = undefined;
                    if (result.error) {
                        console.error(result.error);
                        return;
                    }
                    if (!this.shouldContinueGenerating) {
                        return;
                    }
                    if (result.imageUrl) {
                        return this.serverApi
                            .updateChoice(this.domainId, this.communityId, this.configuration.earl.question_id, choice.id, {
                            content: choice.data.content,
                            imageUrl: result.imageUrl,
                            choiceId: choice.id,
                        })
                            .then(() => {
                            choice.data.imageUrl = result.imageUrl;
                            this.requestUpdate();
                        });
                    }
                    else {
                        return;
                    }
                })
                    .catch((e) => {
                    choice.data.isGeneratingImage = false;
                    console.error(e);
                });
                generationPromises.push(generationPromise);
            }
            await Promise.all(generationPromises);
        }
        this.isGeneratingWithAi = false;
        this.currentGeneratingIndex = undefined;
    }
    async generateAiIconsOld() {
        this.imageGenerator.collectionType = "community";
        this.imageGenerator.collectionId = this.communityId;
        this.isGeneratingWithAi = true;
        this.shouldContinueGenerating = true;
        for (let i = 0; i < this.choices.length; i++) {
            if (!this.shouldContinueGenerating) {
                break;
            }
            const choice = this.choices[i];
            if (choice.data?.imageUrl) {
                continue;
            }
            this.currentGeneratingIndex = i;
            try {
                choice.data.isGeneratingImage = true;
                const { imageUrl, error } = (await this.imageGenerator.generateIcon(choice.data.content, this.$$("#aiStyleInput").value));
                choice.data.isGeneratingImage = undefined;
                if (error) {
                    console.error(error);
                    continue;
                }
                if (!this.shouldContinueGenerating) {
                    break;
                }
                await this.serverApi.updateChoice(this.domainId, this.communityId, this.configuration.earl.question_id, choice.id, {
                    content: choice.data.content,
                    imageUrl,
                    choiceId: choice.id,
                });
                choice.data.imageUrl = imageUrl;
                console.error("imageUrl", imageUrl, "error", error);
                this.requestUpdate();
            }
            catch (e) {
                choice.data.isGeneratingImage = false;
                console.error(e);
            }
        }
        this.isGeneratingWithAi = false;
        this.currentGeneratingIndex = undefined;
    }
    stopGenerating() {
        this.shouldContinueGenerating = false;
        this.isGeneratingWithAi = false;
        if (this.choices && this.currentGeneratingIndex !== undefined) {
            this.choices[this.currentGeneratingIndex].data.isGeneratingImage = false;
            this.requestUpdate();
        }
    }
    get allChoicesHaveIcons() {
        return this.choices?.every((choice) => choice.data.imageUrl);
    }
    async deleteImageUrl(choice) {
        choice.data.imageUrl = undefined;
        await this.serverApi.updateChoice(this.domainId, this.communityId, this.configuration.earl.question_id, choice.id, {
            content: choice.data.content,
            imageUrl: undefined,
            choiceId: choice.id,
        });
        this.requestUpdate();
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          --md-elevated-button-container-color: var(
            --md-sys-color-surface-container-higher
          );
          --md-elevated-button-label-text-color: var(--md-sys-color-on-surface);
        }

        .activeCheckboxText {
          margin-left: 16px;
        }

        .activeCheckbox {
          margin-top: 2px;
        }

        yp-magic-text {
          min-width: 262px;
        }

        .headerPadding {
          width: 414px;
        }

        .genIconSpinner {
          width: 100px;
          height: 100px;
          margin-left: 0;
          margin-right: -8px;
        }

        .iconImage,
        .iconImageRight {
          width: 100px;
          height: 100px;
          margin-left: 0;
          margin-right: -8px;
          border-radius: 70px;
        }

        .iconImageRight {
        }

        .closeIcon {
        }

        .deleteIcon {
          position: absolute;
          right: 6px;
          bottom: 16px;
          height: 28px;
          width: 28px;
        }

        .iconContainer md-elevated-button {
          margin: 8px;
          width: 400px;
          max-width: 400px;
          max-height: 120px;
          height: 120px;
          white-space: collapse balance;
          font-size: 16px;
          --md-elevated-button-container-height: 120px !important;
          --md-elevated-button-hover-label-text-color: var(
            --md-sys-color-on-primary-container
          );
        }

        #aiStyleInput {
          margin-bottom: 16px;
        }

        .generateIconButton {
          max-width: 250px;
        }

        .iconGenerationBottomSpinner {
          margin-top: 16px;
          width: 200px;
        }

        .ideasList {
          padding: 16px;
          max-width: 900px;
          width: 900px;
          padding-left: 0;
        }

        .ideaContainer {
          padding: 8px;
          margin: 0;
          border-radius: 8px;
          align-items: center;
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

        .origin {
          min-width: 70px;
          text-align: center;
        }

        .generateAnswersInfo {
          margin-top: -16px;
          margin-bottom: 24px;
          font-size: 14px;
          font-style: italic;
        }

        .buttons {
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 140px;
          min-width: 140px;
          position: relative;
        }

        .toggleActiveProgress {
          position: absolute;
          bottom: -4px;
        }

        .generateIconsProgress {
          margin-top: 8px;
        }

        md-filled-text-field {
          width: 100%;
          margin-bottom: 32px;
        }

        .iconContainer {
          position: relative;
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
    answersChanged() {
        this.requestUpdate();
    }
    renderCreateIdeas() {
        return html `
      <div class="layout vertical center-center generateAnswersInfo">
        <div style="max-width: 650px">
          ${unsafeHTML(this.t("generateAnswersInfo"))}
        </div>
      </div>
      <div class="layout vertical center-center">
        <md-filled-text-field
          type="textarea"
          id="answers"
          ?disabled="${!this.openForAnswers}"
          rows="14"
          @input="${this.answersChanged}"
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
                <div
                  class="layout vertical center-center"
                  ?hidden="${!this.hasLlm}"
                >
                  <md-outlined-button class="button" @click="${this.reset}"
                    >${this.t("stopGenerating")}
                    <md-icon slot="icon">stop_circle</md-icon>
                  </md-outlined-button>
                </div>
              `
            : html `
                <md-text-button
                  class="button"
                  @click="${this.generateIdeas}"
                  ?hidden="${!this.hasLlm}"
                  ?disabled="${this.isGeneratingWithAi || !this.openForAnswers}"
                  >${this.answers?.length > 1
                ? this.t("generateMoreIdeasWithAi")
                : this.t("generateIdeasWithAi")}
                  <md-icon slot="icon">smart_toy</md-icon>
                </md-text-button>
              `}
          <md-filled-button
            class="button"
            @click="${this.submitIdeasForCreation}"
            ?disabled="${this.isSubmittingIdeas ||
            this.answers?.length < 6 ||
            !this.configuration ||
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
            label="${this.t("latest")}"
            .selected="${this.currentIdeasFilter == "latest"}"
            @click="${() => this.applyFilter("latest")}"
          ></md-filter-chip>
          <md-filter-chip
            class="layout horizontal center-center"
            label="${this.t("higestScore")}"
            .selected="${this.currentIdeasFilter == "highestScore"}"
            @click="${() => this.applyFilter("highestScore")}"
          ></md-filter-chip>
          <md-filter-chip
            class="layout horizontal center-center"
            label="${this.t("active")}"
            .selected="${this.currentIdeasFilter == "activeDeactive"}"
            @click="${() => this.applyFilter("activeDeactive")}"
          ></md-filter-chip>
        </md-chip-set>
      </div>
    `;
    }
    renderIcon(choice) {
        if (choice.data.isGeneratingImage) {
            return html `
        <md-circular-progress
          class="genIconSpinner"
          slot="icon"
          indeterminate
        ></md-circular-progress>
      `;
        }
        else if (choice.data.imageUrl) {
            return html ` <img
        class="iconImage"
        src="${choice.data.imageUrl}"
        alt="icon"
        slot="icon"
        ?hidden="${!choice.data.imageUrl}"
      />`;
        }
        else {
            return nothing;
        }
    }
    aiStyleChanged() {
        if (!this.group.configuration.theme) {
            this.group.configuration.theme = {};
        }
        this.fire("theme-config-changed", {
            iconPrompt: this.aiStyleInputElement?.value,
        });
    }
    renderAnswerData(answer) {
        return html `
      <div class="iconContainer">
        <md-elevated-button
          id="leftAnswerButton"
          class="leftAnswer"
          trailing-icon
        >
          ${this.renderIcon(answer)}
          <yp-magic-text
            id="answerText"
            .contentId="${this.groupId}"
            .extraId="${answer.data.choiceId}"
            textOnly
            truncate="140"
            .content="${answer.data.content}"
            .contentLanguage="${this.group.language}"
            textType="aoiChoiceContent"
          ></yp-magic-text>
        </md-elevated-button>
        <md-filled-tonal-icon-button
          ?hidden="${!answer.data.imageUrl}"
          @click="${() => this.deleteImageUrl(answer)}"
          class="deleteIcon"
          ><md-icon class="closeIcon"
            >close</md-icon
          ></md-filled-tonal-icon-button
        >
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
            <div class="headerPadding">&nbsp;</div>
            <div class="origin">${this.t("origin")}</div>
            <div class="wins">${this.t("wins")}</div>
            <div class="losses">${this.t("losses")}</div>
            <div class="score">${this.t("score")}</div>
            <div class="buttons">${this.t("choiceStatus")}</div>
          </div>

          ${this.sortedChoices?.map((answer, index) => {
            return html `<div class="layout horizontal ideaContainer">
              <div>${this.renderAnswerData(answer)}</div>
              <div class="origin">
                ${answer.user_created ? this.t("User") : this.t("Seed")}
              </div>
              <div class="wins">${answer.wins}</div>
              <div class="losses">${answer.losses}</div>
              <div class="score">${Math.round(answer.score)}</div>
              <div class="buttons layout vertical center-center">
                <label>
                  <md-checkbox
                    class="activeCheckbox"
                    .checked="${answer.active}"
                    @click="${this.toggleIdeaActivity(answer)}"
                  ></md-checkbox>
                  <span class="activeCheckboxText">${this.t("active")}</span>
                </label>

                <md-linear-progress
                  class="toggleActiveProgress"
                  indeterminate
                  ?hidden="${this.isTogglingIdeaActive !== answer.id}"
                ></md-linear-progress>
              </div>
            </div>`;
        })}
        </div>
        <div class="layout vertical center-center"></div>
          <md-outlined-text-field
            id="aiStyleInput"
            .label="${this.t("styleForAiIconGeneration")}"
            type="textarea"
            @change="${this.aiStyleChanged}"
            rows="5"
            .value="${this.group.configuration.theme?.iconPrompt ||
            this.imageGenerator.promptDraft}"
            ?hidden="${this.allChoicesHaveIcons || !this.hasLlm}"
            ?disabled="${this.isGeneratingWithAi || this.allChoicesHaveIcons}"
          ></md-outlined-text-field>
          <div class="layout vertical center-center" ?hidden="${!this.hasLlm}">
            <md-outlined-button
              class="generateIconButton"
              @click="${this.stopGenerating}"
              ?hidden="${!this.isGeneratingWithAi}"
            >
              ${this.t("stopGenerating")}
              <md-icon slot="icon">stop_circle</md-icon>
            </md-outlined-button>
            <md-linear-progress class="iconGenerationBottomSpinner" ?hidden="${!this
            .isGeneratingWithAi}" indeterminate></md-linear-progress>

            <md-outlined-button
              class="generateIconButton"
              @click="${this.generateAiIcons}"
              ?disabled="${this.allChoicesHaveIcons}"
              ?hidden="${this.isGeneratingWithAi}"
            >
              ${this.allChoicesHaveIcons
            ? this.t("allIconsHaveBeenGenerated")
            : this.t("generateIconsWithAi")}
              <md-icon slot="icon">smart_toy</md-icon>
            </md-outlined-button
          >
        </div>
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
    property({ type: Boolean })
], AoiEarlIdeasEditor.prototype, "openForAnswers", void 0);
__decorate([
    property({ type: Number })
], AoiEarlIdeasEditor.prototype, "domainId", void 0);
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
    property({ type: Number })
], AoiEarlIdeasEditor.prototype, "isTogglingIdeaActive", void 0);
__decorate([
    property({ type: Boolean })
], AoiEarlIdeasEditor.prototype, "isFetchingChoices", void 0);
__decorate([
    property({ type: Object })
], AoiEarlIdeasEditor.prototype, "group", void 0);
__decorate([
    query("#aiStyleInput")
], AoiEarlIdeasEditor.prototype, "aiStyleInputElement", void 0);
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