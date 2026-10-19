import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpContentModeration } from '../yp-content-moderation.js';
import '../yp-content-moderation.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpContentModeration', () => {
  let element: YpContentModeration;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-content-moderation></yp-content-moderation>
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
  // - renderContent()
  // - renderItemDetail()
  // - renderActionHeader()
});
