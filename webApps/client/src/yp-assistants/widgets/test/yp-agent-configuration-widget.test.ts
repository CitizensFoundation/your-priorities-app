import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAgentConfigurationWidget } from '../yp-agent-configuration-widget.js';
import '../yp-agent-configuration-widget.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('YpAgentConfigurationWidget', () => {
  let element: YpAgentConfigurationWidget;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-agent-configuration-widget></yp-agent-configuration-widget>
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
  // - getAgentConfiguration()
  // - getPrefillValue()
  // - submitConfiguration()
  // - sendError()
});
