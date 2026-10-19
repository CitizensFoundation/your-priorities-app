import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AoiSurveyResuls } from '../aoi-survey-results.js';
import '../aoi-survey-results.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('AoiSurveyResuls', () => {
  let element: AoiSurveyResuls;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <aoi-survey-results></aoi-survey-results>
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
  // - fetchResults()
  // - toggleScores()
  // - renderRow()
});
