import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import * as storage from '../../util/storage.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state';

export class PlausibleSourcesList extends PlausibleBaseElementWithState {
  @property({ type: String })
  tabKey!: string;

  @property({ type: String })
  tab!: PlausibleSourcesTabOptions;

  constructor() {
    super();
    this.tabKey = 'sourceTab__' + this.site.domain!;
    const storedTab = storage.getItem(this.tabKey);
    this.tab = storedTab || 'all';
  }

  tabChanged(e: CustomEvent) {
    debugger;
    this.tab = e.detail.tab;
    storage.setItem(this.tabKey, this.tab);
  }

  render() {
    if (this.tab === 'all') {
      return html`
        <pl-sources-all
          .tab=${this.tab}
          .collectionId=${this.collectionId}
          .collectionType=${this.collectionType}
          .query=${this.query}
          .site=${this.site}
          @tab-changed=${this.tabChanged}
        ></pl-sources-all>
      `;
    } else {
      return html`
        <pl-sources-utm
          .tab=${this.tab}
          .collectionId=${this.collectionId}
          .collectionType=${this.collectionType}
          .query=${this.query}
          .site=${this.site}
          @tab-changed=${this.tabChanged}
        ></pl-sources-utm>
      `;
    }
  }
}
