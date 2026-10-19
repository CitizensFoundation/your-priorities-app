import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAdminConfigCommunity } from '../yp-admin-config-community.js';
import '../yp-admin-config-community.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAdminConfigCommunity', () => {
  let element: YpAdminConfigCommunity;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-admin-config-community></yp-admin-config-community>
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
  // - _generateRandomHostname()
  // - renderHostname()
  // - renderHeader()
  // - renderActionMenu()
  // - _onDeleted()
  // - _openDelete()
});
