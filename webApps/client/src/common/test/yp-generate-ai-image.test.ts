import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpGenerateAiImage } from '../yp-generate-ai-image.js';
import '../yp-generate-ai-image.js';
import { YpTestHelpers } from './setup-app.js';

describe('YpGenerateAiImage', () => {
  let element: YpGenerateAiImage;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-generate-ai-image></yp-generate-ai-image>
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
  // - resetGenerator()
  // - formatRateLimitError()
  // - pollForImage()
  // - submit()
  // - scrollUp()
});
