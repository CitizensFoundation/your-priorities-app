/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpUserInfo } from '../yp-user-info.js';
import '../yp-user-info.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpUserInfo', () => {
  let element: YpUserInfo;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const user = {
        id: 1,
        name: 'YURR'
      } as YpUserData

    element = await fixture(html`
      <yp-user-info
        .user="${user}">
    </yp-user-info>
    `);
  });
  
  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
