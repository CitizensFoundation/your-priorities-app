/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostLocation } from '../yp-post-location.js';
import '../yp-post-location.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostLocation', () => {
  let element: YpPostLocation;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

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
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post-location
        .group="${group}"
        .post="${YpTestHelpers.getPost()}"
      ></yp-post-location>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
