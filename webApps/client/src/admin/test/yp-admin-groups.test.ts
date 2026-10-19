import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAdminGroups } from '../yp-admin-groups.js';
import '../yp-admin-groups.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAdminGroups', () => {
  let element: YpAdminGroups;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-admin-groups></yp-admin-groups>
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
  // - newGroup()
  // - gotoGroup()
  // - renderGroup()
});
