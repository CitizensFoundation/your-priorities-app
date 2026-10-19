import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausibleTopStats } from '../pl-top-stats.js';
import '../pl-top-stats.js';
import { YpTestHelpers } from '../../../../../common/test/setup-app.js';

describe('PlausibleTopStats', () => {
  let element: PlausibleTopStats;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-top-stats></pl-top-stats>
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
  // - renderComparison()
  // - topStatNumberShort()
  // - topStatTooltip()
  // - titleFor()
  // - renderStat()
});
