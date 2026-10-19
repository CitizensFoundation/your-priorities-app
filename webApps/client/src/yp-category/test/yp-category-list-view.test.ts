import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpCategoryListView } from '../yp-category-list-view.js';
import '../yp-category-list-view.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpCategoryListView', () => {
  let element: YpCategoryListView;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-category-list-view></yp-category-list-view>
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
  // - _searchKey()
  // - _search()
  // - _clearSearch()
  // - _changeFilter()
  // - _navigateToPosts()
});
