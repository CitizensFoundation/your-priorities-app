import { html, css, nothing } from "lit";
import { property, customElement, query } from "lit/decorators.js";

import "@material/web/labs/navigationbar/navigation-bar.js";
import "@material/web/labs/navigationtab/navigation-tab.js";
import "@material/web/labs/navigationdrawer/navigation-drawer.js";
import "@material/web/list/list-item.js";
import "@material/web/list/list.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "../yp-app/yp-snackbar.js";
import "@material/web/progress/linear-progress.js";

import "@material/web/menu/menu.js";
import { cache } from "lit/directives/cache.js";

import "../common/yp-image.js";

//import './chat/yp-chat-assistant.js';

import "./survey/aoi-survey-intro.js";
import "./survey/aoi-survey-voting.js";
import "./survey/aoi-survey-results.js";
import "./survey/aoi-survey-analysis.js";
import { AoiServerApi } from "./survey/AoiServerApi.js";
import { AoiAppGlobals } from "./AoiAppGlobals.js";
import { NavigationDrawer } from "@material/web/labs/navigationdrawer/internal/navigation-drawer.js";

import { NavigationBar } from "@material/web/labs/navigationbar/internal/navigation-bar.js";
import { YpCollection } from "../yp-collection/yp-collection.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import { MdPrimaryTab } from "@material/web/tabs/primary-tab.js";
import { live } from "lit/directives/live.js";
import { YpSnackbar } from "../yp-app/yp-snackbar.js";

const PagesTypes = {
  Introduction: 1,
  Voting: 2,
  Results: 3,
  Analysis: 4,
  Share: 5,
};

declare global {
  interface Window {
    aoiAppGlobals: AoiAppGlobals;
    aoiServerApi: AoiServerApi;
    needsNewEarl: boolean;
  }
}

//TODO: Label the pages for aria https://github.com/material-components/material-web/blob/main/docs/components/tabs.md

@customElement("aoi-survey")
export class AoiSurvey extends YpBaseElement {
  @property({ type: Number })
  pageIndex = 1;

  @property({ type: Number })
  totalNumberOfVotes = 0;

  @property({ type: Number })
  collectionId!: number;

  @property({ type: Object })
  collection!: YpGroupData;

  @property({ type: String })
  lastSnackbarText: string | undefined;

  @property({ type: String })
  currentError: string | undefined;

  @property({ type: Object })
  earl!: AoiEarlData;

  @property({ type: Object })
  question!: AoiQuestionData;

  @property({ type: Object })
  prompt!: AoiPromptData;

  @property({ type: Boolean })
  isAdmin = false;

  @property({ type: Boolean })
  surveyClosed = false;

  @property({ type: String })
  appearanceLookup!: string;

  @property({ type: Object })
  currentLeftAnswer: AoiAnswerToVoteOnData | undefined;

  @property({ type: Object })
  currentRightAnswer: AoiAnswerToVoteOnData | undefined;

  @property({ type: Number })
  currentPromptId: number | undefined;

  drawer!: NavigationDrawer;

  constructor() {
    //super("group", "posts", "lighbulb", "create");
    super();
    window.aoiServerApi = new AoiServerApi();
    window.aoiAppGlobals = new AoiAppGlobals(window.aoiServerApi);
    window.aoiAppGlobals.activity("pageview");
  }

  override connectedCallback() {
    super.connectedCallback();
    this.setupBootListener();
    this._setupEventListeners();
    if (this.collection.configuration.allOurIdeas) {
      console.error("Connecting to old configuration");
      this.getEarl();
    } else {
      this.fire("yp-network-error", { showUserError: true });
    }
  }

  async getEarl() {
    window.aoiAppGlobals.activity("Survey - fetch start");
    try {
      const earlData = await window.aoiServerApi.getEarlData(this.collectionId!);
      this.earl = (
        this.collection!.configuration as YpGroupConfiguration
      ).allOurIdeas!.earl!;
      this.question = earlData.question;
      this.prompt = earlData.prompt;
      this.appearanceLookup = this.question.appearance_id;

      try {
        this.currentLeftAnswer = JSON.parse(this.prompt.left_choice_text);
        this.currentRightAnswer = JSON.parse(this.prompt.right_choice_text);
      } catch (error) {
        console.warn("Error parsing prompt answers", error);
        this.currentLeftAnswer = this.prompt.left_choice_text as any;
        this.currentRightAnswer = this.prompt.right_choice_text as any;
      }
      this.currentPromptId = this.prompt.id;

      document.title = this.question.name;

      if (this.earl.active) {
        this.surveyClosed = false;
      } else {
        this.surveyClosed = true;
      }

      this.fireGlobal("set-ids", {
        questionId: this.question.id,
        promptId: this.prompt.id,
      });

      window.aoiAppGlobals.activity("Survey - fetch end");
    } catch (error) {
      console.error("Error fetching earl", error);
      window.aoiAppGlobals.activity("Survey - fetch error");
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this._removeEventListeners();
  }

  scrollToCollectionItemSubClass() {
    //do nothing
  }

  getHexColor(color: string) {
    if (color) {
      // Replace all # with nothing
      color = color.replace(/#/g, "");
      if (color.length === 6) {
        return `#${color}`;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  snackbarclosed() {
    this.lastSnackbarText = undefined;
  }

  tabChanged(event: CustomEvent) {
    if (event.detail.activeIndex == 0) {
      this.pageIndex = 1;
    } else if (event.detail.activeIndex == 1) {
      this.pageIndex = 2;
    } else if (event.detail.activeIndex == 2) {
      this.pageIndex = 3;
    } else if (event.detail.activeIndex == 3) {
      this.pageIndex = 4;
    }
  }

  exitToMainApp() {
    //TODO
  }

  async _displaySnackbar(event: CustomEvent) {
    this.lastSnackbarText = event.detail;
    await this.updateComplete;
    (this.$$("#snackbar") as YpSnackbar).open = true;
  }

  _setupEventListeners() {
    this.addListener("display-snackbar", this._displaySnackbar);
  }

  _removeEventListeners() {
    this.removeListener("display-snackbar", this._displaySnackbar);
  }

  externalGoalTrigger() {
    try {
      let triggerUrl = new URL(window.aoiAppGlobals.externalGoalTriggerUrl!);

      let whiteList: string | string[] = window.aoiAppGlobals
        .exernalGoalParamsWhiteList as string;

      if (whiteList) {
        whiteList = whiteList
          .toLowerCase()
          .split(",")
          .map((param: string) => param.trim());
      }

      for (const key in window.aoiAppGlobals.originalQueryParameters) {
        if (!whiteList || whiteList.includes(key.toLowerCase())) {
          triggerUrl.searchParams.append(
            key,
            window.aoiAppGlobals.originalQueryParameters[key]
          );
        }
      }

      window.location.href = triggerUrl.toString();
    } catch (error) {
      console.error(
        "Invalid URL:",
        window.aoiAppGlobals.externalGoalTriggerUrl,
        error
      );
    }
  }

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    super.updated(changedProperties);
  }

  _appError(event: CustomEvent) {
    console.error(event.detail.message);
    this.currentError = event.detail.message;
    //(this.$$('#errorDialog') as Dialog).open = true;
  }

  get adminConfirmed() {
    return true;
  }

  _settingsColorChanged(event: CustomEvent) {
    this.fireGlobal("yp-theme-color", event.detail.value);
  }

  static override get styles() {
    return [
      ...super.styles,
      css`
        :host {
          background-color: var(--md-sys-color-surface, #fefefe);
        }

        md-tabs {
          z-index: 0;
        }

        :host {
        }

        md-tabs {
          width: 100%;
          max-width: 960px;
        }

        body {
          background-color: var(--md-sys-color-on-surface, #fefefe);
        }

        .analyticsHeaderText {
          font-size: var(--md-sys-typescale-headline-large-size, 18px);
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .ypLogo {
          margin-top: 16px;
        }

        .rightPanel {
          width: 100%;
        }

        .drawer {
          margin-left: 16px;
          padding-left: 8px;
          margin-right: 16px;
          padding-bottom: 560px;
        }

        .selectedContainer {
          --md-list-list-item-container-color: var(
            --md-sys-color-secondary-container
          );
          color: var(--md-sys-color-on-background);
          --md-list-list-item-label-text-color: var(
            --md-sys-color-on-background
          );
        }

        md-navigation-drawer {
          --md-navigation-drawer-container-color: var(--md-sys-color-surface);
        }

        md-list {
          --md-list-container-color: var(--md-sys-color-surface);
        }

        md-navigation-bar {
          --md-navigation-bar-container-color: var(--md-sys-color-surface);
        }

        .loading {
          display: flex;
          justify-content: center;
          width: 100%;
          height: 100vh;
          margin-top: 64px;
        }

        .lightDarkContainer {
          padding-left: 8px;
          padding-right: 8px;
          color: var(--md-sys-color-on-surface);
          font-size: 14px;
        }

        .darkModeButton {
          margin: 16px;
        }

        .mainPageContainer {
          overflow: hidden;
        }

        .topAppBar {
          border-radius: 48px;
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          margin-top: 32px;
          padding: 0px;
          padding-left: 32px;
          padding-right: 32px;
          text-align: center;
        }

        .collectionLogoImage {
          width: 60px;
          height: 60px;
          margin-left: 64px;
        }

        .mainPageContainer {
          margin-top: 16px;
        }

        .navContainer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 7;
        }

        [hidden] {
          display: none !important;
        }

        md-text-button {
          --md-text-button-label-text-color: #fefefe;
        }

        md-icon-button {
          --md-icon-button-unselected-icon-color: #f0f0f0;
        }

        #goalTriggerSnackbar {
          padding: 24px;
        }

        @media (max-width: 960px) {
          .mainPageContainer {
            max-width: 100%;
            width: 100%;
            margin-bottom: 96px;
            margin-top: 0;
          }

          prompt-promotion-dashboard {
            max-width: 100%;
          }
        }
      `,
    ];
  }

  changeTabTo(tabId: number) {
    this.tabChanged({ detail: { activeIndex: tabId } } as CustomEvent);
  }

  updateThemeColor(event: CustomEvent) {
    this.themeColor = event.detail;
  }

  sendVoteAnalytics() {
    if (this.totalNumberOfVotes % 10 === 0) {
      window.aoiAppGlobals.activity(
        `User voted ${this.totalNumberOfVotes} times`
      );
    }
  }

  updateappearanceLookup(event: CustomEvent) {
    this.appearanceLookup = event.detail.appearanceLookup;
    this.currentPromptId = event.detail.promptId;
    this.currentLeftAnswer = event.detail.leftAnswer;
    this.currentRightAnswer = event.detail.rightAnswer;

    this.totalNumberOfVotes++;
    this.question.votes_count++;

    this.sendVoteAnalytics();
  }

  renderIntroduction() {
    return html` <div class="layout vertical center-center"></div> `;
  }

  renderShare() {
    return html` <div class="layout vertical center-center"></div> `;
  }

  startVoting() {
    this.pageIndex = 2;
    if (this.$$("#navBar") as NavigationBar) {
      (this.$$("#navBar") as NavigationBar).activeIndex = 1;
    }

    if (this.$$("#votingTab") as MdPrimaryTab) {
      (this.$$("#votingTab") as MdPrimaryTab).selected = true;
    }

    if (this.$$("#introTab") as MdPrimaryTab) {
      (this.$$("#introTab") as MdPrimaryTab).selected = false;
    }
  }

  openResults() {
    debugger;
    this.pageIndex = 3;
    if (this.$$("#navBar") as NavigationBar) {
      (this.$$("#navBar") as NavigationBar).activeIndex = 2;
    }

    if (this.$$("#resultsTab") as MdPrimaryTab) {
      (this.$$("#resultsTab") as MdPrimaryTab).selected = true;
    }

    if (this.$$("#introTab") as MdPrimaryTab) {
      (this.$$("#introTab") as MdPrimaryTab).selected = false;
    }
  }

  triggerExternalGoalUrl() {
    window.location.href = window.aoiAppGlobals.externalGoalTriggerUrl!;
  }

  _renderPage() {
    if (this.earl) {
      switch (this.pageIndex) {
        case PagesTypes.Introduction:
          return html`<aoi-survey-intro
            .earl="${this.earl}"
            .group="${this.collection as YpGroupData}"
            .question="${this.question}"
            @startVoting="${this.startVoting}"
            @openResults="${this.openResults}"
            .themeDarkMode="${this.themeDarkMode}"
          ></aoi-survey-intro>`;
        case PagesTypes.Voting:
          return cache(html`<aoi-survey-voting
            .earl="${this.earl}"
            .groupId="${this.collectionId!}"
            .group="${this.collection as YpGroupData}"
            .question="${this.question}"
            .leftAnswer="${this.currentLeftAnswer}"
            .rightAnswer="${this.currentRightAnswer}"
            .promptId="${this.currentPromptId}"
            .appearanceLookup="${this.appearanceLookup}"
            @update-appearance-lookup="${this.updateappearanceLookup}"
          ></aoi-survey-voting>`);
        case PagesTypes.Results:
          return html`<aoi-survey-results
            .groupId="${this.collectionId!}"
            .group="${this.collection as YpGroupData}"
            .earl="${this.earl}"
            .question="${this.question}"
          ></aoi-survey-results>`;
        case PagesTypes.Analysis:
          return html`<aoi-survey-analysis
            .groupId="${this.collectionId!}"
            .group="${this.collection as YpGroupData}"
            .earl="${this.earl}"
            .question="${this.question}"
          ></aoi-survey-analysis>`;
        case PagesTypes.Share:
          return html` ${this.renderShare()} `;
        default:
          return html`
            <p>Page not found try going to <a href="#main">Main</a></p>
          `;
      }
    } else {
      return html` <div class="loading">
        <md-circular-progress indeterminate></md-circular-progress>
      </div>`;
    }
  }

  renderScore() {
    return html` <div class="layout vertical center-center"></div> `;
  }

  renderNavigationBar() {
    if (this.wide) {
      return html`
        <div class="layout vertical center-center">
          <md-tabs aria-label="Navigation Tabs">
            <md-primary-tab
              id="introTab"
              class="${this.pageIndex == PagesTypes.Introduction &&
              "selectedContainer"}"
              selected
              @click="${() => this.changeTabTo(0)}"
              aria-label="${this.t("Why Participate")}"
            >
              <md-icon slot="icon">info</md-icon>
              ${this.t("About this project")}
            </md-primary-tab>

            <md-primary-tab
              id="votingTab"
              ?hidden="${this.surveyClosed}"
              class="${this.pageIndex == PagesTypes.Voting &&
              "selectedContainer"}"
              @click="${() => this.changeTabTo(1)}"
              aria-label="${this.t("Participate Now!")}"
            >
              <md-icon slot="icon">thumb_up</md-icon>
              ${this.t("vote")}
            </md-primary-tab>


            <md-primary-tab
              id="resultsTab"
              ?hidden="${this.earl?.configuration!.hide_results}"
              class="${this.pageIndex == PagesTypes.Results &&
              "selectedContainer"}"
              @click="${() => this.changeTabTo(2)}"
              aria-label="${this.t("Results")}"
            >
              <md-icon slot="icon">grading</md-icon>
              ${this.t("Results")}
            </md-primary-tab>

            <md-primary-tab
              ?hidden="${!this.hasLlm ||
              this.earl?.configuration!.hide_analysis}"
              class="${this.pageIndex == PagesTypes.Analysis &&
              "selectedContainer"}"
              @click="${() => this.changeTabTo(3)}"
              aria-label="${this.t("Analysis of Results")}"
            >
              <md-icon slot="icon">insights</md-icon>
              ${this.t("AI-generated analysis")}
            </md-primary-tab>
          </md-tabs>
        </div>
      `;
    } else {
      return html`
        <div class="navContainer">
          <md-navigation-bar
            id="navBar"
            @navigation-bar-activated="${this.tabChanged}"
          >
            <md-navigation-tab .label="${this.t("Intro")}"
              ><md-icon slot="active-icon">info</md-icon>
              <md-icon slot="inactive-icon">info</md-icon></md-navigation-tab
            >
            <md-navigation-tab
              ?hidden="${this.surveyClosed}"
              id="votingTab"
              .label="${this.t("Voting")}"
            >
              <md-icon slot="active-icon">thumb_up</md-icon>
              <md-icon slot="inactive-icon">thumb_up</md-icon>
            </md-navigation-tab>
            <md-navigation-tab
              .label="${this.t("Results")}"
              ?hidden="${this.earl?.configuration!.hide_results}"
            >
              <md-icon slot="active-icon">grading</md-icon>
              <md-icon slot="inactive-icon">grading</md-icon>
            </md-navigation-tab>
            <md-navigation-tab
              .label="${this.t("Analysis")}"
              ?hidden="${this.earl?.configuration!.hide_results}"
            >
              <md-icon slot="active-icon">insights</md-icon>
              <md-icon slot="inactive-icon">insights</md-icon>
            </md-navigation-tab>
          </md-navigation-bar>
        </div>
      `;
    }
  }

  override render() {
    return html`<div class="layout vertical">
      ${this.renderNavigationBar()}
      <div class="rightPanel">
        <main>
          <div class="mainPageContainer">${this._renderPage()}</div>
        </main>
      </div>
    </div>

    </div>
      ${
        this.lastSnackbarText
          ? html`
              <yp-snackbar
                id="snackbar"
                @closed="${this.snackbarclosed}"
                style="text-align: center;"
                .labelText="${this.lastSnackbarText}"
              ></yp-snackbar>
            `
          : nothing
      }

      ${
        window.aoiAppGlobals.externalGoalTriggerUrl
          ? html`
              <yp-snackbar
                id="goalTriggerSnackbar"
                style="text-align: center;"
                timeoutMs="-1"
                .labelText="${this.t("Target votes reached!")}"
              >
                <md-icon-button slot="dismiss">
                  <md-icon>close</md-icon>
                </md-icon-button>
                <md-text-button
                  slot="action"
                  @click="${this.triggerExternalGoalUrl}"
                  >${this.t("Finish and return")}</md-text-button
                >
              </yp-snackbar>
            `
          : nothing
      }
      `;
  }
}
