/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpAdminApp } from '../yp-admin-app.js';
import '../yp-admin-app.js';
import { YpTestHelpers } from '../@yrpri/common/test/setup-app.js';


describe('YpAdminApp', () => {
  let element: YpAdminApp;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {

    element = await fixture(html`
      <yp-admin-app
        collectionId="1"
        collectionType="domain"></yp-admin-app>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
