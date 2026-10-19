import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAdminModeration } from '../yp-admin-moderation.js';
import '../yp-admin-moderation.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAdminModeration', () => {
  let element: YpAdminModeration;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-admin-moderation></yp-admin-moderation>
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
  // - _tabChanged()
  // - renderContentModeration()
  // - renderSelectedPage()
});
