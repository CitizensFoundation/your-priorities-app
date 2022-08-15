import * as storage from '../../util/storage.js';
import * as url from '../../util/url.js';
import * as api from '../../api.js';
import ListReport from './../reports/list.js';
import { customElement, property } from 'lit/decorators.js';
import { PlausibleBaseElement } from '../../pl-base-element.js';
import { html } from 'lit';

@customElement('pl-pages')
export class PlausablePages extends PlausibleBaseElement {
  @property({ type: Object })
  query!: PlausibleQueryData;

  @property({ type: Object })
  site!: PlausibleSiteData;

  @property({ type: String })
  tabKey!: string;

  @property({ type: Number })
  collectionId!: number;

  @property({ type: String })
  collectionType!: string;

  @property({ type: String })
  storedTab: string | undefined;

  @property({ type: String })
  timer!: any;

  constructor() {
    super();
    this.tabKey = `pageTab__${this.site.domain}`;
    this.state = {
      mode: this.storedTab || 'pages',
    };
  }

  setMode(mode: string) {
    return () => {
      storage.setItem(this.tabKey, mode);
      this.updateState({ mode });
    };
  }

  labelFor = {
    'pages': 'Top Pages',
    'entry-pages': 'Entry Pages',
    'exit-pages': 'Exit Pages',
  };

  renderContent() {
    switch (this.state.mode) {
      case 'entry-pages':
        return html`<pl-entry-pages
          .site=${this.site}
          .query=${this.query}
          .timer=${this.timer}
        ></pl-entry-pages>`;
      case 'exit-pages':
        return html`<pl-exit-pages
          .site=${this.site}
          .query=${this.query}
          .timer=${this.timer}
        ></pl-exit-pages>`;
      case 'pages':
      default:
        return html`<pl-top-pages
          .site=${this.site}
          .query=${this.query}
          .timer=${this.timer}
        ></pl-top-pages>`;
    }
  }

  renderPill(name: string, mode: string) {
    const isActive = this.state.mode === mode;

    if (isActive) {
      return html`
        <li
          class="inline-block h-5 text-indigo-700 dark:text-indigo-500 font-bold active-prop-heading"
        >
          ${name}
        </li>
      `;
    } else {
      return html`
        <li
          class="hover:text-indigo-600 cursor-pointer"
          @click=${() => this.setMode(mode)}
        >
          ${name}
        </li>
      `;
    }
  }

  render() {
    return html`
      <div class="stats-item flex flex-col w-full mt-6 stats-item--has-header">
        <div
          class="stats-item-header flex flex-col flex-grow bg-white dark:bg-gray-825 shadow-xl rounded p-4 relative"
        >
          <div class="w-full flex justify-between">
            <h3 class="font-bold dark:text-gray-100">
              ${this.labelFor[this.state.mode] || 'Page Visits'}
            </h3>
            <ul
              class="flex font-medium text-xs text-gray-500 dark:text-gray-400 space-x-2"
            >
              ${this.renderPill('Top Pages', 'pages')}
              ${this.renderPill('Entry Pages', 'entry-pages')}
              ${this.renderPill('Exit Pages', 'exit-pages')}
            </ul>
          </div>
          ${this.renderContent()}
        </div>
      </div>
    `;
  }
}
