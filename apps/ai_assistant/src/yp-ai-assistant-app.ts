import { html, css, nothing } from 'lit';
import { property, customElement, query } from 'lit/decorators.js';

import '@material/web/navigationbar/navigation-bar.js';
import '@material/web/navigationtab/navigation-tab.js';
import '@material/web/iconbutton/filled-link-icon-button.js';
import '@material/web/navigationdrawer/navigation-drawer.js';
import '@material/web/list/list-item.js';
//import '@material/web/list/list-item-icon.js';
import '@material/web/list/list.js';
//import '@material/web/list/list-divider.js';
import {
  argbFromHex,
  themeFromSourceColor,
  applyTheme,
} from '@material/material-color-utilities';

import '@material/web/menu/menu.js';
import { cache } from 'lit/directives/cache.js';

import './@yrpri/common/yp-image.js';
import { YpBaseElement } from './@yrpri/common/yp-base-element.js';

import './chat/yp-chat-assistant.js';
import { Layouts } from './flexbox-literals/classes.js';

import './posts/yp-posts-dialog.js';
import { YpPostsDialog } from './posts/yp-posts-dialog.js';

const PagesTypes = {
  Analytics: 1,
  Campaign: 2,
  EmailLists: 3,
  AiAnalysis: 4,
  Settings: 5,
  Chat: 6,
};

declare global {
  interface Window {
    appGlobals: any;
  }
}

@customElement('yp-ai-assistant-app')
export class YpAiAssistantApp extends YpBaseElement {
  @property({ type: Number })
  pageIndex = 6;

  @property({ type: String })
  lastSnackbarText: string | undefined;

  @property({ type: String })
  collectionType = 'domain';

  @property({ type: String })
  currentError: string | undefined;

  @property({ type: String })
  themeColor = '#013B70';

  @query('#postsDialogs')
  postsDialogs!: YpPostsDialog;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupEventListeners();

    const savedColor = localStorage.getItem('md3-yrpri-promotion-color');
    if (savedColor) {
      this.fireGlobal('yp-theme-color', savedColor);
    }

    setTimeout(()=>{
      const simplePosts = [
        {
          id: 72961,
          emojiSummary: '',
          name: 'How to get more traffic to your website',
          description: 'Learn how to get more traffic to your website',
          imageUrl: 'https://www.yrpri.com/wp-content/uploads/2020/10/traffic.jpg',
          oneWordSummary: 'Helló',
        },
        {
          id: 72248,
          name: 'How to get more traffic to your website',
          emojiSummary: '',
          description: 'Learn how to get more traffic to your website',
          imageUrl: 'https://www.yrpri.com/wp-content/uploads/2020/10/traffic.jpg',
          oneWordSummary: 'Helló',
        },
        {
          id: 72369,
          emojiSummary: '',
          name: 'How to get more traffic to your website',
          description: 'Learn how to get more traffic to your website',
          imageUrl: 'https://www.yrpri.com/wp-content/uploads/2020/10/traffic.jpg',
          oneWordSummary: 'Helló',
        },
        {
          id: 74170,
          emojiSummary: '',
          name: 'How to get more traffic to your website',
          description: 'Learn how to get more traffic to your website',
          imageUrl: 'https://www.yrpri.com/wp-content/uploads/2020/10/traffic.jpg',
          oneWordSummary: 'Helló',
        },
        {
          id: 70976,
          emojiSummary: '',
          name: 'How to get more traffic to your website',
          description: 'Learn how to get more traffic to your website',
          imageUrl: 'https://www.yrpri.com/wp-content/uploads/2020/10/traffic.jpg',
          oneWordSummary: 'Helló',
        },
        {
          id: 73121,
          name: 'How to get more traffic to your website',
          description: 'Learn how to get more traffic to your website',
          imageUrl: 'https://www.yrpri.com/wp-content/uploads/2020/10/traffic.jpg',
          emojiSummary: '',
          oneWordSummary: 'Helló',
        },
        {
          id: 73595,
          name: 'How to get more traffic to your website',
          emojiSummary: '',
          description: 'Learn how to get more traffic to your website',
          imageUrl: 'https://www.yrpri.com/wp-content/uploads/2020/10/traffic.jpg',
          oneWordSummary: 'Helló',
        },
        {
          id: 73515,
          emojiSummary: '',
          name: 'How to get more traffic to your website',
          description: 'Learn how to get more traffic to your website',
          imageUrl: 'https://www.yrpri.com/wp-content/uploads/2020/10/traffic.jpg',
          oneWordSummary: 'Helló',
        },
      ];

      this.postsDialogs.open(simplePosts as YpSimplePost[], 3);
    }, 5000)
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeEventListeners();
  }

  themeChanged(target: HTMLElement | undefined = undefined) {
    const theme = themeFromSourceColor(argbFromHex(this.themeColor), [
      {
        name: 'custom-1',
        value: argbFromHex('#013B70'),
        blend: true,
      },
    ]);

    this.themeColor = '#013B70';

    // Check if the user has dark mode turned on
    const systemDark =
      this.themeDarkMode === undefined
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : this.themeDarkMode;

    // Apply the theme to the body by updating custom properties for material tokens
    applyTheme(theme, { target: target || this, dark: systemDark });
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
      this.pageIndex = 4;
    }
  }

  exitToMainApp() {
    window.location.href = `/`;
  }

  async _displaySnackbar(event: CustomEvent) {
    this.lastSnackbarText = event.detail;
    await this.updateComplete;
    //(this.$$('#snackbar') as Snackbar).show();
  }

  _setupEventListeners() {
    this.addListener('app-error', this._appError);
    this.addListener('display-snackbar', this._displaySnackbar);
  }

  _removeEventListeners() {
    this.removeListener('display-snackbar', this._displaySnackbar);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (
      changedProperties.has('themeColor') ||
      changedProperties.has('themeDarkMode')
    ) {
      this.themeChanged(document.body);
    }
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
    this.fireGlobal('yp-theme-color', event.detail.value);
  }

  static get styles() {
    return [
      //      super.styles,
      Layouts,
      css`
        :host {
          width: 100vw;
          height: 100vh;
          background-color: var(--md-sys-color-surface, #fefefe);
        }

        body {
          background-color: var(--md-sys-color-surface, #fefefe);
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
          margin-left: 16px;
          width: 100%;
        }

        md-list-item {
          --md-list-list-item-container-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          --md-list-list-item-label-text-color: var(--md-sys-color-on-surface);
        }

        .selectedContainer {
          --md-list-list-item-container-color: var(
            --md-sys-color-secondary-container
          );
          color: var(--md-sys-color-on-secondary-container);
          --md-list-list-item-label-text-color: var(
            --md-sys-color-on-secondary-container
          );
        }

        md-navigation-drawer {
          --md-navigation-drawer-container-color: var(--md-sys-color-surface);
        }

        md-list {
          --md-list-container-color: var(--md-sys-color-surface);
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
          width: 120px;
          height: 68px;
          margin-right: 16px;
          margin-left: 16px;
        }

        .mainPageContainer {
          margin-top: 16px;
        }

        yp-promotion-dashboard {
          max-width: 1100px;
        }
      `,
    ];
  }

  _renderPage() {
    if (this.adminConfirmed) {
      switch (this.pageIndex) {
        case PagesTypes.EmailLists:
          return html`
            ${cache(html`<yp-email-templates> </yp-email-templates>`)}
          `;
        case PagesTypes.Chat:
          return html`<yp-chat-assistant></yp-chat-assistant>`;

        case PagesTypes.Campaign:
        case PagesTypes.AiAnalysis:
        case PagesTypes.Analytics:
          return html`Not in this hackathon template`;
        case PagesTypes.Settings:
          return html`
            ${cache(html`<yp-promotion-settings
              .collectionType="${this.collectionType}"
              @color-changed="${this._settingsColorChanged}"
            >
            </yp-promotion-settings>`)}
          `;
        default:
          return html`
            <p>Page not found try going to <a href="#main">Main</a></p>
          `;
      }
    } else {
      return html`<yp-ai-chat></yp-ai-chat>`;
    }
  }

  renderTopBar() {
    return html`
      <div class="layout vertical center-center">
        <div class="layout horizontal topAppBar">
          <div class="layout horizontal headerContainer">
            <div class="analyticsHeaderText layout horizontal center-center">
              <div>
                <img class="collectionLogoImage" src="" />
              </div>
              <div>Hackathon template</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  renderNavigationBar() {
    if (this.wide) {
      return html`
        <md-navigation-drawer opened>
          <div class="layout horizontal headerContainer">
            <div class="analyticsHeaderText layout horizontal center-center">
              <div>
                <yp-image
                  class="collectionLogoImage"
                  sizing="contain"
                  src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/YpLogos/YourPriorites-Trans-Wide.png"
                ></yp-image>
              </div>
              <div></div>
            </div>
          </div>

          <md-list>
            <md-list-item
              class="${this.pageIndex == 1 && 'selectedContainer'}"
              @click="${() => (this.pageIndex = 1)}"
              headline="${this.t('Analytics')}"
              supportingText="${this.t('Historical and realtime')}"
            >
              <md-list-item-icon slot="start">
                <md-icon>insights</md-icon>
              </md-list-item-icon></md-list-item
            >
            <md-list-item
              class="${this.pageIndex == 2 && 'selectedContainer'}"
              @click="${() => (this.pageIndex = 2)}"
              headline="${this.t('Promotion')}"
              supportingText="${this.collectionType == 'posts'
                ? this.t('Promote your idea')
                : this.t('Promote your project')}"
            >
              <md-list-item-icon slot="start"
                ><md-icon>ads_click</md-icon></md-list-item-icon
              ></md-list-item
            >
            <md-list-item
              class="${this.pageIndex == 3 && 'selectedContainer'}"
              @click="${() => (this.pageIndex = 3)}"
              ?hidden="${this.collectionType == 'posts'}"
              headline="${this.t('Email Templates')}"
              supportingText="${this.t('Send promotional emails')}"
            >
              <md-list-item-icon slot="start"
                ><md-icon
                  ><span class="material-symbols-outlined"
                    >schedule_send</span
                  ></md-icon
                ></md-list-item-icon
              ></md-list-item
            >
            <md-list-item
              class="${this.pageIndex == 4 && 'selectedContainer'}"
              @click="${() => (this.pageIndex = 4)}"
              ?hidden="${this.collectionType == 'posts'}"
              headline="${this.t('AI Analysis')}"
              supportingText="${this.t('Text analysis with AI')}"
            >
              <md-list-item-icon slot="start"
                ><md-icon>document_scanner</md-icon></md-list-item-icon
              ></md-list-item
            >
            <md-list-divider></md-list-divider>
            <md-list-item
              class="${this.pageIndex == 5 && 'selectedContainer'}"
              @click="${() => (this.pageIndex = 5)}"
              headline="${this.t('Setting')}"
              supportingText="${this.t('Theme, language, etc.')}"
            >
              <md-list-item-icon slot="start"
                ><md-icon>settings</md-icon></md-list-item-icon
              ></md-list-item
            >
            <md-list-item
              headline="${this.t('Exit')}"
              supportingText="${this.t('Exit back to project')}"
              @click="${this.exitToMainApp}"
            >
              <md-list-item-icon slot="start"
                ><md-icon>arrow_back</md-icon></md-list-item-icon
              ></md-list-item
            >
            <div class="layout horizontal center-center">
              <div>
                <img
                  class="ypLogo"
                  height="65"
                  alt="Your Priorities Logo"
                  src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/YpLogos/YourPriorites-Trans-Wide.png"
                />
              </div>
            </div>
          </md-list>
        </md-navigation-drawer>
      `;
    } else {
      return html`
        <div class="navContainer">
          <md-navigation-bar @navigation-bar-activated="${this.tabChanged}">
            <md-navigation-tab .label="${this.t('Analytics')}"
              ><md-icon slot="activeIcon">insights</md-icon>
              <md-icon slot="inactiveIcon">insights</md-icon></md-navigation-tab
            >
            <md-navigation-tab .label="${this.t('Campaign')}">
              <md-icon slot="activeIcon">ads_click</md-icon>
              <md-icon slot="inactiveIcon">ads_click</md-icon>
            </md-navigation-tab>
            <md-navigation-tab .label="${this.t('Settings')}">
              <md-icon slot="activeIcon">settings</md-icon>
              <md-icon slot="inactiveIcon">settings</md-icon>
            </md-navigation-tab>
          </md-navigation-bar>
        </div>
      `;
    }
  }

  render() {
    return html`<yp-posts-dialog id="postsDialogs"></yp-posts-dialog
      ><yp-chat-assistant></yp-chat-assistant>`;
  }

  renderOld() {
    return html` <div class="mainPageContainer">${this._renderPage()}</div> `;
  }
}
