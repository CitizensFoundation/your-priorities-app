/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpCollectionHeader } from '../yp-collection-header.js';
import '../yp-collection-header.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpCollectionHeader', () => {
  let element: YpCollectionHeader;

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
      <yp-collection-header
        .collection="${domain}"
        .collectionType="${collectionType}"></yp-collection-header>
    `);
    await aTimeout(100);
  });
  
  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
