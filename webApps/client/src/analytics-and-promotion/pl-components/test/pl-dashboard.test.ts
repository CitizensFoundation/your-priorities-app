import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausibleDashboard } from '../pl-dashboard.js';
import '../pl-dashboard.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('PlausibleDashboard', () => {
  let element: PlausibleDashboard;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-dashboard></pl-dashboard>
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
  // - onTick()
  // - dispatchTick()
  // - resetState()
});
