/* eslint-disable @typescript-eslint/camelcase */
import { property, html, css, LitElement, customElement } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
//import { ifDefined } from 'lit-html/directives/if-defined';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';

import '@material/mwc-textfield';
import '@material/mwc-textarea';
import '@material/mwc-button';

import Chart from 'chart.js';

import { YpServerApi } from '../@yrpri/YpServerApi.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';
import { YpFormattingHelpers } from '../@yrpri/YpFormattingHelpers.js';

export const ProjectTabTypes: Record<string, number> = {
  Information: 0,
  Analytics: 1,
  Activities: 2
};

@customElement('cs-project')
export class CsProject extends YpBaseElement {
  @property({ type: Boolean })
  noHeader = false;

  @property({ type: Boolean })
  tabsHidden = false;

  @property({ type: Number })
  domainId: number | undefined;

  @property({ type: Object })
  community: YpCommunityData | undefined;

  @property({ type: String })
  subRoute: string | undefined;

  @property({ type: Number })
  selectedTab = ProjectTabTypes.Information;

  @property({ type: Array })
  projects: Array<CsProjectData> | undefined;

  @property({ type: Boolean })
  hideNewsfeed = false;

  @property({ type: Boolean })
  locationHidden = false;

  @property({ type: Boolean })
  hideCollection = false;

  @property({ type: String })
  createFabIcon: string | undefined;

  @property({ type: String })
  createFabLabel: string | undefined;

  @property({ type: Boolean })
  saved = false;

  @property({ type: Array })
  rounds: Array<CsProjectRoundData> = [];

  @property({ type: Array })
  coreIssues: Array<CsIssueData> = [];

  chart: Chart | undefined;

  charts: Record<number, Chart> = {}

  collectionType: string;
  collectionItemType: string;

  project: CsProjectData = {
    id: 3,
    user_id: 1,
    name: '',
    description: '',
    created_at: new Date(),
    updated_at: new Date(),
  };

  archivedProjects: Array<CsProjectData> = [
    {
      id: 1,
      user_id: 1,
      name: 'Project 1',
      description: 'Project 1 description',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      user_id: 1,
      name: 'Project 2',
      description: 'Project 2 description',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  constructor() {
    super();
    this.collectionType = 'community';
    this.collectionItemType = 'project';

    //TODO: Fix this as it causes loadMoreData to be called twice on post lists at least
    // this.addGlobalListener('yp-logged-in', this._getCollection.bind(this));
    this.addGlobalListener('yp-got-admin-rights', this.refresh.bind(this));

    this.community = {
      id: 1,
      name: 'ARIS',
      description: '',
      hostname: '',
      domain_id: 1,
      only_admins_can_create_groups: true,
      configuration: {
        disableDomainUpLink: false,
        forceSecureSamlLogin: false,
      },
      counter_communities: 0,
      counter_points: 0,
      counter_posts: 0,
      counter_users: 0,
      Domain: {
        id: 1,
        name: '',
        domain_name: '',
        only_admins_can_create_communities: false,
        Communities: [],
        counter_points: 0,
        counter_posts: 0,
        counter_users: 0,
        configuration: {},
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();

    setTimeout(() => {
      this.fire('yp-change-header', {
        headerTitle: this.t('newProject'),
        documentTitle: this.t('newProject'),
        headerDescription: '',
      });
    }, 500);
  }

  // DATA PROCESSING

  refresh(): void {
    console.error('REFRESH');
    if (this.community) {
      if (this.community.default_locale != null) {
        window.appGlobals.changeLocaleIfNeeded(this.community.default_locale);
      }

      if (this.community.theme_id !== undefined) {
        window.appGlobals.theme.setTheme(this.community.theme_id);
      }

      this.fire('yp-set-home-link', {
        type: this.collectionType,
        id: this.community.id,
        name: this.community.name,
      });

      this.fire('yp-change-header', {
        headerTitle: null,
        documentTitle: this.community.name,
        headerDescription:
          this.community.description || this.community.objectives,
      });

      if (this.community.configuration?.hideAllTabs) {
        this.tabsHidden = true;
      } else {
        this.tabsHidden = false;
      }
    }
  }

  async _getCollection() {
    if (this.domainId) {
      this.community = undefined;
      this.projects = undefined;
      this.community = (await window.serverApi.getCollection(
        this.collectionType,
        this.domainId
      )) as YpCommunityData | undefined;
      this.refresh();
    } else {
      console.error('No community id for _getCollection');
    }
  }

  async _getHelpPages() {
    if (this.domainId) {
      const helpPages = (await window.serverApi.getHelpPages(
        this.collectionType,
        this.domainId
      )) as Array<YpHelpPage> | undefined;
      if (helpPages) {
        this.fire('yp-set-pages', helpPages);
      }
    } else {
      console.error('Collection id setup for get help pages');
    }
  }

  get collectionTabLabel(): string {
    const translatedCollectionItems = this.t(
      YpServerApi.transformCollectionTypeToApi(this.collectionItemType)
    );
    return `${translatedCollectionItems} (${
      this.projects ? this.projects.length : 0
    })`;
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
					text: title
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

  // UI

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        mwc-fab {
          position: fixed;
          bottom: 16px;
          right: 16px;
        }

        mwc-tab-bar {
          width: 960px;
          margin-bottom: 16px;
        }

        .name {
          font-weight: bold;
          margin-bottom: 16px;
        }

        .editBox {
          max-width: 960px;
          margin-top: 32px;
        }

        mwc-textfield,
        mwc-textarea {
          margin-bottom: 16px;
          width: 450px;
        }

        .coreIssuesTitle,
        .roundsTitle {
          font-size: var(--mdc-typography-headline1-font-size);
          font-weight: var(--mdc-typography-headline1-font-weight);
          margin-bottom: 16px;
          margin-top: 16px;
        }

        .issues, .rounds {
          font-size: var(--mdc-typography-body-font-size);
          font-weight: var(--mdc-typography-body-font-weight);
          max-width: 450px;
          width: 450px;
        }

        .issue {
          padding: 16px;
          margin-top: 16px;
          background-color: var(--mdc-theme-surface);
          color: var(--mdc-theme-on-surface);
        }

        .saveButton {
          margin-top: 32px;
          --mdc-theme-on-primary: var(--mdc-theme-on-secondary);
          --mdc-theme-primary: var(--mdc-theme-secondary);
          width: 200px;
          margin-bottom: 32px;
        }

        #newRoundDateInput {
          width: 150px;
        }

        .round {
          background-color: var(--mdc-theme-surface);
          color: var(--mdc-theme-on-surface);
          padding: 16px;
          margin-top: 16px;
          font-size: var(--mdc-typography-headline2-font-size);
          font-weight: var(--mdc-typography-headline2-font-weight);
        }

        .newRoundButton {
          margin-left: 16px;
          --mdc-theme-on-primary: var(--mdc-theme-on-secondary);
          --mdc-theme-primary: var(--mdc-theme-secondary);
        }

        .addNewIssueButton {
          margin-bottom: 32px;
        }

        a {
          text-decoration: none;
        }

        canvas {
          margin-top: 32px;
        }
      `,
    ];
  }

  addIssue() {
    this.coreIssues = [
      ...this.coreIssues,
      {
        id: 5,
        user_id: 1,
        type: 'core',
        counter_flags: 0,
        counter_endorsements_down: 0,
        counter_points: 0,
        counter_endorsements_up: 0,
        created_at: new Date(),
        updated_at: new Date(),
        content: (this.$$('#coreIssueInput') as HTMLInputElement).value,
      },
    ];

    (this.$$('#coreIssueInput') as HTMLInputElement).value = '';
  }

  addRound() {
    this.rounds = [
      ...this.rounds,
      {
        id: 5,
        user_id: 1,
        cs_project_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        starts_at: new Date(),
        ends_at: new Date(),
      },
    ];
  }

  renderTabs() {
    if (!this.tabsHidden) {
      return html`
        <div class="layout vertical center-center">
          <mwc-tab-bar @MDCTabBar:activated="${this._selectTab}">
            <mwc-tab
              .label="${this.t('information')}"
              icon="groups"
              stacked
            ></mwc-tab>
            <mwc-tab
              .label="${this.t('analytics')}"
              icon="equalizer"
              stacked
            ></mwc-tab>
            <mwc-tab
              .label="${this.t('activities')}"
              icon="rss_feed"
              stacked
            ></mwc-tab>
          </mwc-tab-bar>
        </div>
      `;
    } else {
      return nothing;
    }
  }

  renderIssues() {
    return html`
      <div class="layout vertical center-center">
        <div class="issues ">
          ${this.coreIssues.map(
            (issue: CsIssueData, index: number) => html`
              <div class="issue  shadow-elevation-2dp shadow-transition">${index + 1}. ${issue.content}</div>
            `
          )}
        </div>
      </div>
    `;
  }

  renderEdit() {
    return html`<div class="layout vertical center-center">
      <div class="layout vertical editBox">
        <div class="layout vertical center-center">
          <div class="layout vertical">
            <mwc-textfield
              charCounter
              id="projectName"
              maxLength="60"
              .label="${this.t('projectName')}"
              .value="${this.project.name}"
            ></mwc-textfield>
            <mwc-textarea
              rows="3"
              charCounter
              maxLength="300"
              .label="${this.t('projectDescription')}"
              .value="${this.project.description}"
            ></mwc-textarea>
          </div>
          <div>
            <div class="layout horizontal center-center coreIssuesTitle">
              ${this.t('coreIssues')}
            </div>
            <div class="layout vertical">
              <mwc-textarea
                ?hidden="${this.saved}"
                charCounter
                maxLength="200"
                id="coreIssueInput"
                .label="${this.t('coreIssue')}"
              ></mwc-textarea>
              <div class="layout horizontal center-center">
                <mwc-button raised
                  ?hidden="${this.saved}"
                  class="layout addNewIssueButton"
                  @click="${this.addIssue}"
                  .label="${this.t('addCoreIssue')}"
                ></mwc-button>
              </div>
            </div>
            ${this.renderIssues()}
          </div>
        </div>
        <div class="layout horizontal center-center">
          <mwc-button
            raised
            class="saveButton"
            ?hidden="${this.saved}"
            @click="${() => {
              this.saved = true;
            }}"
            .label="${this.t('save')}"
          ></mwc-button>
        </div>
      </div>
    </div> `;
  }

  renderAnalytics() {
    return html`
    <div class="layout vertical center-center">
      <canvas id="line-chart-1" width="800" height="400"></canvas>
      <canvas id="line-chart-2" width="800" height="400"></canvas>
      <canvas id="line-chart-3" width="800" height="400"></canvas>
    </div>
    `;
  }

  renderCurrentTabPage(): TemplateResult | undefined {
    let page: TemplateResult | undefined;

    switch (this.selectedTab) {
      case ProjectTabTypes.Information:
        page = this.renderInformation();
        break;
      case ProjectTabTypes.Analytics:
        page = this.renderAnalytics();
        break;
    }

    return page;
  }

  renderProjectRounds() {
    return html`
      <div class="layout vertical center-center">
        <div class="layout horizontal center-center roundsTitle">
          ${this.t('projectRounds')}
        </div>
        <div class="layout horizontal">
          <mwc-button
            class="newRoundButton"
            @click="${this.addRound}"
            raised
            .label="${this.t('addNewRound')}"
          ></mwc-button>
        </div>
        <div class="rounds layout vertical">
          ${this.rounds.map(
            (round: CsProjectRoundData, index: number) => html`
              <a @click="${this.gotoRound}" href="/round/1"
                ><div
                  class="layout vertical round shadow-elevation-2dp shadow-transition"
                >
                  <div>
                    ${(this.$$('#projectName') as HTMLInputElement).value}
                  </div>
                  <div class="">
                    ${this.t('round')} ${index + 1} -
                    ${YpFormattingHelpers.formatDate(round.starts_at)}
                  </div>
                </div></a
              >
            `
          )}
        </div>
      </div>
    `;
  }

  renderInformation() {
    return html`${this.renderEdit()} ${this.saved ? this.renderProjectRounds() : nothing}`;
  }

  render() {
    return html`
      ${this.renderTabs()} ${this.renderCurrentTabPage()}
    `;
  }

  createProject() {
    YpNavHelpers.redirectTo(`/project/new`);
  }

  // EVENTS

  gotoRound(event: CustomEvent) {
    event.preventDefault();
    YpNavHelpers.redirectTo('/round/1');
  }


  async updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('subRoute') && this.subRoute) {
      const splitSubRoute = this.subRoute.split('/');
      this.domainId = parseInt(splitSubRoute[1]);
      if (splitSubRoute.length > 2) {
        this._setSelectedTabFromRoute(splitSubRoute[1]);
      } else {
        this._setSelectedTabFromRoute('default');
      }
    }

    if (changedProperties.has('domainId') && this.domainId) {
      //this._getCollection();
      //this._getHelpPages();
    }


    if (changedProperties.has('selectedTab')) {
      if (this.selectedTab==ProjectTabTypes.Analytics) {
        await this.requestUpdate();
        this.setupChart(1,'Hospitals are clean');
        this.setupChart(2,'Hospitals are 1');
        this.setupChart(3,'Hospitals are 2');
      }
    }
  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail?.index as number;
  }

  async _setSelectedTabFromRoute(routeTabName: string) {
    let tabNumber;

    switch (routeTabName) {
      case 'current':
        tabNumber = ProjectTabTypes.Information;
        break;
      case 'analytics':
        tabNumber = ProjectTabTypes.Analytics;
        break;
      default:
        tabNumber = ProjectTabTypes.Information;
    }

    if (tabNumber) {
      this.selectedTab = tabNumber;
      window.appGlobals.activity(
        'open',
        this.collectionType + '_tab_' + routeTabName
      );
    }
  }
}
