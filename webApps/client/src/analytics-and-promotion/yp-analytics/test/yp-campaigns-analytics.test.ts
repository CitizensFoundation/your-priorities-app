import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpCampaignsAnalytics } from '../yp-campaigns-analytics.js';
import '../yp-campaigns-analytics.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('YpCampaignsAnalytics', () => {
  let element: YpCampaignsAnalytics;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-campaigns-analytics></yp-campaigns-analytics>
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
  // - getCampaigns()
  // - getSourceData()
  // - renderCampaign()
});
