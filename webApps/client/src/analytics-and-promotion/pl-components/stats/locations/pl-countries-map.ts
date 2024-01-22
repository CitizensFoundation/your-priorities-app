import { customElement, property } from 'lit/decorators.js';
import { html, nothing } from 'lit';

import * as storage from '../../util/storage.js';
import * as url from '../../util/url.js';
import * as api from '../../api.js';
import '../reports/pl-list-report.js';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

import { apiPath, sitePath } from '../../util/url.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';
import numberFormatter from '../../util/number-formatter.js';
import { navigateToQuery } from '../../query.js';
import { BrowserHistory } from '../../util/history.js';

interface TopoJSONCountries {
  type: string;
  geometries: Array<{
    type: string;
    id: string;
    properties: {
      name: string;
    };
  }>;
}

interface WorldAtlas {
  objects: {
    countries: TopoJSONCountries;
  };
}

@customElement('pl-countries-map')
export class PlausableCountriesMap extends PlausibleBaseElementWithState {
  @property({ type: Array })
  countries: PlausibleCountryData[] | undefined;

  @property({ type: Boolean })
  loading = true;

  @property({ type: Boolean })
  darkTheme = false;

  @property({ type: Object })
  history: BrowserHistory | undefined;

  @property({ type: Object })
  map: any;

  defaultFill: string = "#038bff";

  constructor() {
    super();
    this.resizeMap = this.resizeMap.bind(this);
    this.drawMap = this.drawMap.bind(this);
    this.getDataset = this.getDataset.bind(this);
    this.darkTheme =
      document!.querySelector('html')!.classList.contains('dark') || false;
  }

 override connectedCallback(): void {
    super.connectedCallback();
    if (this.timer) this.timer.onTick(this.updateCountries.bind(this));
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.get('query')) {
      this.loading = true;
      this.countries = undefined;
      this.fetchCountries();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.resizeMap);
  }

  override firstUpdated() {
    this.fetchCountries();
    window.addEventListener('resize', this.resizeMap);
  }

  getDataset() {
    const a = false;
    const dataset = {};

    if (this.countries) {
      var onlyValues = this.countries.map(function (obj: PlausibleCountryData) {
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
    return api.get(
      this.proxyUrl,
        `/api/stats/${encodeURIComponent(this.site.domain)}/countries`,
        this.query,
        { limit: 300 }
      )
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

  drawMap(): void {
    const dataset: Record<string, { fillColor: string }> = this.getDataset();
    const label: string = this.query.period === 'realtime' ? this.t('Current visitors') : this.t('Visitors');
    const defaultFill: string = this.darkTheme ? '#2d3747' : '#f8fafc';
    const highlightFill: string = this.darkTheme ? '#374151' : '#F5F5F5';
    const borderColor: string = this.darkTheme ? '#1f2937' : '#dae1e7';
    const highlightBorderColor: string = this.darkTheme ? '#4f46e5' : '#a779e9';

    // Fetch the TopoJSON file for the world countries
    d3.json<WorldAtlas>('/topo/world.json').then((world: any) => {
      const countries: any = (topojson.feature(world, world.objects.countries) as any).features;
      //@ts-ignore
      const communityion: d3.GeoCommunityion = d3.geoMercator();
      //@ts-ignore
      const pathGenerator: d3.GeoPath = d3.geoPath().communityion(communityion);

      const svg: d3.Selection<SVGSVGElement, unknown, null, undefined> = d3.select(this.$$('#map-container')).append('svg');

      svg.selectAll('path')
        .data(countries)
        .enter()
        .append('path')
        .attr('d', (d: any) => pathGenerator(d))
        .attr('class', 'country')
        .attr('fill', (d: any) => dataset[d.id]?.fillColor ?? defaultFill)
        .attr('stroke', borderColor)
        .on('mouseover', (event: MouseEvent, d: any) => {
          d3.select(event.target as SVGPathElement)
            .attr('fill', dataset[d.id]?.fillColor ?? highlightFill)
            .attr('stroke', highlightBorderColor);
          // Show tooltip (implement tooltip logic here)
        })
        .on('mouseout', (event: MouseEvent, d: any) => {
          d3.select(event.target as SVGPathElement)
            .attr('fill', dataset[d.id]?.fillColor ?? defaultFill)
            .attr('stroke', borderColor);
          // Hide tooltip
        })
        .on('click', (d: any) => {
          const country = this.countries?.find(c => c.alpha_3 === d.id);
          if (country) {
            this.onClick();
            //@ts-ignore
            navigateToQuery(this.history!, this.query, {
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
      return html`
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
      return html`
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

  override render() {
    return html`
      ${this.loading
        ? html`<div class="mx-auto my-32 loading"><div></div></div>`
        : nothing}
      <pl-fade-in .show=${!this.loading}> ${this.renderBody()} </pl-fade-in>
    `;
  }
}
