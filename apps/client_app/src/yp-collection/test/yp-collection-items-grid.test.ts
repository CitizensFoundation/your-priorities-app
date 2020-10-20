/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpCollectionItemsGrid } from '../yp-collection-items-grid.js';
import '../yp-collection-items-grid.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpCollectionItemsGrid', () => {
  let element: YpCollectionItemsGrid;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const collectionType = 'domain';

    const domain = {
      id: 1,
      name: 'Betri Reykjavik Test',
      description: '',
      counter_posts: 10,
      counter_points: 11,
      counter_users: 12,
    } as YpDomainData;

    element = await fixture(html`
      <yp-collection-items-grid
        .collection="${domain}"
        .collectionType="${collectionType}"></yp-collection-items-grid>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
