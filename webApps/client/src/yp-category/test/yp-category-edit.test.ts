import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpCategoryEdit } from '../yp-category-edit.js';
import '../yp-category-edit.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpCategoryEdit', () => {
  let element: YpCategoryEdit;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-category-edit></yp-category-edit>
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
  // - _deleteCategory()
  // - _reallyDeleteCategory()
  // - setup()
  // - setupTranslation()
});
