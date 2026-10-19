import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpSubscriptions } from '../yp-agent-subscriptions.js';
import '../yp-agent-subscriptions.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('YpSubscriptions', () => {
  let element: YpSubscriptions;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-subscriptions></yp-subscriptions>
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
  // - renderHeader()
  // - processPlanData()
  // - handleProductSelect()
  // - renderAgent()
  // - initializeStripe()
});
