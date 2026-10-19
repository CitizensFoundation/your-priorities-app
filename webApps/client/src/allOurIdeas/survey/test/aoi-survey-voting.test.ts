import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AoiSurveyVoting } from '../aoi-survey-voting.js';
import '../aoi-survey-voting.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('AoiSurveyVoting', () => {
  let element: AoiSurveyVoting;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <aoi-survey-voting></aoi-survey-voting>
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
  // - resetTimer()
  // - resetAnimation()
  // - voteForAnswer()
  // - setLabelOnMdButton()
  // - removeAndInsertFromLeft()
});
