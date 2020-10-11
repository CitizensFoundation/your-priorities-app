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
import '@material/mwc-circular-progress-four-color';
import '../cs-story/cs-story.js';

import '@manufosela/stars-rating';

import 'app-datepicker';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';

export const CreationStages: Record<string, number> = {
  IntroStory: 0,
  WaitToStart: 1,
  IntroSurvey: 2,
  WaitToCompleteSurvey: 3,
  IntroSurveyResults: 4,
  ElectSecretary: 5,
  WaitToElect: 6,
  ShowElectedSecretary: 7,
  AddAndRateIssues: 8,
  FinalIssues: 9,
  NextMeeting: 10,
};

@customElement('cs-create-actoin-plan')
export class CsCreateIssues extends YpBaseElement {
  @property({ type: Number })
  stage = CreationStages.IntroStory;

  @property({ type: Number })
  rating: number | undefined;

  @property({ type: Array })
  issues: Array<string> = [];

  nominees = [
    'John Travolta',
    'Nicole Kidman',
    'Robert De Niro',
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
    'Honest and transparent staff (in terms of dealing with drugs, food, etc'
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
      case CreationStages.AddAndRateIssues:
        stage = this.renderAddAndRateIssues();
        break;
    }

    return stage;
  }

  addIssue(issue: string) {
    this.issues = [...this.issues, issue];
  }

  renderIntroStory() {
    return html`
      <div class="layout vertical center-center">
        <cs-story number="2"></cs-story>
      </div>
    `;
  }

  renderAddAndRateIssues() {
    return html`
      <div class="layout vertical center-center">
        <div class="rateIssuesHeader">${this.t('addAndRateIssues')}</div>
        <div class="rateIssuesInfo">${this.t('addAndRateIssuesIntro')}</div>
        ${this.issues.map(issue => {
          return html`
            <div class="issueCard shadow-elevation-4dp shadow-transition layout horizontal">
              <div class="layout vertical">
                <div class="issueName">${issue}</div>
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
            Meryl Streep
          </div>
          <div class="flex"></div>
        </div>
      </div>
    `;
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
          this.stage = CreationStages.AddAndRateIssues;
          setTimeout(() => {
            this.addIssue(this.stockIssues[0]);
            setTimeout(() => {
              this.addIssue(this.stockIssues[1]);
              setTimeout(() => {
                this.addIssue(this.stockIssues[2]);
                setTimeout(() => {
                  this.addIssue(this.stockIssues[3]);
                  setTimeout(() => {
                    this.addIssue(this.stockIssues[4]);
                    setTimeout(() => {
                      this.addIssue(this.stockIssues[5]);
                      setTimeout(() => {
                        this.addIssue(this.stockIssues[6]);
                        setTimeout(() => {
                          this.addIssue(this.stockIssues[7]);
                          setTimeout(() => {
                            this.addIssue(this.stockIssues[8]);
                            setTimeout(() => {
                              this.addIssue(this.stockIssues[9]);
                            }, 4200);
                          }, 4200);
                        }, 4200);
                      }, 4200);
                    }, 4200);
                  }, 4200);
                }, 4200);
              }, 4200);
            }, 4500);
          }, 3500);
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
        headerTitle: this.t('createScorecard'),
        documentTitle: this.t('createScorecard'),
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
          width: 300px;
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

        .issueName {
          padding: 16px;
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
      `,
    ];
  }
}
