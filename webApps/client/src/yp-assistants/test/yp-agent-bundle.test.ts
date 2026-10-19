import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAgentBundle } from '../yp-agent-bundle.js';
import '../yp-agent-bundle.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAgentBundle', () => {
  let element: YpAgentBundle;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-agent-bundle></yp-agent-bundle>
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
  // - renderLogo()
});
