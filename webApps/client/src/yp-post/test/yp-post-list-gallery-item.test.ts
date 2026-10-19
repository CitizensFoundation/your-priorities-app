import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostListGalleryItem } from '../yp-post-list-gallery-item.js';
import '../yp-post-list-gallery-item.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostListGalleryItem', () => {
  let element: YpPostListGalleryItem;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-post-list-gallery-item></yp-post-list-gallery-item>
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
  // - renderShare()
  // - _savePostToBackCache()
  // - _stopCardActivation()
  // - clickOnA()
  // - goToPostIfNotHeader()
});
