/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpLogin } from '../yp-login.js';
import '../yp-login.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpLogin', () => {
  let element: YpLogin;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const domain = {
      id: 1,
      name: 'Betri Reykjavik Test',
      description: '',
      counter_posts: 10,
      counter_points: 11, 
      counter_users: 12,
    } as YpDomainData;

    element = await fixture(html`
      <yp-login
        .domain="${domain}">
    </yp-login>
    `);
  });
  
  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
