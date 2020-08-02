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
import 'lit-virtualizer';

import './yp-collection-item-card.js';
import { YpServerApi } from '../@yrpri/YpServerApi.js';
import { ifDefined } from 'lit-html/directives/if-defined';

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
    return html`
      <lit-virtualizer
        style="width: 100vw; height: 100vh;"
        .items=${this.sortedCollectionItems!}
        .scrollTarget="${window}"
        .renderItem=${this.renderItem}></lit-virtualizer>
    `;
  }

  renderItem(
    item: YpCollectionData,
    index?: number | undefined
  ): TemplateResult {
    return html`<div
    class="card layout vertical center-center"
    ?wide-padding="${this.wide}"
    tabindex="${ifDefined(index)}"
    role="listitem"
    aria-level="2"
    aria-label="[[item.name]]">
      <yp-collection-item-card .item="${item}"></yp-collection-item-card>
    </a>
  </div>`;
  }

  firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
    super.firstUpdated(changedProperties);
    YpIronListHelpers.attachListeners(this as YpElementWithIronList);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.collection && this.collectionItems) {
      const splitCommunities = YpCollectionHelpers.splitByStatus(
        this.collectionItems,
        this.collection.configuration
      );
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
    const item = event.detail.value;

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
    if (item) {
      (this.$$('#ironList') as IronListInterface).scrollToItem(item);
      this.fireGlobal('yp-refresh-activities-scroll-threshold');
    } else {
      console.error('No item to scroll too');
    }
  }
}
