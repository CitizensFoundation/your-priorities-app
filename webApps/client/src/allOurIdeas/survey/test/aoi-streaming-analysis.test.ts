import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AoiStreamingAnalysis } from '../aoi-streaming-analysis.js';
import '../aoi-streaming-analysis.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('AoiStreamingAnalysis', () => {
  let element: AoiStreamingAnalysis;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <aoi-streaming-analysis></aoi-streaming-analysis>
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
  // - streamAnalysis()
  // - renderChoice()
  // - addChatBotElement()
});
