import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AoiGenerateAiLogos } from '../aoiGenerateAiLogos.js';
import '../aoiGenerateAiLogos.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('AoiGenerateAiLogos', () => {
  let element: AoiGenerateAiLogos;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <aoi-generate-ai-logos></aoi-generate-ai-logos>
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
  // - hexToColorDescription()
  // - generateImage()
  // - generateIcon()
});
