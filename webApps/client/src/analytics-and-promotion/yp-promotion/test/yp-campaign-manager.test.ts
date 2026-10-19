import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpCampaignManager } from '../yp-campaign-manager.js';
import '../yp-campaign-manager.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('YpCampaignManager', () => {
  let element: YpCampaignManager;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-campaign-manager></yp-campaign-manager>
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
  // - newCampaign()
  // - getTrackingUrl()
  // - createCampaign()
  // - campaignConfigurationUpdated()
  // - getCampaigns()
  // - reallyDeleteCampaign()
});
