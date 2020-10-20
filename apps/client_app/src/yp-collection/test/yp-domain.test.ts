/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpDomain } from '../yp-domain.js';
import '../yp-domain.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpDomain', () => {
  let element: YpDomain;

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
      <yp-domain
        .collection="${domain}"
        .collectionType="${collectionType}"></yp-domain>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
