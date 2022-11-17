/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpContentModeration } from '../yp-content-moderation.js';
import '../yp-content-moderation.js';
import { YpTestHelpers } from '../../@yrpri/common/test/setup-app.js';


describe('YpContentModeration', () => {
  let element: YpContentModeration;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-content-moderation
        domainId="1"
      ></yp-content-moderation>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
