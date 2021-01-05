/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpCollectionItemCard } from '../yp-collection-item-card.js';
import '../yp-collection-item-card.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpCollectionItemCard', () => {
  let element: YpCollectionItemCard;

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
      ${YpTestHelpers.renderCommonHeader()}
      <yp-collection-item-card
        .collection="${domain}"
        .collectionType="${collectionType}"></yp-collection-item-card>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
