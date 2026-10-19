import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpOrganizationEdit } from '../yp-organization-edit.js';
import '../yp-organization-edit.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpOrganizationEdit', () => {
  let element: YpOrganizationEdit;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-organization-edit></yp-organization-edit>
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
  // - clear()
  // - setup()
  // - setupTranslation()
});
