import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAdminCommunities } from '../yp-admin-communities.js';
import '../yp-admin-communities.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAdminCommunities', () => {
  let element: YpAdminCommunities;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-admin-communities></yp-admin-communities>
    `);

    await aTimeout(100);
  });

  it('renders the component', async () => {
    expect(element).to.exist;
    expect(element.shadowRoot).to.exist;
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  // TODO: Add targeted behavior tests for:
  // - newCommunity()
  // - gotoCommunity()
  // - renderCommunity()
});
