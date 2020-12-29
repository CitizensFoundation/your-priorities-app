/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpBulkStatusUpdateTemplates } from '../yp-bulk-status-update-templates.js';
import '../yp-bulk-status-update-templates.js';
import { YpTestHelpers } from '../../@yrpri/common/test/setup-app.js';


describe('YpBulkStatusUpdateTemplates', () => {
  let element: YpBulkStatusUpdateTemplates;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
   
    element = await fixture(html`
      <yp-bulk-status-templates
        headerText="BLAHHA"
      ></yp-bulk-status-templates>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
