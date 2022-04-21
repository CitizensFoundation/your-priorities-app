/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpMarketingApp } from '../yp-marketing-app.js';
import '../yp-admin-app.js';
import { YpTestHelpers } from '../@yrpri/common/test/setup-app.js';


describe('YpMarketingApp', () => {
  let element: YpMarketingApp;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {

    element = await fixture(html`
      <yp-marketing-app
        collectionId="1"
        collectionType="domain"></yp-marketing-app>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
