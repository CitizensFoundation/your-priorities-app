import { css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { YpStreamingLlmBase } from "../../yp-llms/yp-streaming-llm-base.js";
import { MdFilledTextField } from "@material/web/textfield/filled-text-field.js";
import { AoiAdminServerApi } from "./AoiAdminServerApi.js";

import "@material/web/list/list.js";
import "@material/web/list/list-item.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/filled-tonal-button.js";
import "@material/web/chips/filter-chip.js";
import "@material/web/chips/chip-set.js";

@customElement("aoi-earl-ideas-editor")
export class AoiEarlIdeasEditor extends YpStreamingLlmBase {
  @property({ type: Number })
  groupId!: number;

  @property({ type: String })
  questionName: string | undefined;

  @property({ type: Number })
  communityId: number | undefined;

  @property({ type: Object })
  configuration!: AoiConfigurationData;

  @property({ type: Boolean })
  isCreatingIdeas!: boolean;

  @property({ type: Array })
  choices: AoiChoiceData[] | undefined;

  @property({ type: Boolean })
  isGeneratingIdeas = false;

  @property({ type: Boolean })
  isSubmittingIdeas = false;

  @property({ type: Boolean })
  isTogglingIdeaActive = false;

  @property({ type: Boolean })
  isFetchingChoices = false;

  @property({ type: String })
  currentIdeasFilter: "latest" | "highestScore" | "userSubmitted" = "latest";

  @query("#ideas")
  ideasElement!: MdFilledTextField;

  override scrollElementSelector = "#ideas";

  serverApi: AoiAdminServerApi;

  constructor() {
    super();
    this.serverApi = new AoiAdminServerApi();
  }

  override connectedCallback(): void {
    if (this.configuration.earl && this.configuration.earl.question_id) {
      this.disableWebsockets = true;
      this.isCreatingIdeas = false;
      this.getChoices();
    } else {
      this.isCreatingIdeas = true;
    }
    super.connectedCallback();
    this.addEventListener("yp-ws-closed", this.socketClosed);
    this.addEventListener("yp-ws-error", this.socketError);
  }

  socketClosed() {
    this.isGeneratingIdeas = false;
  }

  socketError() {
    this.isGeneratingIdeas = false;
  }

  async getChoices() {
    this.choices = await this.serverApi.getChoices(
      this.communityId!,
      this.configuration.earl!.question_id!
    );
  }

  async addChatBotElement(wsMessage: YpAiChatWsMessage): Promise<void> {
    switch (wsMessage.type) {
      case "start":
        break;
      case "moderation_error":
        //TODO
        break;
      case "error":
        //TODO
        this.isGeneratingIdeas = false;
        break;
      case "end":
        this.isGeneratingIdeas = false;
        break;
      case "stream":
        if (wsMessage.message && wsMessage.message != "undefined") {
          this.ideasElement.value += wsMessage.message;
          break;
        } else {
          console.warn("stream message is undefined");
          break;
        }
    }
    this.scrollDown();
  }

  get ideas() {
    return (this.$$("#ideas") as MdFilledTextField)?.value
      .split("\n")
      .filter((idea: string) => idea.length > 0);
  }

  hasMoreThanOneIdea() {
    return;
  }

  openMenuFor(idea: AoiChoiceData) {
    console.log("openMenuFor", idea);
  }

  generateIdeas() {
    this.isGeneratingIdeas = true;
    try {
      this.serverApi.startGenerateIdeas(
        this.questionName!,
        this.communityId!,
        this.wsClientId,
        this.ideas
      );
    } catch (e) {
      console.error(e);
    }
  }

  async submitIdeasForCreation() {
    this.isSubmittingIdeas = true;
    try {
      const { question_id } = (this.configuration.earl =
        await this.serverApi.submitIdeasForCreation(
          this.communityId!,
          this.ideas,
          this.questionName!
        ));
      this.configuration.earl.question_id = question_id;
      this.configuration.earl.active = true;
      this.configuration.earl.configuration = {} as any;
      this.configuration.earl.question = {
        name: this.questionName!,
        id: question_id!,
      } as any;
      this.fire("configuration-changed", this.configuration);
      this.requestUpdate();
      this.getChoices();
    } catch (e) {
      console.error(e);
    } finally {
      this.isSubmittingIdeas = false;
    }
  }

  toggleIdeaActivity(idea: AoiChoiceData) {
    return async () => {
      this.isTogglingIdeaActive = true;
      try {
        await this.serverApi.toggleIdeaActive(this.groupId, idea.id);
        idea.active = !idea.active;
      } catch (e) {
        console.error(e);
      } finally {
        this.isTogglingIdeaActive = false;
      }
    };
  }

  applyFilter(filterType: string) {
    this.currentIdeasFilter = filterType as any;
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
    } else {
      return undefined;
    }
  }

  static override get styles() {
    return [
      super.styles,
      css`
        .ideasList {
          padding: 10px;
        }

        .ideaContainer {
          padding: 10px;
          margin: 5px 0;
          border-radius: 8px;
          background-color: var(--md-sys-color-surface-variant);
          color: var(--md-sys-color-on-surface-variant);
        }

        .idea {
          padding: 5px;
          border-radius: 16px;
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
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
        }

        md-outlined-text-field {
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
      `,
    ];
  }

  renderCreateIdeas() {
    return html`
      <div class="layout vertical center-center">
        <md-outlined-text-field
          type="textarea"
          id="ideas"
          rows="14"
          .label="${this.t("ideasForVotingOn")}"
        >
        </md-outlined-text-field>
        <md-linear-progress
          class="generationProgress"
          ?hidden="${!this.isGeneratingIdeas}"
          indeterminate
        ></md-linear-progress>
        <div class="layout horizontal">
          ${this.isGeneratingIdeas
            ? html`
                <div class="layout vertical center-center">
                  <md-outlined-button class="button" @click="${this.reset}"
                    >${this.t("stop")}</md-outlined-button
                  >
                </div>
              `
            : html`
                <md-outlined-button
                  class="button"
                  @click="${this.generateIdeas}"
                  ?disabled="${this.isGeneratingIdeas}"
                  >${this.ideas?.length > 1
                    ? this.t("generateMoreIdeasWithAi")
                    : this.t("generateIdeasWithAi")}</md-outlined-button
                >
              `}
          <md-filled-button
            class="button"
            @click="${this.submitIdeasForCreation}"
            ?disabled="${this.isSubmittingIdeas || this.ideas?.length < 1}"
            >${this.t("submitIdeasForCreation")}</md-filled-button
          >
        </div>
      </div>
    `;
  }

  renderIdeasSortingChips() {
    return html`
      <md-chip-set
        class="ideaFilters layout horizontal wrap"
        type="filter"
        single-select
      >
        <md-filter-chip
          class="layout horizontal center-center"
          label="User submitted"
          @click="${() => this.applyFilter("userSubmitted")}"
        ></md-filter-chip>
        <md-filter-chip
          class="layout horizontal center-center"
          label="Latest"
          @click="${() => this.applyFilter("latest")}"
        ></md-filter-chip>
        <md-filter-chip
          class="layout horizontal center-center"
          label="Highest Score"
          @click="${() => this.applyFilter("highestScore")}"
        ></md-filter-chip>
      </md-chip-set>
    `;
  }

  renderEditIdeas() {
    return html`
      <div class="layout vertical">
        ${this.renderIdeasSortingChips()}
        <div class="ideasList">
          <md-linear-progress
            indeterminate
            ?hidden="${!this.isFetchingChoices}"
          ></md-linear-progress>
          ${this.sortedChoices?.map((idea: AoiChoiceData) => {
            return html`<div class="layout horizontal ideaContainer">
              <div class="idea">${idea.data}</div>
              <div class="wins">${idea.wins}</div>
              <div class="losses">${idea.losses}</div>
              <div class="score">${idea.score}</div>
              <div class="buttons">
                <md-outlined-button @click="${this.toggleIdeaActivity(idea)}">
                  ${idea.active ? this.t("deactivate") : this.t("activate")}
                </md-outlined-button>
                <md-linear-progress
                  indeterminate
                  ?hidden="${!this.isTogglingIdeaActive}"
                ></md-linear-progress>
              </div>
            </div>`;
          })}
        </div>
      </div>
    `;
  }

  override render() {
    if (!this.choices) {
      return this.renderCreateIdeas();
    } else {
      return this.renderEditIdeas();
    }
  }
}
