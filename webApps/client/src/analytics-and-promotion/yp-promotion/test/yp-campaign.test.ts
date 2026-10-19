import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpCampaign } from '../yp-campaign.js';
import '../yp-campaign.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('YpCampaign', () => {
  let element: YpCampaign;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-campaign></yp-campaign>
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
  // - deleteCampaign()
  // - getMediumImageUrl()
  // - activate()
  // - showMedium()
  // - cancelActivation()
  // - reallyActivate()
});
