import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAgentChipSimple } from '../yp-agent-chip-simple.js';
import '../yp-agent-chip-simple.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('YpAgentChipSimple', () => {
  let element: YpAgentChipSimple;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-agent-chip-simple></yp-agent-chip-simple>
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
