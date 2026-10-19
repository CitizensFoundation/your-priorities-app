import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PsAgentNode } from '../ps-agent-node.js';
import '../ps-agent-node.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('PsAgentNode', () => {
  let element: PsAgentNode;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <ps-agent-node></ps-agent-node>
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
  // - saveMemoryToFile()
  // - triggerFileInput()
  // - handleFileSelect()
  // - confirmLoadMemory()
  // - loadMemoryFromContent()
});
