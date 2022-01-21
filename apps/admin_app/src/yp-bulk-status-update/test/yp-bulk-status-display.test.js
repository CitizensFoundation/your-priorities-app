/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpBulkStatusDisplay } from '../yp-bulk-status-display.js';
import '../yp-bulk-status-display.js';
import { YpTestHelpers } from '../../@yrpri/common/test/setup-app.js';


describe('YpBulkStatusDisplay', () => {
  let element: YpBulkStatusDisplay;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const community = {
        id: 1,
        name: 'Betri Reykjavik Test',
        description: '',
        counter_posts: 10,
        counter_points: 11,
        counter_users: 12,
        configuration: {
        }
      } as YpCommunityData

    element = await fixture(html`
      <yp-bulk-status-display
        .community="${community}"
      ></yp-bulk-status-display>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
