/* eslint-disable @typescript-eslint/camelcase */
import { property, html, css, LitElement, customElement } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
//import { ifDefined } from 'lit-html/directives/if-defined';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';

import '@material/mwc-textfield';
import '@material/mwc-textarea';
import { YpServerApi } from '../@yrpri/YpServerApi.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { runInThisContext } from 'vm';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';
import { YpFormattingHelpers } from '../@yrpri/YpFormattingHelpers.js';

export const ProjectsTabTypes: Record<string, number> = {
  Current: 0,
  Archived: 1,
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
  selectedTab = ProjectsTabTypes.Current;

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
  saved = false

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

        .header {
          height: 100px;
          font-size: var(--mdc-typegraphy-headline1-font-size, 24px);
        }

        .project {
          background-color: var(--mdc-theme-surface, #fff);
          color: var(--mdc-theme-on-surface);
          padding: 16px;
          margin: 16px;
          width: 960px;
        }

        .name {
          font-weight: bold;
          margin-bottom: 16px;
        }
      `,
    ];
  }


  renderEdit() {
    return html`verttical">
        <mwc-textfield .label="${this.t('projectName')}" .value="${this.project.name}"></mwc-textfield>
        <mwc-textarea .label="${this.t('projectDescription')}" .value="${this.project.description}"></mwc-textarea>
        <div class="rounds layout vertical">
          ${ this.coreQuestions.map( (question: CsQuestion, index: number) => html`
            <div class="date">${index+1}. ${YpFormattingHelpers.formatDate(round.created_at)}</div>
          `)}
        </div>
      </div>
    `;
  }

  renderProjectRounds() {
    return html`
      <div class="rounds layout vertical">
        ${ this.rounds.map( (round: CsProjectRoundData, index: number) => html`
          <div class="date">${index+1}. ${YpFormattingHelpers.formatDate(round.created_at)}</div>
        `)}
      </div>
    `;
  }

  render() {
    return html`
      ${this.renderEdit()} ${ this.saved ? this.renderProjectRounds() : nothing}
    `;
  }

  createProject() {
    YpNavHelpers.redirectTo(`/project/new`);
  }

  // EVENTS

  updated(changedProperties: Map<string | number | symbol, unknown>) {
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
      this._getCollection();
      this._getHelpPages();
    }
  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail?.index as number;
  }

  _setSelectedTabFromRoute(routeTabName: string): void {
    let tabNumber;

    switch (routeTabName) {
      case 'current':
        tabNumber = ProjectsTabTypes.Current;
        break;
      case 'archived':
        tabNumber = ProjectsTabTypes.Archived;
        break;
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
