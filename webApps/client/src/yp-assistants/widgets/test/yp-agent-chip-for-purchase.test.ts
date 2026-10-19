import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAgentChipForPurchase } from '../yp-agent-chip-for-purchase.js';
import '../yp-agent-chip-for-purchase.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('YpAgentChipForPurchase', () => {
  let element: YpAgentChipForPurchase;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-agent-chip-for-purchase></yp-agent-chip-for-purchase>
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
  // - getSubscribedStatus()
});
