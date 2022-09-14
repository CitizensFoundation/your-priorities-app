import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { PlausibleBaseElement } from '../../pl-base-element';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state';
import { ChevronDownIcon } from '../../pl-icons';
import * as storage from '../../util/storage.js';

export const UTM_TAGS = {
  utm_medium: {
    label: 'UTM Medium',
    shortLabel: 'UTM Medium',
    endpoint: 'utm_mediums',
  },
  utm_source: {
    label: 'UTM Source',
    shortLabel: 'UTM Source',
    endpoint: 'utm_sources',
  },
  utm_campaign: {
    label: 'UTM Campaign',
    shortLabel: 'UTM Campai',
    endpoint: 'utm_campaigns',
  },
  utm_content: {
    label: 'UTM Content',
    shortLabel: 'UTM Conten',
    endpoint: 'utm_contents',
  },
  utm_term: {
    label: 'UTM Term',
    shortLabel: 'UTM Term',
    endpoint: 'utm_terms',
  },
} as PlausibleUtmTagsData;

export class PlausibleSourcesBase extends PlausibleBaseElementWithState {
  @property({ type: String })
  tab!: PlausibleSourcesTabOptions;

  @property({ type: Array })
  referrers: PlausibleReferrerData[] | undefined;

  @property({ type: Boolean })
  loading = false;

  fetchReferrers() {}

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.has('tab')) {
      this.fire('tab-changed', this.tab);
    }

    if (changedProperties.has('tab') || changedProperties.get('query')) {
      this.fetchReferrers();
    }
  }

  get label() {
    if (this.query.period === 'realtime') {
      return this.t('Current visitors');
    }

    if (this.showConversionRate) {
      return this.t('Conversions');
    }

    return this.t('Visitors');
  }

  get showConversionRate() {
    return !!this.query.filters?.goal;
  }

  get showNoRef() {
    return this.query.period === 'realtime';
  }

  setTab(tab: PlausibleSourcesTabOptions) {
    this.tab = tab;
  }

  faviconUrl(referrer: string) {
    if (this.proxyFaviconBaseUrl) {
      return `${this.proxyFaviconBaseUrl}${encodeURIComponent(referrer)}`
    } else {
      return `/favicon/sources/${encodeURIComponent(referrer)}`
    }
  }

  renderTabs() {
    return nothing;
    /*const activeClass =
      'inline-block h-5 text-indigo-700 dark:text-indigo-500 font-bold active-prop-heading truncate text-left';
    const defaultClass =
      'hover:text-indigo-600 cursor-pointer truncate text-left';
    const dropdownOptions = [
      'utm_medium',
      'utm_source',
      'utm_campaign',
      'utm_term',
      'utm_content',
    ];
    let buttonText = UTM_TAGS[this.tab]
      ? UTM_TAGS[this.tab].label
      : 'Campaigns';

    return html`
          <div class="flex text-xs font-medium text-gray-500 dark:text-gray-400 space-x-2">
        <div class=${
          this.tab === 'all' ? activeClass : defaultClass
        } @click=${() => this.setTab('all')}>All</div>

        <Menu as="div" class="relative inline-block text-left">
          <div>
            <Menu.Button class="inline-flex justify-between focus:outline-none">
              <span style={{ width: '4.2rem' }} class={this.state.tab.startsWith('utm_') ? activeClass : defaultClass}>{buttonText}</span>
              <div class="-mr-1 ml-px h-4 w-4" aria-hidden="true">
                ${ChevronDownIcon}
              </div>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items class="text-left origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div class="py-1">
                ${dropdownOptions.map(
                  option => html`
                <Menu.Item key={option}>
                      {({ active }) => (
                        <span
                          onClick={this.setTab(option)}
                          class={classs(
                            active ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 cursor-pointer' : 'text-gray-700 dark:text-gray-200',
                            'block px-4 py-2 text-sm',
                            this.state.tab === option ? 'font-bold' : ''
                          )}
                        >
                          ${UTM_TAGS[option].label}
                        </span>
                      )}
                    </Menu.Item>

                `
                )}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

    `;*/
  }
}
