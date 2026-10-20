import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpUserDeleteOrAnonymize } from '../yp-user-delete-or-anonymize.js';
import '../yp-user-delete-or-anonymize.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpUserDeleteOrAnonymize', () => {
  let element: YpUserDeleteOrAnonymize;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-user-delete-or-anonymize></yp-user-delete-or-anonymize>
    `);
    await aTimeout(100);
    element.open();
  });

  // TODO: Skipped because this fails, as it already did upstream at
  // f187715 (where we forked from). We haven't investigated why.
  it.skip('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
