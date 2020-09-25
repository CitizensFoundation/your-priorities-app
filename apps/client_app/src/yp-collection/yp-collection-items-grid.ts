import {
  property,
  html,
  css,
  customElement,
  TemplateResult,
} from 'lit-element';

import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { YpIronListHelpers } from '../@yrpri/YpIronListHelpers.js';
import { YpCollectionHelpers } from '../@yrpri/YpCollectionHelpers.js';
import { scroll } from 'lit-virtualizer/lib/scroll.js';
import { Layout1d, LitVirtualizer } from 'lit-virtualizer';

import { YpCollectionItemCard } from './yp-collection-item-card.js';
import { YpServerApi } from '../@yrpri/YpServerApi.js';
import { ifDefined } from 'lit-html/directives/if-defined';
import { nothing } from 'lit-html';
import './yp-collection-item-card.js';

@customElement('yp-collection-items-grid')
export class YpCollectionItemsGrid extends YpBaseElement {
  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: Array })
  collectionItems: Array<YpCollectionData> | undefined;

  @property({ type: String })
  collectionItemType!: string;

  @property({ type: Array })
  sortedCollectionItems: Array<YpCollectionData> | undefined;

  resetListSize: Function | undefined;
  skipIronListWidth = false;

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        .card {
          padding: 0;
          padding-top: 24px;
          width: 100%;
        }

        .card[wide-padding] {
          padding: 16px !important;
        }

        a {
          text-decoration: none;
          width: 100%;
        }
      `,
    ];
  }

  render() {
    return this.sortedCollectionItems
      ? html`
          <lit-virtualizer
            id="list"
            role="main"
            aria-label="${this.t(this.pluralItemType)}"
            .items="${this.sortedCollectionItems}"
            .layout="${Layout1d}"
            .scrollTarget="${window}"
            .keyFunction="${(item: YpCollectionData) => item.id}"
            .renderItem="${this.renderItem.bind(this)}"></lit-virtualizer>
        `
      : nothing;
  }

  renderItem(item: YpCollectionData, index: number): TemplateResult {
    return html` <yp-collection-item-card
      class="card"
      aria-label="${item.name}"
      aria-role="listitem"
      .item="${item}"
      @keypress="${this._keypress.bind(this)}"
      @click="${this._selectedItemChanged.bind(
        this
      )}"></yp-collection-item-card>`;
  }

  get pluralItemType() {
    if (this.collectionItemType=='community') {
      return 'communities';
    } else if (this.collectionItemType=='group') {
      return 'groups';
    } else if (this.collectionItemType=='post') {
      return 'posts';
    } else {
      return 'unknownItemType';
    }
  }

  _keypress(event: KeyboardEvent) {
    if (event.keyCode==13) {
      this._selectedItemChanged(event as unknown as CustomEvent);
    }
  }

  async refresh() {}

  firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
    super.firstUpdated(changedProperties);
    YpIronListHelpers.attachListeners(this as YpElementWithIronList);
  }

  async connectedCallback() {
    super.connectedCallback();
    if (this.collection && this.collectionItems) {
      const splitCommunities = YpCollectionHelpers.splitByStatus(
        this.collectionItems,
        this.collection.configuration
      );

      //TODO: Revisit this, needed for lit-virtualizer to work with the cache directive
      this.sortedCollectionItems = undefined;
      await this.requestUpdate();

      this.sortedCollectionItems = splitCommunities.featured.concat(
        splitCommunities.active.concat(splitCommunities.archived)
      );
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    YpIronListHelpers.detachListeners(this as YpElementWithIronList);
  }

  // TODO: Make sure this fires each time on keyboard, mouse & phone - make sure back key on browser works also just with the A
  _selectedItemChanged(event: CustomEvent) {
    const item = (event.target as YpCollectionItemCard).item;

    if (this.collectionItemType && item) {
      window.appGlobals.activity(
        'open',
        this.collectionItemType,
        `/${this.collectionItemType}/${item.id}`,
        { id: item.id }
      );

      if (this.collectionItemType === 'community') {
        const community = item as YpCommunityData;
        window.appGlobals.cache.backToDomainCommunityItems[
          community.domain_id
        ] = community;
      } else if (this.collectionItemType === 'group' && item) {
        const group = item as YpGroupData;
        window.appGlobals.cache.backToCommunityGroupItems[
          group.community_id
        ] = group;
        window.appGlobals.cache.groupItemsCache[group.id] = group;
      }
    }
  }

  get _scrollOffset() {
    const list = this.$$('#ironList');
    if (list) {
      let offset = list.offsetTop;
      offset -= 100;
      if (!this.wide) offset += 75;
      if (list.offsetTop > 0 && offset > 0) {
        console.info('Community list scroll offset: ' + offset);
        return offset;
      } else {
        if (this.wide) offset = 390;
        else offset = 610;
        console.info('Community list (manual) scroll offset: ' + offset);
        return offset;
      }
    } else {
      console.warn('No community list for scroll offset');
      return null;
    }
  }

  scrollToItem(item: YpDatabaseItem | undefined) {
    if (item && this.sortedCollectionItems) {
      for (let i = 0; i < this.sortedCollectionItems.length; i++) {
        if (this.sortedCollectionItems[i] == item) {
          (this.$$('#list') as LitVirtualizer<any, any>).scrollToIndex(i);
          break;
        }
      }
      this.fireGlobal('yp-refresh-activities-scroll-threshold');
    } else {
      console.error('No item to scroll too');
    }
  }
}
