import * as api from '../api';
import * as url from '../util/url';
import { appliedFilters } from '../query';
import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { PlausibleBaseElementWithState } from '../pl-base-element-with-state';

@customElement('pl-current-visitors')
export class PlausibleCurrentVisitors extends PlausibleBaseElementWithState {
  @property({ type: Number })
  currentVisitors: number | undefined;

  connectedCallback() {
    super.connectedCallback();
    this.timer.onTick(this.updateCount.bind(this));
    this.updateCount();
  }

  updateCount() {
    return api
      .get(
        this.proxyUrl,
        `/api/stats/${encodeURIComponent(this.site.domain)}/current-visitors`,
        {} as any
      )
      .then(res => {
        this.currentVisitors = res;
      });
  }

  render() {
    if (appliedFilters(this.query).length >= 1) {
      return null;
    }

    if (this.currentVisitors !== null) {
      return html`
        <pl-link
          .to=${{ search: url.setQuerySearch('period', 'realtime')}}
          class="block ml-1 md:ml-2 mr-auto text-xs md:text-sm font-bold text-gray-500 dark:text-gray-300"
        >
          <svg
            class="inline w-2 mr-1 md:mr-2 text-green-500 fill-current"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="8" />
          </svg>
          ${this.currentVisitors}
          <span class=" sm:inline-block"
            >current visitor${this.currentVisitors === 1 ? '' : 's'}</span
          >
        </pl-link>
      `;
    } else {
      return nothing;
    }
  }
}
