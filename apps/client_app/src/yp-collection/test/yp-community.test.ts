/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpCommunity } from '../yp-community.js';
import '../yp-community.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpCommunity', () => {
  let element: YpCommunity;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const collectionType = 'community';

    const community = {
      id: 1,
      name: 'Betri Reykjavik Test',
      description: '',
      counter_posts: 10,
      counter_points: 11,
      counter_users: 12,
      configuration: {

      }
    } as YpCommunityData;

    element = await fixture(html`
      <yp-community
        .collection="${community}"
        .collectionType="${collectionType}"></yp-community>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
