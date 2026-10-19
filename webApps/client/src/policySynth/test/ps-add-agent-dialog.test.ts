import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { PsAddAgentDialog } from '../ps-add-agent-dialog.js';
import '../ps-add-agent-dialog.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('PsAddAgentDialog', () => {
  let element: PsAddAgentDialog;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      <ps-add-agent-dialog></ps-add-agent-dialog>
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
  // - fetchActiveAgentClasses()
  // - fetchActiveAiModels()
  // - _handleNameInput()
  // - _handleAgentClassSelection()
  // - _handleAiModelsChanged()
});
