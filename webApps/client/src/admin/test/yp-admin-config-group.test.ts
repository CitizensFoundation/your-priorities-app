import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAdminConfigGroup } from '../yp-admin-config-group.js';
import '../yp-admin-config-group.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAdminConfigGroup', () => {
  let element: YpAdminConfigGroup;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-admin-config-group></yp-admin-config-group>
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
  // - _setGroupType()
  // - renderGroupTypeSelection()
  // - renderHeader()
  // - getAccessTokenName()
  // - renderHiddenInputs()
});
