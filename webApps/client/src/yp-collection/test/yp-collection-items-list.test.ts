import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpCollectionItemsList } from '../yp-collection-items-list.js';
import '../yp-collection-items-list.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpCollectionItemsList', () => {
  let element: YpCollectionItemsList;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-collection-items-list></yp-collection-items-list>
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
  // - updateSortedCollectionItems()
  // - _selectedItemChanged()
  // - scrollToItem()
});
