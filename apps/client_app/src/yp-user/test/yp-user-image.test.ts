/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpUserImage } from '../yp-user-image.js';
import '../yp-user-image.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpUserImage', () => {
  let element: YpUserImage;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const user = {
        id: 1,
        name: 'YURR'
      } as YpUserData

    element = await fixture(html`
      <yp-login
        .user="${user}">
    </yp-login>
    `);
  });
  
  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
