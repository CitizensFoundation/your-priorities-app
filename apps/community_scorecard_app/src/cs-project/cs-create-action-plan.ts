import { property, html, css, LitElement, customElement } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
//import { ifDefined } from 'lit-html/directives/if-defined';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';

import '@material/mwc-tab-bar';
import '@material/mwc-fab';
import '@material/mwc-icon';
import '@material/mwc-icon-button';
import '@material/mwc-button';
import '@material/mwc-radio';

import '@material/mwc-formfield';

import '@material/mwc-circular-progress-four-color';
import '../cs-story/cs-story.js';

import '@manufosela/stars-rating';

import 'app-datepicker';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { TextArea } from '@material/mwc-textarea';

export const CreationStages: Record<string, number> = {
  IntroStory: 0,
  WaitToStart: 1,
  IntroSurvey: 2,
  WaitToCompleteSurvey: 3,
  IntroSurveyResults: 4,
  ElectSecretary: 5,
  WaitToElect: 6,
  ShowElectedSecretary: 7,
  ReviewIssuesWithScores: 8,
  CreateActionPlan: 9,
  FinalIssues: 10,
  NextMeeting: 11,
};

export const TabTypes: Record<string, number> = {
  ActionPlan: 0,
  Information: 1,
  Facilitator: 2,
};

class CsActionItem {
  description: string | undefined;
  pointsFor: Array<string> = [];
  pointsAgainst: Array<string> = [];
}

@customElement('cs-create-action-plan')
export class CsCreateIssues extends YpBaseElement {
  @property({ type: Number })
  stage = CreationStages.IntroStory;

  @property({ type: Number })
  rating: number | undefined;

  @property({ type: Array })
  actionItems: Array<CsActionItem> = [];

  @property({ type: Number })
  selectedTab = 0;

  @property({ type: Object })
  currentActionItem: CsActionItem | undefined;

  currentPointFor = true;

  nominees = [
    'John Travolta',
    'Nicole Kidman',
    'Patric Stewart',
    'Meryl Streep',
    'Scarlett Johansson',
  ];

  stockIssues = [
    'Attitute of staff',
    'Affordability of services',
    'Availability of medicine',
    'Distance to health centre',
    'Equal access to the health services for all community members',
    'Punctuality of staff',
    'Polite behavior',
    "Listening to patients' problems",
    'Honest and transparent staff (in terms of dealing with drugs, food, etc',
  ];

  renderCurrentStage(): TemplateResult | undefined {
    let stage: TemplateResult | undefined;

    switch (this.stage) {
      case CreationStages.IntroStory:
        stage = this.renderIntroStory();
        break;
      case CreationStages.WaitToStart:
        stage = this.renderWaitToStart();
        break;
      case CreationStages.IntroSurvey:
        stage = this.renderIntroSurvey();
        break;
      case CreationStages.WaitToCompleteSurvey:
        stage = this.renderWaitToCompleteSurvey();
        break;
      case CreationStages.IntroSurveyResults:
        stage = this.renderIntroSurveyResults();
        break;
      case CreationStages.ElectSecretary:
        stage = this.renderElectSecretary();
        break;
      case CreationStages.WaitToElect:
        stage = this.renderWaitToElect();
        break;
      case CreationStages.ShowElectedSecretary:
        stage = this.renderShowElectedSecretary();
        break;
      case CreationStages.ReviewIssuesWithScores:
        stage = this.renderReviewIssuesWithScores();
        break;
      case CreationStages.CreateActionPlan:
        stage = this.renderCreateActionPlan();
        break;
    }

    return stage;
  }

  addActionItem() {
    const item = new CsActionItem();
    item.description = (this.$$('#actionItemInput') as TextArea).value;
    this.currentActionItem = item;
    this.actionItems = [item, ...this.actionItems];
  }

  addPoint() {
    if (this.currentActionItem) {
      const point = (this.$$('#actionPointInput') as TextArea).value;
      if (this.currentPointFor)
        this.currentActionItem.pointsFor = [
          ...this.currentActionItem.pointsFor,
          point,
        ];
      else
        this.currentActionItem.pointsAgainst = [
          ...this.currentActionItem.pointsAgainst,
          point,
        ];
      this.actionItems = [...this.actionItems];
      (this.$$('#actionPointInput') as TextArea).value = '';
    }
  }

  renderIntroStory() {
    return html`
      <div class="layout vertical center-center">
        <cs-story number="4"></cs-story>
      </div>
    `;
  }

  fakeComments = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
    'Donec non aliquam lectus. Sed quis sagittis tellus. ',
    'Donec ultrices accumsan erat eu semper. ',
    'Nullam mattis magna in lorem aliquet porta. ',
    'Sed in diam in nibh bibendum dictum eu eget tellus.',
  ];

  get randomFakeComments() {
    return;
  }

  get randomRating() {
    return (Math.floor(Math.random() * 6) + 1).toString();
  }

  renderReviewIssuesWithScores() {
    return html`
      <div class="layout vertical center-center issueContainer">
        <div class="rateIssuesHeader">${this.t('reviewIssuesWithScores')}</div>
        ${this.stockIssues.map(issue => {
          return html`
            <div
              class="issueCard shadow-elevation-4dp shadow-transition layout horizontal"
            >
              <div class="layout vertical">
                <div class="issueName">${issue}</div>
                <div class="layout horizontal">
                  <stars-rating
                    id="emoji"
                    manual
                    rating="${this.randomRating}"
                    numstars="5"
                  ></stars-rating>
                </div>
                <div class="commentsTitle">${this.t('comments')}</div>
                <div class="comments">
                  ${this.fakeComments.map(comment => {
                    return html`
                      <div class="comment">
                        ${comment}
                      </div>
                    `;
                  })}
                </div>
              </div>
            </div>
          `;
        })}
        <mwc-button
          .label="${this.t('createActionPlan')}"
          @click="${() => {
            this.stage = CreationStages.CreateActionPlan;
          }}"
          raised
        ></mwc-button>
      </div>
    `;
  }

  renderTabs() {
    return html`
      <div class="layout vertical center-center">
        <mwc-tab-bar @MDCTabBar:activated="${this._selectTab}">
          <mwc-tab
            .label="${this.t('actionPlan')}"
            icon="pending_actions"
            stacked
          ></mwc-tab>
          <mwc-tab
            .label="${this.t('information')}"
            icon="info_outlined"
            stacked
          ></mwc-tab>
          <mwc-tab
            .label="${this.t('facilitator')}"
            icon="rss_feed"
            stacked
          ></mwc-tab>
        </mwc-tab-bar>
      </div>
    `;
  }

  renderActionItems() {
    return html`
      ${this.actionItems.length == 0
        ? html` ${this.t('noActionItemsYet')} `
        : nothing}
      ${this.actionItems.map(item => {
        return html`
          <div
            class="actionCard shadow-elevation-4dp shadow-transition layout horizontal"
          >
            <div class="layout vertical">
              <div class="actionDescription">${item.description}</div>
              <div class="pointHeader" ?hidden="${item.pointsFor.length==0}">${this.t('pointsFor')}</div>
              ${item.pointsFor.map(point => {
                return html` <div class="point">${point}</div> `;
              })}
              <div class="pointHeader" ?hidden="${item.pointsAgainst.length==0}">${this.t('pointsAgainst')}</div>
              ${item.pointsAgainst.map(point => {
                return html` <div class="point">${point}</div> `;
              })}
              <div class="layout horizontal">
                <mwc-icon-button
                  icon="arrow_upward"
                  class="voteButton"
                  .label="${this.t('voteUp')}"
                ></mwc-icon-button>
                <mwc-icon-button
                  icon="arrow_downward"
                  class="voteButton"
                  .label="${this.t('voteDown')}"
                ></mwc-icon-button>
                <div class="flex"></div>
              </div>
            </div>
          </div>
        `;
      })}
    `;
  }

  renderCurrentTabPage(): TemplateResult | undefined {
    let page: TemplateResult | undefined;

    switch (this.selectedTab) {
      case TabTypes.ActionPlan:
        page = this.renderActionItems();
        break;
      case TabTypes.Information:
        page = this.renderInformation();
        break;
      case TabTypes.Facilitator:
        page = this.renderFacilitator();
        break;
    }

    return page;
  }

  _setPointForStatus(event: CustomEvent) {
    this.currentPointFor = (event.target as HTMLInputElement).checked;
  }

  _setPointAgainstStatus(event: CustomEvent) {
    this.currentPointFor = !(event.target as HTMLInputElement).checked;
  }

  _newActionItem() {
    (this.$$('#actionItemInput') as TextArea).value = '';
    this.currentActionItem = undefined;
  }

  renderFacilitator() {
    return html`
      <div class="layout vertical">
        <mwc-textarea
          charCounter
          maxLength="500"
          rows="5"
          .value="${this.currentActionItem ? this.currentActionItem.description : ''}"
          ?disabled="${this.currentActionItem != undefined}"
          id="actionItemInput"
          .label="${this.t('actionItem')}"
        ></mwc-textarea>
        <div class="layout horizontal center-center">
          <mwc-button
            raised
            ?disabled="${this.currentActionItem != undefined}"
            class="layout addNewIssueButton"
            @click="${this.addActionItem}"
            .label="${this.t('addActionItem')}"
          ></mwc-button>
          <mwc-button
            raised
            ?hidden="${this.currentActionItem == undefined}"
            class="layout newItemButton"
            @click="${this._newActionItem}"
            .label="${this.t('newItem')}"
          ></mwc-button>
        </div>
        <div ?hidden="${this.currentActionItem == null}">
          <mwc-textarea
            charCounter
            maxLength="500"
            id="actionPointInput"
            .label="${this.t('point')}"
          ></mwc-textarea>
          <div class="layout horizontal center-center">
            <mwc-formfield label="${this.t('pointFor')}">
              <mwc-radio
                value="none"
                id="mediaNone"
                ?checked="${this.currentPointFor === true}"
                @change="${this._setPointForStatus}"
                name="pointRadioButtons"
              >
              </mwc-radio>
            </mwc-formfield>

            <mwc-formfield label="${this.t('pointAgainst')}">
              <mwc-radio
                value="pointFor"
                id="pointFor"
                ?checked="${this.currentPointFor === false}"
                @change="${this._setPointAgainstStatus}"
                name="pointRadioButtons"
              >
              </mwc-radio>
            </mwc-formfield>
          </div>
          <div class="layout horizontal center-center">
            <mwc-button
              raised
              class="layout addNewIssueButton"
              @click="${this.addPoint}"
              .label="${this.t('addPoint')}"
            ></mwc-button>
          </div>
        </div>
      </div>
    `;
  }

  renderInformation() {
    return html`
      <div class="layout vertical center-center information">
        SOME BACKGROUND INFORMATION AND STATS
      </div>
    `;
  }

  renderCreateActionPlan() {
    return html`
      <div class="layout vertical center-center">
        <div class="rateIssuesHeader">${this.t('createActionPlan')}</div>
        <div class="rateIssuesInfo">${this.t('createActionPlanInfo')}</div>
        ${this.renderTabs()} ${this.renderCurrentTabPage()}
      </div>
    `;
  }

  renderWait(text: string) {
    return html`
      <div class="layout vertical center-center">
        <div
          class="waitingToStartBox layout vertical center-center shadow-elevation-12dp shadow-transition"
        >
          <div>${text}</div>
          <mwc-circular-progress-four-color
            class="spinner"
            indeterminate
          ></mwc-circular-progress-four-color>
        </div>
      </div>
    `;
  }

  renderElectSecretary() {
    return html`
      <div class="layout vertical center-center">
        <div class="electTitle">${this.t('electSecretary')}</div>
        ${this.nominees.map(name => {
          return html`
            <div
              @click="${this._electSecretary}"
              class="layout horizontal nomineeContainer shadow-elevation-2dp shadow-transition"
            >
              <div class="nomineeName">${name}</div>
              <div class="flex"></div>
              <mwc-icon-button
                icon="how_to_vote"
                class="voteButton"
                .label="${this.t('vote')}"
              ></mwc-icon-button>
            </div>
          `;
        })}
      </div>
    `;
  }

  renderShowElectedSecretary() {
    return html`
      <div class="layout vertical center-center">
        <div class="electTitle">${this.t('votingResults')}</div>
        <div
          @click="${this._electSecretary}"
          class="layout horizontal nomineeContainer shadow-elevation-2dp shadow-transition"
        >
          <div
            class="nomineeName"
            style="padding-bottom: 16px;text-align:center;"
          >
            Patric Stewart
          </div>
          <div class="flex"></div>
        </div>
      </div>
    `;
  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail?.index as number;
  }

  renderWaitToStart() {
    return this.renderWait(this.t('waitingOnEverybodyToCompleteIntro'));
  }

  renderWaitToElect() {
    return this.renderWait(this.t('waitingOnEverybodyToCompleteElect'));
  }
  renderWaitToCompleteSurvey() {
    return this.renderWait(this.t('waitingOnEverybodyToCompleteSurvey'));
  }

  _electSecretary() {
    setTimeout(() => {
      this.stage = CreationStages.WaitToElect;
      setTimeout(() => {
        this.stage = CreationStages.ShowElectedSecretary;
        setTimeout(() => {
          this.stage = CreationStages.ReviewIssuesWithScores;
        }, 3000);
      }, 3009);
    }, 400);
  }

  _ratingChanged(event: CustomEvent) {
    const value = (event.target as HTMLInputElement)?.value;
    this.rating = parseInt(value);
  }

  _answerIntroSurvey() {
    setTimeout(() => {
      this.stage = CreationStages.WaitToCompleteSurvey;
      setTimeout(() => {
        this.stage = CreationStages.IntroSurveyResults;
        setTimeout(() => {
          this.stage = CreationStages.ElectSecretary;
        }, 2500);
      }, 2500);
    }, 2500);
  }

  renderIntroSurvey() {
    return html`
      <div class="layout vertical center-center introSurvey">
        <div class="layout vertical center-center"
          <p>${this.t('howIsYourMoodToday')}</p>
          <stars-rating id="emoji" numstars="5"  manual @click="${
            this._answerIntroSurvey
          }"></stars-rating>
        </div>
      </div>
    `;
  }

  renderIntroSurveyResults() {
    return html`
      <div class="layout vertical center-center introSurvey">
        <div class="layout vertical center-center"
          <p class="ourMood">${this.t('ourMood')}</p>
          <stars-rating id="emojiLarge" readonly numstars="5" rating="4"></stars-rating>
        </div>
      </div>
    `;
  }

  render() {
    return html` ${this.renderCurrentStage()}`;
  }

  _lastStoryCard() {
    this.stage = CreationStages.WaitToStart;
    setTimeout(() => {
      this.stage = CreationStages.IntroSurvey;
    }, 2000);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addListener('cs-last-story-card', this._lastStoryCard.bind(this));
    setTimeout(() => {
      this.fire('yp-change-header', {
        headerTitle: this.t('createActionPlan'),
        documentTitle: this.t('createActionPlan'),
        headerDescription: '',
      });
    }, 500);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener('cs-last-story-card', this._lastStoryCard.bind(this));
  }

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        mwc-button {
          margin-top: 16px;
        }

        .spinner {
          margin: 32px;
        }

        .introSurvey {
          margin-top: 64px;
          font-size: 22px;
        }

        .theme-blue {
          --star-rating-unselected-color: #777;
        }

        mwc-circular-progress-four-color {
          --mdc-circular-progress-bar-color-1: #2196f3;
          --mdc-circular-progress-bar-color-2: #e91e63;
          --mdc-circular-progress-bar-color-3: #ffc107;
          --mdc-circular-progress-bar-color-4: #03dac5;
        }

        #emoji,
        #emojiLarge {
          --start-unicoder: '❤️';
          --start-unicode: '🙂';
          --star-size: 1em;
          cursor: pointer;
        }

        #emojiLarge {
          --star-size: 1.1em;
        }

        .ourMood {
          font-size: 24px;
        }

        .waitingToStartBox {
          background-color: var(--mdc-theme-surface);
          padding: 16px;
          margin: 32px;
          max-width: 320px;
        }

        .issueCard {
          background-color: var(--mdc-theme-surface);
          margin: 8px;
          width: 450px;
          padding: 8px;
          max-width: 300px;
        }

        .actionCard {
          background-color: var(--mdc-theme-surface);
          margin: 8px;
          width: 550px;
          padding: 16px;
          max-width: 300px;
        }

        .electTitle {
          margin-top: 24px;
          font-size: 24px;
          margin-bottom: 16px;
        }

        .nomineeContainer {
          width: 250px;
          background-color: var(--mdc-theme-surface);
          font-size: 18px;
          margin-bottom: 16px;
          padding-left: 16px;
          padding-top: 16px;
        }

        .voteButton {
          padding-bottom: 8px;
          padding-top: 0;
        }

        .nomineeContainer {
          cursor: pointer;
        }

        .actionDescription {
          padding-top: 8px;
          padding-bottom: 8px;
        }

        .rateIssuesHeader {
          font-size: 22px;
          margin-top: 32px;
          margin-bottom: 8px;
        }

        .rateIssuesInfo {
          font-size: 14px;
          max-width: 280px;
          margin-bottom: 16px;
        }

        .comments {
          padding: 8px;
        }

        .comment {
          color: #555;
          padding-bottom: 4px;
        }

        .commentsTitle {
          padding: 8px;
          margin-top: 8px;
          font-style: italic;
        }

        .information {
          margin: 32px;
        }

        mwc-tab-bar {
          margin-bottom: 16px;
        }

        mwc-textarea {
          width: 420px;
        }

        .point {
          color: #555;
          padding-bottom: 4px;
        }

        .pointHeader {
          font-style: italic;
          margin-bottom: 8px;
          margin-top: 8px;
        }

        mwc-button {
          margin-top: 8px;
          margin-bottom: 16px;
        }

        .newItemButton {
          margin-left: 16px;
        }
      `,
    ];
  }
}
