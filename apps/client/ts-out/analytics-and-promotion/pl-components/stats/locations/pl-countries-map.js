var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property } from 'lit/decorators.js';
import { html, nothing } from 'lit';
import * as api from '../../api.js';
import '../reports/pl-list-report.js';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';
import { navigateToQuery } from '../../query.js';
let PlausableCountriesMap = class PlausableCountriesMap extends PlausibleBaseElementWithState {
    constructor() {
        super();
        this.loading = true;
        this.darkTheme = false;
        this.defaultFill = "#038bff";
        this.resizeMap = this.resizeMap.bind(this);
        this.drawMap = this.drawMap.bind(this);
        this.getDataset = this.getDataset.bind(this);
        this.darkTheme =
            document.querySelector('html').classList.contains('dark') || false;
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.timer)
            this.timer.onTick(this.updateCountries.bind(this));
    }
    updated(changedProperties) {
        if (changedProperties.get('query')) {
            this.loading = true;
            this.countries = undefined;
            this.fetchCountries();
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('resize', this.resizeMap);
    }
    firstUpdated() {
        this.fetchCountries();
        window.addEventListener('resize', this.resizeMap);
    }
    getDataset() {
        const a = false;
        const dataset = {};
        if (this.countries) {
            var onlyValues = this.countries.map(function (obj) {
                return obj.visitors;
            });
            var maxValue = Math.max.apply(null, onlyValues);
            // eslint-disable-next-line no-undef @ts-ignore
            //@ts-ignore
            const paletteScale = d3.scaleLinear()
                .domain([0, maxValue])
                //@ts-ignore
                .range([this.darkTheme ? '#2e3954' : '#f3ebff', this.darkTheme ? '#6366f1' : '#a779e9']);
            this.countries.forEach(function (item) {
                //@ts-ignore
                dataset[item.alpha_3] = {
                    numberOfThings: item.visitors,
                    fillColor: paletteScale(item.visitors),
                };
            });
        }
        return dataset;
    }
    updateCountries() {
        this.fetchCountries().then(() => {
            // Assuming `this.countries` is updated by `fetchCountries`
            const dataset = this.getDataset();
            // Select all country paths and update their colors
            d3.select(this.$$('#map-container')).selectAll('path.country')
                .attr('fill', d => {
                // Assuming `d.id` is the country identifier that matches keys in your dataset
                //@ts-ignore
                const countryData = dataset[d.id];
                return countryData ? countryData.fillColor : this.defaultFill;
            });
        });
    }
    fetchCountries() {
        return api.get(this.proxyUrl, `/api/stats/${encodeURIComponent(this.site.domain)}/countries`, this.query, { limit: 300 })
            .then(async (res) => {
            this.loading = false;
            this.countries = res;
            await this.updateComplete;
            this.drawMap();
        });
    }
    resizeMap() {
        this.map && this.map.resize();
    }
    drawMap() {
        const dataset = this.getDataset();
        const label = this.query.period === 'realtime' ? this.t('Current visitors') : this.t('Visitors');
        const defaultFill = this.darkTheme ? '#2d3747' : '#f8fafc';
        const highlightFill = this.darkTheme ? '#374151' : '#F5F5F5';
        const borderColor = this.darkTheme ? '#1f2937' : '#dae1e7';
        const highlightBorderColor = this.darkTheme ? '#4f46e5' : '#a779e9';
        // Fetch the TopoJSON file for the world countries
        d3.json('/topo/world.json').then((world) => {
            const countries = topojson.feature(world, world.objects.countries).features;
            //@ts-ignore
            const communityion = d3.geoMercator();
            //@ts-ignore
            const pathGenerator = d3.geoPath().communityion(communityion);
            const svg = d3.select(this.$$('#map-container')).append('svg');
            svg.selectAll('path')
                .data(countries)
                .enter()
                .append('path')
                .attr('d', (d) => pathGenerator(d))
                .attr('class', 'country')
                .attr('fill', (d) => dataset[d.id]?.fillColor ?? defaultFill)
                .attr('stroke', borderColor)
                .on('mouseover', (event, d) => {
                d3.select(event.target)
                    .attr('fill', dataset[d.id]?.fillColor ?? highlightFill)
                    .attr('stroke', highlightBorderColor);
                // Show tooltip (implement tooltip logic here)
            })
                .on('mouseout', (event, d) => {
                d3.select(event.target)
                    .attr('fill', dataset[d.id]?.fillColor ?? defaultFill)
                    .attr('stroke', borderColor);
                // Hide tooltip
            })
                .on('click', (d) => {
                const country = this.countries?.find(c => c.alpha_3 === d.id);
                if (country) {
                    this.onClick();
                    //@ts-ignore
                    navigateToQuery(this.history, this.query, {
                        //@ts-ignore
                        country: country.code,
                        //@ts-ignore
                        country_name: country.name,
                    });
                }
            });
        });
    }
    onClick() {
    }
    geolocationDbNotice() {
        if (this.site.isDbip) {
            return html `
        <span class="text-xs text-gray-500 absolute bottom-4 right-3"
          >IP Geolocation by
          <a
            target="_blank"
            href="https://db-ip.com"
            rel="noreferrer"
            class="text-indigo-600"
            >DB-IP</a
          ></span
        >
      `;
        }
        return null;
    }
    renderBody() {
        if (this.countries) {
            return html `
        <div
          class="mx-auto mt-4"
          style="overflow: hidden; width: 100%; max-width: 475px; height: 335px"
          id="map-container"
        ></div>
        <pl-more-link
          .site=${this.site}
          .list=${this.countries}
          endpoint="countries"
        ></pl-more-link>
        ${this.geolocationDbNotice()}
      `;
        }
        return null;
    }
    render() {
        return html `
      ${this.loading
            ? html `<div class="mx-auto my-32 loading"><div></div></div>`
            : nothing}
      <pl-fade-in .show=${!this.loading}> ${this.renderBody()} </pl-fade-in>
    `;
    }
};
__decorate([
    property({ type: Array })
], PlausableCountriesMap.prototype, "countries", void 0);
__decorate([
    property({ type: Boolean })
], PlausableCountriesMap.prototype, "loading", void 0);
__decorate([
    property({ type: Boolean })
], PlausableCountriesMap.prototype, "darkTheme", void 0);
__decorate([
    property({ type: Object })
], PlausableCountriesMap.prototype, "history", void 0);
__decorate([
    property({ type: Object })
], PlausableCountriesMap.prototype, "map", void 0);
PlausableCountriesMap = __decorate([
    customElement('pl-countries-map')
], PlausableCountriesMap);
export { PlausableCountriesMap };
//# sourceMappingURL=pl-countries-map.js.map