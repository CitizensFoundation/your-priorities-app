import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAdminConfigDomain } from '../yp-admin-config-domain.js';
import '../yp-admin-config-domain.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAdminConfigDomain', () => {
  let element: YpAdminConfigDomain;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-admin-config-domain></yp-admin-config-domain>
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
  // - renderHeader()
  // - renderHiddenInputs()
  // - _collectionIdChanged()
  // - _setupTranslations()
  // - _finishRedirect()
});
