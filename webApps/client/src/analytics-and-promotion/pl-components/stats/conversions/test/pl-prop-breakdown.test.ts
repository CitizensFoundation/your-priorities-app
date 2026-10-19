import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PlausiblePropBreakdown } from '../pl-prop-breakdown.js';
import '../pl-prop-breakdown.js';
import { YpTestHelpers } from '../../../../../common/test/setup-app.js';

describe('PlausiblePropBreakdown', () => {
  let element: PlausiblePropBreakdown;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <pl-prop-breakdown></pl-prop-breakdown>
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
  // - handleResize()
  // - getBarMaxWidth()
  // - fetchPropBreakdown()
  // - loadMore()
  // - renderUrl()
});
