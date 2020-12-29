/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpBulkStatusUpdateConfig } from '../yp-bulk-status-update-config.js';
import '../yp-bulk-status-update-config.js';
import { YpTestHelpers } from '../../@yrpri/common/test/setup-app.js';


describe('YpBulkStatusUpdateConfig', () => {
  let element: YpBulkStatusUpdateConfig;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    

    element = await fixture(html`
      <yp-bulk-status-update-config
        communityId="1"
      ></yp-bulk-status-update-config>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
