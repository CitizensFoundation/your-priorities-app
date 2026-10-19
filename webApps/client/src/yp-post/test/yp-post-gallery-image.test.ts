import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostGalleryImage } from '../yp-post-gallery-image.js';
import '../yp-post-gallery-image.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostGalleryImage', () => {
  let element: YpPostGalleryImage;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-post-gallery-image></yp-post-gallery-image>
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
  // - user interactions and emitted events
  // - conditional rendering across property states
  // - API or side-effect flows
});
