import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpTopAppBar } from '../yp-top-app-bar.js';
import '../yp-top-app-bar.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpTopAppBar', () => {
  let element: YpTopAppBar;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-top-app-bar></yp-top-app-bar>
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
  // - renderBreadcrumbsDropdown()
  // - redirectTo()
  // - renderMyDomainsDropdown()
  // - _toggleBreadcrumbMenu()
  // - _toggleDomainMenu()
});
