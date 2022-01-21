import { property, html, css, LitElement, customElement } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
//import { ifDefined } from 'lit-html/directives/if-defined';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';

import '@material/mwc-tab-bar';
import '@material/mwc-fab';
import '@material/mwc-icon';
import '@material/mwc-button';
import '@material/mwc-textarea';

import '../cs-story/cs-story.js';
import '@manufosela/stars-rating';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import Chart from 'chart.js';

@customElement('cs-score')
export class CsScore extends YpBaseElement {
  @property({ type: Boolean })
  storyOpen = true;

  @property({ type: Boolean })
  reviewOpen = true;

  @property({ type: Number })
  selectedTab = 0;

  @property({ type: Array })
  stockIssues = [
    'Attitute of staff',
    'Affordability of services',
    'Availability of medicine',
    'Distance to health centre',
    'Equal access to the health services for all community members',
    'Punctuality of staff',
    'Polite behavior',
    "Listening to patients' problems",
    'Honest and transparent staff (in terms of dealing with drugs, food, etc)',
  ];

  _answerIntroSurvey() {
    //TODO
  }

  renderTabs() {
    return html`
      <div class="layout vertical center-center">
        <mwc-tab-bar @MDCTabBar:activated="${this._selectTab}">
          <mwc-tab
            .label="${this.t('serviceProviderAnswers')}"
            icon="comment"
            stacked
          ></mwc-tab>
          <mwc-tab
            .label="${this.t('information')}"
            icon="info_outlined"
            stacked
          ></mwc-tab>
          <mwc-tab
            .label="${this.t('analytics')}"
            icon="equalizer"
            stacked
          ></mwc-tab>
        </mwc-tab-bar>
      </div>
    `;
  }

  renderAnalytics() {
    return html`
    <div class="layout vertical center-center">
      <canvas id="line-chart-1" width="800" height="400"></canvas>
      <canvas id="line-chart-2" width="800" height="400"></canvas>
      <canvas id="line-chart-3" width="800" height="400"></canvas>
      <canvas id="line-chart-4" width="800" height="400"></canvas>
      <canvas id="line-chart-5" width="800" height="400"></canvas>
      <canvas id="line-chart-6" width="800" height="400"></canvas>
      <canvas id="line-chart-7" width="800" height="400"></canvas>
      <canvas id="line-chart-8" width="800" height="400"></canvas>
      <canvas id="line-chart-9" width="800" height="400"></canvas>
    </div>
    `;
  }


  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail?.index as number;
  }


  renderCurrentTabPage(): TemplateResult | undefined {
    let page: TemplateResult | undefined;

    switch (this.selectedTab) {
      case 0:
        page = this.renderAnswers();
        break;
      case 1:
        page = this.renderInformation();
        break;
      case 2:
        page = this.renderAnalytics();
        break;
      }

    return page;
  }

  renderInformation() {
    return html`
      <h1>Some information and links</h1>
    `
  }

  renderAnswers() {
    return html`
      ${this.stockIssues.map(issue => {
        return html`
                    <div
                      class="issueCard shadow-elevation-4dp shadow-transition layout horizontal"
                    >
                      <div class="layout vertical">
                        <div class="issueName">${issue}</div>
                        <div class="layout vertical">
                          <p><em>Answer from Service Provider 1</em></br>
                          Answer....</p>
                          <p><em>Answer from Service Provider 2</em></br>
                          Answer....</p>
                          <p><em>Answer from Service Provider 3</em></br>
                          Answer....</p>
                          <p><em>Answer from Service Provider 4</em></br>
                          Answer....</p>
                        </div>
                      </div>
                    </div>
                  `;
      })}
    `;
  }

  render() {
    return html`
      ${this.storyOpen
        ? html`
            <div class="layout vertical center-center">
              <cs-story number="3"></cs-story>
            </div>
          `
        : html`
            <div class="layout vertical center-center issueContainer">
              ${this.reviewOpen
                ? html`
                    ${this.renderTabs()} ${this.renderCurrentTabPage()}
                    <div class="layout horizontal center-center">
                      <mwc-button
                        .label="${this.t('startScoring')}"
                        @click="${() => {
                          this.reviewOpen = false;
                        }}"
                        raised
                      ></mwc-button>
                    </div>
                  `
                : html`
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
                                numstars="5"
                                manual
                                @click="${this._answerIntroSurvey}"
                              ></stars-rating>
                            </div>
                            <mwc-textarea
                              .label="${this.t('reason')}"
                              maxLength="250"
                              charCounter
                            ></mwc-textarea>
                          </div>
                        </div>
                      `;
                    })}
                  `}
            </div>
          `}
    `;
  }

  get randomRating() {
    return (Math.floor(Math.random() * 6) + 1).toString();
  }

  async updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('selectedTab')) {
      if (this.selectedTab==2) {
        await this.requestUpdate();
        this.setupChart(1,this.stockIssues[0]);
        this.setupChart(2,this.stockIssues[1]);
        this.setupChart(3,this.stockIssues[2]);
        this.setupChart(4,this.stockIssues[3]);
        this.setupChart(5,this.stockIssues[4]);
        this.setupChart(6,this.stockIssues[5]);
        this.setupChart(7,this.stockIssues[6]);
        this.setupChart(8,this.stockIssues[7]);
        this.setupChart(9,this.stockIssues[8]);
      }
    }
  }


  randomScalingFactor(): number {
    return Math.trunc((Math.round(Math.random() * 5)));
  }

  setupChart (number: number, title: string) {
    const lineChartElement = this.shadowRoot!.getElementById(`line-chart-${number}`);
    const config = {
			type: 'line',
			data: {
				labels: ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6', 'Round 7'],
				datasets: [{
					label: this.t('communityScore'),
					backgroundColor: "#FFF",
          borderColor: "#000",
          beginAtZero: true,
					data: [
						this.randomScalingFactor(),
						this.randomScalingFactor(),
						this.randomScalingFactor(),
						this.randomScalingFactor(),
						this.randomScalingFactor(),
						this.randomScalingFactor(),
						this.randomScalingFactor()
					],
					fill: false,
        }
      ]
			},
			options: {
        responsive: false,
        elements: {
          line: {
              tension: 0.1
          }
        },
				title: {
					display: true,
          text: title,
          fontSize: 20
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: false,
							labelString: 'Rounds'
						},
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Score'
            },
            ticks: {
              beginAtZero: true,
              stepSize: 1,
          }
					}]
				}
			}
    };

    if (this.charts[number]) {
//      this.charts.destroy();
    }

    this.charts[number] = new Chart(lineChartElement as HTMLCanvasElement, config as any);
  }

  charts: Record<number, Chart> = {}

  async _lastStoryCard() {
    //this.fire('yp-unhide-app-bar');
    this.storyOpen = false;
    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addListener('cs-last-story-card', this._lastStoryCard.bind(this));
    setTimeout(() => {
      this.fire('yp-change-header', {
        headerTitle: this.t('scoreIssues'),
        documentTitle: this.t('scoreIssues'),
        headerDescription: '',
      });
    }, 500);

    //this.fire('yp-hide-app-bar');
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
        #emoji,
        #emojiLarge {
          --start-unicoder: '❤️';
          --start-unicode: '🙂';
          --star-size: 0.9em;
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
          padding: 16px;
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
          font-weight: bold;
          margin-bottom: 8px;
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

        mwc-textarea {
          margin-top: 16px;
          width: 300px;
          margin-bottom: 16px;
        }

        .issueContainer {
          margin-top: 24px;
        }

        mwc-button {
          margin: 32px;
        }

        mwc-tab-bar {
          margin-bottom: 16px;
        }
      `,
    ];
  }
}
