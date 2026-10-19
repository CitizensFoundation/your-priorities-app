import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AoiSurveyAnalysis } from '../aoi-survey-analysis.js';
import '../aoi-survey-analysis.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('AoiSurveyAnalysis', () => {
  let element: AoiSurveyAnalysis;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <aoi-survey-analysis></aoi-survey-analysis>
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
  // - renderStreamingAnalysis()
  // - renderAnalysis()
});
