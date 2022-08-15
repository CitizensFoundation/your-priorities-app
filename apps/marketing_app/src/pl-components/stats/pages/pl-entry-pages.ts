import * as storage from '../../util/storage.js';
import * as url from '../../util/url.js';
import * as api from '../../api.js';
import ListReport from './../reports/list.js';
import { customElement, property } from 'lit/decorators.js';
import { PlausibleBaseElement } from '../../pl-base-element.js';
import { html } from 'lit';
import { PlausableBasePages } from './pl-base-pages.js';

@customElement('pl-entry-pages')
export class PlausableEntryPages extends PlausableBasePages {
  constructor() {
    super();
    this.pagePath = '/entry-pages';
  }

  render() {
    return html`
      <pl-list-report
        .fetchData=${this.fetchData}
        .filter=${{ entry_page: 'name' }}
        keyLabel="Entry page"
        valueLabel="Unique Entrances"
        valueKey="unique_entrances"
        .detailsLink=${url.sitePath(this.site, this.pagePath)}
        .query=${this.query}
        .externalLinkDest=${this.externalLinkDest}
        color="bg-orange-50"
      ></pl-list-report>
    `;
  }
}
