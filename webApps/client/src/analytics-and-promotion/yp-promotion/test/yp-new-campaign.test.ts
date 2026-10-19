import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpNewCampaign } from '../yp-new-campaign.js';
import '../yp-new-campaign.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('YpNewCampaign', () => {
  let element: YpNewCampaign;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-new-campaign></yp-new-campaign>
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
  // - open()
  // - getMediums()
  // - inputsChanged()
  // - save()
  // - discard()
});
