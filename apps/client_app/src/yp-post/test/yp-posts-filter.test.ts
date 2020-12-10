/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpPostsFilter } from '../yp-posts-filter.js';
import '../yp-posts-filter.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostsFilter', () => {
  let element: YpPostsFilter;

  beforeEach(async () => {
    const group = {
        id: 1,
        name: 'Alex',
        community_id: 1,
        counter_points: 1,
        counter_users: 2,
        counter_posts: 1,
        configuration: {
          makeMapViewDefault: false
        }
      } as YpGroupData;

    element = await fixture(html`
      <yp-posts-filter
        .group="${group}"
      ></yp-posts-filter>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
