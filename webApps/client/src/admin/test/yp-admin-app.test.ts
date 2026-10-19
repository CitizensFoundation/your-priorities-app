import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAdminApp } from '../yp-admin-app.js';
import '../yp-admin-app.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAdminApp', () => {
  let element: YpAdminApp;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-admin-app></yp-admin-app>
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
  // - updatePageFromPath()
  // - updateLocation()
  // - _pageChanged()
  // - tabChanged()
  // - _setupEventListeners()
});
