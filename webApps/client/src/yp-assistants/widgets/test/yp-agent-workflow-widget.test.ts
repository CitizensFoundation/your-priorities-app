import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAgentWorkflowWidget } from '../yp-agent-workflow-widget.js';
import '../yp-agent-workflow-widget.js';
import { YpTestHelpers } from '../../../common/test/setup-app.js';

describe('YpAgentWorkflowWidget', () => {
  let element: YpAgentWorkflowWidget;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <yp-agent-workflow-widget></yp-agent-workflow-widget>
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
  // - getStepClass()
  // - renderStep()
  // - renderIcon()
  // - renderExplanation()
});
