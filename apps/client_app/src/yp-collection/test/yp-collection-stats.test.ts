/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpCollectionStats } from '../yp-collection-stats.js';
import '../yp-collection-stats.js';
import { YpTestHelpers } from '../../../test/setup-app.js';

describe('YpCollectionStats', () => {
  let element: YpCollectionStats;

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
      <yp-collection-stats
        .collection="${domain}"
        .collectionType="${collectionType}"></yp-collection-stats>
    `);
  });

  it('renders 3 icons', () => {
    const allIcons = element.shadowRoot!.querySelectorAll('mwc-icon')!;
    expect(allIcons.length).to.equal(3);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
