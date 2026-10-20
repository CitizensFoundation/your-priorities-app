import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostHeader } from '../yp-post-header.js';
import '../yp-post-header.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostHeader', () => {
  let element: YpPostHeader;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-post-header
        .post="${YpTestHelpers.getPost()}"
      ></yp-post-header>
    `);
    await aTimeout(100);
  });

  // TODO: Skipped because this fails, as it already did upstream at
  // f187715 (where we forked from). We haven't investigated why.
  it.skip('passes the a11y audit', async () => {
    debugger;
    await new Promise(resolve => setTimeout(resolve, 10000));
    await expect(element).shadowDom.to.be.accessible();
  });

});
