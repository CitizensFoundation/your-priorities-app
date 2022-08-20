import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { PlausibleBaseElement } from '../../pl-base-element';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state';
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

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('tab')) {
      this.fire('tab-changed', this.tab);
    }
  }

  get label() {
    if (this.query.period === 'realtime') {
      return 'Current visitors';
    }

    if (this.showConversionRate) {
      return 'Conversions';
    }

    return 'Visitors';
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

  renderTabs() {
    const activeClass =
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
          <div className="flex text-xs font-medium text-gray-500 dark:text-gray-400 space-x-2">
        <div className=${
          this.tab === 'all' ? activeClass : defaultClass
        } @click=${() => this.setTab('all')}>All</div>

        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex justify-between focus:outline-none">
              <span style={{ width: '4.2rem' }} className={this.state.tab.startsWith('utm_') ? activeClass : defaultClass}>{buttonText}</span>
              <ChevronDownIcon className="-mr-1 ml-px h-4 w-4" aria-hidden="true" />
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
            <Menu.Items className="text-left origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="py-1">
                ${dropdownOptions.map(
                  option => html`
                <Menu.Item key={option}>
                      {({ active }) => (
                        <span
                          onClick={this.setTab(option)}
                          className={classNames(
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

    `;
  }
}
