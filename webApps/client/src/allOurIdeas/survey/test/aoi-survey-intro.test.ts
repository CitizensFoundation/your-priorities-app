import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AoiSurveyIntro } from '../aoi-survey-intro.js';
import '../aoi-survey-intro.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('AoiSurveyIntro', () => {
  let element: AoiSurveyIntro;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <aoi-survey-intro></aoi-survey-intro>
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
  // - _openAnalyticsAndPromotions()
  // - _openAdmin()
  // - renderAdminButtons()
  // - setupFooterObserver()
  // - clickStart()
});
