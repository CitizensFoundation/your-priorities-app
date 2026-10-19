import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpOrganizationGrid } from '../yp-organization-grid.js';
import '../yp-organization-grid.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpOrganizationGrid', () => {
  let element: YpOrganizationGrid;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-organization-grid></yp-organization-grid>
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
  // - refresh()
  // - _deleteOrganization()
  // - _reallyDeleteOrganization()
  // - _afterEdit()
  // - _createOrganization()
  // - _editOrganization()
});
