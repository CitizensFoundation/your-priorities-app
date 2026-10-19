import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpFraudManagement } from '../yp-fraud-management.js';
import '../yp-fraud-management.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpFraudManagement', () => {
  let element: YpFraudManagement;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-fraud-management></yp-fraud-management>
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
  // - _onActiveItemChanged()
  // - _selectedItemsChanged()
  // - renderKey()
  // - renderItemDetail()
  // - renderSelectedActionHeader()
});
