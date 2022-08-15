import * as storage from '../../util/storage.js';
import * as url from '../../util/url.js';
import * as api from '../../api.js';
import ListReport from './../reports/list.js';
import { property } from 'lit/decorators.js';
import { PlausibleBaseElement } from '../../pl-base-element.js';

export class PlausableBasePages extends PlausibleBaseElement {
  @property({ type: Object })
  query!: PlausibleQueryData;

  @property({ type: Object })
  site!: PlausibleSiteData;

  @property({ type: String })
  pagePath: string | undefined;

  @property({ type: Number })
  collectionId!: number;

  @property({ type: String })
  collectionType!: string;

  fetchData() {
    return api.getWithProxy(
      this.collectionType,
      this.collectionId,
      url.apiPath(this.site, this.pagePath),
      this.query,
      { limit: 9 }
    );
  }

  externalLinkDest(page: PlausiblePageData) {
    return url.externalLinkForPage(this.site.domain, page.name);
  }
}
