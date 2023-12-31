var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property } from 'lit/decorators.js';
import { html } from 'lit';
import * as storage from '../../util/storage.js';
import * as api from '../../api.js';
import '../reports/pl-list-report.js';
import './pl-countries-map.js';
import { apiPath, sitePath } from '../../util/url.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';
let PlausableLocations = class PlausableLocations extends PlausibleBaseElementWithState {
    connectedCallback() {
        super.connectedCallback();
        this.tabKey = `pageTab__${this.site.domain}`;
        this.mode = this.storedTab || 'map';
        if (this.timer)
            this.timer.onTick(this.renderCountries.bind(this));
    }
    setMode(mode) {
        storage.setItem(this.tabKey, mode);
        this.mode = mode;
    }
    updated(changedProperties) {
        if (changedProperties.get('query')) {
            const isRemovingFilter = (filterName) => {
                return (
                //@ts-ignore
                changedProperties.get('query').filters[filterName] &&
                    //@ts-ignore
                    !this.query.filters[filterName]);
            };
            if (this.mode === 'cities' && isRemovingFilter('region')) {
                this.setMode('regions');
            }
            if (this.mode === 'regions' && isRemovingFilter('country')) {
                this.setMode(this.countriesRestoreMode || 'countries');
            }
        }
    }
    onCountryFilter(mode) {
        this.countriesRestoreMode = mode;
        this.setMode('regions');
    }
    onRegionFilter() {
        this.setMode('cities');
    }
    renderCountries() {
        const fetchData = () => {
            return api
                .get(this.proxyUrl, apiPath(this.site, '/countries'), this.query, { limit: 9 })
                .then(res => {
                return res.map((row) => Object.assign({}, row, { percentage: undefined }));
            });
        };
        const renderIcon = (country) => {
            return html `<span class="mr-1">${country.flag}</span>`;
        };
        return html `
      <pl-list-report
        .fetchDataFunction=${fetchData}
        .filter=${{ country: 'code', country_name: 'name' }}
        @click=${() => this.onCountryFilter('countries')}
        .keyLabel=${this.t("Country")}
        .detailsLink=${sitePath(this.site, '/countries')}
        .query=${this.query}
        .timer=${this.timer}
        .renderIcon=${renderIcon}
        color="bg-orange-50"
      ></pl-list-report>
    `;
    }
    renderRegions() {
        const fetchData = () => {
            return api.get(this.proxyUrl, apiPath(this.site, '/regions'), this.query, { limit: 9 });
        };
        const renderIcon = (region) => {
            return html `<span class="mr-1">export${region.country_flag}</span>`;
        };
        return html `
      <pl-list-report
        .fetchDataFunction=${fetchData}
        .filter=${{ region: 'code', region_name: 'name' }}
        @click=${this.onRegionFilter}
        .keyLabel=${this.t("Region")}
        .detailsLink=${sitePath(this.site, '/regions')}
        .query=${this.query}
        .renderIcon=${renderIcon}
        color="bg-orange-50"
      ></pl-list-report>
    `;
    }
    renderCities() {
        const fetchData = () => {
            return api.get(this.proxyUrl, apiPath(this.site, '/cities'), this.query, {
                limit: 9,
            });
        };
        const renderIcon = (city) => {
            return html `<span class="mr-1">{city.country_flag}</span>`;
        };
        return html `
      <pl-list-report
        .fetchDataFunction=${fetchData}
        .filter=${{ city: 'code', city_name: 'name' }}
        .keyLabel=${this.t("City")}
        .detailsLink=${sitePath(this.site, '/cities')}
        .query=${this.query}
        .renderIcon=${renderIcon}
        color="bg-orange-50"
      ></pl-list-report>
    `;
    }
    get labelFor() {
        return {
            countries: 'Countries',
            regions: 'Regions',
            cities: 'Cities',
        };
    }
    renderContent() {
        switch (this.mode) {
            case 'cities':
                return this.renderCities();
            case 'regions':
                return this.renderRegions();
            case 'countries':
                return this.renderCountries();
            case 'map':
            default:
                return html `<pl-countries-map
          @click=${() => this.onCountryFilter('map')}
          .site=${this.site}
          .query=${this.query}
          .timer=${this.timer}
          .proxyUrl=${this.proxyUrl}
        ></pl-countries-map>`;
        }
    }
    renderPill(name, mode) {
        const isActive = this.mode === mode;
        if (isActive) {
            return html `
        <li
          class="inline-block h-5 text-indigo-700 dark:text-indigo-500 font-bold active-prop-heading"
        >
          ${this.t(name)}
        </li>
      `;
        }
        else {
            return html `
        <li
          class="hover:text-indigo-600 cursor-pointer"
          @click=${() => this.setMode(mode)}
        >
          ${this.t(name)}
        </li>
      `;
        }
    }
    render() {
        return html `
      <div class="stats-item flex flex-col w-full mt-6 stats-item--has-header">
        <div
          class="stats-item-header flex flex-col flex-grow bg-white dark:bg-gray-825 shadow-xl rounded p-4 relative"
        >
          <div class="w-full flex justify-between">
            <h3 class="font-bold dark:text-gray-100">
              ${
        //@ts-ignore
        this.t(this.labelFor[this.mode]) || this.t('Locations')}
            </h3>
            <ul
              class="flex font-medium text-xs text-gray-500 dark:text-gray-400 space-x-2"
            >
              ${this.renderPill('Map', 'map')}
              ${this.renderPill('Countries', 'countries')}
              ${this.renderPill('Regions', 'regions')}
              ${this.renderPill('Cities', 'cities')}
            </ul>
          </div>
          ${this.renderContent()}
        </div>
      </div>
    `;
    }
};
__decorate([
    property({ type: String })
], PlausableLocations.prototype, "tabKey", void 0);
__decorate([
    property({ type: String })
], PlausableLocations.prototype, "storedTab", void 0);
__decorate([
    property({ type: String })
], PlausableLocations.prototype, "mode", void 0);
PlausableLocations = __decorate([
    customElement('pl-locations')
], PlausableLocations);
export { PlausableLocations };
//# sourceMappingURL=pl-locations.js.map