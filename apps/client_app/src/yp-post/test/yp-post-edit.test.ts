/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostEdit } from '../yp-post-edit.js';
import '../yp-post-edit.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostEdit', () => {
  let element: YpPostEdit;

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
      <yp-post-edit
        .group="${group}"
        .post="${YpTestHelpers.getPost()}"
      ></yp-post-edit>
    `);
    await aTimeout(100);
    element.open(true, {})
  });

  it('passes the a11y audit', async () => {
  });
});
